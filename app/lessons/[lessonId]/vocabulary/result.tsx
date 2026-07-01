import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';

import { FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import VocabularyService from '../../../../api/services/vocabulary.service';
import LessonService from '../../../../api/services/lesson.service';
import { LessonProgressResponse } from '../../../../api/types/lesson.types';
import { GetVocabulariesRequest, Vocabulary } from '../../../../api/types/vocabulary.types';
import IconButton from '../../../../components/IconButton';
import { XIcon } from 'phosphor-react-native';
import Button from '../../../../components/Button';
import SaveToFolderModal from '../../../../components/ModalOption/SaveToFolderModal';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';
import VocabularyCard from '../../../../components/VocabularyCard';
import { useTheme } from "@/contexts/ThemeContext";

export default function VocabularyResultScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const router = useRouter();
  const { lessonId, correctCount, totalCount } = useLocalSearchParams();

  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState<any[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgressResponse | null>(null);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const score = totalCount ? Math.round((Number(correctCount) / Number(totalCount)) * 100) : 0;

  useEffect(() => {
    const fetchData = async () => {
      if (!lessonId) return;
      try {
        setLoading(true);
        const [allVocabData, progressData] = await Promise.all([
          // Dùng trực tiếp Interface Request thay vì ép kiểu
          VocabularyService.getAll({ lessonId: lessonId as string, limit: 100 } as GetVocabulariesRequest),
          LessonService.getProgress(lessonId as string)
        ]);

        const mappedWords = (allVocabData.data?.vocabularies || []).map((card: Vocabulary) => ({
          id: card._id,
          word: card.word,
          type: card.type || card.category || 'Từ vựng',
          phonetic: card.pronunciationText || '',
          meaning: card.meaning,
        }));
        setWords(mappedWords);
        setLessonProgress(progressData);
      } catch (error) {
        console.error('Lỗi lấy dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId]);

  useEffect(() => {
    if (loading) return;

    let sound: Audio.Sound | null = null;
    if (score >= 80) setShowConfetti(true);

    const playSound = async () => {
      try {
        const audioUri = score < 80
          ? 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=wrong-answer-126515.mp3'
          : 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3';

        const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUri });
        sound = newSound;
        await sound.playAsync();
      } catch (error) {
        console.log('Lỗi phát âm thanh chúc mừng:', error);
      }
    };

    playSound();
    return () => { if (sound) sound.unloadAsync(); };
  }, [loading, score]);

  // ĐIỀU KIỆN PASS MỚI
  // Khắc phục lỗi Unwrapping BaseResponse
  const completionRate = lessonProgress?.data?.sections?.vocabulary?.progress || 0;
  const isPassed = score >= 80 && completionRate >= 80;

  const handleNextStep = () => {
    if (!isPassed) {
      let message = "";
      if (score < 80 && completionRate < 80) {
        message = "Bạn cần đạt 80 điểm Quiz và hoàn thành 80% nội dung học tập.";
      } else if (score < 80) {
        message = "Điểm Quiz của bạn chưa đạt 80. Hãy làm lại bài nhé!";
      } else {
        message = "Bạn chưa học đủ 80% từ vựng trong bài. Hãy quay lại học Flashcard nhé!";
      }

      Alert.alert("Chưa đạt yêu cầu", message);
      return;
    }
    router.push(`/lessons/${lessonId}/grammar/intro` as any);
  };

  const handleBookmark = (item: any) => {
    setSelectedWord(item);
    setShowSaveModal(true);
  };

  if (loading) return <SafeAreaView style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.header}><IconButton Icon={XIcon} onPress={() => setShowExitModal(true)} /></View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.celebrationSection}>
          <Image source={isPassed ? require('../../../../assets/images/horani/result-levelup.png') : require('../../../../assets/images/horani/failure.png')} style={styles.illustration} resizeMode="contain" />
          <Text style={[styles.titleText, !isPassed && { color: colors.red }]}>{isPassed ? 'Hoàn thành!' : 'Cố gắng thêm nhé!'}</Text>
        </View>

        <View style={[styles.scoreBanner, !isPassed && { backgroundColor: '#FFE5E5' }]}>
          <Text style={[styles.scoreText, !isPassed && { color: colors.red }]}>Đúng {correctCount}/{totalCount}</Text>
          <Text style={[styles.scoreText, !isPassed && { color: colors.red }]}>{score} điểm {isPassed ? '✓' : '✗'}</Text>
        </View>

        <View style={styles.contentSection}>
          {words.map((item) => (
            <VocabularyCard
              key={item.id}
              item={{ ...item, pos: item.type }}
              onToggleFavorite={() => handleBookmark(item)}
            />
          ))}
        </View>
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={styles.footer}>
        <Button
          title="Tiếp tục học Ngữ pháp"
          variant="Green"
          onPress={handleNextStep}
          disabled={!isPassed}
        />

        <Button
          title="Làm lại Quiz Từ vựng"
          variant="Outline"
          onPress={() => router.replace(`/lessons/${lessonId}/vocabulary/quiz`)}
          style={{ marginTop: Gap.gap_10 }}
        />
      </View>

      <SaveToFolderModal isVisible={showSaveModal} onClose={() => setShowSaveModal(false)} wordData={selectedWord} />
      <ConfirmModal isVisible={showExitModal} title="Rời khỏi?" subtitle="Quay về trang chủ nhé?" cancelText="Ở lại" confirmText="Rời đi" onCancel={() => setShowExitModal(false)} onConfirm={() => { setShowExitModal(false); router.push('/(tabs)'); }} />

      {showConfetti && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, elevation: 9999 }} pointerEvents="none">
          <ConfettiCannon count={150} origin={{ x: -10, y: 0 }} fadeOut={true} />
        </View>
      )}
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'flex-end', paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_10 },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: Padding.padding_20, paddingBottom: 40 },
  celebrationSection: { alignItems: 'center', marginBottom: Gap.gap_20 },
  illustration: { width: 160, height: 160, marginBottom: Gap.gap_10 },
  titleText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_24, color: colors.accent1 },
  scoreBanner: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.primaryLight, padding: Padding.padding_15, borderRadius: Border.br_15, marginBottom: Gap.gap_20 },
  scoreText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: colors.primary },
  contentSection: { width: '100%' },
  footer: { paddingHorizontal: Padding.padding_20, paddingVertical: Padding.padding_20, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.borderDefault }
});