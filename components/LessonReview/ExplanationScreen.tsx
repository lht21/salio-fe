import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useRef, useState, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XIcon, CheckCircleIcon, XCircleIcon, LightbulbIcon } from 'phosphor-react-native';

import Button from '@/components/Button';
import { Border, FontFamily, FontSize } from '@/constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

export type ExplanationAnswerState = 'default' | 'correct' | 'incorrect';

export type ExplanationQuestion = {
  id: string;
  indexLabel: string;
  question: string;
  answers: {
    label: string;
    state: ExplanationAnswerState;
  }[];
  explanation: {
    title: string;
    correctLabel: string;
    body: string;
    translation?: string;
  };
};

type ExplanationScreenProps = {
  title: string;
  scoreLabel?: string;
  questions: ExplanationQuestion[];
  onClose: () => void;
};

export default function ExplanationScreen({ title, scoreLabel, questions, onClose }: ExplanationScreenProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const sheetRef = useRef<BottomSheet>(null);
  const [activeQuestion, setActiveQuestion] = useState<ExplanationQuestion | null>(null);

  // Mở BottomSheet và nạp dữ liệu câu hỏi hiện tại
  const openSheet = useCallback((question: ExplanationQuestion) => {
    setActiveQuestion(question);
    requestAnimationFrame(() => {
      sheetRef.current?.snapToIndex(0);
    });
  }, []);

  const closeSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>

        {/* 1. HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <XIcon size={24} color="#8E8E8E" />
          </Pressable>
        </View>

        {scoreLabel ? <Text style={styles.scoreLabel}>{scoreLabel}</Text> : null}

        {/* 2. DANH SÁCH CÂU HỎI (Review bài làm) */}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {questions.map((question) => (
            <View key={question.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <Text style={styles.indexPill}>{question.indexLabel}</Text>
              </View>

              <Text style={styles.questionText}>{question.question}</Text>

              <View style={styles.answersWrap}>
                {question.answers.map((answer, index) => {
                  const isCorrect = answer.state === 'correct';
                  const isIncorrect = answer.state === 'incorrect';

                  return (
                    <View
                      key={`${question.id}-${index}`}
                      style={[
                        styles.answerRow,
                        isCorrect ? styles.answerRowCorrect : null,
                        isIncorrect ? styles.answerRowIncorrect : null,
                      ]}
                    >
                      <View style={styles.iconContainer}>
                        {isCorrect && <CheckCircleIcon size={20} color="#56B42E" weight="fill" />}
                        {isIncorrect && <XCircleIcon size={20} color="#FF3B30" weight="fill" />}
                        {!isCorrect && !isIncorrect && <View style={styles.dot} />}
                      </View>
                      <Text style={[
                        styles.answerText,
                        isCorrect ? styles.answerTextCorrect : null,
                        isIncorrect ? styles.answerTextIncorrect : null
                      ]}>
                        {answer.label}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.cardFooter}>
                <TouchableOpacity style={styles.explainButton} onPress={() => openSheet(question)}>
                  <LightbulbIcon size={16} color="#4E9E38" weight="bold" />
                  <Text style={styles.explainButtonText}>Xem giải thích chi tiết</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* 3. BOTTOM SHEET GIẢI THÍCH */}
        <BottomSheet
          ref={sheetRef}
          index={-1}
          snapPoints={['70%']}
          enablePanDownToClose
          backdropComponent={(props) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.4} />}
          handleIndicatorStyle={styles.sheetIndicator}
          backgroundStyle={styles.sheetBackground}
          onClose={() => setActiveQuestion(null)}
        >
          <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
            {activeQuestion ? (
              <>
                <Text style={styles.sheetHeading}>{activeQuestion.indexLabel}</Text>
                <View style={styles.sheetDivider} />

                <View style={styles.sheetSection}>
                  <Text style={styles.sheetSectionLabel}>Đáp án chính xác</Text>
                  <View style={styles.correctChip}>
                    <Text style={styles.correctChipText}>{activeQuestion.explanation.correctLabel}</Text>
                  </View>
                </View>

                <View style={styles.sheetSection}>
                  <View style={styles.explanationHeader}>
                    <LightbulbIcon size={20} color="#4E9E38" weight="fill" />
                    <Text style={styles.sheetSectionLabel}>Phân tích & Giải thích</Text>
                  </View>
                  <Text style={styles.sheetBody}>
                    {activeQuestion.explanation.body || "Vui lòng xem lại nội dung bài nghe để nắm vững kiến thức."}
                  </Text>
                </View>

                {activeQuestion.explanation.translation && (
                  <View style={styles.translationBox}>
                    <Text style={styles.sheetTranslation}>Dịch nghĩa: {activeQuestion.explanation.translation}</Text>
                  </View>
                )}

                <Button title="Đã hiểu" onPress={closeSheet} style={styles.sheetButton} />
              </>
            ) : null}
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F3F5' },
  title: { fontFamily: FontFamily.lexendDecaBold, fontSize: 20, color: '#4E9E38' },
  closeButton: { padding: 4 },
  scoreLabel: { marginTop: 12, fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 15, color: colors.textPrimary },
  content: { paddingTop: 16 },
  card: { borderWidth: 1, borderColor: '#D9E0EA', borderRadius: 20, padding: 16, backgroundColor: '#FFFFFF', marginBottom: 16 },
  cardTopRow: { marginBottom: 10 },
  indexPill: { overflow: 'hidden', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#8EEA7C', fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 11, color: '#FFFFFF' },
  questionText: { fontFamily: FontFamily.lexendDecaBold, fontSize: 16, lineHeight: 22, color: colors.textPrimary },
  answersWrap: { gap: 8, marginTop: 14 },
  answerRow: { minHeight: 50, borderWidth: 1.5, borderColor: '#F1F3F5', borderRadius: 14, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F8FAFC' },
  answerRowCorrect: { borderColor: '#56B42E', backgroundColor: '#F0FFF0' },
  answerRowIncorrect: { borderColor: '#FF3B30', backgroundColor: '#FFF5F5' },
  iconContainer: { width: 22, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#CBD5E0' },
  answerText: { flex: 1, fontFamily: FontFamily.lexendDecaMedium, fontSize: 14, color: colors.textPrimary },
  answerTextCorrect: { color: '#2D6A12' },
  answerTextIncorrect: { color: '#B0120A' },
  cardFooter: { alignItems: 'flex-end', marginTop: 14 },
  explainButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#F0F7ED' },
  explainButtonText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 12, color: '#4E9E38' },
  sheetIndicator: { backgroundColor: '#D0D7E3' },
  sheetBackground: { borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  sheetContent: { paddingHorizontal: 24, paddingBottom: 40, gap: 20 },
  sheetHeading: { fontFamily: FontFamily.lexendDecaBold, fontSize: 20, color: '#4E9E38', textAlign: 'center' },
  sheetDivider: { height: 1, backgroundColor: '#EDF1F7', marginVertical: 4 },
  sheetSection: { gap: 8 },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sheetSectionLabel: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 15, color: '#6C7A96' },
  correctChip: { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#56B42E' },
  correctChipText: { fontFamily: FontFamily.lexendDecaBold, fontSize: 14, color: '#FFFFFF' },
  sheetBody: { fontFamily: FontFamily.lexendDecaRegular, fontSize: 15, lineHeight: 24, color: colors.textPrimary },
  translationBox: { padding: 14, backgroundColor: '#F0F4FF', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#0057D8' },
  sheetTranslation: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 14, color: '#0057D8' },
  sheetButton: { marginTop: 10, borderRadius: 20 },
});