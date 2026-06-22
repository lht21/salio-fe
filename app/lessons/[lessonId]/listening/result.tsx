import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import ResultSummaryScreen from '@/components/LessonReview/ResultSummaryScreen';
import Button from '@/components/Button';
import { Gap, Padding, Color } from '@/constants/GlobalStyles';
import LessonService from '@/api/services/lesson.service';

export default function ListeningResultScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [scoreInfo, setScoreInfo] = useState({ score: 0, total: 0, percent: 0, timeSpent: 0, isCompleted: false });

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const loadAllResults = async () => {
      try {
        setLoading(true);
        const modulesRes = await LessonService.getModules(lessonId!);
        const listenIds = modulesRes.data.listening.map((item: any) => typeof item === 'string' ? item : item._id);

        const results = await Promise.all(
          listenIds.map(id => LessonService.getSkillResult(lessonId!, 'listening', id).catch(() => null))
        );

        let tScore = 0, tMax = 0, tTime = 0;
        let cats = { 
          trueFalse: { s: 0, m: 0 }, 
          choice: { s: 0, m: 0 }, 
          deepComprehension: { s: 0, m: 0 } 
        };

        results.forEach(res => {
          if (!res || !res.data) return;
          
          const payload = res.data;
          tScore += (payload.totalScore || 0);
          tMax += (payload.maxScore || 0);
          tTime += (payload.timeSpent || 0);
          
          const b = payload.breakdown;
          if (b) {
            if (b.trueFalse) { cats.trueFalse.s += b.trueFalse.score || 0; cats.trueFalse.m += b.trueFalse.maxScore || 0; }
            if (b.choice) { cats.choice.s += b.choice.score || 0; cats.choice.m += b.choice.maxScore || 0; }
            if (b.deepComprehension) { cats.deepComprehension.s += b.deepComprehension.score || 0; cats.deepComprehension.m += b.deepComprehension.maxScore || 0; }
          }
        });

        const getP = (c: any) => c.m > 0 ? Math.round((c.s / c.m) * 100) : 0;
        const finalPercent = tMax > 0 ? Math.round((tScore / tMax) * 100) : 0;
        const completedCount = results.filter(res => res && res.data).length;
        const isCompleted = listenIds.length > 0 && completedCount === listenIds.length;

        setScoreInfo({ score: tScore, total: tMax, percent: finalPercent, timeSpent: tTime, isCompleted });
        
        const allMetrics = [
          { id: 'ox', label: 'Khả năng Đúng/Sai', value: Number(getP(cats.trueFalse)) || 0, color: '#4ACB40', max: cats.trueFalse.m },
          { id: 'choice', label: 'Khả năng chọn đáp án', value: Number(getP(cats.choice)) || 0, color: '#FFB200', max: cats.choice.m },
          { id: 'deep', label: 'Khả năng hiểu sâu', value: Number(getP(cats.deepComprehension)) || 0, color: '#B50909', max: cats.deepComprehension.m },
        ];

        setMetrics(allMetrics.filter(m => m.max > 0));
      } catch (e) {
        console.error("Lỗi tổng hợp kết quả nghe:", e);
      } finally {
        setLoading(false);
      }
    };
    loadAllResults();
  }, [lessonId]);

  // Loading guard để tránh lỗi interpolate của Reanimated
  if (loading || metrics.length === 0) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={Color.main} /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Color.bg }}>
      <ResultSummaryScreen
        title={scoreInfo.isCompleted ? (scoreInfo.percent >= 80 ? "Hoàn thành xuất sắc!" : "Hoàn thành bài Nghe!") : "Chưa hoàn thành!"}
        pointLabel={`${scoreInfo.percent} điểm`}
        subLabels={[
          `${scoreInfo.score}/${scoreInfo.total}`,
          `${formatTime(scoreInfo.timeSpent)} giây`
        ]}
        metrics={metrics}
        primaryLabel={scoreInfo.isCompleted ? "Tiếp tục học Nói" : "Tiếp tục làm bài"}
        onClose={() => router.replace('/(tabs)')}
        onPrimaryPress={() => {
          if (scoreInfo.isCompleted) {
            router.replace(`/lessons/${lessonId}/speaking/intro` as any);
          } else {
            router.replace(`/lessons/${lessonId}/listening/practice` as any);
          }
        }}
        secondaryLabel="Xem giải thích chi tiết"
        onSecondaryPress={() => router.push({ pathname: '/lessons/[lessonId]/listening/explanation', params: { lessonId } } as any)}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.bg },
});