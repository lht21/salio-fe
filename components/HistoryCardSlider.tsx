import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CaretRightIcon } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';
import HistoryCard from './ExamComponent/HistoryCard';
import PracticeService from '../api/services/practice.service';
import { AttemptResult } from '../api/types/practice.types';

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

export default function HistoryCardSlider() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [historyData, setHistoryData] = useState<AttemptResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        // Lấy dư ra một chút (ví dụ 10) để dự phòng trường hợp có bài làm bị mất đề gốc
        const res = await PracticeService.getHistory({ page: 1, limit: 10 });
        if (res.success && res.data.history) {
          // Lọc bỏ các bài "mồ côi" (exam, writing, speaking bị null) và chỉ lấy đúng 3 item
          const validHistory = res.data.history
            .filter((item) => item.exam || item.writing || (item as any).speaking)
            .slice(0, 3);
          setHistoryData(validHistory);
        }
      } catch (error) {
        console.error('Lỗi lấy lịch sử (Slider):', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getCardData = (item: AttemptResult) => {
    let title = t('history.unknown', 'Không xác định');
    let score = '0';
    let typeStr = 'full';
    let setId = '';

    if (item.exam) {
      title = item.exam.title || t('history.unknown_exam', 'Đề thi không xác định');
      score = `${item.totalScore || 0}/${item.exam.totalScore || 'N/A'}`;
      typeStr = item.exam.type || item.exam.examType || 'full'; // Fallback nếu có
      setId = item.exam._id;
    } else if (item.writing) {
      title = item.writing.title || t('history.writing_topic', 'Chủ đề viết');
      score = item.status === 'evaluated' ? `${item.evaluation?.totalScore || 0}/100` : t('history.grading', 'Đang chấm');
      typeStr = 'writing';
      setId = item.writing._id;
    } else if ((item as any).speaking) {
      title = (item as any).speaking.title || t('history.speaking_topic', 'Chủ đề nói');
      score = item.status === 'evaluated' ? `${item.evaluation?.totalScore || 0}/100` : t('history.grading', 'Đang chấm');
      typeStr = 'speaking';
      setId = (item as any).speaking._id;
    }

    return {
      title, score, type: typeStr, setId,
      time: formatTimeAgo(item.completedAt || item.startedAt || (item as any).createdAt),
    };
  };

  if (!isLoading && historyData.length === 0) {
    return null; // Không hiển thị slider nếu chưa có lịch sử làm bài nào
  }

  return (
    <View style={styles.container}>
      {/* Tiêu đề & Nút Xem tất cả */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t('history.title', 'Lịch sử làm bài')}</Text>
        <TouchableOpacity 
          style={styles.seeAllButton}
          onPress={() => router.push('/practice/full/history' as any)}
        >
          <Text style={styles.seeAllText}>{t('history.see_all', 'Xem tất cả')}</Text>
          <CaretRightIcon size={14} color={colors.main2 || '#508D4E'} weight="bold" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="small" color={colors.main} style={{ marginTop: 10, alignSelf: 'flex-start' }} />
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          // --- THÊM HIỆU ỨNG SNAP ---
          decelerationRate="fast"
          snapToInterval={240 + (Gap.gap_15 || 15)} // Card width (240) + gap (15)
          snapToAlignment="start"
        >
          {historyData.map((item) => {
            const cardData = getCardData(item);
            return (
              <HistoryCard
                key={item._id}
                title={cardData.title}
                score={cardData.score}
                time={cardData.time}
                type={cardData.type}
                onPress={() => {
                  if (cardData.setId) router.push(`/practice/${cardData.type}/${cardData.setId}/${item._id}/review` as any);
                }}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
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
    color: colors.gray,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: colors.main2 || '#508D4E',
  },
  scrollContent: {
    gap: Gap.gap_15 || 15,
    paddingRight: Padding.padding_15 || 15, // Khoảng trống khi trượt đến cuối
  },
});