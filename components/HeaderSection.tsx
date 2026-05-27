import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { FireIcon, CloudIcon, CaretCircleDoubleRightIcon } from 'phosphor-react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedProps,
  interpolateColor,
  withRepeat, 
  withSequence, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

// Import từ Design System
import { Color, Border, Gap, FontFamily, FontSize } from '../constants/GlobalStyles';
import StatusBadge from './StatusBadge';
import CurrentLessonCard from './CurrentLessonCard';
import { LessonItem } from './LessonNode';
import Button from './Button';

type HeaderSectionProps = {
  currentLesson: LessonItem;
  onCurrentLessonPress?: (item: LessonItem) => void;
  onFirePress?: () => void;
  onCloudPress?: () => void;
  streak?: number;
  clouds?: number;
  level?: string;
};

// Bọc LinearGradient để có thể nhận các giá trị Animation từ Reanimated
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const getStreakImage = (streak: number) => {
  if (streak > 60) return require('../assets/images/streak/lv6.png');
  if (streak >= 31) return require('../assets/images/streak/lv5.png');
  if (streak >= 15) return require('../assets/images/streak/lv4.png');
  if (streak >= 7) return require('../assets/images/streak/lv3.png');
  if (streak >= 4) return require('../assets/images/streak/lv2.png');
  return require('../assets/images/streak/lv1.png');
};

const HeaderSection = ({ currentLesson, onCurrentLessonPress, onFirePress, onCloudPress, streak = 0, clouds = 0, level }: HeaderSectionProps) => {
  // --- ANIMATION CHUYỂN ĐỘNG LƠ LỬNG ---
  const translateY = useSharedValue(0);
  const colorProgress = useSharedValue(0);

  // --- SETUP ROUTER & BOTTOM SHEET ---
  const router = useRouter();
  const routeSheetRef = useRef<BottomSheetModal>(null);

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
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Lặp vô hạn
      true // Đảo ngược (lên rồi xuống)
    );

    // --- ANIMATION CHUYỂN MÀU GRADIENT ---
    colorProgress.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1, // Lặp vô hạn
      true // Đảo ngược từ 1 về 0
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Tính toán nội suy màu sắc theo thời gian thực
  const animatedGradientProps = useAnimatedProps(() => {
    return {
      colors: [
        // Đổi màu đỉnh từ xanh nhạt (#CEF9B4) sang hơi ngả vàng sáng (#E6FFD1)
        interpolateColor(colorProgress.value, [0, 1], ['#CEF9B4', '#E6FFD1']),
        // Đổi màu đáy từ xanh gốc sang xanh neon tươi hơn (#5DE367)
        interpolateColor(colorProgress.value, [0, 1], [Color.main || '#98F291', '#5DE367']),
      ]
    } as any; // Dùng `as any` để bỏ qua cảnh báo type strict của React Native cho mảng màu động
  });

  return (
    <AnimatedLinearGradient 
      colors={['#CEF9B4', Color.main || '#98F291']} // Thêm màu mặc định để fix lỗi TypeScript
      animatedProps={animatedGradientProps} 
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>

        {/* Khu vực linh vật có hiệu ứng và nền */}
        <View style={styles.mascotWrapper}>
          <View style={styles.mascotBackdrop} />
          <Animated.View style={[styles.mascotContainer, floatingStyle]}>
            <Image
              source={require('../assets/images/horani/state_1.png')}
              style={styles.topMascot}
              contentFit="contain"
            />
          </Animated.View>
        </View>

        {/* Các Badge Trạng thái */}
        <View style={styles.badgesRow}>
          <StatusBadge text={level || "Sơ cấp 1"} bgColor="#FFFFFF" />
          <StatusBadge 
            icon={<Image source={getStreakImage(streak)} style={{ width: 20, height: 20 }} contentFit="contain" />} 
            text={streak.toString()} 
            bgColor="#FFFFFF" 
            onPress={onFirePress} // Giữ nguyên prop onPress có sẵn trong file của bạn
          />
          <StatusBadge 
            icon={<Image source={require('../assets/images/streak/cloud1.png')} style={{ width: 20, height: 20 }} contentFit="contain" />} 
            text={clouds.toString()} 
            bgColor="#FFFFFF" 
            onPress={onCloudPress} // Giữ nguyên prop onPress có sẵn trong file của bạn
          />
        </View>

        {/* Nút bấm Thay đổi lộ trình học */}
        <TouchableOpacity 
          style={styles.changeRouteBtn} 
          activeOpacity={0.7}
          onPress={() => routeSheetRef.current?.present()}
        >
          <Text style={styles.changeRouteText}>Thay đổi lộ trình học?</Text>
          <CaretCircleDoubleRightIcon size={16} color={Color.color} weight="duotone" />
        </TouchableOpacity>
        
      </View>

      <CurrentLessonCard lesson={currentLesson} onPress={onCurrentLessonPress} />

      {/* Bottom Sheet Hướng dẫn đổi lộ trình */}
      <BottomSheetModal
        ref={routeSheetRef}
        snapPoints={['35%']}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: Color.bg }}
        handleIndicatorStyle={{ backgroundColor: Color.stroke }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Thay đổi lộ trình học</Text>
          <Text style={styles.sheetDesc}>
            Để thay đổi lộ trình học phù hợp với trình độ hiện tại, bạn cần làm một bài kiểm tra đầu vào (Mocktest). Hệ thống sẽ tự động đánh giá và điều chỉnh lộ trình dựa trên kết quả của bạn.
          </Text>
          
          <Button 
            title="Làm bài kiểm tra ngay" 
            variant="Green" 
            onPress={() => {
              routeSheetRef.current?.dismiss();
              router.push('/practice/full');
            }}
            style={{ width: '100%', marginTop: Gap.gap_20 }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </AnimatedLinearGradient>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 60,
    borderBottomLeftRadius: Border.br_30 || 30,
    borderBottomRightRadius: Border.br_30 || 30,
    paddingBottom: 20,
    zIndex: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
  greetingText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    color: Color.color, // Chữ màu xanh đậm hoặc có thể đổi sang Color.text
    marginBottom: Gap.gap_10,
    opacity: 0.9,
  },
  mascotWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.gap_20,
    height: 140, // Dành không gian cho mascot lơ lửng
  },
  mascotBackdrop: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Vòng tròn mờ phát sáng nhẹ
    transform: [{ translateY: 10 }], // Hạ vòng tròn xuống một chút làm bệ đỡ
  },
  mascotContainer: {
    // Đổ bóng cho mascot để có chiều sâu
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  topMascot: {
    width: 120, // Tăng size lên một chút để mascot là tâm điểm
    height: 120,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12, // Giảm margin để nhường chỗ cho nút bên dưới
    // Có thể thêm bóng đổ nhẹ để Badge nổi khối 3D tách biệt khỏi nền
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  changeRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 30, // Đẩy thẻ bài học hiện tại xuống dưới một chút
    gap: 4,
  },
  changeRouteText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: Color.color,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: FontFamily.lexendDecaSemiBold,
    color: Color.text,
    marginTop: 10,
    marginBottom: 12,
    textAlign: 'center',
  },
  sheetDesc: {
    fontSize: 14,
    fontFamily: FontFamily.lexendDecaRegular,
    color: Color.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default HeaderSection;
