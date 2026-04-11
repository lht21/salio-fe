import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XIcon, ArrowBendUpLeftIcon, ArrowBendUpRightIcon } from 'phosphor-react-native';

import { Color, FontFamily, FontSize, Border, Gap, Padding } from '../../../../constants/GlobalStyles';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal'; 

// Import Component Thẻ đã tách
import SwipableFlashcard, { FlashcardData } from '../../../../components/SwipableFlashcard';
import CloseButton from '@/components/CloseButton';

// --- MOCK DATA ---
const FLASHCARDS: FlashcardData[] = [
  {
    id: 1,
    word: '학생',
    phonetic: 'hak sen',
    meaning: 'Học sinh',
    type: 'Danh từ',
    hanja: ['Học', 'Sinh'],
    example: '저는 학생입니다',
    highlight: '학생',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    word: '학교',
    phonetic: 'hak kyo',
    meaning: 'Trường học',
    type: 'Danh từ',
    hanja: ['Học', 'Hiệu'],
    example: '학교에 갑니다',
    highlight: '학교',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    word: '책',
    phonetic: 'chaek',
    meaning: 'Sách',
    type: 'Danh từ',
    hanja: ['Học', 'Hiệu'],
    example: '학교에 갑니다',
    highlight: '학교',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=400'
  }
];

export default function FlashcardScreen() {
  const router = useRouter();
  // Lấy lessonId từ params để truyền đi tiếp
  const { lessonId } = useLocalSearchParams();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [learnCount, setLearnCount] = useState(0);

  // STATE HIỂN THỊ MODAL THOÁT
  const [showExitModal, setShowExitModal] = useState(false);

  const totalCards = FLASHCARDS.length;
  const currentCard = FLASHCARDS[currentIndex];

  const handleClose = () => {
    if (currentIndex > 0) {
      // Đã học từ thẻ thứ 2 trở đi -> Hiện Modal cảnh báo
      setShowExitModal(true);
    } else {
      // Vẫn ở thẻ đầu tiên -> Cho phép thoát luôn
      router.back();
    }
  };

  const handleNextCard = () => {
    if (currentIndex < totalCards - 1) {
      // Nếu chưa phải thẻ cuối cùng -> Chuyển sang thẻ tiếp theo
      setCurrentIndex(prev => prev + 1);
    } else {
      // NẾU ĐÃ HẾT THẺ -> ĐIỀU HƯỚNG SANG MÀN HÌNH QUIZ INTRO
      // Truyền theo lessonId và các params cần thiết cho Vòng 2
      router.replace(`/lessons/${lessonId}/vocabulary/quiz-intro`); // Dùng replace để không cho
    }
  };

  const onSwipedLeft = () => {
    setLearnCount(prev => prev + 1);
    handleNextCard();
  };

  const onSwipedRight = () => {
    setKnownCount(prev => prev + 1);
    handleNextCard();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.progressPill}>
            <Text style={styles.progressPillText}>{currentIndex + 1}/{totalCards}</Text>
          </View>
          <CloseButton onPress={handleClose} />
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
          // Dùng ID làm key để Reanimated reset hoàn toàn khi chuyển sang thẻ mới
          <SwipableFlashcard 
            key={currentCard.id} 
            card={currentCard} 
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
          />
        ) : (
          <Text style={{ fontFamily: FontFamily.lexendDecaMedium }}>Đang tải vòng tiếp theo...</Text>
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
        cancelText="Vẫn rời đi" // Nút phụ (Outline)
        confirmText="Học tiếp" // Nút chính (Màu Xanh)
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
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Color.stroke, // Xám nhạt
    justifyContent: 'center',
    alignItems: 'center',
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
  counterLearn: { color: Color.cam, fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16 },
  counterKnown: { color: Color.main, fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16 },

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
  hintColumn: { alignItems: 'center' },
  hintText: { color: Color.gray, fontFamily: FontFamily.lexendDecaBold, marginTop: Gap.gap_5 }
});