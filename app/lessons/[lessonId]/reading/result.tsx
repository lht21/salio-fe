import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import ResultSummaryScreen from '@/components/LessonReview/ResultSummaryScreen';

const readingMetrics = [
  { id: 'ox', label: 'Đọc hiểu chọn Đúng/Sai', value: 90, color: '#4ACB40' },
  { id: 'choice', label: 'Từ vựng và phân loại', value: 70, color: '#FFB200' },
  { id: 'deep', label: 'Đọc hiểu sâu', value: 30, color: '#B50909' },
];

export default function ReadingResultScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const resolvedLessonId = lessonId ?? '1';

  return (
    <ResultSummaryScreen
      title="Hoàn thành xuất sắc!"
      scoreLabel="Đúng 3/4"
      pointLabel="50 điểm"
      metrics={readingMetrics}
      primaryLabel="Chuyển đến học Viết"
      onClose={() => router.replace('/(tabs)' as any)}
      onPrimaryPress={() => router.replace(`/lessons/${resolvedLessonId}/writing/intro` as any)}
    />
  );
}
