import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Import Design System & Components
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import ExamHeader from '../../../../components/ExamComponent/ExamHeader';
import QuestionBlock from '../../../../components/ExamComponent/QuestionBlock';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';

// --- MOCK DATA & TYPES ---
interface Option { id: string; content: string; type: 'text' | 'image'; }
interface Question { id: string; number: number; type: 'listening' | 'reading'; questionText?: string; options: Option[]; }

const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1', number: 1, type: 'listening',
    options: [
      { id: '1a', type: 'image', content: 'https://via.placeholder.com/150/F0F0F0/000000?text=Image+1' },
      { id: '1b', type: 'image', content: 'https://via.placeholder.com/150/F0F0F0/000000?text=Image+2' },
      { id: '1c', type: 'image', content: 'https://via.placeholder.com/150/F0F0F0/000000?text=Image+3' },
      { id: '1d', type: 'image', content: 'https://via.placeholder.com/150/F0F0F0/000000?text=Image+4' },
    ]
  },
  {
    id: 'q2', number: 2, type: 'listening',
    options: [
      { id: '2a', type: 'text', content: '① 네, 알겠습니다.' },
      { id: '2b', type: 'text', content: '② 아니요, 모르겠습니다.' },
      { id: '2c', type: 'text', content: '③ 괜찮습니다.' },
      { id: '2d', type: 'text', content: '④ 감사합니다.' },
    ]
  },
  {
    id: 'q3', number: 3, type: 'listening',
    options: [
      { id: '3a', type: 'image', content: 'https://via.placeholder.com/150/F0F0F0/000000?text=Graph+1' },
      { id: '3b', type: 'image', content: 'https://via.placeholder.com/150/F0F0F0/000000?text=Graph+2' },
      { id: '3c', type: 'image', content: 'https://via.placeholder.com/150/F0F0F0/000000?text=Graph+3' },
      { id: '3d', type: 'image', content: 'https://via.placeholder.com/150/F0F0F0/000000?text=Graph+4' },
    ]
  },
  {
    id: 'q4', number: 4, type: 'listening',
    options: [
      { id: '4a', type: 'text', content: '① 도서관' },
      { id: '4b', type: 'text', content: '② 우체국' },
      { id: '4c', type: 'text', content: '③ 백화점' },
      { id: '4d', type: 'text', content: '④ 편의점' },
    ]
  },
  {
    id: 'q13', number: 13, type: 'reading',
    questionText: '이 글의 내용과 같은 것을 고르십시오.\n저는 어제 친구와 같이 영화를 봤습니다. 영화가 아주 재미있었습니다. 우리는 영화를 보고 나서 식당에 갔습니다. 식당에서 비빔밥을 먹었습니다.',
    options: [
      { id: '13a', type: 'text', content: '① 친구와 밥을 먹었습니다.' },
      { id: '13b', type: 'text', content: '② 혼자 영화를 봤습니다.' },
      { id: '13c', type: 'text', content: '③ 영화가 재미없었습니다.' },
      { id: '13d', type: 'text', content: '④ 식당에 가지 않았습니다.' },
    ]
  },
  {
    id: 'q14', number: 14, type: 'reading',
    questionText: '다음을 읽고 물음에 답하십시오.\n안녕하세요. 저는 김민수입니다. 저는 한국 대학교 학생입니다. 한국어를 전공합니다. 만나서 반갑습니다.',
    options: [
      { id: '14a', type: 'text', content: '① 이 사람은 선생님입니다.' },
      { id: '14b', type: 'text', content: '② 이 사람은 학생입니다.' },
      { id: '14c', type: 'text', content: '③ 이 사람은 영어를 전공합니다.' },
      { id: '14d', type: 'text', content: '④ 이 사람은 한국 대학교에 다니지 않습니다.' },
    ]
  },
  {
    id: 'q15', number: 15, type: 'reading',
    questionText: '(      )에 들어갈 가장 알맞은 것을 고르십시오.\n저는 주말에 (      ) 에 가서 책을 빌렸습니다.',
    options: [
      { id: '15a', type: 'text', content: '① 도서관' },
      { id: '15b', type: 'text', content: '② 식당' },
      { id: '15c', type: 'text', content: '③ 병원' },
      { id: '15d', type: 'text', content: '④ 우체국' },
    ]
  }
];

// --- SUB-COMPONENTS (for this screen only) ---

const ExamCover = ({ title }: { title: string }) => (
  <View style={styles.coverBanner}>
    <Text style={styles.coverTitle}>{title}</Text>
    <View style={styles.coverInfoRow}>
      <Text style={styles.coverInfoChip}>TOPIK II</Text>
      <Text style={styles.coverInfoChip}>1교시 듣기, 쓰기</Text>
    </View>
    <View style={styles.mockTable}>
      <View style={styles.tableRow}>
        <Text style={styles.tableHeader}>수험번호</Text>
        <Text style={styles.tableCell}>011021010001</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableHeader}>성명</Text>
        <Text style={styles.tableCell}>NGUYEN VAN A</Text>
      </View>
    </View>
  </View>
);

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

export default function MockExamScreen() {
  const router = useRouter();
  const { examId } = useLocalSearchParams();
  const examTitle = `제${examId}회 한국어능력시험`;

  const scrollViewRef = useRef<ScrollView>(null);
  const questionLayouts = useRef<Record<string, number>>({});

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showQuestionListModal, setShowQuestionListModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    // TODO: Thêm logic chấm điểm thực tế dựa trên 'answers'
    const mockResults = {
      readingScore: 85,
      listeningScore: 90,
      writingScore: 0, // Không có phần viết trong đề này
      levelName: 'TOPIK II'
    };

    // Điều hướng đến màn hình kết quả và truyền điểm số
    router.push({
      pathname: `/practice/mock-exam/${examId}/result`,
      params: { examId, ...mockResults }
    });
  };

  const handleJumpToQuestion = (questionId: string) => {
    const y = questionLayouts.current[questionId];
    if (y !== undefined && scrollViewRef.current) {
      // Đóng modal trước khi cuộn
      setShowQuestionListModal(false);
      // Cuộn tới vị trí câu hỏi (trừ đi một khoảng nhỏ để không bị header che)
      scrollViewRef.current.scrollTo({ y: y - 10, animated: true });
    }
  };

  const totalQuestions = MOCK_QUESTIONS.length;
  const answeredQuestions = Object.keys(answers).length;
  const remainingQuestions = totalQuestions - answeredQuestions;

  const renderOptions = (question: Question) => {
    if (question.options[0].type === 'image') {
      return (
        <View style={styles.imageOptionsGrid}>
          {question.options.map((opt, index) => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.imageOptionCard, answers[question.id] === opt.id && styles.optionSelected]}
              onPress={() => handleSelectAnswer(question.id, opt.id)}
            >
              <Image source={{ uri: opt.content }} style={styles.optionImage} />
              <Text style={styles.optionLabel}>{`①②③④`[index]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return (
      <View style={styles.textOptionsContainer}>
        {question.options.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.textOptionCard, answers[question.id] === opt.id && styles.optionSelected]}
            onPress={() => handleSelectAnswer(question.id, opt.id)}
          >
            <Text style={styles.textOptionContent}>{opt.content}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ExamHeader
        timeLeft={timeLeft}
        remainingQuestions={remainingQuestions}
        onClose={() => setShowExitModal(true)}
        onSubmit={() => setShowSubmitModal(true)}
        onOpenQuestionList={() => setShowQuestionListModal(true)}
      />
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        <ExamCover title={examTitle} />
        
        {/* Listening Section */}
        <SectionHeader title="TOPIK 듣기 (1번~50번)" />
        {MOCK_QUESTIONS.filter(q => q.type === 'listening').map(q => (
          <View
            key={q.id}
            onLayout={(event) => {
              questionLayouts.current[q.id] = event.nativeEvent.layout.y;
            }}
          >
            <QuestionBlock number={q.number}>
              {renderOptions(q)}
            </QuestionBlock>
          </View>
        ))}

        {/* Reading Section */}
        <SectionHeader title="TOPIK 읽기 (1번~50번)" />
        {MOCK_QUESTIONS.filter(q => q.type === 'reading').map(q => (
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

      <ConfirmModal
        isVisible={showExitModal}
        title="Dừng bài thi?"
        subtitle="Tiến trình sẽ không được lưu. Bạn có chắc muốn thoát?"
        confirmText="Thoát"
        cancelText="Ở lại"
        isDestructive={true}
        onConfirm={() => router.back()}
        onCancel={() => setShowExitModal(false)}
      />

      <ConfirmModal
        isVisible={showSubmitModal}
        title="Nộp bài ngay?"
        subtitle="Sau khi nộp, bạn sẽ không thể sửa lại bài làm của mình."
        confirmText="Nộp bài"
        cancelText="Kiểm tra lại"
        isDestructive={false} // Nút xác nhận sẽ có màu xanh
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowSubmitModal(false)}
      />

      {/* Modal hiển thị danh sách câu hỏi */}
      <Modal
        visible={showQuestionListModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowQuestionListModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackground} onPress={() => setShowQuestionListModal(false)} />
          <View style={styles.questionListContainer}>
            <Text style={styles.questionListTitle}>Danh sách câu hỏi</Text>
            <ScrollView contentContainerStyle={styles.questionGrid}>
              {MOCK_QUESTIONS.map((q) => {
                const isAnswered = !!answers[q.id]; // Kiểm tra câu hỏi đã có trong state answers chưa
                return (
                  <TouchableOpacity 
                    key={q.id} 
                    style={[styles.questionBox, isAnswered ? styles.questionBoxAnswered : styles.questionBoxPending]}
                    onPress={() => handleJumpToQuestion(q.id)}
                  >
                    <Text style={[styles.questionBoxText, isAnswered && { color: Color.bg }]}>{q.number}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.bg },
  scrollContent: { padding: Padding.padding_15, paddingBottom: 50 },
  // Cover Styles
  coverBanner: { backgroundColor: '#1E293B', borderRadius: Border.br_20, padding: Padding.padding_20, marginBottom: 40 },
  coverTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_20, color: Color.bg, textAlign: 'center', marginBottom: Gap.gap_15 },
  coverInfoRow: { flexDirection: 'row', justifyContent: 'center', gap: Gap.gap_10, marginBottom: Gap.gap_20 },
  coverInfoChip: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: '#1E293B', backgroundColor: Color.stroke, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, overflow: 'hidden' },
  mockTable: { borderWidth: 1, borderColor: '#475569', borderRadius: Border.br_10, overflow: 'hidden' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#475569' },
  tableHeader: { fontFamily: FontFamily.lexendDecaMedium, color: '#94A3B8', backgroundColor: '#334155', padding: 10, width: 80, textAlign: 'center' },
  tableCell: { flex: 1, fontFamily: FontFamily.lexendDecaRegular, color: Color.bg, padding: 10, textAlign: 'center' },
  // Section Header
  sectionHeader: { borderBottomWidth: 2, borderColor: Color.stroke, paddingBottom: 10, marginBottom: 20 },
  sectionTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text },
  // Image Options
  imageOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Gap.gap_15,
  },
  imageOptionCard: {
    width: '48%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: Color.stroke,
    borderRadius: Border.br_15,
    padding: Padding.padding_10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionImage: {
    flex: 1,
    width: '100%',
    borderRadius: Border.br_10,
  },
  optionLabel: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.gray,
    marginTop: 8,
  },
  // Text Options
  textOptionsContainer: {
    gap: Gap.gap_10,
  },
  textOptionCard: {
    borderWidth: 2,
    borderColor: Color.stroke,
    borderRadius: Border.br_15,
    padding: Padding.padding_15,
  },
  textOptionContent: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_16,
    color: Color.text,
    lineHeight: 24,
  },
  // General Option Style
  optionSelected: {
    borderColor: Color.main,
    backgroundColor: Color.greenLight,
  },
  
  // --- Question List Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  questionListContainer: {
    backgroundColor: Color.bg,
    borderTopLeftRadius: Border.br_20,
    borderTopRightRadius: Border.br_20,
    padding: Padding.padding_20,
    maxHeight: '70%',
  },
  questionListTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
    marginBottom: Gap.gap_20,
    textAlign: 'center',
  },
  questionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Gap.gap_10,
    justifyContent: 'center',
  },
  questionBox: { 
    width: 44, 
    height: 44, 
    borderRadius: Border.br_10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  questionBoxPending: { backgroundColor: Color.stroke },
  questionBoxAnswered: { backgroundColor: Color.main },
  questionBoxText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.gray },
});