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

/**
 * Cấu trúc cơ bản của một từ vựng khi được populate.
 * Đây là type mock, nên được import từ file vocabulary.types.ts nếu có.
 */
export interface Vocabulary {
  _id: string;
  word: string;
  meaning: string;
  pronunciationText?: string;
  imageUrl?: string;
  level?: string;
  category?: string;
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