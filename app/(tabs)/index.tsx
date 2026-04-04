import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import HeaderSection from '../../components/HeaderSection';
import WindingPath from '../../components/WindingPath';
import LessonNode, { LessonItem } from '../../components/LessonNode';
import { Color } from '@/constants/GlobalStyles';

const LESSONS: LessonItem[] = [
  { 
    id: '0', 
    unit: 'Bài 0', 
    title: 'Chữ Hangul', 
    status: 'completed', 
    points: 100,
    mascotPos: 'left',
    mascotImg: require('../assets/images/tubo/sc1_b0.png')
  },
  { 
    id: '1', 
    unit: 'Bài 1', 
    title: 'Giới thiệu -\n소개', 
    status: 'current',
    mascotPos: 'right',
    mascotImg: require('../assets/images/tubo/sc1_b1.png')
  },
  { 
    id: '2', 
    unit: 'Bài 2', 
    title: 'Trường học -\n학교', 
    status: 'locked',
    mascotPos: 'left',
    mascotImg: require('../assets/images/tubo/sc1_b2.png')
  },
  { 
    id: '3', 
    unit: 'Bài 3', 
    title: 'Sinh hoạt -\n일상생활', 
    status: 'locked',
    mascotPos: 'right',
    mascotImg: require('../assets/images/tubo/sc1_b3.png')
  },
  { 
    id: '4', 
    unit: 'Bài 4', 
    title: 'Ngày và thứ- 날짜와\n요일', 
    status: 'locked',
    mascotPos: 'left',
    mascotImg: require('../assets/images/tubo/sc1_b4.png')
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Top Header & Current Lesson */}
        <HeaderSection />

        {/* Map Path Area */}
        <View style={styles.mapArea}>
          <WindingPath />
          
          <View style={styles.nodesWrapper}>
            {LESSONS.map((item, index) => (
              <LessonNode key={item.id} item={item} index={index} />
            ))}
          </View>
        </View>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bg || '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  mapArea: {
    position: 'relative',
    marginTop: -20, 
    zIndex: 1,
  },
  nodesWrapper: {
    paddingTop: 80,
    gap: 40, 
  },
});