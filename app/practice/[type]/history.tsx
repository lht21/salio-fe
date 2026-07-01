import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import { TrashIcon, ExamIcon, TrophyIcon } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Padding, Gap, FontFamily, FontSize, Border } from '../../../constants/GlobalStyles';
import ScreenHeader from '../../../components/ScreenHeader';
import Button from '../../../components/Button';
import TopicItem, { TopicItemData } from '../../../components/TopicItem';
import HistoryCard from '../../../components/ExamComponent/HistoryCard';
import HistoryActionModal from '../../../components/Modals/HistoryActionModal';
import PracticeService from '../../../api/services/practice.service';
import { AttemptResult } from '../../../api/types/practice.types';
import { useTheme } from '../../../contexts/ThemeContext';

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

// --- MAIN SCREEN ---
export default function PracticeHistoryScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const typeString = (type as string) || 'full';
  const isExamType = ['reading', 'listening', 'full'].includes(typeString);

  // Data state
  const [historyData, setHistoryData] = useState<AttemptResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Single item action state
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AttemptResult | null>(null);
  const [isDeletingSingle, setIsDeletingSingle] = useState(false);

  // Batch delete state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);

  // Refs cho ScrollView và tọa độ items
  const scrollViewRef = useRef<ScrollView>(null);
  const itemLayouts = useRef<Record<string, number>>({});

  // Tính toán Điểm cao nhất
  const highestScoreData = useMemo(() => {
    if (!isExamType || historyData.length === 0) return null;

    let maxScore = -1;
    let maxId = '';

    historyData.forEach(item => {
      const score = item.totalScore || 0;
      if (score > maxScore) {
        maxScore = score;
        maxId = item._id;
      }
    });

    return maxId ? { id: maxId, score: maxScore } : null;
  }, [historyData, isExamType]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        // Filter by type on client-side for now.
        // Ideally, backend should support filtering by practice type.
        const res = await PracticeService.getHistory({ page: 1, limit: 50 });
        if (res.success) {
          const allHistory = res.data.history || [];
          const filteredHistory = allHistory.filter(item => {
            if (isExamType) {
              return !!item.exam;
            } else {
              // Lọc cho writing/speaking
              return !!item.writing || !!(item as any).speaking;
            }
          });
          setHistoryData(filteredHistory);
        }
      } catch (error) {
        console.error('Lỗi lấy lịch sử:', error);
        Alert.alert(t('common.error', 'Lỗi'), t('history.error_load', 'Không thể tải lịch sử làm bài'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [typeString]);

  // --- Handlers ---

  const handleItemPress = (item: AttemptResult) => {
    if (isSelectionMode) {
      setSelectedIds(prev =>
        prev.includes(item._id)
          ? prev.filter(id => id !== item._id)
          : [...prev, item._id]
      );
    } else {
      if (isExamType) {
        const setId = item.exam?._id;
        if (setId) {
          if (item.status === 'in_progress') {
            Alert.alert(
              t('history.resume_title', 'Tiếp tục làm bài'),
              t('history.resume_desc', 'Bạn có bài làm đang dang dở. Bạn có muốn tiếp tục không?'),
              [
                { text: t('common.cancel', 'Hủy'), style: 'cancel' },
                { text: t('common.confirm', 'Tiếp tục'), onPress: () => router.push(`/practice/${typeString}/${setId}/intro` as any) }
              ]
            );
          } else {
            router.push(`/practice/${typeString}/${setId}/${item._id}/review` as any);
          }
        } else {
          Alert.alert(t('common.error', 'Lỗi'), t('history.error_exam_not_found', 'Không tìm thấy thông tin đề thi gốc của bài làm này.'));
        }
      } else {
        const setId = item.writing?._id || (item as any).speaking?._id;
        if (setId) {
          if (item.status === 'draft') {
            Alert.alert(
              t('history.resume_title', 'Tiếp tục làm bài'),
              t('history.resume_desc', 'Bạn có bài viết đang dang dở. Bạn có muốn tiếp tục không?'),
              [
                { text: t('common.cancel', 'Hủy'), style: 'cancel' },
                { text: t('common.confirm', 'Tiếp tục'), onPress: () => router.push(`/practice/${typeString}/${setId}/intro` as any) }
              ]
            );
          } else {
            router.push(`/practice/${typeString}/${setId}/${item._id}/result` as any);
          }
        } else {
          Alert.alert(t('common.error', 'Lỗi'), t('history.error_exercise_not_found', 'Không tìm thấy thông tin bài tập gốc của bài làm này.'));
        }
      }
    }
  };

  const handleLongPress = (item: AttemptResult) => {
    if (isSelectionMode) return;
    setSelectedItem(item);
    setIsActionMenuVisible(true);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]); // Reset selection when toggling
  };

  // --- Scroll Handler ---
  const scrollToHighestScore = () => {
    if (highestScoreData && itemLayouts.current[highestScoreData.id] !== undefined) {
      const y = itemLayouts.current[highestScoreData.id];
      // Nếu có y, cuộn tới tọa độ đó
      scrollViewRef.current?.scrollTo({ y, animated: true });
    }
  };

  // --- Delete Logic ---

  const handleDeleteSingle = async () => {
    if (!selectedItem || isDeletingSingle) return;
    try {
      setIsDeletingSingle(true);
      const res = await PracticeService.deleteAttempt(selectedItem._id);
      if (res.success) {
        setIsActionMenuVisible(false);
        Alert.alert(t('common.success', 'Thành công'), t('history.success_delete_single', 'Đã xóa bài làm khỏi lịch sử'));
        setHistoryData(prev => prev.filter(item => item._id !== selectedItem._id));
      } else {
        Alert.alert(t('common.error', 'Lỗi'), res.message || t('history.error_delete_single', 'Không thể xóa bài làm'));
      }
    } catch (error: any) {
      Alert.alert(t('common.error', 'Lỗi'), error.message || t('history.error_delete_occurred', 'Đã xảy ra lỗi khi xóa'));
    } finally {
      setIsDeletingSingle(false);
    }
  };

  const handleBatchDelete = () => {
    if (isDeletingBatch || selectedIds.length === 0) return;

    Alert.alert(
      t('history.confirm_delete', "Xác nhận xóa"),
      t('history.confirm_delete_desc', { count: selectedIds.length, defaultValue: `Bạn có chắc muốn xóa ${selectedIds.length} bài làm đã chọn?` }),
      [
        { text: t('common.cancel', "Hủy"), style: "cancel" },
        {
          text: t('common.delete', "Xóa"),
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeletingBatch(true);
              const res = await PracticeService.deleteMultipleAttempts(selectedIds);
              if (res.success) {
                Alert.alert(t('common.success', "Thành công"), t('history.success_delete_batch', { count: res.data.deletedCount, defaultValue: `Đã xóa ${res.data.deletedCount} bài làm.` }));
                setHistoryData(prev => prev.filter(item => !selectedIds.includes(item._id)));
                toggleSelectionMode(); // Exit selection mode
              } else {
                Alert.alert(t('common.error', "Lỗi"), res.message || t('history.error_delete_batch', "Không thể xóa các bài làm đã chọn."));
              }
            } catch (error: any) {
              Alert.alert(t('common.error', "Lỗi"), error.message || t('history.error_delete_batch_occurred', "Đã xảy ra lỗi khi xóa."));
            } finally {
              setIsDeletingBatch(false);
            }
          },
        },
      ]
    );
  };

  // --- Other Actions ---

  const handleRetry = () => {
    setIsActionMenuVisible(false);
    const setId = selectedItem?.exam?._id || selectedItem?.writing?._id || (selectedItem as any)?.speaking?._id;
    if (setId) {
      router.push(`/practice/${typeString}/${setId}/intro` as any);
    } else {
      Alert.alert(t('common.error', 'Lỗi'), t('history.error_topic_not_found', 'Không tìm thấy thông tin đề bài.'));
    }
  };

  const handleShare = () => {
    setIsActionMenuVisible(false);
    Alert.alert(t('common.share', "Chia sẻ"), t('history.share_desc', "Mở tính năng chia sẻ kết quả..."));
  };

  // --- UI Renderers ---

  const getHeaderTitle = () => {
    if (typeString === 'full') return t('history.mocktest_history', 'Lịch sử thi thử');
    if (typeString === 'reading') return t('history.reading_history', 'Lịch sử luyện đọc');
    if (typeString === 'listening') return t('history.listening_history', 'Lịch sử luyện nghe');
    if (typeString === 'writing') return t('history.writing_history', 'Lịch sử luyện viết');
    if (typeString === 'speaking') return t('history.speaking_history', 'Lịch sử luyện nói');
    return t('history.title', 'Lịch sử làm bài');
  };

  const renderList = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />;
    }
    if (historyData.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ExamIcon size={100} color={colors.primary} weight="fill" style={{ marginBottom: 12 }} opacity={0.6} />
          <Text style={styles.emptyText}>{t('history.empty', 'Chưa có lịch sử làm bài')}</Text>
          <Button
            title={t('history.practice_now', "Luyện tập ngay")}
            variant="Green"
            onPress={() => router.push(`/practice/${typeString}` as any)}
            style={{ marginTop: 24, minWidth: 200 }}
          />
        </View>
      );
    }
    return (
      <>
        {isExamType && highestScoreData && (
          <TouchableOpacity
            style={styles.highestScoreWrapper}
            onPress={scrollToHighestScore}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.neutral900 || '#1E293B', colors.neutral950 || '#0F172A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.highestScoreGradient}
            >
              <View style={styles.highestScoreWatermark}>
                <TrophyIcon size={120} color={colors.vang || "#FBBF24"} weight="fill" opacity={0.1} />
              </View>
              <View style={styles.highestScoreContent}>
                <View style={styles.highestScoreTextWrapper}>
                  <Text style={styles.highestScoreValue}>{highestScoreData.score}<Text style={styles.highestScoreUnit}>{t('history.score_unit', ' điểm')}</Text></Text>
                  <Text style={styles.highestScoreLabel}>{t('history.current_record', 'Kỷ lục hiện tại')}</Text>
                </View>
                <View style={styles.highestScoreIconWrapper}>
                  <TrophyIcon size={32} color={colors.vang || "#FBBF24"} weight="fill" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
        <View style={[styles.listContainer, isExamType && { gap: 0, paddingVertical: 8 }]}>
          {historyData.map((item, index) => {
            const isSelected = selectedIds.includes(item._id);

            if (isExamType) {
              const isExamInProgress = item.status === 'in_progress';
              const displayScore = isExamInProgress ? t('history.in_progress', 'Đang làm') : `${item.totalScore || 0}/${item.exam?.totalScore || 'N/A'}`;

              return (
                <View key={item._id} onLayout={(e) => { itemLayouts.current[item._id] = e.nativeEvent.layout.y; }}>
                  <HistoryCard
                    title={item.exam?.title || t('history.unknown_exam', 'Đề thi không xác định')}
                    score={displayScore}
                    time={formatTimeAgo(item.completedAt || item.startedAt || (item as any).createdAt)}
                    type={typeString}
                    variant="list"
                    isLast={index === historyData.length - 1}
                    onPress={() => handleItemPress(item)}
                    onLongPress={() => handleLongPress(item)}
                    isSelectionMode={isSelectionMode}
                    isSelected={isSelected}
                  />
                </View>
              );
            } else {
              const titleStr = item.writing?.title || (item as any).speaking?.title || t('history.unknown', 'Không xác định');

              let scoreStr = '';
              if (item.status === 'draft') {
                scoreStr = t('history.in_progress', 'Đang làm');
              } else if (item.status === 'evaluated') {
                scoreStr = `${item.evaluation?.totalScore || 0}/100`;
              } else {
                scoreStr = t('history.grading', 'Đang chấm');
              }

              const topicData: TopicItemData = {
                id: item._id,
                title: titleStr,
                description: item.writing?.description || '',
                image: require('../../../assets/images/imageExam/ie_1.png'),
                score: scoreStr,
                timeAgo: formatTimeAgo(item.completedAt || item.startedAt || (item as any).createdAt),
              };

              return (
                <TopicItem
                  key={item._id}
                  topic={topicData as any}
                  onPress={() => handleItemPress(item)}
                  onLongPress={() => handleLongPress(item)}
                  isSelectionMode={isSelectionMode}
                  isSelected={isSelected}
                />
              );
            }
          })}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={getHeaderTitle()}
        rightContent={
          historyData.length > 0 && (
            <TouchableOpacity onPress={toggleSelectionMode} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>{isSelectionMode ? t('common.cancel', 'Hủy') : t('common.select', 'Chọn')}</Text>
            </TouchableOpacity>
          )
        }
      />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderList()}
      </ScrollView>

      {isSelectionMode && selectedIds.length > 0 && (
        <MotiView
          from={{ translateY: 100, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'timing', duration: 300 }}
          style={styles.bottomBar}
        >
          <Text style={styles.bottomBarText}>{t('history.selected_count', { count: selectedIds.length, defaultValue: `Đã chọn ${selectedIds.length} bài` })}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleBatchDelete}
            disabled={isDeletingBatch}
          >
            {isDeletingBatch
              ? <ActivityIndicator color={colors.textInverse || '#FFF'} />
              : <>
                <TrashIcon size={18} color={colors.textInverse || '#FFF'} weight="bold" />
                <Text style={styles.deleteButtonText}>{t('common.delete', 'Xóa')}</Text>
              </>
            }
          </TouchableOpacity>
        </MotiView>
      )}

      <HistoryActionModal
        isVisible={isActionMenuVisible}
        onClose={() => setIsActionMenuVisible(false)}
        onRetry={handleRetry}
        onShare={handleShare}
        onDelete={handleDeleteSingle}
        isDeleting={isDeletingSingle}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Padding.padding_20,
    paddingBottom: 40,
    backgroundColor: colors.backgroundSubtle,
  },
  listContainer: {
    gap: Gap.gap_12,
    backgroundColor: colors.background,
    borderRadius: Border.br_30,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerButtonText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.textPrimary,
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 20,
    shadowColor: colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bottomBarText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.background },
  deleteButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.red || '#DC2626', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, gap: 8 },
  deleteButtonText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14, color: colors.textInverse || '#FFF' },
  highestScoreWrapper: {
    marginBottom: Gap.gap_20 || 20,
    shadowColor: colors.shadow || '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  highestScoreGradient: {
    borderRadius: Border.br_20 || 20,
    padding: Padding.padding_20 || 20,
    position: 'relative',
    overflow: 'hidden',
  },
  highestScoreWatermark: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    transform: [{ rotate: '-15deg' }],
  },
  highestScoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  highestScoreTextWrapper: {
    flex: 1,
  },
  highestScoreValue: { fontFamily: FontFamily.lexendDecaBold, fontSize: 54, color: colors.primary || '#98F291', marginBottom: 4 },
  highestScoreUnit: { fontSize: FontSize.fs_14 || 14, fontFamily: FontFamily.lexendDecaMedium },
  highestScoreLabel: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14 || 14, color: colors.textInverse || '#CBD5E1' },
  highestScoreIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.neutral800 || 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});