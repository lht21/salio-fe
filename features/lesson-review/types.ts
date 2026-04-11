export type ReviewMetricCategory = 'ox' | 'choice' | 'deep';

export type ReviewExplanation = {
  sourceText?: string;
  correctLabel?: string;
  body: string;
  translation?: string;
  note?: string;
};

type ReviewQuestionBase = {
  id: string;
  question: string;
  explanation: ReviewExplanation;
  metricCategory: ReviewMetricCategory;
};

export type ReviewMultipleChoiceQuestion = ReviewQuestionBase & {
  type: 'multiple-choice';
  options: { id: string; label: string }[];
  correctOptionId: string;
};

export type ReviewOXQuestion = ReviewQuestionBase & {
  type: 'ox';
  correctValue: 'O' | 'X';
  trueLabel: string;
  falseLabel: string;
};

export type ReviewShortAnswerQuestion = ReviewQuestionBase & {
  type: 'short-answer';
  placeholder?: string;
  acceptedAnswers: string[];
  exampleAnswer: string;
};

export type ReviewQuestion =
  | ReviewMultipleChoiceQuestion
  | ReviewOXQuestion
  | ReviewShortAnswerQuestion;

export type LessonAttemptDraft = {
  lessonId: string;
  answers: Record<string, string>;
  typedAnswers: Record<string, string>;
  completedAt?: number;
};
