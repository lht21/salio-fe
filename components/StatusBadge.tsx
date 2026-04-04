import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Color, FontFamily, Border } from '../constants/GlobalStyles';

interface StatusBadgeProps {
  icon?: React.ReactNode;
  text: string;
  bgColor: string;
}

const StatusBadge = ({ icon, text, bgColor }: StatusBadgeProps) => {
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      {icon}
      <Text style={styles.badgeText}>{text}</Text>
    </View>
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
    fontSize: 12,
    color: Color.text || '#1E1E1E',
  },
});

export default StatusBadge;