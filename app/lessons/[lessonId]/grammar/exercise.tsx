import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Animated,
  Pressable,
  Easing
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


// Import Design System & Components
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import Button from '../../../../components/Button';
import QuizHeader from '../../../../components/Modals/Question/QuizHeader';
import FeedbackSheet from '../../../../components/Modals/Popup/FeedbackPopup';
import WhiteboardArea from '../../../../components/QuizComponent/WhiteboardArea';
import WordMatchArea from '../../../../components/QuizComponent/WordMatchArea';

// --- BƯỚC 1: ĐỊNH NGHĨA KIỂU DỮ LIỆU CÂU HỎI ---
type QuestionType = 'whiteboard' | 'word_match';

interface Question {
  id: number;
  type: QuestionType;
  instruction: string;
  // Dữ liệu cho Whiteboard
  correctAnswerStr?: string;
  sentenceLeft?: string;
  sentenceRight?: string;
  vietnameseMeaning?: string;
  maxLength?: number;
  placeholder?: string;
  // Dữ liệu cho Word Match
  vietnamesePrompt?: string;
  words?: string[]; // Các từ bị xáo trộn
  correctOrder?: string[]; // Thứ tự đúng
}

// --- BƯỚC 2: DANH SÁCH 5 CÂU HỎI (2 Bảng trắng, 3 Ghép từ) ---
const QUIZ_DATA: Question[] = [
  {
    id: 1,
    type: 'whiteboard',
    instruction: 'Điền từ còn thiếu vào chỗ trống',
    correctAnswerStr: '입니다',
    sentenceLeft: '저는 학생',
    sentenceRight: '.',
    vietnameseMeaning: '(Tôi là học sinh.)',
    maxLength: 10,
    placeholder: '___',
  },
  {
    id: 2,
    type: 'whiteboard',
    instruction: 'Điền từ còn thiếu vào chỗ trống',
    correctAnswerStr: '입니까', 
    sentenceLeft: '저 사람은 의사',
    sentenceRight: '?',
    vietnameseMeaning: '(Người kia là bác sĩ phải không?)',
    maxLength: 10,
    placeholder: '___',
  },
  {
    id: 3,
    type: 'word_match',
    instruction: 'Sắp xếp các từ sau thành câu hoàn chỉnh',
    vietnamesePrompt: 'Sách là cái này.',
    words: ['입니다.', '이것은', '책'],
    correctOrder: ['이것은', '책', '입니다.'],
  },
  {
    id: 4,
    type: 'word_match',
    instruction: 'Sắp xếp các từ sau thành câu hoàn chỉnh',
    vietnamesePrompt: 'Tôi là bác sĩ.',
    words: ['의사', '저는', '입니다.'],
    correctOrder: ['저는', '의사', '입니다.'],
  },
  {
    id: 5,
    type: 'word_match',
    instruction: 'Sắp xếp các từ sau thành câu hoàn chỉnh',
    vietnamesePrompt: 'Kia là trường học.',
    words: ['입니다.', '학교', '저것은'],
    correctOrder: ['저것은', '학교', '입니다.'],
  }
];

// --- MÀN HÌNH CHÍNH ---
export default function GrammarExerciseScreen() {
  const { lessonId } = useLocalSearchParams();
  
  // State điều hướng bộ câu hỏi
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = QUIZ_DATA[currentIndex];

  // State lưu đáp án (Tách riêng cho 2 loại)
  const [answerWB, setAnswerWB] = useState(''); // Whiteboard
  const [answerWM, setAnswerWM] = useState<string[]>([]); // Word Match

  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [incorrectCount, setIncorrectCount] = useState(0); 
  const [hasWrongAttempt, setHasWrongAttempt] = useState(false);

  // Biến lưu thời gian bắt đầu làm bài
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now(); // Ghi nhận thời gian lúc màn hình vừa mount
  }, []);

  // Animations cho Feedback
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const feedbackTranslateY = useRef(new Animated.Value(150)).current;

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

  // Nút kiểm tra trạng thái Disabled
  const isButtonDisabled = () => {
    if (status !== 'idle') return true;
    if (currentQuestion.type === 'whiteboard') return !answerWB.trim();
    if (currentQuestion.type === 'word_match') return answerWM.length !== currentQuestion.words?.length;
    return true;
  };

  // Logic Kiểm tra
  const handleCheck = () => {
    let isCorrect = false;

    if (currentQuestion.type === 'whiteboard') {
      isCorrect = answerWB.trim() === currentQuestion.correctAnswerStr;
    } else if (currentQuestion.type === 'word_match') {
      // Chuyển array đáp án (đã dính index '_0') về array chữ sạch
      const cleanAnswers = answerWM.map(w => w.split('_')[0]);
      isCorrect = JSON.stringify(cleanAnswers) === JSON.stringify(currentQuestion.correctOrder);
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

  // Logic khi bấm "TIẾP TỤC" hoặc "ĐÃ HIỂU" trên BottomSheet
  const handleContinue = () => {
    hideFeedback(() => {
      if (status === 'correct') {
        if (currentIndex < QUIZ_DATA.length - 1) {
          // Sang câu tiếp theo
          setCurrentIndex(prev => prev + 1);
          setAnswerWB('');
          setAnswerWM([]);
            setHasWrongAttempt(false);
        } else {
          // --- TÍNH TOÁN ĐIỂM SỐ KHI XONG 5 CÂU ---
          const endTime = Date.now();
          const timeTakenSeconds = Math.floor((endTime - startTimeRef.current) / 1000);
          
          const correctAnswersCount = QUIZ_DATA.length - incorrectCount;
          const baseScore = correctAnswersCount * 10; // 10 điểm / 1 câu đúng
          
          // Điểm thưởng: Tối đa 50 điểm, trừ 1 điểm mỗi 2 giây
          const timeBonus = Math.max(0, 50 - Math.floor(timeTakenSeconds / 2));
          const finalScore = baseScore + timeBonus;

          // Xong 5 câu -> Điều hướng sang màn Result
          router.push({
            pathname: '/lessons/[lessonId]/grammar/result',
            params: {
              lessonId: String(lessonId),
              correctCount: String(correctAnswersCount),
              totalCount: String(QUIZ_DATA.length),
              score: String(finalScore),
              timeTaken: String(timeTakenSeconds)
            }
          } as any);
        }
      } else {
        // Nếu sai, reset đáp án để làm lại câu hiện tại
        setAnswerWB('');
        setAnswerWM([]);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <QuizHeader 
          current={currentIndex + 1} 
          total={QUIZ_DATA.length} 
          incorrectCount={incorrectCount} 
        />

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Tiêu đề câu hỏi thay đổi linh hoạt */}
          <Text style={styles.instructionTitle}>
            {currentQuestion.instruction}
          </Text>

          {/* Render Component dựa vào loại câu hỏi */}
          {currentQuestion.type === 'whiteboard' ? (
            <WhiteboardArea 
              question={currentQuestion as any} 
              answer={answerWB} 
              setAnswer={setAnswerWB} 
            />
          ) : (
            <WordMatchArea 
              question={currentQuestion as any} 
              selectedWords={answerWM} 
              setSelectedWords={setAnswerWM} 
              isError={status === 'incorrect'}
            />
          )}

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
        onOutsidePress={status === 'incorrect' ? () => hideFeedback() : undefined}
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

// --- STYLES MỞ RỘNG THÊM CHO WORD MATCH ---
const styles = StyleSheet.create({
  // Các style giữ nguyên từ cũ
  container: { flex: 1, backgroundColor: Color.bg },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_20 },
  instructionTitle: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_20, color: Color.text, textAlign: 'center', marginBottom: Gap.gap_20 },
  footer: { paddingHorizontal: Padding.padding_20, paddingBottom: Padding.padding_20, paddingTop: Padding.padding_10, backgroundColor: Color.bg },
});
