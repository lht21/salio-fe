import axios from 'axios';
import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  GetGrammarParams,
  GetGrammarsResponse,
  CreateGrammarRequest,
  GrammarDetailResponse,
  UpdateGrammarRequest,
  ImportGrammarRequest,
  CheckGrammarExerciseRequest,
  CheckGrammarExerciseResponse,
  GetSimilarGrammarsResponse,
  GetGrammarQuizParams,
  GetGrammarQuizzesResponse,
  CreateGrammarQuizRequest,
  GrammarQuizDetailResponse,
  UpdateGrammarQuizRequest,
  GrammarQuizItemsRequest,
  StartGrammarQuizRequest,
  StartGrammarQuizResponse,
  GrammarQuizSessionResponse,
  SaveGrammarQuizAnswerRequest,
  SubmitGrammarQuizRequest,
  DeleteResponse,
  Grammar,
} from '../types/grammar.types';
import { LessonModulesResponse } from '../types/lesson.types';

class GrammarService {
  // ==========================================
  // CORE GRAMMAR (Admin & Learner)
  // ==========================================

  static async getAllGrammars(params?: GetGrammarParams): Promise<GetGrammarsResponse> {
    try {
      const response = await apiClient.get<GetGrammarsResponse>(API_ENDPOINTS.GRAMMAR.GET_ALL, { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async createGrammar(data: CreateGrammarRequest): Promise<GrammarDetailResponse> {
    try {
      const response = await apiClient.post<GrammarDetailResponse>(API_ENDPOINTS.GRAMMAR.CREATE, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async importGrammars(data: ImportGrammarRequest): Promise<any> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.GRAMMAR.IMPORT, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async getGrammarById(id: string): Promise<GrammarDetailResponse> {
    try {
      const response = await apiClient.get<GrammarDetailResponse>(API_ENDPOINTS.GRAMMAR.GET_BY_ID(id));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async updateGrammar(id: string, data: UpdateGrammarRequest): Promise<GrammarDetailResponse> {
    try {
      const response = await apiClient.patch<GrammarDetailResponse>(API_ENDPOINTS.GRAMMAR.UPDATE(id), data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async deleteGrammar(id: string): Promise<DeleteResponse> {
    try {
      const response = await apiClient.delete<DeleteResponse>(API_ENDPOINTS.GRAMMAR.DELETE(id));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async publishGrammar(id: string): Promise<GrammarDetailResponse> {
    try {
      const response = await apiClient.patch<GrammarDetailResponse>(API_ENDPOINTS.GRAMMAR.PUBLISH(id));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async getSimilarGrammars(id: string): Promise<GetSimilarGrammarsResponse> {
    try {
      const response = await apiClient.get<GetSimilarGrammarsResponse>(API_ENDPOINTS.GRAMMAR.SIMILAR(id));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async getGrammarDetail(id: string): Promise<GrammarDetailResponse> {
    try {
      const response = await apiClient.get<GrammarDetailResponse>(API_ENDPOINTS.GRAMMAR.DETAIL(id));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async getGrammarExercises(grammarId: string) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GRAMMAR.EXERCISE(grammarId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async checkGrammarExercise(id: string, data: CheckGrammarExerciseRequest): Promise<CheckGrammarExerciseResponse> {
    try {
      const response = await apiClient.post<CheckGrammarExerciseResponse>(API_ENDPOINTS.GRAMMAR.EXERCISE_CHECK(id), data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  // ==========================================
  // QUIZZES (Admin)
  // ==========================================

  static async getGrammarQuizzes(params?: GetGrammarQuizParams): Promise<GetGrammarQuizzesResponse> {
    try {
      const response = await apiClient.get<GetGrammarQuizzesResponse>(API_ENDPOINTS.GRAMMAR.QUIZZES, { params });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async createGrammarQuiz(data: CreateGrammarQuizRequest): Promise<GrammarQuizDetailResponse> {
    try {
      const response = await apiClient.post<GrammarQuizDetailResponse>(API_ENDPOINTS.GRAMMAR.CREATE_QUIZ, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async getGrammarQuizById(quizId: string): Promise<GrammarQuizDetailResponse> {
    try {
      const response = await apiClient.get<GrammarQuizDetailResponse>(API_ENDPOINTS.GRAMMAR.QUIZ_BY_ID(quizId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async updateGrammarQuiz(quizId: string, data: UpdateGrammarQuizRequest): Promise<GrammarQuizDetailResponse> {
    try {
      const response = await apiClient.patch<GrammarQuizDetailResponse>(API_ENDPOINTS.GRAMMAR.UPDATE_QUIZ(quizId), data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async addGrammarQuizItems(quizId: string, data: GrammarQuizItemsRequest): Promise<GrammarQuizDetailResponse> {
    try {
      const response = await apiClient.patch<GrammarQuizDetailResponse>(API_ENDPOINTS.GRAMMAR.QUIZ_ITEMS(quizId), data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async removeGrammarQuizItems(quizId: string, data: GrammarQuizItemsRequest): Promise<GrammarQuizDetailResponse> {
    try {
      const response = await apiClient.delete<GrammarQuizDetailResponse>(API_ENDPOINTS.GRAMMAR.QUIZ_ITEMS(quizId), { data });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async reorderGrammarQuizItems(quizId: string, data: GrammarQuizItemsRequest): Promise<GrammarQuizDetailResponse> {
    try {
      const response = await apiClient.patch<GrammarQuizDetailResponse>(API_ENDPOINTS.GRAMMAR.QUIZ_ITEMS_REORDER(quizId), data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async publishGrammarQuiz(quizId: string): Promise<GrammarQuizDetailResponse> {
    try {
      const response = await apiClient.patch<GrammarQuizDetailResponse>(API_ENDPOINTS.GRAMMAR.QUIZ_PUBLISH(quizId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  // ==========================================
  // QUIZ SESSIONS (Student)
  // ==========================================

  static async startGrammarQuiz(payload: StartGrammarQuizRequest): Promise<StartGrammarQuizResponse> {
    try {
      const response = await apiClient.post<StartGrammarQuizResponse>(API_ENDPOINTS.GRAMMAR.QUIZ_START, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async getGrammarQuizSession(sessionId: string): Promise<GrammarQuizSessionResponse> {
    try {
      const response = await apiClient.get<GrammarQuizSessionResponse>(API_ENDPOINTS.GRAMMAR.QUIZ_SESSION(sessionId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async saveGrammarQuizAnswer(sessionId: string, payload: SaveGrammarQuizAnswerRequest & { timeSpent?: number }) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.GRAMMAR.QUIZ_SAVE_ANSWER(sessionId), payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async submitGrammarQuiz(sessionId: string, payload?: SubmitGrammarQuizRequest): Promise<GrammarQuizSessionResponse> {
    try {
      const response = await apiClient.post<GrammarQuizSessionResponse>(API_ENDPOINTS.GRAMMAR.QUIZ_SUBMIT(sessionId), payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async getGrammarQuizResult(sessionId: string): Promise<GrammarQuizSessionResponse> {
    try {
      const response = await apiClient.get<GrammarQuizSessionResponse>(API_ENDPOINTS.GRAMMAR.QUIZ_RESULT(sessionId));
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  // ==========================================
  // LESSON INTEGRATION
  // ==========================================

  static async getLessonGrammar(lessonId: string): Promise<Grammar[]> {
    try {
      const response = await apiClient.get<LessonModulesResponse>(API_ENDPOINTS.LESSON.GET_MODULES(lessonId));
      return (response.data?.data?.grammar as unknown as Grammar[]) || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }

  static async updateGrammarProgress(lessonId: string, grammarId: string, status: 'learning' | 'completed') {
    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.LESSON.UPDATE_SECTION_PROGRESS(lessonId, 'grammar', grammarId),
        { 
          status,
          resultKind: 'Manual',
          title: 'Học ngữ pháp' 
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) throw error.response?.data || error;
      throw error;
    }
  }
}

export default GrammarService;