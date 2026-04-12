import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import CloseButton from '../../CloseButton';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../../constants/GlobalStyles';

type QuizHeaderProps = {
  current: number;
  total: number;
  incorrectCount: number;
  onClose?: () => void;
};

export default function QuizHeader({ current, total, incorrectCount, onClose }: QuizHeaderProps) {
  const router = useRouter();
  const progress = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>{current}/{total}</Text>
        </View>

        {incorrectCount > 0 ? (
          <View style={styles.incorrectPill}>
            <Text style={styles.incorrectText}>Sai {incorrectCount} câu</Text>
          </View>
        ) : (
          <View style={styles.spacer} />
        )}

        <CloseButton variant="Stroke" onPress={onClose || (() => router.back())} />
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
  spacer: {
    flex: 1,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Color.stroke,
    borderRadius: 4,
    marginBottom: Gap.gap_15,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: Color.main,
    borderRadius: 4,
  },
});
