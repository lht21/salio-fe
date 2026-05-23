import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  LessonListResponse,
  LessonModulesResponse,
  LessonProgressResponse,
  UpdateLessonProgressRequest,
  ListeningItem,
  BaseResponse,
  SpeakingItem, 
  SpeakingSubmissionResponse,
  WritingSubmissionResponse,
  WritingItem,
  QuizAnswer,
  FinalTestResponse,
  QuizSession,
} from '../types/lesson.types';

class LessonService {
  static async getAll(params?: { page?: number; limit?: number; level?: string }): Promise<LessonListResponse> {
    const response = await apiClient.get<LessonListResponse>(API_ENDPOINTS.LESSON.GET_ALL, { params });
    return response.data;
  }
  
  static async getLessonById(lessonId: string): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.LESSON.GET_BY_ID(lessonId));
    return response.data;
  }

  static async getModules(lessonId: string): Promise<LessonModulesResponse> {
    const response = await apiClient.get<LessonModulesResponse>(API_ENDPOINTS.LESSON.GET_MODULES(lessonId));
    return response.data;
  }

  static async getProgress(lessonId: string): Promise<LessonProgressResponse> {
    const response = await apiClient.get<LessonProgressResponse>(API_ENDPOINTS.LESSON.GET_PROGRESS(lessonId));
    return response.data;
  }

  static async start(lessonId: string): Promise<LessonProgressResponse> {
    const response = await apiClient.post<LessonProgressResponse>(API_ENDPOINTS.LESSON.START(lessonId), {});
    return response.data;
  }

  static async complete(lessonId: string): Promise<LessonProgressResponse> {
    const response = await apiClient.post<LessonProgressResponse>(API_ENDPOINTS.LESSON.COMPLETE(lessonId), {});
    return response.data;
  }

  static async updateSectionItem(
    lessonId: string,
    sectionType: string,
    itemId: string,
    data: UpdateLessonProgressRequest
      ): Promise<LessonProgressResponse> {
        const response = await apiClient.patch<LessonProgressResponse>(
        API_ENDPOINTS.LESSON.UPDATE_SECTION_ITEM(lessonId, sectionType, itemId),
        data
      );
      return response.data;
    }

  static async getSkillItem<T = any>(lessonId: string, sectionType: string, itemId: string): Promise<T> {
    const response = await apiClient.get<BaseResponse<T>>(
      `/api/v1/lessons/${lessonId}/skills/${sectionType}/${itemId}`
    );
    return response.data.data; 
  }
    static async getLessonProgress(lessonId: string) {
    const response = await apiClient.get(`/api/v1/lessons/${lessonId}/progress`);
    return response.data.data;
  }

  static async submitSkillItem(
    lessonId: string, 
    sectionType: string, 
    itemId: string, 
    data: { answers?: any[], content?: string, timeSpent?: number } // Thêm content ở đây
  ) {
    const response = await apiClient.post<BaseResponse<any>>(
      `/api/v1/lessons/${lessonId}/skills/${sectionType}/${itemId}/submit`,
      data
    );
    return response.data.data; 
  }
  //hàm lấy kết quả bài tập kỹ năng (Listening/Reading).
  static async getSkillResult(lessonId: string, sectionType: string, itemId: string) {
    const response = await apiClient.get<BaseResponse<any>>(
      `/api/v1/lessons/${lessonId}/skills/${sectionType}/${itemId}/result`
    );
    return response.data.data; 
  }

    // Lấy danh sách bài tập Speaking của Lesson
  static async getSpeakingItems(lessonId: string): Promise<SpeakingItem[]> {
    const response = await apiClient.get(`/api/v1/lessons/${lessonId}/modules`);
    return response.data.data.speaking;
  }

  static async submitAudio(
    lessonId: string, 
    itemId: string, 
    uri: string, 
    duration: number
  ): Promise<SpeakingSubmissionResponse> {
    const formData = new FormData();
    
    const filename = uri.split('/').pop() || 'recording.m4a';
    const match = /\.(\w+)$/.exec(filename);
    const extension = match?.[1]?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      mp3: 'audio/mpeg',
      mpeg: 'audio/mpeg',
      mpga: 'audio/mpeg',
      wav: 'audio/wav',
      webm: 'audio/webm',
      ogg: 'audio/ogg',
      oga: 'audio/ogg',
      m4a: 'audio/mp4',
      mp4: 'audio/mp4',
      aac: 'audio/aac',
      caf: 'audio/x-caf',
      flac: 'audio/flac',
      '3gp': 'audio/3gpp',
      '3gpp': 'audio/3gpp',
      amr: 'audio/amr',
    };
    const type = extension ? (mimeTypes[extension] || 'audio/mpeg') : 'audio/mp4';

    // @ts-ignore: React Native FormData requires this structure
    formData.append('file', { uri, name: filename, type });
    formData.append('recordingDuration', (duration / 1000).toString()); 
    formData.append('timeSpent', '0'); 

    const response = await apiClient.post(
      `/api/v1/lessons/${lessonId}/skills/speaking/${itemId}/submit-audio`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      }
    );
    return response.data.data;
  }

  static async getWritingItem(lessonId: string, itemId: string): Promise<WritingItem> {
  const response = await apiClient.get<BaseResponse<WritingItem>>(
    `/api/v1/lessons/${lessonId}/skills/writing/${itemId}`
  );
  return response.data.data;
}

  static async submitWriting(
    lessonId: string, 
    itemId: string, 
    data: { content: string; timeSpent: number }
  ): Promise<WritingSubmissionResponse> {
    const response = await apiClient.post<BaseResponse<WritingSubmissionResponse>>(
      `/api/v1/lessons/${lessonId}/skills/writing/${itemId}/submit`,
      data
    );
    return response.data.data;
  }

  static async getWritingResult(lessonId: string, itemId: string): Promise<WritingSubmissionResponse['submission']> {
    const response = await apiClient.get<BaseResponse<any>>(
      `/api/v1/lessons/${lessonId}/skills/writing/${itemId}/result`
    );
    return response.data.data;
  }

  static async startFinalTest(lessonId: string): Promise<{ sessionId: string }> {
    const response = await apiClient.post<BaseResponse<{ sessionId: string }>>(
      `/api/v1/lessons/${lessonId}/final-test/start`
    );
    return response.data.data;
  }

  static async getFinalTestSession(lessonId: string, sessionId: string): Promise<FinalTestResponse> {
    const response = await apiClient.get<BaseResponse<FinalTestResponse>>(
      `/api/v1/lessons/${lessonId}/final-test/session/${sessionId}`
    );
    return response.data.data;
  }

  static async saveFinalTestAnswer(
    lessonId: string, 
    sessionId: string, 
    data: { 
      sectionType: string; 
      itemId: string; 
      questionId: string; 
      userAnswer: any;  
      timeSpent?: number;
    }
  ): Promise<any> {
    const payload = {
      sectionType: data.sectionType,
      itemId: data.itemId,
      questionId: data.questionId,
      answer: data.userAnswer, 
      timeSpent: data.timeSpent || 0
    };
    console.log('Saving answer payload:', payload); 
    const response = await apiClient.post(
      `/api/v1/lessons/${lessonId}/final-test/session/${sessionId}/save-answer`,
      payload
    );
    return response.data;
  }

  static async submitFinalTest(
    lessonId: string, 
    sessionId: string, 
    data: { timeSpent: number }
  ): Promise<QuizSession> {
    const response = await apiClient.post<BaseResponse<QuizSession>>(
      `/api/v1/lessons/${lessonId}/final-test/session/${sessionId}/submit`,
      data
    );
    return response.data.data;
  }

  static async getFinalTestResult(lessonId: string, sessionId: string): Promise<FinalTestResponse> {
    const response = await apiClient.get<BaseResponse<FinalTestResponse>>(
      `/api/v1/lessons/${lessonId}/final-test/session/${sessionId}/result`
    );
    return response.data.data;
  }
}

export default LessonService;
