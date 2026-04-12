import type { LessonAttemptDraft } from './types';

type LessonReviewType = 'reading' | 'listening';

const draftStore: Partial<Record<LessonReviewType, LessonAttemptDraft>> = {};

export function startLessonAttempt(type: LessonReviewType, lessonId: string) {
  draftStore[type] = {
    lessonId,
    answers: {},
    typedAnswers: {},
  };
}

export function updateLessonAttempt(
  type: LessonReviewType,
  lessonId: string,
  next: {
    answers?: Record<string, string>;
    typedAnswers?: Record<string, string>;
  }
) {
  const current = draftStore[type];

  if (!current || current.lessonId !== lessonId) {
    startLessonAttempt(type, lessonId);
  }

  const safeCurrent = draftStore[type] as LessonAttemptDraft;
  draftStore[type] = {
    lessonId,
    answers: {
      ...safeCurrent.answers,
      ...next.answers,
    },
    typedAnswers: {
      ...safeCurrent.typedAnswers,
      ...next.typedAnswers,
    },
    completedAt: safeCurrent.completedAt,
  };
}

export function completeLessonAttempt(type: LessonReviewType, lessonId: string) {
  const current = draftStore[type];

  if (!current || current.lessonId !== lessonId) {
    return;
  }

  draftStore[type] = {
    ...current,
    completedAt: Date.now(),
  };
}

export function getLessonAttempt(type: LessonReviewType, lessonId: string) {
  const current = draftStore[type];
  if (!current || current.lessonId !== lessonId) {
    return null;
  }

  return current;
}
