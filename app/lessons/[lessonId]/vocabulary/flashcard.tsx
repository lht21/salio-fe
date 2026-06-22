import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import FlashcardStudyUI from '../../../../components/FlashcardStudyUI';
import SwipableFlashcard, { FlashcardData } from '../../../../components/SwipableFlashcard';
import { Vocabulary } from '../../../../api/types/vocabulary.types';
import VocabularyService from '../../../../api/services/vocabulary.service';

// Hàm chuyển đổi từ Vocabulary sang FlashcardData
const convertToFlashcardData = (vocab: Vocabulary): FlashcardData => ({
  id: vocab._id,
  word: vocab.word,
  phonetic: vocab.pronunciationText || '',
  meaning: vocab.meaning,
  type: vocab.type || '',
  hanja: vocab.hanja ? [vocab.hanja] : [],
  example: vocab.examples && vocab.examples.length > 0 ? vocab.examples[0].korean : '',
  highlight: vocab.word,
  image: vocab.imageUrl || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400',
  sinoVietnamese: vocab.sinoVietnamese || '',
});

export default function FlashcardScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams();

  // --- STATES ---
  const [vocabularyCards, setVocabularyCards] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [learnCount, setLearnCount] = useState(0);

  // --- EFFECTS ---
  useEffect(() => {
    loadLessonVocabulary();
  }, [lessonId]);

  const loadLessonVocabulary = async () => {
    try {
      setLoading(true);
      const response = await VocabularyService.getStudyQueue({ lessonId: lessonId as string, limit: 100 });
      if (response.success && response.data) {
        // Chỉ lấy những từ đang học hoặc đã quên
        const wordsToStudy = response.data.filter(
          (vocab: any) => vocab.learningStatus?.status === 'learning' || vocab.learningStatus?.status === 'forgotten'
        );
        setVocabularyCards(wordsToStudy || []);
      }
    } catch (error) {
      console.error('Lỗi khi tải study queue:', error);
      // TODO: Handle error, có thể hiển thị thông báo lỗi
    } finally {
      setLoading(false);
    }
  };

  // Chuyển đổi vocabulary của lesson thành FlashcardData[]
  const flashcards: FlashcardData[] = vocabularyCards.map(convertToFlashcardData);

  const totalCards = flashcards.length;
  const currentCard = flashcards[currentIndex];

  const handleClose = () => {
    router.back();
  };

  const handleNextCard = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Đã hết thẻ -> Chuyển sang màn hình quiz intro
      router.replace(`/lessons/${lessonId}/vocabulary/quiz-intro`);
    }
  };

  const onSwipedLeft = async () => {
    const cardId = currentCard.id;
    setLearnCount(prev => prev + 1);
    
    try {
      await VocabularyService.markStatus(cardId.toString(), { status: 'learning', lessonId: lessonId as string });
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái learning:', error);
    }
    
    handleNextCard();
  };

  const onSwipedRight = async () => {
    const cardId = currentCard.id;
    setKnownCount(prev => prev + 1);
    
    try {
      await VocabularyService.markStatus(cardId.toString(), { status: 'remembered', lessonId: lessonId as string });
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái remembered:', error);
    }
    
    handleNextCard();
  };


  return (
    <FlashcardStudyUI
      cards={flashcards}
      currentIndex={currentIndex}
      isLoading={loading}
      learnCount={learnCount}
      knownCount={knownCount}
      onClose={handleClose}
      onSwipedLeft={onSwipedLeft}
      onSwipedRight={onSwipedRight}
    />
  );
}

const styles = StyleSheet.create({
});