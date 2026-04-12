import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CardsIcon, ListChecksIcon, PlusIcon } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/ScreenHeader';
import VocabularyCard from '../../components/VocabularyCard';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';

// Mock data tạm thời
const MOCK_WORDS = [
  {
    id: 'w1',
    word: '학교',
    pos: 'Danh từ',
    phonetic: '/hak-gyo/',
    meaning: 'Trường học',
    isFavorite: true,
  },
  {
    id: 'w2',
    word: '사랑하다',
    pos: 'Động từ',
    phonetic: '/sa-rang-ha-da/',
    meaning: 'Yêu',
    isFavorite: false,
  },
  {
    id: 'w3',
    word: '맛있다',
    pos: 'Tính từ',
    phonetic: '/ma-sit-da/',
    meaning: 'Ngon',
    isFavorite: false,
  },
];

export default function FlashcardSetDetailScreen() {
  const { id, title } = useLocalSearchParams();
  const router = useRouter();
  
  // Quản lý state cho danh sách từ để có thể toggle yêu thích
  const [words, setWords] = useState(MOCK_WORDS);

  const handleToggleFavorite = (wordId: string) => {
    setWords((prev) =>
      prev.map((item) =>
        item.id === wordId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={(title as string) || 'Chi tiết bộ từ vựng'} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Thống kê / Nút Hành động */}
        <View style={styles.actionContainer}>
          <Text style={styles.countText}>Tổng cộng: {words.length} từ vựng</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Color.main || '#98F291' }]} activeOpacity={0.8}>
              <CardsIcon size={24} color={Color.color || '#0C5F35'} weight="fill" />
              <Text style={[styles.actionBtnText, { color: Color.color || '#0C5F35' }]}>Học Flashcard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#E2E8F0' }]} activeOpacity={0.8}>
              <ListChecksIcon size={24} color={Color.text || '#1E1E1E'} weight="bold" />
              <Text style={[styles.actionBtnText, { color: Color.text || '#1E1E1E' }]}>Trắc nghiệm</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Header Danh sách */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Danh sách từ vựng</Text>
          <TouchableOpacity style={styles.addBtn}>
            <PlusIcon size={16} color={Color.main2 || '#166534'} weight="bold" />
            <Text style={styles.addBtnText}>Thêm từ</Text>
          </TouchableOpacity>
        </View>

        {/* Danh sách từ vựng */}
        <View style={styles.listContainer}>
          {words.map((item) => (
            <VocabularyCard 
              key={item.id} 
              item={item} 
              onToggleFavorite={() => handleToggleFavorite(item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.bg },
  content: { paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_15, paddingBottom: 40 },
  actionContainer: { marginBottom: Gap.gap_20 },
  countText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.gray, marginBottom: Gap.gap_15 },
  buttonRow: { flexDirection: 'row', gap: Gap.gap_15 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: Border.br_15, gap: Gap.gap_8 },
  actionBtnText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_15 },
  listTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Border.br_20 },
  addBtnText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.main2 || '#166534' },
  listContainer: { gap: 0 }, // Khoảng cách giữa các card đã được VocabularyCard tự xử lý qua marginBottom
});