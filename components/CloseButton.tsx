import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { XIcon } from 'phosphor-react-native';
import { useTheme } from '../contexts/ThemeContext';

export type CloseBtnVariant = 'Yellow' | 'Stroke' | 'Main';

interface CloseButtonProps {
  variant?: CloseBtnVariant;
  onPress: () => void;
  style?: ViewStyle;
}

export default function CloseButton({ variant = 'Stroke', onPress, style }: CloseButtonProps) {
  const { colors } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'Yellow':
        return { bg: colors.vang, icon: colors.color };
      case 'Main':
        return { bg: colors.main, icon: colors.color };
      case 'Stroke':
      default:
        return { bg: colors.stroke, icon: colors.gray };
    }
  };

  const variantColors = getColors();

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: variantColors.bg }, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <XIcon size={18} color={variantColors.icon} weight="bold" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});