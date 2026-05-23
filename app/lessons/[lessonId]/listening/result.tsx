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
  const [scoreInfo, setScoreInfo] = useState({ score: 0, total: 0, percent: 0 });

  useEffect(() => {
    const loadAllResults = async () => {
      try {
        setLoading(true);
        const modulesRes = await LessonService.getModules(lessonId!);
        const listenIds = modulesRes.data.listening.map((item: any) => typeof item === 'string' ? item : item._id);

        const results = await Promise.all(
          listenIds.map(id => LessonService.getSkillResult(lessonId!, 'listening', id).catch(() => null))
        );

        let tScore = 0, tMax = 0;
        let cats = { 
          trueFalse: { s: 0, m: 0 }, 
          choice: { s: 0, m: 0 }, 
          deepComprehension: { s: 0, m: 0 } 
        };

        results.forEach(res => {
          if (!res) return;
          tScore += (res.totalScore || 0);
          tMax += (res.maxScore || 0);
          
          const b = res.breakdown;
          if (b) {
            // Khớp chính xác Key với Backend: trueFalse, choice, deepComprehension
            if (b.trueFalse) { cats.trueFalse.s += b.trueFalse.score || 0; cats.trueFalse.m += b.trueFalse.maxScore || 0; }
            if (b.choice) { cats.choice.s += b.choice.score || 0; cats.choice.m += b.choice.maxScore || 0; }
            if (b.deepComprehension) { cats.deepComprehension.s += b.deepComprehension.score || 0; cats.deepComprehension.m += b.deepComprehension.maxScore || 0; }
          }
        });

        const getP = (c: any) => c.m > 0 ? Math.round((c.s / c.m) * 100) : 0;
        const finalPercent = tMax > 0 ? Math.round((tScore / tMax) * 100) : 0;

        setScoreInfo({ score: tScore, total: tMax, percent: finalPercent });
        
        // Đảm bảo value luôn là Number để tránh lỗi interpolate
        setMetrics([
          { id: 'ox', label: 'Khả năng Đúng/Sai', value: Number(getP(cats.trueFalse)) || 0, color: '#4ACB40' },
          { id: 'choice', label: 'Khả năng chọn đáp án', value: Number(getP(cats.choice)) || 0, color: '#FFB200' },
          { id: 'deep', label: 'Khả năng hiểu sâu', value: Number(getP(cats.deepComprehension)) || 0, color: '#B50909' },
        ]);
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
        title={scoreInfo.percent >= 80 ? "Hoàn thành xuất sắc!" : "Cố gắng thêm nhé!"}
        scoreLabel={`Tổng điểm bài nghe: ${scoreInfo.score}/${scoreInfo.total}`}
        pointLabel={`${scoreInfo.percent} điểm`}
        metrics={metrics}
        primaryLabel={scoreInfo.percent >= 80 ? "Chuyển sang học Nói" : "Bạn phải đạt ít nhất 80 điểm để qua bài này"}
        onClose={() => router.replace('/(tabs)')}
        onPrimaryPress={() => {
          if (scoreInfo.percent >= 80) {
            router.replace(`/lessons/${lessonId}/reading/intro` as any);
          } else {
            router.replace(`/lessons/${lessonId}/listening/practice` as any);
          }
        }}
      />
      
      {/* Container nút bấm ở dưới cùng */}
      <View style={styles.footer}>
        <Button 
            title="Xem giải thích chi tiết" 
            variant="Orange" 
            style={{ marginTop: Gap.gap_10 }}
            onPress={() => router.push({ pathname: '/lessons/[lessonId]/listening/explanation', params: { lessonId } } as any)} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Color.bg },
  footer: { 
    padding: 20, 
    backgroundColor: Color.bg,
    paddingBottom: 40 
  }
});