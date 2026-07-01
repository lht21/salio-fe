import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, View, Alert } from 'react-native';
import ResultSummaryScreen from '@/components/LessonReview/ResultSummaryScreen';
import LessonService from '../../../../api/services/lesson.service';
import Button from '@/components/Button';
import { useTheme } from "@/contexts/ThemeContext";

export default function FinalTestResultScreen() {
  const { colors } = useTheme();

  const router = useRouter();
  const { lessonId, sessionId } = useLocalSearchParams<{ lessonId: string, sessionId: string }>();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (sessionId) {
      LessonService.getFinalTestResult(lessonId, sessionId).then(setData);
    }
  }, [sessionId]);

  const handleRetry = () => {
    Alert.alert(
      "Làm lại bài thi",
      "Bạn có chắc chắn muốn làm lại bài thi không? Kết quả trước đó sẽ bị ghi đè.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Làm lại",
          onPress: async () => {
            try {
              setIsLoading(true);
              const startRes = await LessonService.startFinalTest(lessonId);
              // Chuyển đến màn hình thi với sessionId mới
              router.replace({
                pathname: `/lessons/${lessonId}/final-test/exam` as any,
                params: { sessionId: startRes.data.sessionId }
              });
            } catch (error) {
              Alert.alert("Lỗi", "Không thể bắt đầu bài thi mới. Vui lòng thử lại.");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);

      // Tìm lesson tiếp theo (bài 2)
      const response = await LessonService.getAll({ page: 1, limit: 100 });
      const lessons = response.data.lessons;

      // Tìm lesson hiện tại và lesson tiếp theo
      const currentIndex = lessons.findIndex((lesson: any) => lesson._id === lessonId);
      const nextLesson = lessons[currentIndex + 1];

      if (nextLesson) {
        // Bắt đầu lesson tiếp theo
        await LessonService.start(nextLesson._id);
        router.replace({
          pathname: `/lessons/${nextLesson._id}` as any,
        });
      } else {
        // Nếu không còn lesson nào, quay về màn hình chính
        Alert.alert(
          "Chúc mừng!",
          "Bạn đã hoàn thành tất cả các bài học!",
          [{ text: "OK", onPress: () => router.replace('/(tabs)') }]
        );
      }
    } catch (error) {
      console.error('Error finding next lesson:', error);
      Alert.alert("Lỗi", "Không thể tìm thấy bài học tiếp theo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!data || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const { session } = data.data;
  const isPassed = session.percentage >= 80;

  // Tính điểm chi tiết theo từng kỹ năng (nếu có breakdown)
  const listeningScore = session.breakdown?.listening?.percentage || session.percentage;
  const readingScore = session.breakdown?.reading?.percentage || session.percentage;

  const metrics = [
    { id: 'overall', label: 'Tổng thể', value: session.percentage, color: isPassed ? '#4ACB40' : '#FF3B30' },
    { id: 'listening', label: 'Listening', value: listeningScore, color: '#4ACB40' },
    { id: 'reading', label: 'Reading', value: readingScore, color: '#FFB200' },
  ];

  // Xác định button dựa trên kết quả
  const getButtons = () => {
    if (isPassed) {
      return {
        primaryLabel: "Tiếp tục bài 2",
        secondaryLabel: "Xem giải thích đáp án",
        onPrimaryPress: handleContinue,
        onSecondaryPress: () => {
          router.push({
            pathname: `/lessons/${lessonId}/final-test/explanation` as any,
            params: { sessionId }
          });
        }
      };
    } else {
      return {
        primaryLabel: "Làm lại bài thi",
        secondaryLabel: "Xem giải thích đáp án",
        onPrimaryPress: handleRetry,
        onSecondaryPress: () => {
          router.push({
            pathname: `/lessons/${lessonId}/final-test/explanation` as any,
            params: { sessionId }
          });
        }
      };
    }
  };

  const { primaryLabel, secondaryLabel, onPrimaryPress, onSecondaryPress } = getButtons();

  return (
    <View style={{ flex: 1 }}>
      <ResultSummaryScreen
        title={isPassed ? "Chúc mừng!" : "Chưa đạt yêu cầu"}
        pointLabel={`${session.percentage} điểm`}
        subLabels={[`${session.totalScore}/${session.maxScore}`]}
        metrics={metrics}
        primaryLabel={isPassed ? "Tiếp tục bài 2" : "Làm lại bài thi"}
        onPrimaryPress={isPassed ? handleContinue : handleRetry}
        onClose={() => router.replace('/(tabs)')}
        secondaryLabel="Xem giải thích đáp án"
        onSecondaryPress={() => router.push({
          pathname: `/lessons/${lessonId}/final-test/explanation` as any,
          params: { sessionId }
        })}
      />
    </View>
  );
}