import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- IMPORT COMPONENTS & CONSTANTS ---
import { Color, FontFamily, FontSize, Padding, Border, Gap } from '../../../../constants/GlobalStyles';
import CloseButton from '../../../../components/CloseButton';
import Button from '../../../../components/Button';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal'; 


export default function QuizIntroScreen() {
  const router = useRouter();

   // STATE HIỂN THỊ MODAL THOÁT
  const [showExitModal, setShowExitModal] = useState(false);
  
  // Lấy params động từ route (nếu có truyền), gán giá trị mặc định cho Vòng 2
  const { 
    lessonId, 
    roundNumber = '2', 
    roundTitle = 'Học từ trắc nghiệm' 
  } = useLocalSearchParams();

  // --- XỬ LÝ SỰ KIỆN ---
  const handleClose = () => {
    router.back();
  };

  const handleStart = () => {
    // Điều hướng tới màn hình làm bài trắc nghiệm
    router.push(`/lessons/${lessonId}/vocabulary/quiz`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* 1. HEADER: Chỉ có nút X ở góc phải */}
      <View style={styles.header}>
        <CloseButton variant="Stroke" onPress={() => setShowExitModal(true)} />
      </View>

      {/* 2. NỘI DUNG CHÍNH */}
      <View style={styles.content}>
        
        {/* Phần 1: Hình ảnh minh họa */}
        <Image
          source={require('../../../../assets/images/tubo/intro-vocab.jpeg')}
          style={styles.illustration}
          resizeMode="cover"
        />

        {/* Phần 2: Tiêu đề Vòng học */}
        <View style={styles.titleRow}>
          <Text style={styles.roundText}>Vòng {roundNumber}</Text>
          <Text style={styles.titleText}>{roundTitle}</Text>
        </View>

        {/* Phần 3: Khung mô tả */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>
            Chọn đáp án đúng nhất để kiểm tra khả năng ghi nhớ từ vựng và Hán tự của bạn. Cố gắng đạt điểm tối đa nhé!
          </Text>
        </View>
        
      </View>

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
    alignItems: 'flex-end',
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
  },

  content: {
    flex: 1,
    paddingHorizontal: Padding.padding_20,
    justifyContent: 'center', // Căn giữa toàn bộ cụm nội dung theo trục dọc
    alignItems: 'center',
  },

  illustration: {
    width: 250,
    height: 270,
    borderRadius: 40, // Bo góc tròn lớn theo yêu cầu
    marginBottom: 40,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: Gap.gap_20,
  },
  
  roundText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_20,
    color: Color.text, // Xám đậm / Đen
  },
  
  titleText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_20,
    color: Color.cam, // Màu cam từ thiết kế
  },

  descriptionBox: {
    width: '100%',
    backgroundColor: Color.greenLight, // Nền xanh mờ
    paddingVertical: Padding.padding_20,
    paddingHorizontal: Padding.padding_15,
    borderRadius: Border.br_20,
    borderWidth: 1.5,
    borderColor: Color.main, // Viền xanh lá
    borderStyle: 'dashed', // Nét đứt (viền đặc biệt)
    alignItems: 'center',
  },
  
  descriptionText: {
    fontFamily: FontFamily.lexendDecaMedium, // Font mềm mại dễ đọc
    fontSize: FontSize.fs_14,
    color: Color.text,
    textAlign: 'center',
    lineHeight: 22,
  },

  footer: {
    paddingHorizontal: Padding.padding_15,
    paddingBottom: Padding.padding_30,
    paddingTop: Padding.padding_10,
  },
});