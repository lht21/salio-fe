import apiClient from "../client";
import { API_ENDPOINTS } from "../endpoints";
import {
  PlacementResultResponse,
  PlacementSessionResponse,
  SavePlacementAnswerRequest,
  SavePlacementAnswerResponse,
  SkippedLessonsResponse,
  StartPlacementTestResponse,
  SubmitPlacementRequest,
  SubmitPlacementResponse
} from "../types/placement-test.types";

class PlacementTestService {
  static async start(): Promise<StartPlacementTestResponse> {
    try {
      const response = await apiClient.post<StartPlacementTestResponse>(
        API_ENDPOINTS.PLACEMENT_TEST.START,
        {}
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async getSession(sessionId: string): Promise<PlacementSessionResponse> {
    try {
      const response = await apiClient.get<PlacementSessionResponse>(
        API_ENDPOINTS.PLACEMENT_TEST.GET_SESSION(sessionId)
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async saveAnswer(
    sessionId: string,
    payload: SavePlacementAnswerRequest
  ): Promise<SavePlacementAnswerResponse> {
    try {
      const response = await apiClient.post<SavePlacementAnswerResponse>(
        API_ENDPOINTS.PLACEMENT_TEST.SAVE_ANSWER(sessionId),
        payload
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async submit(
    sessionId: string,
    payload: SubmitPlacementRequest = {}
  ): Promise<SubmitPlacementResponse> {
    try {
      const response = await apiClient.post<SubmitPlacementResponse>(
        API_ENDPOINTS.PLACEMENT_TEST.SUBMIT(sessionId),
        payload
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async getResult(sessionId: string): Promise<PlacementResultResponse> {
    try {
      const response = await apiClient.get<PlacementResultResponse>(
        API_ENDPOINTS.PLACEMENT_TEST.GET_RESULT(sessionId)
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  static async getSkippedLessons(sessionId: string): Promise<SkippedLessonsResponse> {
    try {
      const response = await apiClient.get<SkippedLessonsResponse>(
        API_ENDPOINTS.PLACEMENT_TEST.GET_SKIPPED_LESSONS(sessionId)
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}

export default PlacementTestService;
