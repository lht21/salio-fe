import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text} from 'react-native';

import HeaderSection from '../../components/HeaderSection';
import WindingPath from '../../components/WindingPath';
import LessonNode, { LessonItem } from '../../components/LessonNode';
import { openLessonBottomSheet } from '../../components/Modals/lessonBottomSheetBus';
import { Color } from '@/constants/GlobalStyles';
import { useRouter } from 'expo-router';


const LESSONS: LessonItem[] = [
  {
    id: '0',
    unit: 'Bài 0',
    title: 'Chữ Hangul',
    status: 'completed',
    points: 100,
    mascotPos: 'left',
    mascotImg: require('../../assets/images/tubo/sc1_b0.png'),
  },
  {
    id: '1',
    unit: 'Bài 1',
    title: 'Giới thiệu - 소개',
    status: 'current',
    mascotPos: 'right',
    mascotImg: require('../../assets/images/tubo/sc1_b1.png'),
  },
  {
    id: '2',
    unit: 'Bài 2',
    title: 'Trường học - 학교',
    status: 'locked',
    mascotPos: 'left',
    mascotImg: require('../../assets/images/tubo/sc1_b2.png'),
  },
  {
    id: '3',
    unit: 'Bài 3',
    title: 'Sinh hoạt - 일상생활',
    status: 'locked',
    mascotPos: 'right',
    mascotImg: require('../../assets/images/tubo/sc1_b3.png'),
  },
  {
    id: '4',
    unit: 'Bài 4',
    title: 'Ngày và thứ - 날짜와 요일',
    status: 'locked',
    mascotPos: 'left',
    mascotImg: require('../../assets/images/tubo/sc1_b3.png'),
  },
];

export default function HomeScreen() {


  const router = useRouter();
  const currentLesson = React.useMemo(
    () => LESSONS.find((item) => item.status === 'current') ?? LESSONS[0],
    []
  );

  return (
    <View style={styles.container}>

      {/* Nút bấm để test màn hình Kết quả Writing. Khi nhấn vào sẽ chuyển đến màn hình /lessons/1/writing/result */}
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#02B0A0', 
          padding: 15, 
          borderRadius: 10, 
          marginTop: 50 
        }}
        // Điền một số bất kỳ (ví dụ số 1) vào vị trí của [lessonId]
        onPress={() => router.push('/lessons/1/writing/result')}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Test màn hình Kết quả Writing
        </Text>
      </TouchableOpacity>

      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <HeaderSection currentLesson={currentLesson} onCurrentLessonPress={openLessonBottomSheet} />

        <View style={styles.mapArea}>
          <WindingPath />

          <View style={styles.nodesWrapper}>
            {LESSONS.map((item, index) => (
              <LessonNode key={item.id} item={item} index={index} onPress={openLessonBottomSheet} />
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
    zIndex: 20,
  },
  nodesWrapper: {
    paddingTop: 80,
    gap: 40,
    zIndex: 2,
  },
});
