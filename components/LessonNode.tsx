import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import { TrophyIcon, KeyholeIcon } from 'phosphor-react-native';
import { Border, Color, FontFamily, FontSize } from '../constants/GlobalStyles';
import Svg, { Path } from 'react-native-svg';

export interface LessonItem {
  id: string;
  unit: string;
  title: string;
  status: 'completed' | 'current' | 'locked';
  points?: number;
  mascotPos: 'left' | 'right';
  mascotImg: any;
}

interface LessonNodeProps {
  item: LessonItem;
  index: number;
}

const LessonNode = ({ item, index }: LessonNodeProps) => {
  const isLeft = item.mascotPos === 'left';
  
  let cardBg = Color.gray; 
  let textColor = '#D1D5DB';
  let unitColor = '#9CA3AF';
  let strokeColor = Color.stroke;
  
  if (item.status === 'completed') {
    cardBg = '#ADFF66'; 
    textColor = '#1E1E1E';
    unitColor = '#334155';
    strokeColor = '#22C55E';
  } else if (item.status === 'current') {
    cardBg = '#4A90E2'; 
    textColor = '#FFFFFF';
    unitColor = '#E0E7FF';
    strokeColor = '#1865E4';
  }

  return (
    <MotiView 
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 200, type: 'timing', duration: 500 }}
      style={[
        styles.nodeContainer, 
        isLeft ? { paddingLeft: 20, paddingRight: 60 } : { paddingRight: 20, paddingLeft: 60, flexDirection: 'row-reverse' }
      ]}
    >
      <Image source={item.mascotImg} style={styles.nodeMascot} contentFit="contain" />
      
      <TouchableOpacity activeOpacity={0.8} style={styles.nodeCardWrapper}>
        
        {/* --- LỚP NỀN SVG (Background) --- */}
        {/* transform scaleX: -1 giúp lật ngược cái đuôi của thẻ nếu Mascot nằm bên phải */}
        <View style={[StyleSheet.absoluteFill, { transform: [{ scaleX: isLeft ? 1 : -1 }] }]}>
          <Svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
            <Path 
              /* Đây là hình dạng card mẫu (bong bóng lượn sóng có đuôi). 
                 Nếu bạn muốn nét cong giống hệt Frame 25.png của bạn, 
                 hãy mở Figma, copy mã SVG (chỉ phần d="...") và dán đè vào dòng dưới đây nhé */
              d="M20,5 C40,0 160,0 180,5 C195,8 195,20 195,50 C195,80 195,92 180,95 C160,100 40,100 20,95 C5,92 5,80 5,65 L0,50 L5,35 C5,20 5,8 20,5 Z"
              fill={cardBg} 
              stroke={strokeColor}
              strokeWidth={4}
            />
          </Svg>
        </View>

        {/* --- LỚP NỘI DUNG (Text) --- */}
        <View style={styles.nodeCardContent}>
          <View style={styles.nodeUnitRow}>
            <Text style={[styles.nodeUnit, { color: unitColor }]}>{item.unit}</Text>
            {item.status === 'completed' && <TrophyIcon size={18} color="#D97706" weight="fill" />}
            {item.status === 'locked' && <KeyholeIcon size={18} color="#9CA3AF" weight="fill" />}
          </View>
          <Text style={[styles.nodeTitle, { color: textColor }]}>{item.title}</Text>
        </View>
        
        {/* --- HUY HIỆU ĐIỂM --- */}
        {item.status === 'completed' && item.points && (
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>{item.points} điểm</Text>
          </View>
        )}
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  nodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    zIndex: 2,
  },
  nodeMascot: {
    width: 105,
    height: 105,
    marginHorizontal: 10,
  },
  nodeCardWrapper: {
    flex: 1,
    minHeight: 85, // Chiều cao tối thiểu để SVG không bị bóp méo
    justifyContent: 'center',
    position: 'relative',
  },
  nodeCardContent: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    zIndex: 1, // Z-index để Text luôn nổi lên trên cái nền SVG
  },
  nodeUnitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  nodeUnit: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 12,
  },
  nodeTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    lineHeight: 22,
  },
  pointsBadge: {
    position: 'absolute',
    bottom: -12,
    right: 15,
    backgroundColor: '#ADFF66',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1E1E1E',
    zIndex: 2,
  },
  pointsText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 10,
    color: '#1E1E1E',
  }
});

export default LessonNode;