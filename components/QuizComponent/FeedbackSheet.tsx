import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { Color, FontFamily, FontSize, Padding, Border, Gap } from '../../constants/GlobalStyles';
// --- IMPORT LINEAR GRADIENT ---
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface FeedbackSheetProps {
  isCorrect: boolean;
  onNext: () => void;
}

export default function FeedbackSheet({ isCorrect, onNext }: FeedbackSheetProps) {
  return (
    <Animated.View 
      entering={SlideInDown.duration(300)} 
      // Chỉ giữ style shadow ở container cha
      style={styles.containerShadow} 
    >
      <LinearGradient
        colors={
          isCorrect 
            ? ['#ADFF66', '#98F291'] // Success: Xanh lục mờ
            : ['#FF6B00', '#FFCFA8'] // Failure: Cam sang Cam nhạt
        }
        // start và end để điều chỉnh hướng gradient (ví dụ: chéo)
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.contentRow}>
          
          <View style={styles.textContainer}>
            {/* CẬP NHẬT MÀU CHỮ: Xanh đậm cho Correct, Đỏ cho Incorrect */}
            <Text style={[styles.title, isCorrect ? styles.textSuccess : styles.textFailure]}>
              {isCorrect ? 'BẠN LÀM TỐT LẮM!' : 'ÔI SAI MẤT RỒI!'}
            </Text>
            <Text style={[styles.subtitle, isCorrect ? styles.textSuccess : styles.textFailure]}>
              {isCorrect ? 'Tuyệt vời, cố gắng phát huy nhé!' : 'Cố gắng chú ý hơn ở câu sau nhé!'}
            </Text>
          </View>
          <Image 
            source={
              isCorrect 
                ? require('../../assets/images/tubo/success.png') 
                : require('../../assets/images/tubo/failure.png')
            } 
            style={styles.image} 
            resizeMode="contain"
          />
        </View>

        {!isCorrect && (
          <TouchableOpacity style={styles.button} onPress={onNext} activeOpacity={0.8}>
            {/* Cập nhật màu chữ nút "Câu tiếp theo" sang màu cam gốc */}
            <Text style={styles.buttonText}>Câu tiếp theo</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Tách style shadow ra một lớp riêng để hiệu ứng nổi khối đẹp hơn
  containerShadow: {
    position: 'absolute',
    bottom: 0,
    width: width,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  
  // STYLE CHO CONTAINER CHỨA GRADIENT (Thay thế cho style container cũ)
  gradientContainer: {
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_20,
    paddingBottom: Padding.padding_30,
    borderTopLeftRadius: Border.br_30,
    borderTopRightRadius: Border.br_30,
    width: '100%',
  },
  
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Gap.gap_20,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: Gap.gap_15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_20,
    marginBottom: Gap.gap_5,
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    opacity: 0.9,
  },

  // --- CẬP NHẬT MÀU CHỮ THEO YÊU CẦU ---
  textSuccess: {
    color: Color.color, // Xanh đậm gốc
  },
  textFailure: {
    color: Color.red, // Màu đỏ (đã được định nghĩa trong CustomInput.tsx)
  },

  button: {
    backgroundColor: Color.bg,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: Color.text, // Màu cam gốc cho nút
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
  },
});