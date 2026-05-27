import { Color } from '@/constants/GlobalStyles';
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface WindingPathProps {
  isActive: boolean;
  isLeftToRight: boolean;
}

const WindingPath = ({ isActive, isLeftToRight }: WindingPathProps) => {
  // Tính toán tâm tọa độ X tương đối cho các Node (Trái và Phải)
  const center = width / 2;
  const offset = 35; // Khoảng lệch so với tâm màn hình
  
  const startX = isLeftToRight ? center - offset : center + offset;
  const endX = isLeftToRight ? center + offset : center - offset;

  const pathColor = isActive ? (Color.main || '#1877F2') : (Color.stroke || '#E2E8F0');

  return (
    <View style={styles.svgContainer} pointerEvents="none">
      <Svg width={width} height={70}>
        <Path 
          // Vẽ một đường cong chữ S (Bezier Curve) nối từ startX đến endX
          d={`M ${startX} 0 C ${startX} 35, ${endX} 35, ${endX} 70`} 
          fill="none" 
          stroke={pathColor} 
          strokeWidth={8} 
          strokeLinecap="round"
          strokeDasharray={isActive ? "none" : "12, 12"} // Nếu chưa mở khóa thì hiển thị nét đứt
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    width: '100%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default WindingPath;
