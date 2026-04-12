import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CheckIcon, XIcon } from 'phosphor-react-native';

import { Border, Color, FontFamily, FontSize } from '../../../constants/GlobalStyles';

export type MultipleChoiceOptionState = 'default' | 'selected' | 'correct' | 'incorrect';

type MultipleChoiceOptionProps = {
  label: string;
  state?: MultipleChoiceOptionState;
  onPress?: () => void;
};

export default function MultipleChoiceOption({
  label,
  state = 'default',
  onPress,
}: MultipleChoiceOptionProps) {
  const showCorrect = state === 'correct';
  const showIncorrect = state === 'incorrect';

  return (
    <Pressable
      style={[
        styles.option,
        state === 'selected' ? styles.optionSelected : null,
        state === 'correct' ? styles.optionCorrect : null,
        state === 'incorrect' ? styles.optionIncorrect : null,
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {(showCorrect || showIncorrect) ? (
          <View style={[styles.iconWrap, showCorrect ? styles.iconWrapCorrect : styles.iconWrapIncorrect]}>
            {showCorrect ? (
              <CheckIcon size={16} color="#4CAF28" weight="bold" />
            ) : (
              <XIcon size={16} color="#FF4B4B" weight="bold" />
            )}
          </View>
        ) : null}

        <Text
          style={[
            styles.optionText,
            state === 'correct' ? styles.optionTextCorrect : null,
            state === 'incorrect' ? styles.optionTextIncorrect : null,
          ]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#C9D2E1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionSelected: {
    backgroundColor: '#F4F7FD',
    borderColor: '#94A7C5',
  },
  optionCorrect: {
    borderColor: '#4CAF28',
    borderStyle: 'dashed',
    backgroundColor: '#FBFFF8',
  },
  optionIncorrect: {
    borderColor: '#FF4B4B',
    backgroundColor: '#FFF9F9',
  },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconWrapCorrect: {
    backgroundColor: '#EEFBE8',
  },
  iconWrapIncorrect: {
    backgroundColor: '#FFF0F0',
  },
  optionText: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    lineHeight: 22,
    color: Color.text,
  },
  optionTextCorrect: {
    color: '#3C9A24',
  },
  optionTextIncorrect: {
    color: '#E03131',
  },
});
