import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View, ActivityIndicator, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GrammarService from '@/api/services/grammar.service';
import LessonService from '@/api/services/lesson.service';
import QuizStudyUI, { QuizQuestion } from '../../../../components/QuizStudyUI';
import { FontFamily, Gap, Padding } from '../../../../constants/GlobalStyles';
import { QuizHeader } from '../../../../components/Modals/Question';
import { useTheme } from "@/contexts/ThemeContext";

export default function GrammarQuizScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const router = useRouter();
  const { lessonId } = useLocalSearchParams();

  const [session, setSession] = useState<any>(null);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [feedbackState, setFeedbackState] = useState<'hidden' | 'success' | 'failure'>('hidden');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const feedbackTranslateY = useRef(new Animated.Value(150)).current;

  useEffect(() => {
    if (lessonId) startQuiz();
  }, [lessonId]);

  const startQuiz = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const modulesResponse = await LessonService.getModules(lessonId as string);
      const quizId = modulesResponse?.data?.grammarQuizzes?.[0] || modulesResponse?.data?.grammarQuizzes?.[0] || modulesResponse?.grammarQuizzes?.[0];

      if (!quizId) {
          setErrorMsg("Bài học này chưa có Quiz Ngữ pháp.");
          setLoading(false);
          return;
      }

      const startRes = await GrammarService.startGrammarQuiz({ quizId: typeof quizId === 'object' ? quizId._id : quizId });
      const sessionId = startRes?.data?.sessionId || startRes?.sessionId;
      const sessionData = await GrammarService.getGrammarQuizSession(sessionId);
      const data = sessionData?.data || sessionData;
      setSession(data);

      if (data && data.questions) {
        const mappedData: QuizQuestion[] = data.questions.map((q: any) => {
          const opts = q.metadata?.options || q.options || [];
          return {
            id: q._id,
            question: q.questionText || q.question,
            options: opts.map((optText: string) => ({ id: optText, text: optText })),
            correctOptionId: q.correctAnswer,
            originalQuestion: q
          };
        });
        setQuizData(mappedData);
      }
    } catch (error) {
      console.error('Lỗi khởi tạo grammar quiz:', error);
      setErrorMsg("Có lỗi xảy ra khi tải Quiz Ngữ pháp.");
    } finally {
      setLoading(false);
    }
  };

  const normalizeString = (str: any) => {
    if (!str) return '';
    return String(str).trim().normalize('NFC').toLowerCase();
  };

  const currentQuestionData = session?.questions?.[currentIndex];
  
  const handleSubmit = async (answer: string) => {
    if (isAnswered || !answer.trim()) return;
    Keyboard.dismiss();

    const isCorrect = normalizeString(answer) === normalizeString(currentQuestionData.correctAnswer);
    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (isCorrect) {
      showFeedback('success');
    } else {
      setIncorrectCount(prev => prev + 1);
      showFeedback('failure');
    }

    try {
      await GrammarService.saveGrammarQuizAnswer(session._id, {
        questionId: currentQuestionData._id,
        answer: answer,
      });
    } catch (err) {}
  };

  const showFeedback = (type: 'success' | 'failure') => {
    setFeedbackState(type);
    Animated.parallel([
      Animated.timing(feedbackOpacity, { toValue: 1, duration: 240, useNativeDriver: true }),
      Animated.timing(feedbackTranslateY, { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  };

  const handleNext = async () => {
    if (isSubmitting) return;

    const moveNext = async () => {
      if (currentIndex < session.questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setInputText('');
        setIsAnswered(false);
        setFeedbackState('hidden');
      } else {
        setIsSubmitting(true);
        try {
          const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
          await GrammarService.submitGrammarQuiz(session._id, { timeSpent });
          router.replace(`/lessons/${lessonId}/grammar/result?sessionId=${session._id}`);
        } catch (error) {
          console.error('Lỗi khi nộp bài:', error);
          setIsSubmitting(false);
        }
      }
    };
    
    Animated.parallel([
      Animated.timing(feedbackOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(feedbackTranslateY, { toValue: 150, duration: 200, useNativeDriver: true }),
    ]).start(moveNext);
  };

  if (loading) return <SafeAreaView style={styles.safeArea}><ActivityIndicator size="large" color={colors.main} /></SafeAreaView>;

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <QuizHeader current={0} total={0} incorrectCount={0} onClose={() => router.back()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: FontFamily.lexendDecaMedium, fontSize: 16, color: colors.text }}>{errorMsg}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) return <SafeAreaView style={styles.safeArea}><ActivityIndicator size="large" color={colors.main} /></SafeAreaView>;

  return (
    <QuizStudyUI
      quizData={quizData}
      currentIndex={currentIndex}
      isLoading={loading}
      isAnswered={isAnswered}
      selectedAnswerId={selectedAnswer}
      incorrectCount={incorrectCount}
      feedbackState={feedbackState}
      feedbackOpacity={feedbackOpacity}
      feedbackTranslateY={feedbackTranslateY}
      onSelectOption={(opt) => handleSubmit(opt)}
      onNextQuestion={handleNext}
      onClose={() => router.back()}
      renderCustomOptions={(currentQuestion) => {
        const q = currentQuestion.originalQuestion;
        if (q.type === 'short_answer') {
          return (
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.textInput, 
                  isAnswered && (normalizeString(inputText) === normalizeString(q.correctAnswer) ? styles.inputSuccess : styles.inputError)
                ]}
                placeholder="Nhập đáp án..."
                value={inputText}
                onChangeText={setInputText}
                editable={!isAnswered}
              />
              {!isAnswered && (
                <TouchableOpacity style={styles.submitBtn} onPress={() => handleSubmit(inputText)}>
                  <Text style={styles.submitBtnText}>Kiểm tra</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }
        return null;
      }}
    />
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      safeArea: { flex: 1, backgroundColor: colors.bg },
      inputContainer: { width: '100%', marginTop: Gap.gap_20 },
      textInput: { backgroundColor: colors.whiteText, borderWidth: 2, borderColor: colors.colorBlack, borderRadius: 20, padding: Padding.padding_15, fontSize: 18, fontFamily: FontFamily.lexendDecaMedium, color: colors.text, minHeight: 60 },
      inputSuccess: { borderColor: colors.main },
      inputError: { borderColor: colors.red },
      submitBtn: { backgroundColor: colors.main, paddingVertical: Padding.padding_15, borderRadius: 12, marginTop: Gap.gap_20, alignItems: 'center' },
      submitBtnText: { color: colors.whiteText, fontFamily: FontFamily.lexendDecaBold, fontSize: 18 },
    });