import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';

interface WritingFeaturedCardProps {
  onPress?: () => void;
}

const WritingFeaturedCard = ({ onPress }: WritingFeaturedCardProps) => {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={onPress}>
      {/* Hình ảnh minh họa đặt nghiêng */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/images/woji.png')} 
          style={styles.image}
          contentFit="contain"
        />
      </View>

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={styles.title}>Luyện viết</Text>
        <Text style={styles.subtitle}>Trình soạn thảo Wongoji chuẩn thi thật</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Color.main || '#98F291',
    borderRadius: Border.br_30 || 30,
    padding: Padding.padding_15 || 15,
    marginBottom: Gap.gap_20 || 20,
    overflow: 'hidden',
    height: 220,
    justifyContent: 'flex-end',
  },
  imageContainer: {
    position: 'absolute',
    top: -20,
    right: -10,
    left: 20,
    bottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
    // Tạo độ nghiêng nhẹ cho hình ảnh
    transform: [{ rotate: '-8deg' }],
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  content: {
    zIndex: 1,
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: Color.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: Color.gray, // Xám đậm
  },
});

export default WritingFeaturedCard;