import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import ExplanationScreen, { ExplanationQuestion } from '@/components/LessonReview/ExplanationScreen';
import LessonService from '@/api/services/lesson.service';
import { useTheme } from "@/contexts/ThemeContext";

export default function ListeningExplanationScreen() {
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

        // 1. Lấy danh sách tất cả các ID bài nghe có trong Lesson này
        const modulesRes = await LessonService.getModules(lessonId!);
        const listenIds = modulesRes.data.listening.map((item: any) =>
          typeof item === 'string' ? item : item._id
        );

        // 2. Lấy nội dung câu hỏi VÀ kết quả bài làm cho từng ID bài nghe
        const dataPromises = listenIds.map(async (id: string) => {
          try {
            const [item, result] = await Promise.all([
              LessonService.getSkillItem(lessonId!, 'listening', id),
              LessonService.getSkillResult(lessonId!, 'listening', id).catch(() => null)
            ]);
            return { item, result };
          } catch (err) {
            console.error(`Lỗi khi tải ID ${id}:`, err);
            return null;
          }
        });

        const allDataRaw = await Promise.all(dataPromises);
        const allData = allDataRaw.filter(d => d !== null);

        // 3. Chuyển đổi và gộp (Flatten) dữ liệu để hiển thị
        let flattened: ExplanationQuestion[] = [];

        allData.forEach((data, exIdx) => {
          // Bóc tách lớp data từ BaseResponse
          const item = data!.item.data;
          const result = data!.result?.data; // Result có thể null nếu user chưa nộp bài

          const mapped = (item?.questions || []).map((q: any, qIdx: number) => {
            const userSub = result?.answers?.find((a: any) => String(a.questionId) === String(q._id));
            const isUserCorrect = userSub?.isCorrect;
            const uAns = userSub?.userAnswer || '(Bỏ trống)';

            let displayAnswers: any[] = [];

            if (q.type === 'short_answer') {
              displayAnswers = [
                { label: `Bạn đã nhập: ${uAns}`, state: isUserCorrect ? 'correct' : 'incorrect' },
                { label: `Đáp án chuẩn: ${q.correctAnswer}`, state: 'correct' }
              ];
            } else if (q.type === 'true_false') {
              displayAnswers = [
                { label: 'O', state: q.correctAnswer === 'O' ? 'correct' : (uAns === 'O' ? 'incorrect' : 'default') },
                { label: 'X', state: q.correctAnswer === 'X' ? 'correct' : (uAns === 'X' ? 'incorrect' : 'default') }
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
                title: isUserCorrect ? 'Làm tốt lắm!' : 'Hãy xem lại nhé', // Thêm title
                correctLabel: String(q.correctAnswer), // Đổi tên từ correctAnswer thành correctLabel
                body: q.explanation || "Dựa vào nội dung bài nghe để xác định đáp án chính xác."
              }
            };
          });
          flattened = [...flattened, ...mapped];
        });

        setAllQuestions(flattened);
      } catch (error) {
        console.error("Lỗi tổng quát khi tải giải thích:", error);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchAllData();
  }, [lessonId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExplanationScreen
        title="Giải thích chi tiết"
        questions={allQuestions}
        onClose={() => router.back()}
      />
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});