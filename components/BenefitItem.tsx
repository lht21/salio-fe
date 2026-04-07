import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircleIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Gap } from '../constants/GlobalStyles';

interface BenefitItemProps {
  text: string;
}

export default function BenefitItem({ text }: BenefitItemProps) {
  return (
    <View style={styles.container}>
      <CheckCircleIcon size={24} weight="fill" color={Color.color} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_10,
    marginBottom: 12,
  },
  text: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    // Tuỳ thuộc hình nền của bạn tối hay sáng, có thể đổi Color.bg hoặc Color.text
    color: Color.text, 
    flex: 1,
  },
});