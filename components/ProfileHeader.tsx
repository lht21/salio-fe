import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { GearSixIcon } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';
import StatusBadge from './StatusBadge';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileHeaderProps {
  username?: string;
  email?: string;
  avatarUrl?: string;
  level?: string;
  isPremium?: boolean;
}

const ProfileHeader = ({ username, email, avatarUrl, level, isPremium }: ProfileHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View
        
        style={styles.gradientBg}
      />
      
      {/* Settings Icon */}
      <TouchableOpacity 
        style={styles.settingsBtn}
        onPress={() => router.push('/settings' as any)}
      >
        <View style={styles.settingsIconBg}>
          <GearSixIcon size={24} color={colors.bg} weight="fill" />
        </View>
      </TouchableOpacity>

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
        <StatusBadge text={`${t('profile.header.level', 'Trình độ học')} ${level || 'Sơ cấp 1'}`} bgColor={colors.vang || '#F9F871'} />
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
    backgroundColor: colors.main || '#98F291',
  },
  settingsBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  settingsIconBg: {
    backgroundColor: colors.gray,
    padding: 8,
    borderRadius: 20,
  },
  infoWrapper: {
    alignItems: 'center',
    zIndex: 1,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.bg || '#FFFFFF',
    borderColor: colors.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Gap.gap_15,
    borderBottomWidth:5,
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
    borderColor: colors.bg || '#FFFFFF',
    borderWidth: 2,
  },
  username: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: colors.text || '#1E1E1E',
    marginBottom: 4,
  },
  email: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: colors.gray,
    marginBottom: Gap.gap_10,
  },
});

export default ProfileHeader;