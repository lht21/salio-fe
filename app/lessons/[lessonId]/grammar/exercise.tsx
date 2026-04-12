import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

// Import Design System & Components
import { Color, FontFamily, FontSize, Padding, Gap } from '../../../../constants/GlobalStyles';
import Button from '../../../../components/Button';
import QuizHeader from '../../../../components/Modals/Question/QuizHeader';
import FeedbackSheet from '../../../../components/Modals/Popup/FeedbackPopup';
import WhiteboardArea from '../../../../components/QuizComponent/WhiteboardArea'; 

export default function GrammarExerciseScreen() {
  const { lessonId } = useLocalSearchParams();
  
  // State quản lý bài làm
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  
  // Thêm state để đếm số câu sai truyền vào QuizHeader
  const [incorrectCount, setIncorrectCount] = useState(0); 
  
  const CORRECT_ANSWER = '입니다';

  const handleCheck = () => {
    if (!answer.trim()) return;
    
    // Kiểm tra đáp án
    if (answer.trim() === CORRECT_ANSWER) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
      setIncorrectCount(prev => prev + 1); // Tăng biến đếm câu sai
    }
  };

  const handleContinue = () => {
    if (status === 'correct') {
      router.push(`/lessons/${lessonId}/grammar/result` as any);
    } else {
      // Logic khi bấm tiếp tục sau khi sai
      setStatus('idle');
      setAnswer('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Đã sửa Props cho đúng cấu trúc của QuizHeader.tsx */}
        <QuizHeader 
          current={1} 
          total={2} 
          incorrectCount={incorrectCount} 
          onClose={() => router.back()} 
        />

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Tiêu đề hướng dẫn */}
          <Text style={styles.instructionTitle}>
            Điền từ còn thiếu vào chỗ trống
          </Text>

          {/* Component Bảng trắng & Nhân vật đã được đóng gói */}
          <WhiteboardArea answer={answer} setAnswer={setAnswer} />

        </ScrollView>

        {/* Nút hành động */}
        <View style={styles.footer}>
          <Button 
            title="KIỂM TRA" 
            variant={answer.trim() ? "Green" : "Gray"} 
            disabled={!answer.trim() || status !== 'idle'}
            onPress={handleCheck}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Đã sửa Props cho đúng cấu trúc của FeedbackSheet.tsx */}
      {status !== 'idle' && (
        <FeedbackSheet 
          isCorrect={status === 'correct'} 
          onNext={handleContinue} 
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_20,
  },
  instructionTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_20,
    color: Color.text,
    textAlign: 'center',
    marginBottom: Gap.gap_20,
  },
  footer: {
    paddingHorizontal: Padding.padding_20,
    paddingBottom: Padding.padding_20,
    paddingTop: Padding.padding_10,
    backgroundColor: Color.bg,
  },
});