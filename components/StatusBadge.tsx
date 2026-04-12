import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Color, FontFamily, Border, FontSize } from '../constants/GlobalStyles';

interface StatusBadgeProps {
  icon?: React.ReactNode;
  text: string;
  bgColor: string;
  onPress?: () => void;
}

const StatusBadge = ({ icon, text, bgColor, onPress }: StatusBadgeProps) => {
  return (
    <TouchableOpacity 
      style={[styles.badge, { backgroundColor: bgColor }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      {icon}
      <Text style={styles.badgeText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Border.br_20 || 20,
    gap: 4,
  },
  badgeText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: Color.text || '#1E1E1E',
  },
});

export default StatusBadge;