import { LessonItem } from '../LessonNode';

type OpenLessonSheetHandler = (lesson: LessonItem) => void;

let openHandler: OpenLessonSheetHandler | null = null;

export const registerOpenLessonSheetHandler = (handler: OpenLessonSheetHandler | null) => {
  openHandler = handler;
};

export const openLessonBottomSheet = (lesson: LessonItem) => {
  openHandler?.(lesson);
};
