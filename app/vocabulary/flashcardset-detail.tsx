import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CardsIcon, ListChecksIcon, PlusIcon, ArrowLeftIcon, TrashIcon, PencilSimpleIcon } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

import VocabularyCard from '../../components/VocabularyCard';
import ActionMenuItem from '../../components/ActionMenuItem';
import SearchVocaModal from '../../components/Modals/SearchVocaModal';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import { ConfirmModal } from '../../components/ModalResult/ConfirmModal';
import FlashcardService from '../../api/services/flashcard.service';
import IconButton from '../../components/IconButton';
import ReviewModeCard from '../../components/ReviewModeCard';
import ProgressBar from '../../components/ProgressBar';

export default function FlashcardSetDetailScreen() {
  const { id, title } = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [displayTitle, setDisplayTitle] = useState((title as string) || t('vocabulary.no_name', 'Không có tên'));

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
      Alert.alert(t('common.error', 'Lỗi'), t('vocabulary.update_name_error', 'Không thể cập nhật tên bộ từ vựng.'));
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
      Alert.alert(t('common.error', 'Lỗi'), t('vocabulary.delete_set_error', 'Không thể xóa bộ từ vựng.'));
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
      return Alert.alert(t('common.notice', 'Thông báo'), t('vocabulary.empty_study', 'Bộ từ vựng này chưa có từ nào. Hãy thêm từ vựng trước khi học nhé!'));
    }
    router.push({ pathname: '/vocabulary/flashcard-study', params: { setId: id } });
  };

  const handleQuiz = () => {
    if (words.length === 0) {
      return Alert.alert(t('common.notice', 'Thông báo'), t('vocabulary.empty_quiz', 'Bộ từ vựng này chưa có từ nào. Hãy thêm từ vựng trước khi kiểm tra nhé!'));
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
        <IconButton Icon={ArrowLeftIcon} variant="Stroke" onPress={() => router.back()} />
          <Animated.Text style={[styles.headerTitle, headerTitleStyle]}>
            {displayTitle}
          </Animated.Text>
        {id !== 'favorite' ? (
          <View style={styles.headerActions}>
            <IconButton Icon={TrashIcon} variant="Stroke" onPress={handleDeleteSet} />
            <IconButton Icon={PencilSimpleIcon} variant="Stroke" onPress={() => {
              setEditTitleText(displayTitle);
              setIsEditModalVisible(true);
            }} />
            <IconButton Icon={PlusIcon} variant="Main" onPress={() => setIsSearchModalVisible(true)} />
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
        <View style={styles.topSection}>
          <View style={styles.titleWrapper}>
            <Text style={styles.bigTitle}>{displayTitle}</Text>
          </View>
          
          {/* Thanh tiến độ */}
          {words.length > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressStats}>
                <Text style={styles.progressText}>{t('vocabulary.remembered_count_label', 'Đã thuộc: ')}<Text style={{color: colors.picVocabText}}>{rememberedCount}</Text></Text>
                <Text style={styles.progressText}>{t('vocabulary.learn_again_label', 'Cần học: ')}<Text style={{color: colors.cam}}>{forgottenCount}</Text></Text>
              </View>
              <ProgressBar progress={progressPercent / 100} height={8} />
            </View>
          )}
          
          {/* Thống kê / Nút Hành động */}
          <View style={styles.actionContainer}>
            <Text style={styles.countText}>{t('vocabulary.total_words', { count: words.length, defaultValue: `Tổng cộng: ${words.length} từ vựng` })}</Text>
            
            <View style={styles.reviewModesContainer}>
              <ReviewModeCard 
                label={t('vocabulary.study_flashcard', 'Học Flashcard')}
                icon={<CardsIcon size={36} color="#B05200" weight="bold" />}
                onPress={handleStudyFlashcard}
              />
              <ReviewModeCard 
                label={t('vocabulary.quiz_mode', 'Chế độ Trắc nghiệm')}
                icon={<ListChecksIcon size={36} color="#B05200" weight="bold" />}
                onPress={handleQuiz}
              />
            </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          {/* Header Danh sách */}
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>{t('vocabulary.word_list', 'Danh sách từ vựng')}</Text>
          </View>

          {/* Danh sách từ vựng */}
          <View style={styles.listContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.main} style={{ marginTop: 40 }} />
            ) : words.length === 0 ? (
              <View style={styles.emptyContainer}>
                <CardsIcon size={48} color={colors.stroke} weight="fill" style={{ marginBottom: 12 }} />
                <Text style={styles.emptyText}>
                  {t('vocabulary.empty_set_list', 'Chưa có từ vựng nào trong bộ này.')}
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
              label={t('vocabulary.remove_from_set', 'Xóa khỏi bộ từ vựng')} 
              variant="danger" 
              icon={<TrashIcon size={24} color={colors.red} weight="bold" />} 
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
            <Text style={styles.editModalTitle}>{t('vocabulary.edit_set_name', 'Sửa tên bộ từ vựng')}</Text>
            <TextInput
              style={styles.editModalInput}
              value={editTitleText}
              onChangeText={setEditTitleText}
              placeholder={t('vocabulary.enter_new_name', 'Nhập tên mới...')}
              placeholderTextColor={colors.gray}
              autoFocus
            />
            <View style={styles.editModalActions}>
              <TouchableOpacity
                style={[styles.editModalBtn, styles.editModalCancelBtn]}
                onPress={() => setIsEditModalVisible(false)}
                disabled={isUpdatingTitle}
              >
                <Text style={styles.editModalCancelText}>{t('common.cancel', 'Hủy')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editModalBtn, styles.editModalSaveBtn]}
                onPress={handleUpdateTitle}
                disabled={isUpdatingTitle || !editTitleText.trim()}
              >
                {isUpdatingTitle ? (
                  <ActivityIndicator size="small" color={colors.blackActionText} />
                ) : (
                  <Text style={styles.editModalSaveText}>{t('common.save', 'Lưu')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- TOAST THÔNG BÁO HOÀN TÁC --- */}
      {deletedWord && (
        <Animated.View style={[styles.toastContainer, toastStyle]}>
          <Text style={styles.toastText}>{t('vocabulary.deleted_one_word', 'Đã xóa 1 từ vựng')}</Text>
          <TouchableOpacity onPress={handleUndo} style={styles.undoBtn}>
            <Text style={styles.undoText}>{t('common.undo', 'Hoàn tác')}</Text>
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
        title={t('vocabulary.delete_set', 'Xóa bộ từ vựng')}
        subtitle={t('vocabulary.delete_set_confirm', 'Bạn có chắc chắn muốn xóa bộ từ vựng này không? Hành động này không thể hoàn tác.')}
        confirmText={t('common.delete', 'Xóa')}
        cancelText={t('common.cancel', 'Hủy')}
        isDestructive={true}
        onConfirm={executeDeleteSet}
        onCancel={() => setIsDeleteConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.padding_15,
    paddingVertical: 12,
    backgroundColor: colors.bg,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Gap.gap_10 || 10 },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: colors.text,
  },
  content: { flexGrow: 1, backgroundColor: colors.bg, paddingBottom: 40 },
  topSection: {
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
    paddingBottom: Gap.gap_20,
    marginBottom: Gap.gap_20,
  },
  titleWrapper: { marginBottom: Gap.gap_15 },
  bigTitle: { fontFamily: FontFamily.lexendDecaBold, fontSize: 32, color: colors.text },
  actionContainer: { marginBottom: Gap.gap_20 },
  countText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.gray, marginBottom: Gap.gap_15 },
  progressContainer: { backgroundColor: colors.bg, borderRadius: Border.br_20, padding: Padding.padding_15, marginBottom: Gap.gap_15, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  progressStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14, color: colors.text },
  reviewModesContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: Gap.gap_10 || 10 },
  bottomSection: { paddingHorizontal: Padding.padding_15 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_15 },
  listTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.text },
  listContainer: { gap: 0 }, // Khoảng cách giữa các card đã được VocabularyCard tự xử lý qua marginBottom
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { textAlign: 'center', color: colors.gray, fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14 },

  // --- STYLES CHO BOTTOM SHEET MODAL ---
  overlay: { flex: 1, backgroundColor: colors.modalOverlayBg, justifyContent: 'flex-end' },
  backgroundTouchable: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  sheetContent: {
    backgroundColor: colors.bg, borderTopLeftRadius: Border.br_30, borderTopRightRadius: Border.br_30,
    paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_15, paddingBottom: 40, 
  },
  dragHandle: {
    width: 40, height: 5, borderRadius: 3, backgroundColor: colors.dragHandleBg, alignSelf: 'center', marginBottom: Gap.gap_20,
  },
  favoriteHintText: {
    fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: colors.gray, textAlign: 'center', lineHeight: 22,
  },

  // --- STYLES CHO TOAST UNDO ---
  toastContainer: {
    position: 'absolute', bottom: 40, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.toastBg, // Màu nền xám đậm
    paddingVertical: 14, paddingHorizontal: 20,
    borderRadius: Border.br_30, width: '90%',
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 6,
    zIndex: 9999,
  },
  toastText: {
    color: colors.toastText, fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14,
  },
  undoBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  undoText: {
    color: colors.main, fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14,
  },
  
  // --- STYLES CHO MODAL EDIT ---
  editModalOverlay: { flex: 1, backgroundColor: colors.modalOverlayBg, justifyContent: 'center', alignItems: 'center', padding: Padding.padding_20 },
  editModalContent: { backgroundColor: colors.bg, borderRadius: Border.br_20, padding: Padding.padding_20, width: '100%', shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  editModalTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.text, marginBottom: Gap.gap_15 },
  editModalInput: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: colors.text, borderWidth: 1, borderColor: colors.stroke, borderRadius: Border.br_10, paddingHorizontal: Padding.padding_15, paddingVertical: 12, marginBottom: Gap.gap_20 },
  editModalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Gap.gap_10 },
  editModalBtn: { paddingHorizontal: Padding.padding_20, paddingVertical: 10, borderRadius: Border.br_10, justifyContent: 'center', alignItems: 'center' },
  editModalCancelBtn: { backgroundColor: colors.stroke },
  editModalSaveBtn: { backgroundColor: colors.addBtnBg },
  editModalCancelText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.text },
  editModalSaveText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.blackActionText },
});