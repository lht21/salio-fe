import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { BaseResponse } from '../types/auth.types';
import { 
  GetVocabulariesRequest,
  GetStudyQueueParams,
  GetLearningProgressParams,
  MarkStatusRequest,
  CreateVocabularyRequest,
  UpdateVocabularyRequest,
  BulkUpdateVocabularyImagesRequest,
  PaginatedVocabulariesResponse,
  StudyQueueResponse,
  VocabularyDetailResponse,
  VocabularyMutationResponse,
  GetLearningProgressResponse,
  ImportVocabulariesResponse,
  BulkUpdateImagesResponse,
  GetVocabularyQuizzesParams,
  CreateVocabularyQuizRequest,
  UpdateVocabularyQuizRequest,
  ModifyVocabularyQuizItemsRequest,
  GetVocabularyQuizResultsParams,
  StartVocabularyQuizRequest,
  SaveVocabularyAnswerRequest,
  SubmitVocabularyQuizRequest,
  PaginatedVocabularyQuizzesResponse,
  MarkVocabularyStatusResponse,
  VocabularyQuizDetailResponse,
  VocabularyQuizMutationResponse,
  PaginatedVocabularyQuizResultsResponse,
  StartVocabularyQuizResponse,
  GetVocabularyQuizSessionResponse,
  SaveVocabularyAnswerResponse,
  SubmitVocabularyQuizResponse,
  GetVocabularyQuizResultResponse,
} from '../types/vocabulary.types';

/**
 * Service xử lý các luồng gọi API liên quan đến Từ vựng (Vocabulary).
 */
class VocabularyService {
  // ==========================================
  // CORE VOCABULARY
  // ==========================================
  static async getAll(params?: GetVocabulariesRequest): Promise<PaginatedVocabulariesResponse> {
    try {
      const response = await apiClient.get<PaginatedVocabulariesResponse>(API_ENDPOINTS.VOCABULARY.GET_ALL, { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async create(data: CreateVocabularyRequest): Promise<VocabularyMutationResponse> {
    try {
      const response = await apiClient.post<VocabularyMutationResponse>(API_ENDPOINTS.VOCABULARY.CREATE, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async getById(id: string): Promise<VocabularyDetailResponse> {
    try {
      const response = await apiClient.get<VocabularyDetailResponse>(API_ENDPOINTS.VOCABULARY.GET_BY_ID(id));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async update(id: string, data: UpdateVocabularyRequest): Promise<VocabularyMutationResponse> {
    try {
      const response = await apiClient.patch<VocabularyMutationResponse>(API_ENDPOINTS.VOCABULARY.UPDATE(id), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async delete(id: string): Promise<BaseResponse<null>> {
    try {
      const response = await apiClient.delete<BaseResponse<null>>(API_ENDPOINTS.VOCABULARY.DELETE(id));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async togglePublish(id: string): Promise<VocabularyMutationResponse> {
    try {
      const response = await apiClient.patch<VocabularyMutationResponse>(API_ENDPOINTS.VOCABULARY.TOGGLE_PUBLISH(id));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async markStatus(id: string, data: MarkStatusRequest): Promise<MarkVocabularyStatusResponse> {
    try {
      const response = await apiClient.post<MarkVocabularyStatusResponse>(API_ENDPOINTS.VOCABULARY.MARK_STATUS(id), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async getStudyQueue(params?: GetStudyQueueParams): Promise<StudyQueueResponse> {
    try {
      const response = await apiClient.get<StudyQueueResponse>(API_ENDPOINTS.VOCABULARY.STUDY_QUEUE, { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async getLearningProgress(params?: GetLearningProgressParams): Promise<GetLearningProgressResponse> {
    try {
      const response = await apiClient.get<GetLearningProgressResponse>(API_ENDPOINTS.VOCABULARY.LEARNING_PROGRESS, { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  // ==========================================
  // ADMIN
  // ==========================================
  static async importVocabularies(data: FormData): Promise<ImportVocabulariesResponse> {
    try {
      const response = await apiClient.post<ImportVocabulariesResponse>(API_ENDPOINTS.VOCABULARY.IMPORT, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async bulkUpdateImages(data: BulkUpdateVocabularyImagesRequest): Promise<BulkUpdateImagesResponse> {
    try {
      const response = await apiClient.patch<BulkUpdateImagesResponse>(API_ENDPOINTS.VOCABULARY.BULK_IMAGES, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  // ==========================================
  // QUIZZES (ADMIN & MANAGEMENT)
  // ==========================================
  static async getQuizzes(params?: GetVocabularyQuizzesParams): Promise<PaginatedVocabularyQuizzesResponse> {
    try {
      const response = await apiClient.get<PaginatedVocabularyQuizzesResponse>(API_ENDPOINTS.VOCABULARY.GET_QUIZZES, { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async createQuiz(data: CreateVocabularyQuizRequest): Promise<VocabularyQuizMutationResponse> {
    try {
      const response = await apiClient.post<VocabularyQuizMutationResponse>(API_ENDPOINTS.VOCABULARY.CREATE_QUIZ, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async getQuizById(quizId: string): Promise<VocabularyQuizDetailResponse> {
    try {
      const response = await apiClient.get<VocabularyQuizDetailResponse>(API_ENDPOINTS.VOCABULARY.GET_QUIZ_BY_ID(quizId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async updateQuiz(quizId: string, data: UpdateVocabularyQuizRequest): Promise<VocabularyQuizMutationResponse> {
    try {
      const response = await apiClient.patch<VocabularyQuizMutationResponse>(API_ENDPOINTS.VOCABULARY.UPDATE_QUIZ(quizId), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async deleteQuiz(quizId: string): Promise<BaseResponse<null>> {
    try {
      const response = await apiClient.delete<BaseResponse<null>>(API_ENDPOINTS.VOCABULARY.DELETE_QUIZ(quizId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async addQuizItems(quizId: string, data: ModifyVocabularyQuizItemsRequest): Promise<VocabularyQuizMutationResponse> {
    try {
      const response = await apiClient.patch<VocabularyQuizMutationResponse>(API_ENDPOINTS.VOCABULARY.ADD_QUIZ_ITEMS(quizId), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async removeQuizItems(quizId: string, data: ModifyVocabularyQuizItemsRequest): Promise<VocabularyQuizMutationResponse> {
    try {
      const response = await apiClient.delete<VocabularyQuizMutationResponse>(API_ENDPOINTS.VOCABULARY.REMOVE_QUIZ_ITEMS(quizId), { data });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async reorderQuizItems(quizId: string, data: ModifyVocabularyQuizItemsRequest): Promise<VocabularyQuizMutationResponse> {
    try {
      const response = await apiClient.patch<VocabularyQuizMutationResponse>(API_ENDPOINTS.VOCABULARY.REORDER_QUIZ_ITEMS(quizId), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async togglePublishQuiz(quizId: string): Promise<VocabularyQuizMutationResponse> {
    try {
      const response = await apiClient.patch<VocabularyQuizMutationResponse>(API_ENDPOINTS.VOCABULARY.TOGGLE_PUBLISH_QUIZ(quizId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  // ==========================================
  // QUIZ SESSIONS (STUDENT)
  // ==========================================
  static async startVocabularyQuiz(data: StartVocabularyQuizRequest): Promise<StartVocabularyQuizResponse> {
    try {
      const response = await apiClient.post<StartVocabularyQuizResponse>(API_ENDPOINTS.VOCABULARY.START_QUIZ, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async getVocabularyQuizResults(params?: GetVocabularyQuizResultsParams): Promise<PaginatedVocabularyQuizResultsResponse> {
    try {
      const response = await apiClient.get<PaginatedVocabularyQuizResultsResponse>(API_ENDPOINTS.VOCABULARY.GET_QUIZ_RESULTS, { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async getVocabularyQuizSession(sessionId: string): Promise<GetVocabularyQuizSessionResponse> {
    try {
      const response = await apiClient.get<GetVocabularyQuizSessionResponse>(API_ENDPOINTS.VOCABULARY.GET_QUIZ_SESSION(sessionId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async saveVocabularyQuizAnswer(sessionId: string, data: SaveVocabularyAnswerRequest): Promise<SaveVocabularyAnswerResponse> {
    try {
      const response = await apiClient.post<SaveVocabularyAnswerResponse>(API_ENDPOINTS.VOCABULARY.SAVE_QUIZ_ANSWER(sessionId), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async submitVocabularyQuiz(sessionId: string, data?: SubmitVocabularyQuizRequest): Promise<SubmitVocabularyQuizResponse> {
    try {
      const response = await apiClient.post<SubmitVocabularyQuizResponse>(API_ENDPOINTS.VOCABULARY.SUBMIT_QUIZ(sessionId), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async getVocabularyQuizResult(sessionId: string): Promise<GetVocabularyQuizResultResponse> {
    try {
      const response = await apiClient.get<GetVocabularyQuizResultResponse>(API_ENDPOINTS.VOCABULARY.GET_QUIZ_RESULT(sessionId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}

export default VocabularyService;