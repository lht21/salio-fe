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
  lastReviewedAt?: string; // ISO Date String
  nextReviewAt?: string;   // ISO Date String
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