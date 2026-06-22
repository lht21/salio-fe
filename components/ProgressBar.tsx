import React from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Color } from '../constants/GlobalStyles';

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
  color = Color.main,
  backgroundColor = Color.stroke,
  style,
}: ProgressBarProps) {
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
        { height, backgroundColor, borderRadius: height / 2 },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          { width: widthPercentage, backgroundColor: color, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
