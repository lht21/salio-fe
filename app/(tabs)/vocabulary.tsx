import { useRouter } from 'expo-router';
import { CardsIcon, PlusCircleIcon, PlusIcon } from 'phosphor-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation,
  useAnimatedProps
} from 'react-native-reanimated';

// Import các components đã tách
import CategoryChip from '../../components/CategoryChip';
import FlashcardSetCard from '../../components/FlashcardSetCard';
import NewFlashCardSetModal from '../../components/Modals/NewFlashCardSetModal';
import SearchVocaModal from '../../components/Modals/SearchVocaModal';
import SearchBar from '../../components/SearchBar';
import VocabularyCard from '../../components/VocabularyCard';
import FlashcardService from '../../api/services/flashcard.service';

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

const CATEGORIES = ['Tất cả', 'Thành thạo', 'Đang học'];

export default function VocabularyScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchText, setSearchText] = useState('');
  const [isNewSetModalVisible, setIsNewSetModalVisible] = useState(false);
  const [isSearchVocaModalVisible, setIsSearchVocaModalVisible] = useState(false);
  
  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [setsRes, favoriteRes] = await Promise.all([
        FlashcardService.getAllSets('my_sets'),
        FlashcardService.getSetById('favorite')
      ]);

      if (setsRes.success) {
        const colors = ['#F9F871', '#CEF9B4', '#E9D5FF'];
        const images = [
          require('../../assets/images/horani/sc1_b0.png'),
          require('../../assets/images/horani/sc1_b2.png'),
          require('../../assets/images/horani/sc1_b3.png'),
        ];

        const mappedSets = setsRes.data.map((set, index) => ({
          id: set._id,
          title: set.name,
          totalWords: set.cards.length,
          color: colors[index % colors.length],
          imageSource: images[index % images.length],
        }));
        setFlashcardSets(mappedSets);
      }

      if (favoriteRes.success && favoriteRes.data) {
        const cards = favoriteRes.data.cards || [];
        const mappedVocabs: VocabularyItem[] = cards.map((card: any) => ({
          id: card._id,
          word: card.word,
          pos: card.type || card.category || 'Từ vựng',
          phonetic: card.pronunciationText || '',
          meaning: card.meaning,
          isFavorite: true,
          status: 'Đang học',
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

    // 1. Optimistic Update (Cập nhật UI ngay lập tức để tạo cảm giác mượt mà)
    setVocabularyItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    );

    try {
      // 2. Gọi API ngầm phía sau
      if (isCurrentlyFavorite) {
        await FlashcardService.removeCardFromSet('favorite', id);
      } else {
        await FlashcardService.addCardsToSet('favorite', { vocabIds: [id] });
      }
    } catch (error) {
      // 3. Rollback nếu API lỗi
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
      // Bước 1: Gọi API tạo bộ từ vựng mới
      const createRes = await FlashcardService.createSet({ name: setName });

      if (createRes.success && createRes.data) {
        const newSetId = createRes.data._id;

        // Bước 2: Lấy mảng ID và thêm vào bộ vừa tạo
        const vocabIds = selectedWords.map(word => word.id);
        if (vocabIds.length > 0) {
          await FlashcardService.addCardsToSet(newSetId, { vocabIds });
        }

        // Thành công: Đóng modal và tải lại dữ liệu để cập nhật danh sách
        setIsNewSetModalVisible(false);
        await fetchData(); 
      }
    } catch (error) {
      console.error('Lỗi khi tạo bộ từ vựng mới:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = vocabularyItems.filter(item => {
    const matchTab = activeTab === 'Tất cả' || item.status === activeTab;
    const matchSearch = item.word.toLowerCase().includes(searchText.toLowerCase()) || item.meaning.toLowerCase().includes(searchText.toLowerCase());
    return matchTab && matchSearch;
  });

  const favoriteCount = vocabularyItems.filter(item => item.isFavorite).length;

  // --- ANIMATION CHO STICKY SEARCHBAR ---
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const stickySearchBarStyle = useAnimatedStyle(() => {
    // V�?trí xuất hiện của Sticky SearchBar (Ước tính Header + Banner + Chips ~ 200px)
    const opacity = interpolate(scrollY.value, [200, 250], [0, 1], Extrapolation.CLAMP);
    const translateY = interpolate(scrollY.value, [200, 250], [-20, 0], Extrapolation.CLAMP);
    
    // Ẩn zIndex khi chưa xuất hiện đ�?không đè thao tác bấm của các nút bên dưới
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

  // --- TÁCH CÁC PHẦN T�?CHO FLATLIST ---

  // Header của danh sách (gồm Header, Banner, Chips, SearchBar)
  const renderListHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sổ tay từ vựng</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => setIsNewSetModalVisible(true)}>
            <PlusIcon size={24} color={Color.text || '#1E1E1E'} weight="bold" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bannerScroll}>
          {favoriteCount >= 0 && (
            <FlashcardSetCard 
              title="Từ vựng yêu thích" 
              totalWords={favoriteCount} 
              isSpecial={true}
              imageSource={require('../../assets/images/horani/horani_vocab.png')}
            />
          )}
          
          {flashcardSets.map((set) => (
            <FlashcardSetCard 
              key={set.id} 
              title={set.title} 
              totalWords={set.totalWords} 
              backgroundColor={set.color}
              imageSource={set.imageSource} 
              onPress={() => {
                router.push({
                  pathname: '/vocabulary/flashcardset-detail',
                  params: { id: set.id, title: set.title }
                });
              }}
            />
          ))}
        </ScrollView>
      </View>

      {/* Filter Chips */}
      <View style={styles.chipRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {CATEGORIES.map(cat => (
            <CategoryChip
              key={cat}
              label={cat}
              isActive={activeTab === cat}
              onPress={() => setActiveTab(cat)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Search */}
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity
        style={styles.emptyCardButton}
        onPress={() => setIsSearchVocaModalVisible(true)}
        activeOpacity={0.7}
      >
        <PlusCircleIcon size={20} color={Color.main2 || '#64748B'} weight="fill" />
        <Text style={styles.emptyCardText}>Lưu thêm từ vựng</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      {/* Sticky SearchBar (Thanh dính trên cùng) */}
      {/* Sticky Header (dính trên cùng) */}
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
          onPress={() => setIsSearchVocaModalVisible(true)}
          activeOpacity={0.7}
        >
          <PlusIcon size={24} color={Color.text || '#1E1E1E'} weight="bold" />
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
            item={item}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
          />
        </TouchableOpacity>
        )}
        ListHeaderComponent={renderListHeader()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={Color.main || '#98F291'} />
            ) : (
              <View style={{ alignItems: 'center', gap: Gap.gap_10 || 10 }}>
                <CardsIcon size={48} color={Color.stroke || '#64748B'} weight="regular" style={{ marginBottom: 16 }} />
                <Text style={styles.emptyText}>Chưa có từ vựng nào trong danh sách.</Text>
                <Text style={styles.emptyText}>Hãy thêm từ vựng yêu thích của bạn vào đây!</Text>
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
            tintColor={Color.main || '#98F291'}
          />
        }
      />

      {/* New FlashCard Set Modal */}
      <NewFlashCardSetModal
        isVisible={isNewSetModalVisible}
        onClose={() => setIsNewSetModalVisible(false)}
        onCreateSet={handleCreateNewSet}
      />

      <SearchVocaModal
        isVisible={isSearchVocaModalVisible}
        onClose={() => setIsSearchVocaModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg || '#FFFFFF',
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
      backgroundColor: Color.bg || '#FFFFFF',
      paddingTop: 50,
      paddingBottom: 15,
      paddingHorizontal: Padding.padding_15 || 15,
      shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
    },
    stickyAddButton: {
      width: 48,
      height: 48,
      borderRadius: Border.br_30 || 30,
      backgroundColor: Color.stroke,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Color.stroke || '#E2E8F0',
    },
  scrollContent: { // Gi�?lại tên này đ�?không phải sửa nhiều, FlatList vẫn dùng được
    flexGrow: 1, // Quan trọng đ�?ListEmptyComponent có th�?căn giữa
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
    color: Color.text || '#1E1E1E'
  },
  testButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF08A',
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

    backgroundColor: Color.bg2 || '#E2E8F0',
    borderRadius: Border.br_20,
    padding: Padding.padding_15 || 15,
    marginBottom: Gap.gap_20 || 20,
  },
  emptyCardText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: Color.gray || '#64748B',
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
    color: Color.gray || '#64748B',
    textAlign: 'center',
  }
});
