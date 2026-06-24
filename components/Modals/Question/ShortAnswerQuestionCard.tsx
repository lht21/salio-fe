import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CaretDownIcon, CheckIcon, XIcon } from 'phosphor-react-native';
import { LinearTransition } from 'react-native-reanimated';
import { MotiView, AnimatePresence } from 'moti';

import { Color, FontFamily, FontSize, Gap } from '../../../constants/GlobalStyles';
import Button from '../../Button';
import ProgressBar from '../../ProgressBar';

type ShortAnswerQuestionCardProps = {
  progressLabel: string;
  progress: number;
  question: string;
  value: string;
  expanded?: boolean;
  answerState?: 'default' | 'correct' | 'incorrect';
  placeholder?: string;
  helperText?: string;
  submitLabel?: string;
  onToggleExpand: () => void;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

const ShortAnswerQuestionCard = ({
  progressLabel,
  progress,
  question,
  value,
  expanded = true,
  answerState = 'default',
  placeholder = 'Nhập kết quả của bạn',
  helperText,
  submitLabel = 'Kiểm tra',
  onToggleExpand,
  onChangeText,
  onSubmit,
  disabled = false,
}: ShortAnswerQuestionCardProps) => {
  return (
    <MotiView layout={LinearTransition.springify().damping(20).stiffness(200)} style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.progressPill}>{progressLabel}</Text>

        <Pressable style={styles.iconButton} onPress={onToggleExpand}>
          <CaretDownIcon
            size={20}
            color="#71809B"
            weight="bold"
            style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
          />
        </Pressable>
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

            <TextInput
              multiline
              value={value}
              editable={!disabled}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#8E9AAF"
              textAlignVertical="top"
              style={[
                styles.input,
                answerState === 'correct' ? styles.inputCorrect : null,
                answerState === 'incorrect' ? styles.inputIncorrect : null,
              ]}
            />

            {helperText ? (
              <View style={[styles.helperWrap, answerState === 'correct' ? styles.helperWrapCorrect : styles.helperWrapIncorrect]}>
                {answerState === 'correct' ? (
                  <CheckIcon size={16} color="#4CAF28" weight="bold" />
                ) : (
                  <XIcon size={16} color="#FF4B4B" weight="bold" />
                )}
                <Text style={[styles.helperText, answerState === 'correct' ? styles.helperTextCorrect : styles.helperTextIncorrect]}>
                  {helperText}
                </Text>
              </View>
            ) : null}

            <Button
              title={submitLabel}
              onPress={onSubmit}
              disabled={disabled}
              style={{ marginVertical: 0 }}
            />
          </MotiView>
        )}
      </AnimatePresence>
    </MotiView>
  );
};

export default memo(ShortAnswerQuestionCard);

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
    color: Color.text,
  },
  input: {
    minHeight: 92,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Color.brown500,
    backgroundColor: Color.brown50,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    lineHeight: 22,
    color: Color.brown500,
  },
  inputCorrect: {
    borderColor: '#4CAF28',
    backgroundColor: '#F5FFF1',
  },
  inputIncorrect: {
    borderColor: '#FF4B4B',
    backgroundColor: '#FFF7F7',
  },
  helperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  helperWrapCorrect: {
    backgroundColor: '#F2FCEB',
  },
  helperWrapIncorrect: {
    backgroundColor: '#FFF2F2',
  },
  helperText: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    lineHeight: 18,
  },
  helperTextCorrect: {
    color: '#338E23',
  },
  helperTextIncorrect: {
    color: '#D93030',
  },
});
