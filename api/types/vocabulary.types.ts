/**
 * Định nghĩa các TypeScript Interfaces/Types cho module Vocabulary dành cho học viên.
 */

// --- 1. Base Response ---

export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

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

export interface MarkStatusRequest {
  status: 'learning' | 'remembered' | 'forgotten';
  answer?: string;
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

// --- 5. Vocabulary Quiz Types ---

/**
 * Câu hỏi trong vocabulary quiz
 */
export interface VocabularyQuizQuestion {
  _id: string;
  vocabulary: Vocabulary;
  question: {
    _id: string;
    type: 'single_choice' | 'short_answer';
    question: string;
    options?: string[];
    correctAnswer: string;
    points: number;
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

// Export tất cả các type cần dùng
export type {
  VocabularyQuizQuestion as VocabularyQuizQuestionType,
  VocabularyQuizSession as VocabularyQuizSessionType
};