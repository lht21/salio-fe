import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  SendOtpRequest,
  VerifyOtpRequest,
  CreateAccountRequest,
  SocialLoginRequest,
  LoginRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  OtpVerificationResponse,
  AuthSuccessResponse,
  RefreshTokenResponse,
  BaseResponse,
} from '../types/auth.types';

/**
 * Service xử lý các luồng Authentication.
 * Chịu trách nhiệm giao tiếp với backend thông qua apiClient.
 */
class AuthService {
  static async sendRegisterOtp(data: SendOtpRequest): Promise<BaseResponse<null>> {
    try {
      const response = await apiClient.post<BaseResponse<null>>(API_ENDPOINTS.AUTH.SEND_REGISTER_OTP, data);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API sendRegisterOtp:', error.response?.data || error.message);
      throw error;
    }
  }

  static async verifyRegisterOtp(data: VerifyOtpRequest): Promise<OtpVerificationResponse> {
    try {
      const response = await apiClient.post<OtpVerificationResponse>(API_ENDPOINTS.AUTH.VERIFY_REGISTER_OTP, data);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API verifyRegisterOtp:', error.response?.data || error.message);
      throw error;
    }
  }

  static async createAccount(data: CreateAccountRequest): Promise<AuthSuccessResponse> {
    try {
      const response = await apiClient.post<AuthSuccessResponse>(API_ENDPOINTS.AUTH.CREATE_ACCOUNT, data);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API createAccount:', error.response?.data || error.message);
      throw error;
    }
  }

  static async socialLogin(data: SocialLoginRequest): Promise<AuthSuccessResponse> {
    try {
      const response = await apiClient.post<AuthSuccessResponse>(API_ENDPOINTS.AUTH.SOCIAL_LOGIN, data);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API socialLogin:', error.response?.data || error.message);
      throw error;
    }
  }

  static async login(data: LoginRequest): Promise<AuthSuccessResponse> {
    try {
      const response = await apiClient.post<AuthSuccessResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API login:', error.response?.data || error.message);
      throw error;
    }
  }

  static async logout(): Promise<BaseResponse<null>> {
    try {
      const response = await apiClient.post<BaseResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API logout:', error.response?.data || error.message);
      throw error;
    }
  }

  static async sendForgotPasswordOtp(data: SendOtpRequest): Promise<BaseResponse<null>> {
    try {
      const response = await apiClient.post<BaseResponse<null>>(API_ENDPOINTS.AUTH.SEND_FORGOT_PASSWORD_OTP, data);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API sendForgotPasswordOtp:', error.response?.data || error.message);
      throw error;
    }
  }

  static async verifyForgotPasswordOtp(data: VerifyOtpRequest): Promise<OtpVerificationResponse> {
    try {
      const response = await apiClient.post<OtpVerificationResponse>(API_ENDPOINTS.AUTH.VERIFY_FORGOT_PASSWORD_OTP, data);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API verifyForgotPasswordOtp:', error.response?.data || error.message);
      throw error;
    }
  }

  static async resetPassword(data: ResetPasswordRequest): Promise<BaseResponse<null>> {
    try {
      const response = await apiClient.post<BaseResponse<null>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API resetPassword:', error.response?.data || error.message);
      throw error;
    }
  }

  static async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const response = await apiClient.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, data);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API refreshToken:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default AuthService;