/**
 * Định nghĩa các TypeScript Interfaces/Types cho module Vocabulary dành cho học viên.
 */

import { BaseResponse } from './auth.types';

// --- 2. Core Models ---

export interface VocabularyExample {
  korean: string;
  vietnamese: string;
}

export interface Vocabulary {
  _id: string;
  word: string;
  meaning: string;
  pronunciationText?: string;
  type?: string;
  isSinoKorean?: boolean;
  hanja?: string;
  sinoVietnamese?: string;
  imageUrl?: string;
  level?: string;
  category?: string;
  isActive?: boolean;
  examples?: VocabularyExample[];
}

export interface LearningStatus {
  status: 'learning' | 'remembered' | 'forgotten';
  reviewCount: number;
  correctCount: number;
  wrongCount: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
}

export interface VocabularyProgressItem {
  _id: string;
  user: string;
  vocabulary: Vocabulary;
  status: 'learning' | 'remembered' | 'forgotten';
  reviewCount: number;
  correctCount: number;
  wrongCount: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  lastAnswer?: string;
}

export interface StudyQueueItem extends Vocabulary {
  learningStatus: LearningStatus;
}

// --- 3. Request Payloads ---

export interface GetVocabulariesRequest {
  page?: number;
  limit?: number;
  level?: string;
  category?: string;
  search?: string;
  isActive?: boolean;
  lessonId?: string;
}

export interface GetStudyQueueParams {
  lessonId?: string;
  level?: string;
  category?: string;
  status?: 'learning' | 'remembered' | 'forgotten';
  limit?: number;
}

export interface GetLearningProgressParams {
  status?: 'learning' | 'remembered' | 'forgotten';
  page?: number;
  limit?: number;
}

export interface MarkStatusRequest {
  status: 'learning' | 'remembered' | 'forgotten';
  answer?: string;
  lessonId?: string; // Thêm lessonId để khớp với controller
}

export interface CreateVocabularyRequest {
  word: string;
  meaning: string;
  pronunciationText?: string;
  type?: 'noun' | 'verb' | 'adjective' | 'adverb';
  isSinoKorean?: boolean;
  hanja?: string;
  sinoVietnamese?: string;
  imageUrl?: string;
  level?: 'Sơ cấp 1' | 'Sơ cấp 2' | 'Trung cấp 3' | 'Trung cấp 4' | 'Cao cấp 5' | 'Cao cấp 6' | string;
  category?: string;
  examples?: VocabularyExample[];
  isActive?: boolean;
}

export interface UpdateVocabularyRequest extends Partial<CreateVocabularyRequest> {}

export interface BulkUpdateVocabularyImagesRequest {
  updates: Array<{ id: string; imageUrl: string }>;
}

// --- 4. Response Data Structures ---

export interface PaginatedVocabulariesData {
  vocabularies: Vocabulary[];
  total: number;
  page: number;
  pages: number;
}

export type PaginatedVocabulariesResponse = BaseResponse<PaginatedVocabulariesData>;
export type StudyQueueResponse = BaseResponse<StudyQueueItem[]>;
export type VocabularyDetailResponse = BaseResponse<Vocabulary>;
export type VocabularyMutationResponse = BaseResponse<Vocabulary>;

export type MarkVocabularyStatusResponse = BaseResponse<VocabularyProgressItem>;

export type GetLearningProgressResponse = BaseResponse<{
  progress: VocabularyProgressItem[];
  total: number;
  page: number;
  pages: number;
}>;

export type ImportVocabulariesResponse = BaseResponse<{
  importedCount: number;
  skippedCount: number;
}>;

export type BulkUpdateImagesResponse = BaseResponse<{
  successCount: number;
}>;

// --- 5. Vocabulary Quiz Types ---

export interface VocabularyQuiz {
  _id: string;
  title: string;
  description?: string;
  level?: string;
  category?: string;
  timeLimit?: number;
  passingScore?: number;
  isActive?: boolean;
  items: string[] | any[];
  createdBy?: string | any;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Câu hỏi trong vocabulary quiz
 */
export interface VocabularyQuizQuestion {
  _id: string;
  vocabulary: Vocabulary;
  question: {
    _id: string;
    type: 'single_choice' | 'short_answer';
    questionText: string; // FIX: Đổi tên từ 'question'
    options?: string[];
    correctAnswer?: string; // FIX: Chuyển thành optional
    points: number;
    metadata?: any; // FIX: Thêm metadata
  };
  userAnswer?: string;
  isCorrect?: boolean;
}

/**
 * Phiên làm vocabulary quiz
 */
export interface VocabularyQuizSession {
  _id: string;
  user: string;
  quiz: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  questions: VocabularyQuizQuestion[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  startedAt: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetVocabularyQuizzesParams {
  level?: string;
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateVocabularyQuizRequest {
  title: string;
  description?: string;
  level?: string;
  category?: string;
  timeLimit?: number;
  passingScore?: number;
  isActive?: boolean;
  itemIds: string[];
}

export interface UpdateVocabularyQuizRequest extends Partial<CreateVocabularyQuizRequest> {}

export interface ModifyVocabularyQuizItemsRequest {
  itemIds: string[];
}

export interface GetVocabularyQuizResultsParams {
  lessonId?: string;
  page?: number;
  limit?: number;
}

/**
 * Request để start vocabulary quiz
 */
export interface StartVocabularyQuizRequest {
  lessonId?: string;
  quizId?: string;
  level?: string;
  category?: string;
  limit?: number;
}

/**
 * Request để lưu đáp án
 */
export interface SaveVocabularyAnswerRequest {
  questionId: string;
  answer: string;
  timeSpent?: number;
}

export interface SubmitVocabularyQuizRequest {
  timeSpent?: number;
}

export type PaginatedVocabularyQuizzesResponse = BaseResponse<{
  quizzes: VocabularyQuiz[];
  total: number;
  page: number;
  pages: number;
}>;

export type VocabularyQuizDetailResponse = BaseResponse<VocabularyQuiz>;
export type VocabularyQuizMutationResponse = BaseResponse<VocabularyQuiz>;

export type PaginatedVocabularyQuizResultsResponse = BaseResponse<{
  sessions: VocabularyQuizSession[];
  total: number;
  page: number;
  pages: number;
}>;

/**
 * Response từ API start quiz
 */
export type StartVocabularyQuizResponse = BaseResponse<{ sessionId: string }>;

/**
 * Response từ API get session
 */
export type GetVocabularyQuizSessionResponse = BaseResponse<VocabularyQuizSession>;

/**
 * Response từ API save answer
 */
export type SaveVocabularyAnswerResponse = BaseResponse<null>;

/**
 * Response từ API submit quiz
 */
export type SubmitVocabularyQuizResponse = BaseResponse<VocabularyQuizSession>;

/**
 * Response từ API get quiz result
 */
export type GetVocabularyQuizResultResponse = BaseResponse<VocabularyQuizSession>;

// Export tất cả các type cần dùng
export type {
  VocabularyQuizQuestion as VocabularyQuizQuestionType,
  VocabularyQuizSession as VocabularyQuizSessionType
};