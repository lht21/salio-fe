import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CardsIcon, ListChecksIcon, PlusIcon, ArrowLeftIcon, TrashIcon, PencilSimpleIcon } from 'phosphor-react-native';
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
import SearchVocaModal from '../../components/Modals/SearchVocaModal';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import { ConfirmModal } from '../../components/ModalResult/ConfirmModal';
import FlashcardService from '../../api/services/flashcard.service';

export default function FlashcardSetDetailScreen() {
  const { id, title } = useLocalSearchParams();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [displayTitle, setDisplayTitle] = useState((title as string) || 'Không có tên');

  // State cho chức năng sửa tên bộ từ vựng
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editTitleText, setEditTitleText] = useState('');
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  // State quản lý từ vựng đang được chọn để thao tác (nhấn giữ)
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  // State quản lý modal tìm kiếm từ vựng
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  // Quản lý state cho danh sách từ để có thể toggle yêu thích
  const [words, setWords] = useState<any[]>([]);

  // Ref để lưu id của Timeout cho việc xóa
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSetDetail = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      
      // Gọi đồng thời API lấy chi tiết bộ hiện tại và danh sách yêu thích
      const [res, favRes] = await Promise.all([
        FlashcardService.getSetById(id as string),
        FlashcardService.getSetById('favorite').catch(() => null) // Bỏ qua lỗi nếu set favorite chưa có
      ]);
      
      if (res.success && res.data) {
        setDisplayTitle(res.data.name);
        
        // Lưu trữ các ID từ vựng đã yêu thích vào một Set để tra cứu nhanh
        const favoriteIds = new Set();
        if (favRes && favRes.success && favRes.data) {
          (favRes.data.cards || []).forEach((c: any) => favoriteIds.add(c._id || c));
        }

        const mappedWords = (res.data.cards || []).map((card: any) => ({
          id: card._id,
          word: card.word,
          pos: card.type || card.category || 'Từ vựng',
          phonetic: card.pronunciationText || '',
          meaning: card.meaning,
          isFavorite: id === 'favorite' ? true : favoriteIds.has(card._id),
          status: card.learningStatus?.status || 'learning', // Lấy trạng thái học từ backend nếu có
        }));
        setWords(mappedWords);
      }
    } catch (error) {
      console.error('Lỗi lấy chi tiết bộ flashcard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSetDetail();
  }, [id]);

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

        // Gọi API thực sự sau 3 giây nếu không bị hủy
        if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
        deleteTimeoutRef.current = setTimeout(async () => {
          try {
            await FlashcardService.removeCardFromSet(id as string, wordToRemove.id);
          } catch (error) {
            console.error('Lỗi khi xóa từ vựng trên server:', error);
          }
        }, 3000);
      }
      setSelectedWordId(null);
    }
  };

  // Hàm xử lý khi người dùng bấm "Hoàn tác"
  const handleUndo = () => {
    if (deletedWord) {
      // Hủy gọi API xóa
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
        deleteTimeoutRef.current = null;
      }

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

  // --- HANDLER CHO SỬA TÊN BỘ TỪ VỰNG ---
  const handleUpdateTitle = async () => {
    if (!editTitleText.trim()) return;
    setIsUpdatingTitle(true);
    try {
      const res = await FlashcardService.updateSet(id as string, { name: editTitleText.trim() });
      if (res.success && res.data) {
        setDisplayTitle(res.data.name);
        setIsEditModalVisible(false);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật tên bộ từ vựng:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật tên bộ từ vựng.');
    } finally {
      setIsUpdatingTitle(false);
    }
  };

  // --- HANDLER CHO XÓA BỘ TỪ VỰNG ---
  const handleDeleteSet = () => {
    setIsDeleteConfirmVisible(true);
  };

  const executeDeleteSet = async () => {
    setIsDeleteConfirmVisible(false);
    try {
      const res = await FlashcardService.deleteSet(id as string);
      if (res.success) {
        router.back();
      }
    } catch (error) {
      console.error('Lỗi khi xóa bộ từ vựng:', error);
      Alert.alert('Lỗi', 'Không thể xóa bộ từ vựng.');
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const targetItem = words.find(item => item.id === id);
    if (!targetItem) return;

    const isCurrentlyFavorite = targetItem.isFavorite;

    // 1. Optimistic Update (Cập nhật UI ngay lập tức)
    setWords((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );

    try {
      // 2. Gọi API thực tế
      if (isCurrentlyFavorite) {
        await FlashcardService.removeCardFromSet('favorite', id);
      } else {
        await FlashcardService.addCardsToSet('favorite', { vocabIds: [id] });
      }
    } catch (error) {
      // 3. Rollback nếu API lỗi
      setWords((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isFavorite: isCurrentlyFavorite } : item))
      );
      console.error('Lỗi khi cập nhật yêu thích:', error);
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

  // --- HANDLER CHO NÚT HỌC FLASHCARD VÀ TRẮC NGHIỆM ---
  const handleStudyFlashcard = () => {
    if (words.length === 0) {
      return Alert.alert("Thông báo", "Bộ từ vựng này chưa có từ nào. Hãy thêm từ vựng trước khi học nhé!");
    }
    router.push({ pathname: '/vocabulary/flashcard-study', params: { setId: id } });
  };

  const handleQuiz = () => {
    if (words.length === 0) {
      return Alert.alert("Thông báo", "Bộ từ vựng này chưa có từ nào. Hãy thêm từ vựng trước khi kiểm tra nhé!");
    }
    router.push({ pathname: '/vocabulary/flashcard-quiz', params: { setId: id } });
  };

  // Tính toán tiến độ học
  const rememberedCount = words.filter(w => w.status === 'remembered').length;
  const forgottenCount = words.length - rememberedCount;
  const progressPercent = words.length > 0 ? (rememberedCount / words.length) * 100 : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon size={24} color={Color.text} weight="bold" />
        </TouchableOpacity>
          <Animated.Text style={[styles.headerTitle, headerTitleStyle]}>
            {displayTitle}
          </Animated.Text>
        {id !== 'favorite' ? (
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} onPress={() => {
              setEditTitleText(displayTitle);
              setIsEditModalVisible(true);
            }}>
              <PencilSimpleIcon size={24} color={Color.text} weight="fill" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleDeleteSet}>
              <TrashIcon size={24} color={Color.text} weight="fill" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ width: 64 }} />
        )}
      </View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.content}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <LinearGradient colors={['#CEF9B4', Color.main || '#98F291']} style={styles.gradientSection}>
          <View style={styles.titleWrapper}>
            <Text style={styles.bigTitle}>{displayTitle}</Text>
          </View>
          
          {/* Thanh tiến độ */}
          {words.length > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressStats}>
                <Text style={styles.progressText}>Đã thuộc: <Text style={{color: Color.main2 || '#16A34A'}}>{rememberedCount}</Text></Text>
                <Text style={styles.progressText}>Cần học: <Text style={{color: Color.cam || '#F97316'}}>{forgottenCount}</Text></Text>
              </View>
              <View style={styles.progressBarBgDetail}>
                <View style={[styles.progressBarFillDetail, { width: `${progressPercent}%` }]} />
              </View>
            </View>
          )}
          
          {/* Thống kê / Nút Hành động */}
          <View style={styles.actionContainer}>
            <Text style={styles.countText}>Tổng cộng: {words.length} từ vựng</Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: '#0F172A', borderBottomColor: '#000000' }]} 
                activeOpacity={0.8}
                onPress={handleStudyFlashcard}
              >
                <CardsIcon size={24} color={Color.main || '#98F291'} weight="fill" />
                <Text style={[styles.actionBtnText, { color: Color.main || '#98F291' }]}>Học Flashcard</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: '#FFFFFF', borderBottomColor: '#E2E8F0' }]} 
                activeOpacity={0.8}
                onPress={handleQuiz}
              >
                <ListChecksIcon size={24} color="#0F172A" weight="bold" />
                <Text style={[styles.actionBtnText, { color: '#0F172A' }]}>Trắc nghiệm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.bottomSection}>
          {/* Header Danh sách */}
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Danh sách từ vựng</Text>
            <TouchableOpacity 
              style={styles.addBtn}
              onPress={() => setIsSearchModalVisible(true)}
            >
              <PlusIcon size={18} color="#FFFFFF" weight="bold" />
              <Text style={styles.addBtnText}>Thêm từ</Text>
            </TouchableOpacity>
          </View>

          {/* Danh sách từ vựng */}
          <View style={styles.listContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={Color.main || '#98F291'} style={{ marginTop: 40 }} />
            ) : words.length === 0 ? (
              <View style={styles.emptyContainer}>
                <CardsIcon size={48} color={Color.stroke || '#E2E8F0'} weight="fill" style={{ marginBottom: 12 }} />
                <Text style={styles.emptyText}>
                  Chưa có từ vựng nào trong bộ này.
                </Text>
              </View>
            ) : words.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                activeOpacity={0.9}
                onPress={() => router.push({ pathname: '/vocabulary/vocabulary-detail', params: { wordId: item.id } })}
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
            
            <ActionMenuItem 
              label="Xóa khỏi bộ từ vựng" 
              variant="danger" 
              icon={<TrashIcon size={24} color={Color.red || '#EF4444'} weight="bold" />} 
              onPress={handleRemoveWord} 
            />
          </View>
        </View>
      </Modal>

      {/* --- MODAL SỬA TÊN BỘ TỪ VỰNG --- */}
      <Modal
        visible={isEditModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.editModalOverlay}>
          <View style={styles.editModalContent}>
            <Text style={styles.editModalTitle}>Sửa tên bộ từ vựng</Text>
            <TextInput
              style={styles.editModalInput}
              value={editTitleText}
              onChangeText={setEditTitleText}
              placeholder="Nhập tên mới..."
              placeholderTextColor={Color.gray}
              autoFocus
            />
            <View style={styles.editModalActions}>
              <TouchableOpacity
                style={[styles.editModalBtn, styles.editModalCancelBtn]}
                onPress={() => setIsEditModalVisible(false)}
                disabled={isUpdatingTitle}
              >
                <Text style={styles.editModalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editModalBtn, styles.editModalSaveBtn]}
                onPress={handleUpdateTitle}
                disabled={isUpdatingTitle || !editTitleText.trim()}
              >
                {isUpdatingTitle ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.editModalSaveText}>Lưu</Text>
                )}
              </TouchableOpacity>
            </View>
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

      {/* --- MODAL TÌM VÀ THÊM TỪ VỰNG --- */}
      <SearchVocaModal
        isVisible={isSearchModalVisible}
        onClose={() => {
          setIsSearchModalVisible(false);
          fetchSetDetail(); // Tải lại danh sách từ vựng sau khi modal đóng
        }}
        setId={id as string}
      />

      {/* --- MODAL XÁC NHẬN XÓA BỘ TỪ VỰNG --- */}
      <ConfirmModal
        isVisible={isDeleteConfirmVisible}
        title="Xóa bộ từ vựng"
        subtitle="Bạn có chắc chắn muốn xóa bộ từ vựng này không? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        isDestructive={true}
        onConfirm={executeDeleteSet}
        onCancel={() => setIsDeleteConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#CEF9B4' },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.padding_15,
    paddingVertical: 12,
    backgroundColor: '#CEF9B4',
  },
  backButton: { padding: 4 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconButton: { padding: 4 },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  content: { flexGrow: 1, backgroundColor: Color.bg, paddingBottom: 40 },
  gradientSection: {
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
    paddingBottom: Gap.gap_20,
    borderBottomLeftRadius: Border.br_30 || 30,
    borderBottomRightRadius: Border.br_30 || 30,
    shadowColor: Color.main || '#98F291',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: Gap.gap_20,
  },
  titleWrapper: { marginBottom: Gap.gap_15 },
  bigTitle: { fontFamily: FontFamily.lexendDecaBold, fontSize: 32, color: '#0C5F35' },
  actionContainer: { marginBottom: Gap.gap_20 },
  countText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: '#064E3B', opacity: 0.8, marginBottom: Gap.gap_15 },
  progressContainer: { backgroundColor: '#FFFFFF', borderRadius: Border.br_20, padding: Padding.padding_15, marginBottom: Gap.gap_15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  progressStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14, color: Color.text },
  progressBarBgDetail: { height: 8, backgroundColor: Color.stroke, borderRadius: 4, overflow: 'hidden' },
  progressBarFillDetail: { height: 8, backgroundColor: Color.main, borderRadius: 4 },
  buttonRow: { flexDirection: 'row', gap: Gap.gap_15 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: Border.br_20 || 20, gap: Gap.gap_8, borderBottomWidth: 4 },
  actionBtnText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14 },
  bottomSection: { paddingHorizontal: Padding.padding_15 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_15 },
  listTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text },
  addBtn: { 
    flexDirection: 'row', alignItems: 'center', gap: 4, 
    backgroundColor: Color.main2 || '#22C55E', 
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: Border.br_20,
    shadowColor: '#22C55E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  addBtnText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_12, color: '#FFFFFF' },
  listContainer: { gap: 0 }, // Khoảng cách giữa các card đã được VocabularyCard tự xử lý qua marginBottom
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { textAlign: 'center', color: Color.gray, fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14 },

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
  
  // --- STYLES CHO MODAL EDIT ---
  editModalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: Padding.padding_20 },
  editModalContent: { backgroundColor: Color.bg, borderRadius: Border.br_20, padding: Padding.padding_20, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  editModalTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text, marginBottom: Gap.gap_15 },
  editModalInput: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.text, borderWidth: 1, borderColor: Color.stroke, borderRadius: Border.br_10, paddingHorizontal: Padding.padding_15, paddingVertical: 12, marginBottom: Gap.gap_20 },
  editModalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Gap.gap_10 },
  editModalBtn: { paddingHorizontal: Padding.padding_20, paddingVertical: 10, borderRadius: Border.br_10, justifyContent: 'center', alignItems: 'center' },
  editModalCancelBtn: { backgroundColor: Color.stroke },
  editModalSaveBtn: { backgroundColor: Color.main2 || '#22C55E' },
  editModalCancelText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.text },
  editModalSaveText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: '#FFFFFF' },
});