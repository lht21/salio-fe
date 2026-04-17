import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Color, Padding, Gap } from '../../../constants/GlobalStyles';
import ScreenHeader from '../../../components/ScreenHeader';
import HistoryCard from '../../../components/ExamComponent/HistoryCard';
import HistoryActionModal from '../../../components/Modals/HistoryActionModal';

// --- MOCK DATA ---
interface HistoryItem {
  id: string;
  title: string;
  score: string;
  timeAgo: string;
}

const HISTORY_DATA: HistoryItem[] = [
  {
    id: '96',
    title: '제96회 한국어능력시험',
    score: '240/300',
    timeAgo: '2 giờ trước',
  },
  {
    id: '95',
    title: '제95회 한국어능력시험',
    score: '185/300',
    timeAgo: 'Hôm qua',
  },
  {
    id: '94',
    title: '제94회 한국어능력시험',
    score: '210/300',
    timeAgo: '1 tuần trước',
  },
];

export default function MockExamHistoryScreen() {
  const router = useRouter();
  
  // States quản lý Modal
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  const handleLongPress = (id: string) => {
    setSelectedHistoryId(id);
    setIsActionMenuVisible(true);
  };

  const handleRetry = () => {
    setIsActionMenuVisible(false);
    // Chuyển hướng đến màn hình thực hành với bài thi có ID = selectedHistoryId
    router.push(`/practice/mock-exam/${selectedHistoryId}/intro` as any);
  };

  const handleShare = () => {
    setIsActionMenuVisible(false);
    Alert.alert("Chia sẻ", "Mở tính năng chia sẻ kết quả...");
  };

  const handleDelete = () => {
    setIsActionMenuVisible(false);
    // Gọi API xóa bài viết khỏi lịch sử
    Alert.alert("Xóa bài thi", `Đã xóa bài thi ID: ${selectedHistoryId} khỏi lịch sử`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Lịch sử thi thử" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          {HISTORY_DATA.map((item) => (
            <HistoryCard 
              key={item.id} 
              title={item.title}
              score={item.score}
              time={item.timeAgo}
              style={{ width: '100%' }} // Ghi đè cứng width 220 của Slider
              onPress={() => router.push(`/practice/mock-exam/${item.id}/result` as any)} 
              onLongPress={() => handleLongPress(item.id)}
            />
          ))}
        </View>
      </ScrollView>

      <HistoryActionModal 
        isVisible={isActionMenuVisible}
        onClose={() => setIsActionMenuVisible(false)}
        onRetry={handleRetry}
        onShare={handleShare}
        onDelete={handleDelete}
      />
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