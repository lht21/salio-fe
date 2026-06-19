import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

// --- IMPORT COMPONENTS & CONSTANTS ---
import { Color, FontFamily, FontSize, Padding, Border, Gap } from '../../../../constants/GlobalStyles';
import IconButton from '../../../../components/IconButton';
import { XIcon, QuestionIcon } from 'phosphor-react-native';
import Button from '../../../../components/Button';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';
import VocabularyService from '../../../../api/services/vocabulary.service';

// --- TYPE & MOCK DATA ---
type LearningStatus = 'remembered' | 'learning' | 'forgotten';

interface VocabItem {
  id: string;
  word: string;
  status: LearningStatus;
}

const getStatusColor = (status: LearningStatus) => {
  switch (status) {
    case 'remembered': return Color.main || '#98F291'; // Xanh chính
    case 'learning': return '#3B82F6';               // Blue
    case 'forgotten': return Color.cam || '#F59E0B'; // Cam
    default: return Color.stroke;
  }
};

const getStatusText = (status: LearningStatus) => {
  switch (status) {
    case 'remembered': return 'Thành thạo';
    case 'learning': return 'Đang học';
    case 'forgotten': return 'Chưa học';
    default: return '';
  }
};

const VocabularyReviewItem = ({ item, onPress }: { item: VocabItem; onPress: () => void }) => {
  const color = getStatusColor(item.status);
  
  return (
    <View style={styles.reviewItemContainer}>
      <TouchableOpacity 
        activeOpacity={0.8}
        style={[styles.reviewSquare, { borderColor: color }]}
        onPress={onPress}
      >
        <Text style={styles.reviewWord} numberOfLines={1} adjustsFontSizeToFit>{item.word}</Text>
      </TouchableOpacity>
      <View style={[styles.statusBadge, { backgroundColor: color }]}>
        <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
      </View>
    </View>
  );
};

export default function VocabularyIntroScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams();
  const toast = useToast();

  // STATE HIỂN THỊ MODAL THOÁT
  const [showExitModal, setShowExitModal] = useState(false);
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // BOTTOM SHEET REF
  const tipSheetRef = useRef<BottomSheetModal>(null);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  useEffect(() => {
    if (lessonId) {
      fetchVocabularies();
    }
    
    // Tự động mở Bottom Sheet Mẹo khi vừa click vào trang
    const timer = setTimeout(() => {
      tipSheetRef.current?.present();
    }, 600);
    
    return () => clearTimeout(timer);
  }, [lessonId]);

  const fetchVocabularies = async () => {
    try {
      setIsLoading(true);
      const response = await VocabularyService.getStudyQueue({ lessonId: lessonId as string, limit: 100 });
      if (response.success && response.data) {
        const mappedVocab: VocabItem[] = response.data.map((item: any) => ({
          id: item._id,
          word: item.word,
          status: item.learningStatus?.status || 'learning',
        }));
        setVocabList(mappedVocab);
      }
    } catch (error) {
      toast.show('Không thể tải danh sách từ vựng', { type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- XỬ LÝ SỰ KIỆN ---
  const handleStart = () => {
    // Điều hướng tới màn hình làm thẻ ghi nhớ (Flashcard)
    router.push(`/lessons/${lessonId}/vocabulary/flashcard`);
  };

  const handleToggleStatus = async (item: VocabItem) => {
    let nextStatus: LearningStatus = 'learning';
    if (item.status === 'remembered') nextStatus = 'learning';
    else if (item.status === 'learning') nextStatus = 'forgotten';
    else if (item.status === 'forgotten') nextStatus = 'remembered';

    // Optimistic Update: Cập nhật giao diện ngay lập tức
    setVocabList(prev => prev.map(v => v.id === item.id ? { ...v, status: nextStatus } : v));

    try {
      await VocabularyService.markStatus(item.id, { status: nextStatus, lessonId: lessonId as string });
    } catch (error) {
      // Revert lại trạng thái cũ nếu API báo lỗi
      setVocabList(prev => prev.map(v => v.id === item.id ? { ...v, status: item.status } : v));
      toast.show('Cập nhật trạng thái thất bại', { type: 'danger' });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* 1. HEADER: Nút Mẹo và nút X */}
      <View style={styles.header}>
        <View style={styles.headerActions}>
          <IconButton Icon={QuestionIcon} onPress={() => tipSheetRef.current?.present()} />
          <IconButton Icon={XIcon} onPress={() => setShowExitModal(true)} />
        </View>
      </View>

      {/* 2. NỘI DUNG CHÍNH */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Phần 1: Hình ảnh minh họa */}
        <Image
          source={require('../../../../assets/images/horani/flashcard3.png')}
          resizeMode="cover"
        />

        {/* Phần 2: Tiêu đề Vòng học */}
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>Thẻ ghi nhớ</Text>
        </View>

        {/* Phần 3: Khung mô tả */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>
Thay vì học vẹt, bạn sẽ đi qua vòng lặp ghi nhớ tự nhiên: Nhận diện từ Hàn (Mặt 1) → Kích thích não bộ đoán Nghĩa Việt (Mặt 2) → Ứng dụng vào Câu ví dụ cùng hình ảnh chú hổ minh họa sinh động (Mặt 3). Phương pháp này giúp kích hoạt trí nhớ chủ động và tăng 200% hiệu quả phản xạ ngôn ngữ thực tế!          </Text>
        </View>
        
        {/* Phần 4: Xem trước từ vựng */}
        <View style={styles.previewSection}>
          <Text style={styles.previewHeader}>Xem trước từ vựng</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color={Color.main} />
          ) : (
            <View style={styles.gridContainer}>
              {vocabList.map(item => (
                <VocabularyReviewItem 
                  key={item.id} 
                  item={item} 
                  onPress={() => handleToggleStatus(item)} 
                />
              ))}
            </View>
          )}
        </View>
        
      </ScrollView>

      {/* 3. FOOTER: Nút Bắt đầu */}
      <View style={styles.footer}>
        <Button 
          title="Bắt đầu" 
          variant="Green" 
          onPress={handleStart} 
        />
      </View>

      {/* MODAL XÁC NHẬN THOÁT HỌC GIỮA CHỪNG */}
      <ConfirmModal 
        isVisible={showExitModal}
        title="Đang học dở mà"
        subtitle="Bạn sắp hoàn thành rồi, cố thêm chút nữa nhé!"
        cancelText="Vẫn rời đi"
        confirmText="Học tiếp"
        onCancel={() => {
          setShowExitModal(false);
          router.back();
        }}
        onConfirm={() => setShowExitModal(false)}
      />

      {/* BOTTOM SHEET MẸO */}
      <BottomSheetModal
        ref={tipSheetRef}
        snapPoints={['40%']}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: Color.bg, borderRadius: Border.br_30 }}
        handleIndicatorStyle={{ backgroundColor: Color.stroke }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Mẹo</Text>
          <Text style={styles.sheetDesc}>
            Tại vòng này chỉ học những từ mà bạn Đang học và chưa học, nên những từ nào bạn muốn học hãy nhấp vào nó cho nó chuyển sang màu cam hoặc xanh để được ôn tập lại nhé!
          </Text>
          <Button 
            title="Đã hiểu" 
            variant="Green" 
            onPress={() => tipSheetRef.current?.dismiss()} 
            style={styles.sheetButton} 
          />
        </BottomSheetView>
      </BottomSheetModal>

    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Padding.padding_20,
    alignItems: 'center',
    paddingBottom: 20,
  },

  illustration: {
    width: 250,
    height: 250,
    marginBottom: Gap.gap_20,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: Gap.gap_20,
  },
  
  roundText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_24,
    color: Color.text,
  },
  
  titleText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_24,
    color: Color.cam,
  },

  descriptionBox: {
    width: '100%',
    backgroundColor: Color.greenLight,
    padding: Padding.padding_20,
    borderRadius: Border.br_30,
    borderWidth: 1.5,
    borderColor: Color.main,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  
  descriptionText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.text,
    textAlign: 'center',
    lineHeight: 22,
  },

  previewSection: {
    width: '100%',
    marginTop: Gap.gap_20,
    alignItems: 'center',
  },
  previewHeader: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 20,
    color: Color.main,
    marginBottom: Gap.gap_20,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  reviewItemContainer: {
    width: '31%', // 3 cột
    alignItems: 'center',
    marginBottom: Gap.gap_20,
  },
  reviewSquare: {
    width: '100%',
    aspectRatio: 1, // Chiều cao = chiều rộng, tạo thành hình vuông
    backgroundColor: '#FFFFFF',
    borderRadius: 40, // Bo góc 30
    borderWidth: 3, // Viền dày 3
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    padding: 5,
  },
  reviewWord: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 24, // Cỡ chữ sẽ được tự động điều chỉnh vừa vặn nhờ adjustsFontSizeToFit
    color: Color.text,
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  footer: {
    paddingHorizontal: Padding.padding_15,
    paddingBottom: Padding.padding_30,
    paddingTop: Padding.padding_10,
  },

  // STYLES BOTTOM SHEET MẸO
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
    alignItems: 'center',
  },
  sheetTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_20,
    color: Color.text,
    marginBottom: 15,
  },
  sheetDesc: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  sheetButton: {
    width: '100%',
  },
});
