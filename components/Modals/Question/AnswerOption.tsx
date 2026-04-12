import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CheckCircleIcon, XCircleIcon } from 'phosphor-react-native';
import type { ViewStyle, TextStyle } from 'react-native';

import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../../constants/GlobalStyles';

export type OptionStatus = 'default' | 'correct' | 'incorrect' | 'missed-correct' | 'disabled';

type AnswerOptionProps = {
  index: number;
  text: string;
  status: OptionStatus;
  onPress: () => void;
};

export default function AnswerOption({ index, text, status, onPress }: AnswerOptionProps) {
  let containerStyle: ViewStyle = styles.containerDefault;
  let textStyle: TextStyle = styles.textDefault;
  let numberBg: ViewStyle = styles.numberBgDefault;

  if (status === 'correct') {
    containerStyle = styles.containerCorrect;
    textStyle = styles.textCorrect;
  } else if (status === 'incorrect') {
    containerStyle = styles.containerIncorrect;
    textStyle = styles.textIncorrect;
  } else if (status === 'missed-correct') {
    containerStyle = styles.containerMissedCorrect;
    textStyle = styles.textCorrect;
  } else if (status === 'disabled') {
    containerStyle = styles.containerDisabled;
  }

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      disabled={status !== 'default'}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        {status === 'correct' ? (
          <CheckCircleIcon size={28} color={Color.color} weight="fill" />
        ) : status === 'incorrect' ? (
          <XCircleIcon size={28} color={Color.red} weight="fill" />
        ) : (
          <View style={[styles.numberPill, numberBg]}>
            <Text style={styles.numberText}>{index + 1}</Text>
          </View>
        )}
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Padding.padding_15,
    borderRadius: Border.br_20,
    borderWidth: 2,
    borderStyle: 'solid',
    marginVertical: Gap.gap_8,
    backgroundColor: Color.bg,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_15,
  },
  numberPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Color.stroke,
  },
  numberBgDefault: {
    backgroundColor: Color.bg,
  },
  numberText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14,
    color: Color.gray,
  },
  text: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
  },
  containerDefault: {
    borderColor: Color.stroke,
    borderStyle: 'solid',
  },
  textDefault: {
    color: Color.text,
  },
  containerCorrect: {
    borderColor: Color.green,
    borderStyle: 'solid',
    backgroundColor: Color.greenLight,
  },
  textCorrect: {
    color: Color.green,
    fontFamily: FontFamily.lexendDecaBold,
  },
  containerIncorrect: {
    borderColor: Color.red,
    borderStyle: 'solid',
    backgroundColor: Color.bg,
  },
  textIncorrect: {
    color: Color.red,
    fontFamily: FontFamily.lexendDecaBold,
  },
  containerMissedCorrect: {
    borderColor: Color.green,
    borderStyle: 'dashed',
    backgroundColor: Color.bg,
  },
  containerDisabled: {
    borderColor: Color.stroke,
    borderStyle: 'solid',
    opacity: 0.5,
  },
});
