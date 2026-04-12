import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { X, ArrowsClockwise, CaretRight, SpeakerHigh } from 'phosphor-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Import từ Design System của dự án
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import Button from '../../../../components/Button';

// --- COMPONENTS CON ---

const GrammarHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Ngữ pháp thứ nhất</Text>
      <Pressable onPress={() => router.back()} style={styles.closeButton}>
        <X size={20} color={Color.text} weight="bold" />
      </Pressable>
    </View>
  );
};

// --- MÀN HÌNH CHÍNH ---

export default function GrammarDetailScreen() {
  const { lessonId } = useLocalSearchParams();
  
  // State quản lý trạng thái thẻ: 0 (Tổng quan), 1 (Quy tắc), 2 (Ví dụ)
  const [currentStep, setCurrentStep] = useState(0);
  
  // Animation value
  const flipAnim = useSharedValue(0);

  // Hàm xử lý lật thẻ
  const handleNextStep = () => {
    // Lật thẻ 90 độ -> Đổi content -> Lật nốt về 0 độ
    flipAnim.value = withTiming(90, { duration: 150 }, () => {
      runOnJS(setCurrentStep)((currentStep + 1) % 3);
      flipAnim.value = withTiming(0, { duration: 150 });
    });
  };

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${flipAnim.value}deg` }],
    };
  });

  // Render nội dung thẻ theo step
  const renderCardContent = () => {
    switch (currentStep) {
      case 0: // Tổng quan
        return (
          <LinearGradient
            colors={[Color.xanh + '20', Color.bg]} // Xanh nhạt gradient xuống trắng
            style={styles.cardInner}
          >
            <View style={styles.contentCenter}>
              <Text style={styles.grammarStructure}>N + 입니다</Text>
              <Text style={styles.grammarMeaning}>Là N (Câu trần thuật)</Text>
              <Text style={styles.grammarDesc}>
                Sử dụng trong tình huống trang trọng, lịch sự để giới thiệu bản thân hoặc định nghĩa sự vật.
              </Text>
            </View>
          </LinearGradient>
        );
      
      case 1: // Quy tắc
        return (
          <View style={[styles.cardInner, { backgroundColor: Color.greenLight }]}>
            <Text style={styles.ruleTitle}>Cách sử dụng</Text>
            <View style={styles.ruleList}>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleText}>Có Patchim (O)</Text>
                <CaretRight size={16} color={Color.cam} weight="bold" />
                <Text style={styles.ruleResult}>+ 입니다</Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={styles.ruleText}>Không Patchim (X)</Text>
                <CaretRight size={16} color={Color.cam} weight="bold" />
                <Text style={styles.ruleResult}>+ 입니다</Text>
              </View>
            </View>
          </View>
        );

      case 2: // Ví dụ
        return (
          <View style={[styles.cardInner, { backgroundColor: Color.bg }]}>
            <View style={styles.exampleImagePlaceholder}>
              {/* Vùng chứa ảnh minh họa - Có thể thay bằng <Image source={...} /> */}
              <Text style={{ color: Color.gray }}>[Ảnh minh họa]</Text>
            </View>
            
            <View style={styles.exampleAudioRow}>
              <View style={styles.speakerIcon}>
                <SpeakerHigh size={20} color={Color.bg} weight="fill" />
              </View>
              <View style={styles.exampleTextWrap}>
                <Text style={styles.exampleKorean}>
                  저는 학생<Text style={styles.highlightText}>입니다.</Text>
                </Text>
                <Text style={styles.exampleVietnamese}>Tôi là học sinh.</Text>
              </View>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GrammarHeader />

      <View style={styles.mainContent}>
        {/* Flashcard Container */}
        <Animated.View style={[styles.cardWrapper, cardAnimatedStyle]}>
          {renderCardContent()}
          
          {/* Nút lật thẻ góc dưới phải */}
          <Pressable style={styles.flipButton} onPress={handleNextStep}>
            <ArrowsClockwise size={24} color={Color.gray} weight="bold" />
          </Pressable>
        </Animated.View>
      </View>

      {/* Action Button dưới cùng */}
      <View style={styles.footer}>
        <Button 
          title="BÀI TẬP GHI NHỚ" 
          variant="Green"
          onPress={() => router.push(`/lessons/${lessonId}/grammar/exercise` as any)}
        />
      </View>
    </SafeAreaView>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Padding.padding_20,
    paddingVertical: Padding.padding_15,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_20,
    color: Color.color, // Xanh lá đậm
  },
  closeButton: {
    backgroundColor: Color.stroke,
    padding: Padding.padding_8,
    borderRadius: 50,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Padding.padding_20,
  },
  
  // Card Styles
  cardWrapper: {
    height: 400,
    borderRadius: Border.br_20,
    borderWidth: 2,
    borderColor: Color.text, // Border đen vẽ tay / rugged
    backgroundColor: Color.bg,
    overflow: 'hidden',
    // Shadow cho cảm giác thẻ nổi
    shadowColor: Color.colorBlack,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 5,
  },
  cardInner: {
    flex: 1,
    padding: Padding.padding_20,
  },
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Gap.gap_10,
  },
  flipButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    padding: Padding.padding_8,
    backgroundColor: Color.bg,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Color.stroke,
  },

  // State 0: Tổng quan
  grammarStructure: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_24,
    color: Color.color,
  },
  grammarMeaning: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  grammarDesc: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.gray,
    textAlign: 'center',
    marginTop: Gap.gap_10,
    lineHeight: 22,
  },

  // State 1: Quy tắc
  ruleTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_20,
    color: Color.color,
    marginBottom: Gap.gap_20,
    textAlign: 'center',
  },
  ruleList: {
    gap: Gap.gap_15,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Color.bg,
    borderWidth: 1,
    borderColor: Color.cam, // Viền vàng cam
    padding: Padding.padding_15,
    borderRadius: Border.br_10,
  },
  ruleText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  ruleResult: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    color: Color.color,
  },

  // State 2: Ví dụ
  exampleImagePlaceholder: {
    height: 180,
    backgroundColor: Color.stroke,
    borderRadius: Border.br_15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Gap.gap_20,
  },
  exampleAudioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Gap.gap_15,
  },
  speakerIcon: {
    backgroundColor: Color.xanh,
    padding: Padding.padding_8,
    borderRadius: 50,
  },
  exampleTextWrap: {
    flex: 1,
    gap: Gap.gap_5,
  },
  exampleKorean: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  highlightText: {
    color: Color.green, // Highlight màu xanh lá
  },
  exampleVietnamese: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.gray,
  },

  // Footer
  footer: {
    paddingHorizontal: Padding.padding_20,
    paddingBottom: Padding.padding_20,
  },
});