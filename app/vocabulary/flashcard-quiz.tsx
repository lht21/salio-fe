import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmModal } from '../../components/ModalResult/ConfirmModal';
import FeedbackPopup from '../../components/Modals/Popup/FeedbackPopup';
import { AnswerOption, QuizHeader, type OptionStatus } from '../../components/Modals/Question';
import { Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import FlashcardService from '../../api/services/flashcard.service';
import apiClient from '../../api/client';
import CloseButton from '../../components/CloseButton';

// Quiz Question Type
type QuizQuestion = {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
};

export default function FlashcardQuizScreen() {
  const router = useRouter();
  const { setId } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);

  // --- STATES ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [feedbackState, setFeedbackState] = useState<'hidden' | 'success' | 'failure'>('hidden');
  const [answerHistory, setAnswerHistory] = useState<Record<string, boolean>>({});

  // STATE HIỂN THỊ MODAL THOÁT
  const [showExitModal, setShowExitModal] = useState(false);
  const feedbackOpacity = React.useRef(new Animated.Value(0)).current;
  const feedbackTranslateY = React.useRef(new Animated.Value(150)).current;

  useEffect(() => {
    const fetchAndGenerateQuiz = async () => {
      if (!setId) return;
      try {
        setIsLoading(true);
        const res = await FlashcardService.getSetById(setId as string);
        if (res.success && res.data) {
          const cards = res.data.cards || [];
          if (cards.length < 4) {
            Alert.alert('Không đủ từ vựng', 'Cần ít nhất 4 từ vựng trong bộ để làm trắc nghiệm.', [
              { text: 'Trở về', onPress: () => router.back() }
            ]);
            return;
          }

          // Trộn danh sách thẻ
          const shuffledCards = [...cards].sort(() => Math.random() - 0.5);

          // Tạo câu hỏi trắc nghiệm
          const generatedQuiz: QuizQuestion[] = shuffledCards.map((card: any, index: number) => {
            const wrongCards = cards.filter((c: any) => c._id !== card._id);
            // Chọn ngẫu nhiên 3 đáp án sai
            const shuffledWrongCards = wrongCards.sort(() => Math.random() - 0.5).slice(0, 3);
            
            const options = [
              { id: card._id, text: card.meaning },
              ...shuffledWrongCards.map((w: any) => ({ id: w._id, text: w.meaning }))
            ];

            return {
              id: `q${index}`,
              question: `${card.word}`,
              options: options.sort(() => Math.random() - 0.5),
              correctOptionId: card._id
            };
          });

          setQuizData(generatedQuiz);
        }
      } catch (error) {
        console.error('Lỗi lấy bộ từ vựng:', error);
        Alert.alert('Lỗi', 'Không thể tải bộ từ vựng để làm trắc nghiệm.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAndGenerateQuiz();
  }, [setId]);

  const currentQuestion = quizData[currentIndex];

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
    if (isAnswered) return;

    setSelectedAnswerId(optionId);
    setIsAnswered(true);

    const isAnswerCorrect = optionId === currentQuestion.correctOptionId;
    setAnswerHistory(prev => ({ ...prev, [currentQuestion.correctOptionId]: isAnswerCorrect }));

    // Gọi API cập nhật trạng thái từ vựng (chạy ngầm, không block UI)
    const status = isAnswerCorrect ? 'remembered' : 'forgotten';
    apiClient.post(`/api/v1/vocabularies/${currentQuestion.correctOptionId}/mark`, { status })
      .catch(err => console.error('Lỗi cập nhật tiến độ từ vựng:', err));

    if (isAnswerCorrect) {
      showFeedback('success');
    } else {
      setIncorrectCount(prev => prev + 1);
      showFeedback('failure');
    }
  };

  const handleNextQuestion = () => {
    const moveNext = () => {
      if (currentIndex < quizData.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswerId(null);
        setIsAnswered(false);
      } else {
        const correctCount = quizData.length - incorrectCount;
        router.replace({
          pathname: '/vocabulary/flashcard-quiz-result',
          params: {
            setId,
            correctCount,
            totalCount: quizData.length,
            history: JSON.stringify(answerHistory)
          }
        });
      }
    };

    if (feedbackState !== 'hidden') {
      hideFeedback(moveNext);
      return;
    }

    moveNext();
  };

  const getOptionStatus = (optionId: string): OptionStatus => {
    if (!isAnswered) return 'default';

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
        <ActivityIndicator size="large" color={Color.main} />
      </SafeAreaView>
    );
  }

  if (quizData.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
         <Text style={{ fontFamily: FontFamily.lexendDecaMedium }}>Không có câu hỏi nào để hiển thị.</Text>
         <CloseButton onPress={() => router.back()} style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <QuizHeader
        current={currentIndex + 1}
        total={quizData.length}
        incorrectCount={incorrectCount}
        onClose={() => setShowExitModal(true)}
      />

      {/* BODY CONTENT */}
      <ScrollView
        key={currentQuestion?.id}
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.questionText}>{currentQuestion?.question}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion?.options.map((opt, idx) => (
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
            ? require('../../assets/images/horani/failure.png')
            : require('../../assets/images/horani/success.png')
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
          router.back();
        }}
        onConfirm={() => setShowExitModal(false)}
      />
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.bg },
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
    fontSize: FontSize.fs_24,
    color: Color.text,
    marginBottom: Gap.gap_20,
    textAlign: 'left',
  },
  optionsContainer: { width: '100%' },
});