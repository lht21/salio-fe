import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CaretRightIcon } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';
import HistoryCard from './ExamComponent/HistoryCard';

const MOCK_HISTORY = [
  { id: '1', title: 'Đề thi thử TOPIK I - Đề 1', score: '180/200', time: 'Hôm nay' },
  { id: '2', title: 'Đề thi thử TOPIK I - Đề 2', score: '150/200', time: 'Hôm qua' },
  { id: '3', title: 'Bài tập Ngữ pháp Sơ cấp', score: '90/100', time: '3 ngày trước' },
];

export default function HistoryCardSlider() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Tiêu đề & Nút Xem tất cả */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Lịch sử làm bài</Text>
        <TouchableOpacity 
          style={styles.seeAllButton}
          onPress={() => router.push('/practice/mock-exam/history')}
        >
          <Text style={styles.seeAllText}>Xem tất cả</Text>
          <CaretRightIcon size={14} color={Color.main2 || '#508D4E'} weight="bold" />
        </TouchableOpacity>
      </View>

      {/* Thanh trượt ngang */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {MOCK_HISTORY.map((item) => (
          <HistoryCard
            key={item.id}
            title={item.title}
            score={item.score}
            time={item.time}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.gap_15 || 15,
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: Color.gray,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: Color.main2 || '#508D4E',
  },
  scrollContent: {
    gap: Gap.gap_15 || 15,
    paddingRight: Padding.padding_15 || 15, // Khoảng trống khi trượt đến cuối
  },
});