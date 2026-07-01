import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Modal, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useAnimatedProps,
  interpolateColor,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
  withDelay,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

import HeaderSection from '../../components/HeaderSection';
import WindingPath from '../../components/WindingPath';
import LessonNode, { LessonItem } from '../../components/LessonNode';
import NextStageCard from '../../components/NextStageCard';
import { Border, FontFamily } from '@/constants/GlobalStyles';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import { useUser } from '../../contexts/UserContext';
import UserService from '../../api/services/user.service';
import GamificationService from '../../api/services/gamification.service';
import DailyMissionsModal from '../../components/Modals/DailyMissionsModal';
import LessonBottomSheet from '../../components/Modals/LessonBottomSheet';
import { MyStatsData } from '../../api/types/user.types';
import LessonService from '@/api/services/lesson.service';
import { Lesson, LessonProgress, LessonStatus } from '@/api/types/lesson.types';
import { useTheme } from "@/contexts/ThemeContext";


const LESSONS: LessonItem[] = [
  {
    id: '0',
    unit: 'Bài 0',
    title: 'Chữ Hangul',
    status: 'completed',
    points: 100,
    mascotPos: 'left',
  },
  {
    id: '1',
    unit: 'Bài 1',
    title: 'Giới thiệu - 소개',
    status: 'completed',
    points: 100,
    mascotPos: 'right',
  },
  {
    id: '2',
    unit: 'Bài 2',
    title: 'Trường học - 학교',
    status: 'current',
    mascotPos: 'left',
  },
  {
    id: '3',
    unit: 'Bài 3',
    title: 'Sinh hoạt - 일상생활',
    status: 'locked',
    mascotPos: 'right',
  },
  {
    id: '4',
    unit: 'Bài 4',
    title: 'Ngày và thứ - 날짜와 요일',
    status: 'locked',
    mascotPos: 'left',
  },
];

const getStreakImage = (streak: number) => {
  if (streak > 60) return require('../../assets/images/streak/lv6.png');
  if (streak >= 31) return require('../../assets/images/streak/lv5.png');
  if (streak >= 15) return require('../../assets/images/streak/lv4.png');
  if (streak >= 7) return require('../../assets/images/streak/lv3.png');
  if (streak >= 4) return require('../../assets/images/streak/lv2.png');
  return require('../../assets/images/streak/lv1.png');
};

const mapLessonToItem = (lesson: Lesson, index: number, status: LessonStatus): LessonItem => ({
  id: lesson._id,
  unit: `Bài ${lesson.order}`,
  title: lesson.title,
  lessonType: lesson.lessonType ?? 'standard',
  hangul: lesson.hangul,
  status,
  mascotPos: index % 2 === 0 ? 'left' : 'right',
  rewardBadge: lesson.rewardBadge,
  rewardClouds: lesson.rewardClouds,
});

const getLessonProgressMap = async (sourceLessons: Lesson[]) => {
  const entries = await Promise.all(
    sourceLessons.map(async (lesson) => {
      try {
        const response = await LessonService.getProgress(lesson._id);
        return [lesson._id, response.data] as const;
      } catch {
        return [lesson._id, null] as const;
      }
    })
  );

  return new Map<string, LessonProgress | null>(entries);
};

const mapLessonsWithProgress = async (sourceLessons: Lesson[]) => {
  const progressMap = await getLessonProgressMap(sourceLessons);
  const firstIncompleteIndex = sourceLessons.findIndex((lesson) => !progressMap.get(lesson._id)?.isCompleted);
  const currentIndex = firstIncompleteIndex === -1 ? sourceLessons.length - 1 : firstIncompleteIndex;

  return sourceLessons.map((lesson, index) => {
    const progress = progressMap.get(lesson._id);
    const status: LessonStatus = progress?.isCompleted
      ? 'completed'
      : index === currentIndex
        ? 'current'
        : 'locked';

    return mapLessonToItem(lesson, index, status);
  });
};

const STREAK_MILESTONES = [
  { id: 1, min: 0, max: 3, image: require('../../assets/images/streak/lv1.png') },
  { id: 2, min: 4, max: 6, image: require('../../assets/images/streak/lv2.png') },
  { id: 3, min: 7, max: 14, image: require('../../assets/images/streak/lv3.png') },
  { id: 4, min: 15, max: 30, image: require('../../assets/images/streak/lv4.png') },
  { id: 5, min: 31, max: 60, image: require('../../assets/images/streak/lv5.png') },
  { id: 6, min: 61, max: 9999, image: require('../../assets/images/streak/lv6.png') },
];

const StreakFiresList = ({ currentStreak }: { currentStreak: number }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const scrollViewRef = useRef<ScrollView>(null);

  const currentLevelIndex = useMemo(() => {
    let index = STREAK_MILESTONES.findIndex(m => currentStreak >= m.min && currentStreak <= m.max);
    return index !== -1 ? index : 0;
  }, [currentStreak]);

  useEffect(() => {
    // Chờ 300ms để Bottom Sheet kịp trượt lên trước khi thực hiện cuộn ngang
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: Math.max(0, currentLevelIndex * 80 - 100), // Căn giữa một chút
        animated: true
      });
    }, 300);
  }, [currentLevelIndex]);

  return (
    <View style={{ width: '100%', marginBottom: 16 }}>
      <ScrollView
        horizontal
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 30, paddingHorizontal: 20 }}
      >
        {STREAK_MILESTONES.map((item, index) => {
          const isCurrent = index === currentLevelIndex;
          const isLocked = currentStreak < item.min;

          return (
            <View key={item.id} style={{ alignItems: 'center', opacity: isLocked ? 0.3 : 1, width: 64 }}>
              <View style={[styles.streakIconWrapper, isCurrent && styles.streakIconWrapperActive]}>
                <Image source={item.image} style={{ width: 60, height: 60 }} resizeMode="contain" />
              </View>
              <Text style={[styles.streakDayText, isCurrent && styles.streakDayTextActive]}>
                {item.min === 0 ? '1' : item.min} ngày
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);



  const router = useRouter();
  const [lessons, setLessons] = useState<LessonItem[]>(LESSONS);
  const currentLesson = React.useMemo(
    () => lessons.find((item) => item.status === 'current') ?? lessons[0],
    [lessons]
  );

  const visibleLessons = useMemo(() => {
    const currentIndex = lessons.findIndex((item) => item.id === currentLesson?.id);
    if (currentIndex === -1) return lessons.slice(0, 6);

    // Formula: Math.max(6, Math.floor((currentIndex - 1) / 5) * 5 + 6)
    // E.g., currentIndex 0..5 -> shows 6. currentIndex 6..10 -> shows 11.
    const visibleCount = Math.max(6, Math.floor((currentIndex - 1) / 5) * 5 + 6);
    return lessons.slice(0, visibleCount);
  }, [lessons, currentLesson]);

  const { user } = useUser();
  const [stats, setStats] = useState<MyStatsData | null>(null);
  const [isMissionsModalVisible, setMissionsModalVisible] = useState(false);
  const [isAutoConfetti, setIsAutoConfetti] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonItem | null>(null);
  const lessonSheetRef = useRef<BottomSheetModal>(null);

  const fetchStats = async () => {
    try {
      const res = await UserService.getMyStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin thống kê:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const handleAutoCheckIn = async () => {

      const fetchLessons = async () => {
        try {
          const res = await LessonService.getAll({ limit: 50 });
          if (res.success && Array.isArray(res.data?.lessons) && res.data.lessons.length > 0) {
            const nextLessons = await mapLessonsWithProgress(res.data.lessons);
            setLessons(nextLessons);
          }
        } catch (error) {
          console.error('Lỗi khi lấy danh sách lesson:', error);
        }
      };

      const performCheckIn = async () => {
        try {
          const checkInRes = await GamificationService.dailyCheckIn();

          if (checkInRes.success) {
            setIsAutoConfetti(true);
            setMissionsModalVisible(true);
            fetchStats(); // Làm mới thông tin (Streak, mây...) từ hàm gốc bên ngoài
          }
        } catch (error: any) {
          console.log('Auto Check-in message:', error.response?.data?.message || error.message);
        }
      };

      await fetchLessons();
      await performCheckIn();
    };

    handleAutoCheckIn();
  }, []);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });



  const stickyHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [180, 230], [0, 1], Extrapolation.CLAMP);
    const translateY = interpolate(scrollY.value, [180, 230], [-20, 0], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // --- STATE CHO POPUP THÔNG TIN ---
  const [infoContent, setInfoContent] = useState<{ title: string, desc: string, icon: React.ReactNode | null, type?: 'streak' | 'cloud' }>({ title: '', desc: '', icon: null });

  const currentStreak = stats?.gamification?.currentStreak || 0;
  const currentStreakImage = getStreakImage(currentStreak);

  // --- CẤU HÌNH BOTTOM SHEET ---
  const infoSheetRef = useRef<BottomSheetModal>(null);
  const infoSnapPoints = useMemo(() => ['40%'], []); // Chiếm 40% chiều cao màn hình

  const renderInfoBackdrop = useCallback(
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

  const handleShowFireInfo = () => {
    setInfoContent({
      title: 'Chuỗi ngày học (Streak)',
      desc: 'Mỗi ngày bạn hoàn thành ít nhất một bài học, ngọn lửa sẽ cháy thêm 1 ngày. Giữ lửa liên tục để nhận thưởng lớn nhé!',
      icon: <StreakFiresList currentStreak={currentStreak} />,
      type: 'streak'
    });
    infoSheetRef.current?.present();
  };

  const handleShowCloudInfo = () => {
    setInfoContent({
      title: 'Đám mây (Điểm thưởng)',
      desc: 'Tích lũy đám mây sau mỗi bài học để đổi lấy các phần quà hấp dẫn hoặc mở khóa tính năng đặc biệt trong cửa hàng.',
      icon: <Image source={require('../../assets/images/streak/cloud1.png')} style={{ width: 48, height: 48 }} resizeMode="contain" />,
      type: 'cloud'
    });
    infoSheetRef.current?.present();
  };

  // --- CUSTOM TOAST ANIMATION ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastOpacity = useSharedValue(0);
  const toastTranslateY = useSharedValue(50);

  const showToast = (message: string) => {
    setToastMessage(message);

    // Đặt lại giá trị ban đầu để hiệu ứng luôn bắt đầu từ dưới lên
    toastOpacity.value = 0;
    toastTranslateY.value = 50;

    // Hiệu ứng Fade In -> Đợi 2.5s -> Fade Out
    toastOpacity.value = withSequence(
      withTiming(1, { duration: 300 }),
      withDelay(2500, withTiming(0, { duration: 300 }, (finished) => {
        if (finished) runOnJS(setToastMessage)(null); // Xóa component khỏi DOM khi ẩn xong
      }))
    );

    // Hiệu ứng Trượt nảy lên (Spring) -> Đợi 2.5s -> Trượt xuống lại
    toastTranslateY.value = withSequence(
      withSpring(0),
      withDelay(2500, withTiming(50, { duration: 300 }))
    );
  };

  const toastStyle = useAnimatedStyle(() => ({
    opacity: toastOpacity.value,
    transform: [{ translateY: toastTranslateY.value }],
  }));

  // --- XỬ LÝ KHI NHẤN VÀO BÀI HỌC ---
  const handleLessonPress = (item: LessonItem) => {
    if (item.status === 'locked') {
      showToast('Vui lòng hoàn thành bài học trước đó để mở khóa!');
    } else {
      setSelectedLesson(item);
      lessonSheetRef.current?.present();
    }
  };

  return (
    <View style={styles.container}>

      {/* Sticky Header (Thanh dính trên cùng) */}
      <Animated.View
        style={[styles.stickyHeader, { backgroundColor: colors.main200 }, stickyHeaderStyle]}
      >
        <StatusBadge text={user?.level || "Sơ cấp 1"} bgColor="#FFFFFF" />
        <StatusBadge
          icon={<Image source={currentStreakImage} style={{ width: 20, height: 20 }} resizeMode="contain" />}
          text={currentStreak.toString()}
          bgColor="#FFFFFF"
          onPress={handleShowFireInfo}
        />
        <StatusBadge
          icon={<Image source={require('../../assets/images/streak/cloud1.png')} style={{ width: 20, height: 20 }} resizeMode="contain" />}
          text={stats?.gamification?.clouds?.toString() || "0"}
          bgColor="#FFFFFF"
          onPress={handleShowCloudInfo}
        />
      </Animated.View>

      {/* Đổi ScrollView thành Animated.ScrollView để nhận tín hiệu cuộn */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16} // Tốc độ cập nhật 60fps
      >
        <HeaderSection
          currentLesson={currentLesson}
          onCurrentLessonPress={() => handleLessonPress(currentLesson)}
          onFirePress={handleShowFireInfo}
          onCloudPress={handleShowCloudInfo}
          streak={stats?.gamification?.currentStreak}
          clouds={stats?.gamification?.clouds}
          level={user?.level}
        />

        <View style={styles.mapArea}>

          <View style={styles.nodesWrapper}>
            {visibleLessons.map((item, index) => {
              const isLast = index === visibleLessons.length - 1;

              // Path nối từ Node hiện tại đến Node tiếp theo sẽ active (màu xanh)
              // NẾU Node hiện tại đã hoàn thành. 
              // Nếu Node hiện tại là 'current' thì Path đến Node sau sẽ màu xám (chưa mở khóa)
              const isPathActive = item.status === 'completed';
              const isLeftToRight = item.mascotPos === 'left';

              return (
                <React.Fragment key={item.id}>
                  <LessonNode
                    item={item}
                    index={index}
                    onPress={() => handleLessonPress(item)}
                  />

                  {/* Render đoạn đường nối xen kẽ, trừ Node cuối cùng */}
                  {!isLast && (
                    <WindingPath isActive={isPathActive} isLeftToRight={isLeftToRight} />
                  )}

                  {/* Hiển thị thẻ chặng tiếp theo nếu chưa load hết danh sách */}
                  {isLast && visibleLessons.length < lessons.length && (
                    <>
                      <WindingPath isActive={false} isLeftToRight={isLeftToRight} />
                      <NextStageCard />
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>
      </Animated.ScrollView>

      {/* --- BOTTOM SHEET THÔNG TIN LỬA/MÂY --- */}
      <BottomSheetModal
        ref={infoSheetRef}
        snapPoints={infoSnapPoints}
        backdropComponent={renderInfoBackdrop}
        backgroundStyle={{ backgroundColor: colors.background, borderRadius: Border.br_30 }}
        handleIndicatorStyle={{ backgroundColor: colors.borderDefault }}
        detached={true}
        bottomInset={40} // Khoảng cách cách đáy (tùy chỉnh theo ý muốn)
        style={styles.floatingSheet}
      >
        <BottomSheetView style={styles.sheetContent}>
          {infoContent.icon}
          <Text style={styles.sheetTitle}>{infoContent.title}</Text>
          <Text style={styles.sheetDesc}>{infoContent.desc}</Text>

          {infoContent.type && (
            <Button
              title={infoContent.type === 'streak' ? 'Xem chi tiết chuỗi học' : 'Đến Cửa hàng đổi thưởng'}
              variant="Black"
              onPress={() => {
                infoSheetRef.current?.dismiss();
                setTimeout(() => {
                  router.push(infoContent.type === 'streak' ? '/streak/streak' as any : '/cloud/' as any);
                }, 300); // Chờ hiệu ứng đóng modal rồi mới chuyển trang cho mượt
              }}
              style={{ width: '100%', marginTop: 10 }}
            />
          )}
          <Button title="Đã hiểu" variant="Gray" onPress={() => infoSheetRef.current?.dismiss()} style={{ width: '100%', marginTop: 10 }} />
        </BottomSheetView>
      </BottomSheetModal>

      {/* --- CUSTOM TOAST --- */}
      {toastMessage && (
        <Animated.View style={[styles.toastContainer, toastStyle]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

      {/* --- POPUP NHIỆM VỤ HẰNG NGÀY KÈM HIỆU ỨNG --- */}
      <DailyMissionsModal
        isVisible={isMissionsModalVisible}
        onClose={() => {
          setMissionsModalVisible(false);
          setIsAutoConfetti(false); // Reset cờ
        }}
        autoTriggerConfetti={isAutoConfetti}
        onClaimSuccess={() => fetchStats()}
      />

      {/* --- BOTTOM SHEET BÀI HỌC --- */}
      {selectedLesson && (
        <LessonBottomSheet
          ref={lessonSheetRef}
          lessonId={selectedLesson.id}
          unit={selectedLesson.unit}
          title={selectedLesson.title}
          lessonType={selectedLesson.lessonType as any}
          hangul={selectedLesson.hangul}
          rewardBadge={selectedLesson.rewardBadge}
          rewardClouds={selectedLesson.rewardClouds}
          onCloseRequest={() => lessonSheetRef.current?.dismiss()}
        />
      )}
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, // Đảm bảo nổi lên trên cùng
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 55, // Padding tạo không gian cho Thanh trạng thái của điện thoại (Tai thỏ / Pin)
    paddingBottom: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  mapArea: {
    position: 'relative',
    marginTop: -20,
    zIndex: 20,
  },
  nodesWrapper: {
    paddingTop: 80,
    paddingBottom: 60,
    zIndex: 2,
  },

  floatingSheet: {
    marginHorizontal: 15, // Khoảng cách 2 bên trái phải
  },

  // --- STYLES CHO BOTTOM SHEET ---
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: FontFamily.lexendDecaSemiBold,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  sheetDesc: {
    fontSize: 14,
    fontFamily: FontFamily.lexendDecaRegular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },

  // --- STYLES CHO CUSTOM TOAST ---
  toastContainer: {
    position: 'absolute',
    bottom: 120, // Hiển thị phía trên Bottom Tab bar
    alignSelf: 'center',
    backgroundColor: '#1E293B', // Màu xám đậm sang trọng
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30, // Dạng viên thuốc (pill)
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 6,
    zIndex: 9999, // Ưu tiên cao nhất
  },
  toastText: {
    color: '#FFFFFF',
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 14,
    textAlign: 'center',
  },

  // --- STYLES CHO STREAK FIRES LIST ---
  streakIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 35,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  streakIconWrapperActive: {
    backgroundColor: '#F0FFF0',
    borderColor: colors.primary || '#98F291',
  },
  streakDayText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  streakDayTextActive: {
    color: colors.textBrand || '#0C5F35',
  },
});
