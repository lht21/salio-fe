import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ClockIcon, CheckCircleIcon, CaretRightIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';

const MOCK_HISTORY = [
  { id: '1', title: 'Đề thi thử TOPIK I - Đề 1', score: '180/200', time: 'Hôm nay' },
  { id: '2', title: 'Đề thi thử TOPIK I - Đề 2', score: '150/200', time: 'Hôm qua' },
  { id: '3', title: 'Bài tập Ngữ pháp Sơ cấp', score: '90/100', time: '3 ngày trước' },
];

export default function HistoryCardSlider() {
  return (
    <View style={styles.container}>
      {/* Tiêu đề & Nút Xem tất cả */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Lịch sử làm bài</Text>
        <TouchableOpacity style={styles.seeAllButton}>
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
          <TouchableOpacity key={item.id} activeOpacity={0.8} style={styles.card}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.badge}>
                <CheckCircleIcon size={14} color={Color.green || '#4A9F00'} weight="fill" />
                <Text style={styles.scoreText}>{item.score}</Text>
              </View>
              
              <View style={styles.timeWrap}>
                <ClockIcon size={14} color={Color.gray || '#64748B'} weight="regular" />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
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
  card: {
    backgroundColor: Color.bg || '#FFFFFF',
    borderWidth: 1,
    borderColor: Color.stroke || '#E2E8F0',
    borderRadius: Border.br_20,
    padding: Padding.padding_15 || 15,
    width: 220,
  },
  cardTitle: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14 || 14, color: Color.text, marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  scoreText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_12 || 12, color: Color.green || '#4A9F00' },
  timeWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12 || 12, color: Color.gray || '#64748B' },
});