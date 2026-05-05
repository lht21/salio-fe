import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  SubscriptionPlanListResponse,
  SubscriptionPlanDetailResponse,
  CurrentSubscriptionResponse,
  PaymentHistoryResponse,
  CheckoutSessionResponse,
  CancelSubscriptionResponse,
  CheckoutRequest
} from '../types/subscription.types';

class SubscriptionService {
  /**
   * Lấy danh sách các gói cước đang hoạt động
   */
  static async getPlans(): Promise<SubscriptionPlanListResponse> {
    try {
      const response = await apiClient.get<SubscriptionPlanListResponse>(API_ENDPOINTS.SUBSCRIPTION.PLANS);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API getPlans:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Lấy chi tiết gói cước
   */
  static async getPlanById(planId: string): Promise<SubscriptionPlanDetailResponse> {
    try {
      const response = await apiClient.get<SubscriptionPlanDetailResponse>(API_ENDPOINTS.SUBSCRIPTION.PLAN_BY_ID(planId));
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API getPlanById (${planId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Lấy gói đang kích hoạt của User hiện tại
   */
  static async getCurrentSubscription(): Promise<CurrentSubscriptionResponse> {
    try {
      const response = await apiClient.get<CurrentSubscriptionResponse>(API_ENDPOINTS.SUBSCRIPTION.CURRENT);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API getCurrentSubscription:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Lịch sử thanh toán của User (chỉ lấy status completed)
   */
  static async getPaymentHistory(): Promise<PaymentHistoryResponse> {
    try {
      const response = await apiClient.get<PaymentHistoryResponse>(API_ENDPOINTS.SUBSCRIPTION.HISTORY);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API getPaymentHistory:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Tạo phiên thanh toán cho gói cước
   */
  static async checkoutPlan(planId: string, data: CheckoutRequest): Promise<CheckoutSessionResponse> {
    try {
      const response = await apiClient.post<CheckoutSessionResponse>(
        API_ENDPOINTS.SUBSCRIPTION.CHECKOUT(planId),
        data
      );
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API checkoutPlan (${planId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Hủy tự động gia hạn gói cước của User hiện tại
   */
  static async cancelSubscription(): Promise<CancelSubscriptionResponse> {
    try {
      const response = await apiClient.post<CancelSubscriptionResponse>(API_ENDPOINTS.SUBSCRIPTION.CANCEL);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API cancelSubscription:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default SubscriptionService;