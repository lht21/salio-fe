import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import LessonBottomSheet from '../components/Modals/LessonBottomSheet';

export default function LessonModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const sheetRef = useRef<BottomSheet>(null);

  const lessonId = params.lessonId as string;
  const unit = params.unit as string;
  const title = params.title as string;
  const lessonType = params.lessonType as 'standard' | 'hangul' | undefined;
  
  // Parse lại dữ liệu JSON của Hangul array đã được stringify từ index.tsx
  const hangul = params.hangul ? JSON.parse(params.hangul as string) : undefined;

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <LessonBottomSheet
        ref={sheetRef}
        lessonId={lessonId}
        unit={unit}
        title={title}
        lessonType={lessonType}
        hangul={hangul}
        initialIndex={0}
        onClose={handleClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});