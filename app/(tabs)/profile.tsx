import { useRouter } from 'expo-router';
import { CertificateIcon, CloudIcon, GearSixIcon } from 'phosphor-react-native';
import { StyleSheet, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
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

import { useUser } from '../../contexts/UserContext';
import UserService from '../../api/services/user.service';
import { MyStatsData } from '../../api/types/user.types';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, refreshUser } = useUser();

  const [stats, setStats] = useState<MyStatsData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshUser(), fetchStats()]);
    setRefreshing(false);
  }, [refreshUser]);

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
            source={
              user?.avatarUrl 
                ? { uri: user.avatarUrl } 
                : require('../../assets/images/avatar/Ellipse 20-1.png')
            } 
            style={styles.stickyAvatar}
            contentFit="cover"
          />
          <Text style={styles.stickyHeaderTitle}>{user?.username || 'Khách'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.stickySettingsBtn} 
          onPress={() => router.push('/settings' as any)}
        >
          <View style={styles.settingsIconBg}>
            <GearSixIcon size={20} color={Color.bg} weight="fill" />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Color.main2}
          />
        }
      >

        {/* Header (Background xanh + Avatar + Info) */}
        <ProfileHeader 
          username={user?.username}
          email={user?.email}
          avatarUrl={user?.avatarUrl}
          level={user?.level}
        />

        {/* Khối 3 thông số */}
        <StatsRow
          streak={stats?.gamification?.currentStreak}
          vocabCount={stats?.savedVocabulariesCount}
          score={stats?.statistics?.highestMockScore} // Hoặc thuộc tính tổng điểm tương đương
          certificates={stats?.gamification?.inventory?.badges?.length} 
          clouds={stats?.gamification?.clouds}
          onStreakPress={() => router.push('/streak/streak' as any)}
          onScorePress={() => router.push('/certificate/certificate' as any)}
        />

        {/* Banner Vàng Thông báo */}
        <AlertBanner />

        {/* Lịch chuỗi hoạt động */}
        <StreakCalendar onHeaderPress={() => router.push('/streak/streak' as any)} />

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
