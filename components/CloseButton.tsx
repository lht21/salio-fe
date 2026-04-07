import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { XIcon } from 'phosphor-react-native';
import { Color } from '../constants/GlobalStyles';

export type CloseBtnVariant = 'Yellow' | 'Stroke' | 'Main';

interface CloseButtonProps {
  variant?: CloseBtnVariant;
  onPress: () => void;
  style?: ViewStyle;
}

export default function CloseButton({ variant = 'Stroke', onPress, style }: CloseButtonProps) {
  const getColors = () => {
    switch (variant) {
      case 'Yellow':
        return { bg: Color.vang, icon: Color.color };
      case 'Main':
        return { bg: Color.main, icon: Color.color };
      case 'Stroke':
      default:
        return { bg: Color.stroke, icon: Color.gray };
    }
  };

  const colors = getColors();

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: colors.bg }, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <XIcon size={18} color={colors.icon} weight="bold" />
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