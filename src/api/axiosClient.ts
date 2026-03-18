import axios from 'axios';
import { getToken } from '../utils/storage';

const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Quá 10s thì báo lỗi mạng
});

// Interceptor trước khi gửi Request
axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor sau khi nhận Response
axiosClient.interceptors.response.use(
  (response) => response.data, // Tự động bóc tách data, không cần .json() nữa
  async (error) => {
    // Xử lý chung các mã lỗi (VD: 401 hết hạn token thì đẩy ra trang login)
    if (error.response?.status === 401) {
       // Logic logout hoặc refresh token ở đây
    }
    return Promise.reject(error);
  }
);

export default axiosClient;