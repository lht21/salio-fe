import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { FontFamily, FontSize, Border } from '../constants/GlobalStyles';
import { MatchCardData } from '../app/vocabulary/flashcard-match';
import { useTheme } from "@/contexts/ThemeContext";

type MatchCardProps = {
  data: MatchCardData;
  isSelected: boolean;
  isMatched: boolean;
  isError: boolean;
  onPress: () => void;
};

const { width } = Dimensions.get('window');
const CARD_MARGIN = 6;
// 2 columns
const CARD_WIDTH = Math.floor((width - 30 - (CARD_MARGIN * 4)) / 2);

export default function MatchCard({ data, isSelected, isMatched, isError, onPress }: MatchCardProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  let animateState: any = { scale: 1, opacity: 1, translateY: 0 };
  
  if (isMatched) {
    animateState = { scale: 0.8, opacity: 0, translateY: 10 };
  } else if (isSelected) {
    animateState = { scale: 1.05, opacity: 1, translateY: -4 };
  }

  // Định dạng màu sắc tuỳ vào trạng thái
  let borderColor = colors.stroke;
  let backgroundColor = '#FFFFFF';
  let textColor = colors.text;

  if (isSelected) {
    borderColor = colors.main;
    backgroundColor = '#E5F4E2'; // Xanh nhạt
  }
  
  if (isError) {
    borderColor = colors.red;
    backgroundColor = '#FFF2F2'; // Đỏ nhạt
  }

  // Khi đã match thì cho chìm hẳn (nếu opacity chưa kịp ẩn)
  if (isMatched) {
    borderColor = colors.main;
    backgroundColor = colors.main;
    textColor = '#FFF';
  }

  return (
    <MotiView
      animate={animateState}
      transition={{ type: 'spring', damping: 15 } as any}
      style={[
        styles.cardContainer,
        {
          borderColor,
          backgroundColor,
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.touchable} 
        onPress={onPress}
        activeOpacity={0.7}
        disabled={isMatched}
      >
        <Text 
          style={[styles.cardText, { color: textColor }]} 
          numberOfLines={3} 
          adjustsFontSizeToFit
        >
          {data.text}
        </Text>
      </TouchableOpacity>
    </MotiView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      cardContainer: {
        width: CARD_WIDTH,
        height: 100,
        margin: CARD_MARGIN,
        borderRadius: Border.br_15,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
      },
      touchable: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
      },
      cardText: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_20,
        textAlign: 'center',
      },
    });
