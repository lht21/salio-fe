/**
 * Định nghĩa các TypeScript Interfaces/Types cho module Flashcards.
 * Các trường được map chính xác từ logic của flashcardController.js.
 */

// --- 1. Base & Common Types ---

/**
 * Cấu trúc response chung trả về từ backend.
 * Giả sử được import từ một file types chung, ví dụ: '~/api/types/common.types'
 */
export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LearningStatus {
  status: 'learning' | 'remembered' | 'forgotten';
  reviewCount: number;
  correctCount: number;
  wrongCount: number;
}

/**
 * Cấu trúc cơ bản của một từ vựng khi được populate.
 * Đây là type mock, nên được import từ file vocabulary.types.ts nếu có.
 */
export interface Vocabulary {
  _id: string;
  word: string;
  meaning: string;
  type: string;
  exampleSentences: string[];
  pronunciationText?: string;
  imageUrl?: string;
  level?: string;
  category?: string;
  learningStatus?: LearningStatus;
}

/**
 * Cấu trúc của người sở hữu bộ flashcard khi được populate.
 */
export interface FlashcardSetOwner {
  _id: string;
  username: string;
}

// --- 2. Core Model ---

/**
 * Đại diện cho một bộ Flashcard.
 * Dựa trên FlashcardSet model và các hàm populate trong controller.
 */
export interface FlashcardSet {
  _id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  /**
   * ID của người sở hữu, hoặc object User đã được populate.
   */
  owner: string | FlashcardSetOwner;
  /**
   * Mảng các ID của từ vựng, hoặc mảng object Vocabulary đã được populate.
   */
  cards: string[] | Vocabulary[];
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

// --- 3. Request Payloads ---

/**
 * Dữ liệu gửi lên để tạo một bộ flashcard mới.
 * POST /api/v1/flashcard-sets
 */
export interface CreateFlashcardSetRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
}

/**
 * Dữ liệu gửi lên để cập nhật một bộ flashcard.
 * PATCH /api/v1/flashcard-sets/:id
 */
export interface UpdateFlashcardSetRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

/**
 * Dữ liệu gửi lên để thêm nhiều từ vựng vào một bộ.
 * POST /api/v1/flashcard-sets/:id/cards
 */
export interface AddCardsToSetRequest {
  vocabIds: string[];
}


// --- 4. API Response Types ---

/**
 * Response trả về từ API lấy danh sách các bộ flashcard.
 * GET /api/v1/flashcard-sets
 */
export type FlashcardSetListResponse = BaseResponse<FlashcardSet[]>;

/**
 * Response trả về từ API lấy chi tiết một bộ flashcard (bao gồm cả bộ 'favorite').
 * GET /api/v1/flashcard-sets/:id
 */
export type FlashcardSetDetailResponse = BaseResponse<FlashcardSet>;

/**
 * Response trả về khi thực hiện các hành động CUD trên bộ flashcard.
 */
export type FlashcardSetMutationResponse = BaseResponse<FlashcardSet>;
export type DeleteFlashcardSetResponse = BaseResponse<null>;
export type CardMutationResponse = BaseResponse<FlashcardSet | null>;

// --- 5. Flashcard Quiz Types ---

/**
 * Câu hỏi trong flashcard quiz
 */
export interface FlashcardQuestion {
  _id: string;
  type: 'single_choice' | 'multiple_choice' | 'fill_in_blank' | 'matching';
  points: number;
  questionText: string;  // Nội dung câu hỏi
  metadata?: any;
  options: string[];  // Mảng các string đáp án (["학생", "선생님", ...])
  matchingPairs?: any[];
  correctAnswer: string;  // Đáp án đúng (ví dụ: "학생")
  scripts?: any[];
  level?: string;
  difficulty?: string;
  tags?: string[];
  vocabulary: string | Vocabulary;  // ID hoặc object Vocabulary
  createdBy?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isCorrect?: boolean; // Trường tạm thời để lưu trạng thái đúng/sai khi trả về quiz session
}

/**
 * Phiên làm flashcard quiz
 */
export interface FlashcardQuizSession {
  _id: string;
  user: string;
  flashcardSet: string | FlashcardSet;
  status: 'in_progress' | 'completed' | 'abandoned';
  questions: FlashcardQuestion[];
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
 * Request để start flashcard quiz
 * POST /api/v1/flashcard-quiz/start
 */
export interface StartFlashcardQuizRequest {
  flashcardSetId: string;
  numberOfQuestions?: number; // Default: tất cả từ trong set
}

/**
 * Request để lưu đáp án
 * POST /api/v1/flashcard-quiz/session/:sessionId/save-answer
 */
export interface SaveFlashcardAnswerRequest {
  questionId: string;
  answer: any;
  timeSpent?: number;
}

/**
 * Response từ API start quiz
 */
export type StartFlashcardQuizResponse = BaseResponse<FlashcardQuizSession>;

/**
 * Response từ API save answer
 */
export type SaveFlashcardAnswerResponse = BaseResponse<FlashcardQuizSession>;

/**
 * Response từ API submit quiz
 */
export type SubmitFlashcardQuizResponse = BaseResponse<FlashcardQuizSession>;

/**
 * Response từ API get result
 */
export type GetFlashcardResultResponse = BaseResponse<FlashcardQuizSession>;