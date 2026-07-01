import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontFamily, Border, FontSize } from '../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

interface StatusBadgeProps {
  icon?: React.ReactNode;
  text: string;
  onPress?: () => void;
  bgColor?: string;
}

const StatusBadge = ({ icon, text, onPress, bgColor }: StatusBadgeProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.badge, bgColor ? { backgroundColor: bgColor } : null]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      {icon}
      <Text style={styles.badgeText}>{text}</Text>
    </TouchableOpacity>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Border.br_20 || 20,
    gap: 4,
    backgroundColor: colors.background,
  },
  badgeText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: colors.textPrimary || '#1E1E1E',
  },
});

export default StatusBadge;