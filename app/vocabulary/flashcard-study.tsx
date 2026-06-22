import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import FlashcardStudyUI from '../../components/FlashcardStudyUI';
import { FlashcardData } from '../../components/SwipableFlashcard';
import FlashcardService from '../../api/services/flashcard.service';
import VocabularyService from '../../api/services/vocabulary.service';
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
    router.back();
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
      VocabularyService.markStatus(currentCard.id.toString(), { status: 'forgotten' })
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
      VocabularyService.markStatus(currentCard.id.toString(), { status: 'remembered' })
        .catch(err => console.error('Lỗi cập nhật tiến độ từ vựng (quẹt phải):', err));
    }

    advanceToNext(newHistory, newKnownCount);
  };

  const handleUndo = () => {
    if (currentIndex === 0) return;
    const prevIndex = currentIndex - 1;
    const prevCard = cards[prevIndex];
    if (!prevCard) return;
    const prevStatus = studyHistory[prevCard.id];

    if (prevStatus === true) {
      setKnownCount(prev => Math.max(0, prev - 1));
    } else if (prevStatus === false) {
      setLearnCount(prev => Math.max(0, prev - 1));
    }
    const newHistory = { ...studyHistory };
    delete newHistory[prevCard.id];
    setStudyHistory(newHistory);
    setCurrentIndex(prevIndex);
    VocabularyService.markStatus(prevCard.id.toString(), { status: 'learning' })
      .catch(err => console.error('Lỗi hoàn tác tiến độ từ vựng:', err));
  };

  return (
    <FlashcardStudyUI
      cards={cards}
      currentIndex={currentIndex}
      isLoading={isLoading}
      learnCount={learnCount}
      knownCount={knownCount}
      onClose={handleClose}
      onSwipedLeft={onSwipedLeft}
      onSwipedRight={onSwipedRight}
      onUndo={handleUndo}
      onToggleFavorite={handleToggleFavorite}
      headerIcon={<Cards02Icon width={40} height={40} />}
      headerSharedTransitionTag="study_flashcard_icon"
      emptyStateText="Không có thẻ nào để học."
    />
  );
}

const styles = StyleSheet.create({});