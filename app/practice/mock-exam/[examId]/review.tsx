import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircleIcon, XCircleIcon } from 'phosphor-react-native';

import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import ScreenHeader from '../../../../components/ScreenHeader';
import QuestionBlock from '../../../../components/ExamComponent/QuestionBlock';

// --- MOCK DATA (Cập nhật thêm correctOptionId và userOptionId để đối chiếu) ---
const MOCK_REVIEW_QUESTIONS = [
  {
    id: 'q1', number: 1, type: 'listening',
    correctOptionId: '1b', userOptionId: '1b', // Chọn Đúng
    options: [
      { id: '1a', type: 'image', content: 'https://via.placeholder.com/150/F0F0F0/000000?text=Image+1' },
      { id: '1b', type: 'image', content: 'https://via.placeholder.com/150/F0F0F0/000000?text=Image+2' },
      { id: '1c', type: 'image', content: 'https://via.placeholder.com/150/F0F0F0/000000?text=Image+3' },
      { id: '1d', type: 'image', content: 'https://via.placeholder.com/150/F0F0F0/000000?text=Image+4' },
    ]
  },
  {
    id: 'q2', number: 2, type: 'listening',
    correctOptionId: '2a', userOptionId: '2b', // Chọn Sai
    options: [
      { id: '2a', type: 'text', content: '① 네, 알겠습니다.' },
      { id: '2b', type: 'text', content: '② 아니요, 모르겠습니다.' },
      { id: '2c', type: 'text', content: '③ 괜찮습니다.' },
      { id: '2d', type: 'text', content: '④ 감사합니다.' },
    ]
  },
  {
    id: 'q13', number: 13, type: 'reading',
    questionText: '이 글의 내용과 같은 것을 고르십시오.\n저는 어제 친구와 같이 영화를 봤습니다. 영화가 아주 재미있었습니다. 우리는 영화를 보고 나서 식당에 갔습니다. 식당에서 비빔밥을 먹었습니다.',
    correctOptionId: '13a', userOptionId: '13d', // Chọn Sai
    options: [
      { id: '13a', type: 'text', content: '① 친구와 밥을 먹었습니다.' },
      { id: '13b', type: 'text', content: '② 혼자 영화를 봤습니다.' },
      { id: '13c', type: 'text', content: '③ 영화가 재미없었습니다.' },
      { id: '13d', type: 'text', content: '④ 식당에 가지 않았습니다.' },
    ]
  }
];

// --- SUB-COMPONENTS ---

const QuestionNavigation = ({ questions, onJumpToQuestion }: { questions: any[], onJumpToQuestion: (id: string) => void }) => {
  return (
    <View style={styles.navContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navScrollContent}>
        {questions.map((q) => {
          const isCorrect = q.userOptionId === q.correctOptionId;
          return (
            <TouchableOpacity
              key={q.id}
              style={[
                styles.navButton,
                isCorrect ? styles.navButtonCorrect : styles.navButtonWrong,
              ]}
              onPress={() => onJumpToQuestion(q.id)}
            >
              <Text style={styles.navButtonText}>{q.number}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default function MockExamReviewScreen() {
  const { examId } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const questionLayouts = useRef<Record<string, number>>({});

  const handleJumpToQuestion = (questionId: string) => {
    const y = questionLayouts.current[questionId];
    if (y !== undefined && scrollViewRef.current) {
      // Trừ đi một khoảng nhỏ để Header của QuestionBlock không bị che
      scrollViewRef.current.scrollTo({ y: y - 10, animated: true });
    }
  };

  const renderOptions = (question: any) => {
    const { correctOptionId, userOptionId, options } = question;

    if (options[0].type === 'image') {
      return (
        <View style={styles.imageOptionsGrid}>
          {options.map((opt: any, index: number) => {
            const isCorrect = opt.id === correctOptionId;
            const isUserChoice = opt.id === userOptionId;
            const isWrongChoice = isUserChoice && !isCorrect;

            return (
              <View
                key={opt.id}
                style={[
                  styles.imageOptionCard,
                  isCorrect && styles.optionCorrect,
                  isWrongChoice && styles.optionWrong,
                ]}
              >
                <Image source={{ uri: opt.content }} style={styles.optionImage} />
                <Text style={styles.optionLabel}>{`①②③④`[index]}</Text>
                
                {/* Huy hiệu Đúng/Sai cho ảnh */}
                {isCorrect && <View style={styles.iconBadge}><CheckCircleIcon size={28} color="#16A34A" weight="fill" /></View>}
                {isWrongChoice && <View style={styles.iconBadge}><XCircleIcon size={28} color="#DC2626" weight="fill" /></View>}
              </View>
            );
          })}
        </View>
      );
    }

    return (
      <View style={styles.textOptionsContainer}>
        {options.map((opt: any) => {
          const isCorrect = opt.id === correctOptionId;
          const isUserChoice = opt.id === userOptionId;
          const isWrongChoice = isUserChoice && !isCorrect;

          return (
            <View
              key={opt.id}
              style={[
                styles.textOptionCard,
                isCorrect && styles.optionCorrect,
                isWrongChoice && styles.optionWrong,
              ]}
            >
              <Text style={[
                styles.textOptionContent, 
                isCorrect && { color: '#16A34A', fontFamily: FontFamily.lexendDecaMedium },
                isWrongChoice && { color: '#DC2626' }
              ]}>
                {opt.content}
              </Text>
              
              {/* Icon đánh dấu câu hỏi Text */}
              {isCorrect && <CheckCircleIcon size={24} color="#16A34A" weight="fill" />}
              {isWrongChoice && <XCircleIcon size={24} color="#DC2626" weight="fill" />}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScreenHeader title="Xem lại bài làm" />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryBanner}>
          <Text style={styles.summaryText}>Đề thi TOPIK II - Mã đề: {examId || '01'}</Text>
          <Text style={styles.summarySub}>Dưới đây là chi tiết đáp án và phần bài làm của bạn.</Text>
        </View>

        {MOCK_REVIEW_QUESTIONS.map((q) => (
          <View
            key={q.id}
            onLayout={(event) => {
              questionLayouts.current[q.id] = event.nativeEvent.layout.y;
            }}
          >
            <QuestionBlock number={q.number} questionText={q.questionText}>
              {renderOptions(q)}
            </QuestionBlock>
          </View>
        ))}
      </ScrollView>

      <QuestionNavigation questions={MOCK_REVIEW_QUESTIONS} onJumpToQuestion={handleJumpToQuestion} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.bg },
  scrollContent: { padding: Padding.padding_15, paddingBottom: 50 },
  
  summaryBanner: { backgroundColor: '#F1F5F9', padding: Padding.padding_15, borderRadius: Border.br_15, marginBottom: 30, borderWidth: 1, borderColor: '#E2E8F0' },
  summaryText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text, marginBottom: 4 },
  summarySub: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.gray },
  
  imageOptionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: Gap.gap_15 },
  imageOptionCard: { width: '48%', aspectRatio: 1, borderWidth: 2, borderColor: Color.stroke, borderRadius: Border.br_15, padding: Padding.padding_10, alignItems: 'center', justifyContent: 'space-between', position: 'relative' },
  optionImage: { flex: 1, width: '100%', borderRadius: Border.br_10 },
  optionLabel: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.gray, marginTop: 8 },
  iconBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: Color.bg, borderRadius: 14 },
  
  textOptionsContainer: { gap: Gap.gap_10 },
  textOptionCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderColor: Color.stroke, borderRadius: Border.br_15, padding: Padding.padding_15 },
  textOptionContent: { flex: 1, fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_16, color: Color.text, lineHeight: 24 },
  
  // Trạng thái đáp án
  optionCorrect: { borderColor: '#22C55E', backgroundColor: '#F0FDF4' },
  optionWrong: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },

  // --- Question Navigation Styles ---
  navContainer: {
    backgroundColor: Color.bg,
    borderTopWidth: 1,
    borderTopColor: Color.stroke,
    paddingVertical: Padding.padding_10,
  },
  navScrollContent: {
    paddingHorizontal: Padding.padding_15,
    gap: Gap.gap_10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  navButtonCorrect: { backgroundColor: '#F0FDF4', borderColor: '#22C55E' },
  navButtonWrong: { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
  navButtonText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.text },
});