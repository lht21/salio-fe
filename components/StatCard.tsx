import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Border, FontFamily, FontSize, Padding } from '../constants/GlobalStyles';

interface StatCardProps {
  label: string;
  value: number;
  valueColor: string;
}

export default function StatCard({ label, value, valueColor }: StatCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: Padding.padding_20 || 20,
    borderRadius: Border.br_20 || 20,
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: colors.main2,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 36,
  },
});