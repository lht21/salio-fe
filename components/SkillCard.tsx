import React, { useMemo } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

  const cardBorderColor = backgroundColor || colors.borderDefault || '#E2E8F0';
  const txtColor = titleColor || colors.textPrimary;

  // Mở rộng logic phát hiện icon bằng Đa ngôn ngữ (cả tiếng Việt, Anh và Hàn)
  const lowerTitle = title.toLowerCase();
  const isListening = lowerTitle.includes('nghe') || lowerTitle.includes('listening') || lowerTitle.includes('듣기');
  const isReading = lowerTitle.includes('đọc') || lowerTitle.includes('reading') || lowerTitle.includes('읽기');
  const isWriting = lowerTitle.includes('viết') || lowerTitle.includes('writing') || lowerTitle.includes('쓰기');

  let imageSource = null;
  if (isListening) {
    imageSource = require('../assets/images/horani/horani_skill1.png');
  } else if (isReading) {
    imageSource = require('../assets/images/horani/horani_skill2.png');
  } else if (isWriting) {
    imageSource = require('../assets/images/woji.png');
  }

  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={['#FFFFFF', cardBorderColor]}
        style={styles.gradientBorder}
      >
        <View style={styles.innerCard}>
          <View style={styles.imageContainer}>
            {imageSource ? <Image source={imageSource} style={styles.skillImage} resizeMode="contain" /> : icon}
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: txtColor }]}>{title}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 180,
    overflow: 'visible', // Cho phép hình ảnh tràn viền
    transform: [{ rotate: '-2.3deg' }],
  },
  gradientBorder: {
    flex: 1,
    borderRadius: 30,
    padding: 2.5, // Độ dày của viền gradient
    overflow: 'visible',
  },
  innerCard: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 28.5, // 30 - 1.5 để khít với góc bo bên ngoài
    paddingBottom: 15,
    overflow: 'visible',
  },
  imageContainer: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Gap.gap_10 || 10,
  },
  titleContainer: {
    alignItems: 'center',
  },
  skillImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    bottom: -5, // Đẩy hình ảnh tràn viền phía trên để tạo hiệu ứng 3D
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    textAlign: 'center',
  },
});

export default SkillCard;
