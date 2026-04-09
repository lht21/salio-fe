import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Color, FontFamily, FontSize } from '../constants/GlobalStyles';

interface StatCircleProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export default function StatCircle({ value, label, icon }: StatCircleProps) {
  return (
    <View style={styles.statItem}>
      <View style={styles.statIconWrapper}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statItem: {
    alignItems: 'center',
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Nền trắng trong suốt nhẹ
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: Color.color,
  },
  statLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.color,
    opacity: 0.8,
  },
});