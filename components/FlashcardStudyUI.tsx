import React, { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ArrowBendUpLeftIcon, ArrowBendUpRightIcon, ArrowUUpLeftIcon, XIcon } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmModal } from './ModalResult/ConfirmModal';
import { Color, FontFamily, FontSize, Gap, Padding } from '../constants/GlobalStyles';
import IconButton from './IconButton';
import QuizHeader from './Modals/Question/QuizHeader';
import SwipableFlashcard, { FlashcardData } from './SwipableFlashcard';

type FlashcardStudyUIProps = {
  cards: FlashcardData[];
  currentIndex: number;
  isLoading: boolean;
  learnCount: number;
  knownCount: number;
  onClose: () => void;
  onSwipedLeft: () => void;
  onSwipedRight: () => void;
  onUndo?: () => void;
  onToggleFavorite?: (id: string | number) => void;
  headerIcon?: React.ReactNode;
  headerSharedTransitionTag?: string;
  emptyStateText?: string;
};

export default function FlashcardStudyUI({
  cards,
  currentIndex,
  isLoading,
  learnCount,
  knownCount,
  onClose,
  onSwipedLeft,
  onSwipedRight,
  onUndo,
  onToggleFavorite,
  headerIcon,
  headerSharedTransitionTag,
  emptyStateText = "Tuyệt vời! Bạn đã thành thạo tất cả từ vựng trong bài học này.",
}: FlashcardStudyUIProps) {
  const [showExitModal, setShowExitModal] = useState(false);

  const totalCards = cards.length;
  const currentCard = cards[currentIndex];

  const handleClosePress = () => {
    if (currentIndex > 0 && currentIndex < totalCards) {
      setShowExitModal(true);
    } else {
      onClose();
    }
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
        <Text style={styles.emptyText}>{emptyStateText}</Text>
        <IconButton Icon={XIcon} onPress={onClose} style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <QuizHeader
        current={Math.min(currentIndex + 1, totalCards)}
        total={totalCards}
        incorrectCount={0}
        onClose={handleClosePress}
        icon={headerIcon}
        sharedTransitionTag={headerSharedTransitionTag}
      />

      <View style={styles.counterRow}>
        <Text style={styles.counterLearn}>— {learnCount}</Text>
        <Text style={styles.counterKnown}>{knownCount} +</Text>
      </View>

      <View style={styles.flashcardArea}>
        {currentCard ? (
          <SwipableFlashcard
            key={currentCard.id}
            card={currentCard}
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
            onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(currentCard.id) : undefined}
          />
        ) : (
          <Text style={{ fontFamily: FontFamily.lexendDecaMedium }}>Đang tải vòng tiếp theo...</Text>
        )}
      </View>

      <View style={styles.swipeHints}>
        <TouchableOpacity style={styles.hintColumn} onPress={onSwipedLeft}>
          <ArrowBendUpLeftIcon size={40} color={Color.cam} weight="bold" />
          <Text style={styles.hintText}>Học lại</Text>
        </TouchableOpacity>

        {currentIndex > 0 && onUndo && (
          <View style={{ justifyContent: 'center', marginBottom: 25 }}>
            <IconButton
              Icon={ArrowUUpLeftIcon}
              variant="Stroke"
              iconSize={24}
              onPress={onUndo}
              style={{ width: 44, height: 44, borderRadius: 22 }}
            />
          </View>
        )}

        <TouchableOpacity style={styles.hintColumn} onPress={onSwipedRight}>
          <ArrowBendUpRightIcon size={40} color={Color.main} weight="bold" />
          <Text style={styles.hintText}>Đã thuộc</Text>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        isVisible={showExitModal}
        title="Đang học dở mà"
        subtitle="Bạn sắp hoàn thành rồi, cố thêm chút nữa nhé!"
        cancelText="Vẫn rời đi"
        confirmText="Học tiếp"
        onCancel={() => {
          setShowExitModal(false);
          onClose();
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
  counterKnown: { color: (Color as any).main2 || Color.main, fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16 },
  flashcardArea: { flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: Gap.gap_15 },
  swipeHints: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Padding.padding_30, paddingBottom: Padding.padding_30 },
  hintColumn: { alignItems: 'center' },
  hintText: { color: Color.gray, fontFamily: FontFamily.lexendDecaBold, marginTop: Gap.gap_5 },
  emptyText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_16, color: Color.main, textAlign: 'center', paddingHorizontal: Padding.padding_20 },
});
