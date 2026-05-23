import { BaseResponse } from './auth.types';

export type LessonType = 'standard' | 'hangul';
export type LessonStatus = 'completed' | 'current' | 'locked';
export { BaseResponse } from './auth.types'; 

// --- Hangul Types ---
export interface HangulCharacter {
  _id: string;
  glyph: string;
  label: string;
  romanization?: string;
  group: 'basic_consonants' | 'basic_vowels' | 'double_consonants' | 'compound_vowels';
  order: number;
  audioUrl?: string;
  strokeDataKey?: string;
}

// --- Vocabulary Types ---
export interface VocabularyExample {
  korean: string;
  vietnamese: string;
  _id?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

// --- Vocabulary Quiz Types ---
export interface VocabularyQuiz {
  _id: string;
  title: string;
  level?: string;
  category?: string;
  items?: string[];
  timeLimit?: number;
  passingScore?: number;
  createdBy?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- Grammar Types ---
export interface GrammarExample {
  korean: string;
  vietnamese: string;
  _id?: string;
}

export interface GrammarExercise {
  clientId: number;
  type: string;
  instruction: string;
  points: number;
  [key: string]: any;
}

export interface Grammar {
  _id: string;
  structure: string;
  meaning: string;
  explanation?: string;
  usage?: string;
  exampleSentences?: GrammarExample[];
  exercises?: GrammarExercise[];
  similarGrammar?: any[];
  level?: string;
  tags?: string[];
  createdBy?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- Grammar Quiz Types ---
export interface GrammarQuiz {
  _id: string;
  title: string;
  grammar?: string[];
  items?: string[];
  timeLimit?: number;
  passingScore?: number;
  createdBy?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- Listening Types ---
export interface ListeningScript {
  startTime: number;
  endTime: number;
  korean: string;
  vietnamese: string;
  _id?: string;
}

export interface ListeningQuestion {
  _id: string;
  type: 'true_false' | 'single_choice' | 'short_answer';
  points: number;
  questionText: string;
  correctAnswer: string | string[];
  explanation?: string;
  metadata?: {
    options?: string[];
    blankCount?: number;
    matchingPairs?: any[];
  };
  scripts?: ListeningScript[];
  audioUrl?: string;
}

export interface ListeningItem {
  _id: string;
  title: string;
  audioUrl?: string;
  duration?: number;
  scripts?: ListeningScript[];
  questions?: ListeningQuestion[];
  level?: string;
  tags?: string[];
  createdBy?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- Speaking Types ---
export interface SpeakingScript {
  speaker: string;
  korean: string;
  vietnamese: string;
  startTime: number;
  endTime: number;
  _id?: string;
}

export interface SpeakingScoringCriteria {
  pronunciation: number;
  intonation: number;
  accuracy: number;
  fluency: number;
}

export interface SpeakingItem {
  _id: string;
  title: string;
  type: 'shadowing' | 'role_play' | 'free_speech';
  prompt?: string;
  instruction?: string;
  referenceAudioUrl?: string;
  scripts?: SpeakingScript[];
  targetVocabularies?: string[];
  targetGrammar?: string[];
  sampleAnswer?: string;
  sampleTranslation?: string;
  prepTime?: number;
  recordingLimit?: number;
  passingScore?: number;
  level?: string;
  tags?: string[];
  createdBy?: string;
  isActive?: boolean;
  scoringCriteria?: SpeakingScoringCriteria;
  estimatedCompletionTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SpeakingSubmissionResponse {
  submission: {
    _id: string;
    evaluation: {
      percentage: number;
      pronunciation: number;
      intonation: number;
      accuracy: number;
      fluency: number;
      transcript: string;
      feedback: string;
    };
  };
  progress: any;
}

// --- Reading Types ---
export interface ReadingQuestion {
  _id: string;
  type: 'true_false' | 'single_choice' | 'short_answer' | 'multiple_choice';
  points: number;
  questionText: string;
  correctAnswer: string | string[];
  explanation?: string;
  metadata?: {
    options?: string[];
    blankCount?: number;
    matchingPairs?: any[];
  };
}

export interface ReadingItem {
  _id: string;
  title: string;
  content: string;
  translation?: string;
  questions?: ReadingQuestion[];
  level?: string;
  difficulty?: string;
  tags?: string[];
  wordCount?: number;
  estimatedReadingTime?: number;
  questionCount?: number;
  createdBy?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// --- Writing Types ---
export interface WritingHints {
  vocabulary?: string[];
  grammar?: string[];
  outline?: string; 
}

export interface WritingItem {
  _id: string;
  title: string;
  type: 'essay_writing' | 'letter_writing' | 'diary_writing';
  prompt: string;
  instruction?: string;
  attachedImage?: string;
  wordLimit?: {
    min: number;
    max: number;
  };
  hints?: {
    vocabulary?: string[];
    grammar?: string[];
    outline?: string; 
  };
  aiConfig?: {
    sampleAnswer?: string;
    focusPoints?: string[];
  };
  timeLimit?: number;
  level?: string;
  tags?: string[];
  isActive?: boolean;
}

export interface WritingSubmissionResponse {
  submission: {
    _id: string;
    content: string;
    evaluation: {
      totalScore: number;
      aiFeedback: string;
      detailedCorrection: Array<{
        original: string;
        correction: string;
        explanation: string;
        type: string;
      }>;
    };
    status: string;
  };
  progress: any;
}

// --- Final Test Types ---
export interface FinalTest {
  _id: string;
  title: string;
  description?: string;
  type: 'lesson_final' | 'placement';
  lesson?: string;
  passingScore?: number;
  timeLimit?: number;
  level?: string;
  sections?: {
    listening?: ListeningItem[];
    reading?: ReadingItem[];
    writing?: WritingItem[];
    speaking?: SpeakingItem[];
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizAnswer {
  sectionType: string;
  itemId?: string;
  questionId: string;
  userAnswer: any;
  isCorrect?: boolean;
  points?: number;
}

export interface QuizSession {
  _id: string;
  quiz: string;
  user: string;
  status: 'in_progress' | 'completed';
  answers: QuizAnswer[];
  totalScore?: number;
  maxScore?: number;
  percentage?: number;
  passed?: boolean;
  startedAt: string;
  submittedAt?: string;
  timeSpent?: number;
}

export interface FinalTestResponse {
  session: QuizSession;
  quiz: FinalTest;
}

// Cập nhật lại LessonModules để dùng FinalTest
export interface LessonModules {
  lessonId: string;
  lessonType: LessonType;
  hangul: HangulCharacter[];
  vocabulary: Vocabulary[];
  vocabularyQuizzes: VocabularyQuiz[];
  grammar: Grammar[];
  grammarQuizzes: GrammarQuiz[];
  listening: ListeningItem[];
  speaking: SpeakingItem[];
  reading: ReadingItem[];
  writing: WritingItem[];
  finalTest: FinalTest | null;
}

// --- Lesson Core ---
export interface Lesson {
  _id: string;
  code: string;
  title: string;
  lessonType?: LessonType;
  level: string;
  description?: string;
  thumbnail?: string;
  order: number;
  vocabulary?: string[] | Vocabulary[];
  vocabularyQuizzes?: string[] | VocabularyQuiz[];
  grammar?: string[] | Grammar[];
  grammarQuizzes?: string[] | GrammarQuiz[];
  listening?: string[] | ListeningItem[];
  speaking?: string[] | SpeakingItem[];
  reading?: string[] | ReadingItem[];
  writing?: string[] | WritingItem[];
  hangul?: HangulCharacter[];
  finalTest?: string | FinalTest;
  isPremium?: boolean;
  estimatedDuration?: number;
  isPublished?: boolean;
  isDeleted?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// --- Response Types ---
export interface LessonListData {
  lessons: Lesson[];
  total: number;
  page: number;
  pages: number;
}

export type LessonListResponse = BaseResponse<LessonListData>;
export type LessonModulesResponse = BaseResponse<LessonModules>;
export type LessonDetailResponse = BaseResponse<Lesson>;

export interface LessonProgress {
  _id: string;
  lesson: string | Lesson;
  overallProgress: number;
  isCompleted: boolean;
  requiresFinalTest?: boolean;
  sections?: Record<string, unknown>;
  finalTestStatus?: {
    isUnlocked: boolean;
    score?: number;
    isPassed?: boolean;
    sessionId?: string;
  };
}

export type LessonProgressResponse = BaseResponse<LessonProgress>;

export interface UpdateLessonProgressRequest {
  moduleType?: string;
  status?: 'learning' | 'completed';
  score?: number;
  maxScore?: number;
  percentage?: number;
  resultKind?: 'Manual' | 'VocabularyQuizSession' | 'GrammarQuizSession' | 'QuizSession' | 'SpeakingSubmission' | 'WritingSubmission';
  resultId?: string;
  breakdown?: Record<string, unknown>;
  title?: string;
}