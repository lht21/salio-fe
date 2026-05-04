import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';

interface Badge {
  text: string;
  type: 'purple' | 'gray';
}

interface MocktestCardProps {
  title?: string;
  badges?: Badge[];
  onPress?: () => void;
}

const MocktestCard = ({ 
  title, 
  badges,
  onPress
}: MocktestCardProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const displayTitle = title || t('practice.mocktest_default', 'Thi thử toàn diện (Mocktest)');
  const displayBadges = badges || [
    { text: t('practice.zenmode', 'Zenmode'), type: 'purple' },
    { text: t('practice.focus_mode', 'Chế độ tập trung'), type: 'gray' }
  ];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Hình ảnh minh họa (Mascot) */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/images/horani/horani_skill3.png')} 
          style={styles.mocktestImage} 
          resizeMode="contain" 
        />
      </View>

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={styles.title}>{displayTitle}</Text>
        <View style={styles.badgesRow}>
          {displayBadges.map((badge, index) => (
            <View key={index} style={badge.type === 'purple' ? styles.badgePurple : styles.badgeGray}>
              <Text style={badge.type === 'purple' ? styles.badgePurpleText : styles.badgeGrayText}>{badge.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.purplePastel,
    borderWidth: 1.5,
    borderColor: colors.stroke || '#E2E8F0',
    borderRadius: Border.br_20 || 15,
    minHeight: 75,
    overflow: 'visible', // Cho phép hình ảnh tràn viền 3D
  },
  imageContainer: {
    width: 90,
    alignSelf: 'stretch', // Kéo dài bằng chính xác chiều cao của thẻ
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  mocktestImage: {
    width: 85,
    height: 85,
    position: 'absolute',
    bottom: -10, // Đẩy hình ảnh tràn viền dưới tạo hiệu ứng 3D rõ nét
  },
  
  content: {
    flex: 1,
    paddingVertical: Padding.padding_15 || 15,
    paddingRight: Padding.padding_15 || 15,
    paddingLeft: Gap.gap_15 || 15,
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 15,
    color: colors.purple,
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bg, 
    borderRadius: 12,
  },
  badgePurple: {
    backgroundColor: colors.badgePurpleBg || '#E9D5FF', 
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgePurpleText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 10,
    color: colors.badgePurpleText || '#7E22CE', 
  },
  badgeGray: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeGrayText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 10,
    color: colors.text, 
  }
});

export default MocktestCard;