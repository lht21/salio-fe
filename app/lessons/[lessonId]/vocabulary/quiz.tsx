import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';
import FeedbackPopup from '../../../../components/Modals/Popup/FeedbackPopup';
import { AnswerOption, QuizHeader, type OptionStatus } from '../../../../components/Modals/Question';
import { Color, FontFamily, FontSize, Gap, Padding } from '../../../../constants/GlobalStyles';
import { NOTEBOOK_TRAVEL } from '../../../../constants/mockVocabularyNotebook';

// --- MOCK DATA - Generate from NOTEBOOK_TRAVEL ---
const generateQuizData = () => {
  const words = NOTEBOOK_TRAVEL.words;
  return words.map((word, index) => {
    const incorrectWords = words.filter((w) => w.id !== word.id).slice(0, 3);
    const options = [
      { id: 'opt1', text: word.word },
      ...incorrectWords.map((w, idx) => ({ id: `opt${idx + 2}`, text: w.word })),
    ];
    return {
      id: `q${index}`,
      question: word.meaning,
      options: options.sort(() => Math.random() - 0.5),
      correctOptionId: 'opt1',
    };
  });
};

const QUIZ_DATA = generateQuizData();

export default function VocabularyQuizScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams();

  // --- STATES ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [feedbackState, setFeedbackState] = useState<'hidden' | 'success' | 'failure'>('hidden');

  // STATE HIỂN THỊ MODAL THOÁT
  const [showExitModal, setShowExitModal] = useState(false);
  const feedbackOpacity = React.useRef(new Animated.Value(0)).current;
  const feedbackTranslateY = React.useRef(new Animated.Value(150)).current;

  const currentQuestion = QUIZ_DATA[currentIndex];
  const isCorrect = selectedAnswerId === currentQuestion.correctOptionId;

  const showFeedback = (type: 'success' | 'failure') => {
    setFeedbackState(type);
    feedbackOpacity.setValue(0);
    feedbackTranslateY.setValue(type === 'success' ? 150 : 40);

    Animated.parallel([
      Animated.timing(feedbackOpacity, { toValue: 1, duration: 240, useNativeDriver: true }),
      Animated.timing(feedbackTranslateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideFeedback = (onDone?: () => void) => {
    Animated.parallel([
      Animated.timing(feedbackOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(feedbackTranslateY, {
        toValue: feedbackState === 'success' ? 150 : 40,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setFeedbackState('hidden');
      onDone?.();
    });
  };

  // --- HANDLERS ---
  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return; // Khóa không cho chọn lại

    setSelectedAnswerId(optionId);
    setIsAnswered(true);

    const isAnswerCorrect = optionId === currentQuestion.correctOptionId;

    if (isAnswerCorrect) {
      showFeedback('success');
    } else {
      // Nếu SAI: Tăng biến đếm, đợi người dùng tự bấm nút
      setIncorrectCount(prev => prev + 1);
      showFeedback('failure');
    }
  };

  const handleNextQuestion = () => {
    const moveNext = () => {
      if (currentIndex < QUIZ_DATA.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswerId(null);
        setIsAnswered(false);
      } else {
        router.replace(`/lessons/${lessonId}/vocabulary/result`);
      }
    };

    if (feedbackState !== 'hidden') {
      hideFeedback(moveNext);
      return;
    }

    moveNext();
  };

  // Hàm xác định trạng thái UI cho từng Option
  const getOptionStatus = (optionId: string): OptionStatus => {
    if (!isAnswered) return 'default';

    const isThisOptionSelected = selectedAnswerId === optionId;
    const isThisOptionCorrect = currentQuestion.correctOptionId === optionId;

    if (isThisOptionSelected && isThisOptionCorrect) return 'correct';
    if (isThisOptionSelected && !isThisOptionCorrect) return 'incorrect';
    if (!isThisOptionSelected && isThisOptionCorrect) return 'missed-correct'; // Gợi ý đáp án đúng

    return 'disabled'; // Làm mờ các đáp án sai không được chọn
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* HEADER */}
      <QuizHeader
        current={currentIndex + 1}
        total={QUIZ_DATA.length}
        incorrectCount={incorrectCount}
        onClose={() => setShowExitModal(true)}
      />

      {/* BODY CONTENT (Scrollable để bị đẩy lên khi có BottomSheet) */}
      <ScrollView
        key={currentQuestion.id}
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Câu hỏi */}
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {/* Danh sách 4 đáp án */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((opt, idx) => (
            <AnswerOption
              key={`${currentQuestion.id}-${opt.id}`}
              index={idx}
              text={opt.text}
              status={getOptionStatus(opt.id)}
              onPress={() => handleSelectOption(opt.id)}
            />
          ))}
        </View>
      </ScrollView>
      <FeedbackPopup
        visible={feedbackState !== 'hidden'}
        type={feedbackState === 'failure' ? 'failure' : 'success'}
        onNext={handleNextQuestion}
        onOutsidePress={feedbackState === 'failure' ? () => hideFeedback() : undefined}
        translateY={feedbackTranslateY}
        opacity={feedbackOpacity}
        imageSource={
          feedbackState === 'failure'
            ? require('../../../../assets/images/horani/failure.png')
            : require('../../../../assets/images/horani/success.png')
        }
      />

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

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  scrollArea: {
    flex: 1,

  },
  scrollContent: {
    flexGrow: 1, // BẮT BUỘC: Cho phép nội dung giãn ra lấp đầy toàn bộ chiều cao của ScrollView
    justifyContent: 'space-between', // Đẩy Cụm trên (Câu hỏi) lên Top và Cụm dưới (Đáp án) xuống Bottom
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_30,
    paddingBottom: 40,
  },
  questionText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_24,
    color: Color.text,
    marginBottom: Gap.gap_20,
    textAlign: 'left',
  },
  optionsContainer: {
    width: '100%',
  },
});
