import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VocabularyService from '../../../../api/services/vocabulary.service';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';
import FeedbackPopup from '../../../../components/Modals/Popup/FeedbackPopup';
import { AnswerOption, QuizHeader, type OptionStatus } from '../../../../components/Modals/Question';
import { Color, FontFamily, FontSize, Gap, Padding, Border } from '../../../../constants/GlobalStyles';
import LessonService from '../../../../api/services/lesson.service';
import { LessonModules } from '../../../../api/types/lesson.types';

// Định nghĩa Interface cho câu hỏi trên Frontend
interface FrontendQuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  type: 'single_choice' | 'short_answer';
}

export default function VocabularyQuizScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams();

  // --- STATES ---
  const [session, setSession] = useState<any>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [inputText, setInputText] = useState(''); // Lưu nội dung gõ tự luận
  const [isAnswered, setIsAnswered] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [feedbackState, setFeedbackState] = useState<'hidden' | 'success' | 'failure'>('hidden');
  const [showExitModal, setShowExitModal] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const feedbackTranslateY = useRef(new Animated.Value(150)).current;

  // --- EFFECTS ---
  useEffect(() => {
    if (lessonId) {
      startQuiz();
    }
  }, [lessonId]);

  const startQuiz = async () => {
    setLoadingQuiz(true);
    try {
      const modulesResponse = await LessonService.getModules(lessonId as string);
      const modules = modulesResponse.data as LessonModules;
      const vocabularyQuizzes = modules.vocabularyQuizzes || [];

      if (vocabularyQuizzes.length === 0) {
        setLoadingQuiz(false);
        return;
      }

      const quizId = typeof vocabularyQuizzes[0] === 'object' ? vocabularyQuizzes[0]._id : vocabularyQuizzes[0];

      const startResponse = await VocabularyService.startVocabularyQuiz({ quizId });

      const sessionData = await VocabularyService.getVocabularyQuizSession(startResponse.sessionId);
      setSession(sessionData);
    } catch (error) {
      console.error('Lỗi khởi tạo quiz:', error);
    } finally {
      setLoadingQuiz(false);
    }
  };

// Hàm chuẩn hóa cực mạnh (Xử lý cả Unicode NFD/NFC và các ký tự trắng đặc biệt)
const normalizeString = (str: any) => {
  if (!str) return '';
  return String(str)
    .trim()
    .normalize('NFC') // Ép về chuẩn dựng sẵn của tiếng Hàn
    .replace(/\u200B/g, '') 
    .toLowerCase();
};

const transformQuestion = (questionItem: any): FrontendQuizQuestion => {
    if (!questionItem || !questionItem.question)
      return { id: '', question: '', options: [], correctAnswer: '', type: 'single_choice' };

    const data = questionItem.question;
    
    const cAnswer = 
      data.correctAnswer || 
      data.questions?.[0]?.correctAnswer || 
      data.metadata?.correctAnswer || 
      '';

    const qType = 
      data.type || 
      data.questions?.[0]?.type || 
      'single_choice';

    const options = 
      data.metadata?.options || 
      data.questions?.[0]?.metadata?.options || 
      data.options || 
      [];

    return {
      id: questionItem._id,
      question: data.questionText || data.questions?.[0]?.questionText || "Chọn đáp án đúng",
      options: options.map((text: string, idx: number) => ({ id: `opt_${idx}`, text: text })),
      correctAnswer: String(cAnswer), 
      type: qType
    };
};

const handleSubmitAnswer = async (answer: string) => {
  if (isAnswered || !answer.trim()) return;

  Keyboard.dismiss();

  const userAns = normalizeString(answer);
  const correctAns = normalizeString(currentQuestion.correctAnswer);
  
  // LOG ĐỂ KIỂM TRA TẠI SAO SAI
  // console.log('--- SO SÁNH ĐÁP ÁN ---');
  // console.log('Người dùng chọn:', `"${userAns}" (độ dài: ${userAns.length})`);
  // console.log('Đáp án đúng:', `"${correctAns}" (độ dài: ${correctAns.length})`);

  const isCorrect = userAns === correctAns;

  setSelectedAnswer(answer);
  setIsAnswered(true);

  if (isCorrect) {
    showFeedback('success');
  } else {
    setIncorrectCount((prev) => prev + 1);
    showFeedback('failure');
  }

  // Gửi lên server (Server đã chấm đúng nên phần này giữ nguyên)
  try {
    await VocabularyService.saveVocabularyQuizAnswer(session._id, {
      questionId: currentQuestionData._id,
      answer: answer,
    });
  } catch (error) {
    console.error('Lỗi lưu đáp án:', error);
  }
};

  const showFeedback = (type: 'success' | 'failure') => {
    setFeedbackState(type);
    feedbackOpacity.setValue(0);
    feedbackTranslateY.setValue(150);

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
        toValue: 150,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setFeedbackState('hidden');
      onDone?.();
    });
  };

  const handleNextQuestion = () => {
    const moveNext = async () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setInputText('');
        setIsAnswered(false);
      } else {
        try {
          const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
          await VocabularyService.submitVocabularyQuiz(session._id, { timeSpent });
          router.replace(`/lessons/${lessonId}/vocabulary/result?sessionId=${session._id}`);
        } catch (error) {
          router.replace(`/lessons/${lessonId}/vocabulary/result?sessionId=${session._id}`);
        }
      }
    };
    hideFeedback(moveNext);
  };

  if (loadingQuiz || !session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Color.main} />
          <Text style={styles.loadingText}>Đang chuẩn bị câu hỏi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const questions = session?.questions || [];
  if (questions.length === 0) return null;

  const currentQuestionData = questions[currentQuestionIndex];
  const currentQuestion = transformQuestion(currentQuestionData);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <QuizHeader
          current={currentQuestionIndex + 1}
          total={questions.length}
          incorrectCount={incorrectCount}
          onClose={() => setShowExitModal(true)}
        />

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          {currentQuestion.type === 'short_answer' ? (
            /* --- GIAO DIỆN TỰ LUẬN (SHORT ANSWER) --- */
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  isAnswered && (normalizeString(inputText) === normalizeString(currentQuestion.correctAnswer)
                    ? styles.inputSuccess
                    : styles.inputError)
                ]}
                placeholder="Nhập đáp án..."
                value={inputText}
                onChangeText={setInputText}
                editable={!isAnswered}
                autoFocus={true}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
              />
              {!isAnswered && (
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={() => handleSubmitAnswer(inputText)}
                >
                  <Text style={styles.submitBtnText}>Kiểm tra</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            /* --- GIAO DIỆN TRẮC NGHIỆM (SINGLE CHOICE) --- */
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((opt, idx) => (
                <AnswerOption
                  key={opt.id}
                  index={idx}
                  text={opt.text}
                  status={
                    !isAnswered ? 'default' :
                      selectedAnswer === opt.text ? (normalizeString(opt.text) === normalizeString(currentQuestion.correctAnswer) ? 'correct' : 'incorrect') :
                        normalizeString(opt.text) === normalizeString(currentQuestion.correctAnswer) ? 'missed-correct' : 'disabled'
                  }
                  onPress={() => handleSubmitAnswer(opt.text)}
                />
              ))}
            </View>
          )}
        </ScrollView>

        <FeedbackPopup
          visible={feedbackState !== 'hidden'}
          type={feedbackState === 'failure' ? 'failure' : 'success'}
          onNext={handleNextQuestion}
          onOutsidePress={feedbackState === 'failure' ? () => hideFeedback() : undefined}
          translateY={feedbackTranslateY}
          opacity={feedbackOpacity}
          imageSource={feedbackState === 'failure'
            ? require('../../../../assets/images/horani/failure.png')
            : require('../../../../assets/images/horani/success.png')}
        />

        <ConfirmModal
          isVisible={showExitModal}
          title="Đang học dở mà"
          subtitle="Bạn sắp hoàn thành rồi, cố thêm chút nữa nhé!"
          cancelText="Vẫn rời đi"
          confirmText="Học tiếp"
          onCancel={() => { setShowExitModal(false); router.back(); }}
          onConfirm={() => setShowExitModal(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.bg },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_16, color: Color.text, marginTop: Gap.gap_10 },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_30, paddingBottom: 40 },
  questionText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_24, color: Color.text, marginBottom: Gap.gap_20 },
  optionsContainer: { width: '100%' },

  /* Style cho Short Answer */
  inputContainer: { width: '100%', marginTop: Gap.gap_20 },
  textInput: {
    borderWidth: 2,
    borderColor: Color.colorBlack,
    borderRadius: 20,
    padding: Padding.padding_15,
    fontSize: 18,
    fontFamily: FontFamily.lexendDecaMedium,
    color: Color.text,
    minHeight: 60,
  },
  inputSuccess: { borderColor: Color.main },
  inputError: { borderColor: Color.red },
  submitBtn: {
    backgroundColor: Color.main,
    paddingVertical: Padding.padding_15,
    borderRadius: 12,
    marginTop: Gap.gap_20,
    alignItems: 'center',
  },
  submitBtnText: {
    color: Color.whiteText,
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 18,
  },
  errorText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_16, color: Color.red, textAlign: 'center' },
});