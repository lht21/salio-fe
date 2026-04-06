import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';
import { LessonItem } from './LessonNode';

type CurrentLessonCardProps = {
  lesson: LessonItem;
  onPress?: (item: LessonItem) => void;
};

const CurrentLessonCard = ({ lesson, onPress }: CurrentLessonCardProps) => {
  return (
    <View style={styles.currentLessonWrapper}>
      <TouchableOpacity activeOpacity={0.9} style={styles.currentLessonCard} onPress={() => onPress?.(lesson)}>
        <View style={styles.currentLessonContent}>
          <Text style={styles.currentLessonTitle}>{`${lesson.unit}: ${lesson.title.replace('\n', ' ')}`}</Text>
          <View style={styles.continueBtn}>
            <Text style={styles.continueBtnText}>Tiếp tục</Text>
          </View>
        </View>

        <Image source={lesson.mascotImg} style={styles.currentLessonMascot} contentFit="contain" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  currentLessonWrapper: {
    paddingHorizontal: Padding.padding_15 || 15,
  },
  currentLessonCard: {
    backgroundColor: Color.bg || '#FFFFFF',
    borderRadius: Border.br_20 || 20,
    padding: Padding.padding_15 || 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  currentLessonContent: {
    flex: 1,
  },
  currentLessonTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: Color.color || '#0C5F35',
    marginBottom: Gap.gap_10 || 10,
  },
  continueBtn: {
    backgroundColor: Color.main || '#98F291',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Border.br_15 || 15,
    alignSelf: 'flex-start',
  },
  continueBtnText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12 || 12,
    color: Color.color || '#0C5F35',
  },
  currentLessonMascot: {
    width: 60,
    height: 60,
  },
});

export default CurrentLessonCard;
