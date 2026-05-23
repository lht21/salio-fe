import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SpeakerHighIcon, BookmarkSimpleIcon, CheckCircleIcon, XCircleIcon, LockIcon } from 'phosphor-react-native';
import * as Speech from 'expo-speech';

import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import { useUser } from '../../../../contexts/UserContext';
import VocabularyService from '../../../../api/services/vocabulary.service';
import LessonService from '../../../../api/services/lesson.service';
import CloseButton from '../../../../components/CloseButton';
import Button from '../../../../components/Button';
import SaveToFolderModal from '../../../../components/ModalOption/SaveToFolderModal';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';

type TabType = 'quiz' | 'vocab';

export default function VocabularyResultScreen() {
  const router = useRouter();
  const { lessonId, sessionId } = useLocalSearchParams();
  const { user } = useUser();

  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null); 
  const [allLessonVocab, setAllLessonVocab] = useState<any[]>([]); 
  const [activeTab, setActiveTab] = useState<TabType>('quiz');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<any>(null);

  // Điểm tối thiểu để pass (80%)
  const PASS_SCORE = 80;

  useEffect(() => {
    fetchData();
  }, [lessonId, sessionId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizData, allVocabData, progressData] = await Promise.all([
        VocabularyService.getVocabularyQuizResult(sessionId as string),
        VocabularyService.getAll({ lessonId: lessonId as string, limit: 100 }),
        LessonService.getLessonProgress(lessonId as string) // Lấy tiến độ thực tế
      ]);
      setSession(quizData);
      setAllLessonVocab(allVocabData.vocabularies || []);
      setLessonProgress(progressData);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  // ĐIỀU KIỆN PASS MỚI
  const quizScore = session?.percentage || 0;
  const completionRate = lessonProgress?.sections?.vocabulary?.progress || 0;
  const isPassed = quizScore >= 80 && completionRate >= 80;

  const handleNextStep = () => {
    if (!isPassed) {
      let message = "";
      if (quizScore < 80 && completionRate < 80) {
        message = "Bạn cần đạt 80 điểm Quiz và hoàn thành 80% nội dung học tập.";
      } else if (quizScore < 80) {
        message = "Điểm Quiz của bạn chưa đạt 80. Hãy làm lại bài nhé!";
      } else {
        message = "Bạn chưa học đủ 80% từ vựng trong bài. Hãy quay lại học Flashcard nhé!";
      }

      Alert.alert("Chưa đạt yêu cầu", message);
      return;
    }
    router.push(`/lessons/${lessonId}/grammar/intro` as any);
  };
  const getVocabStatus = (vocabId: string) => {
    const quizItem = session?.questions?.find((q: any) => 
        (q.vocabulary?._id || q.vocabulary) === vocabId
    );
    if (quizItem) {
      return {
        isCorrect: quizItem.isCorrect,
        label: quizItem.isCorrect ? 'ĐÃ NHỚ' : 'SAI QUIZ', 
        color: quizItem.isCorrect ? Color.main : Color.red,
        bgColor: quizItem.isCorrect ? '#E8F5E9' : '#FFE5E5'
      };
    }
    const vocab = allLessonVocab.find(v => v._id === vocabId);
    const globalStatus = vocab?.learningStatus?.status;
    if (globalStatus === 'remembered') return { isCorrect: true, label: 'ĐÃ BIẾT', color: Color.main2, bgColor: Color.greenLight };
    if (globalStatus === 'forgotten') return { isCorrect: false, label: 'HAY QUÊN', color: Color.red, bgColor: '#FFE5E5' };
    return { isCorrect: null, label: 'ĐANG HỌC', color: '#FF9500', bgColor: '#FFF4E5' };
  };

  const handleSpeak = (word: string) => {
    const voiceGender = user?.preferences?.voiceGender || 'male';
    Speech.stop();
    Speech.speak(word, { language: 'ko-KR', rate: 0.75, pitch: voiceGender === 'male' ? 0.8 : 1.1 });
  };

  if (loading) return <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" color={Color.main} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}><CloseButton variant="Stroke" onPress={() => setShowExitModal(true)} /></View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.celebrationSection}>
          <Image source={isPassed ? require('../../../../assets/images/horani/result-levelup.png') : require('../../../../assets/images/horani/failure.png')} style={styles.illustration} resizeMode="contain" />
          <Text style={[styles.titleText, !isPassed && {color: Color.red}]}>{isPassed ? 'Hoàn thành!' : 'Cố gắng thêm nhé!'}</Text>
        </View>

        <View style={[styles.scoreBanner, !isPassed && {backgroundColor: '#FFE5E5'}]}>
          <Text style={[styles.scoreText, !isPassed && {color: Color.red}]}>Đúng {session?.totalScore}/{session?.maxScore}</Text>
          <Text style={[styles.scoreText, !isPassed && {color: Color.red}]}>{session?.percentage} điểm {isPassed ? '✓' : '✗'}</Text>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity style={[styles.tabItem, activeTab === 'quiz' && styles.tabItemActive]} onPress={() => setActiveTab('quiz')}>
            <Text style={[styles.tabText, activeTab === 'quiz' && styles.tabTextActive]}>Bài làm ({session?.questions?.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, activeTab === 'vocab' && styles.tabItemActive]} onPress={() => setActiveTab('vocab')}>
            <Text style={[styles.tabText, activeTab === 'vocab' && styles.tabTextActive]}>Từ vựng ({allLessonVocab.length})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentSection}>
          {activeTab === 'quiz' ? (
            session?.questions?.map((item: any, index: number) => (
              <View key={index} style={[styles.quizCard, item.isCorrect ? styles.borderCorrect : styles.borderIncorrect]}>
                <View style={styles.quizHeader}>
                  <Text style={styles.quizIndex}>Câu {index + 1}</Text>
                  {item.isCorrect ? <CheckCircleIcon size={22} color={Color.main} weight="fill" /> : <XCircleIcon size={22} color={Color.red} weight="fill" />}
                </View>
                <Text style={styles.quizQuestion}>{item.question?.questionText}</Text>
                <View style={styles.answerSection}>
                  <Text style={styles.answerLabel}>Bạn chọn: <Text style={item.isCorrect ? styles.textCorrect : styles.textIncorrect}>{item.userAnswer || '(Bỏ trống)'}</Text></Text>
                  {!item.isCorrect && <Text style={[styles.answerLabel, {marginTop: 4}]}>Đáp án đúng: <Text style={styles.textCorrect}>{item.question?.correctAnswer}</Text></Text>}
                </View>
              </View>
            ))
          ) : (
            allLessonVocab.map((vocab: any, index: number) => {
              const status = getVocabStatus(vocab._id);
              return (
                <View key={index} style={[styles.card, status.isCorrect === true ? styles.cardCorrect : status.isCorrect === false ? styles.cardIncorrect : {borderColor: Color.stroke}]}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}><Text style={[styles.statusTabText, { color: status.color }]}>{status.label}</Text></View>
                    <View style={styles.typeBadge}><Text style={styles.typeText}>{vocab.type}</Text></View>
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.wordInfo}>
                      <Text style={styles.wordText}>{vocab.word}</Text>
                      <Text style={styles.phoneticText}>[{vocab.pronunciationText}]</Text>
                      <Text style={styles.meaningText}>{vocab.meaning}</Text>
                    </View>
                    <View style={styles.actionGroup}>
                      <TouchableOpacity style={styles.iconBtn} onPress={() => handleSpeak(vocab.word)}><SpeakerHighIcon size={24} color={Color.text} weight="fill" /></TouchableOpacity>
                      <TouchableOpacity style={styles.iconBtn} onPress={() => { setSelectedWord(vocab); setShowSaveModal(true); }}><BookmarkSimpleIcon size={24} color={Color.text} weight="bold" /></TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={styles.footer}>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={handleNextStep}
          style={[styles.nextBtn, !isPassed && styles.nextBtnDisabled]}
        >
          <Text style={styles.nextBtnText}>Tiếp tục học Ngữ pháp</Text>
          {!isPassed && <LockIcon size={20} color={Color.whiteText} weight="bold" />}
        </TouchableOpacity>

        <Button 
          title="Làm lại Quiz Từ vựng" 
          variant="Outline" 
          onPress={() => router.replace(`/lessons/${lessonId}/vocabulary/quiz`)} 
          style={{ marginTop: Gap.gap_10 }} 
        />
      </View>

      <SaveToFolderModal isVisible={showSaveModal} onClose={() => setShowSaveModal(false)} wordData={selectedWord} />
      <ConfirmModal isVisible={showExitModal} title="Rời khỏi?" subtitle="Quay về trang chủ nhé?" cancelText="Ở lại" confirmText="Rời đi" onCancel={() => setShowExitModal(false)} onConfirm={() => { setShowExitModal(false); router.push('/(tabs)'); }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.bg },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'flex-end', paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_10 },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: Padding.padding_20, paddingBottom: 40 },
  celebrationSection: { alignItems: 'center', marginBottom: Gap.gap_20 },
  illustration: { width: 140, height: 140, marginBottom: Gap.gap_10 },
  titleText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_24, color: Color.xanh },
  scoreBanner: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.greenLight, padding: Padding.padding_15, borderRadius: Border.br_15, marginBottom: Gap.gap_20 },
  scoreText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: Color.main2 },
  tabBar: { flexDirection: 'row', marginBottom: Gap.gap_20, borderBottomWidth: 1, borderBottomColor: Color.stroke },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabItemActive: { borderBottomWidth: 3, borderBottomColor: Color.main },
  tabText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.gray },
  tabTextActive: { color: Color.main, fontFamily: FontFamily.lexendDecaBold },
  contentSection: { width: '100%' },
  quizCard: { backgroundColor: Color.whiteText, borderRadius: Border.br_15, padding: Padding.padding_15, marginBottom: 16, borderWidth: 1 },
  borderCorrect: { borderColor: Color.main },
  borderIncorrect: { borderColor: Color.red },
  quizHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  quizIndex: { fontFamily: FontFamily.lexendDecaBold, color: Color.gray },
  quizQuestion: { fontFamily: FontFamily.lexendDecaBold, fontSize: 18, color: Color.text, marginBottom: 12 },
  answerSection: { backgroundColor: '#F0F2F5', padding: 12, borderRadius: 10 },
  answerLabel: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 14, color: Color.text },
  textCorrect: { color: Color.main, fontFamily: FontFamily.lexendDecaBold },
  textIncorrect: { color: Color.red, fontFamily: FontFamily.lexendDecaBold },
  card: { backgroundColor: Color.bg, borderRadius: Border.br_15, borderWidth: 2, padding: Padding.padding_15, marginBottom: 12 },
  cardCorrect: { borderColor: Color.main },
  cardIncorrect: { borderColor: Color.red },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Gap.gap_10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 8 },
  statusTabText: { fontFamily: FontFamily.lexendDecaBold, fontSize: 10 },
  typeBadge: { backgroundColor: Color.greenLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.main2 },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  wordInfo: { flex: 1 },
  wordText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_20, color: Color.text, marginBottom: 4 },
  phoneticText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.gray, marginBottom: 4 },
  meaningText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_16, color: Color.text },
  actionGroup: { flexDirection: 'row', gap: Gap.gap_10 },
  iconBtn: { padding: 4 },
  footer: { paddingHorizontal: Padding.padding_20, paddingVertical: Padding.padding_20, backgroundColor: Color.bg, borderTopWidth: 1, borderTopColor: Color.stroke },
  
  /* Cập nhật style cho nút Tiếp tục */
  nextBtn: {
    backgroundColor: Color.main,
    paddingVertical: 16,
    borderRadius: Border.br_30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  nextBtnDisabled: {
    backgroundColor: Color.gray, 
  },
  nextBtnText: {
    color: Color.picVocabText,
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
  }
});