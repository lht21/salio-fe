import { BaseResponse } from './auth.types';

export type PlacementSectionType = "quiz" | "listening" | "reading";
export type PlacementQuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "matching"
  | "short_answer";

export interface PlacementQuestion {
  _id: string;
  type: PlacementQuestionType;
  points?: number;
  audioUrl?: string;
  imageUrl?: string;
  questionText?: string;
  metadata?: {
    options?: string[];
    matchingPairs?: Array<{ bottomItem?: string; topItem?: string }>;
    blankCount?: number;
  };
}

export interface PlacementListeningItem {
  _id: string;
  title: string;
  audioUrl?: string;
  duration?: number;
  questions?: PlacementQuestion[];
  level?: string;
}

export interface PlacementReadingItem {
  _id: string;
  title: string;
  content?: string;
  translation?: string;
  questions?: PlacementQuestion[];
  level?: string;
}

export interface LevelRule {
  minPercent: number;
  maxPercent: number;
  level: string;
  skipLessonOrderUpTo?: number;
  skippedLessons?: string[] | PlacementLesson[];
}

export interface PlacementQuiz {
  _id: string;
  title: string;
  description?: string;
  type: "placement";
  questions?: PlacementQuestion[];
  sections?: {
    listening?: PlacementListeningItem[];
    reading?: PlacementReadingItem[];
  };
  passingScore?: number;
  timeLimit?: number;
  placementConfig?: {
    levelRules: LevelRule[];
  };
}

export interface PlacementAnswer {
  sectionType: PlacementSectionType;
  itemId?: string;
  questionId: string;
  userAnswer: unknown;
  isCorrect?: boolean;
  points?: number;
}

export interface PlacementLesson {
  _id: string;
  code?: string;
  title: string;
  level?: string;
  order?: number;
  description?: string;
  thumbnail?: string;
}

export interface PlacementSession {
  _id: string;
  user: string;
  quiz: string;
  purpose: "placement";
  status: "in_progress" | "completed" | "abandoned";
  answers: PlacementAnswer[];
  totalScore?: number;
  maxScore?: number;
  percentage?: number;
  passed?: boolean;
  recommendedLevel?: string;
  skipLessonOrderUpTo?: number;
  skippedLessons?: PlacementLesson[];
  timeSpent?: number;
  startedAt?: string;
  submittedAt?: string;
}

export interface PlacementSessionData {
  session: PlacementSession;
  quiz: PlacementQuiz;
}

export interface StartPlacementTestData {
  sessionId: string;
}

export interface SavePlacementAnswerRequest {
  sectionType: PlacementSectionType;
  itemId?: string;
  questionId: string;
  answer: unknown;
  timeSpent?: number;
}

export interface SubmitPlacementRequest {
  timeSpent?: number;
}

export interface SkippedLessonsData {
  recommendedLevel?: string;
  skippedLessons: PlacementLesson[];
}

// --- Admin Request & Params Types ---
export interface AssemblePlacementTestRequest {
  sectionType: "listening" | "reading";
  itemIds: string[];
  mode?: "append" | "replace";
}

export interface ReorderPlacementQuestionsRequest {
  sectionType: "listening" | "reading";
  itemIds: string[];
}

export interface RemovePlacementItemsRequest {
  sectionType: "listening" | "reading";
  itemIds: string[];
}

export interface GetPlacementSessionsParams {
  page?: number;
  limit?: number;
}

export interface PaginatedPlacementSessions {
  sessions: PlacementSession[];
  total: number;
  page: number;
  pages: number;
}

// --- Response Types ---
export type StartPlacementTestResponse = BaseResponse<StartPlacementTestData>;
export type PlacementSessionResponse = BaseResponse<PlacementSessionData>;
export type SavePlacementAnswerResponse = BaseResponse<null>;
export type SubmitPlacementResponse = BaseResponse<PlacementSession>;
export type PlacementResultResponse = BaseResponse<PlacementSession>;
export type SkippedLessonsResponse = BaseResponse<SkippedLessonsData>;

// --- Admin Response Types ---
export type PlacementTestConfigResponse = BaseResponse<PlacementQuiz>;
export type AssemblePlacementTestResponse = BaseResponse<null>;
export type ReorderPlacementQuestionsResponse = BaseResponse<null>;
export type RemovePlacementItemsResponse = BaseResponse<null>;
export type PlacementSessionsListResponse = BaseResponse<PaginatedPlacementSessions>;
export type PlacementSessionDetailResponse = BaseResponse<PlacementSession>;
