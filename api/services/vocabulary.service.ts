import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { 
  GetVocabulariesRequest, 
  MarkStatusRequest, 
  PaginatedVocabulariesResponse, 
  StudyQueueResponse, 
  VocabularyDetailResponse, 
  BaseResponse,
  VocabularyQuizQuestion,
  VocabularyQuizSession,
  StartVocabularyQuizRequest,
  SaveVocabularyAnswerRequest,
  StartVocabularyQuizResponse,
  GetVocabularyQuizSessionResponse,
  SaveVocabularyAnswerResponse,
  SubmitVocabularyQuizResponse,
  PaginatedVocabulariesData
} from '../types/vocabulary.types';

// Định nghĩa các kiểu dữ liệu cho phản hồi API quiz (nếu chưa có trong vocabulary.types.ts)
export interface VocabularyQuizOption {
  id: string;
  text: string;
}

export interface VocabularyQuizSessionResponse {
  _id: string;
  quiz: {
    _id: string;
    title: string;
    questions: VocabularyQuizQuestion[];
  };
  userAnswers: {
    questionId: string;
    answer: any;
  }[];
}

export interface StartVocabularyQuizResponseData {
  sessionId: string;
}

/**
 * Service xử lý các luồng gọi API liên quan đến Từ vựng (Vocabulary) dành cho Học viên.
 */
class VocabularyService {
  /**
   * Lấy danh sách từ vựng (Có phân trang, filter level, category, keyword, isActive)
   */
static async getAll(params?: GetVocabulariesRequest): Promise<PaginatedVocabulariesData> {
  try {
    const response = await apiClient.get<PaginatedVocabulariesResponse>(
      API_ENDPOINTS.VOCABULARY.GET_ALL, 
      { params }
    );
    
    return response.data.data;
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
   * Lấy danh sách từ cần học/ôn tập hôm nay
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
   * Đánh dấu trạng thái học của một từ
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

  /**
   * Bắt đầu vocabulary quiz
   */
  static async startVocabularyQuiz(payload: { quizId?: string; lessonId?: string; level?: string; category?: string; limit?: number }): Promise<{ sessionId: string }> {
  try {
    // Chỉ gửi quizId, level, category, limit - không gửi lessonId
    const requestData: any = {};
    if (payload.quizId) requestData.quizId = payload.quizId;
    if (payload.level) requestData.level = payload.level;
    if (payload.category) requestData.category = payload.category;
    if (payload.limit) requestData.limit = payload.limit;
    
    const response = await apiClient.post(API_ENDPOINTS.VOCABULARY.QUIZ_START, requestData);
    // Response structure: { success, message, data: { sessionId } }
    return response.data.data;
  } catch (error: any) {
    console.error('Lỗi startVocabularyQuiz:', error.response?.data || error.message);
    throw error;
  }
}

  /**
   * Lưu đáp án vocabulary quiz
   */
  static async saveVocabularyQuizAnswer(sessionId: string, payload: SaveVocabularyAnswerRequest): Promise<void> {
    try {
      await apiClient.post<SaveVocabularyAnswerResponse>(API_ENDPOINTS.VOCABULARY.QUIZ_SAVE_ANSWER(sessionId), payload);
    } catch (error: any) {
      console.error(`Lỗi saveVocabularyQuizAnswer:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Nộp bài vocabulary quiz
   */
  static async submitVocabularyQuiz(sessionId: string, payload?: { timeSpent?: number }): Promise<VocabularyQuizSession> {
    try {
      const response = await apiClient.post<SubmitVocabularyQuizResponse>(API_ENDPOINTS.VOCABULARY.QUIZ_SUBMIT(sessionId), payload);
      return response.data.data;
    } catch (error: any) {
      console.error(`Lỗi submitVocabularyQuiz:`, error.response?.data || error.message);
      throw error;
    }
  }

/**
   * Lấy chi tiết vocabulary quiz session (Log để xem cấu trúc câu hỏi)
   */
  static async getVocabularyQuizSession(sessionId: string): Promise<VocabularyQuizSession> {
    try {
      const response = await apiClient.get<GetVocabularyQuizSessionResponse>(API_ENDPOINTS.VOCABULARY.QUIZ_SESSION(sessionId));
      
      // LOG DỮ LIỆU KHI ĐANG LÀM BÀI
      console.log(`[LOG] Session ${sessionId} (InProgress):`, JSON.stringify(response.data.data, null, 2));
      
      return response.data.data;
    } catch (error: any) {
      console.error(`Lỗi getVocabularyQuizSession ${sessionId}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Xem kết quả vocabulary quiz (Log để xem đáp án đúng và userAnswer)
   */
  static async getVocabularyQuizResult(sessionId: string): Promise<VocabularyQuizSession> {
    try {
      const response = await apiClient.get<BaseResponse<VocabularyQuizSession>>(API_ENDPOINTS.VOCABULARY.QUIZ_SESSION_RESULT(sessionId));
      
      // LOG DỮ LIỆU KẾT QUẢ CUỐI CÙNG
      console.log(`[LOG] Result Session ${sessionId} (Completed):`, JSON.stringify(response.data.data, null, 2));
      
      return response.data.data;
    } catch (error: any) {
      console.error(`Lỗi getVocabularyQuizResult ${sessionId}:`, error.response?.data || error.message);
      throw error;
    }
  }
  
}

export default VocabularyService;