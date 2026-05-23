import React, { useMemo } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { FontFamily, FontSize, Border, Gap } from '../constants/GlobalStyles';

interface SkillCardProps {
  title: string;
  icon?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  onPress?: () => void;
}

const SkillCard = ({ title, icon, backgroundColor, titleColor, onPress }: SkillCardProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const bg = backgroundColor || colors.bg;
  const txtColor = titleColor || colors.text;

  // Mở rộng logic phát hiện icon bằng Đa ngôn ngữ (cả tiếng Việt, Anh và Hàn)
  const lowerTitle = title.toLowerCase();
  const isListening = lowerTitle.includes('nghe') || lowerTitle.includes('listening') || lowerTitle.includes('듣기');
  const isReading = lowerTitle.includes('đọc') || lowerTitle.includes('reading') || lowerTitle.includes('읽기');

  let imageSource = null;
  if (isListening) {
    imageSource = require('../assets/images/horani/horani_skill1.png');
  } else if (isReading) {
    imageSource = require('../assets/images/horani/horani_skill2.png');
  }

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: bg }]} onPress={onPress}>
      <View style={styles.leftPart}>
        {imageSource ? <Image source={imageSource} style={styles.skillImage} resizeMode="contain" /> : icon}
      </View>
      <View style={styles.rightPart}>
        <Text style={[styles.title, { color: txtColor }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.stroke || '#E2E8F0',
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
