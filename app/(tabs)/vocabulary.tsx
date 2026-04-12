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

const INITIAL_VOCABULARY_ITEMS = [
  {
    id: '1',
    word: 'Đáp án',
    pos: 'Danh từ',
    phonetic: '/hak sen/',
    meaning: 'Hàn Quốc',
    isFavorite: true,
  },
  {
    id: '2',
    word: 'Đáp án',
    pos: 'Động từ',
    phonetic: '/hak sen/',
    meaning: 'Hàn Quốc',
    isFavorite: true,
  },
  {
    id: '3',
    word: 'Đáp án',
    pos: 'Tính từ',
    phonetic: '/hak sen/',
    meaning: 'Hàn Quốc',
    isFavorite: false,
  },
  {
    id: '4',
    word: 'Đáp án',
    pos: 'Tính từ',
    phonetic: '/hak sen/',
    meaning: 'Hàn Quốc',
    isFavorite: false,
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
        <FlashcardSetCard />

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
        {vocabularyItems.map((item) => (
          <VocabularyCard
            key={item.id}
            item={item}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
          />
        ))}

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
  }
});