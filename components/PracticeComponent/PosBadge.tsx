import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Border, FontFamily } from '../../constants/GlobalStyles';

interface PosBadgeProps {
  text: string;
  bgColor: string;
  textColor: string;
}

const PosBadge = ({ text, bgColor, textColor }: PosBadgeProps) => {
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: Border.br_20 || 5 },
  badgeText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 10 },
});

export default PosBadge;