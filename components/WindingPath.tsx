import { Color } from '@/constants/GlobalStyles';
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const WindingPath = () => {
  return (
    <View style={styles.svgContainer} pointerEvents="none">
      <Svg width={width} height={900}>
        <Path 
          d="M 280 50 Q 80 180 120 300 T 260 480 T 120 680 T 250 850" 
          fill="none" 
          stroke={Color.main || '#1877F2'} 
          strokeWidth={7} 
        />
        <Path 
          d="M 280 50 Q 80 180 120 300 T 260 480 T 120 680 T 250 850" 
          fill="none" 
          stroke={Color.bg || '#FFFFFF'} 
          strokeWidth={9} 
          strokeDasharray="10, 10"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
});

export default WindingPath;
