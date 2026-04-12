import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- IMPORT COMPONENTS & CONSTANTS ---
import { Color, FontFamily, FontSize, Padding, Border, Gap } from '../../../../constants/GlobalStyles';
import CloseButton from '../../../../components/CloseButton';
import Button from '../../../../components/Button';

export default function GrammarIntroScreen() {
  const router = useRouter();
  
  // Lấy params động từ route (nếu có truyền), gán giá trị mặc định cho Vòng 3: Học Ngữ pháp
  const { 
    lessonId, 
    roundNumber = '3', 
    roundTitle = 'Học Ngữ pháp' 
  } = useLocalSearchParams();

  // --- XỬ LÝ SỰ KIỆN ---
  const handleClose = () => {
    router.back();
  };

  const handleStart = () => {
    // Điều hướng tới màn hình thực hành ngữ pháp
    // Giả định màn hình thực hành ngữ pháp là 'practice.tsx'
    router.push(`/lessons/${lessonId}/grammar/detail` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* 1. HEADER: Chỉ có nút X ở góc phải */}
      <View style={styles.header}>
        <CloseButton variant="Stroke" onPress={handleClose} />
      </View>

      {/* 2. NỘI DUNG CHÍNH */}
      <View style={styles.content}>
        
        {/* Phần 1: Hình ảnh minh họa */}
        <Image
          source={require('../../../../assets/images/tubo/intro-grammar.jpeg')} // Sử dụng hình ảnh ngữ pháp
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
            Học cấu trúc ngữ pháp mới qua các ví dụ sinh động và bài tập thực hành. Cố gắng ghi nhớ cách sử dụng nhé!
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
    height: 250,
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
    color: Color.text, // Xám đậm / Đen (màu đen cho "Vòng 3" theo hình)
  },
  
  titleText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_20,
    color: Color.cam, // Màu cam từ thiết kế (màu cam cho "Học Ngữ pháp" theo hình)
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