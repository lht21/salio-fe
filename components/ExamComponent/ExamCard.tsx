import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShootingStarIcon, LockKeyIcon, ListNumbersIcon, ClockIcon, CrownIcon } from 'phosphor-react-native';
import { FontFamily, FontSize, Padding, Border } from '../../constants/GlobalStyles';
import Button from '../Button';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS
} from 'react-native-reanimated';
import { useTheme } from "@/contexts/ThemeContext";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export interface Exam {
  id: string;
  title: string;
  edition: number;
  year: number;
  isUnlocked: boolean;
  isFeatured: boolean;
  questionCount?: number | { listening?: number; reading?: number; writing?: number;[key: string]: any };
  duration?: number | { listening?: number; reading?: number; writing?: number;[key: string]: any };
}

interface ExamCardProps {
  exam: Exam;
  onPress: () => void;
}

export default function ExamCard({ exam, onPress }: ExamCardProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

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

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (!exam.isUnlocked) {
      // Chạy hiệu ứng scale xuống 0.95 rồi nảy lại 1
      scale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1, { duration: 100 }, (finished) => {
          if (finished) {
            runOnJS(onPress)();
          }
        })
      );
    } else {
      onPress();
    }
  };

  return (
    <AnimatedTouchableOpacity activeOpacity={0.8} onPress={handlePress} style={[styles.examCard, !exam.isUnlocked && styles.examCardLocked, animatedStyle]}>


      {/* Background Icon Watermark */}
      <View style={[styles.iconWatermark, { opacity: !exam.isUnlocked ? 0.1 : 0.2 }]}>
        {!exam.isUnlocked ? (
          <CrownIcon size={120} color="#64748B" weight="fill" />
        ) : (
          <ShootingStarIcon size={120} color={colors.primary} weight="fill" />
        )}
      </View>

      {/* Unlocked Label */}
      {exam.isUnlocked && (
        <View style={styles.examLabel}>
          <ShootingStarIcon size={12} color={colors.main500} weight="fill" />
          <Text style={styles.examLabelText}>Đã mở khoá</Text>
        </View>
      )}

      {/* Locked Icon */}
      {!exam.isUnlocked && (
        <View style={styles.examLabelLocked}>
          <LockKeyIcon size={12} color="#64748B" weight="fill" />
          <Text style={styles.examLabelLockedText}>Premium</Text>
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
          title={exam.isUnlocked ? "Luyện tập" : "Mở khoá"}
          variant={exam.isUnlocked ? "Green" : "Gray"}
          onPress={handlePress}
          style={{ height: 40, marginVertical: 0, alignSelf: 'flex-end' }}
        />
      </View>
    </AnimatedTouchableOpacity>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  examCard: { backgroundColor: colors.background, borderRadius: Border.br_30, borderWidth: 1.5, borderColor: colors.borderDefault, padding: Padding.padding_20, position: 'relative', overflow: 'hidden', justifyContent: 'space-between', minHeight: 150 },
  examCardLocked: { backgroundColor: '#F8FAFC' },
  examWatermark: { position: 'absolute', right: -10, top: -20, fontFamily: FontFamily.lexendDecaBold, fontSize: 120, color: colors.borderDefault, opacity: 0.8 },
  iconWatermark: { position: 'absolute', right: -15, bottom: -15, transform: [{ rotate: '-15deg' }], zIndex: 0 },
  examLabel: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: colors.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  examLabelText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 10, color: colors.textPrimary },
  examLabelLocked: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: '#E2E8F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 8 },
  examLabelLockedText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 10, color: '#64748B' },
  examContent: { zIndex: 1 },
  examTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_18, color: colors.textPrimary, marginBottom: 12 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: '#64748B' },
});