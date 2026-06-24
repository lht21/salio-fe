import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { ClockIcon, ListChecksIcon, XIcon, ClockCounterClockwiseIcon } from 'phosphor-react-native';

import { FontFamily, FontSize, Padding, Border, Gap } from '../../constants/GlobalStyles';
import { useTheme } from '../../contexts/ThemeContext';
import ScreenHeader from '../../components/ScreenHeader';
import SearchBar from '../../components/SearchBar';
import CategoryChip from '../../components/CategoryChip';

// Mock Data
const MOCK_EXAMS = [
  { id: '1', title: 'Đề thi TOPIK II Kỳ 83', type: 'TOPIK II', questions: 100, time: 180 },
  { id: '2', title: 'Đề thi TOPIK II Kỳ 82', type: 'TOPIK II', questions: 100, time: 180 },
  { id: '3', title: 'Đề thi TOPIK I Kỳ 83', type: 'TOPIK I', questions: 70, time: 100 },
  { id: '4', title: 'Đề thi TOPIK I Kỳ 81', type: 'TOPIK I', questions: 70, time: 100 },
  { id: '5', title: 'EPS-TOPIK Nông nghiệp 2024', type: 'EPS', questions: 40, time: 50 },
  { id: '6', title: 'EPS-TOPIK Sản xuất 2024', type: 'EPS', questions: 40, time: 50 },
  { id: '7', title: 'Luyện nghe TOPIK II', type: 'TOPIK II', questions: 50, time: 60 },
  { id: '8', title: 'Luyện đọc TOPIK II', type: 'TOPIK II', questions: 50, time: 70 },
  { id: '9', title: 'Đề thi EPS-TOPIK Xây dựng 2023', type: 'EPS', questions: 40, time: 50 },
];

const TRENDING_TAGS = ['TOPIK II', 'EPS', 'Kỳ 83', 'Nông nghiệp', 'TOPIK I', 'Nghe'];

export default function SearchExamScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['TOPIK II', 'Đề thi 2024']);

  // Filter logic
  const searchResults = useMemo(() => {
    if (!searchText.trim()) return [];
    const query = searchText.toLowerCase();
    return MOCK_EXAMS.filter(exam => 
      exam.title.toLowerCase().includes(query) || 
      exam.type.toLowerCase().includes(query)
    );
  }, [searchText]);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleTagPress = (tag: string) => {
    setSearchText(tag);
  };

  const removeRecentSearch = (itemToRemove: string) => {
    setRecentSearches(prev => prev.filter(item => item !== itemToRemove));
  };

  const handleExamPress = (examType: string) => {
    // Điều hướng tạm thời
    Keyboard.dismiss();
    const typeParam = examType === 'EPS' ? 'eps' : examType === 'TOPIK I' ? 'topik1' : 'topik2';
    router.push(`/practice/full?examType=${typeParam}`);
  };

  const renderExamItem = ({ item }: { item: typeof MOCK_EXAMS[0] }) => (
    <TouchableOpacity 
      style={styles.examCard} 
      activeOpacity={0.7}
      onPress={() => handleExamPress(item.type)}
    >
      <View style={styles.examHeader}>
        <View style={styles.examBadge}>
          <Text style={styles.examBadgeText}>{item.type}</Text>
        </View>
      </View>
      <Text style={styles.examTitle}>{item.title}</Text>
      
      <View style={styles.examMeta}>
        <View style={styles.metaItem}>
          <ListChecksIcon size={14} color={colors.gray} weight="bold" />
          <Text style={styles.metaText}>{item.questions} câu</Text>
        </View>
        <View style={styles.metaItem}>
          <ClockIcon size={14} color={colors.gray} weight="bold" />
          <Text style={styles.metaText}>{item.time} phút</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScreenHeader title={t('practice.search_exam', 'Tìm kiếm đề thi')} />
      
      <View style={styles.body}>
        <SearchBar
          value={searchText}
          onChangeText={handleSearch}
          placeholder={t('practice.search_placeholder', 'Nhập tên đề, từ khóa (VD: TOPIK, EPS...)')}
          containerStyle={{ marginBottom: 0 }}
        />

        {!searchText.trim() ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.idleContent}>
            {/* Lịch sử tìm kiếm */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('common.recent_searches', 'Tìm kiếm gần đây')}</Text>
                <View style={styles.recentList}>
                  {recentSearches.map((item, index) => (
                    <View key={index} style={styles.recentItem}>
                      <TouchableOpacity 
                        style={styles.recentItemLeft}
                        onPress={() => handleTagPress(item)}
                      >
                        <ClockCounterClockwiseIcon size={16} color={colors.gray} weight="bold" />
                        <Text style={styles.recentText}>{item}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removeRecentSearch(item)} hitSlop={10}>
                        <XIcon size={16} color={colors.gray} weight="bold" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Từ khóa phổ biến */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('practice.trending_tags', 'Từ khóa phổ biến')}</Text>
              <View style={styles.tagsContainer}>
                {TRENDING_TAGS.map((tag, index) => (
                  <CategoryChip
                    key={index}
                    label={tag}
                    isActive={false}
                    onPress={() => handleTagPress(tag)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsCount}>
              {t('practice.results_count', { count: searchResults.length, defaultValue: `Tìm thấy ${searchResults.length} kết quả` })}
            </Text>
            
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={renderExamItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>{t('practice.no_exams_found', 'Không tìm thấy đề thi phù hợp.')}</Text>
                </View>
              }
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
    paddingHorizontal: Padding.padding_20,
    paddingTop: Gap.gap_10,
  },
  idleContent: {
    paddingTop: Gap.gap_20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: Gap.gap_20,
  },
  sectionTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: colors.text,
    marginBottom: Gap.gap_10,
  },
  recentList: {
    gap: Gap.gap_10,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  recentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  recentText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: colors.text,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Gap.gap_10,
  },
  
  resultsContainer: {
    flex: 1,
    paddingTop: Gap.gap_15,
  },
  resultsCount: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: colors.gray,
    marginBottom: Gap.gap_10,
  },
  resultsList: {
    paddingBottom: 40,
    gap: Gap.gap_15,
  },
  examCard: {
    backgroundColor: colors.bg,
    borderRadius: Border.br_15,
    borderWidth: 1,
    borderColor: colors.stroke,
    padding: Padding.padding_15,
  },
  examHeader: {
    flexDirection: 'row',
    marginBottom: Gap.gap_10,
  },
  examBadge: {
    backgroundColor: colors.bluePastel || '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Border.br_5,
  },
  examBadgeText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_10,
    color: colors.blue || '#3B82F6',
  },
  examTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: colors.text,
    marginBottom: Gap.gap_10,
  },
  examMeta: {
    flexDirection: 'row',
    gap: Gap.gap_20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: colors.gray,
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: colors.gray,
    textAlign: 'center',
  },
});
