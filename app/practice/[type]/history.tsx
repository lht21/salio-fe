import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Color, Padding, Gap, FontFamily, FontSize } from '../../../constants/GlobalStyles';
import ScreenHeader from '../../../components/ScreenHeader';
import TopicItem, { TopicItemData } from '../../../components/TopicItem';
import HistoryCard from '../../../components/ExamComponent/HistoryCard';
import HistoryActionModal from '../../../components/Modals/HistoryActionModal';
import PracticeService from '../../../api/services/practice.service';
import { AttemptResult } from '../../../api/types/practice.types';

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

// --- SUB COMPONENTS ---

// View cho WRITING / SPEAKING
const WritingSpeakingHistoryView = ({ type, data, isLoading }: { type: string; data: AttemptResult[]; isLoading: boolean }) => {
  const router = useRouter();
  
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AttemptResult | null>(null);

  const handleLongPress = (item: AttemptResult) => {
    setSelectedItem(item);
    setIsActionMenuVisible(true);
  };

  const handleRetry = () => {
    setIsActionMenuVisible(false);
    const setId = selectedItem?.writing?._id || (selectedItem as any)?.speaking?._id;
    if (setId) {
      router.push(`/practice/${type}/${setId}/intro` as any);
    } else {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin đề bài.');
    }
  };

  const handleShare = () => {
    setIsActionMenuVisible(false);
    Alert.alert("Chia sẻ", "Mở tính năng chia sẻ kết quả...");
  };

  const handleDelete = () => {
    setIsActionMenuVisible(false);
    Alert.alert("Xóa bài làm", `Đã xóa bài làm ID: ${selectedItem?._id} khỏi lịch sử`);
  };

  const getHeaderTitle = () => {
    if (type === 'writing') return 'Lịch sử luyện viết';
    if (type === 'speaking') return 'Lịch sử luyện nói';
    return 'Lịch sử làm bài';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={getHeaderTitle()} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={Color.main} style={{ marginTop: 20 }} />
        ) : data.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có lịch sử làm bài</Text>
        ) : (
          <View style={styles.listContainer}>
            {data.map((item) => {
              const setId = item.writing?._id || (item as any).speaking?._id;
              const titleStr = item.writing?.title || (item as any).speaking?.title || 'Chủ đề không xác định';
              const scoreStr = item.status === 'evaluated' ? `${item.evaluation?.totalScore || 0}/100` : 'Đang chấm';
              
              const topicData: TopicItemData = {
                id: item._id,
                title: titleStr,
                description: item.writing?.description || '',
                image: require('../../../assets/images/imageExam/ie_1.png'), // Ảnh mặc định
                score: scoreStr,
                timeAgo: formatTimeAgo(item.startedAt || (item as any).createdAt),
              };

              return (
                <TopicItem 
                  key={item._id} 
                  topic={topicData as any} 
                  onPress={() => router.push(`/practice/${type}/${setId}/${item._id}/result` as any)} 
                  onLongPress={() => handleLongPress(item)}
                />
              );
            })}
          </View>
        )}
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

// View cho EXAM (READING / LISTENING / FULL)
const ExamHistoryView = ({ type, data, isLoading }: { type: string; data: AttemptResult[]; isLoading: boolean }) => {
  const router = useRouter();
  
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AttemptResult | null>(null);

  const handleLongPress = (item: AttemptResult) => {
    setSelectedItem(item);
    setIsActionMenuVisible(true);
  };

  const handleRetry = () => {
    setIsActionMenuVisible(false);
    if (selectedItem?.exam?._id) {
      router.push(`/practice/${type}/${selectedItem.exam._id}/intro` as any);
    } else {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin đề bài.');
    }
  };

  const handleShare = () => {
    setIsActionMenuVisible(false);
    Alert.alert("Chia sẻ", "Mở tính năng chia sẻ kết quả...");
  };

  const handleDelete = () => {
    setIsActionMenuVisible(false);
    Alert.alert("Xóa bài thi", `Đã xóa bài thi ID: ${selectedItem?._id} khỏi lịch sử`);
  };

  const getHeaderTitle = () => {
    if (type === 'full') return 'Lịch sử thi thử';
    if (type === 'reading') return 'Lịch sử luyện đọc';
    if (type === 'listening') return 'Lịch sử luyện nghe';
    return 'Lịch sử làm bài';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={getHeaderTitle()} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={Color.main} style={{ marginTop: 20 }} />
        ) : data.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có lịch sử làm bài</Text>
        ) : (
          <View style={styles.listContainer}>
            {data.map((item) => (
              <HistoryCard 
                key={item._id} 
                title={item.exam?.title || 'Đề thi không xác định'}
                score={`${item.totalScore || 0}`}
                time={formatTimeAgo(item.startedAt || (item as any).createdAt)}
                style={{ width: '100%' }}
                onPress={() => router.push(`/practice/${type}/${item.exam?._id}/${item._id}/result` as any)} 
                onLongPress={() => handleLongPress(item)}
              />
            ))}
          </View>
        )}
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
  const typeString = (type as string) || 'full';
  const isExamType = ['reading', 'listening', 'full'].includes(typeString);

  const [historyData, setHistoryData] = useState<AttemptResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const res = await PracticeService.getHistory({ page: 1, limit: 20 });
        if (res.success) {
          setHistoryData(res.data.history || []);
        }
      } catch (error) {
        console.error('Lỗi lấy lịch sử:', error);
        Alert.alert('Lỗi', 'Không thể tải lịch sử làm bài');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [typeString]);

  if (isExamType) {
    return <ExamHistoryView type={typeString} data={historyData} isLoading={isLoading} />;
  }
  
  return <WritingSpeakingHistoryView type={typeString} data={historyData} isLoading={isLoading} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  scrollContent: {
    padding: Padding.padding_20,
    paddingBottom: 40,
    backgroundColor: Color.bg2,
  },
  listContainer: {
    gap: Gap.gap_12,
  },
  emptyText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
    textAlign: 'center',
    marginTop: 40,
  },
});