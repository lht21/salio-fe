import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Modal, Image } from 'react-native';
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
import { FireIcon, CloudIcon } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import HeaderSection from '../../components/HeaderSection';
import WindingPath from '../../components/WindingPath';
import LessonNode, { LessonItem } from '../../components/LessonNode';
import { openLessonBottomSheet } from '../../components/Modals/lessonBottomSheetBus';
import { Color, FontFamily } from '@/constants/GlobalStyles';
import { useRouter } from 'expo-router';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const LESSONS: LessonItem[] = [
  {
    id: '0',
    unit: 'Bài 0',
    title: 'Chữ Hangul',
    status: 'completed',
    points: 100,
    mascotPos: 'left',
    mascotImg: require('../../assets/images/horani/sc1_b0.png'),
  },
  {
    id: '1',
    unit: 'Bài 1',
    title: 'Giới thiệu - 소개',
    status: 'completed',
    points: 100,
    mascotPos: 'right',
    mascotImg: require('../../assets/images/horani/sc1_b1.png'),
  },
  {
    id: '2',
    unit: 'Bài 2',
    title: 'Trường học - 학교',
    status: 'current',
    mascotPos: 'left',
    mascotImg: require('../../assets/images/horani/sc1_b2.png'),
  },
  {
    id: '3',
    unit: 'Bài 3',
    title: 'Sinh hoạt - 일상생활',
    status: 'locked',
    mascotPos: 'right',
    mascotImg: require('../../assets/images/horani/sc1_b3.png'),
  },
  {
    id: '4',
    unit: 'Bài 4',
    title: 'Ngày và thứ - 날짜와 요일',
    status: 'locked',
    mascotPos: 'left',
    mascotImg: require('../../assets/images/horani/sc1_b4.png'),
  },
];

export default function HomeScreen() {


  const router = useRouter();
  const currentLesson = React.useMemo(
    () => LESSONS.find((item) => item.status === 'current') ?? LESSONS[0],
    []
  );

  // 1. Khởi tạo biến lưu giá trị cuộn
  const scrollY = useSharedValue(0);

  // 2. Bắt sự kiện cuộn
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // --- ANIMATION CHUYỂN MÀU GRADIENT ---
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    colorProgress.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1, // Lặp vô hạn
      true // Đảo ngược từ 1 về 0
    );
  }, []);

  const animatedGradientProps = useAnimatedProps(() => {
    return {
      colors: [
        // Đổi màu đỉnh từ xanh nhạt sang hơi ngả vàng sáng
        interpolateColor(colorProgress.value, [0, 1], ['#CEF9B4', '#E6FFD1']),
        // Đổi màu đáy từ xanh gốc sang xanh neon tươi hơn
        interpolateColor(colorProgress.value, [0, 1], [Color.main || '#98F291', '#5DE367']),
      ]
    } as any;
  });

  // 3. Style cho Sticky Header: Hiện ra khi cuộn qua tọa độ 200px
  const stickyHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [180, 230], [0, 1], Extrapolation.CLAMP);
    const translateY = interpolate(scrollY.value, [180, 230], [-20, 0], Extrapolation.CLAMP);
    
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // --- STATE CHO POPUP THÔNG TIN ---
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoContent, setInfoContent] = useState<{title: string, desc: string, icon: React.ReactNode | null}>({ title: '', desc: '', icon: null });

  const handleShowFireInfo = () => {
    setInfoContent({
      title: 'Chuỗi ngày học (Streak)',
      desc: 'Mỗi ngày bạn hoàn thành ít nhất một bài học, ngọn lửa sẽ cháy thêm 1 ngày. Giữ lửa liên tục để nhận thưởng lớn nhé!',
      icon: <Image source={require('../../assets/images/streak/lv1.png')} style={{ width: 48, height: 48 }} resizeMode="contain" />
    });
    setInfoModalVisible(true);
  };

  const handleShowCloudInfo = () => {
    setInfoContent({
      title: 'Đám mây (Điểm thưởng)',
      desc: 'Tích lũy đám mây sau mỗi bài học để đổi lấy các phần quà hấp dẫn hoặc mở khóa tính năng đặc biệt trong cửa hàng.',
      icon: <Image source={require('../../assets/images/streak/cloud1.png')} style={{ width: 48, height: 48 }} resizeMode="contain" />
    });
    setInfoModalVisible(true);
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
      openLessonBottomSheet(item as any);
    }
  };

  return (
    <View style={styles.container}>

      {/* Sticky Header (Thanh dính trên cùng) */}
      <AnimatedLinearGradient 
        colors={['#CEF9B4', Color.main || '#98F291']} // Màu mặc định cho TypeScript
        animatedProps={animatedGradientProps}
        style={[styles.stickyHeader, stickyHeaderStyle]}
      >
        <StatusBadge text="Sơ cấp 1" bgColor="#FFFFFF" />
        <StatusBadge 
          icon={<Image source={require('../../assets/images/streak/lv1.png')} style={{ width: 20, height: 20 }} resizeMode="contain" />} 
          text="15" 
          bgColor="#FFFFFF" 
          onPress={handleShowFireInfo} 
        />
        <StatusBadge 
          icon={<Image source={require('../../assets/images/streak/cloud1.png')} style={{ width: 20, height: 20 }} resizeMode="contain" />} 
          text="103" 
          bgColor="#FFFFFF" 
          onPress={handleShowCloudInfo} 
        />
      </AnimatedLinearGradient>
      
      {/* Đổi ScrollView thành Animated.ScrollView để nhận tín hiệu cuộn */}
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16} // Tốc độ cập nhật 60fps
      >
        <HeaderSection 
          currentLesson={currentLesson} 
          onCurrentLessonPress={openLessonBottomSheet} 
          onFirePress={handleShowFireInfo}
          onCloudPress={handleShowCloudInfo}
        />

        <View style={styles.mapArea}>
          <WindingPath />

          <View style={styles.nodesWrapper}>
            {LESSONS.map((item, index) => (
              <LessonNode 
                key={item.id} 
                item={item} 
                index={index} 
                onPress={() => handleLessonPress(item)} 
              />
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* --- POPUP MODAL --- */}
      <Modal
        transparent={true}
        visible={infoModalVisible}
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {infoContent.icon}
            <Text style={styles.modalTitle}>{infoContent.title}</Text>
            <Text style={styles.modalDesc}>{infoContent.desc}</Text>
            
            <Button title="Đã hiểu" variant="Green" onPress={() => setInfoModalVisible(false)} style={{ width: '100%', marginTop: 10 }} />
          </View>
        </View>
      </Modal>

      {/* --- CUSTOM TOAST --- */}
      {toastMessage && (
        <Animated.View style={[styles.toastContainer, toastStyle]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bg || '#FFFFFF',
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
    gap: 40,
    zIndex: 2,
  },
  
  // --- STYLES CHO MODAL ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FontFamily.lexendDecaSemiBold,
    color: Color.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 14,
    fontFamily: FontFamily.lexendDecaRegular,
    color: Color.gray,
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
  }
});
