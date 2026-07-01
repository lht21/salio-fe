import React, { useMemo } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontFamily, FontSize, Border } from '../constants/GlobalStyles';
import { useTheme } from '../contexts/ThemeContext';

interface CategoryChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  activeBgColor?: string;
  activeTextColor?: string;
  activeBorderColor?: string;
}

const CategoryChip = ({ label, isActive, onPress, activeBgColor, activeTextColor, activeBorderColor }: CategoryChipProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isActive && styles.chipActive,
        isActive && activeBgColor ? { backgroundColor: activeBgColor } : null,
        isActive && activeBorderColor ? { borderColor: activeBorderColor } : null,
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.chipText,
        isActive && styles.chipTextActive,
        isActive && activeTextColor ? { color: activeTextColor } : null,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: Border.br_20 || 20,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.background,
  },
  chipActive: {
    backgroundColor: colors.chipActiveBg,
    borderColor: colors.chipActiveBg,
  },
  chipText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: colors.chipActiveText,
  },
});

export default CategoryChip;