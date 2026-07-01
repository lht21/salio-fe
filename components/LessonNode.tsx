import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MotiView, MotiImage } from 'moti';
import { KeyholeIcon } from 'phosphor-react-native';
import ChampionIcon from './icons/ChampionIcon';
import { Border, FontFamily, FontSize } from '../constants/GlobalStyles';
import LessonNodeIcon from './LessonNodeIcon';
import { useTheme } from "@/contexts/ThemeContext";

export interface LessonItem {
  id: string;
  unit: string;
  title: string;
  lessonType?: 'standard' | 'hangul';
  hangul?: Array<{
    _id: string;
    glyph: string;
    label: string;
    order: number;
    group: string;
    romanization?: string;
  }>;
  status: 'completed' | 'current' | 'locked';
  points?: number;
  rewardClouds?: number;
  rewardBadge?: any;
  mascotPos: 'left' | 'right';
}

interface LessonNodeProps {
  item: LessonItem;
  index: number;
  onPress?: (item: LessonItem) => void;
}

const LessonNode = ({ item, index, onPress }: LessonNodeProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const isLeft = item.mascotPos === 'left';

  let cardBg = colors.textSecondary;
  let textColor = '#D1D5DB';
  let unitColor = '#9CA3AF';
  let strokeColor = colors.borderDefault;

  const imageSource = typeof item.rewardBadge === 'object' && item.rewardBadge?.imageUrl
    ? { uri: item.rewardBadge.imageUrl }
    : null;

  if (item.status === 'completed') {
    cardBg = '#ADFF66';
    textColor = '#1E1E1E';
    unitColor = '#334155';
    strokeColor = '#22C55E';
  } else if (item.status === 'current') {
    cardBg = '#4A90E2';
    textColor = '#FFFFFF';
    unitColor = '#E0E7FF';
    strokeColor = '#1865E4';
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: index * 100 } as any}
      style={[
        styles.nodeContainer,
        isLeft ? { paddingLeft: 20, paddingRight: 60 } : { paddingRight: 20, paddingLeft: 60, flexDirection: 'row-reverse' }
      ]}
    >
      {imageSource ? (
        <Image source={imageSource} style={styles.nodeMascot} contentFit="contain" />
      ) : (
        <View style={[styles.nodeMascot, { backgroundColor: '#E5E7EB', borderRadius: 12 }]} />
      )}

      <TouchableOpacity activeOpacity={0.8} style={styles.nodeCardWrapper} onPress={() => onPress?.(item)}>

        {/* --- LỚP NỀN SVG (Background) --- */}
        {/* transform scaleX: -1 giúp lật ngược cái đuôi của thẻ nếu Mascot nằm bên phải */}
        <View style={[StyleSheet.absoluteFill, { transform: [{ scaleX: isLeft ? 1 : -1 }] }]}>
          <LessonNodeIcon width="100%" height="100%" color1={cardBg} color2={strokeColor} preserveAspectRatio="none" />
        </View>

        {/* --- LỚP NỘI DUNG (Text) --- */}
        <View style={styles.nodeCardContent}>
          <View style={styles.nodeUnitRow}>
            <Text style={[styles.nodeUnit, { color: unitColor }]}>{item.unit}</Text>
            {item.status === 'completed' && <ChampionIcon width={22} height={22} />}
            {item.status === 'locked' && <KeyholeIcon size={18} color="#9CA3AF" weight="fill" />}
          </View>
          <Text style={[styles.nodeTitle, { color: textColor }]}>{item.title}</Text>

          {/* --- HIỂN THỊ PHẦN THƯỞNG --- */}
          {item.status !== 'completed' && (item.rewardClouds || item.rewardBadge) && (
            <View style={styles.rewardContainer}>
              {item.rewardClouds && (
                <View style={styles.rewardItem}>
                  <Image source={require('../assets/images/streak/cloud1.png')} style={styles.rewardIcon} />
                  <Text style={[styles.rewardText, { color: unitColor }]}>+{item.rewardClouds}</Text>
                </View>
              )}
              {imageSource ? (
                <Image source={imageSource} style={[styles.rewardIcon, styles.rewardBadgeIcon]} />
              ) : (
                <View style={[styles.rewardIcon, styles.rewardBadgeIcon, { backgroundColor: '#E5E7EB', borderRadius: 4 }]} />
              )}
            </View>
          )}

        </View>

        {/* --- HUY HIỆU ĐIỂM --- */}
        {item.status === 'completed' && item.points && (
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>{item.points} điểm</Text>
          </View>
        )}
      </TouchableOpacity>
    </MotiView>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  nodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    zIndex: 2,
  },
  nodeMascot: {
    width: 105,
    height: 105,
    marginHorizontal: 10,
  },
  nodeCardWrapper: {
    flex: 1,
    minHeight: 85, // Chiều cao tối thiểu để SVG không bị bóp méo
    justifyContent: 'center',
    position: 'relative',
  },
  nodeCardContent: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    zIndex: 1, // Z-index để Text luôn nổi lên trên cái nền SVG
  },
  nodeUnitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  nodeUnit: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 12,
  },
  nodeTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    lineHeight: 22,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardIcon: {
    width: 18,
    height: 18,
    opacity: 0.8,
  },
  rewardBadgeIcon: {
    width: 24,
    height: 24,
  },
  rewardText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 12,
  },
  pointsBadge: {
    position: 'absolute',
    bottom: -12,
    right: 15,
    backgroundColor: '#ADFF66',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1E1E1E',
    zIndex: 2,
  },
  pointsText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 10,
    color: '#1E1E1E',
  }
});

export default LessonNode;
