import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShootingStarIcon, LockKeyIcon, ListNumbersIcon, ClockIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Padding, Border } from '../../constants/GlobalStyles';
import Button from '../Button';

export interface Exam {
  id: string;
  title: string;
  edition: number;
  year: number;
  isUnlocked: boolean;
  isFeatured: boolean;
  questionCount?: number | { listening?: number; reading?: number; writing?: number; [key: string]: any };
  duration?: number | { listening?: number; reading?: number; writing?: number; [key: string]: any };
}

interface ExamCardProps {
  exam: Exam;
  onPress: () => void;
}

export default function ExamCard({ exam, onPress }: ExamCardProps) {
  // Tính tổng số câu hỏi nếu API trả về là một object {listening, reading, writing}
  let displayQuestionCount = exam.questionCount as number;
  if (typeof exam.questionCount === 'object' && exam.questionCount !== null) {
    displayQuestionCount = Object.values(exam.questionCount).reduce(
      (sum, val) => sum + (typeof val === 'number' ? val : 0),
      0
    ) as number;
  }

  // Tương tự, tính tổng thời gian nếu duration cũng là một object
  let displayDuration = exam.duration as number;
  if (typeof exam.duration === 'object' && exam.duration !== null) {
    displayDuration = Object.values(exam.duration).reduce(
      (sum, val) => sum + (typeof val === 'number' ? val : 0),
      0
    ) as number;
  }

  return (
    <View style={[styles.examCard, !exam.isUnlocked && styles.examCardLocked]}>
      {/* Watermark */}
      <Text style={styles.examWatermark}>{exam.edition}</Text>

      {/* Unlocked Label */}
      {exam.isUnlocked && (
        <View style={styles.examLabel}>
          <ShootingStarIcon size={16} color={Color.color} weight="fill" />
          <Text style={styles.examLabelText}>Đã mở khoá</Text>
        </View>
      )}

      {/* Locked Icon */}
      {!exam.isUnlocked && (
        <View style={styles.examLockIcon}>
          <LockKeyIcon size={24} color="#9CA3AF" weight="fill" />
        </View>
      )}

      <View style={styles.examContent}>
        <Text style={[
          styles.examTitle, 
          !exam.isUnlocked && { color: '#9CA3AF' },
          (displayQuestionCount || displayDuration) ? { marginBottom: 4 } : {} // Giảm margin nếu có hiển thị số câu/thời gian
        ]}>
          {exam.title}
        </Text>
        {(displayQuestionCount || displayDuration) ? (
          <View style={styles.statsRow}>
            {displayQuestionCount ? (
              <View style={styles.statItem}>
                <ListNumbersIcon size={14} color="#64748B" />
                <Text style={styles.statText}>{displayQuestionCount} câu</Text>
              </View>
            ) : null}
            {displayDuration ? (
              <View style={styles.statItem}>
                <ClockIcon size={14} color="#64748B" />
                <Text style={styles.statText}>{displayDuration} phút</Text>
              </View>
            ) : null}
          </View>
        ) : null}
        <Button 
          title="Luyện tập"
          variant={exam.isUnlocked ? "Green" : "Gray"}
          onPress={onPress}
          disabled={!exam.isUnlocked}
          style={{ height: 40, marginVertical: 0 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  examCard: { backgroundColor: Color.bg, borderRadius: Border.br_20, borderWidth: 1.5, borderColor: Color.stroke, padding: Padding.padding_15, position: 'relative', overflow: 'hidden', justifyContent: 'space-between', minHeight: 150 },
  examCardLocked: { backgroundColor: '#F8FAFC' },
  examWatermark: { position: 'absolute', right: -10, top: -20, fontFamily: FontFamily.lexendDecaBold, fontSize: 120, color: Color.stroke, opacity: 0.8 },
  examLabel: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: Color.main, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  examLabelText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 10, color: Color.text },
  examLockIcon: { alignSelf: 'flex-start', padding: 4, marginBottom: 8 },
  examContent: { zIndex: 1 },
  examTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text, marginBottom: 12 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: '#64748B' },
});