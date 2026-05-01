import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  CreateFlashcardSetRequest,
  UpdateFlashcardSetRequest,
  AddCardsToSetRequest,
  FlashcardSetListResponse,
  FlashcardSetDetailResponse,
  FlashcardSetMutationResponse,
  DeleteFlashcardSetResponse,
  CardMutationResponse,
} from '../types/flashcard.types';

/**
 * Service xử lý các luồng gọi API liên quan đến Flashcards.
 */
class FlashcardService {
  /**
   * Lấy danh sách bộ từ vựng
   * @param type 'my_sets' (mặc định) hoặc 'public'
   */
  static async getAllSets(type: 'my_sets' | 'public' = 'my_sets'): Promise<FlashcardSetListResponse> {
    try {
      const response = await apiClient.get<FlashcardSetListResponse>(API_ENDPOINTS.FLASHCARD.GET_ALL, {
        params: { type },
      });
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API getAllSets:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Tạo bộ từ vựng mới
   */
  static async createSet(data: CreateFlashcardSetRequest): Promise<FlashcardSetMutationResponse> {
    try {
      const response = await apiClient.post<FlashcardSetMutationResponse>(API_ENDPOINTS.FLASHCARD.CREATE, data);
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi gọi API createSet:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Lấy chi tiết bộ từ vựng. Hỗ trợ truyền `setId` là 'favorite'.
   */
  static async getSetById(setId: string): Promise<FlashcardSetDetailResponse> {
    try {
      const response = await apiClient.get<FlashcardSetDetailResponse>(API_ENDPOINTS.FLASHCARD.GET_BY_ID(setId));
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API getSetById (${setId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  static async updateSet(setId: string, data: UpdateFlashcardSetRequest): Promise<FlashcardSetMutationResponse> {
    try {
      const response = await apiClient.patch<FlashcardSetMutationResponse>(API_ENDPOINTS.FLASHCARD.UPDATE(setId), data);
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API updateSet (${setId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  static async deleteSet(setId: string): Promise<DeleteFlashcardSetResponse> {
    try {
      const response = await apiClient.delete<DeleteFlashcardSetResponse>(API_ENDPOINTS.FLASHCARD.DELETE(setId));
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API deleteSet (${setId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Thêm nhiều từ vựng vào bộ (Hỗ trợ cả 'favorite')
   */
  static async addCardsToSet(setId: string, data: AddCardsToSetRequest): Promise<CardMutationResponse> {
    try {
      const response = await apiClient.post<CardMutationResponse>(API_ENDPOINTS.FLASHCARD.ADD_CARDS(setId), data);
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API addCardsToSet (${setId}):`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Xóa 1 từ vựng khỏi bộ (Hỗ trợ cả 'favorite')
   */
  static async removeCardFromSet(setId: string, vocabId: string): Promise<CardMutationResponse> {
    try {
      const response = await apiClient.delete<CardMutationResponse>(API_ENDPOINTS.FLASHCARD.REMOVE_CARD(setId, vocabId));
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi gọi API removeCardFromSet (${setId}, ${vocabId}):`, error.response?.data || error.message);
      throw error;
    }
  }
}

export default FlashcardService;