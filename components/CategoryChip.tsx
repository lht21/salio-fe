import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Color, FontFamily, FontSize, Border } from '../constants/GlobalStyles';

interface CategoryChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const CategoryChip = ({ label, isActive, onPress }: CategoryChipProps) => {
  return (
    <TouchableOpacity
      style={[styles.chip, isActive && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Border.br_20 || 20,
    borderWidth: 1,
    borderColor: Color.stroke || '#E2E8F0',
    backgroundColor: Color.bg || '#FFFFFF',
  },
  chipActive: {
    backgroundColor: Color.text,
    borderColor: Color.text,
  },
  chipText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: Color.text || '#000000',
  },
  chipTextActive: {
    color: Color.bg || '#FFFFFF',
  },
});

export default CategoryChip;