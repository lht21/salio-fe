import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowBendUpLeftIcon, ArrowBendUpRightIcon } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmModal } from '../../components/ModalResult/ConfirmModal';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import IconButton from '../../components/IconButton';
import QuizHeader from '../../components/Modals/Question/QuizHeader';
import { XIcon } from 'phosphor-react-native';
import SwipableFlashcard, { FlashcardData } from '../../components/SwipableFlashcard';
import FlashcardService from '../../api/services/flashcard.service';
import apiClient from '../../api/client';
import Cards02Icon from '../../components/icons/Cards02Icon';

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
        const [res, favRes] = await Promise.all([
          FlashcardService.getSetById(setId as string),
          FlashcardService.getSetById('favorite').catch(() => null)
        ]);

        if (res.success && res.data) {
          const favoriteIds = new Set();
          if (favRes && favRes.success && favRes.data) {
            (favRes.data.cards || []).forEach((c: any) => favoriteIds.add(c._id || c));
          }

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
            image: card.imageUrl || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400',
            isFavorite: setId === 'favorite' ? true : favoriteIds.has(card._id)
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

  const handleToggleFavorite = async (id: string | number) => {
    const cardId = id.toString();
    const targetCardIndex = cards.findIndex(c => c.id === id);
    if (targetCardIndex === -1) return;
    
    const targetCard = cards[targetCardIndex];
    const isCurrentlyFavorite = targetCard.isFavorite;

    // Optimistic Update: Cập nhật UI ngay lập tức
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));

    try {
      if (isCurrentlyFavorite) {
        await FlashcardService.removeCardFromSet('favorite', cardId);
      } else {
        await FlashcardService.addCardsToSet('favorite', { vocabIds: [cardId] });
      }
    } catch (error) {
      // Rollback UI nếu API gọi lỗi
      setCards(prev => prev.map(c => c.id === id ? { ...c, isFavorite: isCurrentlyFavorite } : c));
      console.error('Lỗi khi cập nhật yêu thích:', error);
    }
  };

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
        <IconButton Icon={XIcon} onPress={() => router.back()} style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER SECTION */}
      <QuizHeader
        current={Math.min(currentIndex + 1, totalCards)}
        total={totalCards}
        incorrectCount={0}
        onClose={handleClose}
        icon={<Cards02Icon width={40} height={40} />}
      />

      {/* Counter Row */}
      <View style={styles.counterRow}>
        <Text style={styles.counterLearn}>— {learnCount}</Text>
        <Text style={styles.counterKnown}>{knownCount} +</Text>
      </View>

      {/* FLASHCARD SECTION */}
      <View style={styles.flashcardArea}>
        {currentCard ? (
          <SwipableFlashcard
            key={currentCard.id}
            card={currentCard}
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
            onToggleFavorite={() => handleToggleFavorite(currentCard.id)}
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
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Padding.padding_20, marginBottom: Gap.gap_10 },
  counterLearn: { color: Color.cam, fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16 },
  counterKnown: { color: Color.main2, fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16 },
  flashcardArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  swipeHints: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Padding.padding_30, paddingBottom: Padding.padding_30 },
  hintColumn: { alignItems: 'center' },
  hintText: { color: Color.gray, fontFamily: FontFamily.lexendDecaBold, marginTop: Gap.gap_5 }
});