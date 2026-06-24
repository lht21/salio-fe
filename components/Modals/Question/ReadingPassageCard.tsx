import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { XIcon } from 'phosphor-react-native';

import { Color, FontFamily, FontSize } from '../../../constants/GlobalStyles';

type ReadingPassageCardProps = {
  passage: string;
};

export default function ReadingPassageCard({
  passage,
}: ReadingPassageCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.passageText}>{passage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: Color.text,
  },
});
