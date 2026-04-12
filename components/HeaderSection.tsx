import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { FireIcon, CloudIcon } from 'phosphor-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
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

type HeaderSectionProps = {
  currentLesson: LessonItem;
  onCurrentLessonPress?: (item: LessonItem) => void;
};

const HeaderSection = ({ currentLesson, onCurrentLessonPress }: HeaderSectionProps) => {
  // --- ANIMATION CHUYỂN ĐỘNG LƠ LỬNG ---
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Lặp vô hạn
      true // Đảo ngược (lên rồi xuống)
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <LinearGradient colors={['#CEF9B4', Color.main || '#98F291']} style={styles.headerGradient}>
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
          <StatusBadge text="Sơ cấp 1" bgColor={Color.vang || '#F9F871'} />
          <StatusBadge
            icon={<FireIcon size={20} color="#9F0000" weight="fill" />}
            text="15"
            bgColor={Color.vang || '#F9F871'}
          />
          <StatusBadge
            icon={<CloudIcon size={20} color="#D37B07" weight="fill" />}
            text="103"
            bgColor={Color.vang || '#F9F871'}
          />
        </View>
      </View>

      <CurrentLessonCard lesson={currentLesson} onPress={onCurrentLessonPress} />
    </LinearGradient>
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
    marginBottom: 35,
  },
});

export default HeaderSection;