import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CardsIcon, ListChecksIcon, PlusIcon, ArrowLeftIcon, TrashIcon } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

import VocabularyCard from '../../components/VocabularyCard';
import ActionMenuItem from '../../components/ActionMenuItem';
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
  
  // State quản lý từ vựng đang được chọn để thao tác (nhấn giữ)
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  // Quản lý state cho danh sách từ để có thể toggle yêu thích
  const [words, setWords] = useState(MOCK_WORDS);

  const handleToggleFavorite = (wordId: string) => {
    setWords((prev) =>
      prev.map((item) =>
        item.id === wordId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  // State quản lý từ vựng vừa xóa để hoàn tác
  const [deletedWord, setDeletedWord] = useState<{ index: number, word: any } | null>(null);
  const toastOpacity = useSharedValue(0);
  const toastTranslateY = useSharedValue(50);

  // Hàm xử lý xóa từ vựng khỏi bộ hiện tại
  const handleRemoveWord = () => {
    if (selectedWordId) {
      const wordIndex = words.findIndex((item) => item.id === selectedWordId);
      const wordToRemove = words[wordIndex];

      if (wordToRemove) {
        setDeletedWord({ index: wordIndex, word: wordToRemove });
        setWords((prev) => prev.filter((item) => item.id !== selectedWordId));

        // Hiện Toast Notification
        toastOpacity.value = 0;
        toastTranslateY.value = 50;

        toastOpacity.value = withSequence(
          withTiming(1, { duration: 300 }),
          withDelay(3000, withTiming(0, { duration: 300 }, (finished) => {
            if (finished) runOnJS(setDeletedWord)(null); // Xóa khỏi bộ nhớ đệm tạm sau khi ẩn
          }))
        );

        toastTranslateY.value = withSequence(
          withSpring(0),
          withDelay(3000, withTiming(50, { duration: 300 }))
        );
      }
      setSelectedWordId(null);
    }
  };

  // Hàm xử lý khi người dùng bấm "Hoàn tác"
  const handleUndo = () => {
    if (deletedWord) {
      setWords((prev) => {
        const newWords = [...prev];
        newWords.splice(deletedWord.index, 0, deletedWord.word); // Chèn lại đúng vị trí ban đầu
        return newWords;
      });
      // Ẩn Toast ngay lập tức
      toastOpacity.value = withTiming(0, { duration: 200 });
      toastTranslateY.value = withTiming(50, { duration: 200 });
      setDeletedWord(null);
    }
  };

  const toastStyle = useAnimatedStyle(() => ({
    opacity: toastOpacity.value,
    transform: [{ translateY: toastTranslateY.value }],
  }));

  // --- ANIMATION CHO TITLE TRÊN HEADER ---
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerTitleStyle = useAnimatedStyle(() => {
    // Tiêu đề từ từ hiện ra khi scroll qua tọa độ 80 -> 120 (khoảng qua ButtonRow)
    const opacity = interpolate(scrollY.value, [80, 120], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon size={24} color="#FFFFFF" weight="bold" />
        </TouchableOpacity>
        <Animated.Text style={[styles.headerTitle, headerTitleStyle]}>
          {(title as string) || 'Không có tên'}
        </Animated.Text>
        {/* View trống để căn giữa title */}
        <View style={{ width: 32 }} />
      </View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.content}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <LinearGradient colors={[Color.main || '#98F291', Color.bg]} style={styles.gradientSection}>
          <View style={styles.titleWrapper}>
            <Text style={styles.bigTitle}>{(title as string) || 'Không có tên'}</Text>
          </View>
          
          {/* Thống kê / Nút Hành động */}
          <View style={styles.actionContainer}>
            <Text style={styles.countText}>Tổng cộng: {words.length} từ vựng</Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Color.text || '#98F291' }]} activeOpacity={0.8}>
                <CardsIcon size={24} color={Color.main || '#0C5F35'} weight="fill" />
                <Text style={[styles.actionBtnText, { color: Color.bg || '#0C5F35' }]}>Học Flashcard</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Color.text }]} activeOpacity={0.8}>
                <ListChecksIcon size={24} color={Color.main || '#1E1E1E'} weight="bold" />
                <Text style={[styles.actionBtnText, { color: Color.bg || '#1E1E1E' }]}>Trắc nghiệm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.bottomSection}>
          {/* Header Danh sách */}
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Danh sách từ vựng</Text>
            <TouchableOpacity style={styles.addBtn}>
              <PlusIcon size={24} color={Color.text || '#166534'} weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Danh sách từ vựng */}
          <View style={styles.listContainer}>
            {words.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                activeOpacity={0.9}
                onLongPress={() => setSelectedWordId(item.id)}
                delayLongPress={200}
              >
                <VocabularyCard 
                  item={item} 
                  onToggleFavorite={() => handleToggleFavorite(item.id)}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* --- MODAL TÙY CHỌN KHI NHẤN GIỮ TỪ VỰNG --- */}
      <Modal
        visible={!!selectedWordId}
        animationType="slide" 
        transparent={true}
        onRequestClose={() => setSelectedWordId(null)}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backgroundTouchable} onPress={() => setSelectedWordId(null)} />
          <View style={styles.sheetContent}>
            <View style={styles.dragHandle} />
            
            {id !== 'favorite' ? (
              <ActionMenuItem 
                label="Xóa khỏi bộ từ vựng" 
                variant="danger" 
                icon={<TrashIcon size={24} color={Color.red || '#EF4444'} weight="bold" />} 
                onPress={handleRemoveWord} 
              />
            ) : (
              <Text style={styles.favoriteHintText}>
                Đây là bộ "Từ vựng yêu thích". Hãy nhấn vào biểu tượng trái tim trên thẻ nếu bạn muốn loại bỏ từ vựng này nhé!
              </Text>
            )}
          </View>
        </View>
      </Modal>

      {/* --- TOAST THÔNG BÁO HOÀN TÁC --- */}
      {deletedWord && (
        <Animated.View style={[styles.toastContainer, toastStyle]}>
          <Text style={styles.toastText}>Đã xóa 1 từ vựng</Text>
          <TouchableOpacity onPress={handleUndo} style={styles.undoBtn}>
            <Text style={styles.undoText}>Hoàn tác</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.main || '#98F291' },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.padding_15,
    paddingVertical: 12,
    backgroundColor: Color.main || '#98F291',
  },
  backButton: { padding: 4 },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: '#FFFFFF',
  },
  content: { flexGrow: 1, backgroundColor: Color.bg, paddingBottom: 40 },
  gradientSection: {
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
    paddingBottom: Gap.gap_20,
  },
  titleWrapper: { marginBottom: Gap.gap_15 },
  bigTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_24, color: Color.text },
  actionContainer: { marginBottom: Gap.gap_20 },
  countText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.gray, marginBottom: Gap.gap_15 },
  buttonRow: { flexDirection: 'row', gap: Gap.gap_15 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: Border.br_15, gap: Gap.gap_8, borderBottomWidth: 5, borderBottomColor: Color.color || '#0C5F35' },
  actionBtnText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14 },
  bottomSection: { paddingHorizontal: Padding.padding_15 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_15 },
  listTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Color.stroke, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Border.br_20 },
  addBtnText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.main2 || '#166534' },
  listContainer: { gap: 0 }, // Khoảng cách giữa các card đã được VocabularyCard tự xử lý qua marginBottom

  // --- STYLES CHO BOTTOM SHEET MODAL ---
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  backgroundTouchable: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  sheetContent: {
    backgroundColor: Color.bg, borderTopLeftRadius: Border.br_30, borderTopRightRadius: Border.br_30,
    paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_15, paddingBottom: 40, 
  },
  dragHandle: {
    width: 40, height: 5, borderRadius: 3, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: Gap.gap_20,
  },
  favoriteHintText: {
    fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.gray, textAlign: 'center', lineHeight: 22,
  },

  // --- STYLES CHO TOAST UNDO ---
  toastContainer: {
    position: 'absolute', bottom: 40, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#1E293B', // Màu nền xám đậm
    paddingVertical: 14, paddingHorizontal: 20,
    borderRadius: Border.br_30, width: '90%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 6,
    zIndex: 9999,
  },
  toastText: {
    color: '#FFFFFF', fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14,
  },
  undoBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  undoText: {
    color: Color.main || '#98F291', fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14,
  },
});