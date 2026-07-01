import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Border, FontFamily, FontSize, Gap, Padding } from '../../../constants/GlobalStyles';
import IconButton from '../../IconButton';
import { XIcon } from 'phosphor-react-native';
import ProgressBar from '../../ProgressBar';
import { useTheme } from "@/contexts/ThemeContext";

type QuizHeaderProps = {
  current: number;
  total: number;
  incorrectCount: number;
  onClose?: () => void;
  timerLabel?: string;
  icon?: React.ReactNode;
  sharedTransitionTag?: string;
};

export default function QuizHeader({
  current,
  total,
  incorrectCount,
  onClose,
  timerLabel,
  icon,
  sharedTransitionTag
}: QuizHeaderProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const router = useRouter();
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>

        <View style={styles.leftGroup}>
          {sharedTransitionTag ? (
            <Animated.View sharedTransitionTag={sharedTransitionTag}>
              {icon}
            </Animated.View>
          ) : (
            icon
          )}
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

      <ProgressBar progress={total > 0 ? current / total : 0} height={10} style={{ marginBottom: Gap.gap_15 }} />
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_10,
    backgroundColor: colors.background,
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
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: Border.br_20,
  },
  progressText: {
    color: colors.background,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
  },
  incorrectPill: {
    backgroundColor: colors.red,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Border.br_20,
  },
  incorrectText: {
    color: colors.background,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
  },
  timerPill: {
    backgroundColor: colors.cam || '#FF6B00',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Border.br_20,
  },
  timerText: {
    color: colors.background,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
  },
  spacer: {
    flex: 1,
  },
});
