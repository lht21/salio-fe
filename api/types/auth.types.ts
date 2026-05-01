/**
 * Định nghĩa các TypeScript Interfaces/Types cho luồng Authentication.
 * Các trường được map chính xác từ logic của authController.js, User.js và UserProgress.js.
 */

// --- Base Response ---

/**
 * Cấu trúc response chung trả về từ backend (bọc bởi các hàm ok, created,... trong response.js).
 */
export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// --- Request Payloads ---

/**
 * Dữ liệu gửi lên để yêu cầu gửi mã OTP.
 * Sử dụng cho:
 * - POST /api/v1/auth/register/send-otp
 * - POST /api/v1/auth/forgot-password/send-otp
 */
export interface SendOtpRequest {
  email: string;
}

/**
 * Dữ liệu gửi lên để xác minh mã OTP.
 * Sử dụng cho:
 * - POST /api/v1/auth/register/verify-otp
 * - POST /api/v1/auth/forgot-password/verify-otp
 */
export interface VerifyOtpRequest {
  email: string;
  code: string;
}

/**
 * Dữ liệu gửi lên để tạo tài khoản mới sau khi xác minh OTP.
 * Sử dụng cho:
 * - POST /api/v1/auth/register/create-account
 */
export interface CreateAccountRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

/**
 * Dữ liệu gửi lên để đăng nhập bằng tài khoản xã hội (Google, Apple).
 * Sử dụng cho:
 * - POST /api/v1/auth/social-login
 */
export interface SocialLoginRequest {
  provider: 'google' | 'apple';
  idToken: string;
  fullName?: string; // Chỉ dùng cho Apple nếu người dùng cung cấp
}

/**
 * Dữ liệu gửi lên để đăng nhập bằng email và mật khẩu.
 * Sử dụng cho:
 * - POST /api/v1/auth/login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Dữ liệu gửi lên để đặt lại mật khẩu sau khi xác minh OTP.
 * Sử dụng cho:
 * - POST /api/v1/auth/forgot-password/reset
 */
export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmNewPassword: string;
}

/**
 * Dữ liệu gửi lên để làm mới Access Token (nếu Refresh Token không được gửi qua cookie).
 * Sử dụng cho:
 * - POST /api/v1/auth/refresh-token
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

// --- Response Data Structures ---

export interface UserPreferencesNotifications {
  enabled: boolean;
  dailyReminderTime: string; // "HH:mm"
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'vi' | 'ko' | 'en';
  notifications: UserPreferencesNotifications;
  voiceGender: 'male' | 'female';
}

export interface UserSubscription {
  type: 'free' | 'premium';
  startDate?: string; // ISO Date String
  endDate?: string; // ISO Date String
  isActive: boolean;
  isAutoRenew: boolean;
}

export interface DailyMission {
  id: string; // e.g., 'D1', 'D2'
  progress: number;
  isClaimed: boolean;
}

export interface UserInventory {
  streakFreezes: number;
  doubleRewardEndDate?: string; // ISO Date String
  advancedAIAttempts: number;
  badges: string[];
  unlockedExams: string[]; // Array of Exam IDs
}

export interface UserGamification {
  clouds: number;
  currentStreak: number;
  highestStreak: number;
  activeDates: string[]; // Array of "YYYY-MM-DD" strings
  dailyQuest?: {
    date?: string; // "YYYY-MM-DD"
    missions: DailyMission[];
  };
  inventory: UserInventory;
}

export interface UserStatistics {
  savedVocabulariesCount: number;
  highestMockScore: number;
  totalStudyTime: number; // in minutes
  completedLessonsCount: number;
}

/**
 * Đại diện cho thông tin người dùng được trả về sau khi đăng nhập/đăng ký.
 * Đây là output của phương thức `user.toPublicJSON()` từ backend.
 */
export interface UserModel {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  preferences: UserPreferences;
  subscription: UserSubscription;
  isEmailVerified: boolean;
  createdAt: string; // ISO Date String
  gamification?: UserGamification; // Chỉ có nếu `progress` được populate
  statistics?: UserStatistics;     // Chỉ có nếu `progress` được populate
}

/**
 * Dữ liệu lõi trả về khi xác minh OTP thành công.
 */
export interface OtpVerificationData {
  email: string;
  verified: boolean;
}

/**
 * Response trả về khi xác minh OTP thành công.
 * Sử dụng cho:
 * - POST /api/v1/auth/register/verify-otp
 * - POST /api/v1/auth/forgot-password/verify-otp
 */
export type OtpVerificationResponse = BaseResponse<OtpVerificationData>;

/**
 * Dữ liệu lõi trả về khi đăng nhập/đăng ký thành công.
 */
export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: UserModel;
}

/**
 * Response trả về khi đăng nhập/đăng ký/đăng nhập xã hội thành công.
 * Sử dụng cho:
 * - POST /api/v1/auth/register/create-account
 * - POST /api/v1/auth/social-login
 * - POST /api/v1/auth/login
 */
export type AuthSuccessResponse = BaseResponse<AuthData>;

/**
 * Dữ liệu lõi trả về khi làm mới Access Token thành công.
 */
export interface RefreshTokenData {
  accessToken: string;
}

/**
 * Response trả về khi làm mới Access Token thành công.
 * Sử dụng cho:
 * - POST /api/v1/auth/refresh-token
 */
export type RefreshTokenResponse = BaseResponse<RefreshTokenData>;