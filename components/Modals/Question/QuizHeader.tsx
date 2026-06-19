import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../../constants/GlobalStyles';
import IconButton from '../../IconButton';
import { XIcon } from 'phosphor-react-native';


type QuizHeaderProps = {
  current: number;
  total: number;
  incorrectCount: number;
  onClose?: () => void;
  timerLabel?: string;
  icon?: React.ReactNode;
};

export default function QuizHeader({
  current,
  total,
  incorrectCount,
  onClose,
  timerLabel,
  icon
}: QuizHeaderProps) {
  const router = useRouter();
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        
        <View style={styles.leftGroup}>
          {icon}
          <View style={styles.progressPill}>
            <Text style={styles.progressText}>{current}/{total}</Text>
          </View>
        </View>

        {timerLabel ? (
          <View style={styles.timerPill}>
            <Text style={styles.timerText}>{timerLabel}</Text>
          </View>
        ) : incorrectCount > 0 ? (
          <View style={styles.incorrectPill}>
            <Text style={styles.incorrectText}>Sai {incorrectCount} câu</Text>
          </View>
        ) : (
          <View style={styles.spacer} />
        )}

        <IconButton Icon={XIcon} onPress={onClose || (() => router.back())} />
      </View>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_10,
    backgroundColor: Color.bg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.gap_15,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_10,
  },
  progressPill: {
    backgroundColor: Color.main,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: Border.br_20,
  },
  progressText: {
    color: Color.bg,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
  },
  incorrectPill: {
    backgroundColor: Color.red,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Border.br_20,
  },
  incorrectText: {
    color: Color.bg,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
  },
  timerPill: {
    backgroundColor: Color.cam || '#FF6B00',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Border.br_20,
  },
  timerText: {
    color: Color.bg,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
  },
  spacer: {
    flex: 1,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: Color.stroke,
    borderRadius: 5,
    marginBottom: Gap.gap_15,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: Color.main,
    borderRadius: 5,
  },
});
