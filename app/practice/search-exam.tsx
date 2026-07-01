import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { ClockIcon, ListChecksIcon, XIcon, ClockCounterClockwiseIcon, ArrowLeftIcon } from 'phosphor-react-native';

import { FontFamily, FontSize, Padding, Border, Gap } from '../../constants/GlobalStyles';
import { useTheme } from '../../contexts/ThemeContext';
import SearchBar from '../../components/SearchBar';
import CategoryChip from '../../components/CategoryChip';
import IconButton from '../../components/IconButton';
import PracticeService from '../../api/services/practice.service';
import ExamCard from '../../components/ExamComponent/ExamCard';

// Trending Tags (can be dynamic later)

const TRENDING_TAGS = ['TOPIK II', 'EPS', 'Kỳ 83', 'Nông nghiệp', 'TOPIK I', 'Nghe'];

export default function SearchExamScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['TOPIK II', 'Đề thi 2024']);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Filter logic from Backend
  useEffect(() => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response: any = await PracticeService.searchSets(searchText.trim());
        setSearchResults(response?.data?.data || response?.data || response || []);
      } catch (error) {
        console.error('Error searching exams:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
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

  const handleExamPress = (examId: string, examType: string) => {
    // Điều hướng tạm thời
    Keyboard.dismiss();
    router.push(`/practice/full/${examId}/intro`);
  };

  const renderExamItem = ({ item }: { item: any }) => {
    const examData = {
      id: item.id,
      title: item.title,
      edition: 1,
      year: new Date(item.createdAt || Date.now()).getFullYear(),
      isUnlocked: !item.isPremium,
      isFeatured: false,
      questionCount: item.questions,
      duration: item.time,
    };

    return (
      <View style={{ marginBottom: Gap.gap_15 }}>
        <ExamCard
          exam={examData}
          onPress={() => handleExamPress(item.id, item.type)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.customHeader}>
        <IconButton
          Icon={ArrowLeftIcon}
          iconSize={18}
          variant="Main"
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <View style={styles.searchBarWrapper}>
          <SearchBar
            value={searchText}
            onChangeText={handleSearch}
            placeholder={t('practice.search_placeholder', 'Nhập tên đề, từ khóa (VD: TOPIK, EPS...)')}
            containerStyle={{ marginBottom: 0 }}
          />
        </View>
      </View>

      <View style={styles.body}>
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
                        <ClockCounterClockwiseIcon size={16} color={colors.textSecondary} weight="bold" />
                        <Text style={styles.recentText}>{item}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removeRecentSearch(item)} hitSlop={10}>
                        <XIcon size={16} color={colors.textSecondary} weight="bold" />
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
    backgroundColor: colors.background,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
    paddingBottom: Padding.padding_10,
    backgroundColor: colors.background,
  },
  backButton: {
    marginRight: Gap.gap_15,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  searchBarWrapper: {
    flex: 1,
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
    color: colors.textPrimary,
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
    color: colors.textPrimary,
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
    color: colors.textSecondary,
    marginBottom: Gap.gap_10,
  },
  resultsList: {
    paddingBottom: 40,
    gap: Gap.gap_15,
  },
  examCard: {
    backgroundColor: colors.background,
    borderRadius: Border.br_15,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    padding: Padding.padding_15,
  },
  examHeader: {
    flexDirection: 'row',
    marginBottom: Gap.gap_10,
  },
  examBadge: {
    backgroundColor: colors.borderSkillCard || '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Border.br_5,
  },
  examBadgeText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_10,
    color: colors.accent1 || '#3B82F6',
  },
  examTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: colors.textPrimary,
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
    color: colors.textSecondary,
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
