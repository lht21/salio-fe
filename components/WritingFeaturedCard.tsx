import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';

interface WritingFeaturedCardProps {
  onPress?: () => void;
  title?: string;
  subtitle?: string;
  imageSource?: any;
}

const WritingFeaturedCard = ({ onPress, title = "Luyện viết", subtitle = "Trình soạn thảo Wongoji chuẩn thi thật", imageSource = require('../assets/images/woji.png') }: WritingFeaturedCardProps) => {
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
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Color.main || '#98F291',
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
    color: Color.color,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: Color.gray, // Xám đậm
  },
});

export default WritingFeaturedCard;