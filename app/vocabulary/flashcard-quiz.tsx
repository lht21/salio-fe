import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Animated, Easing, StyleSheet, Alert } from 'react-native';
import FlashcardService from '../../api/services/flashcard.service';
import VocabularyService from '../../api/services/vocabulary.service';
import CheckListIcon from '../../components/icons/CheckListIcon';
import QuizStudyUI, { QuizQuestion } from '../../components/QuizStudyUI';



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
    VocabularyService.markStatus(currentQuestion.correctOptionId, { status })
      .catch(err => console.error('Lỗi khi lưu kết quả câu hỏi:', err));

    if (isAnswerCorrect) {
      showFeedback('success');
    } else {
      setIncorrectCount(prev => prev + 1);
      showFeedback('failure');
    }
  };

  const handleDontKnow = () => {
    if (isAnswered) return;
    setSelectedAnswerId('dont_know');
    setIsAnswered(true);
    setAnswerHistory(prev => ({ ...prev, [currentQuestion.correctOptionId]: false }));
    VocabularyService.markStatus(currentQuestion.correctOptionId, { status: 'forgotten' })
      .catch(err => console.error('Lỗi khi lưu kết quả (bỏ qua):', err));
    setIncorrectCount(prev => prev + 1);
    showFeedback('failure');
  };

  const handleOverrideCorrect = () => {
    // Sửa lại đáp án trong lịch sử thành đúng
    setAnswerHistory(prev => ({ ...prev, [currentQuestion.correctOptionId]: true }));

    // Cập nhật API thành remembered
    VocabularyService.markStatus(currentQuestion.correctOptionId, { status: 'remembered' })
      .catch(err => console.error('Lỗi khi sửa đáp án thành đúng:', err));

    // Trừ đi số câu sai
    setIncorrectCount(prev => Math.max(0, prev - 1));

    // Đổi popup sang trạng thái success
    setFeedbackState('success');
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



  return (
    <QuizStudyUI
      quizData={quizData}
      currentIndex={currentIndex}
      isLoading={isLoading}
      isAnswered={isAnswered}
      selectedAnswerId={selectedAnswerId}
      incorrectCount={incorrectCount}
      feedbackState={feedbackState}
      feedbackOpacity={feedbackOpacity}
      feedbackTranslateY={feedbackTranslateY}
      headerIcon={<CheckListIcon width={40} height={40} />}
      headerSharedTransitionTag="quiz_icon"
      onSelectOption={handleSelectOption}
      onDontKnow={handleDontKnow}
      onNextQuestion={handleNextQuestion}
      onOverrideCorrect={handleOverrideCorrect}
      onClose={() => router.back()}
    />
  );
}

// --- STYLES ---
const styles = StyleSheet.create({});