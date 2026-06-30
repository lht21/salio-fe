import React from 'react';
import { View, Text, StyleSheet, TextInput, Image, Dimensions } from 'react-native';
import { FontFamily, FontSize, Gap } from '../../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface WhiteboardQuestion {
  id: number;
  instruction: string;
  sentenceLeft?: string;
  sentenceRight?: string;
  vietnameseMeaning?: string;
  correctAnswerStr?: string; 
  maxLength?: number;
  placeholder?: string;
}

export interface WhiteboardAreaProps {
  question: WhiteboardQuestion;
  answer: string;
  setAnswer: (text: string) => void;
}

const WhiteboardArea = ({ question, answer, setAnswer }: WhiteboardAreaProps) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  
  //Tính toán số lượng dấu gạch dựa trên đáp án đúng
  const answerLength = question.correctAnswerStr?.length || 3;
  
  // Tạo chuỗi gạch dưới (ví dụ: "___" nếu đáp án có 3 ký tự)
  const resolvedPlaceholder = "_".repeat(answerLength);
  
  // Giới hạn nhập đúng bằng số lượng ký tự của đáp án
  const resolvedMaxLength = answerLength;

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
              { borderBottomColor: answer ? colors.color : colors.stroke }
            ]}
            defaultValue={answer}
            onChangeText={setAnswer}
            placeholder={resolvedPlaceholder}
            placeholderTextColor={colors.stroke}
            autoCapitalize="none"
            autoCorrect={false}
            // Đã gỡ bỏ maxLength để tránh xung đột với bộ gõ tiếng Hàn (IME)
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

const getStyles = (colors: any) => StyleSheet.create({
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
        color: colors.text,
        flexShrink: 1,
      },
      input: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: 20, 
        color: colors.color, 
        textAlign: 'center',
        paddingTop: 0,
        paddingBottom: 2,
        marginHorizontal: 4,
      },
      vietnameseMeaning: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_14,
        color: colors.gray,
        marginTop: Gap.gap_15, 
        textAlign: 'center',
        width: '100%',
      },
    });

export default WhiteboardArea;