/**
 * Định nghĩa các TypeScript Interfaces/Types cho module Gamification.
 * Các trường được map chính xác từ logic của gamificationController.js.
 */

// --- 1. Base Response ---

export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// --- 2. Core Models ---

export interface Mission {
  id: string;
  title: string;
  condition: string;
  target: number;
  reward: number;
  progress: number;
  isClaimed: boolean;
  isCompleted: boolean;
}

export interface StoreItem {
  id: string;
  title: string;
  desc: string;
  price: number;
  icon: string;
}

export interface Inventory {
  streakFreezes: number;
  doubleRewardEndDate?: string; // ISO Date String
  advancedAIAttempts: number;
  badges: string[];
  unlockedExams: string[]; // Mảng ID các đề thi đã mở khóa
}

export interface GamificationStats {
  currentStreak: number;
  highestStreak: number;
  activeDates: string[]; // Mảng các ngày theo định dạng "YYYY-MM-DD"
  clouds: number;
  inventory: Inventory;
  dailyQuest?: {
    date?: string; // "YYYY-MM-DD"
    missions: Mission[];
  };
}

export interface LeaderboardUser {
  _id: string;
  username: string;
  avatarUrl?: string;
  level?: string;
}

export interface LeaderboardEntry {
  rank: number;
  score: number;
  user: LeaderboardUser;
}

// --- 3. Request Payloads ---

export interface ClaimMissionRequest {
  missionId: string;
}

export interface PurchaseItemRequest {
  itemId: string;
  payload?: {
    missionId?: string; // Dùng cho vật phẩm R4 (Skip Mission)
    examId?: string;    // Dùng cho vật phẩm R7 (Unlock Exam)
  };
}

export interface GetLeaderboardParams {
  type?: 'clouds' | 'streak' | 'mock_score';
  limit?: number;
}

// --- 4. API Response Wrappers ---

export type DailyCheckInResponse = BaseResponse<GamificationStats>;
export type DailyMissionsResponse = BaseResponse<Mission[]>;
export type ClaimMissionResponse = BaseResponse<{ clouds: number }>;
export type StoreItemsResponse = BaseResponse<{ clouds: number; inventory: Inventory; store: StoreItem[] }>;
export type PurchaseItemResponse = BaseResponse<{ clouds: number; inventory: Inventory }>;
export type LeaderboardResponse = BaseResponse<{
  leaderboard: LeaderboardEntry[];
  currentUser: {
    rank: number;
    score: number;
  };
}>;