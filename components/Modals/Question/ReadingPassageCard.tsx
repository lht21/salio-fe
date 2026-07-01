import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { XIcon } from 'phosphor-react-native';

import { FontFamily, FontSize } from '../../../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

type ReadingPassageCardProps = {
  passage: string;
};

export default function ReadingPassageCard({
  passage,
}: ReadingPassageCardProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.passageText}>{passage}</Text>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: '#F7FAFF',
    padding: 14,
    marginBottom: 16,
  },
  passageText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_16,
    lineHeight: 28,
    color: colors.textPrimary,
  },
});
