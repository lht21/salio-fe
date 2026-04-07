import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { FireIcon, CloudIcon } from 'phosphor-react-native';

import { Color, Border, Gap } from '../constants/GlobalStyles';
import StatusBadge from './StatusBadge';
import CurrentLessonCard from './CurrentLessonCard';
import { LessonItem } from './LessonNode';

type HeaderSectionProps = {
  currentLesson: LessonItem;
  onCurrentLessonPress?: (item: LessonItem) => void;
};

const HeaderSection = ({ currentLesson, onCurrentLessonPress }: HeaderSectionProps) => {
  return (
    <LinearGradient colors={['#CEF9B4', Color.main || '#98F291']} style={styles.headerGradient}>
      <View style={styles.headerContent}>
        <Image
          source={require('../assets/images/tubo/sc1_b0.png')}
          style={styles.topMascot}
          contentFit="contain"
        />
        <View style={styles.badgesRow}>
          <StatusBadge text="Sơ cấp 1" bgColor={Color.vang || '#F9F871'} />
          <StatusBadge
            icon={<FireIcon size={16} color="#DC2626" weight="fill" />}
            text="15đ"
            bgColor={Color.vang || '#F9F871'}
          />
          <StatusBadge
            icon={<CloudIcon size={16} color="#2563EB" weight="fill" />}
            text="103 đám mây"
            bgColor={Color.vang || '#F9F871'}
          />
        </View>
      </View>

      <CurrentLessonCard lesson={currentLesson} onPress={onCurrentLessonPress} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 60,
    borderBottomLeftRadius: Border.br_30 || 30,
    borderBottomRightRadius: Border.br_30 || 30,
    paddingBottom: 20,
    zIndex: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
  topMascot: {
    width: 100,
    height: 100,
    marginBottom: Gap.gap_15 || 15,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
});

export default HeaderSection;
