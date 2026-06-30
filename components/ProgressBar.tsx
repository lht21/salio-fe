import React from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from "@/contexts/ThemeContext";

type ProgressBarProps = {
  progress?: number; // 0 to 1
  animatedProgress?: Animated.Value;
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function ProgressBar({
  progress = 0,
  animatedProgress,
  height = 6,
  color,
  backgroundColor,
  style,
}: ProgressBarProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);
    
    const finalColor = color || colors.main;
    const finalBgColor = backgroundColor || colors.stroke;

  const widthPercentage = animatedProgress
    ? animatedProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      })
    : `${Math.max(0, Math.min(progress, 1)) * 100}%`;

  return (
    <View
      style={[
        styles.track,
        { height, backgroundColor: finalBgColor, borderRadius: height / 2 },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          { width: widthPercentage as any, backgroundColor: finalColor, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      track: {
        width: '100%',
        overflow: 'hidden',
      },
      fill: {
        height: '100%',
      },
    });
