/**
 * Định nghĩa các TypeScript Interfaces/Types cho module Users.
 * Dựa trên cấu trúc trả về từ userController.js
 */

// --- 1. Base Response ---

/**
 * Cấu trúc response chung trả về từ backend (bọc bởi các hàm ok, created,...)
 */
export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// --- 2. Types cơ bản ---

export interface UserPreferencesNotifications {
  enabled: boolean;
  dailyReminderTime: string; // Format: "HH:mm"
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system' | string;
  language: 'vi' | 'ko' | 'en' | string;
  voiceGender: 'male' | 'female' | string;
  notifications: UserPreferencesNotifications;
}

export interface UserSubscription {
  type: 'free' | 'premium' | string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  isAutoRenew: boolean;
}

/**
 * Profile người dùng public (output từ user.toPublicJSON(), KHÔNG chứa password)
 */
export interface UserProfile {
  _id: string; 
  username: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  level?: string;
  isActive?: boolean;
  isBanned?: boolean;
  preferences: UserPreferences;
  subscription?: UserSubscription;
  isEmailVerified: boolean;
  createdAt: string;
}

// --- 3. Request Payloads (Dữ liệu gửi lên) ---

export interface UpdateProfileRequest {
  username?: string;
  avatarUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePreferencesRequest {
  preferences: {
    theme?: string;
    language?: string;
    voiceGender?: string;
    notifications?: {
      enabled?: boolean;
      dailyReminderTime?: string;
    };
  };
}

// --- 4. Response Data (Dữ liệu nhận về lõi) ---

export interface MyStatsData {
  gamification?: Record<string, any>; // Có thể import type UserGamification từ auth.types.ts nếu cần strict hơn
  statistics?: Record<string, any>;   // Có thể import type UserStatistics từ auth.types.ts nếu cần strict hơn
  savedVocabulariesCount: number;
  completedLessonsCount: number;
}

export interface UpdateAvatarData {
  avatarUrl: string;
}

export interface PaginatedUsersData {
  users: UserProfile[];
  total: number;
  page: number;
  pages: number;
}

// --- 5. Wrappers (Response hoàn chỉnh từ API) ---

export type UserProfileResponse = BaseResponse<UserProfile>;

export type UpdateAvatarResponse = BaseResponse<UpdateAvatarData>;

export type MyStatsResponse = BaseResponse<MyStatsData>;

export type PaginatedUsersResponse = BaseResponse<PaginatedUsersData>;

export type UpdatePreferencesResponse = BaseResponse<{ preferences: UserPreferences }>;

// Các API xử lý thành công nhưng không trả về data (trả về null)
export type ChangePasswordResponse = BaseResponse<null>;
export type DeleteUserResponse = BaseResponse<null>;