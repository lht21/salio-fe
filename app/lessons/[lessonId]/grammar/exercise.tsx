import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Animated, Easing, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Color, FontFamily, FontSize, Padding, Gap } from '../../../../constants/GlobalStyles';
import Button from '../../../../components/Button';
import QuizHeader from '../../../../components/Modals/Question/QuizHeader';
import FeedbackSheet from '../../../../components/Modals/Popup/FeedbackPopup';
import WhiteboardArea from '../../../../components/QuizComponent/WhiteboardArea';
import WordMatchArea from '../../../../components/QuizComponent/WordMatchArea';
import GrammarService from '@/api/services/grammar.service';
import LessonService from '@/api/services/lesson.service';

export default function GrammarExerciseScreen() {
  const { lessonId } = useLocalSearchParams();
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerWB, setAnswerWB] = useState('');
  const [answerWM, setAnswerWM] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [incorrectCount, setIncorrectCount] = useState(0); 
  const [hasWrongAttempt, setHasWrongAttempt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  // Animation refs
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const feedbackTranslateY = useRef(new Animated.Value(150)).current;

  // --- FETCH DỮ LIỆU TỪ API ---
  useEffect(() => {
    loadAllExercises();
  }, [lessonId]);

  const loadAllExercises = async () => {
    try {
      setLoading(true);
      const grammars = await GrammarService.getLessonGrammar(String(lessonId));
      
      console.log("Danh sách Grammar IDs:", grammars.map(g => g._id));

      const allExercisesPromises = grammars.map(g => 
        GrammarService.getGrammarExercises(g._id).catch(err => {
          console.error(`Lỗi tại Grammar ID ${g._id}:`, err?.config?.url || err);
          return { data: { questions: [] } }; 
        })
      );
      
      const results = await Promise.all(allExercisesPromises);
      const combinedQuestions = results.flatMap(res => res?.data?.questions || res?.questions || []);
      
      setQuestions(combinedQuestions.sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error("Lỗi tổng quát khi tải bài tập:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  const showFeedback = () => {
    Animated.parallel([
      Animated.timing(feedbackOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(feedbackTranslateY, { toValue: 0, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: true })
    ]).start();
  };

  const hideFeedback = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(feedbackOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(feedbackTranslateY, { toValue: 150, duration: 250, easing: Easing.in(Easing.ease), useNativeDriver: true })
    ]).start(() => {
      setStatus('idle');
      if (callback) callback();
    });
  };

  const isButtonDisabled = () => {
    if (status !== 'idle' || !currentQuestion) return true;
    if (currentQuestion.type === 'whiteboard') return !answerWB.trim();
    if (currentQuestion.type === 'word_match') return answerWM.length !== currentQuestion.words?.length;
    return true;
  };

  const handleCheck = () => {
      let isCorrect = false;
      
      if (currentQuestion.type === 'whiteboard') {
        const userAns = answerWB.trim().toLowerCase();
        const correctAns = (currentQuestion.correctAnswerStr || "").trim().toLowerCase();
        isCorrect = userAns === correctAns;
      } else {
        const cleanAnswers = answerWM.map(w => w.split('_')[0]);
        const correctOrder = currentQuestion.correctOrder || [];
        isCorrect = JSON.stringify(cleanAnswers) === JSON.stringify(correctOrder);
      }

      if (isCorrect) {
        setStatus('correct');
      } else {
        setStatus('incorrect');
        if (!hasWrongAttempt) {
          setIncorrectCount(prev => prev + 1);
          setHasWrongAttempt(true);
        }
      }
      showFeedback();
  };

const handleContinue = () => {
    hideFeedback(async () => {
      if (status === 'correct') {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setAnswerWB('');
          setAnswerWM([]);
          setHasWrongAttempt(false);
        } else {
          if (isSubmitting) return;
          setIsSubmitting(true);

          console.log("Đã xong Exercise, đang chuyển hướng tới Quiz Intro...");
          
          // 1. Tính điểm % Bài tập (Dựa trên số câu không bị sai lần nào)
          const correctCount = Math.max(0, questions.length - incorrectCount);
          const percentage = Math.round((correctCount / questions.length) * 100);

          try {
            // Lưu ý: Không lưu tiến độ bài tập ngữ pháp vào LessonProgress ở đây
            // vì exercise chỉ là bài thực hành, tiến độ lý thuyết đã được lưu ở detail.tsx
            router.push({
              pathname: '/lessons/[lessonId]/grammar/quiz-intro',
              params: { lessonId: String(lessonId) }
            } as any);
          } catch (err: any) {
            console.error("Lỗi lưu điểm bài tập:", err);
            setIsSubmitting(false);
          }
        }
      } else {
        setAnswerWB('');
        setAnswerWM([]);
      }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Color.main} />
        <Text style={{ marginTop: 10, fontFamily: FontFamily.lexendDecaMedium }}>Đang chuẩn bị bài tập...</Text>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.instructionTitle}>Bài học này chưa có bài tập ngữ pháp.</Text>
        <Button title="Quay lại" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <QuizHeader 
        current={currentIndex + 1} 
        total={questions.length} 
        incorrectCount={incorrectCount} 
        onClose={() => router.back()}
      />

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.instructionTitle}>
            {currentQuestion.instruction}
          </Text>

          <View style={{ width: '100%', alignItems: 'center' }}>
            {currentQuestion.type === 'whiteboard' ? (
              <WhiteboardArea 
                key={currentQuestion.clientId || currentIndex}
                question={currentQuestion} 
                answer={answerWB} 
                setAnswer={setAnswerWB} 
              />
            ) : (
              <WordMatchArea 
                question={currentQuestion} 
                selectedWords={answerWM} 
                setSelectedWords={setAnswerWM} 
                isError={status === 'incorrect'}
              />
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title="KIỂM TRA" 
            variant={!isButtonDisabled() ? "Green" : "Gray"}
            disabled={isButtonDisabled()}
            onPress={handleCheck}
          />
        </View>
      </KeyboardAvoidingView>

      <FeedbackSheet 
        visible={status !== 'idle'} 
        type={status === 'incorrect' ? 'failure' : 'success'} 
        onNext={handleContinue}
        translateY={feedbackTranslateY} 
        opacity={feedbackOpacity}
        imageSource={
          status === 'incorrect'
            ? require('../../../../assets/images/horani/failure.png')
            : require('../../../../assets/images/horani/success.png')
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Color.bg 
  },
  keyboardAvoid: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1, 
    alignItems: 'center', 
    paddingHorizontal: Padding.padding_20, 
    paddingTop: Padding.padding_20,
    justifyContent: 'center', 
    paddingBottom: 30
  },
  instructionTitle: { 
    fontFamily: FontFamily.lexendDecaBold, 
    fontSize: 18, 
    color: Color.text, 
    textAlign: 'center', 
    marginTop: -100,
  },
  footer: { 
    paddingHorizontal: Padding.padding_20, 
    paddingBottom: Platform.OS === 'ios' ? 10 : 20, 
    paddingTop: 10, 
    backgroundColor: Color.bg,
    borderTopWidth: 1,
    borderTopColor: Color.stroke,
  },
});