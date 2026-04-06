import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';

const CurrentLessonCard = () => {
  return (
    <View style={styles.currentLessonWrapper}>
      <View style={styles.currentLessonCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.currentLessonTitle}>Bài 1: Giới thiệu - 소개</Text>
          <TouchableOpacity style={styles.continueBtn}>
            <Text style={styles.continueBtnText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
        <Image 
          source={require('../assets/images/tubo/sc1_b0.png')} 
          style={styles.currentLessonMascot} 
          contentFit="contain" 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  currentLessonWrapper: {
    paddingHorizontal: Padding.padding_15 || 15,
   
  },
  currentLessonCard: {
    backgroundColor: Color.bg || '#FFFFFF',
    borderRadius: Border.br_20 || 20,
    padding: Padding.padding_15 || 15,
    flexDirection: 'row',
    alignItems: 'center',
    
    // Tinh chỉnh đổ bóng (Blur viền mềm)
    shadowColor: '#000000', // Dùng màu đen chuẩn để bóng mờ tự nhiên
    shadowOffset: { width: 0, height: 6 }, // Kéo bóng xuống một chút
    shadowOpacity: 0.08, // Độ đậm rất nhẹ (8%)
    shadowRadius: 15, // TĂNG CHỈ SỐ NÀY ĐỂ TẠO ĐỘ BLUR MỀM MẠI
    elevation: 8, // Dành cho Android (Android không nhận shadowRadius nên phải dùng elevation cao lên để bóng tỏa rộng hơn)

    // (Tùy chọn) Một viền cực mỏng và nhạt để card nét hơn nhưng vẫn giữ được độ mềm
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)', 
  },
  currentLessonTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: Color.color || '#0C5F35',
    marginBottom: Gap.gap_10 || 10,
  },
  continueBtn: {
    backgroundColor: Color.main || '#98F291',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Border.br_15 || 15,
    alignSelf: 'flex-start',
  },
  continueBtnText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12 || 12,
    color: Color.color || '#0C5F35',
  },
  currentLessonMascot: {
    width: 60,
    height: 60,
  },
});

export default CurrentLessonCard;