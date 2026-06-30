import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily, FontSize, Gap } from '../../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

interface QuestionBlockProps {
  number: number;
  questionText?: string;
  children: React.ReactNode;
}

export default function QuestionBlock({ number, questionText, children }: QuestionBlockProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      {/* Question Header */}
      <View style={styles.header}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{number}</Text>
        </View>
        {questionText && <Text style={styles.questionText}>{questionText}</Text>}
      </View>

      {/* Options */}
      <View style={styles.optionsWrapper}>
        {children}
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      container: {
        marginBottom: 40,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Gap.gap_20,
        gap: Gap.gap_10,
      },
      numberBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.stroke,
        justifyContent: 'center',
        alignItems: 'center',
      },
      numberText: { fontFamily: FontFamily.notoSerifBold, fontSize: FontSize.fs_14, color: colors.gray },
      questionText: { flex: 1, fontFamily: FontFamily.notoSerifRegular, fontSize: FontSize.fs_16, color: colors.text, lineHeight: 24 },
      optionsWrapper: { paddingLeft: 42 }, // Căn lề với nội dung câu hỏi
    });