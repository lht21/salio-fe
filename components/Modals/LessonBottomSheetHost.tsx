import React from 'react';
import { StyleSheet, View } from 'react-native';

import LessonBottomSheet from './LessonBottomSheet';
import { LessonItem } from '../LessonNode';
import { registerOpenLessonSheetHandler } from './lessonBottomSheetBus';

const LessonBottomSheetHost = () => {
  const [selectedLesson, setSelectedLesson] = React.useState<LessonItem | null>(null);

  React.useEffect(() => {
    const handleOpen = (lesson: LessonItem) => {
      if (lesson.status === 'locked') {
        return;
      }

      setSelectedLesson(lesson);
    };

    registerOpenLessonSheetHandler(handleOpen);

    return () => {
      registerOpenLessonSheetHandler(null);
    };
  }, []);

  return (
    <View pointerEvents="box-none" style={styles.host}>
      {selectedLesson ? (
        <LessonBottomSheet
          key={selectedLesson.id}
          lessonId={selectedLesson.id}
          unit={selectedLesson.unit}
          title={selectedLesson.title.replace('\n', ' ')}
          initialIndex={0}
          onClose={() => setSelectedLesson(null)}
        />
      ) : null}
    </View>
  );
};

export default LessonBottomSheetHost;

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFillObject,
  },
});
