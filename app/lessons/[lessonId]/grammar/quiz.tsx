import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View, ActivityIndicator, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GrammarService from '@/api/services/grammar.service';
import LessonService from '@/api/services/lesson.service';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';
import FeedbackPopup from '../../../../components/Modals/Popup/FeedbackPopup';
import { AnswerOption, QuizHeader, type OptionStatus } from '../../../../components/Modals/Question';
import { Color, FontFamily, FontSize, Gap, Padding, Border } from '../../../../constants/GlobalStyles';

export default function GrammarQuizScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [feedbackState, setFeedbackState] = useState<'hidden' | 'success' | 'failure'>('hidden');
  const [showExitModal, setShowExitModal] = useState(false);
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
      const quizId = modulesResponse?.data?.data?.grammarQuizzes?.[0] || modulesResponse?.data?.grammarQuizzes?.[0] || modulesResponse?.grammarQuizzes?.[0];

      if (!quizId) {
          setErrorMsg("Bài học này chưa có Quiz Ngữ pháp.");
          setLoading(false);
          return;
      }

      const startRes = await GrammarService.startGrammarQuiz({ quizId: typeof quizId === 'object' ? quizId._id : quizId });
      const sessionId = startRes?.data?.sessionId || startRes?.sessionId;
      const sessionData = await GrammarService.getGrammarQuizSession(sessionId);
      setSession(sessionData?.data || sessionData);
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
  const q = currentQuestionData?.question;

  const handleSubmit = async (answer: string) => {
    if (isAnswered || !answer.trim()) return;
    Keyboard.dismiss();

    const isCorrect = normalizeString(answer) === normalizeString(q.correctAnswer);
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

  if (loading) return <SafeAreaView style={styles.safeArea}><ActivityIndicator size="large" color={Color.main} /></SafeAreaView>;

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <QuizHeader current={0} total={0} incorrectCount={0} onClose={() => router.back()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: FontFamily.lexendDecaMedium, fontSize: 16, color: Color.text }}>{errorMsg}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) return <SafeAreaView style={styles.safeArea}><ActivityIndicator size="large" color={Color.main} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <QuizHeader current={currentIndex + 1} total={session.questions.length} incorrectCount={incorrectCount} onClose={() => setShowExitModal(true)} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.questionText}>{q.questionText || q.question}</Text>
          {q.type === 'short_answer' ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.textInput, isAnswered && (normalizeString(inputText) === normalizeString(q.correctAnswer) ? styles.inputSuccess : styles.inputError)]}
                placeholder="Nhập đáp án..."
                value={inputText}
                onChangeText={setInputText}
                editable={!isAnswered}
                autoFocus
              />
              {!isAnswered && <TouchableOpacity style={styles.submitBtn} onPress={() => handleSubmit(inputText)}><Text style={styles.submitBtnText}>Kiểm tra</Text></TouchableOpacity>}
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {(q.metadata?.options || q.options || []).map((opt: string, idx: number) => (
                <AnswerOption
                  key={idx}
                  index={idx}
                  text={opt}
                  status={!isAnswered ? 'default' : selectedAnswer === opt ? (normalizeString(opt) === normalizeString(q.correctAnswer) ? 'correct' : 'incorrect') : normalizeString(opt) === normalizeString(q.correctAnswer) ? 'missed-correct' : 'disabled'}
                  onPress={() => handleSubmit(opt)}
                />
              ))}
            </View>
          )}
        </ScrollView>
        <FeedbackPopup
          visible={feedbackState !== 'hidden'}
          type={feedbackState === 'failure' ? 'failure' : 'success'}
          onNext={handleNext}
          translateY={feedbackTranslateY}
          opacity={feedbackOpacity}
          imageSource={feedbackState === 'failure' ? require('../../../../assets/images/horani/failure.png') : require('../../../../assets/images/horani/success.png')}
        />
        <ConfirmModal isVisible={showExitModal} title="Dừng học sao?" subtitle="Cố lên, sắp xong rồi!" cancelText="Vẫn rời đi" confirmText="Học tiếp" onCancel={() => router.back()} onConfirm={() => setShowExitModal(false)} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.bg },
  scrollContent: { paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_30, paddingBottom: 40 },
  questionText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_24, color: Color.text, marginBottom: Gap.gap_20 },
  optionsContainer: { width: '100%' },
  inputContainer: { width: '100%', marginTop: Gap.gap_20 },
  textInput: { backgroundColor: Color.whiteText, borderWidth: 2, borderColor: Color.colorBlack, borderRadius: 20, padding: Padding.padding_15, fontSize: 18, fontFamily: FontFamily.lexendDecaMedium, color: Color.text, minHeight: 60 },
  inputSuccess: { borderColor: Color.main },
  inputError: { borderColor: Color.red },
  submitBtn: { backgroundColor: Color.main, paddingVertical: Padding.padding_15, borderRadius: 12, marginTop: Gap.gap_20, alignItems: 'center' },
  submitBtnText: { color: Color.whiteText, fontFamily: FontFamily.lexendDecaBold, fontSize: 18 },
});