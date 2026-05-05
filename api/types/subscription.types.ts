/**
 * Định nghĩa các TypeScript Interfaces/Types cho module Subscriptions (Học viên).
 * Dựa trên cấu trúc trả về từ subscriptionController.js, SubscriptionPlan.js, User.js, Payment.js
 */

// --- Base Response ---
export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// --- 1. Models ---

export interface SubscriptionFeatures {
  unlimitedLessons: boolean;
  unlimitedExams: boolean;
  aiWongoji: boolean;
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  description?: string;
  type: 'premium_monthly' | 'premium_quarterly' | 'premium_yearly' | 'lifetime';
  price: number;
  originalPrice?: number;
  durationDays: number;
  appleProductId?: string;
  googleProductId?: string;
  features: SubscriptionFeatures;
  featuresList: string[];
  isActive: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  type: 'free' | 'premium';
  startDate?: string; // ISO Date String
  endDate?: string; // ISO Date String
  isActive: boolean;
  isAutoRenew: boolean;
}

export interface PaymentHistoryPlan {
  _id: string;
  name: string;
  type: string;
  durationDays: number;
}

export interface PaymentHistoryItem {
  _id: string;
  user: string;
  plan: PaymentHistoryPlan; // Controller populate('plan', 'name type durationDays')
  amountPaid: number;
  purchasedPlanName: string;
  paymentMethod: 'apple_iap' | 'google_play' | 'momo' | 'vnpay' | 'bank_transfer' | 'admin_gift';
  orderId: string;
  gatewayTransactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt?: string; // ISO Date String
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface CheckoutSession {
  orderId: string;
  amount: number;
  payUrl: string;
  bankConfig?: {
    bankId: string;
    accountNo: string;
    accountName: string;
  };
}

// --- 2. Request Payloads ---

export interface CheckoutRequest {
  paymentMethod?: 'apple_iap' | 'google_play' | 'momo' | 'vnpay' | 'bank_transfer' | 'admin_gift';
}

// --- 3. API Response Wrappers ---

export type SubscriptionPlanListResponse = BaseResponse<SubscriptionPlan[]>;
export type SubscriptionPlanDetailResponse = BaseResponse<SubscriptionPlan>;
export type CurrentSubscriptionResponse = BaseResponse<UserSubscription>;
export type PaymentHistoryResponse = BaseResponse<PaymentHistoryItem[]>;
export type CheckoutSessionResponse = BaseResponse<CheckoutSession>;
export type CancelSubscriptionResponse = BaseResponse<UserSubscription>;