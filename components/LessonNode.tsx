import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import { TrophyIcon, KeyholeIcon } from 'phosphor-react-native';
import { FontFamily, FontSize } from '../constants/GlobalStyles';

export interface LessonItem {
  id: string;
  unit: string;
  title: string;
  status: 'completed' | 'current' | 'locked';
  points?: number;
  mascotPos: 'left' | 'right';
  mascotImg: string;
}

interface LessonNodeProps {
  item: LessonItem;
  index: number;
}

const LessonNode = ({ item, index }: LessonNodeProps) => {
  const isLeft = item.mascotPos === 'left';
  
  let cardBg = '#4B5563'; 
  let textColor = '#D1D5DB';
  let unitColor = '#9CA3AF';
  
  if (item.status === 'completed') {
    cardBg = '#A3E88A'; 
    textColor = '#1E1E1E';
    unitColor = '#334155';
  } else if (item.status === 'current') {
    cardBg = '#4A90E2'; 
    textColor = '#FFFFFF';
    unitColor = '#E0E7FF';
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
      <Image source={`${item.mascotImg}`} style={styles.nodeMascot} contentFit="contain" />
      
      <TouchableOpacity activeOpacity={0.8} style={[styles.nodeCard, { backgroundColor: cardBg }]}>
        <View style={styles.nodeUnitRow}>
          <Text style={[styles.nodeUnit, { color: unitColor }]}>{item.unit}</Text>
          {item.status === 'completed' && <TrophyIcon size={16} color="#D97706" weight="fill" />}
          {item.status === 'locked' && <KeyholeIcon size={16} color="#9CA3AF" weight="fill" />}
        </View>
        <Text style={[styles.nodeTitle, { color: textColor }]}>{item.title}</Text>
        
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
    width: 80,
    height: 80,
    marginHorizontal: 10,
  },
  nodeCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    position: 'relative',
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
    fontSize: FontSize.fs_14 || 14,
    lineHeight: 22,
  },
  pointsBadge: {
    position: 'absolute',
    bottom: -12,
    right: 20,
    backgroundColor: '#A3E88A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
  },
  pointsText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 10,
    color: '#1E1E1E',
  }
});

export default LessonNode;