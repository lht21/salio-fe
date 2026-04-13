import { useRouter } from 'expo-router';
import { CertificateIcon, CloudIcon, GearSixIcon } from 'phosphor-react-native';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';
import { Color, FontFamily, FontSize } from '../../constants/GlobalStyles';
import { Image } from 'expo-image';

// Import sub-components
import AlertBanner from '../../components/AlertBanner';
import { MenuItem } from '../../components/MenuItem';
import ProfileHeader from '../../components/ProfileHeader';
import StatsRow from '../../components/StatsRow';
import StreakCalendar from '../../components/StreakCalendar';
import { UpgradeBanner } from '../../components/UpgradeBanner';

export default function ProfileScreen() {
  const router = useRouter();

  // 1. Biến lưu giá trị cuộn
  const scrollY = useSharedValue(0);

  // 2. Bắt sự kiện cuộn
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // 3. Style cho Sticky Header: Hiện ra khi cuộn qua tọa độ 100px
  const stickyHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [100, 150], [0, 1], Extrapolation.CLAMP);
    const translateY = interpolate(scrollY.value, [100, 150], [-20, 0], Extrapolation.CLAMP);
    
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.safeArea}>
      {/* Sticky Header (Thanh dính trên cùng) */}
      <Animated.View style={[styles.stickyHeader, stickyHeaderStyle]}>
        <View style={styles.stickyUserInfo}>
          <Image 
            source={require('../../assets/images/avatar/Ellipse 2.png')} 
            style={styles.stickyAvatar}
            contentFit="cover"
          />
          <Text style={styles.stickyHeaderTitle}>tranlehuy</Text>
        </View>
        <TouchableOpacity 
          style={styles.stickySettingsBtn} 
          onPress={() => router.push('/settings')}
        >
          <View style={styles.settingsIconBg}>
            <GearSixIcon size={20} color={Color.bg} weight="fill" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false} // Để tắt hiệu ứng nảy làm lộ background trắng trên iOS
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >

        {/* Header (Background xanh + Avatar + Info) */}
        <ProfileHeader />

        {/* Khối 3 thông số */}
        <StatsRow
          onStreakPress={() => router.push({ pathname: '/(tabs)/streak' })}
          onScorePress={() => router.push({ pathname: '/(tabs)/certificate' })}
        />

        {/* Banner Vàng Thông báo */}
        <AlertBanner />

        {/* Lịch chuỗi hoạt động */}
        <StreakCalendar onHeaderPress={() => router.push({ pathname: '/(tabs)/streak' })} />

        {/* Menu Items */}
        <MenuItem
          icon={<CertificateIcon size={24} color={Color.main2} weight="fill" />}
          title="Chứng chỉ"
          subtitle="2 chứng chỉ đã ghi nhận"
        />

        <MenuItem
          icon={<CloudIcon size={24} color={Color.main2} weight="fill" />}
          title="103 đám mây"
          subtitle="Quy đổi phần thưởng"
        />

        {/* Banner Xanh nâng cấp */}
        <UpgradeBanner />

      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.main || '#FFFFFF',
    paddingTop: 50,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: Color.bg,
    paddingBottom: 20,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.main || '#98F291',
    paddingTop: 50, // Khớp với paddingTop của safeArea để không đè lên tai thỏ
    paddingBottom: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  stickyUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stickyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  stickyHeaderTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: Color.text || '#1E1E1E',
  },
  stickySettingsBtn: {
    position: 'absolute',
    right: 20,
    bottom: 12,
  },
  settingsIconBg: {
    backgroundColor: Color.gray || '#64748B',
    padding: 6,
    borderRadius: 16,
  }
});