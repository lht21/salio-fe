import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Color, FontFamily, FontSize, Padding, Border } from '../constants/GlobalStyles';

interface SubscriptionCardProps {
  title: string;
  price: string;
  unit: string;
  subText: string;
  isRecommended?: boolean;
  isSelected: boolean;
  onPress: () => void;
}

export default function SubscriptionCard({
  title,
  price,
  unit,
  subText,
  isRecommended,
  isSelected,
  onPress,
}: SubscriptionCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected ? styles.cardSelected : styles.cardUnselected,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Tag Đề xuất tốt nhất đè lên viền trên */}
      {isRecommended && (
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>Đề xuất tốt nhất</Text>
        </View>
      )}

      <Text style={[styles.title, isSelected && styles.textSelected]}>{title}</Text>
      
      <View style={styles.priceRow}>
        <Text style={[styles.price, isSelected && styles.textSelected]}>{price}</Text>
        <Text style={[styles.unit, isSelected && styles.textSelected]}>{unit}</Text>
      </View>
      
      <Text style={[styles.subText, isSelected && styles.textSelected]}>{subText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Border.br_30, // Bo góc lớn theo yêu cầu
    padding: Padding.padding_20,
    position: 'relative',
    marginTop: 15, // Tạo khoảng trống cho tag "Đề xuất" lồi lên
    flex: 1,
  },
  cardUnselected: {
    backgroundColor: Color.bg,
    opacity: 0.8, // Tăng độ nổi bật khi được chọn
  },
  cardSelected: {
    backgroundColor: Color.main,
    opacity: 0.8, // Tăng độ nổi bật khi được chọn
    borderColor: Color.color,
    borderLeftWidth: 10, // Viền trái dày hơn để nhấn mạnh
    borderWidth: 2,
  },
  tagContainer: {
    position: 'absolute',
    top: -14,
    left: 20,
    backgroundColor: Color.vang, // Hoặc một màu nổi bật từ hệ màu
    paddingHorizontal: Padding.padding_10,
    paddingVertical: 4,
    borderRadius: Border.br_20,
  },
  tagText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12,
    color: Color.color,
  },
  title: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.text,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_24, // Font chữ lớn, đậm
    color: Color.text,
  },
  unit: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
    marginLeft: 4,
  },
  subText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.text,
  },
  // Hiệu ứng đổi màu chữ khi Card được chọn
  textSelected: {
    color: Color.color, // Màu chữ sáng khi được chọn
  },
});