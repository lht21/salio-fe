import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  GetLeaderboardParams,
  ClaimMissionRequest,
  PurchaseItemRequest,
  DailyCheckInResponse,
  DailyMissionsResponse,
  ClaimMissionResponse,
  StoreItemsResponse,
  PurchaseItemResponse,
  LeaderboardResponse,
} from '../types/gamification.types';

/**
 * Service xử lý các luồng gọi API liên quan đến Gamification (Điểm danh, Nhiệm vụ, Cửa hàng, Bảng xếp hạng).
 * Chịu trách nhiệm giao tiếp với backend thông qua apiClient.
 */
class GamificationService {
  /**
   * Lấy danh sách bảng xếp hạng (Hỗ trợ phân loại: clouds, streak, mock_score)
   */
  static async getLeaderboard(params?: GetLeaderboardParams): Promise<LeaderboardResponse> {
    try {
      const response = await apiClient.get<LeaderboardResponse>(API_ENDPOINTS.GAMIFICATION.LEADERBOARD, { params });
      return response.data;
    } catch (error: any) {
      console.log('Lỗi khi gọi API getLeaderboard:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Điểm danh hằng ngày
   */
  static async dailyCheckIn(): Promise<DailyCheckInResponse> {
    try {
      const response = await apiClient.post<DailyCheckInResponse>(API_ENDPOINTS.GAMIFICATION.CHECK_IN);
      return response.data;
    } catch (error: any) {
      console.log('Lỗi khi gọi API dailyCheckIn:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Lấy danh sách nhiệm vụ hằng ngày của người dùng
   */
  static async getDailyMissions(): Promise<DailyMissionsResponse> {
    try {
      const response = await apiClient.get<DailyMissionsResponse>(API_ENDPOINTS.GAMIFICATION.MISSIONS);
      return response.data;
    } catch (error: any) {
      console.log('Lỗi khi gọi API getDailyMissions:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Nhận thưởng mây từ một nhiệm vụ đã hoàn thành
   */
  static async claimMissionReward(data: ClaimMissionRequest): Promise<ClaimMissionResponse> {
    try {
      const response = await apiClient.post<ClaimMissionResponse>(API_ENDPOINTS.GAMIFICATION.CLAIM_MISSION, data);
      return response.data;
    } catch (error: any) {
      console.log('Lỗi khi gọi API claimMissionReward:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Lấy danh sách vật phẩm trong cửa hàng cùng số mây và kho đồ hiện tại
   */
  static async getStoreItems(): Promise<StoreItemsResponse> {
    try {
      const response = await apiClient.get<StoreItemsResponse>(API_ENDPOINTS.GAMIFICATION.STORE);
      return response.data;
    } catch (error: any) {
      console.log('Lỗi khi gọi API getStoreItems:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Mua vật phẩm từ cửa hàng
   */
  static async purchaseItem(data: PurchaseItemRequest): Promise<PurchaseItemResponse> {
    try {
      const response = await apiClient.post<PurchaseItemResponse>(API_ENDPOINTS.GAMIFICATION.PURCHASE, data);
      return response.data;
    } catch (error: any) {
      console.log('Lỗi khi gọi API purchaseItem:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default GamificationService;