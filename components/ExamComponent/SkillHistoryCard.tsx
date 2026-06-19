import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  BookOpenIcon, 
  HeadphonesIcon, 
  PenNibIcon, 
  MicrophoneIcon, 
  StarIcon, 
  CheckCircleIcon 
} from 'phosphor-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withTiming, 
  withRepeat, 
  Easing 
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { FontFamily, FontSize, Border, Padding } from '../../constants/GlobalStyles';
import { SkillType } from '../../api/types/progress.type';

interface SkillHistoryCardProps {
  title: string;
  skill: SkillType | string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  createdAt: string;
  isLast?: boolean;
  onPress?: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
};

export default function SkillHistoryCard({ 
  title, skill, score, maxScore, percentage, createdAt, isLast, onPress 
}: SkillHistoryCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const skillConfig = useMemo(() => {
    switch (skill) {
      case 'reading': return { color: colors.xanh || '#4CAF50', Icon: BookOpenIcon };
      case 'listening': return { color: colors.cam || '#FF9800', Icon: HeadphonesIcon };
      case 'writing': return { color: colors.red || '#F44336', Icon: PenNibIcon };
      case 'speaking': return { color: colors.main || '#2196F3', Icon: MicrophoneIcon };
      default: return { color: colors.gray || '#9E9E9E', Icon: BookOpenIcon };
    }
  }, [skill, colors]);

  const statusColors = useMemo(() => {
    if (percentage === undefined) return { bg: colors.historySelectedBg || '#F0FDF4', text: colors.main2 || '#22C55E', isExcellent: false };
    if (percentage < 50) return { bg: colors.historyRedBg || '#FEF2F2', text: colors.historyRedText || '#EF4444', isExcellent: false };
    if (percentage < 75) return { bg: colors.historyOrangeBg || '#FEF3C7', text: colors.historyOrangeText || '#D97706', isExcellent: false };
    if (percentage >= 90) return { bg: colors.historyYellowBg || '#FEF08A', text: colors.historyYellowText || '#B45309', isExcellent: true };
    return { bg: colors.historySelectedBg || '#F0FDF4', text: colors.main2 || '#22C55E', isExcellent: false };
  }, [percentage, colors]);

  // Hiệu ứng lắc ngôi sao vinh danh
  const shakeAnim = useSharedValue(0);
  useEffect(() => {
    if (statusColors.isExcellent) {
      shakeAnim.value = withSequence(
        withTiming(-15, { duration: 50, easing: Easing.linear }),
        withRepeat(
          withSequence(
            withTiming(15, { duration: 100, easing: Easing.linear }),
            withTiming(-15, { duration: 100, easing: Easing.linear })
          ), 3, false
        ),
        withTiming(0, { duration: 50, easing: Easing.linear })
      );
    }
  }, [statusColors.isExcellent]);

  const animatedStarStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${shakeAnim.value}deg` }],
  }));

  const { Icon } = skillConfig;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.cardList, isLast && styles.cardListLast]}
      onPress={onPress}
    >
      <View style={[styles.avatarContainer, { backgroundColor: skillConfig.color + '15' }]}>
        <Icon size={24} color={skillConfig.color} weight="fill" />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
            {statusColors.isExcellent && (
              <Animated.View style={[styles.starIcon, animatedStarStyle]}>
                <StarIcon size={16} color={colors.starIconExcellent || '#D97706'} weight="fill" />
              </Animated.View>
            )}
          </View>
          <Text style={styles.dateText}>{formatDate(createdAt)}</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={[styles.badge, { backgroundColor: statusColors.bg }]}>
            {statusColors.isExcellent ? (
              <StarIcon size={14} color={statusColors.text} weight="fill" />
            ) : (
              <CheckCircleIcon size={14} color={statusColors.text} weight="fill" />
            )}
            <Text style={[styles.scoreText, { color: statusColors.text }]}>
              {score !== undefined ? score : '-'}/{maxScore || '-'}
            </Text>
          </View>

          {percentage !== undefined && (
            <Text style={styles.percentageText}>{Math.round(percentage)}% Chính xác</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  cardList: { width: '100%', flexDirection: 'row', alignItems: 'center', padding: Padding.padding_15 || 15, borderBottomWidth: 1, borderBottomColor: colors.stroke || '#E2E8F0', backgroundColor: 'transparent' },
  cardListLast: { borderBottomWidth: 0 },
  avatarContainer: { width: 48, height: 48, borderRadius: Border.br_15 || 15, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  contentContainer: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardTitle: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14 || 14, color: colors.text, flexShrink: 1 },
  starIcon: { marginLeft: 8 },
  dateText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12 || 12, color: colors.gray, marginLeft: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  scoreText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12 || 12 },
  percentageText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12 || 12, color: colors.main2 || '#22C55E' },
});