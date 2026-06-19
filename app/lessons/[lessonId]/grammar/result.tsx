import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircleIcon, XCircleIcon, LockIcon } from 'phosphor-react-native';

import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import Button from '../../../../components/Button';
import IconButton from '../../../../components/IconButton';
import { XIcon } from 'phosphor-react-native';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal'; 
import GrammarService from '@/api/services/grammar.service';
import LessonService from '@/api/services/lesson.service';

type TabType = 'review' | 'list';

export default function GrammarResultScreen() {
  const router = useRouter();
  const { lessonId, sessionId } = useLocalSearchParams();
  
  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null); // Kết quả Quiz
  const [lessonGrammars, setLessonGrammars] = useState<any[]>([]); // Danh sách cấu trúc trong bài
  const [activeTab, setActiveTab] = useState<TabType>('review');
  const [showExitModal, setShowExitModal] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<any>(null);

  const PASS_SCORE = 80;

  useEffect(() => {
    if (sessionId) fetchData();
  }, [sessionId, lessonId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizResult, progressData] = await Promise.all([
        GrammarService.getGrammarQuizResult(sessionId as string),
        LessonService.getProgress(lessonId as string)
      ]);
      setSession(quizResult?.data || quizResult);
      setLessonProgress(progressData?.data || progressData);
    } catch (error) {
      console.error("Lỗi khi tải kết quả:", error);
    } finally {
      setLoading(false);
    }
  };

  // ĐIỀU KIỆN PASS NGỮ PHÁP
  const quizScore = session?.percentage || 0;
  
  const grammarSection = lessonProgress?.sections?.grammar;
  // Chỉ lấy các thẻ ngữ pháp lý thuyết (moduleType === 'grammar') để tính tỉ lệ hoàn thành
  const grammarTheoryItems = grammarSection?.items?.filter((i: any) => i.moduleType === 'grammar') || [];
  const completionRate = grammarTheoryItems.length > 0 
    ? Math.round((grammarTheoryItems.filter((i: any) => i.status === 'completed').length / grammarTheoryItems.length) * 100) 
    : 0;

  // Thêm Log để debug dễ dàng hơn trên Terminal (Metro)
  console.log('--- GRAMMAR RESULT DEBUG ---');
  console.log('Quiz Score:', quizScore);
  console.log('Grammar Theory Items Total:', grammarTheoryItems.length);
  console.log('Grammar Theory Items Completed:', grammarTheoryItems.filter((i: any) => i.status === 'completed').length);
  console.log('Calculated Completion Rate:', completionRate);
  // Nếu cần xem toàn bộ object có thể mở comment dòng dưới:
  // console.log('Grammar Section Object:', JSON.stringify(grammarSection, null, 2));
          
  const isPassed = quizScore >= 80 && completionRate >= 80;

  const handleNext = () => {
    if (!isPassed) {
      const msg = completionRate < 80 
        ? "Bạn phải đánh dấu 'Nhớ' ít nhất 80% thẻ lý thuyết ngữ pháp mới được đi tiếp." 
        : "Điểm Quiz của bạn phải từ 80 trở lên.";
      Alert.alert("Chưa mở khóa", msg);
      return;
    }
    router.push(`/lessons/${lessonId}/listening/intro` as any);
  };

  const handleRetry = () => {
    router.replace(`/lessons/${lessonId}/grammar/quiz` as any);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}p ${s}s` : `${s} giây`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.main} />
        <Text style={styles.loadingText}>Đang tổng hợp kết quả...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <IconButton Icon={XIcon} onPress={() => setShowExitModal(true)} />
          
      </View>

      <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.celebrationSection}>
          <Image 
            source={isPassed ? require('../../../../assets/images/horani/result-levelup.png') : require('../../../../assets/images/horani/failure.png')} 
            style={styles.illustration} 
            resizeMode="contain" 
          />
          <Text style={[styles.titleText, !isPassed && { color: Color.red }]}>
            {isPassed ? 'Hoàn thành!' : 'Chưa đạt yêu cầu'}
          </Text>
        </View>

        <View style={[styles.scoreBanner, !isPassed && { backgroundColor: '#FFEBEB' }]}>
          <View>
            <Text style={[styles.scoreText, !isPassed && { color: Color.red }]}>Đúng {session?.totalScore / (session?.questions?.[0]?.question?.points || 1)}/{session?.questions?.length}</Text>
            <Text style={[styles.timeText, !isPassed && { color: Color.red }]}>Thời gian: {formatTime(session?.timeSpent || 0)}</Text>
          </View>
          <View style={styles.scoreRight}>
            <Text style={[styles.scoreNumber, !isPassed && { color: Color.red }]}>{session?.percentage}</Text>
            <Text style={[styles.scoreLabel, !isPassed && { color: Color.red }]}>điểm</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Tiến độ học lý thuyết</Text>
          <Text style={[styles.progressLargeValue, completionRate < 80 && { color: Color.red }]}>
            {Math.round(completionRate)}%
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.min(completionRate, 100)}%`, backgroundColor: completionRate < 80 ? Color.red : Color.main }]} />
          </View>
          {!isPassed && (
            <Text style={styles.progressMessage}>Hãy cố gắng thêm nữa để vượt qua phần này nhé!</Text>
          )}
        </View>

                <View style={styles.listSection}>
          {session?.questions?.map((item: any, index: number) => (
            <View key={index} style={[styles.card, item.isCorrect ? styles.cardCorrect : styles.cardIncorrect]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Câu {index + 1}</Text>
                {item.isCorrect ? <CheckCircleIcon size={20} color={Color.main} weight="fill" /> : <XCircleIcon size={20} color={Color.red} weight="fill" />}
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.questionText}>{item.question?.questionText || item.question?.question}</Text>
                <View style={styles.answerArea}>
                  {!item.isCorrect && (
                    <Text style={styles.wrongAnswerText}>Của bạn: <Text style={styles.strikeThrough}>{item.userAnswer || '(Trống)'}</Text></Text>
                  )}
                  <Text style={styles.rightAnswerText}>Đáp án đúng: {item.question?.correctAnswer}</Text>
                </View>
                {item.question?.explanation && <Text style={styles.explanationText}>💡 {item.question.explanation}</Text>}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleNext}
          style={[styles.nextBtn, !isPassed && styles.nextBtnDisabled]}
        >
          <Text style={styles.nextBtnText}>Tiếp tục học Nghe</Text>
          {!isPassed && <LockIcon size={20} color="#FFF" weight="bold" />}
        </TouchableOpacity>

        <Button title="Làm lại Quiz Ngữ pháp" variant="Outline" onPress={handleRetry} style={{ marginTop: Gap.gap_10 }} />
      </View>

      <ConfirmModal 
        isVisible={showExitModal}
        title="Trở về trang chủ?"
        subtitle="Hệ thống đã lưu kết quả, bạn có muốn quay về màn hình chính?"
        cancelText="Ở lại" confirmText="Trở về"
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => { setShowExitModal(false); router.push('/(tabs)'); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.bg },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontFamily: FontFamily.lexendDecaMedium, color: Color.gray },
  header: { alignItems: 'flex-end', paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_10 },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: Padding.padding_20, paddingBottom: 40 },
  celebrationSection: { alignItems: 'center', marginBottom: Gap.gap_20 },
  illustration: { width: 140, height: 140, marginBottom: Gap.gap_10 },
  titleText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_24, color: Color.xanh },
  scoreBanner: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: Color.greenLight, padding: Padding.padding_15,
    borderRadius: Border.br_15, marginBottom: Gap.gap_20,
  },
  scoreText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: Color.main2, marginBottom: 4 },
  timeText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.main2, opacity: 0.8 },
  scoreRight: { alignItems: 'flex-end', justifyContent: 'center' },
  scoreNumber: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_24, color: Color.main2, lineHeight: 28 },
  scoreLabel: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.main2 },
  
  progressCard: { backgroundColor: '#F8FAFC', padding: Padding.padding_20, borderRadius: Border.br_15, marginBottom: Gap.gap_20, borderWidth: 1, borderColor: Color.stroke, alignItems: 'center' },
  progressTitle: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 16, color: Color.gray, marginBottom: Gap.gap_10 },
  progressLargeValue: { fontFamily: FontFamily.lexendDecaBold, fontSize: 40, color: Color.main, marginBottom: Gap.gap_15 },
  progressBarBg: { width: '100%', height: 10, backgroundColor: Color.stroke, borderRadius: 5, marginBottom: Gap.gap_15 },
  progressBarFill: { height: 10, borderRadius: 5 },
  progressMessage: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 14, color: Color.cam, textAlign: 'center' },

  tabBar: { flexDirection: 'row', marginBottom: Gap.gap_20, borderBottomWidth: 1, borderBottomColor: Color.stroke },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabItemActive: { borderBottomWidth: 3, borderBottomColor: Color.main },
  tabText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 14, color: Color.gray },
  tabTextActive: { color: Color.main, fontFamily: FontFamily.lexendDecaBold },

  listSection: { width: '100%' },
  card: { backgroundColor: Color.bg, borderRadius: Border.br_15, borderWidth: 2, padding: Padding.padding_15, marginBottom: 12 },
  cardCorrect: { borderColor: Color.main },
  cardIncorrect: { borderColor: Color.red },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_10 },
  cardTitle: { fontFamily: FontFamily.lexendDecaBold, fontSize: 14, color: Color.gray },
  questionText: { fontFamily: FontFamily.lexendDecaBold, fontSize: 16, color: Color.text, marginBottom: Gap.gap_10 },
  answerArea: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 10, marginBottom: 10 },
  wrongAnswerText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 14, color: Color.gray },
  strikeThrough: { textDecorationLine: 'line-through', color: Color.red },
  rightAnswerText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 14, color: Color.main2 },
  explanationText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: 13, color: Color.text, opacity: 0.8 },

  grammarItemCard: { backgroundColor: Color.whiteText, padding: 16, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: Color.stroke },
  grammarStructure: { fontFamily: FontFamily.lexendDecaBold, fontSize: 18, color: Color.main },
  grammarMeaning: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 14, color: Color.text, marginTop: 4 },

  footer: { paddingHorizontal: Padding.padding_20, paddingVertical: 20, backgroundColor: Color.bg, borderTopWidth: 1, borderTopColor: Color.stroke },
  nextBtn: {
    backgroundColor: Color.main,
    paddingVertical: 16,
    borderRadius: Border.br_30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  cardBody: {
    flexDirection: 'column',
    marginTop: 4,
  },
  nextBtnDisabled: { backgroundColor: Color.gray },
  nextBtnText: { color: '#FFF', fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 16 },
});