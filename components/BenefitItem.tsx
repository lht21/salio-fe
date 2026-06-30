import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircleIcon } from 'phosphor-react-native';
import { FontFamily, FontSize, Gap } from '../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

interface BenefitItemProps {
  text: string;
}

export default function BenefitItem({ text }: BenefitItemProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <CheckCircleIcon size={24} weight="fill" color={colors.color} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
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
        color: colors.text, 
        flex: 1,
      },
    });