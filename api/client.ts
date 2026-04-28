import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

// 1. Cấu hình Base URL
// Ưu tiên lấy từ biến môi trường (.env). 
// Nếu chạy máy ảo Android, dùng 10.0.2.2. Nếu chạy thiết bị thật/iOS, dùng IP LAN (VD: 172.26.39.88:5000)
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.26.39.88:5000';

// 2. Khởi tạo Axios Instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Timeout sau 15s nếu server không phản hồi
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. REQUEST INTERCEPTOR: Tự động gắn Token trước khi gửi API
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Lỗi khi lấy token từ SecureStore:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. RESPONSE INTERCEPTOR: Xử lý dữ liệu trả về và lỗi toàn cục
apiClient.interceptors.response.use(
  (response) => {
    // Trả về thẳng data nếu API call thành công
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Xử lý lỗi 401: Unauthorized (Token hết hạn hoặc không hợp lệ)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu để tránh bị lặp vô hạn (infinite loop)

      try {
        // Lấy Refresh Token đang lưu
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) {
          throw new Error('Không tìm thấy Refresh Token');
        }

        // Gọi API lên Backend để xin Access Token mới
        // Chú ý: Dùng axios thuần thay vì apiClient để tránh bị kẹt trong interceptor này
        const refreshResponse = await axios.post(`${BASE_URL}/api/v1/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        
        // Lưu token mới lại vào máy
        await SecureStore.setItemAsync('accessToken', newAccessToken);

        // Cập nhật lại header của request bị lỗi ban đầu và gọi lại
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Nếu Refresh Token cũng hết hạn -> Xóa hết token và đẩy user ra màn hình Login
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        router.replace('/(auth)/login'); // Đổi đường dẫn theo cấu trúc route của bạn
        return Promise.reject(refreshError);
      }
    }

    // Xử lý các lỗi khác (400, 404, 500...)
    return Promise.reject(error);
  }
);