import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SpeakerHighIcon, BookmarkSimpleIcon } from 'phosphor-react-native';

import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import CloseButton from '../../components/CloseButton';
import Button from '../../components/Button';
import SaveToFolderModal from '../../components/ModalOption/SaveToFolderModal';
import { ConfirmModal } from '../../components/ModalResult/ConfirmModal';
import FlashcardService from '../../api/services/flashcard.service';

export default function FlashcardQuizResultScreen() {
  const router = useRouter();
  const { setId, correctCount, totalCount, history } = useLocalSearchParams();
  
  const [words, setWords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  // Parse lịch sử đáp án đúng/sai từ quiz (Format: { [wordId]: boolean })
  const historyMap = history ? JSON.parse(history as string) : {};
  const score = totalCount ? Math.round((Number(correctCount) / Number(totalCount)) * 100) : 0;

  useEffect(() => {
    const fetchSetDetail = async () => {
      if (!setId) return;
      try {
        setIsLoading(true);
        const res = await FlashcardService.getSetById(setId as string);
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
      } catch (error) {
        console.error('Lỗi lấy chi tiết bộ flashcard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSetDetail();
  }, [setId]);

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
        <CloseButton variant="Stroke" onPress={() => setShowExitModal(true)} />
      </View>

      <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* 2. CELEBRATION */}
        <View style={styles.celebrationSection}>
          <Image 
            source={require('../../assets/images/horani/result-levelup.png')} 
            style={styles.illustration} 
            resizeMode="contain" 
          />
          <Text style={styles.titleText}>Hoàn thành!</Text>
        </View>

        {/* 3. SCORE BANNER */}
        <View style={styles.scoreBanner}>
          <Text style={styles.scoreText}>Đúng {correctCount}/{totalCount}</Text>
          <Text style={styles.scoreText}>{score} điểm</Text>
        </View>

        {/* 4. RESULT LIST */}
        <View style={styles.listSection}>
          {words.map((item) => {
            const isCorrect = historyMap[item.id] ?? false; // Tra cứu trạng thái từ lịch sử
            return (
              <View 
                key={item.id} 
                style={[
                  styles.card, 
                  isCorrect ? styles.cardCorrect : styles.cardIncorrect
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Đáp án</Text>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{item.type}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.wordInfo}>
                    <Text style={styles.wordText}>{item.word}</Text>
                    {!!item.phonetic && <Text style={styles.phoneticText}>[{item.phonetic}]</Text>}
                    <Text style={styles.meaningText}>{item.meaning}</Text>
                  </View>
                  
                  <View style={styles.actionGroup}>
                    <TouchableOpacity style={styles.iconBtn}>
                      <SpeakerHighIcon size={24} color={Color.text} weight="fill" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => handleBookmark(item)}>
                      <BookmarkSimpleIcon size={24} color={Color.text} weight="bold" />
                    </TouchableOpacity>
                  </View>
                </View>
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

  // --- STYLES CHO CARD ---
  card: {
    backgroundColor: Color.bg, borderRadius: Border.br_15, borderWidth: 2,
    padding: Padding.padding_15, marginBottom: 12,
  },
  cardCorrect: { borderColor: Color.main },
  cardIncorrect: { borderColor: Color.red },
  
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Gap.gap_10 },
  cardTitle: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_14, color: Color.gray, marginRight: Gap.gap_10 },
  
  typeBadge: { backgroundColor: Color.greenLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.main2 },
  
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  wordInfo: { flex: 1 },
  
  wordText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_20, color: Color.text, marginBottom: 4 },
  phoneticText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.gray, marginBottom: 4 },
  meaningText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_16, color: Color.text },
  
  actionGroup: { flexDirection: 'row', gap: Gap.gap_10 },
  iconBtn: { padding: 4 },

  footer: {
    paddingHorizontal: Padding.padding_20, paddingVertical: Padding.padding_20,
    backgroundColor: Color.bg, borderTopWidth: 1, borderTopColor: Color.stroke,
  }
});