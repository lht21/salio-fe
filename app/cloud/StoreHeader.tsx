import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { ArrowLeftIcon, BoxingGloveIcon, ClockCounterClockwiseIcon, CloudIcon, TicketIcon } from 'phosphor-react-native';
import { FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

interface StoreHeaderProps {
  clouds: number;
  missionsCount?: number;
  onBack: () => void;
  onHistory: () => void;
  onMissionsPress?: () => void;
}

export default function StoreHeader({ clouds, missionsCount = 0, onBack, onHistory, onMissionsPress }: StoreHeaderProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  // Khởi tạo giá trị dịch chuyển của đám mây
  const bounceValue = useSharedValue(0);

  useEffect(() => {
    // Lặp lại vô hạn (-1) và đảo ngược chiều (true) hiệu ứng lên 5 đơn vị trong 1s
    bounceValue.value = withRepeat(
      withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedCloudStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceValue.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Phần nền xanh uốn cong */}
      <View style={styles.curvedBackground}>
        {/* Top Row: Nút điều hướng */}
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.iconButton} onPress={onBack} activeOpacity={0.7}>
            <ArrowLeftIcon size={18} color={colors.textBrand} weight="bold" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onHistory} activeOpacity={0.7}>
            <ClockCounterClockwiseIcon size={18} color={colors.textBrand} weight="bold" />
          </TouchableOpacity>
        </View>

        {/* Titles */}
        <View style={styles.titleContainer}>
          <Text style={styles.subtitle}>Cửa hàng</Text>
          <Text style={styles.mainTitle}>TINH LINH MƯA</Text>
        </View>
      </View>

      {/* Stats Cards (Nằm đè lên viền cong) */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIconWrapper, { backgroundColor: 'transparent' }]}>
            <Animated.Image
              source={require('../../assets/images/streak/cloud1.png')}
              style={[{ width: 32, height: 32 }, animatedCloudStyle]}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.statLabel}>Đám mây</Text>
            <Text style={styles.statValue}>{clouds}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.statCard} activeOpacity={0.7} onPress={onMissionsPress}>
          <View style={[styles.statIconWrapper, { backgroundColor: colors.orange }]}>
            <BoxingGloveIcon size={24} color={colors.background} weight="fill" />
          </View>
          <View>
            <Text style={styles.statLabel}>Nhiệm vụ</Text>
            <Text style={styles.statValue}>{missionsCount}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: 50, // Nhường chỗ cho 2 card lồi xuống
    zIndex: 10,
  },
  curvedBackground: {
    backgroundColor: colors.primaryLight,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: Padding.padding_15,
    paddingHorizontal: Padding.padding_20,
    paddingBottom: 60, // Tạo không gian để đẩy card đè lên
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.gap_20,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'flex-start',
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  mainTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 26,
    color: colors.textBrand, // Xanh lá đậm
  },
  statsContainer: {
    position: 'absolute',
    bottom: -30,
    left: Padding.padding_20,
    right: Padding.padding_20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Gap.gap_15,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: Border.br_20,
    padding: Padding.padding_15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent1, // Đám mây màu xanh dương
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: colors.textSecondary,
  },
  statValue: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    color: colors.textPrimary,
  },
});