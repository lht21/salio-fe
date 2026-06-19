import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MapTrifoldIcon, RocketLaunchIcon } from 'phosphor-react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// Import từ Design System
import { Color, Border, Gap, FontFamily, FontSize, Padding } from '../constants/GlobalStyles';
import StatusBadge from './StatusBadge';
import CurrentLessonCard from './CurrentLessonCard';
import { LessonItem } from './LessonNode';
import StarIcon from '../components/icons/StarIcon';

type HeaderSectionProps = {
  currentLesson: LessonItem;
  onCurrentLessonPress?: (item: LessonItem) => void;
  onFirePress?: () => void;
  onCloudPress?: () => void;
  streak?: number;
  clouds?: number;
  level?: string;
};

const getStreakImage = (streak: number) => {
  if (streak > 60) return require('../assets/images/streak/lv6.png');
  if (streak >= 31) return require('../assets/images/streak/lv5.png');
  if (streak >= 15) return require('../assets/images/streak/lv4.png');
  if (streak >= 7) return require('../assets/images/streak/lv3.png');
  if (streak >= 4) return require('../assets/images/streak/lv2.png');
  return require('../assets/images/streak/lv1.png');
};

const HeaderSection = ({ currentLesson, onCurrentLessonPress, onFirePress, onCloudPress, streak = 0, clouds = 0, level }: HeaderSectionProps) => {
  // --- ANIMATION XOAY NGÔI SAO ---
  const animProgress = useSharedValue(0);

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
    // Animation xoay: 1 giây nhanh, 4 giây chậm, lặp lại
    animProgress.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.linear }), // 1 chu kỳ = 5 giây
      -1, // Lặp vô hạn
      false // Không đảo ngược
    );
  }, []);

  const rotationStyle = useAnimatedStyle(() => {
    // 0 -> 0.2 (1s): xoay nhanh 360 độ
    const fastRotationPart = interpolate(
      animProgress.value,
      [0, 0.2], 
      [0, 360],
      Extrapolation.CLAMP
    );
    // 0.2 -> 1 (4s): xoay chậm thêm 180 độ
    const slowRotationPart = interpolate(
      animProgress.value,
      [0.2, 1],
      [0, 180],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ rotate: `${fastRotationPart + slowRotationPart}deg` }]
    };
  });

  return (
    <View style={styles.headerGradient}>
      <View style={styles.headerContent}>

        {/* Cột trái: Linh vật & Ngôi sao */}
        <View style={styles.mascotWrapper}>
            <Animated.View style={[styles.starIconContainer, rotationStyle]}>
              <StarIcon width={120} height={120} color={Color.main} />
            </Animated.View>
            <Image
              source={require('../assets/images/horani/state_1.png')}
              style={styles.topMascot}
              contentFit="contain"
            />
        </View>

        {/* Cột phải: Thông tin & Nút bấm */}
        <View style={styles.infoActionsWrapper}>
          {/* Các Badge Trạng thái */}
          <View style={styles.badgesRow}>
            <StatusBadge text={level || "Sơ cấp 1"} bgColor="#FFFFFF" />
            <StatusBadge 
              icon={<Image source={getStreakImage(streak)} style={{ width: 20, height: 20 }} contentFit="contain" />} 
              text={streak.toString()} 
              bgColor="#FFFFFF" 
              onPress={onFirePress}
            />
            <StatusBadge 
              icon={<Image source={require('../assets/images/streak/cloud1.png')} style={{ width: 20, height: 20 }} contentFit="contain" />} 
              text={clouds.toString()} 
              bgColor="#FFFFFF" 
              onPress={onCloudPress}
            />
          </View>

          {/* Nút bấm Thay đổi lộ trình học */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={styles.changeRouteBtn} 
              activeOpacity={0.7}
              onPress={() => router.push('/tracking/' as any)}
            >
              <RocketLaunchIcon size={16} color={Color.color} weight="bold" />
              <Text style={styles.changeRouteText}>Xem sự tiến bộ?</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.changeRouteBtn} 
              activeOpacity={0.7}
              onPress={() => routeSheetRef.current?.present()}
            >
              <MapTrifoldIcon size={16} color={Color.color} weight="bold" />
              <Text style={styles.changeRouteText}>Thay đổi lộ trình học?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <CurrentLessonCard lesson={currentLesson} onPress={onCurrentLessonPress} />

      {/* Bottom Sheet Hướng dẫn đổi lộ trình */}
      <BottomSheetModal
        ref={routeSheetRef}
        snapPoints={['50%']}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: Color.bg }}
        handleIndicatorStyle={{ backgroundColor: Color.stroke }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Thay đổi lộ trình học</Text>
          <Text style={styles.sheetDesc}>
            Chọn một trong các bài kiểm tra dưới đây để đánh giá trình độ hiện tại và nhận lộ trình phù hợp.
          </Text>
          
          <View style={styles.actionCardsWrapper}>
            <TouchableOpacity 
              style={styles.actionCard}
              activeOpacity={0.8}
              onPress={() => {
                routeSheetRef.current?.dismiss();
                router.push('/placement-test/intro');
              }}
            >
              <View style={styles.actionCardIconWrap}>
                <Image source={require('../assets/images/horani/intro-placement.png')} style={styles.actionCardImage} contentFit="contain" />
              </View>
              <View style={styles.actionCardContent}>
                <Text style={styles.actionCardTitle}>Kiểm tra đầu vào</Text>
                <Text style={styles.actionCardDesc}>Làm bài test nhanh để hệ thống gợi ý lộ trình phù hợp</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              activeOpacity={0.8}
              onPress={() => {
                routeSheetRef.current?.dismiss();
                router.push('/practice/full');
              }}
            >
              <View style={[styles.actionCardIconWrap, { backgroundColor: '#F0FFF0' }]}>
                <Image source={require('../assets/images/horani/horani_skill3.png')} style={styles.actionCardImage} contentFit="contain" />
              </View>
              <View style={styles.actionCardContent}>
                <Text style={styles.actionCardTitle}>Thi thử TOPIK</Text>
                <Text style={styles.actionCardDesc}>Làm bài thi TOPIK thực tế để đánh giá năng lực</Text>
              </View>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    backgroundColor: Color.main200,
    paddingTop: 60,
    borderBottomLeftRadius: Border.br_30 || 30,
    borderBottomRightRadius: Border.br_30 || 30,
    paddingBottom: 20,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.padding_15,
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
    width: 120,
    height: 120,
    marginLeft: -40, // Giữ tỉ lệ đẩy cụm linh vật sang trái
  },
  starIconContainer: {
    position: 'absolute',
  },
  topMascot: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
  infoActionsWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: Gap.gap_15,
    marginLeft: Gap.gap_10,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 12,
    // Có thể thêm bóng đổ nhẹ để Badge nổi khối 3D tách biệt khỏi nền
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  changeRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
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
  actionCardsWrapper: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginTop: Gap.gap_20,
    gap: Gap.gap_15,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.coral,
    borderRadius: Border.br_20 || 20,
    padding: Padding.padding_15 || 15,
  },
  actionCardIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF4E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionCardImage: {
    width: 40,
    height: 40,
  },
  actionCardContent: {
    flex: 1,
  },
  actionCardTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: Color.bg,
    marginBottom: 4,
  },
  actionCardDesc: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.bg,
    lineHeight: 18,
  },
});

export default HeaderSection;
