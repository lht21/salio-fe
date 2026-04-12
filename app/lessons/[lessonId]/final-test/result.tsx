import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import ResultSummaryScreen from '@/components/LessonReview/ResultSummaryScreen';

const finalTestMetrics = [
  { id: 'listening', label: 'Listening', value: 80, color: '#4ACB40' },
  { id: 'reading', label: 'Reading', value: 76, color: '#FFB200' },
  { id: 'writing', label: 'Writing', value: 72, color: '#FF6B6B' },
  { id: 'overall', label: 'Tổng thể', value: 78, color: '#1877F2' },
];

export default function FinalTestResultScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const resolvedLessonId = lessonId ?? '1';

  return (
    <ResultSummaryScreen
      title="Hoàn thành mini test!"
      scoreLabel="Điểm tổng quát 12/16"
      pointLabel="78 điểm"
      metrics={finalTestMetrics}
      primaryLabel="Quay lại bài học"
      onClose={() => router.replace('/(tabs)' as any)}
      onPrimaryPress={() => router.replace(`/lessons/${resolvedLessonId}/intro` as any)}
    />
  );
}
