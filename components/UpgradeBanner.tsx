// components/UpgradeBanner.tsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CaretRightIcon, CrownIcon } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

import { FontFamily, Padding, Border, FontSize, Gap } from '../constants/GlobalStyles';

export const UpgradeBanner = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const bannerStyles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity 
      style={bannerStyles.wrapper}
      activeOpacity={0.8}
      // Điều hướng đến thư mục subscription
      onPress={() => router.push('/subscription/' as any)} 
    >
      <LinearGradient 
        colors={[colors.upgradeBannerGradientStart || '#1E293B', colors.upgradeBannerGradientEnd || '#0F172A']} // Tone màu tối để tạo độ tương phản sang trọng
        start={{x:0, y:0}} 
        end={{x:1, y:1}} 
        style={bannerStyles.gradient}
      >
        {/* Watermark Icon chìm ở góc phải */}
        <View style={bannerStyles.watermark}>
          <CrownIcon size={100} color={colors.main} weight="fill" opacity={0.1} />
        </View>

        <View style={bannerStyles.content}>
          <View style={bannerStyles.iconWrapper}>
            <CrownIcon size={24} color={colors.cam} weight="fill" />
          </View>

          <View style={bannerStyles.textWrapper}>
            <Text style={bannerStyles.title}>{t('upgradeBanner.title', 'Trải nghiệm không giới hạn')}</Text>
            <Text style={bannerStyles.desc}>{t('upgradeBanner.desc', 'Mở khóa toàn bộ lộ trình và thi thử')}</Text>
          </View>
        </View>

        <View style={bannerStyles.actionRow}>
          <Text style={bannerStyles.sub}>{t('upgradeBanner.action', 'Nâng cấp ngay')}</Text>
          <CaretRightIcon size={14} color={colors.upgradeBannerActionText || '#0F172A'} weight="bold" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  wrapper: { 
    marginHorizontal: Padding.padding_15 || 15, 
    marginTop: 10, 
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: { 
    borderRadius: Border.br_20 || 20, 
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    transform: [{ rotate: '-15deg' }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_15 || 15,
    marginBottom: 16,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.upgradeBannerIconBg || 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
  },
  title: { 
    fontFamily: FontFamily.lexendDecaSemiBold, 
    fontSize: FontSize.fs_16 || 16, 
    color: colors.main, 
    marginBottom: 4 
  },
  desc: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12 || 12,
    color: colors.upgradeBannerDesc || '#CBD5E1',
  },
  actionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-start',
    backgroundColor: colors.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4 
  },
  sub: { 
    fontFamily: FontFamily.lexendDecaSemiBold, 
    fontSize: FontSize.fs_12 || 12, 
    color: colors.upgradeBannerActionText || '#0F172A' 
  },
});