import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';

// Import Design System & Components
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import ExamHeader from '../ExamComponent/ExamHeader';
import QuestionBlock from '../ExamComponent/QuestionBlock';
import { ConfirmModal } from '../ModalResult/ConfirmModal';

const ExamCover = ({ title, type }: { title: string, type: string }) => (
  <View style={styles.coverBanner}>
    <Text style={styles.coverTitle}>{title}</Text>
    <View style={styles.coverInfoRow}>
      <Text style={styles.coverInfoChip}>TOPIK II</Text>
      <Text style={styles.coverInfoChip}>{type === 'reading' ? '읽기' : '듣기'}</Text>
    </View>
  </View>
);

const MultipleChoiceUI = ({ data, answers, timeLeft, onSelectAnswer, onSubmit, onExit, type }: any) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const questionLayouts = useRef<Record<string, number>>({});
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showQuestionListModal, setShowQuestionListModal] = useState(false);
  const examTitle = data?.title || 'Bài thi trắc nghiệm';

  // Làm phẳng danh sách câu hỏi để tính toán và Modal Grid
  const allQuestions = useMemo(() => {
    let questions: any[] = [];
    const sections = type === 'full' ? ['listening', 'reading'] : [type];
    sections.forEach(sec => {
      if (data?.items && data.items[sec]) {
        data.items[sec].forEach((item: any) => {
          if (item.questions) {
            questions = [...questions, ...item.questions];
          }
        });
      }
    });
    return questions;
  }, [data, type]);

  const totalQuestions = allQuestions.length;
  const answeredQuestions = Object.keys(answers).length;
  const remainingQuestions = totalQuestions - answeredQuestions;

  const handleJumpToQuestion = (questionId: string) => {
    const y = questionLayouts.current[questionId];
    if (y !== undefined && scrollViewRef.current) {
      setShowQuestionListModal(false);
      scrollViewRef.current.scrollTo({ y: y - 10, animated: true });
    }
  };

  const renderOptions = (questionId: string, options: any[], secType: string) => {
    return (
      <View style={styles.textOptionsContainer}>
        {options?.map((opt, index) => {
          // Hỗ trợ cả options là chuỗi ("...") hoặc Object ({ label, text, _id })
          const isString = typeof opt === 'string';
          const optValue = isString ? opt : (opt.label || opt._id);
          const optLabel = isString ? opt : (opt.text || opt.label);

          return (
            <TouchableOpacity
              key={isString ? index : (opt._id || index)}
              style={[styles.textOptionCard, answers[questionId] === optValue && styles.optionSelected]}
              onPress={() => onSelectAnswer(questionId, optValue, secType)}
            >
              <Text style={styles.textOptionContent}>{optLabel}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderSection = (secType: string, title: string) => {
    const items = type === 'full' ? data?.items?.[secType] : data?.items;
    if (!items || items.length === 0) return null;

    return (
      <>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {items.map((item: any, itemIndex: number) => (
          <View key={item._id || itemIndex} style={{ marginBottom: Gap.gap_20 }}>
            {item.title && <Text style={styles.instructionText}>{item.title}</Text>}
            {(item.passage || item.content) ? <Text style={styles.passageText}>{item.passage || item.content}</Text> : null}
            {item.questions?.map((q: any, qIndex: number) => (
              <View
                key={q._id || qIndex}
                onLayout={(e) => { questionLayouts.current[q._id] = e.nativeEvent.layout.y; }}
              >
                <QuestionBlock number={qIndex + 1} questionText={q.questionText || q.text}>
                  {renderOptions(q._id, q.metadata?.options || q.answers, secType)}
                </QuestionBlock>
              </View>
            ))}
          </View>
        ))}
      </>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ExamHeader
        timeLeft={timeLeft}
        remainingQuestions={remainingQuestions}
        onClose={() => setShowExitModal(true)}
        onSubmit={() => setShowSubmitModal(true)}
        onOpenQuestionList={() => setShowQuestionListModal(true)}
      />
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        <ExamCover title={examTitle} type={type} />
        
        {(type === 'listening' || type === 'full') && renderSection('listening', 'TOPIK 듣기')}
        {(type === 'reading' || type === 'full') && renderSection('reading', 'TOPIK 읽기')}
      </ScrollView>

      <ConfirmModal
        isVisible={showExitModal}
        title="Dừng bài thi?"
        subtitle="Tiến trình sẽ không được lưu. Bạn có chắc muốn thoát?"
        confirmText="Thoát"
        cancelText="Ở lại"
        isDestructive={true}
        onConfirm={onExit}
        onCancel={() => setShowExitModal(false)}
      />

      <ConfirmModal
        isVisible={showSubmitModal}
        title="Nộp bài ngay?"
        subtitle="Sau khi nộp, bạn sẽ không thể sửa lại bài làm của mình."
        confirmText="Nộp bài"
        cancelText="Kiểm tra lại"
        isDestructive={false}
        onConfirm={() => { setShowSubmitModal(false); onSubmit(); }}
        onCancel={() => setShowSubmitModal(false)}
      />

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
              {allQuestions.map((q: any, index: number) => {
                const isAnswered = !!answers[q._id]; 
                return (
                  <TouchableOpacity 
                    key={q._id || index} 
                    style={[styles.questionBox, isAnswered ? styles.questionBoxAnswered : styles.questionBoxPending]}
                    onPress={() => handleJumpToQuestion(q._id)}
                  >
                    <Text style={[styles.questionBoxText, isAnswered && { color: Color.bg }]}>{index + 1}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: Padding.padding_15, paddingBottom: 50 },
  coverBanner: { backgroundColor: '#1E293B', borderRadius: Border.br_20, padding: Padding.padding_20, marginBottom: 40 },
  coverTitle: { fontFamily: FontFamily.notoSerifBold, fontSize: FontSize.fs_20, color: Color.bg, textAlign: 'center', marginBottom: Gap.gap_15 },
  coverInfoRow: { flexDirection: 'row', justifyContent: 'center', gap: Gap.gap_10, marginBottom: Gap.gap_20 },
  coverInfoChip: { fontFamily: FontFamily.notoSerifRegular, fontSize: FontSize.fs_12, color: '#1E293B', backgroundColor: Color.stroke, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, overflow: 'hidden' },
  sectionHeader: { borderBottomWidth: 2, borderColor: Color.stroke, paddingBottom: 10, marginBottom: 20 },
  sectionTitle: { fontFamily: FontFamily.notoSerifBold, fontSize: FontSize.fs_16, color: Color.text },
  instructionText: { fontFamily: FontFamily.notoSerifBold, fontSize: FontSize.fs_16, color: Color.text, marginBottom: Gap.gap_10 },
  passageText: { fontFamily: FontFamily.notoSerifRegular, fontSize: FontSize.fs_14, color: Color.color, lineHeight: 24, marginBottom: Gap.gap_15, backgroundColor: '#F8FAFC', padding: 15, borderRadius: Border.br_10 },
  imageOptionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: Gap.gap_15 },
  imageOptionCard: { width: '48%', aspectRatio: 1, borderWidth: 2, borderColor: Color.stroke, borderRadius: Border.br_15, padding: Padding.padding_10, alignItems: 'center', justifyContent: 'space-between' },
  optionImage: { flex: 1, width: '100%', borderRadius: Border.br_10 },
  optionLabel: { fontFamily: FontFamily.notoSerifRegular, fontSize: FontSize.fs_14, color: Color.gray, marginTop: 8 },
  textOptionsContainer: { gap: Gap.gap_10 },
  textOptionCard: { borderWidth: 2, borderColor: Color.stroke, borderRadius: Border.br_15, padding: Padding.padding_15 },
  textOptionContent: { fontFamily: FontFamily.notoSerifRegular, fontSize: FontSize.fs_16, color: Color.text, lineHeight: 24 },
  optionSelected: { borderColor: Color.main, backgroundColor: Color.greenLight },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBackground: { ...StyleSheet.absoluteFillObject },
  questionListContainer: { backgroundColor: Color.bg, borderTopLeftRadius: Border.br_20, borderTopRightRadius: Border.br_20, padding: Padding.padding_20, maxHeight: '70%' },
  questionListTitle: { fontFamily: FontFamily.notoSerifBold, fontSize: FontSize.fs_16, color: Color.text, marginBottom: Gap.gap_20, textAlign: 'center' },
  questionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Gap.gap_10, justifyContent: 'center' },
  questionBox: { width: 44, height: 44, borderRadius: Border.br_10, justifyContent: 'center', alignItems: 'center' },
  questionBoxPending: { backgroundColor: Color.stroke },
  questionBoxAnswered: { backgroundColor: Color.main },
  questionBoxText: { fontFamily: FontFamily.notoSerifRegular, fontSize: FontSize.fs_14, color: Color.gray },
});

export default MultipleChoiceUI;