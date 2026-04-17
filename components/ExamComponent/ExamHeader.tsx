import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ClockIcon, ListChecksIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Padding, Border, Gap } from '../../constants/GlobalStyles';
import CloseButton from '../CloseButton';

interface ExamHeaderProps {
  onClose: () => void;
  onSubmit: () => void;
  timeLeft: number;
  remainingQuestions: number;
  onOpenQuestionList?: () => void;
}

export default function ExamHeader({ onClose, onSubmit, timeLeft, remainingQuestions, onOpenQuestionList }: ExamHeaderProps) {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <View style={styles.header}>
      {/* Left: Close Button */}
      <View style={styles.sideContainer}>
        <CloseButton variant="Stroke" onPress={onClose} />
      </View>

      {/* Center: Statuses */}
      <View style={styles.centerContainer}>
        <TouchableOpacity style={styles.statusPill} onPress={onOpenQuestionList} activeOpacity={0.7}>
          <ListChecksIcon size={18} color={Color.text} weight="bold" />
          <Text style={styles.statusText}>còn {remainingQuestions} câu</Text>
        </TouchableOpacity>
        <View style={styles.statusPill}>
          <ClockIcon size={18} color={Color.cam} weight="fill" />
          <Text style={styles.statusText}>{minutes}:{seconds}</Text>
        </View>
      </View>

      {/* Right: Submit Button */}
      <View style={[styles.sideContainer, { alignItems: 'flex-end' }]}>
        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
          <Text style={styles.submitText}>Nộp bài</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.padding_15,
    paddingVertical: Padding.padding_10,
    backgroundColor: Color.bg,
    borderBottomWidth: 1,
    borderBottomColor: Color.stroke,
  },
  sideContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Gap.gap_10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.stroke,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Border.br_20,
    gap: Gap.gap_5,
  },
  statusText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.text },
  submitButton: { backgroundColor: Color.main, paddingHorizontal: Padding.padding_15, paddingVertical: 8, borderRadius: Border.br_20 },
  submitText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.color },
});