import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XIcon } from 'phosphor-react-native';

import Button from '@/components/Button';
import { Border, Color, FontFamily, FontSize } from '@/constants/GlobalStyles';

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
    note?: string;
  };
};

type ExplanationScreenProps = {
  title: string;
  scoreLabel: string;
  questions: ExplanationQuestion[];
  onClose: () => void;
  onViewResult: () => void;
};

export default function ExplanationScreen({ title, scoreLabel, questions, onClose, onViewResult }: ExplanationScreenProps) {
  const sheetRef = React.useRef<BottomSheet>(null);
  const [activeQuestion, setActiveQuestion] = React.useState<ExplanationQuestion | null>(null);

  const openSheet = React.useCallback((question: ExplanationQuestion) => {
    setActiveQuestion(question);
    requestAnimationFrame(() => {
      sheetRef.current?.snapToIndex(0);
    });
  }, []);

  const closeSheet = React.useCallback(() => {
    sheetRef.current?.close();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <XIcon size={24} color="#8E8E8E" />
          </Pressable>
        </View>

        <Text style={styles.scoreLabel}>{scoreLabel}</Text>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {questions.map((question) => (
            <View key={question.id} style={styles.card}>
              <Text style={styles.indexPill}>{question.indexLabel}</Text>
              <Text style={styles.questionText}>{question.question}</Text>

              <View style={styles.answersWrap}>
                {question.answers.map((answer, index) => (
                  <View
                    key={`${question.id}-${index}`}
                    style={[
                      styles.answerRow,
                      answer.state === 'correct' ? styles.answerRowCorrect : null,
                      answer.state === 'incorrect' ? styles.answerRowIncorrect : null,
                    ]}
                  >
                    {answer.state !== 'default' ? (
                      <Text
                        style={[
                          styles.answerIcon,
                          answer.state === 'correct' ? styles.answerIconCorrect : styles.answerIconIncorrect,
                        ]}
                      >
                        {answer.state === 'correct' ? 'v' : 'x'}
                      </Text>
                    ) : null}
                    <Text style={[styles.answerText, answer.state === 'correct' ? styles.answerTextCorrect : null]}>
                      {answer.label}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.cardFooter}>
                <Pressable style={styles.explainButton} onPress={() => openSheet(question)}>
                  <Text style={styles.explainButtonText}>Xem giải thích</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Xem kết quả tổng hợp" variant="Orange" onPress={onViewResult} style={styles.footerButton} />
        </View>

        <BottomSheet
          ref={sheetRef}
          index={-1}
          snapPoints={['72%']}
          enablePanDownToClose
          backdropComponent={(props) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.3} />}
          handleIndicatorStyle={styles.sheetIndicator}
          backgroundStyle={styles.sheetBackground}
          onClose={() => setActiveQuestion(null)}
        >
          <BottomSheetScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            {activeQuestion ? (
              <>
                <Text style={styles.sheetHeading}>{activeQuestion.indexLabel}</Text>
                <View style={styles.sheetDivider} />
                <Text style={styles.sheetTitle}>{activeQuestion.explanation.title}</Text>

                <View style={styles.sheetSection}>
                  <Text style={styles.sheetSectionLabel}>Đáp án đúng</Text>
                  <View style={styles.correctChip}>
                    <Text style={styles.correctChipText}>{activeQuestion.explanation.correctLabel}</Text>
                  </View>
                </View>

                <View style={styles.sheetSection}>
                  <Text style={styles.sheetSectionLabel}>Giải thích</Text>
                  <Text style={styles.sheetBody}>{activeQuestion.explanation.body}</Text>
                  {activeQuestion.explanation.translation ? <Text style={styles.sheetTranslation}>Dich: {activeQuestion.explanation.translation}</Text> : null}
                  {activeQuestion.explanation.note ? <Text style={styles.sheetNote}>{activeQuestion.explanation.note}</Text> : null}
                </View>

                <Button title="Đóng" onPress={closeSheet} style={styles.sheetButton} />
              </>
            ) : null}
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: FontFamily.lexendDecaBold, fontSize: 22, color: '#4E9E38' },
  closeButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  scoreLabel: { marginTop: 18, fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text },
  content: { paddingTop: 18, paddingBottom: 116, gap: 16 },
  card: { borderWidth: 1, borderColor: '#D9E0EA', borderRadius: 26, padding: 14, backgroundColor: '#FFFFFF' },
  indexPill: { alignSelf: 'flex-start', overflow: 'hidden', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 4, backgroundColor: '#8EEA7C', fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_12, color: '#FFFFFF', marginBottom: 12 },
  questionText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_16, lineHeight: 24, color: Color.text },
  answersWrap: { gap: 12, marginTop: 16 },
  answerRow: { minHeight: 58, borderWidth: 1.5, borderColor: '#CFD7E3', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  answerRowCorrect: { borderColor: '#56B42E' },
  answerRowIncorrect: { borderColor: '#FF3B30' },
  answerIcon: { fontFamily: FontFamily.lexendDecaBold, fontSize: 18 },
  answerIconCorrect: { color: '#56B42E' },
  answerIconIncorrect: { color: '#FF3B30' },
  answerText: { flex: 1, fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, lineHeight: 22, color: Color.text },
  answerTextCorrect: { color: '#4E9E38' },
  cardFooter: { alignItems: 'flex-end', marginTop: 14 },
  explainButton: { minHeight: 34, borderWidth: 1, borderColor: '#C9D2E1', borderRadius: 12, paddingHorizontal: 10, justifyContent: 'center' },
  explainButtonText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: '#4E9E38' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 8, paddingTop: 10, paddingBottom: 12, backgroundColor: 'rgba(255,255,255,0.96)' },
  footerButton: { marginVertical: 0, borderRadius: Border.br_30 },
  sheetIndicator: { backgroundColor: '#D0D7E3' },
  sheetBackground: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  sheetContent: { paddingHorizontal: 20, paddingBottom: 30, gap: 14 },
  sheetHeading: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_20, color: '#4E9E38' },
  sheetDivider: { height: 1, backgroundColor: '#D9E0EA' },
  sheetTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 18, lineHeight: 30, color: Color.text },
  sheetSection: { gap: 10 },
  sheetSectionLabel: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: '#6C7A96' },
  correctChip: { alignSelf: 'flex-start', borderRadius: 12, borderWidth: 1, borderColor: '#A7D47A', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F7FFF2' },
  correctChipText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14, color: '#4E9E38' },
  sheetBody: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, lineHeight: 24, color: Color.text },
  sheetTranslation: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14, lineHeight: 23, color: '#0057D8' },
  sheetNote: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, lineHeight: 22, color: '#3A3A3A' },
  sheetButton: { marginTop: 10, marginVertical: 0, borderRadius: Border.br_30 },
});
