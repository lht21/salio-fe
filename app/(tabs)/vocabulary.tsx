import { useRouter } from 'expo-router';
import { PlusIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';

// Import các components đã tách
import CategoryChip from '../../components/CategoryChip';
import FlashcardSetCard from '../../components/FlashcardSetCard';
import NewFlashCardSetModal from '../../components/Modals/NewFlashCardSetModal';
import SearchVocaModal from '../../components/Modals/SearchVocaModal';
import SearchBar from '../../components/SearchBar';
import VocabularyCard from '../../components/VocabularyCard';

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

  return (
    <View style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sổ tay từ vựng</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => router.push('/vocabulary-test')}
              style={styles.testButton}
            >
              <Text style={styles.testButtonText}>🧪</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsNewSetModalVisible(true)}>
              <PlusIcon size={24} color={Color.text || '#1E1E1E'} weight="bold" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bannerScroll}>
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

        {/* List */}
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <VocabularyCard
              key={item.id}
              item={item}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>
          </View>
        )}

        {/* Footer Add */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addCircle}
            onPress={() => setIsSearchVocaModalVisible(true)}
          >
            <PlusIcon size={24} color={Color.gray || '#64748B'} weight="bold" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSearchVocaModalVisible(true)}>
            <Text style={styles.footerText}>Lưu thêm từ vựng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
  scrollContent: {
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
  footer: {
    alignItems: 'center',
    marginTop: 20
  },
  addCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Color.colorLightgray || '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  footerText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 14,
    color: Color.colorDarkgray || '#94A3B8'
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14 || 14,
    color: Color.gray || '#64748B',
  }
});