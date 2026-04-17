import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { ClockIcon, CheckCircleIcon, StarIcon } from 'phosphor-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import { Color, FontFamily, FontSize, Border, Padding, Stroke } from '../../constants/GlobalStyles';

interface HistoryCardProps {
  title: string;
  score: string;
  time: string;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function HistoryCard({ title, score, time, onPress, onLongPress, style }: HistoryCardProps) {
  // Tính toán màu sắc tự động dựa trên tỷ lệ phần trăm điểm (Ví dụ: 150/300)
  const getScoreStatus = (scoreStr: string) => {
    const parts = scoreStr.split('/');
    if (parts.length === 2) {
      const earned = parseInt(parts[0], 10);
      const total = parseInt(parts[1], 10);
      const ratio = earned / total;

      if (ratio < 0.5) { // Dưới 50%
        return { bg: '#FEF2F2', text: '#EF4444', isExcellent: false }; // Đỏ
      } else if (ratio < 0.75) { // Dưới 75%
        return { bg: '#D97706', text: '#FFFFFF', isExcellent: false }; // Vàng cam
      } else if (ratio >= 0.9) { // Từ 90% trở lên (Ví dụ: 180/200)
        return { bg: '#FEF08A', text: '#B45309', isExcellent: true }; // Vàng sáng vinh danh
      }
    }
    return { bg: Color.green, text: Color.bg || '#FFFFFF', isExcellent: false }; // Xanh lá (Mặc định)
  };

  const statusColors = getScoreStatus(score);

  // --- ANIMATION LẮC NGÔI SAO ---
  const shakeAnim = useSharedValue(0);

  useEffect(() => {
    if (statusColors.isExcellent) {
      shakeAnim.value = withSequence(
        withTiming(-15, { duration: 50, easing: Easing.linear }),
        withRepeat(
          withSequence(
            withTiming(15, { duration: 100, easing: Easing.linear }),
            withTiming(-15, { duration: 100, easing: Easing.linear })
          ),
          3, // Lặp lại chuyển động lắc 3 lần
          false
        ),
        withTiming(0, { duration: 50, easing: Easing.linear })
      );
    }
  }, [statusColors.isExcellent]);

  const animatedStarStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${shakeAnim.value}deg` }],
  }));

  return (
    <TouchableOpacity activeOpacity={0.8} style={[styles.card, style]} onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
        {statusColors.isExcellent && (
          <Animated.View style={[styles.starIcon, animatedStarStyle]}>
            <StarIcon size={16} color="#D97706" weight="fill" />
          </Animated.View>
        )}
      </View>
      
      <View style={styles.infoRow}>
        <View style={[styles.badge, { backgroundColor: statusColors.bg }]}>
          {statusColors.isExcellent ? (
            <StarIcon size={14} color={statusColors.text} weight="fill" />
          ) : (
            <CheckCircleIcon size={14} color={statusColors.text} weight="fill" />
          )}
          <Text style={[styles.scoreText, { color: statusColors.text }]}>{score}</Text>
        </View>
        
        <View style={styles.timeWrap}>
          <ClockIcon size={14} color={Color.gray || '#64748B'} weight="regular" />
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Color.bg || '#FFFFFF',
    borderWidth: Stroke.stroke,
    borderColor: Color.stroke || '#E2E8F0',
    borderRadius: Border.br_20,
    padding: Padding.padding_15 || 15,
    width: 220,
  },
  titleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: { flex: 1, fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14 || 14, color: Color.text },
  starIcon: {
    marginLeft: 8,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  scoreText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12 || 12 },
  timeWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12 || 12, color: Color.gray || '#64748B' },
});