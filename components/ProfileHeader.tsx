import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { GearSixIcon } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';
import StatusBadge from './StatusBadge';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import IconButton from './IconButton';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withTiming } from 'react-native-reanimated';
import { BellIcon } from 'phosphor-react-native';

interface ProfileHeaderProps {
  username?: string;
  email?: string;
  avatarUrl?: string;
  level?: string;
  isPremium?: boolean;
  hasNewNotification?: boolean;
}

const ProfileHeader = ({ username, email, avatarUrl, level, isPremium, hasNewNotification = true }: ProfileHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const wrapperWidth = useSharedValue(38);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    if (hasNewNotification) {
      wrapperWidth.value = withDelay(300, withSpring(80, { damping: 15, stiffness: 100 }));
      textOpacity.value = withDelay(400, withTiming(1, { duration: 300 }));
    } else {
      wrapperWidth.value = 38;
      textOpacity.value = 0;
    }
  }, [hasNewNotification]);

  const animatedWrapperStyle = useAnimatedStyle(() => {
    return {
      width: wrapperWidth.value,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View

        style={styles.gradientBg}
      />

      {/* Top Right Buttons */}
      <View style={styles.topRightContainer}>
        {/* Notification Button */}
        <Animated.View style={[styles.notificationWrapper, animatedWrapperStyle]}>
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => router.push('/notifications' as any)}
            activeOpacity={0.7}
          >
            <BellIcon size={24} color={colors.textSecondary} weight="bold" />
            <Animated.Text style={[styles.notificationText, animatedTextStyle]} numberOfLines={1}>
              mới!
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Settings Icon */}
        <IconButton Icon={GearSixIcon} variant='Main' onPress={() => router.push('/settings' as any)} />
      </View>


      {/* Avatar & Info */}
      <View style={styles.infoWrapper}>
        {isPremium ? (
          <LinearGradient
            colors={['#98F291', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumAvatarContainer}
          >
            <Image
              source={
                avatarUrl
                  ? { uri: avatarUrl }
                  : require('../assets/images/avatar/Ellipse 20-1.png')
              }
              style={styles.avatar}
              contentFit="cover"
            />
          </LinearGradient>
        ) : (
          <View style={styles.avatarContainer}>
            <Image
              source={
                avatarUrl
                  ? { uri: avatarUrl }
                  : require('../assets/images/avatar/Ellipse 20-1.png')
              }
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
        )}
        <Text style={styles.username}>{username || t('profile.header.guest', 'Khách')}</Text>
        <StatusBadge text={`${t('profile.header.level', 'Trình độ học')} ${level || 'Sơ cấp 1'}`} bgColor={colors.bgLevel} />
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    position: 'relative',
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 0,
    backgroundColor: colors.main200 || '#98F291',
  },
  topRightContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationWrapper: {
    backgroundColor: colors.borderDefault,
    borderRadius: 19,
    height: 38,
    overflow: 'hidden',
  },
  notificationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    paddingHorizontal: 7,
    gap: 4,
  },
  notificationText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: colors.orange500 || '#F97316',
  },
  infoWrapper: {
    alignItems: 'center',
    zIndex: 1,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.background || '#FFFFFF',
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Gap.gap_15,
    borderBottomWidth: 5,
    borderWidth: 5,
    borderBottomColor: colors.borderAvatar,
  },
  premiumAvatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Gap.gap_15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 51,
    borderColor: colors.background || '#FFFFFF',
    borderWidth: 2,
  },
  username: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: colors.textPrimary || '#1E1E1E',
    marginBottom: 4,
  },
  email: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: colors.textSecondary,
    marginBottom: Gap.gap_10,
  },
});

export default ProfileHeader;