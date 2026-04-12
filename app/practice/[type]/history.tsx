import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Color, Padding, Gap } from '../../../constants/GlobalStyles';
import ScreenHeader from '../../../components/ScreenHeader';
import TopicItem, { TopicItemData } from '../../../components/TopicItem';

// --- MOCK DATA ---
// Mở rộng Interface TopicItemData để thêm ID dùng cho vòng lặp (key)
interface HistoryItem extends TopicItemData {
  id: string;
}

const HISTORY_DATA: HistoryItem[] = [
  {
    id: '1',
    title: 'Bảo vệ môi trường & Rác thải nhựa',
    description: '', // Không cần mô tả khi hiển thị dạng lịch sử
    image: require('../../../assets/images/imageExam/ie_1.png'),
    score: '85/100',
    timeAgo: '2 giờ trước',
  },
  {
    id: '2',
    title: 'Trí tuệ nhân tạo (AI) và Tương lai',
    description: '',
    image: require('../../../assets/images/imageExam/ie_2.png'),
    score: '92/100',
    timeAgo: 'Hôm qua',
  },
  {
    id: '3',
    title: 'Tỷ lệ sinh thấp & Già hóa dân số',
    description: '',
    image: require('../../../assets/images/imageExam/ie_2.png'),
    score: 'Đang chấm', // Có thể linh hoạt truyền Text báo trạng thái
    timeAgo: '3 ngày trước',
  },
];

export default function HistoryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Lịch sử làm bài" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          {HISTORY_DATA.map((item) => (
            <TopicItem 
              key={item.id} 
              topic={item} 
              onPress={() => {
                // TODO: Điều hướng sang màn hình Chi tiết kết quả của bài này
                console.log('Xem chi tiết lịch sử:', item.title);
              }} 
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  scrollContent: {
    padding: Padding.padding_20,
    paddingBottom: 40,
  },
  listContainer: {
    gap: Gap.gap_12,
  },
});