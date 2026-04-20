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
  const resolvedPlaceholder = question.placeholder || '_____';
  const resolvedMaxLength = resolvedPlaceholder.length || question.maxLength || 10;

  return (
    <View style={styles.whiteboardContainer}>
      <Image
        source={require('../../assets/images/horani/whiteboard.jpeg')}
        style={styles.illustration}
        resizeMode="contain"
      />

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
            placeholder={resolvedPlaceholder}
            placeholderTextColor={Color.stroke}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={resolvedMaxLength}
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
    top: '22%',
    left: '25%',
    right: '5%',
    minHeight: '45%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: Gap.gap_10,
    paddingHorizontal: 12,
  },
  sentenceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    width: '100%',
  },
  sentenceText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 20,
    color: Color.text,
    flexShrink: 1,
  },
  input: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 20,
    color: Color.color,
    textAlign: 'left',
    textAlignVertical: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  vietnameseMeaning: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.gray,
    marginTop: Gap.gap_5,
    textAlign: 'center',
    width: '100%',
  },
});

export default WhiteboardArea;
