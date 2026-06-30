import React, { useState } from 'react';
import { MotiView } from 'moti';
import { Easing as ReanimatedEasing } from 'react-native-reanimated';
import { Animated, ScrollView, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XIcon } from 'phosphor-react-native';

import { ConfirmModal } from './ModalResult/ConfirmModal';
import FeedbackPopup from './Modals/Popup/FeedbackPopup';
import { AnswerOption, QuizHeader, type OptionStatus } from './Modals/Question';
import { FontFamily, Gap, Padding } from '../constants/GlobalStyles';
import IconButton from './IconButton';
import { useTheme } from "@/contexts/ThemeContext";

export type QuizQuestion = {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  originalQuestion?: any;
};

type QuizStudyUIProps = {
  quizData: QuizQuestion[];
  currentIndex: number;
  isLoading: boolean;
  isAnswered: boolean;
  selectedAnswerId: string | null;
  incorrectCount: number;
  feedbackState: 'hidden' | 'success' | 'failure';
  feedbackOpacity: Animated.Value;
  feedbackTranslateY: Animated.Value;
  headerIcon?: React.ReactNode;
  headerSharedTransitionTag?: string;
  onSelectOption: (optionId: string) => void;
  onDontKnow?: () => void;
  onNextQuestion: () => void;
  onOverrideCorrect?: () => void;
  onClose: () => void;
  emptyStateText?: string;
  renderCustomOptions?: (question: QuizQuestion) => React.ReactNode;
};

export default function QuizStudyUI({
  quizData,
  currentIndex,
  isLoading,
  isAnswered,
  selectedAnswerId,
  incorrectCount,
  feedbackState,
  feedbackOpacity,
  feedbackTranslateY,
  headerIcon,
  headerSharedTransitionTag,
  onSelectOption,
  onDontKnow,
  onNextQuestion,
  onOverrideCorrect,
  onClose,
  emptyStateText = "Không có câu hỏi nào để hiển thị.",
  renderCustomOptions
}: QuizStudyUIProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const [showExitModal, setShowExitModal] = useState(false);

  const currentQuestion = quizData[currentIndex];

  const getOptionStatus = (optionId: string): OptionStatus => {
    if (!isAnswered || !currentQuestion) return 'default';

    const isThisOptionSelected = selectedAnswerId === optionId;
    const isThisOptionCorrect = currentQuestion.correctOptionId === optionId;

    if (isThisOptionSelected && isThisOptionCorrect) return 'correct';
    if (isThisOptionSelected && !isThisOptionCorrect) return 'incorrect';
    if (!isThisOptionSelected && isThisOptionCorrect) return 'missed-correct';

    return 'disabled';
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.main} />
      </SafeAreaView>
    );
  }

  if (quizData.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: FontFamily.lexendDecaMedium }}>{emptyStateText}</Text>
        <IconButton Icon={XIcon} onPress={onClose} style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <QuizHeader
        current={Math.min(currentIndex + 1, quizData.length)}
        total={quizData.length}
        incorrectCount={incorrectCount}
        onClose={() => setShowExitModal(true)}
        icon={headerIcon}
        sharedTransitionTag={headerSharedTransitionTag}
      />

      <MotiView
        key={currentQuestion?.id}
        from={{ opacity: 0, translateX: 100, translateY: 50 }}
        animate={{ opacity: 1, translateX: 0, translateY: 0 }}
        transition={{ type: 'timing', duration: 350, easing: ReanimatedEasing.out(ReanimatedEasing.ease) } as any}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.questionText}>{currentQuestion?.question}</Text>

          <View style={styles.optionsContainer}>
            {onDontKnow && (
              <TouchableOpacity
                style={styles.dontKnowButton}
                onPress={onDontKnow}
                disabled={isAnswered}
              >
                <Text style={styles.dontKnowText}>Bạn không biết?</Text>
              </TouchableOpacity>
            )}
            
            {(() => {
              const customRender = renderCustomOptions ? renderCustomOptions(currentQuestion) : null;
              if (customRender) return customRender;
              
              return currentQuestion?.options.map((opt, idx) => (
                <AnswerOption
                  key={`${currentQuestion.id}-${opt.id}`}
                  index={idx}
                  text={opt.text}
                  status={getOptionStatus(opt.id)}
                  onPress={() => onSelectOption(opt.id)}
                />
              ));
            })()}
          </View>
        </ScrollView>
      </MotiView>

      <FeedbackPopup
        visible={feedbackState !== 'hidden'}
        type={feedbackState === 'failure' ? 'failure' : 'success'}
        onNext={onNextQuestion}
        onOverrideCorrect={onOverrideCorrect}
        translateY={feedbackTranslateY}
        opacity={feedbackOpacity}
        imageSource={
          feedbackState === 'failure'
            ? require('../assets/images/horani/failure.png')
            : require('../assets/images/horani/success.png')
        }
      />

      <ConfirmModal
        isVisible={showExitModal}
        title="Đang kiểm tra dở mà"
        subtitle="Bạn sắp hoàn thành rồi, cố thêm chút nữa nhé!"
        cancelText="Vẫn rời đi"
        confirmText="Làm tiếp"
        onCancel={() => {
          setShowExitModal(false);
          onClose();
        }}
        onConfirm={() => setShowExitModal(false)}
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      safeArea: { flex: 1, backgroundColor: colors.bg },
      scrollArea: { flex: 1 },
      scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingHorizontal: Padding.padding_20,
        paddingTop: Padding.padding_30,
        paddingBottom: 40,
      },
      questionText: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: 30,
        color: colors.text,
        marginBottom: Gap.gap_20,
        textAlign: 'left',
      },
      optionsContainer: { width: '100%' },
      dontKnowButton: {
        marginBottom: Gap.gap_15,
        alignSelf: "flex-end"
      },
      dontKnowText: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: 16,
        color: colors.cam,
        textDecorationLine: 'underline',
      },
    });
