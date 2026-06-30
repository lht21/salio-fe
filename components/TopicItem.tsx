import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { CheckCircleIcon, ClockIcon, CircleIcon, StarIcon } from 'phosphor-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import { FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';
import { useTheme } from '../contexts/ThemeContext';

export interface TopicItemData {
  id: string;
  title: string;
  description: string;
  image: any;
  score?: string;    // Bổ sung cho danh sách lịch sử
  timeAgo?: string;  // Bổ sung cho danh sách lịch sử
}

interface TopicItemProps {
  topic: TopicItemData;
  onPress: () => void;
  onLongPress?: () => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
}

const TopicItem = ({ topic, onPress, onLongPress, isSelectionMode, isSelected }: TopicItemProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Logic tính toán trạng thái điểm (tương tự HistoryCard)
  const getScoreStatus = (scoreStr: string) => {
    const parts = scoreStr.split('/');
    if (parts.length === 2) {
      const earned = parseInt(parts[0], 10);
      const total = parseInt(parts[1], 10);
      const ratio = earned / total;

      if (ratio < 0.5) {
        return { bg: colors.historyRedBg || '#FEF2F2', text: colors.historyRedText || '#EF4444', isExcellent: false };
      } else if (ratio < 0.75) {
        return { bg: colors.historyOrangeBg || '#D97706', text: colors.historyOrangeText || '#FFFFFF', isExcellent: false };
      } else if (ratio >= 0.9) {
        return { bg: colors.historyYellowBg || '#FEF08A', text: colors.historyYellowText || '#B45309', isExcellent: true };
      }
    }
    return { bg: colors.main2 || '#22C55E', text: colors.bg || '#FFFFFF', isExcellent: false };
  };

  const statusColors = topic.score ? getScoreStatus(topic.score) : { bg: colors.main2 || '#22C55E', text: colors.bg || '#FFFFFF', isExcellent: false };

  // Animation lắc ngôi sao nếu điểm cao
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
          3,
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
    <Pressable 
      style={[styles.topicItemCard, isSelected && styles.cardSelected]} 
      onPress={onPress} 
      onLongPress={onLongPress}
    >
      {isSelectionMode && (
        <View style={styles.checkboxContainer}>
          {isSelected 
            ? <CheckCircleIcon size={24} color={colors.main2 || colors.main} weight="fill" />
            : <CircleIcon size={24} color={colors.gray || colors.gray} weight="light" />
          }
        </View>
      )}
      <Image source={topic.image} style={styles.topicItemImage} resizeMode="cover" />
      <View style={styles.topicItemTextContent}>
        <View style={styles.titleRow}>
          <Text style={styles.topicItemTitle} numberOfLines={1}>{topic.title}</Text>
          {statusColors.isExcellent && topic.score && topic.timeAgo && (
            <Animated.View style={[styles.starIcon, animatedStarStyle]}>
              <StarIcon size={16} color={colors.starIconExcellent || '#D97706'} weight="fill" />
            </Animated.View>
          )}
        </View>
        
        {topic.score && topic.timeAgo ? (
          <View style={styles.infoRow}>
            <View style={[styles.badge, { backgroundColor: statusColors.bg }]}>
              {statusColors.isExcellent ? (
                <StarIcon size={14} color={statusColors.text} weight="fill" />
              ) : (
                <CheckCircleIcon size={14} color={statusColors.text} weight="fill" />
              )}
              <Text style={[styles.scoreText, { color: statusColors.text }]}>{topic.score}</Text>
            </View>
            <View style={styles.timeWrap}>
              <ClockIcon size={14} color={colors.gray || '#64748B'} weight="regular" />
              <Text style={styles.timeText}>{topic.timeAgo}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.topicItemDesc} numberOfLines={2}>{topic.description}</Text>
        )}
      </View>
    </Pressable>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  topicItemCard: {
    flexDirection: 'row',
    backgroundColor: colors.bg || colors.bg,
    borderRadius: Border.br_20,
    padding: Padding.padding_15,
    borderWidth: 2,
    borderColor: colors.stroke || colors.stroke,
    alignItems: 'center',
  },
  cardSelected: {
    borderColor: colors.main2 || colors.main,
    backgroundColor: colors.historySelectedBg || '#F0FDF4',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  topicItemImage: {
    width: 70,
    height: 70,
    borderRadius: Border.br_15,
  },
  topicItemTextContent: {
    flex: 1,
    marginLeft: Gap.gap_15,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Gap.gap_5,
  },
  topicItemTitle: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: colors.text || colors.text,
  },
  starIcon: {
    marginLeft: 8,
  },
  topicItemDesc: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: colors.gray || colors.gray,
  },
  
  // --- STYLES CHO LỊCH SỬ ---
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8 
  },
  scoreText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12 || 12 },
  timeWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12 || 12, color: colors.gray || '#64748B' },
});

export default TopicItem;