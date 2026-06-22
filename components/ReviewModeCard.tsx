import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { Border, FontFamily, FontSize, Gap, Padding } from '../constants/GlobalStyles';

interface ReviewModeCardProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  sharedTransitionTag?: string;
}

export default function ReviewModeCard({ icon, label, onPress, sharedTransitionTag }: ReviewModeCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  return (
    <TouchableOpacity style={styles.reviewModeCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.reviewModeIconWrapper}>
        {sharedTransitionTag ? (
          <Animated.View sharedTransitionTag={sharedTransitionTag}>
            {icon}
          </Animated.View>
        ) : (
          icon
        )}
      </View>
      <Text style={styles.reviewModeLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  reviewModeCard: {
    flex: 1,
    backgroundColor: '#FFAB58',
    borderRadius: Border.br_20,
    padding: Padding.padding_15 || 15,
    alignItems: 'center',
    gap: Gap.gap_10 || 10,
  },
  reviewModeIconWrapper: {},
  reviewModeLabel: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: '#7A3900',
    textAlign: 'center',
  },
});