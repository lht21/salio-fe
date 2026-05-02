import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { FontFamily, Border, Padding, FontSize } from '../constants/GlobalStyles';
import Button from './Button'; // Component Button bạn đã có
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

interface AlertBannerProps {
  text?: string;
  buttonTitle?: string;
  onPress?: () => void;
}

const AlertBanner = ({ 
  text, 
  buttonTitle, 
  onPress 
}: AlertBannerProps) => {
  const opacity = useSharedValue(1);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const themeStyles = useMemo(() => styles(colors), [colors]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: opacity.value }] // Thêm scale nhẹ cho hiệu ứng đẹp hơn
    };
  });

  const handlePress = () => {
    if (onPress) {
      // Chạy animation mờ dần trong 300ms
      opacity.value = withTiming(0, { duration: 300 }, (finished) => {
        // Gọi hàm onPress của màn hình cha trên JS thread sau khi animation kết thúc
        if (finished) runOnJS(onPress)();
      });
    }
  };

  const displayText = text || t('alertBanner.defaultText', 'Bạn đã đạt 215 điểm Topik thi thử. Kiểm tra ngay để chuyển đổi Trình độ học tập hiện tại');
  const displayButtonTitle = buttonTitle || t('alertBanner.checkNow', 'Kiểm tra');

  return (
    <Animated.View style={[themeStyles.container, animatedStyle]}>
      <Text style={themeStyles.text}>{displayText}</Text>
      <View style={themeStyles.btnWrapper}>
        <Button 
          variant="Black"
          title={displayButtonTitle}
          style={themeStyles.customBtn}
          onPress={onPress ? handlePress : undefined}
        />
      </View>
    </Animated.View>
  );
};

const styles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.cam || '#F9F871',
    borderRadius: Border.br_15 || 15,
    padding: Padding.padding_15 || 15,
    marginHorizontal: Padding.padding_15 || 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  text: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12 || 12,
    color: colors.text,
    lineHeight: 18,
    marginRight: 10,
  },
  btnWrapper: {
    width: 90,
  },
  customBtn: {
    height: 36,
    paddingHorizontal: 10,
    marginVertical: 0,
  }
});

export default AlertBanner;