import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { PlusIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Padding, Gap } from '../../constants/GlobalStyles';

// Import các components đã tách
import FlashcardSetCard from '../../components/FlashcardSetCard';
import VocabularyCard from '../../components/VocabularyCard';
import CategoryChip from '../../components/CategoryChip';
import SearchBar from '../../components/SearchBar';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = ['Tất cả', 'Thành thạo', 'Đang học'];

export default function VocabularyScreen() {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sổ tay từ vựng</Text>
          <TouchableOpacity>
            <PlusIcon size={24} color={Color.text || '#1E1E1E'} weight="bold" />
          </TouchableOpacity>
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
        {[1, 2, 3, 4].map(i => (
          <VocabularyCard key={i} item={{
            word: 'Đáp án',
            pos: i % 2 === 0 ? 'Động từ' : 'Danh từ',
            phonetic: '/hak sen/',
            meaning: 'Hàn Quốc'
          }} />
        ))}

        {/* Footer Add */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addCircle}>
            <PlusIcon size={24} color={Color.gray || '#64748B'} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.footerText}>Lưu thêm từ vựng</Text>
        </View>
      </ScrollView>
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