import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import ResultSummaryScreen from '@/components/LessonReview/ResultSummaryScreen';

const listeningMetrics = [
  { id: 'ox', label: 'Nghe chọn Đúng/Sai', value: 90, color: '#4ACB40' },
  { id: 'choice', label: 'Nghe chọn đáp án', value: 70, color: '#FFB200' },
  { id: 'deep', label: 'Nghe hiểu sâu', value: 30, color: '#B50909' },
];

export default function ListeningResultScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const resolvedLessonId = lessonId ?? '1';

  return (
    <ResultSummaryScreen
      title="Hoàn thành xuất sắc!"
      scoreLabel="Đúng 8/10"
      pointLabel="50 điểm"
      metrics={listeningMetrics}
      primaryLabel="Chuyển đến học Đọc"
      onClose={() => router.replace('/(tabs)' as any)}
      onPrimaryPress={() => router.replace(`/lessons/${resolvedLessonId}/reading/intro` as any)}
    />
  );
}
