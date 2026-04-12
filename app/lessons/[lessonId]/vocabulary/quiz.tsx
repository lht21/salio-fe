import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Color, FontFamily, FontSize, Padding, Gap } from '../../../../constants/GlobalStyles';
import QuizHeader from '../../../../components/QuizComponent/QuizHeader';
import AnswerOption, { OptionStatus } from '../../../../components/QuizComponent/AnswerOption';
import FeedbackSheet from '../../../../components/QuizComponent/FeedbackSheet';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal'; 

// --- MOCK DATA ---
const QUIZ_DATA = [
  {
    id: 'q1',
    question: 'Trường học',
    options: [
      { id: 'opt1', text: '학생' },
      { id: 'opt2', text: '학교' },
      { id: 'opt3', text: '선생님' },
      { id: 'opt4', text: '의사' },
    ],
    correctOptionId: 'opt2',
  },
  {
    id: 'q2',
    question: 'Học sinh',
    options: [
      { id: 'opt1', text: '학생' },
      { id: 'opt2', text: '학교' },
      { id: 'opt3', text: '선생님' },
      { id: 'opt4', text: '의사' },
    ],
    correctOptionId: 'opt1',
  }
];

export default function VocabularyQuizScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams();

  // --- STATES ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // STATE HIỂN THỊ MODAL THOÁT
  const [showExitModal, setShowExitModal] = useState(false);

  const currentQuestion = QUIZ_DATA[currentIndex];
  const isCorrect = selectedAnswerId === currentQuestion.correctOptionId;

  // --- HANDLERS ---
  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return; // Khóa không cho chọn lại
    
    setSelectedAnswerId(optionId);
    setIsAnswered(true);

    const isAnswerCorrect = optionId === currentQuestion.correctOptionId;

    if (isAnswerCorrect) {
      // Nếu ĐÚNG: Tự động chuyển câu sau 1.5s
      setTimeout(() => {
        handleNextQuestion();
      }, 1500);
    } else {
      // Nếu SAI: Tăng biến đếm, đợi người dùng tự bấm nút
      setIncorrectCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < QUIZ_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswerId(null);
      setIsAnswered(false);
    } else {
      // Chuyển sang màn hình hoàn thành hoặc kết quả
      router.replace(`/lessons/${lessonId}/vocabulary/result`);
    }
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
              key={opt.id}
              index={idx}
              text={opt.text}
              status={getOptionStatus(opt.id)}
              onPress={() => handleSelectOption(opt.id)}
            />
          ))}
        </View>
      </ScrollView>
      {/* BOTTOM SHEET FEEDBACK */}
      {isAnswered && (
        <FeedbackSheet 
          isCorrect={isCorrect} 
          onNext={handleNextQuestion} 
        />
      )}

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