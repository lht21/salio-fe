import { useRouter } from 'expo-router';
import { 
  CertificateIcon, 
  CloudIcon, 
  GearSixIcon, 
  CaretRightIcon, 
  BookOpenTextIcon,
  CardsIcon,
  TextAaIcon,
  HeadphonesIcon,
  BellIcon
} from 'phosphor-react-native';
import { StyleSheet, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback, useMemo } from 'react';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';
import { FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';

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
import IconButton from '@/components/IconButton';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [stats, setStats] = useState<MyStatsData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await UserService.getMyStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error(t('error.fetch_stats', 'Lỗi khi lấy thông tin thống kê:'), error);
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

  // Dữ liệu mẫu (Mock data) cho lịch sử học
  const MOCK_HISTORY = [
    { id: '1', type: 'vocabulary', title: '36 từ vựng', subtitle: 'Bài 1', iconColor: colors.blue || '#3B82F6' },
    { id: '2', type: 'grammar', title: '4 ngữ pháp', subtitle: 'Bài 5', iconColor: colors.purple || '#A855F7' },
    { id: '3', type: 'listening', title: 'Hội thoại: Mua sắm', subtitle: 'Bài 4', iconColor: colors.mint || '#14B8A6' },
    { id: '4', type: 'reading', title: 'Đoạn văn: Trường học', subtitle: 'Bài 2', iconColor: colors.cam || '#F97316' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
          <Text style={styles.stickyHeaderTitle}>{user?.username || t('profile.header.guest', 'Khách')}</Text>
        </View>
      
        <View style={styles.stickyTopRightContainer}>
          <IconButton Icon={BellIcon} onPress={() => router.push('/notifications' as any)} />
          <IconButton Icon={GearSixIcon} variant='Main' onPress={() => router.push('/settings' as any)} />
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 + insets.bottom }]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.main2}
          />
        }
      >

        {/* Header (Background xanh + Avatar + Info) */}
        <ProfileHeader 
          username={user?.username}
          email={user?.email}
          avatarUrl={user?.avatarUrl}
          level={user?.level}
          isPremium={user?.subscription?.type === 'premium'}
        />

        {/* Khối 3 thông số */}
        <StatsRow
          streak={stats?.gamification?.currentStreak}
          vocabCount={stats?.savedVocabulariesCount}
          score={stats?.statistics?.highestMockScore} // Hoặc thuộc tính tổng điểm tương đương
          certificates={stats?.gamification?.inventory?.badges?.length} 
          clouds={stats?.gamification?.clouds}
          onStreakPress={() => router.push('/streak/streak' as any)}
          onScorePress={() => router.push('/practice/full/history' as any)}
          onCertificatePress={() => router.push('/certificate/certificate' as any)}
          onVocabPress={() => router.push('/vocabulary' as any)}
          onCloudPress={() => router.push('/cloud/' as any)}
        />

        {/* Banner Vàng Thông báo */}
        <AlertBanner />

        {/* Lịch chuỗi hoạt động */}
        <StreakCalendar onHeaderPress={() => router.push('/streak/streak' as any)} />

        {/* Lịch sử học */}
        <View style={styles.historySection}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{t('history.title', 'Lịch sử học')}</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push('/tracking/' as any)}
            >
              <Text style={styles.seeAllText}>{t('history.see_all', 'Xem tất cả')}</Text>
              <CaretRightIcon size={14} color={colors.main2 || '#508D4E'} weight="bold" />
            </TouchableOpacity>
          </View>

          <View style={styles.historyList}>
            {MOCK_HISTORY.map((item) => (
              <TouchableOpacity key={item.id} style={styles.historyCard} activeOpacity={0.7}>
                <View style={styles.historyCardInfo}>
                  <View style={[styles.historyIconWrap, { backgroundColor: item.iconColor + '20' }]}>
                    {item.type === 'vocabulary' && <CardsIcon size={24} color={item.iconColor} weight="fill" />}
                    {item.type === 'grammar' && <TextAaIcon size={24} color={item.iconColor} weight="fill" />}
                    {item.type === 'listening' && <HeadphonesIcon size={24} color={item.iconColor} weight="fill" />}
                    {item.type === 'reading' && <BookOpenTextIcon size={24} color={item.iconColor} weight="fill" />}
                  </View>
                  <View style={styles.historyTextWrap}>
                    <Text style={styles.historyCardTitle}>{item.title}</Text>
                    <Text style={styles.historyCardSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <CaretRightIcon size={20} color={colors.gray} weight="bold" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Banner Xanh nâng cấp - Hiển thị nếu người dùng chưa có gói, hoặc đang ở gói miễn phí */}
        {(!user?.subscription?.type || user?.subscription?.type === 'free') && <UpgradeBanner />}

      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.main200,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.bg,
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
    backgroundColor: colors.main200,
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
    fontSize: FontSize.fs_16,
    color: colors.text,
  },
  stickyTopRightContainer: {
    position: 'absolute',
    right: 20,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsIconBg: {
    backgroundColor: colors.gray,
    padding: 6,
    borderRadius: 16,
  },
  historySection: {
    paddingHorizontal: Padding.padding_15 || 15,
    marginTop: 24,
    marginBottom: Gap.gap_20 || 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.gap_15 || 15,
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: colors.gray,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: colors.main2 || '#508D4E',
  },
  historyList: {
    gap: Gap.gap_10 || 10,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bg,
    borderRadius: Border.br_30 || 30,
    borderWidth: 1,
    borderColor: colors.stroke,
    padding: 16,
  },
  historyCardInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_10 || 10,
  },
  historyIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyTextWrap: {
    flex: 1,
    gap: 3,
  },
  historyCardTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: colors.text,
  },
  historyCardSubtitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: colors.gray,
  }
});
