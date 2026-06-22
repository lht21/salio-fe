﻿import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Alert } from 'react-native';

import VocabularyService from '../../../../api/services/vocabulary.service';
import QuizStudyUI, { QuizQuestion } from '../../../../components/QuizStudyUI';

export default function VocabularyQuizScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams();

  // --- STATES ---
  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [feedbackState, setFeedbackState] = useState<'hidden' | 'success' | 'failure'>('hidden');


  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const feedbackTranslateY = useRef(new Animated.Value(150)).current;

  // --- EFFECTS ---
  useEffect(() => {
    const fetchAndGenerateQuiz = async () => {
      if (!lessonId) return;
      try {
        setIsLoading(true);
        // Lấy danh sách tiến độ học của bài học
        const res = await VocabularyService.getStudyQueue({ lessonId: lessonId as string, limit: 100 });
        const vocabularies = res.data || [];

        // Lọc ra những từ chưa thành thạo (Đang học / Đã quên)
        const unmasteredVocabs = vocabularies.filter(
          (v: any) => v.learningStatus?.status === 'learning' || v.learningStatus?.status === 'forgotten'
        );

        if (unmasteredVocabs.length < 4) {
          Alert.alert('Không đủ từ vựng', 'Cần ít nhất 4 từ vựng chưa thành thạo để làm trắc nghiệm.', [
            { text: 'Trở về', onPress: () => router.back() }
          ]);
          return;
        }

        // Trộn danh sách từ vựng chưa thành thạo để làm câu hỏi
        const shuffledVocabs = [...unmasteredVocabs].sort(() => Math.random() - 0.5);

        // Tạo câu hỏi trắc nghiệm
        const generatedQuiz: QuizQuestion[] = shuffledVocabs.map((vocab: any, index: number) => {
          const wrongVocabs = vocabularies.filter((v: any) => v._id !== vocab._id);
          // Chọn ngẫu nhiên 3 đáp án sai từ toàn bộ từ vựng trong bài
          const shuffledWrongVocabs = wrongVocabs.sort(() => Math.random() - 0.5).slice(0, 3);

          const options = [
            { id: vocab._id, text: vocab.meaning },
            ...shuffledWrongVocabs.map((w: any) => ({ id: w._id, text: w.meaning }))
          ];

          return {
            id: `q${index}`,
            question: `${vocab.word}`,
            options: options.sort(() => Math.random() - 0.5),
            correctOptionId: vocab._id
          };
        });

        setQuizData(generatedQuiz);
      } catch (error) {
        console.error('Lỗi khởi tạo quiz:', error);
        Alert.alert('Lỗi', 'Không thể tải danh sách từ vựng.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndGenerateQuiz();
  }, [lessonId]);

  const currentQuestion = quizData[currentQuestionIndex];

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

  const handleSubmitAnswer = async (optionId: string) => {
    if (isAnswered) return;

    setSelectedAnswerId(optionId);
    setIsAnswered(true);

    const isCorrect = optionId === currentQuestion.correctOptionId;

    if (isCorrect) {
      showFeedback('success');
    } else {
      setIncorrectCount((prev) => prev + 1);
      showFeedback('failure');
    }

    // Gọi API cập nhật trạng thái từ vựng (chạy ngầm)
    const status: 'remembered' | 'forgotten' = isCorrect ? 'remembered' : 'forgotten';
    VocabularyService.markStatus(currentQuestion.correctOptionId, { status, lessonId: lessonId as string })
      .catch((err: unknown) => console.error('Lỗi cập nhật tiến độ từ vựng:', err));
  };

  const handleNextQuestion = () => {
    const moveNext = async () => {
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswerId(null);
        setIsAnswered(false);
      } else {
        const correctCount = quizData.length - incorrectCount;
        router.replace({
          pathname: `/lessons/${lessonId}/vocabulary/result` as any,
          params: { correctCount, totalCount: quizData.length }
        });
      }
    };
    hideFeedback(moveNext);
  };

  return (
    <QuizStudyUI
      quizData={quizData}
      currentIndex={currentQuestionIndex}
      isLoading={isLoading}
      isAnswered={isAnswered}
      selectedAnswerId={selectedAnswerId}
      incorrectCount={incorrectCount}
      feedbackState={feedbackState}
      feedbackOpacity={feedbackOpacity}
      feedbackTranslateY={feedbackTranslateY}
      onSelectOption={handleSubmitAnswer}
      onNextQuestion={handleNextQuestion}
      onClose={() => router.back()}
    />
  );
}

const styles = StyleSheet.create({});