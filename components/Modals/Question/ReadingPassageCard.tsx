import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { XIcon } from 'phosphor-react-native';

import { Color, FontFamily, FontSize } from '../../../constants/GlobalStyles';

type ReadingPassageCardProps = {
  lessonLabel?: string;
  instruction: string;
  passage: string;
  onClose?: () => void;
  footer?: React.ReactNode;
};

export default function ReadingPassageCard({
  lessonLabel,
  instruction,
  passage,
  onClose,
  footer,
}: ReadingPassageCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          {lessonLabel ? <Text style={styles.lessonLabel}>{lessonLabel}</Text> : null}
          <Text style={styles.instruction}>{instruction}</Text>
        </View>

        {onClose ? (
          <Pressable style={styles.closeButton} onPress={onClose}>
            <XIcon size={22} color="#B9A9C8" weight="regular" />
          </Pressable>
        ) : null}
      </View>

      <ScrollView style={styles.passageScroll} contentContainerStyle={styles.passageContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.passageText}>{passage}</Text>
      </ScrollView>

      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  lessonLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: '#4E9E38',
    marginBottom: 2,
  },
  instruction: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    lineHeight: 22,
    color: '#5A6891',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passageScroll: {
    flex: 1,
    marginTop: 16,
  },
  passageContent: {
    paddingBottom: 10,
  },
  passageText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_16,
    lineHeight: 28,
    color: Color.text,
  },
});
