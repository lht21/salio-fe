import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { ClockIcon, CheckCircleIcon, StarIcon, CircleIcon, ExamIcon } from 'phosphor-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { FontFamily, FontSize, Border, Padding, Stroke } from '../../constants/GlobalStyles';

interface HistoryCardProps {
  title: string;
  score: string;
  time: string;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function HistoryCard({ title, score, time, onPress, onLongPress, isSelectionMode, isSelected, style }: HistoryCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Tính toán màu sắc tự động dựa trên tỷ lệ phần trăm điểm (Ví dụ: 150/300)
  const getScoreStatus = (scoreStr: string) => {
    const parts = scoreStr.split('/');
    if (parts.length === 2) {
      const earned = parseInt(parts[0], 10);
      const total = parseInt(parts[1], 10);
      const ratio = earned / total;

      if (ratio < 0.5) { // Dưới 50%
        return { bg: colors.historyRedBg || '#FEF2F2', text: colors.historyRedText || '#EF4444', isExcellent: false }; // Đỏ
      } else if (ratio < 0.75) { // Dưới 75%
        return { bg: colors.historyOrangeBg || '#D97706', text: colors.historyOrangeText || '#FFFFFF', isExcellent: false }; // Vàng cam
      } else if (ratio >= 0.9) { // Từ 90% trở lên (Ví dụ: 180/200)
        return { bg: colors.historyYellowBg || '#FEF08A', text: colors.historyYellowText || '#B45309', isExcellent: true }; // Vàng sáng vinh danh
      }
    }
    return { bg: colors.main2, text: colors.bg || '#FFFFFF', isExcellent: false }; // Xanh lá (Mặc định)
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
    <TouchableOpacity activeOpacity={0.8} style={[styles.card, style, isSelected && styles.cardSelected]} onPress={onPress} onLongPress={onLongPress}>
      {isSelectionMode && (
        <View style={styles.checkboxContainer}>
          {isSelected 
            ? <CheckCircleIcon size={24} color={colors.main2} weight="fill" />
            : <CircleIcon size={24} color={colors.gray} weight="light" />}
        </View>
      )}

      <View style={styles.avatarContainer}>
        <ExamIcon size={28} color={colors.main2 || '#22C55E'} weight="fill" />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
          {statusColors.isExcellent && (
            <Animated.View style={[styles.starIcon, animatedStarStyle]}>
              <StarIcon size={16} color={colors.starIconExcellent || '#D97706'} weight="fill" />
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
            <ClockIcon size={14} color={colors.gray || '#64748B'} weight="regular" />
            <Text style={styles.timeText}>{time}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.bg || '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: Stroke.stroke,
    borderColor: colors.stroke || '#E2E8F0',
    borderRadius: Border.br_20,
    padding: Padding.padding_15 || 15,
    width: 240,
  },
  cardSelected: {
    borderColor: colors.main2,
    backgroundColor: colors.historySelectedBg || '#F0FDF4',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: Border.br_15 || 15,
    backgroundColor: colors.bg2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: { flex: 1, fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14 || 14, color: colors.text },
  starIcon: {
    marginLeft: 8,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  scoreText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12 || 12 },
  timeWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12 || 12, color: colors.gray || '#64748B' },
});