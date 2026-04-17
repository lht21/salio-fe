import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { Color, FontFamily, FontSize } from '../constants/GlobalStyles';

interface SectionHeaderProps {
  title: string;
  style?: StyleProp<TextStyle>;
}

const SectionHeader = ({ title, style }: SectionHeaderProps) => (
  <Text style={[styles.sectionHeader, style]}>{title}</Text>
);

const styles = StyleSheet.create({
  sectionHeader: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14 || 14,
    color: Color.gray || '#64748B',
    marginTop: 24,
    marginBottom: 12,
  },
});

export default SectionHeader;