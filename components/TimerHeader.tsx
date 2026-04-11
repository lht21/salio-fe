import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ClockIcon, PaperPlaneRightIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Padding, Border, Gap } from '../constants/GlobalStyles';
import CloseButton from './CloseButton';

interface TimerHeaderProps {
  timeLeft: number;
  isStarted: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function TimerHeader({ timeLeft, isStarted, onClose, onSubmit }: TimerHeaderProps) {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        <CloseButton variant="Stroke" onPress={onClose} />
      </View>

      <View style={styles.timerPill}>
        <ClockIcon size={18} color={Color.cam} weight="fill" />
        <Text style={styles.timerText}>{minutes}:{seconds}</Text>
      </View>

      <View style={[styles.headerSide, { alignItems: 'flex-end' }]}>
        {isStarted && (
          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.submitText}>Nộp bài</Text>
            <PaperPlaneRightIcon size={16} color={Color.color} weight="fill" />
          </TouchableOpacity>
        )}
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
    paddingTop: Padding.padding_10,
    paddingBottom: Padding.padding_15,
  },
  headerSide: { flex: 1 },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.bg,
    paddingHorizontal: Padding.padding_5,
    paddingVertical: 6,
    paddingRight: 10,
    borderRadius: Border.br_20,
    gap: Gap.gap_8,
    borderColor: Color.cam,
    borderWidth: 1,
  },
  timerText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.main,
    paddingHorizontal: Padding.padding_15,
    paddingVertical: 8,
    borderRadius: Border.br_20,
    gap: 4,
  },
  submitText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: Color.color,
  },
});