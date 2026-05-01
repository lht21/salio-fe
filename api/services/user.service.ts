import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  UserProfileResponse,
  UpdateProfileRequest,
  UpdateAvatarResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdatePreferencesRequest,
  UpdatePreferencesResponse,
  MyStatsResponse,
} from '../types/user.types';

/**
 * Service xử lý các luồng gọi API liên quan đến thông tin người dùng (Học viên).
 * Chịu trách nhiệm giao tiếp với backend thông qua apiClient.
 */
class UserService {
  /**
   * Lấy thông tin cá nhân của tài khoản đang đăng nhập
   */
  static async getMe(): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.get<UserProfileResponse>(API_ENDPOINTS.USER.GET_ME);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API getMe:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin cá nhân cơ bản (username, avatarUrl dạng system)
   */
  static async updateProfile(data: UpdateProfileRequest): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.patch<UserProfileResponse>(API_ENDPOINTS.USER.UPDATE_PROFILE, data);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API updateProfile:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Cập nhật ảnh đại diện (Hỗ trợ upload file từ React Native bằng FormData)
   */
  static async updateAvatar(formData: FormData): Promise<UpdateAvatarResponse> {
    try {
      const response = await apiClient.post<UpdateAvatarResponse>(
        API_ENDPOINTS.USER.UPDATE_AVATAR,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Ghi đè header mặc định thành multipart/form-data
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API updateAvatar:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Đổi mật khẩu
   */
  static async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      const response = await apiClient.patch<ChangePasswordResponse>(API_ENDPOINTS.USER.CHANGE_PASSWORD, data);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API changePassword:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Cập nhật tùy chọn cá nhân hóa của người dùng (theme, language, thông báo...)
   */
  static async updatePreferences(data: UpdatePreferencesRequest): Promise<UpdatePreferencesResponse> {
    try {
      const response = await apiClient.patch<UpdatePreferencesResponse>(API_ENDPOINTS.USER.UPDATE_PREFERENCES, data);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API updatePreferences:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Lấy thống kê học tập cá nhân (Gamification, Statistics, Bài học, Từ vựng)
   */
  static async getMyStats(): Promise<MyStatsResponse> {
    try {
      const response = await apiClient.get<MyStatsResponse>(API_ENDPOINTS.USER.GET_MY_STATS);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API getMyStats:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default UserService;