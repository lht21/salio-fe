import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../constants/GlobalStyles';

interface FeedbackCardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
}

export default function FeedbackCard({ title, content, icon }: FeedbackCardProps) {
  return (
    <View style={styles.feedbackCard}>
      <View style={styles.fcHeader}>
        {icon}
        <Text style={styles.fcTitle}>{title}</Text>
      </View>
      <Text style={styles.fcContent}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  feedbackCard: {
    backgroundColor: Color.bg,
    borderRadius: Border.br_20,
    borderWidth: 1,
    borderColor: Color.stroke,
    padding: Padding.padding_15,
  },
  fcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_10,
    marginBottom: Gap.gap_20,
  },
  fcTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.color, 
  },
  fcContent: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
    lineHeight: 22,
  },
});