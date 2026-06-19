import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowBendUpLeftIcon, ArrowBendUpRightIcon } from 'phosphor-react-native';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../../../constants/GlobalStyles';

// Import Component Thẻ đã tách
import IconButton from '../../../../components/IconButton';
import { XIcon } from 'phosphor-react-native';
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
  const [showExitModal, setShowExitModal] = useState(false);

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
    if (currentIndex > 0) {
      setShowExitModal(true);
    } else {
      router.back();
    }
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


  // Hiển thị loading
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải từ vựng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Hiển thị lỗi nếu không có dữ liệu
  if (!loading && flashcards.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyText}>Tuyệt vời! Bạn đã thành thạo tất cả từ vựng trong bài học này.</Text>
          <IconButton Icon={XIcon} onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.progressPill}>
            <Text style={styles.progressPillText}>{currentIndex + 1}/{totalCards}</Text>
          </View>
          <IconButton Icon={XIcon} onPress={handleClose} />
          
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${((currentIndex + 1) / totalCards) * 100}%` }]} />
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
          <Text style={{ fontFamily: FontFamily.lexendDecaMedium }}>
            Đang tải vòng tiếp theo...
          </Text>
        )}
      </View>

      {/* FOOTER SWIPE HINTS */}
      <View style={styles.swipeHints}>
        <View style={styles.hintColumn}>
          <ArrowBendUpLeftIcon size={40} color={Color.stroke} weight="bold" />
          <Text style={styles.hintText}>Học</Text>
        </View>
        <View style={styles.hintColumn}>
          <ArrowBendUpRightIcon size={40} color={Color.stroke} weight="bold" />
          <Text style={styles.hintText}>Đã biết</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  header: {
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.gap_15,
  },
  progressPill: {
    backgroundColor: Color.main,
    paddingHorizontal: Padding.padding_15,
    paddingVertical: Padding.padding_5,
    borderRadius: Border.br_20,
  },
  progressPillText: {
    color: Color.bg,
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Color.stroke,
    borderRadius: 2,
    marginBottom: Gap.gap_15,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: Color.main,
    borderRadius: 2,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  counterLearn: {
    color: Color.cam,
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
  },
  counterKnown: {
    color: Color.main,
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
  },
  flashcardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.padding_30,
    paddingBottom: Padding.padding_30,
  },
  hintColumn: {
    alignItems: 'center',
  },
  hintText: {
    color: Color.gray,
    fontFamily: FontFamily.lexendDecaBold,
    marginTop: Gap.gap_5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  emptyText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    color: Color.main,
    marginBottom: Gap.gap_20,
    textAlign: 'center',
    paddingHorizontal: Padding.padding_20,
  },
});