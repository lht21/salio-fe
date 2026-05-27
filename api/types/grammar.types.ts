/**
 * Định nghĩa các TypeScript Interfaces/Types cho module Grammar.
 * Dựa trên cấu trúc từ Swagger trong file grammarRoutes.js.
 */

import { BaseResponse } from './auth.types';

// ==========================================
// MODELS
// ==========================================

export interface GrammarExercise {
  clientId?: string | number;
  type: 'whiteboard' | 'word_match';
  instruction?: string;
  // Các field cho whiteboard
  correctAnswerStr?: string;
  sentenceLeft?: string;
  sentenceRight?: string;
  vietnameseMeaning?: string;
  maxLength?: number;
  placeholder?: string;
  // Các field cho word_match
  vietnamesePrompt?: string;
  words?: string[];
  correctOrder?: string[];
}

export interface Grammar {
  _id: string;
  structure: string;
  meaning: string;
  explanation: string;
  usage?: string;
  exampleSentences?: { korean: string; vietnamese: string }[];
  exercises?: GrammarExercise[];
  level?: string;
  tags?: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GrammarQuiz {
  _id: string;
  title: string;
  grammar?: string | string[];
  level?: string;
  category?: string;
  items: string[]; 
  isActive: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GrammarQuizSession {
  _id: string;
  user: string;
  quiz: string | GrammarQuiz;
  status: 'in_progress' | 'completed' | 'abandoned';
  questions: any[]; 
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  startedAt: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// REQUEST PARAMS & QUERIES
// ==========================================

export interface GetGrammarParams {
  search?: string;
  level?: string;
  tags?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface GetGrammarQuizParams {
  grammarId?: string;
  level?: string;
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// ==========================================
// REQUEST BODIES
// ==========================================

export interface CreateGrammarRequest {
  structure: string;
  meaning: string;
  explanation: string;
  usage?: string;
  exampleSentences?: { korean: string; vietnamese: string }[];
  exercises?: GrammarExercise[];
  level?: string;
  tags?: string[];
}

export interface UpdateGrammarRequest extends Partial<CreateGrammarRequest> {}

export interface PublishGrammarRequest {
  isActive: boolean;
}

export interface ImportGrammarRequest {
  items: CreateGrammarRequest[];
}

export interface CheckGrammarExerciseRequest {
  questionId: string | number;
  answer: string | string[];
}

export interface CreateGrammarQuizRequest {
  title: string;
  grammar?: string | string[];
  level?: string;
  category?: string;
  itemIds: string[];
  isActive?: boolean;
}

export interface UpdateGrammarQuizRequest extends Partial<CreateGrammarQuizRequest> {}

export interface GrammarQuizItemsRequest {
  itemIds: string[];
}

export interface StartGrammarQuizRequest {
  quizId?: string;
  grammarId?: string;
  limit?: number;
}

export interface SaveGrammarQuizAnswerRequest {
  questionId: string;
  answer: any;
}

export interface SubmitGrammarQuizRequest {
  timeSpent?: number;
}

// ==========================================
// RESPONSES
// ==========================================

export type GetGrammarsResponse = BaseResponse<{
  grammars: Grammar[];
  total: number;
  page: number;
  pages: number;
}>;

export type GrammarDetailResponse = BaseResponse<Grammar>;

export type GetSimilarGrammarsResponse = BaseResponse<Grammar[]>;

export type GetGrammarQuizzesResponse = BaseResponse<{
  quizzes: GrammarQuiz[];
  total: number;
  page: number;
  pages: number;
}>;

export type GrammarQuizDetailResponse = BaseResponse<GrammarQuiz>;

export type GrammarQuizSessionResponse = BaseResponse<GrammarQuizSession>;

export type StartGrammarQuizResponse = BaseResponse<{ sessionId: string }>;

export type CheckGrammarExerciseResponse = BaseResponse<{
  isCorrect: boolean;
  correctAnswer?: string | string[];
  explanation?: string;
}>;

export type DeleteResponse = BaseResponse<null>;