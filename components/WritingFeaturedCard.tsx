import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';

interface WritingFeaturedCardProps {
  onPress?: () => void;
  title?: string;
  subtitle?: string;
  imageSource?: any;
}

const WritingFeaturedCard = ({ onPress, title, subtitle, imageSource = require('../assets/images/woji.png') }: WritingFeaturedCardProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const displayTitle = title || t('practice.writing_title', 'Luyện viết');
  const displaySubtitle = subtitle || t('practice.writing_subtitle', 'Trình soạn thảo Wongoji chuẩn thi thật');

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image 
          source={imageSource} 
          style={styles.image}
          contentFit="cover"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{displayTitle}</Text>
        <Text style={styles.subtitle}>{displaySubtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.main || '#98F291',
    borderRadius: Border.br_30 || 30,
    paddingHorizontal: Padding.padding_15 || 15,
    paddingBottom: Padding.padding_30 || 20,
    marginBottom: Gap.gap_20 || 20,
    overflow: 'hidden', // Giữ lại để ảnh xoay không bị tràn ra ngoài
  },
  imageContainer: {
    width: '100%',
    height: 140, // Có thể điều chỉnh chiều cao này
    marginBottom: Gap.gap_20 || 15, // Tạo khoảng cách với phần nội dung bên dưới
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    // zIndex không còn cần thiết vì các phần tử không còn chồng lên nhau
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: colors.color,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: colors.gray, // Xám đậm
  },
});

export default WritingFeaturedCard;