/**
 * Định nghĩa các TypeScript Interfaces/Types cho module Practice (Luyện thi).
 * Dựa trên cấu trúc trả về từ practiceController.js
 */

// --- 1. Base Response ---
export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// --- 2. Kiểu dữ liệu chung ---
export type PracticeType = 'reading' | 'listening' | 'writing' | 'speaking' | 'full';

// --- 3. Interfaces cho Practice Sets (Lấy đề) ---

/**
 * Dữ liệu cơ bản khi fetch danh sách bài luyện tập
 */
export interface PracticeSetListItem {
  _id: string;
  title: string;
  examType?: string; // Dành cho Exam (Trắc nghiệm/Full)
  duration?: number | Record<string, number>; 
  totalScore?: number; // Dành cho Exam
  isPremium?: boolean; // Dành cho Exam
  createdAt: string;
}

/**
 * Dữ liệu chi tiết của 1 đề thi / bài luyện (Đã được strip correctAnswer, explanation)
 */
export interface PracticeSetDetail {
  _id: string;
  title: string;
  type: PracticeType;
  
  // --- Dành cho Trắc nghiệm (Exam: reading / listening / full) ---
  examType?: string;
  duration?: number;
  items?: any; // exam.sections (nếu là full) hoặc exam.sections[type]
  
  // --- Dành cho Tự luận (Writing / Speaking) ---
  prompt?: string;
  instruction?: string;
  // Writing specific
  attachedImage?: string;
  wordLimit?: {
    min: number;
    max: number;
  };
  timeLimit?: number;
  hints?: any;
  // Speaking specific
  referenceAudioUrl?: string;
  targetVocabularies?: string[];
  targetGrammar?: string[];
  prepTime?: number;
  recordingLimit?: number;
}

// --- 4. Interfaces cho Attempts (Làm bài) ---

export interface StartAttemptData {
  attemptId: string;
  type: PracticeType;
}

export interface SaveAnswerRequest {
  type: PracticeType;
  questionId?: string; // Optional: không bắt buộc đối với Writing
  answer: string | any; // Có thể là string cho Writing, hoặc dạng khác tùy bank item cho Reading/Listening
  timeSpent?: number;
}

/**
 * Kết quả tổng quan của một lượt làm bài (ExamResult / WritingSubmission)
 */
export interface AttemptResult {
  _id: string;
  user: string;
  status: 'in_progress' | 'completed' | 'draft' | 'pending_ai' | 'evaluated' | 'ai_failed';
  startedAt?: string;
  completedAt?: string;
  timeSpent?: number;

  // --- Dành cho Trắc nghiệm (ExamResult) ---
  exam?: string | any; // Tuỳ thuộc có được populate hay không
  listeningScore?: number;
  readingScore?: number;
  totalScore?: number;
  listeningAnswers?: any[];
  readingAnswers?: any[];

  // --- Dành cho Viết (WritingSubmission) ---
  writing?: string | any;
  content?: string;
  evaluation?: {
    totalScore: number;
    aiFeedback: any[];
    detailedCorrection: any[];
  };
}

/**
 * Chi tiết để học viên Review bài làm (Đã được populate đầy đủ câu hỏi, đáp án, giải thích)
 */
export interface AttemptReview extends AttemptResult {
  exam?: any; // Đã populate 'sections.listening', 'sections.reading' (kèm theo isCorrect, explanation, correctAnswer gốc)
  writing?: any; // Đã populate 'writing' (kèm sampleAnswer gốc)
}

// --- 5. API Response Wrappers ---

export type PracticeSetsResponse = BaseResponse<{
  data: PracticeSetListItem[];
  total: number;
  page: number;
  pages: number;
}>;

export type PracticeSetDetailResponse = BaseResponse<PracticeSetDetail>;

export type StartAttemptResponse = BaseResponse<StartAttemptData>;

export type SaveAnswerResponse = BaseResponse<null>;

export type SubmitAttemptResponse = BaseResponse<AttemptResult>;

export type AttemptResultResponse = BaseResponse<AttemptResult>;

export type AttemptReviewResponse = BaseResponse<AttemptReview>;

export type PracticeHistoryResponse = BaseResponse<{
  history: AttemptResult[];
  total: number;
  page: number;
  pages: number;
}>;