import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import ResultSummaryScreen from '@/components/LessonReview/ResultSummaryScreen';
import Button from '@/components/Button';
import { Gap, Color } from '@/constants/GlobalStyles';
import LessonService from '@/api/services/lesson.service';

export default function ReadingResultScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [scoreInfo, setScoreInfo] = useState({ score: 0, total: 0, percent: 0 });

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        const modulesRes = await LessonService.getModules(lessonId!);
        const readingIds = modulesRes.data.reading.map((item: any) => 
          typeof item === 'string' ? item : item._id
        );

        // Lấy toàn bộ kết quả từ Server
        const results = await Promise.all(
          readingIds.map(id => LessonService.getSkillResult(lessonId!, 'reading', id).catch(() => null))
        );

        let totalScore = 0;
        let totalMaxScore = 0;

        // Khởi tạo bộ gom điểm theo 3 nhóm kỹ năng chính
        let cats = { 
          vocabulary: { s: 0, m: 0 }, // Từ vựng
          choice: { s: 0, m: 0 },     // Trắc nghiệm (gồm cả Single Choice và True/False)
          deep: { s: 0, m: 0 }        // Hiểu sâu
        };

        results.forEach(res => {
          if (!res) return;
          
          totalScore += (res.totalScore || 0);
          totalMaxScore += (res.maxScore || 0);
          
          const b = res.breakdown;
          if (!b) return;

          // 1. Nhóm từ vựng & phân loại
          const vocab = b.vocabularyClassification || b.vocabulary;
          if (vocab) {
            cats.vocabulary.s += vocab.score || 0;
            cats.vocabulary.m += vocab.maxScore || 0;
          }

          // 2. Nhóm trắc nghiệm (Gộp Choice + True/False vào một nhóm để biểu đồ đẹp hơn)
          const choice = b.choice;
          const tf = b.trueFalse;
          if (choice) {
            cats.choice.s += choice.score || 0;
            cats.choice.m += choice.maxScore || 0;
          }
          if (tf) {
            cats.choice.s += tf.score || 0;
            cats.choice.m += tf.maxScore || 0;
          }

          // 3. Nhóm hiểu sâu nội dung
          const deep = b.deepComprehension;
          if (deep) {
            cats.deep.s += deep.score || 0;
            cats.deep.m += deep.maxScore || 0;
          }
        });

        // --- TÍNH TOÁN % TỔNG ---
        const finalPercent = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

        // --- XÂY DỰNG BIỂU ĐỒ METRICS NĂNG LỰC ---
        const finalMetrics = [];
        const calcP = (cat: any) => cat.m > 0 ? Math.round((cat.s / cat.m) * 100) : 0;

        // Chỉ thêm vào metrics nếu hạng mục đó có tồn tại trong bài học (m > 0)
        if (cats.vocabulary.m > 0) {
          finalMetrics.push({ id: '1', label: 'Từ vựng & Phân loại', value: calcP(cats.vocabulary), color: '#4ACB40' });
        }
        if (cats.choice.m > 0) {
          finalMetrics.push({ id: '2', label: 'Đọc hiểu trắc nghiệm', value: calcP(cats.choice), color: '#FFB200' });
        }
        if (cats.deep.m > 0) {
          finalMetrics.push({ id: '3', label: 'Phân tích & Hiểu sâu', value: calcP(cats.deep), color: '#B50909' });
        }

        setScoreInfo({ score: totalScore, total: totalMaxScore, percent: finalPercent });
        setMetrics(finalMetrics);
      } catch (e) {
        console.error("Lỗi tổng hợp kết quả đọc:", e);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, [lessonId]);

  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color={Color.main} /></View>;

  const isPassed = scoreInfo.percent >= 80;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ResultSummaryScreen
        title={isPassed ? "Hoàn thành xuất sắc!" : "Cố gắng thêm nhé!"}
        // Hiển thị tổng điểm thực tế / tổng điểm tối đa
        scoreLabel={`Tổng kết bài đọc: ${scoreInfo.score}/${scoreInfo.total}`}
        pointLabel={`${scoreInfo.percent} điểm`}
        metrics={metrics}
        primaryLabel={isPassed ? "Tiếp tục học Viết" : "Làm lại để mở khóa bài Viết (Cần 80đ)"}
        onClose={() => router.replace('/(tabs)')}
        onPrimaryPress={() => {
          if (isPassed) {
            router.replace(`/lessons/${lessonId}/writing/intro` as any);
          } else {
            // Quay lại practice nếu không đạt 80%
            router.replace(`/lessons/${lessonId}/reading/practice` as any);
          }
        }}
      />
      
      <View style={styles.footer}>
        <Button 
            title="Xem giải thích chi tiết" 
            variant="Orange" 
            onPress={() => router.push({ pathname: '/lessons/[lessonId]/reading/explanation', params: { lessonId } } as any)} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  footer: { padding: 20, paddingBottom: 40, backgroundColor: '#FFFFFF' }
});