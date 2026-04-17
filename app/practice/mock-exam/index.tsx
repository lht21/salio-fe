import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ClockCounterClockwiseIcon
} from 'phosphor-react-native';

// Import Design System & Components
import { Color, FontFamily, FontSize, Padding, Gap } from '../../../constants/GlobalStyles';
import ScreenHeader from '../../../components/ScreenHeader';

import ZenmodeBanner from '../../../components/ExamComponent/ZenmodeBanner';
import FeaturedAICard from '../../../components/ExamComponent/FeaturedAICard';
import ExamCard, { Exam } from '../../../components/ExamComponent/ExamCard';
import SectionHeader from '@/components/SectionHeader';

// --- MOCK DATA ---
const EXAMS_DATA: Exam[] = [
  { id: '96', title: '제96회 한국어능력시험', edition: 96, year: 2024, isUnlocked: true, isFeatured: true },
  { id: '95', title: '제95회 한국어능력시험', edition: 95, year: 2024, isUnlocked: true, isFeatured: true },
  { id: '94', title: '제94회 한국어능력시험', edition: 94, year: 2023, isUnlocked: false, isFeatured: false },
  { id: '93', title: '제93회 한국어능력시험', edition: 93, year: 2023, isUnlocked: false, isFeatured: false },
  { id: '92', title: '제92회 한국어능력시험', edition: 92, year: 2023, isUnlocked: false, isFeatured: false },
  { id: '91', title: '제91회 한국어능력시험', edition: 91, year: 2023, isUnlocked: false, isFeatured: false },
];

// --- MAIN SCREEN ---
export default function MockExamListScreen() {
  const router = useRouter();
  const [isZenmodeEnabled, setIsZenmodeEnabled] = useState(false);

  const featuredExams = EXAMS_DATA.filter(e => e.isFeatured);
  const otherExams = EXAMS_DATA.filter(e => !e.isFeatured);

  const handleStartExam = (examId: string) => {
    console.log(`Starting exam with ID: ${examId}`);
    router.push(`/practice/mock-exam/${examId}/intro` as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Chọn đề TOPIK II"
        rightContent={
          <Pressable onPress={() => router.push(`/practice/mock-exam/history` as any)} style={styles.iconButton}>
            <ClockCounterClockwiseIcon size={24} color={Color.text} weight="bold" />
          </Pressable>
        }
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ZenmodeBanner isEnabled={isZenmodeEnabled} onToggle={setIsZenmodeEnabled} />

        {/* AI Section */}
        <SectionHeader title="Để tổng hợp theo trình độ của bạn" />
        <FeaturedAICard onPress={() => handleStartExam('ai-generated')} />

        {/* Featured Exams Section */}
        <SectionHeader title="Đề nổi bật" />
        <View style={styles.listContainer}>
          {featuredExams.map(exam => (
            <ExamCard key={exam.id} exam={exam} onPress={() => handleStartExam(exam.id)} />
          ))}
        </View>

        {/* Other Exams Section */}
        <SectionHeader title="Các đề khác" />
        <View style={styles.gridContainer}>
          {otherExams.map(exam => (
            <View key={exam.id} style={styles.gridItem}>
              <ExamCard exam={exam} onPress={() => handleStartExam(exam.id)} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  iconButton: {
    padding: Padding.padding_5,
  },
  scrollContent: {
    paddingHorizontal: Padding.padding_15,
    paddingBottom: 40,
  },
  listContainer: {
    gap: Gap.gap_15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -(Gap.gap_10 / 2),
  },
  gridItem: {
    width: '50%',
    padding: Gap.gap_10 / 2,
  },
});