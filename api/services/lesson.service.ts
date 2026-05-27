import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  LessonListResponse,
  LessonModulesResponse,
  LessonProgressResponse,
  BaseResponse,
  SpeakingSubmissionResponse,
  WritingSubmissionResponse,
  FinalTestResponse,
  GetLessonsParams,
  CreateLessonRequest,
  LessonMutationResponse,
  UpdateLessonRequest,
  ReorderLessonsRequest,
  CreateLessonFinalTestRequest,
  AssembleLessonFinalTestRequest,
  ReorderLessonFinalTestItemsRequest,
  RemoveLessonFinalTestItemsRequest,
  SaveLessonFinalTestAnswerRequest,
  SubmitLessonFinalTestSessionRequest,
  UpdateLessonSectionProgressRequest,
  SubmitLessonSkillItemRequest,
  EvaluateLessonSpeakingSubmissionRequest,
  AddLessonModuleRequest,
  LessonDetailResponse,
  LessonFinalTestResponse,
  LessonFinalTestSessionResponse
} from '../types/lesson.types';

class LessonService {
  static async getAll(params?: GetLessonsParams): Promise<LessonListResponse> {
    try {
      const response = await apiClient.get<LessonListResponse>(API_ENDPOINTS.LESSON.GET_ALL, { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
  
  static async create(data: CreateLessonRequest): Promise<LessonMutationResponse> {
    try {
      const response = await apiClient.post<LessonMutationResponse>(API_ENDPOINTS.LESSON.CREATE, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async reorder(data: ReorderLessonsRequest): Promise<BaseResponse<null>> {
    try {
      const response = await apiClient.patch<BaseResponse<null>>(API_ENDPOINTS.LESSON.REORDER, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  // --- Final Test ---

  static async getFinalTest(lessonId: string): Promise<LessonFinalTestResponse> {
    try {
      const response = await apiClient.get<LessonFinalTestResponse>(API_ENDPOINTS.LESSON.GET_FINAL_TEST(lessonId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async createFinalTest(lessonId: string, data: CreateLessonFinalTestRequest): Promise<BaseResponse<any>> {
    try {
      const response = await apiClient.post<BaseResponse<any>>(API_ENDPOINTS.LESSON.CREATE_FINAL_TEST(lessonId), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async assembleFinalTest(lessonId: string, data: AssembleLessonFinalTestRequest): Promise<BaseResponse<any>> {
    try {
      const response = await apiClient.patch<BaseResponse<any>>(API_ENDPOINTS.LESSON.ASSEMBLE_FINAL_TEST(lessonId), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async reorderFinalTestItems(lessonId: string, data: ReorderLessonFinalTestItemsRequest): Promise<BaseResponse<any>> {
    try {
      const response = await apiClient.patch<BaseResponse<any>>(API_ENDPOINTS.LESSON.REORDER_FINAL_TEST_ITEMS(lessonId), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async removeFinalTestItems(lessonId: string, data: RemoveLessonFinalTestItemsRequest): Promise<BaseResponse<any>> {
    try {
      const response = await apiClient.patch<BaseResponse<any>>(API_ENDPOINTS.LESSON.REMOVE_FINAL_TEST_ITEMS(lessonId), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async startFinalTest(lessonId: string): Promise<BaseResponse<{ sessionId: string }>> {
    try {
      const response = await apiClient.post<BaseResponse<{ sessionId: string }>>(API_ENDPOINTS.LESSON.START_FINAL_TEST(lessonId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async getFinalTestSession(lessonId: string, sessionId: string): Promise<LessonFinalTestSessionResponse> {
    try {
      const response = await apiClient.get<LessonFinalTestSessionResponse>(API_ENDPOINTS.LESSON.GET_FINAL_TEST_SESSION(lessonId, sessionId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async saveFinalTestAnswer(lessonId: string, sessionId: string, data: SaveLessonFinalTestAnswerRequest): Promise<BaseResponse<null>> {
    try {
      const response = await apiClient.post<BaseResponse<null>>(API_ENDPOINTS.LESSON.SAVE_FINAL_TEST_ANSWER(lessonId, sessionId), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async submitFinalTest(lessonId: string, sessionId: string, data: SubmitLessonFinalTestSessionRequest): Promise<LessonFinalTestSessionResponse> {
    try {
      const response = await apiClient.post<LessonFinalTestSessionResponse>(API_ENDPOINTS.LESSON.SUBMIT_FINAL_TEST(lessonId, sessionId), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async getFinalTestResult(lessonId: string, sessionId: string): Promise<LessonFinalTestResponse> {
    try {
      const response = await apiClient.get<LessonFinalTestResponse>(API_ENDPOINTS.LESSON.GET_FINAL_TEST_RESULT(lessonId, sessionId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  // --- Core CRUD ---

  static async getById(id: string): Promise<LessonDetailResponse> {
    try {
      const response = await apiClient.get<LessonDetailResponse>(API_ENDPOINTS.LESSON.GET_BY_ID(id));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async update(id: string, data: UpdateLessonRequest): Promise<LessonMutationResponse> {
    try {
      const response = await apiClient.patch<LessonMutationResponse>(API_ENDPOINTS.LESSON.UPDATE(id), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async delete(id: string): Promise<BaseResponse<null>> {
    try {
      const response = await apiClient.delete<BaseResponse<null>>(API_ENDPOINTS.LESSON.DELETE(id));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async publish(id: string): Promise<LessonMutationResponse> {
    try {
      const response = await apiClient.patch<LessonMutationResponse>(API_ENDPOINTS.LESSON.PUBLISH(id));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async unpublish(id: string): Promise<LessonMutationResponse> {
    try {
      const response = await apiClient.patch<LessonMutationResponse>(API_ENDPOINTS.LESSON.UNPUBLISH(id));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  // --- Progress & Skills ---

  static async getProgress(lessonId: string): Promise<LessonProgressResponse> {
    try {
      const response = await apiClient.get<LessonProgressResponse>(API_ENDPOINTS.LESSON.GET_PROGRESS(lessonId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async updateSectionProgress(
    lessonId: string,
    sectionType: string,
    itemId: string,
    data: UpdateLessonSectionProgressRequest
  ): Promise<LessonProgressResponse> {
    try {
      const response = await apiClient.patch<LessonProgressResponse>(
        API_ENDPOINTS.LESSON.UPDATE_SECTION_PROGRESS(lessonId, sectionType, itemId),
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async getSkillItem<T = any>(lessonId: string, sectionType: string, itemId: string): Promise<BaseResponse<T>> {
    try {
      const response = await apiClient.get<BaseResponse<T>>(API_ENDPOINTS.LESSON.GET_SKILL_ITEM(lessonId, sectionType, itemId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async submitSkillItem(
    lessonId: string,
    sectionType: string,
    itemId: string,
    data: SubmitLessonSkillItemRequest
  ): Promise<BaseResponse<any>> {
    try {
      const response = await apiClient.post<BaseResponse<any>>(
        API_ENDPOINTS.LESSON.SUBMIT_SKILL_ITEM(lessonId, sectionType, itemId),
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async submitAudio(
    lessonId: string,
    itemId: string,
    uri: string,
    duration: number
  ): Promise<BaseResponse<any>> {
    try {
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

      const response = await apiClient.post<BaseResponse<any>>(
        API_ENDPOINTS.LESSON.SUBMIT_SPEAKING_AUDIO(lessonId, itemId),
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 120000,
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async evaluateSpeakingSubmission(
    lessonId: string,
    itemId: string,
    submissionId: string,
    data: EvaluateLessonSpeakingSubmissionRequest
  ): Promise<BaseResponse<any>> {
    try {
      const response = await apiClient.patch<BaseResponse<any>>(
        API_ENDPOINTS.LESSON.EVALUATE_SPEAKING_SUBMISSION(lessonId, itemId, submissionId),
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async getSkillResult<T = any>(lessonId: string, sectionType: string, itemId: string): Promise<BaseResponse<T>> {
    try {
      const response = await apiClient.get<BaseResponse<T>>(API_ENDPOINTS.LESSON.GET_SKILL_RESULT(lessonId, sectionType, itemId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async start(lessonId: string): Promise<LessonProgressResponse> {
    try {
      const response = await apiClient.post<LessonProgressResponse>(API_ENDPOINTS.LESSON.START(lessonId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async complete(lessonId: string): Promise<LessonProgressResponse> {
    try {
      const response = await apiClient.post<LessonProgressResponse>(API_ENDPOINTS.LESSON.COMPLETE(lessonId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  // --- Modules ---

  static async getModules(lessonId: string): Promise<LessonModulesResponse> {
    try {
      const response = await apiClient.get<LessonModulesResponse>(API_ENDPOINTS.LESSON.GET_MODULES(lessonId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async addModule(lessonId: string, data: AddLessonModuleRequest): Promise<BaseResponse<any>> {
    try {
      const response = await apiClient.post<BaseResponse<any>>(API_ENDPOINTS.LESSON.ADD_MODULE(lessonId), data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async removeModule(lessonId: string, moduleType: string, moduleId: string): Promise<BaseResponse<any>> {
    try {
      const response = await apiClient.delete<BaseResponse<any>>(API_ENDPOINTS.LESSON.REMOVE_MODULE(lessonId, moduleType, moduleId));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}

export default LessonService;
