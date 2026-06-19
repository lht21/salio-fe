import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Audio } from 'expo-av';

import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import IconButton from '../../components/IconButton';
import { XIcon } from 'phosphor-react-native';

import Button from '../../components/Button';
import SaveToFolderModal from '../../components/ModalOption/SaveToFolderModal';
import { ConfirmModal } from '../../components/ModalResult/ConfirmModal';
import FlashcardService from '../../api/services/flashcard.service';
import VocabularyCard from '../../components/VocabularyCard';
import apiClient from '../../api/client';

export default function FlashcardQuizResultScreen() {
  const router = useRouter();
  const { setId, correctCount, totalCount, history } = useLocalSearchParams();
  
  const [words, setWords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [missionD2, setMissionD2] = useState<any>(null);

  // Parse lịch sử đáp án đúng/sai từ quiz (Format: { [wordId]: boolean })
  const historyMap = history ? JSON.parse(history as string) : {};
  const score = totalCount ? Math.round((Number(correctCount) / Number(totalCount)) * 100) : 0;

  useEffect(() => {
    const fetchSetDetail = async () => {
      if (!setId) return;
      try {
        setIsLoading(true);
        const [res, missionsRes] = await Promise.all([
          FlashcardService.getSetById(setId as string),
          apiClient.get('/api/v1/gamification/daily-missions').catch(() => null)
        ]);

        if (res.success && res.data) {
          const mappedWords = (res.data.cards || []).map((card: any) => ({
            id: card._id,
            word: card.word,
            type: card.type || card.category || 'Từ vựng',
            phonetic: card.pronunciationText || '',
            meaning: card.meaning,
          }));
          setWords(mappedWords);
        }

        if (missionsRes?.data?.success) {
          const d2 = missionsRes.data.data.find((m: any) => m.id === 'D2');
          setMissionD2(d2);
        }
      } catch (error) {
        console.error('Lỗi lấy chi tiết bộ flashcard hoặc nhiệm vụ:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSetDetail();
  }, [setId]);

  // Chơi âm thanh và hiện pháo giấy khi load xong dữ liệu
  useEffect(() => {
    // Dựa theo logic của ExamResultUI.tsx
    // Chỉ chạy khi đã load xong dữ liệu
    if (isLoading) {
      return;
    }

    let sound: Audio.Sound | null = null;

    // Chỉ bắn pháo giấy nếu điểm lớn hơn hoặc bằng 80
    if (score >= 80) {
      setShowConfetti(true);
    }

    const playSound = async () => {
      try {
        const audioUri = score < 50 
          ? 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_c6ccf3232f.mp3?filename=negative_beeps-6008.mp3' // Âm thanh thất bại / buồn
          : 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3'; // Âm thanh chúc mừng

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri }
        );
        sound = newSound;
        await sound.playAsync();
      } catch (error) {
        console.log('Lỗi phát âm thanh chúc mừng:', error);
      }
    };

    playSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [isLoading, score]);

  const handleBookmark = (item: any) => {
    setSelectedWord(item);
    setShowSaveModal(true);
  };

  const handleDone = () => {
    // Dùng router.back() để quay lại màn detail (vì lúc nãy ta dùng router.replace từ quiz sang result)
    router.back();
  };

  const handleRetry = () => {
    // Làm lại bài quiz
    router.replace({ pathname: '/vocabulary/flashcard-quiz', params: { setId } });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Color.main} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <IconButton Icon={XIcon} onPress={() => setShowExitModal(true)} />
      </View>

      <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* 2. CELEBRATION */}
        <View style={styles.celebrationSection}>
          <Image 
            source={
              score < 50 
                ? require('../../assets/images/horani/failure.png') 
                : require('../../assets/images/horani/result-levelup.png')
            } 
            style={styles.illustration} 
            resizeMode="contain" 
          />
          <Text style={styles.titleText}>{score < 50 ? 'Cần cố gắng hơn!' : 'Hoàn thành!'}</Text>
        </View>

        {/* 3. SCORE BANNER */}
        <View style={styles.scoreBanner}>
          <Text style={styles.scoreText}>Đúng {correctCount}/{totalCount}</Text>
          <Text style={styles.scoreText}>{score} điểm</Text>
        </View>

        {/* MISSION D2 BANNER */}
        {missionD2 && (
          <View style={[styles.scoreBanner, { backgroundColor: missionD2.isCompleted ? Color.greenLight : Color.bg2, marginTop: -10 }]}>
            <Text style={[styles.scoreText, { color: missionD2.isCompleted ? Color.main2 : Color.text }]}>
              {missionD2.isCompleted 
                ? '🎉 Đã hoàn thành nhiệm vụ D2: Học 10 từ vựng!' 
                : `Nhiệm vụ D2: Học từ vựng (${missionD2.progress}/10)`}
            </Text>
          </View>
        )}

        {/* 4. RESULT LIST */}
        <View style={styles.listSection}>
          {words.map((item) => {
            const isCorrect = historyMap[item.id] ?? false; // Tra cứu trạng thái từ lịch sử
            return (
              <View key={item.id}>
                <Text style={[styles.resultLabel, isCorrect ? styles.textCorrect : styles.textIncorrect]}>
                  {isCorrect ? 'Đúng' : 'Sai'}
                </Text>
                <VocabularyCard 
                  item={{ ...item, pos: item.type }} 
                  onToggleFavorite={() => handleBookmark(item)} 
                />
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* 5. ACTION BUTTONS */}
      <View style={styles.footer}>
        <Button 
          title="Về bộ từ vựng" 
          variant="Outline" 
          onPress={handleDone} 
        />
        <Button 
          title="Kiểm tra lại" 
          variant="Green" 
          onPress={handleRetry} 
          style={{ marginTop: Gap.gap_10 }}
        />
      </View>

      {/* MODALS */}
      <SaveToFolderModal 
        isVisible={showSaveModal} 
        onClose={() => setShowSaveModal(false)}
        wordData={selectedWord}
      />

      <ConfirmModal 
        isVisible={showExitModal}
        title="Đang xem kết quả mà"
        subtitle="Bạn muốn trở về bộ từ vựng ngay bây giờ?"
        cancelText="Ở lại"
        confirmText="Về bộ từ vựng"
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => {
          setShowExitModal(false);
          handleDone();
        }}
      />

      {showConfetti && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, elevation: 9999 }} pointerEvents="none">
          <ConfettiCannon count={150} origin={{ x: -10, y: 0 }} fadeOut={true} />
        </View>
      )}
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.bg },
  header: { alignItems: 'flex-end', paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_10 },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: Padding.padding_20, paddingBottom: 40 },
  
  celebrationSection: { alignItems: 'center', marginBottom: Gap.gap_20 },
  illustration: { width: 160, height: 160, marginBottom: Gap.gap_10 },
  titleText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_24, color: Color.xanh },

  scoreBanner: {
    flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Color.greenLight,
    padding: Padding.padding_15, borderRadius: Border.br_15, marginBottom: Gap.gap_20,
  },
  scoreText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: Color.main2 },
  
  listSection: { width: '100%' },

  resultLabel: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14,
    marginBottom: 8,
    marginLeft: 4,
  },
  textCorrect: { color: Color.main2 },
  textIncorrect: { color: Color.red },

  footer: {
    paddingHorizontal: Padding.padding_20, paddingVertical: Padding.padding_20,
    backgroundColor: Color.bg, borderTopWidth: 1, borderTopColor: Color.stroke,
  }
});