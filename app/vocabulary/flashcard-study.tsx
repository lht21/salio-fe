import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowBendUpLeftIcon, ArrowBendUpRightIcon } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmModal } from '../../components/ModalResult/ConfirmModal';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import CloseButton from '../../components/CloseButton';
import SwipableFlashcard, { FlashcardData } from '../../components/SwipableFlashcard';
import FlashcardService from '../../api/services/flashcard.service';
import apiClient from '../../api/client';

export default function FlashcardStudyScreen() {
  const router = useRouter();
  const { setId } = useLocalSearchParams();

  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [learnCount, setLearnCount] = useState(0);
  const [studyHistory, setStudyHistory] = useState<Record<string, boolean>>({});

  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      if (!setId) return;
      try {
        setIsLoading(true);
        const res = await FlashcardService.getSetById(setId as string);
        if (res.success && res.data) {
          // Mapping dữ liệu từ API sang dạng FlashcardData để hiển thị
          const mappedCards: FlashcardData[] = (res.data.cards || []).map((card: any, index: number) => ({
            id: card._id || index.toString(),
            word: card.word,
            phonetic: card.pronunciationText || '',
            meaning: card.meaning,
            type: card.type || card.category || 'Từ vựng',
            hanja: card.sinoVietnamese ? [card.sinoVietnamese] : [],
            example: card.examples?.[0]?.korean || '',
            highlight: card.word,
            image: card.imageUrl || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400'
          }));
          setCards(mappedCards);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách flashcard:', error);
        Alert.alert('Lỗi', 'Không thể tải danh sách từ vựng.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCards();
  }, [setId]);

  const totalCards = cards.length;
  const currentCard = cards[currentIndex];

  const handleClose = () => {
    if (currentIndex > 0 && currentIndex < totalCards) {
      // Đã học dở dang -> Hiện Modal cảnh báo
      setShowExitModal(true);
    } else {
      router.back();
    }
  };

  const advanceToNext = (newHistory: Record<string, boolean>, finalKnownCount: number) => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      router.replace({
        pathname: '/vocabulary/flashcard-study-result',
        params: {
          setId,
          knownCount: finalKnownCount,
          totalCount: totalCards,
          history: JSON.stringify(newHistory)
        }
      });
    }
  };

  const onSwipedLeft = () => {
    setLearnCount(prev => prev + 1);
    let newHistory = studyHistory;
    
    if (currentCard) {
      newHistory = { ...studyHistory, [currentCard.id]: false };
      setStudyHistory(newHistory);
      apiClient.post(`/api/v1/vocabularies/${currentCard.id}/mark`, { status: 'forgotten' })
        .catch(err => console.error('Lỗi cập nhật tiến độ từ vựng (quẹt trái):', err));
    }
    
    advanceToNext(newHistory, knownCount);
  };

  const onSwipedRight = () => {
    const newKnownCount = knownCount + 1;
    setKnownCount(newKnownCount);
    let newHistory = studyHistory;
    
    if (currentCard) {
      newHistory = { ...studyHistory, [currentCard.id]: true };
      setStudyHistory(newHistory);
      apiClient.post(`/api/v1/vocabularies/${currentCard.id}/mark`, { status: 'remembered' })
        .catch(err => console.error('Lỗi cập nhật tiến độ từ vựng (quẹt phải):', err));
    }
    
    advanceToNext(newHistory, newKnownCount);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Color.main} />
      </SafeAreaView>
    );
  }

  if (totalCards === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: FontFamily.lexendDecaMedium }}>Không có thẻ nào để học.</Text>
        <CloseButton onPress={() => router.back()} style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.progressPill}>
            <Text style={styles.progressPillText}>
              {Math.min(currentIndex + 1, totalCards)}/{totalCards}
            </Text>
          </View>
          <CloseButton onPress={handleClose} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${((Math.min(currentIndex + 1, totalCards)) / totalCards) * 100}%` }]} />
        </View>

        {/* Counter Row */}
        <View style={styles.counterRow}>
          <Text style={styles.counterLearn}>— {learnCount}</Text>
          <Text style={styles.counterKnown}>{knownCount} +</Text>
        </View>
      </View>

      {/* FLASHCARD SECTION */}
      <View style={styles.flashcardArea}>
        {currentCard ? (
          <SwipableFlashcard
            key={currentCard.id}
            card={currentCard}
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
          />
        ) : (
          <Text style={{ fontFamily: FontFamily.lexendDecaMedium }}>Bạn đã học xong!</Text>
        )}
      </View>

      {/* FOOTER SWIPE HINTS */}
      <View style={styles.swipeHints}>
        <View style={styles.hintColumn}>
          <ArrowBendUpLeftIcon size={40} color={Color.stroke} weight="bold" />
          <Text style={styles.hintText}>Học lại</Text>
        </View>
        <View style={styles.hintColumn}>
          <ArrowBendUpRightIcon size={40} color={Color.stroke} weight="bold" />
          <Text style={styles.hintText}>Đã thuộc</Text>
        </View>
      </View>

      <ConfirmModal
        isVisible={showExitModal}
        title="Đang học dở mà"
        subtitle="Bạn sắp hoàn thành rồi, cố thêm chút nữa nhé!"
        cancelText="Vẫn rời đi"
        confirmText="Học tiếp"
        onCancel={() => {
          setShowExitModal(false);
          router.back();
        }}
        onConfirm={() => setShowExitModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.bg },
  header: { paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_15 },
  progressPill: { backgroundColor: Color.main2, paddingHorizontal: Padding.padding_15, paddingVertical: Padding.padding_5, borderRadius: Border.br_20 },
  progressPillText: { color: Color.bg, fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_14 },
  progressBarBg: { height: 4, backgroundColor: Color.stroke, borderRadius: 2, marginBottom: Gap.gap_15 },
  progressBarFill: { height: 4, backgroundColor: Color.main2, borderRadius: 2 },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between' },
  counterLearn: { color: Color.cam, fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16 },
  counterKnown: { color: Color.main2, fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16 },
  flashcardArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  swipeHints: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Padding.padding_30, paddingBottom: Padding.padding_30 },
  hintColumn: { alignItems: 'center' },
  hintText: { color: Color.gray, fontFamily: FontFamily.lexendDecaBold, marginTop: Gap.gap_5 }
});