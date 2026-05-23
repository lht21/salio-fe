import { useRouter } from 'expo-router';
import { CardsIcon, PlusCircleIcon, PlusIcon } from 'phosphor-react-native';
import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Border, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation,
  useAnimatedProps
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

// Import các components đã tách
import CategoryChip from '../../components/CategoryChip';
import FlashcardSetCard from '../../components/FlashcardSetCard';
import NewFlashCardSetModal from '../../components/Modals/NewFlashCardSetModal';
import SearchVocaModal from '../../components/Modals/SearchVocaModal';
import SearchBar from '../../components/SearchBar';
import VocabularyCard from '../../components/VocabularyCard';
import FlashcardService from '../../api/services/flashcard.service';
import apiClient from '../../api/client';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

type VocabularyItem = {
  id: string;
  word: string;
  pos: string;
  phonetic: string;
  meaning: string;
  isFavorite: boolean;
  status: string;
};

const AnimatedFlatList =
  Animated.createAnimatedComponent(FlatList) as unknown as React.ComponentType<
    React.ComponentProps<typeof FlatList<VocabularyItem>>
  >;

export default function VocabularyScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const CATEGORIES = useMemo(() => [
    { key: 'all', label: t('vocabulary.all', 'Tất cả') },
    { key: 'remembered', label: t('vocabulary.mastered', 'Thành thạo') },
    { key: 'learning', label: t('vocabulary.learning', 'Đang học') },
    { key: 'forgotten', label: t('vocabulary.forgotten', 'Đã quên') }
  ], [t]);

  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const newSetSheetRef = useRef<BottomSheetModal>(null);
  const searchVocaSheetRef = useRef<BottomSheetModal>(null);
  
  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [missionD2, setMissionD2] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [setsRes, favoriteRes, missionsRes] = await Promise.all([
        FlashcardService.getAllSets('my_sets'),
        FlashcardService.getSetById('favorite'),
        apiClient.get('/api/v1/gamification/daily-missions').catch(() => null)
      ]);

      if (missionsRes?.data?.success) {
        const d2 = missionsRes.data.data.find((m: any) => m.id === 'D2');
        setMissionD2(d2);
      }

      if (setsRes.success) {
        const images = [
          require('../../assets/images/horani/sc1_b0.png'),
          require('../../assets/images/horani/sc1_b2.png'),
          require('../../assets/images/horani/sc1_b3.png'),
        ];

        const mappedSets = setsRes.data.map((set: any, index: number) => ({
          id: set._id,
          title: set.name,
          totalWords: set.cards.length,
          index,
          imageSource: images[index % images.length],
        }));
        setFlashcardSets(mappedSets);
      }

      if (favoriteRes.success && favoriteRes.data) {
        const cards = favoriteRes.data.cards || [];
        const mappedVocabs: VocabularyItem[] = cards.map((card: any) => ({
          id: card._id,
          word: card.word,
          pos: card.type || card.category || '',
          phonetic: card.pronunciationText || '',
          meaning: card.meaning,
          isFavorite: true,
          status: card.learningStatus?.status || 'learning',
        }));
        setVocabularyItems(mappedVocabs);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu Vocabulary Screen:', error);
    }
  };

  useEffect(() => {
    fetchData().finally(() => setIsLoading(false));
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, []);

  const handleToggleFavorite = async (id: string) => {
    const targetItem = vocabularyItems.find(item => item.id === id);
    if (!targetItem) return;

    const isCurrentlyFavorite = targetItem.isFavorite;

    setVocabularyItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    );

    try {
      if (isCurrentlyFavorite) {
        await FlashcardService.removeCardFromSet('favorite', id);
      } else {
        await FlashcardService.addCardsToSet('favorite', { vocabIds: [id] });
      }
    } catch (error) {
      setVocabularyItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isFavorite: isCurrentlyFavorite } : item
        )
      );
      console.error('Lỗi khi cập nhật yêu thích:', error);
    }
  };

  const handleCreateNewSet = async (setName: string, selectedWords: any[]) => {
    try {
      setIsLoading(true);
      const createRes = await FlashcardService.createSet({ name: setName });

      if (createRes.success && createRes.data) {
        const newSetId = createRes.data._id;

        const vocabIds = selectedWords.map(word => word.id);
        if (vocabIds.length > 0) {
          await FlashcardService.addCardsToSet(newSetId, { vocabIds });
        }

        newSetSheetRef.current?.dismiss();
        await fetchData(); 
      }
    } catch (error) {
      console.error('Lỗi khi tạo bộ từ vựng mới:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = vocabularyItems.filter(item => {
    const matchTab = activeTab === 'all' || item.status === activeTab;
    const matchSearch = item.word.toLowerCase().includes(searchText.toLowerCase()) || item.meaning.toLowerCase().includes(searchText.toLowerCase());
    return matchTab && matchSearch;
  });

  const favoriteCount = vocabularyItems.filter(item => item.isFavorite).length;

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const stickySearchBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [200, 250], [0, 1], Extrapolation.CLAMP);
    const translateY = interpolate(scrollY.value, [200, 250], [-20, 0], Extrapolation.CLAMP);
    
    const zIndex = scrollY.value > 220 ? 100 : -1;

    return {
      opacity,
      transform: [{ translateY }],
      zIndex,
    };
  });

  const stickySearchBarProps = useAnimatedProps(() => {
    return {
      pointerEvents: scrollY.value > 220 ? 'auto' : 'none',
    } as any;
  });

  const handleStudyFlashcard = (setId: string, wordCount: number) => {
    if (wordCount === 0) {
      return Alert.alert(t('common.notice', 'Thông báo'), t('vocabulary.empty_study', 'Bộ từ vựng này chưa có từ nào. Hãy thêm từ vựng trước khi học nhé!'));
    }
    router.push({ pathname: '/vocabulary/flashcard-study', params: { setId } });
  };

  const handleQuiz = (setId: string, wordCount: number) => {
    if (wordCount === 0) {
      return Alert.alert(t('common.notice', 'Thông báo'), t('vocabulary.empty_quiz', 'Bộ từ vựng này chưa có từ nào. Hãy thêm từ vựng trước khi kiểm tra nhé!'));
    }
    router.push({ pathname: '/vocabulary/flashcard-quiz', params: { setId } });
  };

  const renderListHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('vocabulary.notebook', 'Sổ tay từ vựng')}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => newSetSheetRef.current?.present()}>
            <PlusIcon size={24} color={colors.text} weight="bold" />
          </TouchableOpacity>
        </View>
      </View>

      {missionD2 && !missionD2.isCompleted && (
        <View style={styles.missionBanner}>
          <Text style={styles.missionBannerText}>
            🎯 Nhiệm vụ hôm nay: Hãy học thêm {10 - missionD2.progress} từ vựng nữa để nhận mây nhé!
          </Text>
        </View>
      )}

      <View style={styles.bannerContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bannerScroll}>
          {favoriteCount >= 0 && (
            <FlashcardSetCard 
              title={t('vocabulary.favorite', 'Từ vựng yêu thích')} 
              totalWords={favoriteCount} 
              isSpecial={true}
              imageSource={require('../../assets/images/horani/horani_vocab.png')}
              onFlashcardPress={() => handleStudyFlashcard('favorite', favoriteCount)}
              onQuizPress={() => handleQuiz('favorite', favoriteCount)}
            />
          )}
          
          {flashcardSets.map((set) => {
            const cardColors = [colors.vang, colors.cardGreenBg, colors.badgePurpleBg];
            return (
              <FlashcardSetCard 
                key={set.id} 
                title={set.title} 
                totalWords={set.totalWords} 
                backgroundColor={cardColors[set.index % cardColors.length]}
                imageSource={set.imageSource} 
                onPress={() => {
                  router.push({
                    pathname: '/vocabulary/flashcardset-detail',
                    params: { id: set.id, title: set.title }
                  });
                }}
                onFlashcardPress={() => handleStudyFlashcard(set.id, set.totalWords)}
                onQuizPress={() => handleQuiz(set.id, set.totalWords)}
              />
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.chipRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {CATEGORIES.map(cat => {
            const isForgotten = cat.key === 'forgotten';
            return (
              <CategoryChip
                key={cat.key}
                label={cat.label}
                isActive={activeTab === cat.key}
                onPress={() => setActiveTab(cat.key)}
                activeBgColor={isForgotten ? colors.historyRedBg : undefined}
                activeBorderColor={isForgotten ? colors.red : undefined}
                activeTextColor={isForgotten ? colors.historyRedText : undefined}
              />
            );
          })}
        </ScrollView>
      </View>

      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity
        style={styles.emptyCardButton}
        onPress={() => searchVocaSheetRef.current?.present()}
        activeOpacity={0.7}
      >
        <PlusCircleIcon size={20} color={colors.main2} weight="fill" />
        <Text style={styles.emptyCardText}>{t('vocabulary.add_more', 'Lưu thêm từ vựng')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <Animated.View 
        style={[styles.stickySearchBar, stickySearchBarStyle]}
        animatedProps={stickySearchBarProps}
      >
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          containerStyle={{ flex: 1, marginBottom: 0 }}
        />
        <TouchableOpacity
          style={styles.stickyAddButton}
          onPress={() => searchVocaSheetRef.current?.present()}
          activeOpacity={0.7}
        >
          <PlusIcon size={24} color={colors.text} weight="bold" />
        </TouchableOpacity>
      </Animated.View>

      <AnimatedFlatList
        style={{ flex: 1 }}
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: '/vocabulary/vocabulary-detail', params: { wordId: item.id } })}
        >
          <VocabularyCard
            item={{...item, pos: item.pos || t('vocabulary.word', 'Từ vựng')}}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
          />
        </TouchableOpacity>
        )}
        ListHeaderComponent={renderListHeader()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.main} />
            ) : (
              <View style={{ alignItems: 'center', gap: Gap.gap_10 || 10 }}>
                <CardsIcon size={48} color={colors.stroke} weight="regular" style={{ marginBottom: 16 }} />
                <Text style={styles.emptyText}>{t('vocabulary.empty_list', 'Chưa có từ vựng nào trong danh sách.')}</Text>
                <Text style={styles.emptyText}>{t('vocabulary.add_favorite_hint', 'Hãy thêm từ vựng yêu thích của bạn vào đây!')}</Text>
              </View>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.main}
          />
        }
      />

      <NewFlashCardSetModal
        ref={newSetSheetRef}
        onClose={() => newSetSheetRef.current?.dismiss()}
        onCreateSet={handleCreateNewSet}
      />

      <SearchVocaModal
        ref={searchVocaSheetRef}
        onClose={() => searchVocaSheetRef.current?.dismiss()}
      />
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 50,
  },
    stickySearchBar: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      gap: Gap.gap_10 || 10,
      top: 0,
      left: 0,
      right: 0,
    backgroundColor: colors.bg,
      paddingTop: 50,
      paddingBottom: 15,
      paddingHorizontal: Padding.padding_15 || 15,
      shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
    },
    stickyAddButton: {
      width: 48,
      height: 48,
      borderRadius: Border.br_30 || 30,
    backgroundColor: colors.stroke,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
    borderColor: colors.stroke,
    },
  scrollContent: { 
    flexGrow: 1, 
    padding: Padding.padding_15 || 15
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.gap_20 || 20
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20 || 20,
    color: colors.text
  },
  testButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.historyYellowBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 18,
  },
  bannerContainer: {
    marginHorizontal: -(Padding.padding_15 || 15),
    marginBottom: Gap.gap_10,
  },
  bannerScroll: {
    paddingHorizontal: Padding.padding_15 || 15,
    gap: Gap.gap_15 || 15,
  },
  chipRow: {
    marginBottom: 20
  },
  chipScroll: {
    gap: 10,
  },
  emptyCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg2,
    borderRadius: Border.br_20,
    padding: Padding.padding_15 || 15,
    marginBottom: Gap.gap_20 || 20,
  },
  emptyCardText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: colors.gray,
    marginLeft: Gap.gap_10 || 10,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: colors.gray,
    textAlign: 'center',
  },
  missionBanner: {
    backgroundColor: colors.historyYellowBg || '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  missionBannerText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 14,
    color: colors.text,
    flex: 1
  }
});
