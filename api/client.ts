import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_ENDPOINTS } from './endpoints';

/**
 * Khởi tạo Axios Instance
 * Thay đổi EXPO_PUBLIC_API_URL trong file .env của dự án Expo để trỏ đúng server
 */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.19.68:5000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- EVENT EMITTER CHO AUTH ---
// Tạo một Event Bus đơn giản để giao tiếp giữa Axios (ngoài React) và các Hook (trong React)
export const AuthEventEmitter = {
  listeners: new Set<() => void>(),
  emit: () => AuthEventEmitter.listeners.forEach((cb) => cb()),
  subscribe: (cb: () => void) => {
    AuthEventEmitter.listeners.add(cb);
    return () => AuthEventEmitter.listeners.delete(cb);
  },
};

// --- BIẾN HỖ TRỢ REFRESH TOKEN ---
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];
let lastEmitTime = 0;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// --- INTERCEPTORS CHO REQUEST ---
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Lấy token từ SecureStore và nhét vào header Authorization
      const token = await SecureStore.getItemAsync('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Lỗi khi cấu hình header token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- INTERCEPTORS CHO RESPONSE ---
apiClient.interceptors.response.use(
  (response) => {
    // Có thể tùy chỉnh bóc tách response.data trực tiếp ở đây nếu backend luôn bọc trong trường `data`
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Đang có 1 request khác thực hiện refresh token rồi, đưa request hiện tại vào hàng đợi
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        // Đánh dấu request này đã được retry để tránh loop vô hạn
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await SecureStore.getItemAsync('refreshToken');
          if (!refreshToken) throw new Error('Không có Refresh Token trong máy');

          // Gọi API refresh token (Sử dụng 'axios' gốc thay vì 'apiClient' để tránh đi qua interceptor gây loop)
          const response = await axios.post(
            `${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
            { refreshToken }
          );

          // Giả định backend trả về format: { data: { accessToken: '...', refreshToken: '...' } }
          const newAccessToken = response.data?.data?.accessToken;
          const newRefreshToken = response.data?.data?.refreshToken;

          if (newAccessToken) {
            await SecureStore.setItemAsync('accessToken', newAccessToken);
            if (newRefreshToken) await SecureStore.setItemAsync('refreshToken', newRefreshToken);
            
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            processQueue(null, newAccessToken);
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          
          // Nếu Refresh Token cũng hết hạn / không hợp lệ -> Đăng xuất người dùng
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
          console.log('⚠️ [401] Phiên đăng nhập đã hết hạn hoàn toàn. Vui lòng đăng nhập lại.');
          
          // Phát sự kiện báo hiệu UI cần force logout
          // Throttling 2 giây để tránh bắn sự kiện liên tục gây treo máy nếu có nhiều API cùng fail
          const now = Date.now();
          if (now - lastEmitTime > 2000) {
            lastEmitTime = now;
            AuthEventEmitter.emit();
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else if (status === 403) {
        console.log('⚠️ [403] Không có quyền truy cập tài nguyên này.');
      }
      
    } else if (error.request) {
      console.warn('📡 Không thể kết nối tới server. Vui lòng kiểm tra lại đường truyền mạng.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;