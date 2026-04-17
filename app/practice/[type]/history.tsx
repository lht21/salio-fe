import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Color, Padding, Gap } from '../../../constants/GlobalStyles';
import ScreenHeader from '../../../components/ScreenHeader';
import TopicItem, { TopicItemData } from '../../../components/TopicItem';
import HistoryCard from '../../../components/ExamComponent/HistoryCard';
import HistoryActionModal from '../../../components/Modals/HistoryActionModal';

// --- MOCK DATA ---

// 1. Dữ liệu cho Writing / Speaking
interface WritingHistoryItem extends TopicItemData {
  id: string;
}

const WRITING_HISTORY_DATA: WritingHistoryItem[] = [
  {
    id: '1',
    title: 'Bảo vệ môi trường & Rác thải nhựa',
    description: '',
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

// 2. Dữ liệu cho Reading / Listening
interface ExamHistoryItem {
  id: string;
  title: string;
  score: string;
  timeAgo: string;
}

const READING_LISTENING_HISTORY_DATA: ExamHistoryItem[] = [
  {
    id: '96',
    title: '제96회 한국어능력시험',
    score: '45/50',
    timeAgo: '2 giờ trước',
  },
  {
    id: '95',
    title: '제95회 한국어능력시험',
    score: '38/50',
    timeAgo: 'Hôm qua',
  },
];

// --- SUB COMPONENTS ---

// View cho WRITING / SPEAKING
const WritingSpeakingHistoryView = ({ type }: { type: string }) => {
  const router = useRouter();
  
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  const handleLongPress = (id: string) => {
    setSelectedHistoryId(id);
    setIsActionMenuVisible(true);
  };

  const handleRetry = () => {
    setIsActionMenuVisible(false);
    Alert.alert("Luyện tập lại", `Bắt đầu lại bài thi ID: ${selectedHistoryId}`);
  };

  const handleShare = () => {
    setIsActionMenuVisible(false);
    Alert.alert("Chia sẻ", "Mở tính năng chia sẻ...");
  };

  const handleDelete = () => {
    setIsActionMenuVisible(false);
    Alert.alert("Xóa bài viết", `Đã xóa bài thi ID: ${selectedHistoryId} khỏi lịch sử`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Lịch sử làm bài" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          {WRITING_HISTORY_DATA.map((item) => (
            <TopicItem 
              key={item.id} 
              topic={item} 
              onPress={() => {
                console.log('Xem chi tiết lịch sử:', item.title);
              }} 
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

// View cho READING / LISTENING
const ReadingListeningHistoryView = ({ type }: { type: string }) => {
  const router = useRouter();
  
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  const handleLongPress = (id: string) => {
    setSelectedHistoryId(id);
    setIsActionMenuVisible(true);
  };

  const handleRetry = () => {
    setIsActionMenuVisible(false);
    router.push(`/practice/${type}/${selectedHistoryId}/intro` as any);
  };

  const handleShare = () => {
    setIsActionMenuVisible(false);
    Alert.alert("Chia sẻ", "Mở tính năng chia sẻ kết quả...");
  };

  const handleDelete = () => {
    setIsActionMenuVisible(false);
    Alert.alert("Xóa bài thi", `Đã xóa bài thi ID: ${selectedHistoryId} khỏi lịch sử`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={`Lịch sử ${type === 'reading' ? 'luyện đọc' : 'luyện nghe'}`} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          {READING_LISTENING_HISTORY_DATA.map((item) => (
            <HistoryCard 
              key={item.id} 
              title={item.title}
              score={item.score}
              time={item.timeAgo}
              style={{ width: '100%' }} // Phủ kín chiều ngang
              onPress={() => router.push(`/practice/${type}/${item.id}/result` as any)} 
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
};

// --- MAIN SCREEN ---
export default function PracticeHistoryScreen() {
  const { type } = useLocalSearchParams();
  const typeString = (type as string) || 'writing';
  const isReadingOrListening = typeString === 'reading' || typeString === 'listening';

  if (isReadingOrListening) {
    return <ReadingListeningHistoryView type={typeString} />;
  }
  return <WritingSpeakingHistoryView type={typeString} />;
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