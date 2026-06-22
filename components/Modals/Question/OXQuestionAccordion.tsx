import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CaretDownIcon, CornersOutIcon } from 'phosphor-react-native';
import { LinearTransition } from 'react-native-reanimated';
import { MotiView, AnimatePresence } from 'moti';

import { Border, Color, FontFamily, FontSize, Gap } from '../../../constants/GlobalStyles';
import ProgressBar from '../../ProgressBar';

type OXChoice = 'O' | 'X';
type AnswerState = 'default' | 'correct' | 'incorrect';

type OXQuestionAccordionProps = {
  progressLabel: string;
  progress: number;
  question: string;
  expanded?: boolean;
  selectedValue?: OXChoice;
  answerState?: Partial<Record<OXChoice, AnswerState>>;
  trueLabel?: string;
  falseLabel?: string;
  onToggleExpand: () => void;
  onPressExpand?: () => void;
  onSelect: (value: OXChoice) => void;
  footer?: React.ReactNode;
};

const OXQuestionAccordion = ({
  progressLabel,
  progress,
  question,
  expanded = true,
  selectedValue,
  answerState,
  trueLabel = 'O',
  falseLabel = 'X',
  onToggleExpand,
  onPressExpand,
  onSelect,
  footer,
}: OXQuestionAccordionProps) => {
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

            <OXAnswerButton
              label={trueLabel}
              selected={selectedValue === 'O'}
              state={answerState?.O ?? 'default'}
              onPress={() => onSelect('O')}
            />
            <OXAnswerButton
              label={falseLabel}
              selected={selectedValue === 'X'}
              state={answerState?.X ?? 'default'}
              onPress={() => onSelect('X')}
            />

            {footer}
          </MotiView>
        )}
      </AnimatePresence>
    </MotiView>
  );
};

export default memo(OXQuestionAccordion);

function OXAnswerButton({
  label,
  selected,
  state,
  onPress,
}: {
  label: string;
  selected: boolean;
  state: AnswerState;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.answerButton,
        selected ? styles.answerButtonSelected : null,
        state === 'correct' ? styles.answerButtonCorrect : null,
        state === 'incorrect' ? styles.answerButtonIncorrect : null,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.answerText,
          state === 'correct' ? styles.answerTextCorrect : null,
          state === 'incorrect' ? styles.answerTextIncorrect : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#FFFFFF',
    padding: 14,
    gap: Gap.gap_14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 15,
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
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    lineHeight: 26,
    color: Color.text,
  },
  answerButton: {
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#C9D2E1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  answerButtonSelected: {
    borderColor: '#94A7C5',
    backgroundColor: '#F6F9FE',
  },
  answerButtonCorrect: {
    borderColor: '#4CAF28',
    borderStyle: 'dashed',
  },
  answerButtonIncorrect: {
    borderColor: '#FF4B4B',
  },
  answerText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  answerTextCorrect: {
    color: '#3C9A24',
  },
  answerTextIncorrect: {
    color: '#E03131',
  },
});
