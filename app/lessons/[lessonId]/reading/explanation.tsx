import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import ExplanationScreen, { ExplanationQuestion } from '@/components/LessonReview/ExplanationScreen';
import LessonService from '@/api/services/lesson.service';
import { useTheme } from "@/contexts/ThemeContext";

export default function ReadingExplanationScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const [loading, setLoading] = useState(true);
  const [allQuestions, setAllQuestions] = useState<ExplanationQuestion[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // 1. Lấy danh sách các bài Reading trong Lesson
        const modulesRes = await LessonService.getModules(lessonId!);
        const readingIds = modulesRes.data.reading.map((item: any) =>
          typeof item === 'string' ? item : item._id
        );

        // 2. Lấy nội dung câu hỏi và kết quả đã lưu trên Server
        const dataPromises = readingIds.map(async (id: string) => {
          try {
            const [item, result] = await Promise.all([
              LessonService.getSkillItem(lessonId!, 'reading', id),
              LessonService.getSkillResult(lessonId!, 'reading', id).catch(() => null)
            ]);
            return { item, result };
          } catch (err) {
            return null;
          }
        });

        const allDataRaw = await Promise.all(dataPromises);
        const allData = allDataRaw.filter(d => d !== null);

        let flattened: ExplanationQuestion[] = [];

        // 3. Xử lý dữ liệu hiển thị
        allData.forEach((data, exIdx) => {
          const item = data!.item?.data;
          const result = data!.result?.data;

          const mapped = (item?.questions || []).map((q: any, qIdx: number) => {
            const userSub = result?.answers?.find((a: any) => String(a.questionId) === String(q._id));
            const isUserCorrect = userSub?.isCorrect;
            const uAns = userSub?.userAnswer || '(Bỏ trống)';

            let displayAnswers: any[] = [];
            if (q.type === 'short_answer') {
              displayAnswers = [
                { label: `Bạn đã nhập: ${uAns}`, state: isUserCorrect ? 'correct' : 'incorrect' },
                { label: `Đáp án chuẩn: ${Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer}`, state: 'correct' }
              ];
            } else {
              displayAnswers = (q.metadata?.options || []).map((opt: any) => ({
                label: opt,
                state: opt === q.correctAnswer ? 'correct' : (opt === uAns ? 'incorrect' : 'default')
              }));
            }

            return {
              id: q._id,
              indexLabel: `Bài ${exIdx + 1} - Câu ${qIdx + 1}`,
              question: q.questionText,
              answers: displayAnswers,
              explanation: {
                title: isUserCorrect ? 'Chính xác!' : 'Cần xem lại',
                correctLabel: String(Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer),
                body: q.explanation || "Dựa vào nội dung đoạn văn để xác định đáp án."
              }
            };
          });
          flattened = [...flattened, ...mapped];
        });

        setAllQuestions(flattened);
      } catch (error) {
        console.error("Lỗi tải giải thích Reading:", error);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchAllData();
  }, [lessonId]);

  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={styles.container}>
      <ExplanationScreen
        title="Giải thích Reading"
        questions={allQuestions}
        onClose={() => router.back()}
      />
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});