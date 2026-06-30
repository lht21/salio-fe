import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { FontFamily, FontSize } from '../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

interface SectionHeaderProps {
  title: string;
  style?: StyleProp<TextStyle>;
}

const SectionHeader = ({ title, style }: SectionHeaderProps) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

return (
  <Text style={[styles.sectionHeader, style]}>{title}</Text>
);
};

const getStyles = (colors: any) => StyleSheet.create({
      sectionHeader: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_14 || 14,
        color: colors.gray || '#64748B',
        marginTop: 24,
        marginBottom: 12,
      },
    });

export default SectionHeader;