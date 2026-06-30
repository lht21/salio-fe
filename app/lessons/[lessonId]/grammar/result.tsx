import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ResultSummaryScreen from '@/components/LessonReview/ResultSummaryScreen';
import GrammarService from '@/api/services/grammar.service';
import LessonService from '@/api/services/lesson.service';
import { useTheme } from "@/contexts/ThemeContext";

export default function GrammarResultScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const router = useRouter();
  const { lessonId, sessionId } = useLocalSearchParams<{ lessonId: string, sessionId: string }>();
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [lessonProgress, setLessonProgress] = useState<any>(null);

  useEffect(() => {
    if (sessionId) fetchData();
  }, [sessionId, lessonId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizResult, progressData] = await Promise.all([
        GrammarService.getGrammarQuizResult(sessionId!),
        LessonService.getProgress(lessonId!)
      ]);
      setSession(quizResult?.data || quizResult);
      setLessonProgress(progressData?.data || progressData);
    } catch (error) {
      console.error("Lỗi khi tải kết quả:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const quizScore = session?.percentage || 0;
  
  const grammarSection = lessonProgress?.sections?.grammar;
  const grammarTheoryItems = grammarSection?.items?.filter((i: any) => i.moduleType === 'grammar') || [];
  const completionRate = grammarTheoryItems.length > 0 
    ? Math.round((grammarTheoryItems.filter((i: any) => i.status === 'completed').length / grammarTheoryItems.length) * 100) 
    : 0;
          
  const isPassed = quizScore >= 80 && completionRate >= 80;

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.main} />
      </View>
    );
  }

  const metrics = [
    { id: 'theory', label: 'Học lý thuyết', value: completionRate, color: '#4ACB40', max: 100 },
    { id: 'quiz', label: 'Điểm trắc nghiệm', value: quizScore, color: '#FFB200', max: 100 },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ResultSummaryScreen
        title={isPassed ? "Hoàn thành xuất sắc!" : "Chưa hoàn thành!"}
        pointLabel={`${Math.round((quizScore + completionRate) / 2)} điểm`}
        subLabels={[
          `${session?.totalScore || 0}/${session?.maxScore || 100}`,
          `${formatTime(session?.timeSpent || 0)} giây`
        ]}
        metrics={metrics}
        primaryLabel={isPassed ? "Tiếp tục học Nghe" : "Quay lại Lý thuyết"}
        onClose={() => router.replace('/(tabs)')}
        onPrimaryPress={() => {
          if (isPassed) {
            router.replace(`/lessons/${lessonId}/listening/intro` as any);
          } else {
            router.replace(`/lessons/${lessonId}/grammar/detail` as any);
          }
        }}
        secondaryLabel="Làm lại Quiz Ngữ pháp"
        onSecondaryPress={() => router.replace(`/lessons/${lessonId}/grammar/quiz` as any)}
      />
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
    });