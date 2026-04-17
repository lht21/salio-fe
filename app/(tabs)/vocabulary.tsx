import { useRouter } from 'expo-router';
import { PlusCircleIcon, PlusIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const CATEGORIES = ['Tất cả', 'Thành thạo', 'Đang học'];

const FLASHCARD_SETS = [
  {
    id: '1',
    title: 'Từ vựng Topik 1',
    totalWords: 120,
    color: '#F9F871', // Màu vàng chanh (hoặc Color.vang)
  },
  {
    id: '2',
    title: 'Giao tiếp cơ bản',
    totalWords: 50,
    color: '#CEF9B4', // Màu xanh lá nhạt
  },
  {
    id: '3',
    title: 'Từ vựng du lịch',
    totalWords: 85,
    color: '#E9D5FF', // Màu tím nhạt
  },
];

const INITIAL_VOCABULARY_ITEMS = [
  {
    id: '1',
    word: '학교',
    pos: 'Danh từ',
    phonetic: '/hak-gyo/',
    meaning: 'Trường học',
    isFavorite: true,
    status: 'Thành thạo',
  },
  {
    id: '2',
    word: '사랑하다',
    pos: 'Động từ',
    phonetic: '/sa-rang-ha-da/',
    meaning: 'Yêu',
    isFavorite: true,
    status: 'Đang học',
  },
  {
    id: '3',
    word: '맛있다',
    pos: 'Tính từ',
    phonetic: '/ma-sit-da/',
    meaning: 'Ngon',
    isFavorite: true,
    status: 'Thành thạo',
  },
  {
    id: '4',
    word: '사과',
    pos: 'Danh từ',
    phonetic: '/sa-gwa/',
    meaning: 'Quả táo',
    isFavorite: true,
    status: 'Đang học',
  },
  {
    id: '5',
    word: '예쁘다',
    pos: 'Tính từ',
    phonetic: '/ye-ppeu-da/',
    meaning: 'Đẹp',
    isFavorite: true,
    status: 'Đang học',
  },
  {
    id: '6',
    word: '가다',
    pos: 'Động từ',
    phonetic: '/ga-da/',
    meaning: 'Đi',
    isFavorite: true,
    status: 'Thành thạo',
  },
  {
    id: '7',
    word: '책상',
    pos: 'Danh từ',
    phonetic: '/chaek-sang/',
    meaning: 'Cái bàn',
    isFavorite: true,
    status: 'Đang học',
  },
  {
    id: '8',
    word: '친구',
    pos: 'Danh từ',
    phonetic: '/chin-gu/',
    meaning: 'Bạn bè',
    isFavorite: true,
    status: 'Thành thạo',
  },
  {
    id: '9',
    word: '먹다',
    pos: 'Động từ',
    phonetic: '/meok-da/',
    meaning: 'Ăn',
    isFavorite: true,
    status: 'Đang học',
  },
  {
    id: '10',
    word: '물',
    pos: 'Danh từ',
    phonetic: '/mul/',
    meaning: 'Nước',
    isFavorite: true,
    status: 'Thành thạo',
  },
  {
    id: '11',
    word: '밥',
    pos: 'Danh từ',
    phonetic: '/bap/',
    meaning: 'Cơm',
    isFavorite: true,
    status: 'Đang học',
  },
  {
    id: '12',
    word: '책',
    pos: 'Danh từ',
    phonetic: '/chaek/',
    meaning: 'Sách',
    isFavorite: true,
    status: 'Thành thạo',
  }
];

export default function VocabularyScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchText, setSearchText] = useState('');
  const [isNewSetModalVisible, setIsNewSetModalVisible] = useState(false);
  const [isSearchVocaModalVisible, setIsSearchVocaModalVisible] = useState(false);
  const [vocabularyItems, setVocabularyItems] = useState(INITIAL_VOCABULARY_ITEMS);

  const handleToggleFavorite = (id: string) => {
    setVocabularyItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    );
  };

  const filteredItems = vocabularyItems.filter(item => {
    const matchTab = activeTab === 'Tất cả' || item.status === activeTab;
    const matchSearch = item.word.toLowerCase().includes(searchText.toLowerCase()) || item.meaning.toLowerCase().includes(searchText.toLowerCase());
    return matchTab && matchSearch;
  });

  // Đếm số từ vựng đang được người dùng yêu thích (isFavorite === true)
  const favoriteCount = vocabularyItems.filter(item => item.isFavorite).length;

  // --- ANIMATION CHO STICKY SEARCHBAR ---
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const stickySearchBarStyle = useAnimatedStyle(() => {
    // Vị trí xuất hiện của Sticky SearchBar (Ước tính Header + Banner + Chips ~ 200px)
    const opacity = interpolate(scrollY.value, [200, 250], [0, 1], Extrapolation.CLAMP);
    const translateY = interpolate(scrollY.value, [200, 250], [-20, 0], Extrapolation.CLAMP);
    
    // Ẩn zIndex khi chưa xuất hiện để không đè thao tác bấm của các nút bên dưới
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

  // --- TÁCH CÁC PHẦN TỬ CHO FLATLIST ---

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
          {/* Thẻ Từ vựng yêu thích - Tự động hiển thị khi số lượng > 0 */}
          {favoriteCount > 0 && (
            <FlashcardSetCard 
              title="Từ vựng yêu thích" 
              totalWords={favoriteCount} 
              isSpecial={true}
              onPress={() => {
                router.push({
                  pathname: '/vocabulary/flashcardset-detail',
                  params: { id: 'favorite', title: 'Từ vựng yêu thích' }
                });
              }}
            />
          )}
          
          {FLASHCARD_SETS.map((set) => (
            <FlashcardSetCard 
              key={set.id} 
              title={set.title} 
              totalWords={set.totalWords} 
              backgroundColor={set.color} 
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
      {/* Nút thêm từ vựng (đã di chuyển từ footer) */}
      <TouchableOpacity
        style={styles.emptyCardButton}
        onPress={() => setIsSearchVocaModalVisible(true)}
        activeOpacity={0.7}
      >
        <PlusCircleIcon size={20} color={Color.gray || '#64748B'} weight="fill" />
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
          <VocabularyCard
            item={item}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
          />
        )}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>
          </View>
        }
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />

      {/* New FlashCard Set Modal */}
      <NewFlashCardSetModal
        isVisible={isNewSetModalVisible}
        onClose={() => setIsNewSetModalVisible(false)}
        onCreateSet={(setName, selectedWords) => {
          console.log('Tạo bộ từ vựng:', setName, selectedWords);
          // TODO: Gọi API để lưu bộ từ vựng mới
        }}
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
      paddingTop: 50, // Đồng bộ padding với safeArea để che kín phần nền ở tai thỏ
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
  scrollContent: { // Giữ lại tên này để không phải sửa nhiều, FlatList vẫn dùng được
    flexGrow: 1, // Quan trọng để ListEmptyComponent có thể căn giữa
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
    marginBottom: Gap.gap_20 || 20,
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

    backgroundColor: Color.stroke || '#E2E8F0',
    borderRadius: Border.br_20,
    padding: Padding.padding_15 || 15,
    // Nút này giờ nằm dưới SearchBar, nên không cần margin top
    marginBottom: Gap.gap_20 || 20, // Khoảng cách với danh sách từ vựng bên dưới
    gap: Gap.gap_10 || 10,
  },
  emptyCardText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: Color.gray || '#64748B',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14 || 14,
    color: Color.gray || '#64748B',
  }
});