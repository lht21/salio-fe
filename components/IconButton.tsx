import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export type IconButtonVariant = 'Yellow' | 'Stroke' | 'Main';

interface IconButtonProps {
  Icon: React.ElementType; // Nhận Component Icon từ ngoài vào
  iconSize?: number;
  iconWeight?: string;
  variant?: IconButtonVariant;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function IconButton({ 
  Icon, 
  iconSize = 24, 
  iconWeight = 'bold', 
  variant = 'Stroke', 
  onPress, 
  style 
}: IconButtonProps) {
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
      <Icon size={iconSize} color={variantColors.icon} weight={iconWeight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
});