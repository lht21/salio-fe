export type SkillType = 'reading' | 'listening' | 'writing' | 'speaking';

/**
 * Chi tiết điểm thành phần của từng kỹ năng (nếu có)
 */
export interface SkillBreakdown {
  trueFalse?: number;
  choice?: number;
  deepComprehension?: number;
  vocabularyClassification?: number;
  [key: string]: number | undefined;
}

export interface SkillHistory {
  _id: string;
  user: string;
  skill: SkillType;
  title?: string;
  sourceType?: string;
  sourceId?: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  timeSpent?: number; // Đơn vị: giây
  resultKind?: 'QuizSession' | 'SpeakingSubmission' | 'WritingSubmission' | 'Manual' | string;
  resultId?: string;
  breakdown?: SkillBreakdown;
  createdAt: string;
  updatedAt: string;
}

export interface SkillHistoryResponse {
  history: SkillHistory[];
  total: number;
  page: number;
  pages: number;
}

export interface SkillChartDataResponse {
  chartData?: {
    labels: string[]; // VD: ["01/10", "05/10", "10/10"...]
    scores: number[]; // VD: [50, 65, 80...]
  };
  statistics?: {
    averageScore: number;
    highestScore: number;
  };
  comments?: string[]; // Nhận xét đánh giá từ AI/Backend
}
