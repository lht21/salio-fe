import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CaretDownIcon, CornersOutIcon } from 'phosphor-react-native';
import { LinearTransition } from 'react-native-reanimated';
import { MotiView, AnimatePresence } from 'moti';

import MultipleChoiceOption, { MultipleChoiceOptionState } from './MultipleChoiceOption';
import { FontFamily, FontSize, Gap, Color } from '../../../constants/GlobalStyles';
import ProgressBar from '../../ProgressBar';

type ChoiceOption = {
  id: string;
  label: string;
  state?: MultipleChoiceOptionState;
};

type MultipleChoiceQuestionCardProps = {
  progressLabel: string;
  progress: number;
  question: string;
  options: ChoiceOption[];
  expanded?: boolean;
  onToggleExpand: () => void;
  onPressExpand?: () => void;
  onSelectOption: (id: string) => void;
  footer?: React.ReactNode;
};

const MultipleChoiceQuestionCard = ({
  progressLabel,
  progress,
  question,
  options,
  expanded = true,
  onToggleExpand,
  onPressExpand,
  onSelectOption,
  footer,
}: MultipleChoiceQuestionCardProps) => {
  return (
    <MotiView layout={LinearTransition.springify().damping(20).stiffness(200)} style={styles.container}>
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

      <ProgressBar
        progress={progress}
        height={8}
        color={Color.main}
        backgroundColor="#71809B"
      />

      <AnimatePresence>
        {expanded && (
          <MotiView 
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            style={styles.body}
          >
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
          </MotiView>
        )}
      </AnimatePresence>
    </MotiView>
  );
};

export default memo(MultipleChoiceQuestionCard);

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
    backgroundColor: Color.main,
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
