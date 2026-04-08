import { LessonItem } from '../LessonNode';

type OpenLessonSheetHandler = (lesson: LessonItem) => void;
type CloseLessonSheetHandler = () => void;

let openHandler: OpenLessonSheetHandler | null = null;
let closeHandler: CloseLessonSheetHandler | null = null;

export const registerOpenLessonSheetHandler = (handler: OpenLessonSheetHandler | null) => {
  openHandler = handler;
};

export const registerCloseLessonSheetHandler = (handler: CloseLessonSheetHandler | null) => {
  closeHandler = handler;
};

export const openLessonBottomSheet = (lesson: LessonItem) => {
  openHandler?.(lesson);
};

export const closeLessonBottomSheet = () => {
  closeHandler?.();
};
