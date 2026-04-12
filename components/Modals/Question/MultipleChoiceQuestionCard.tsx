import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { CaretDownIcon, CornersOutIcon } from 'phosphor-react-native';

import MultipleChoiceOption, { MultipleChoiceOptionState } from './MultipleChoiceOption';
import { FontFamily, FontSize, Gap } from '../../../constants/GlobalStyles';

type ChoiceOption = {
  id: string;
  label: string;
  state?: MultipleChoiceOptionState;
};

type MultipleChoiceQuestionCardProps = {
  progressLabel: string;
  progress: number;
  animatedProgress?: Animated.Value;
  question: string;
  options: ChoiceOption[];
  expanded?: boolean;
  onToggleExpand: () => void;
  onPressExpand?: () => void;
  onSelectOption: (id: string) => void;
  footer?: React.ReactNode;
};

export default function MultipleChoiceQuestionCard({
  progressLabel,
  progress,
  animatedProgress,
  question,
  options,
  expanded = true,
  onToggleExpand,
  onPressExpand,
  onSelectOption,
  footer,
}: MultipleChoiceQuestionCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.progressPill}>{progressLabel}</Text>

        <View style={styles.actions}>
          {onPressExpand ? (
            <Pressable style={styles.iconButton} onPress={onPressExpand}>
              <CornersOutIcon size={18} color="#71809B" weight="bold" />
            </Pressable>
          ) : null}

          <Pressable style={styles.iconButton} onPress={onToggleExpand}>
            <CaretDownIcon
              size={20}
              color="#71809B"
              weight="bold"
              style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: animatedProgress
                ? animatedProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  })
                : `${Math.max(0, Math.min(progress, 1)) * 100}%`,
            },
          ]}
        />
      </View>

      {expanded ? (
        <View style={styles.body}>
          <Text style={styles.question}>{question}</Text>

          <View style={styles.optionsWrap}>
            {options.map((option) => (
              <MultipleChoiceOption
                key={option.id}
                label={option.label}
                state={option.state}
                onPress={() => onSelectOption(option.id)}
              />
            ))}
          </View>

          {footer}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#FFFFFF',
    padding: 14,
    gap: Gap.gap_14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressPill: {
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: '#8EEA7C',
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#71809B',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#8EEA7C',
  },
  body: {
    gap: Gap.gap_14,
  },
  question: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    lineHeight: 26,
    color: '#2D3345',
  },
  optionsWrap: {
    gap: 12,
  },
});
