import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { Grammar, LessonModulesResponse } from '../types/lesson.types';

class GrammarService {
  static async getLessonGrammar(lessonId: string): Promise<Grammar[]> {
    const response = await apiClient.get<LessonModulesResponse>(API_ENDPOINTS.LESSON.GET_MODULES(lessonId));
    return response.data?.data?.grammar || [];
  }

  static async getGrammarExercises(grammarId: string) {
    const response = await apiClient.get(`/api/v1/grammars/${grammarId}/exercise`);
    return response.data?.data;
  }

  static async startGrammarQuiz(payload: { quizId?: string; level?: string; category?: string; limit?: number }) {
    const response = await apiClient.post('/api/v1/grammars/quiz/start', payload);
    return response.data.data; // Trả về { sessionId }
  }

  static async getGrammarQuizSession(sessionId: string) {
    const response = await apiClient.get(`/api/v1/grammars/quiz/session/${sessionId}`);
    return response.data.data;
  }

  static async saveGrammarQuizAnswer(sessionId: string, payload: { questionId: string; answer: any; timeSpent?: number }) {
    await apiClient.post(`/api/v1/grammars/quiz/session/${sessionId}/save-answer`, payload);
  }

  static async submitGrammarQuiz(sessionId: string, payload?: { timeSpent?: number }) {
    const response = await apiClient.post(`/api/v1/grammars/quiz/session/${sessionId}/submit`, payload);
    return response.data.data;
  }

    static async getGrammarQuizResult(sessionId: string) {
    try {
      const response = await apiClient.get(`/api/v1/grammars/quiz/session/${sessionId}/result`);
      return response.data.data;
    } catch (error: any) {
      console.error(`Lỗi getGrammarQuizResult ${sessionId}:`, error.response?.data || error.message);
      throw error;
    }
  }

    static async updateGrammarProgress(lessonId: string, grammarId: string, status: 'learning' | 'completed') {
    try {
      const response = await apiClient.patch(
        `/api/v1/lessons/${lessonId}/progress/sections/grammar/items/${grammarId}`,
        { 
          status,
          resultKind: 'Manual',
          title: 'Học ngữ pháp' 
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Lỗi cập nhật tiến độ ngữ pháp:', error.response?.data || error.message);
      throw error;
    }
  }

}

export default GrammarService;