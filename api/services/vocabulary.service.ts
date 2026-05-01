import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  GetVocabulariesRequest,
  MarkStatusRequest,
  PaginatedVocabulariesResponse,
  StudyQueueResponse,
  VocabularyDetailResponse,
  BaseResponse,
} from '../types/vocabulary.types';

/**
 * Service xử lý các luồng gọi API liên quan đến Từ vựng (Vocabulary) dành cho Học viên.
 */
class VocabularyService {
  /**
   * Lấy danh sách từ vựng (Có phân trang, filter level, category, keyword, isActive)
   */
  static async getAll(params?: GetVocabulariesRequest): Promise<PaginatedVocabulariesResponse> {
    try {
      const response = await apiClient.get<PaginatedVocabulariesResponse>(API_ENDPOINTS.VOCABULARY.GET_ALL, {
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API getAll vocabularies:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Lấy chi tiết một từ vựng
   */
  static async getById(id: string): Promise<VocabularyDetailResponse> {
    try {
      const response = await apiClient.get<VocabularyDetailResponse>(API_ENDPOINTS.VOCABULARY.GET_BY_ID(id));
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API getById (${id}):`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Lấy danh sách từ cần học/ôn tập hôm nay (Hỗ trợ filter level, category, status)
   */
  static async getStudyQueue(params?: {
    level?: string;
    category?: string;
    status?: 'learning' | 'remembered' | 'forgotten';
    limit?: number;
  }): Promise<StudyQueueResponse> {
    try {
      const response = await apiClient.get<StudyQueueResponse>(API_ENDPOINTS.VOCABULARY.STUDY_QUEUE, {
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API getStudyQueue:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Xem tiến độ học từ vựng của user
   */
  static async getLearningProgress(params?: { status?: string; page?: number; limit?: number }): Promise<BaseResponse<any>> {
    try {
      const response = await apiClient.get<BaseResponse<any>>(API_ENDPOINTS.VOCABULARY.LEARNING_PROGRESS, {
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API getLearningProgress:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Đánh dấu trạng thái học của một từ (remembered/forgotten/learning)
   */
  static async markStatus(id: string, data: MarkStatusRequest): Promise<BaseResponse<any>> {
    try {
      const response = await apiClient.post<BaseResponse<any>>(API_ENDPOINTS.VOCABULARY.MARK_STATUS(id), data);
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API markStatus (${id}):`, error.response?.data || error.message);
      throw error;
    }
  }
}

export default VocabularyService;