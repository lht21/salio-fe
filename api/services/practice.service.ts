import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  PracticeType,
  PracticeSetsResponse,
  PracticeSetDetailResponse,
  PracticeHistoryResponse,
  StartAttemptResponse,
  SaveAnswerRequest,
  SaveAnswerResponse,
  SubmitAttemptResponse,
  AttemptResultResponse,
  AttemptReviewResponse,
  DeleteAttemptResponse,
  DeleteMultipleAttemptsResponse,
  BaseResponse,
  PreparationMaterialsResponse,
} from '../types/practice.types';

/**
 * Service xử lý các luồng gọi API liên quan đến Luyện thi (Practice & Attempt).
 * Chịu trách nhiệm giao tiếp với backend thông qua apiClient.
 */
class PracticeService {
  // ========================================================================= //
  // ====================== NHÓM HÀM PRACTICE (LẤY ĐỀ) ======================= //
  // ========================================================================= //

  static async getSets(type: PracticeType, params?: { page?: number; limit?: number; examType?: string }): Promise<PracticeSetsResponse> {
    try {
      const response = await apiClient.get<PracticeSetsResponse>(API_ENDPOINTS.PRACTICE.GET_SETS_BY_TYPE(type), { params });
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API getSets (${type}):`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Tìm kiếm bài luyện tập
   */
  static async searchSets(keyword: string, params?: { page?: number; limit?: number }): Promise<PracticeSetsResponse> {
    try {
      const response = await apiClient.get<PracticeSetsResponse>(API_ENDPOINTS.PRACTICE.SEARCH, { 
        params: { q: keyword, ...params } 
      });
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API searchSets:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Lấy chi tiết đề thi / bài luyện tập. 
   * (Backend sẽ throw 403 nếu người dùng Free truy cập đề Premium chưa mở khóa)
   */
  static async getSetById(type: PracticeType, setId: string): Promise<PracticeSetDetailResponse> {
    try {
      const response = await apiClient.get<PracticeSetDetailResponse>(API_ENDPOINTS.PRACTICE.GET_SET_BY_ID(type, setId));
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API getSetById (${setId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Lấy tài liệu ôn tập trước khi thi
   */
  static async getPreparationMaterials(type: PracticeType, setId: string): Promise<PreparationMaterialsResponse> {
    try {
      const response = await apiClient.get<PreparationMaterialsResponse>(API_ENDPOINTS.PRACTICE.GET_PREPARATION_MATERIALS(type, setId));
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API getPreparationMaterials (${setId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Lấy lịch sử làm bài của cá nhân
   */
  static async getHistory(params?: { page?: number; limit?: number }): Promise<PracticeHistoryResponse> {
    try {
      const response = await apiClient.get<PracticeHistoryResponse>(API_ENDPOINTS.PRACTICE.HISTORY, { params });
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API getHistory:', error.response?.data || error.message);
      throw error;
    }
  }

  // ========================================================================= //
  // ===================== NHÓM HÀM ATTEMPT (LÀM BÀI) ======================== //
  // ========================================================================= //

  static async startAttempt(type: PracticeType, setId: string): Promise<StartAttemptResponse> {
    try {
      const response = await apiClient.post<StartAttemptResponse>(API_ENDPOINTS.PRACTICE.START_ATTEMPT(type, setId), {});
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API startAttempt (${setId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  static async getAttemptStatus(attemptId: string): Promise<AttemptResultResponse> {
    try {
      const response = await apiClient.get<AttemptResultResponse>(API_ENDPOINTS.ATTEMPT.GET_STATUS(attemptId));
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API getAttemptStatus (${attemptId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  static async saveAnswer(attemptId: string, payload: SaveAnswerRequest): Promise<SaveAnswerResponse> {
    try {
      const response = await apiClient.post<SaveAnswerResponse>(API_ENDPOINTS.ATTEMPT.SAVE_ANSWER(attemptId), payload);
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API saveAnswer (${attemptId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  static async submitAttempt(attemptId: string, timeSpent?: number): Promise<SubmitAttemptResponse> {
    try {
      const response = await apiClient.post<SubmitAttemptResponse>(API_ENDPOINTS.ATTEMPT.SUBMIT(attemptId), { timeSpent });
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API submitAttempt (${attemptId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  static async getAttemptResult(attemptId: string): Promise<AttemptResultResponse> {
    try {
      const response = await apiClient.get<AttemptResultResponse>(API_ENDPOINTS.ATTEMPT.GET_RESULT(attemptId));
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API getAttemptResult (${attemptId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  static async reviewAttempt(attemptId: string): Promise<AttemptReviewResponse> {
    try {
      const response = await apiClient.get<AttemptReviewResponse>(API_ENDPOINTS.ATTEMPT.REVIEW(attemptId));
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API reviewAttempt (${attemptId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  static async deleteAttempt(attemptId: string): Promise<DeleteAttemptResponse> {
    try {
      const response = await apiClient.delete<DeleteAttemptResponse>(API_ENDPOINTS.ATTEMPT.DELETE(attemptId));
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API deleteAttempt (${attemptId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  static async deleteMultipleAttempts(attemptIds: string[]): Promise<DeleteMultipleAttemptsResponse> {
    try {
      const response = await apiClient.post<DeleteMultipleAttemptsResponse>(API_ENDPOINTS.ATTEMPT.BATCH_DELETE, { attemptIds });
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API deleteMultipleAttempts:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default PracticeService;