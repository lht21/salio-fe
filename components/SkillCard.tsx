import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';

interface SkillCardProps {
  title: string;
  icon?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  onPress?: () => void;
}

const SkillCard = ({ title, icon, backgroundColor = Color.bg, titleColor = Color.text, onPress }: SkillCardProps) => {
  const lowerTitle = title.toLowerCase();
  const isListening = lowerTitle.includes('nghe');
  const isReading = lowerTitle.includes('đọc');

  let imageSource = null;
  if (isListening) {
    imageSource = require('../assets/images/horani/horani_skill1.png');
  } else if (isReading) {
    imageSource = require('../assets/images/horani/horani_skill2.png');
  }

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor }]} onPress={onPress}>
      <View style={styles.leftPart}>
        {imageSource ? <Image source={imageSource} style={styles.skillImage} resizeMode="contain" /> : icon}
      </View>
      <View style={styles.rightPart}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Color.stroke || '#E2E8F0',
    borderRadius: Border.br_15 || 15,
    minHeight: 75,
    paddingRight: 15,
    overflow: 'visible', // Cho phép hình ảnh tràn viền
  },
  leftPart: {
    width: 70,
    height: 75, // Cố định chiều cao bằng thẻ để làm mốc tọa độ
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Gap.gap_15,
  },
  rightPart: {
    flex: 1,
    justifyContent: 'center',
  },
  skillImage: {
    width: 80,
    height: 80,
    position: 'absolute',
    bottom: -8, // Đẩy hình ảnh tràn ra khỏi viền dưới của thẻ tạo hiệu ứng 3D
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14 || 14,
  },
});

export default SkillCard;