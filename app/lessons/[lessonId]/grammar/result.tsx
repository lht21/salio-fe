import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import CloseButton from '../../../../components/CloseButton';
import Button from '../../../../components/Button';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal'; 

// --- MOCK DATA ---
// Dữ liệu giả lập cho kết quả bài tập ngữ pháp
const GRAMMAR_RESULTS = [
  { 
    id: '1', 
    question: 'Điền từ còn thiếu vào chỗ trống:\n저는 학생_____', 
    userAnswer: '입니다', 
    correctAnswer: '입니다', 
    isCorrect: true, 
    explanation: 'Dùng "입니다" ở dạng khẳng định để kết thúc câu giới thiệu bản thân.' 
  },
  { 
    id: '2', 
    question: 'Sắp xếp thành câu hoàn chỉnh:\n이것은 / 책 / 입니다.', 
    userAnswer: '이것은 입니다 책.', 
    correctAnswer: '이것은 책 입니다.', 
    isCorrect: false, 
    explanation: 'Trật tự câu chuẩn trong tiếng Hàn là: Chủ ngữ (이것은) + Tân ngữ (책) + Động/Tính từ (입니다).' 
  },
  { 
    id: '3', 
    question: 'Điền từ còn thiếu vào chỗ trống:\n저 사람은 의사_____', 
    userAnswer: '입니까', 
    correctAnswer: '입니까', 
    isCorrect: true, 
    explanation: 'Dùng "입니까" cho câu hỏi nghi vấn trang trọng.' 
  },
];

export default function GrammarResultScreen() {
  const router = useRouter();
  const { lessonId, correctCount, totalCount, score, timeTaken, hasNextGrammar, nextGrammarIndex } = useLocalSearchParams();
  
  // Chuyển đổi dữ liệu từ chuỗi (string) trên URL thành số (number) kèm giá trị mặc định dự phòng
  const parsedCorrect = parseInt(correctCount as string) || 0;
  const parsedTotal = parseInt(totalCount as string) || 5;
  const parsedScore = parseInt(score as string) || 0;
  const parsedTime = parseInt(timeTaken as string) || 0;

  // Hàm định dạng thời gian (giây -> mm:ss)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) {
      return `${m} phút ${s < 10 ? '0' : ''}${s} giây`;
    }
    return `${s} giây`;
  };

  // STATE HIỂN THỊ MODAL THOÁT
  const [showExitModal, setShowExitModal] = useState(false);

  // Kiểm tra xem còn ngữ pháp tiếp theo không (dựa vào params truyền từ màn trước)
  const isHasNext = hasNextGrammar === 'true';

  const handleNext = () => {
    if (isHasNext) {
      // Chuyển sang học ngữ pháp tiếp theo
      router.push(`/lessons/${lessonId}/grammar/intro?grammarIndex=${nextGrammarIndex || 2}` as any);
    } else {
      // Đã hết ngữ pháp -> Điều hướng sang phần tiếp theo (Nói)
      router.push(`/lessons/${lessonId}/speaking/intro` as any);
    }
  };

  const handleRetry = () => {
    // Cho phép học lại vòng thực hành ngữ pháp
    router.replace(`/lessons/${lessonId}/grammar/exercise` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* 1. HEADER */}
      <View style={styles.header}>
        <CloseButton variant="Stroke" onPress={() => setShowExitModal(true)} />
      </View>

      <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* 2. CELEBRATION */}
        <View style={styles.celebrationSection}>
          <Image 
            source={require('../../../../assets/images/horani/result-levelup.png')} 
            style={styles.illustration} 
            resizeMode="contain" 
          />
          <Text style={styles.titleText}>Hoàn thành!</Text>
        </View>

        {/* 3. SCORE BANNER */}
        <View style={styles.scoreBanner}>
          <View>
            <Text style={styles.scoreText}>Đúng {parsedCorrect}/{parsedTotal}</Text>
            <Text style={styles.timeText}>Thời gian: {formatTime(parsedTime)}</Text>
          </View>
          <View style={styles.scoreRight}>
            <Text style={styles.scoreNumber}>{parsedScore}</Text>
            <Text style={styles.scoreLabel}>điểm</Text>
          </View>
        </View>

        {/* 4. RESULT LIST */}
        <View style={styles.listSection}>
          {GRAMMAR_RESULTS.map((item, index) => (
            <View 
              key={item.id} 
              style={[
                styles.card, 
                item.isCorrect ? styles.cardCorrect : styles.cardIncorrect
              ]}
            >
              {/* Header của thẻ chứa Badge Đúng/Sai */}
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Câu {index + 1}</Text>
                <View style={[
                  styles.typeBadge, 
                  item.isCorrect ? styles.badgeBgCorrect : styles.badgeBgIncorrect
                ]}>
                  <Text style={[
                    styles.typeText, 
                    item.isCorrect ? styles.badgeTextCorrect : styles.badgeTextIncorrect
                  ]}>
                    {item.isCorrect ? 'Chính xác' : 'Sai'}
                  </Text>
                </View>
              </View>

              {/* Nội dung chính của câu hỏi */}
              <View style={styles.cardBody}>
                <Text style={styles.questionText}>{item.question}</Text>
                
                <View style={styles.answerArea}>
                  {!item.isCorrect && (
                    <Text style={styles.wrongAnswerText}>
                      Của bạn: <Text style={styles.strikeThrough}>{item.userAnswer}</Text>
                    </Text>
                  )}
                  <Text style={styles.rightAnswerText}>
                    Đáp án: {item.correctAnswer}
                  </Text>
                </View>

                <Text style={styles.explanationText}>
                  💡 {item.explanation}
                </Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* 5. ACTION BUTTONS */}
      <View style={styles.footer}>
        <Button 
          title={isHasNext ? "Học ngữ pháp tiếp theo" : "Tiếp tục học Nói"} 
          variant="Green" 
          onPress={handleNext} 
        />
        <Button 
          title="Luyện tập lại Ngữ pháp" 
          variant="Outline" 
          onPress={handleRetry} 
          style={{ marginTop: Gap.gap_10 }}
        />
      </View>

      <ConfirmModal 
        isVisible={showExitModal}
        title="Trở về trang chủ?"
        subtitle="Bạn đã hoàn thành vòng này, bạn có chắc muốn thoát ra không?"
        cancelText="Ở lại"
        confirmText="Trở về"
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => {
          setShowExitModal(false);
          router.push('/(tabs)');
        }}
      />

    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.bg },
  header: { alignItems: 'flex-end', paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_10 },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: Padding.padding_20, paddingBottom: 40 },
  
  celebrationSection: { alignItems: 'center', marginBottom: Gap.gap_20 },
  illustration: { width: 160, height: 160, marginBottom: Gap.gap_10 },
  titleText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_24, color: Color.xanh },

  scoreBanner: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: Color.greenLight, padding: Padding.padding_15,
    borderRadius: Border.br_15, marginBottom: Gap.gap_20,
  },
  scoreText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: Color.main2, marginBottom: 4 },
  timeText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.main2, opacity: 0.8 },
  scoreRight: { alignItems: 'flex-end', justifyContent: 'center' },
  scoreNumber: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_24, color: Color.main2, lineHeight: 28 },
  scoreLabel: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.main2 },
  
  listSection: { width: '100%' },

  // --- STYLES CHO CARD (Grammar Result) ---
  card: {
    backgroundColor: Color.bg, borderRadius: Border.br_15,
    borderWidth: 2, padding: Padding.padding_15, marginBottom: 12,
  },
  cardCorrect: { borderColor: Color.main },
  cardIncorrect: { borderColor: Color.red },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Gap.gap_10 },
  cardTitle: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_14, color: Color.gray, marginRight: Gap.gap_10 },
  
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeBgCorrect: { backgroundColor: Color.greenLight },
  badgeBgIncorrect: { backgroundColor: '#FFEBEB' },
  typeText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12 },
  badgeTextCorrect: { color: Color.main2 },
  badgeTextIncorrect: { color: Color.red },
  
  cardBody: { flexDirection: 'column' },
  questionText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
    lineHeight: 24,
    marginBottom: Gap.gap_10,
  },
  answerArea: {
    backgroundColor: '#F8FAFC',
    padding: Padding.padding_10,
    borderRadius: Border.br_10,
    marginBottom: Gap.gap_10,
  },
  wrongAnswerText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.gray,
    marginBottom: 4,
  },
  strikeThrough: {
    textDecorationLine: 'line-through',
    color: Color.red,
  },
  rightAnswerText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: Color.main2,
  },
  explanationText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
    lineHeight: 22,
  },

  footer: {
    paddingHorizontal: Padding.padding_20, paddingVertical: Padding.padding_20,
    backgroundColor: Color.bg, borderTopWidth: 1, borderTopColor: Color.stroke,
  }
});