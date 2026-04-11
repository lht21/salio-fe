import React from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CaretDownIcon, CheckIcon, XIcon } from 'phosphor-react-native';

import { Color, FontFamily, FontSize, Gap } from '../../../constants/GlobalStyles';

type ShortAnswerQuestionCardProps = {
  progressLabel: string;
  progress: number;
  animatedProgress?: Animated.Value;
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

export default function ShortAnswerQuestionCard({
  progressLabel,
  progress,
  animatedProgress,
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
}: ShortAnswerQuestionCardProps) {
  return (
    <View style={styles.container}>
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

          <Pressable style={[styles.submitButton, disabled ? styles.submitButtonDisabled : null]} onPress={onSubmit} disabled={disabled}>
            <Text style={styles.submitButtonText}>{submitLabel}</Text>
          </Pressable>
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
    color: Color.text,
  },
  input: {
    minHeight: 92,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#94A7C5',
    backgroundColor: '#C9D2E1',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    lineHeight: 22,
    color: Color.text,
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
  submitButton: {
    minHeight: 46,
    borderRadius: 999,
    backgroundColor: '#8EEA7C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.55,
  },
  submitButtonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: '#1D4D23',
  },
});
