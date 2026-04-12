import React from 'react';
import { View, Text, StyleSheet, TextInput, Image, Dimensions } from 'react-native';
import { Color, FontFamily, FontSize, Gap } from '../../constants/GlobalStyles';

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface WhiteboardQuestion {
  id: number;
  instruction: string;
  sentenceLeft?: string;
  sentenceRight?: string;
  vietnameseMeaning?: string;
  maxLength?: number;
  placeholder?: string;
}

export interface WhiteboardAreaProps {
  question: WhiteboardQuestion;
  answer: string;
  setAnswer: (text: string) => void;
}

const WhiteboardArea = ({ question, answer, setAnswer }: WhiteboardAreaProps) => {
  return (
    <View style={styles.whiteboardContainer}>
      {/* Ảnh nhân vật cầm bảng */}
      <Image 
        source={require('../../assets/images/horani/whiteboard.png')} 
        style={styles.illustration}
        resizeMode="contain"
      />
      
      {/* Lớp Overlay để đặt chữ và Input lên trên vùng bảng trắng */}
      <View style={styles.whiteboardOverlay}>
        <View style={styles.sentenceRow}>
          <Text style={styles.sentenceText}>{question.sentenceLeft}</Text>
          
          <TextInput
            style={[
              styles.input, 
              { borderBottomColor: answer ? Color.main : Color.stroke }
            ]}
            value={answer}
            onChangeText={setAnswer}
            placeholder={question.placeholder || "_____"}
            placeholderTextColor={Color.stroke}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={question.maxLength || 10}
          />
          
          <Text style={styles.sentenceText}>{question.sentenceRight}</Text>
        </View>
        {question.vietnameseMeaning ? (
          <Text style={styles.vietnameseMeaning}>{question.vietnameseMeaning}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  whiteboardContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Gap.gap_20,
    position: 'relative', 
  },
  illustration: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  whiteboardOverlay: {
    position: 'absolute',
    top: '35%', // Căn chỉnh tỷ lệ để lọt vừa khung bảng
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Gap.gap_10,
  },
  sentenceRow: {
    flexDirection: 'row',
    alignItems: 'baseline', 
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  sentenceText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_24,
    color: Color.text,
  },
  input: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_24,
    color: Color.color, 
    borderBottomWidth: 2,
    minWidth: 80,
    textAlign: 'center',
    paddingBottom: 2,
    marginHorizontal: Gap.gap_5,
  },
  vietnameseMeaning: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.gray,
    marginTop: Gap.gap_5,
  },
});

export default WhiteboardArea;