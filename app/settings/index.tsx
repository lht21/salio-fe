import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import {
  BellIcon,
  CaretRightIcon,
  CookieIcon,
  EnvelopeSimpleIcon,
  GlobeIcon,
  HeadsetIcon,
  InfoIcon,
  LockKeyIcon,
  MoonIcon,
  PasswordIcon,
  SignOutIcon,
  SpeakerHighIcon,
  StarIcon,
  SunIcon,
  TranslateIcon,
  UserIcon,
  UsersIcon,
} from 'phosphor-react-native';
import { useState, useEffect, useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChangeAvatarModal from '@/components/Modals/ChangeAvatarModal';
import ChangeDisplayModeModal, {
  DisplayMode,
} from '@/components/Modals/ChangeDisplayModeModal';
import ChangeLanguageModal, {
  LanguageMode,
} from '@/components/Modals/ChangeLanguageModal';
import { ConfirmModal } from '@/components/ModalResult/ConfirmModal';
import ChangePasswordModal from '@/components/Modals/ChangePasswordModal';
import ChangeUserNameModal from '@/components/Modals/ChangeUserNameModal';
import EmailSettingsModal from '@/components/Modals/EmailSettingsModal';
import ChangeVoiceModal, { VoiceType } from '@/components/Modals/ChangeVoiceModal';
import ChangeReminderModal, { ReminderType } from '@/components/Modals/ChangeReminderModal';
import { SettingsRow } from '@/components/SettingsRow';
import ScreenHeader from '@/components/ScreenHeader';
import { AVATAR_PRESETS, AvatarPreset } from '@/constants/avatarPresets';
import { Border, FontFamily, FontSize, Gap, Padding } from '@/constants/GlobalStyles';
import { useUser } from '@/contexts/UserContext';
import UserService from '@/api/services/user.service';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [selectedAvatar, setSelectedAvatar] = useState<AvatarPreset>(() => {
    const preset = AVATAR_PRESETS.find(a => a.id === user?.avatarUrl);
    if (preset) {
      return preset;
    }
    if (user?.avatarUrl) {
      return { id: user.avatarUrl, imageSource: { uri: user.avatarUrl }, label: 'Ảnh cá nhân' } as AvatarPreset;
    }
    return AVATAR_PRESETS[1] ?? AVATAR_PRESETS[0];
  });
  const [displayMode, setDisplayMode] = useState<DisplayMode>((user?.preferences?.theme as DisplayMode) || 'light');
  const [language, setLanguage] = useState<LanguageMode>((user?.preferences?.language as LanguageMode) || 'vi');
  const [userName, setUserName] = useState(user?.username || 'Khách');
  const [voice, setVoice] = useState<VoiceType>((user?.preferences?.voiceGender as VoiceType) || 'male');
  const [reminder, setReminder] = useState<ReminderType>(() => {
    if (!user?.preferences?.notifications?.enabled) return 'none';
    if (user?.preferences?.notifications?.dailyReminderTime === '08:00') return 'morning';
    if (user?.preferences?.notifications?.dailyReminderTime === '20:00') return 'evening';
    return 'none';
  });

  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [isDisplayModeModalVisible, setDisplayModeModalVisible] = useState(false);
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isUserNameModalVisible, setUserNameModalVisible] = useState(false);
  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isVoiceModalVisible, setVoiceModalVisible] = useState(false);
  const [isReminderModalVisible, setReminderModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setUserName(user.username);
      setDisplayMode((user.preferences?.theme as DisplayMode) || 'light');
      setLanguage((user.preferences?.language as LanguageMode) || 'vi');
      setVoice((user.preferences?.voiceGender as VoiceType) || 'male');
      const preset = AVATAR_PRESETS.find(a => a.id === user.avatarUrl);
      if (preset) {
        setSelectedAvatar(preset);
      } else if (user.avatarUrl) {
        // It's a custom URL, create a temporary preset object
        setSelectedAvatar({ id: user.avatarUrl, imageSource: { uri: user.avatarUrl }, label: 'Ảnh cá nhân' } as AvatarPreset);
      } else {
        setSelectedAvatar(AVATAR_PRESETS[1] ?? AVATAR_PRESETS[0]);
      }
      
      if (!user.preferences?.notifications?.enabled) {
        setReminder('none');
      } else if (user.preferences?.notifications?.dailyReminderTime === '08:00') {
        setReminder('morning');
      } else if (user.preferences?.notifications?.dailyReminderTime === '20:00') {
        setReminder('evening');
      }
    }
  }, [user]);

  const LANGUAGE_LABELS: Record<LanguageMode, string> = {
    vi: t('settings.vietnamese'),
    en: t('settings.english'),
    ko: t('settings.korean'),
  };

  const VOICE_LABELS: Record<VoiceType, string> = { 
    male: t('settings.maleVoice'), 
    female: t('settings.femaleVoice') 
  };

  const handleConfirmLogout = async () => {
    setLogoutModalVisible(false);
    
    // 1. Xóa token để cắt đứt phiên đăng nhập hiện tại
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    
    // 2. Refresh lại UserContext (không có token -> API lỗi -> user tự động về null)
    await refreshUser();

    router.replace('/(auth)/sign-in');
  };

  const handleSelectAvatar = async (avatar: AvatarPreset) => {
    try {
      await UserService.updateProfile({ avatarUrl: avatar.id });
      setSelectedAvatar(avatar);
      setAvatarModalVisible(false);
      await refreshUser();
    } catch (error) {
      console.error('Lỗi cập nhật avatar:', error);
    }
  };

  const handleUploadAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Ép khung cắt ảnh hình vuông cho avatar
        quality: 0.8,   // Giảm chất lượng 1 chút để tối ưu dung lượng upload
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const formData = new FormData();
        
        const filename = asset.uri.split('/').pop() || 'avatar.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('avatar', { uri: asset.uri, name: filename, type } as any);

        await UserService.updateAvatar(formData);
        setAvatarModalVisible(false);
        await refreshUser(); // Cập nhật lại context để tự động đồng bộ ảnh mới trên toàn app
      }
    } catch (error) {
      console.error('Lỗi khi upload avatar từ thiết bị:', error);
    }
  };

  const handleSelectDisplayMode = async (mode: DisplayMode) => {
    try {
      await UserService.updatePreferences({ preferences: { theme: mode } });
      setDisplayMode(mode);
      setDisplayModeModalVisible(false);
      await refreshUser();
    } catch (error) {
      console.error('Lỗi cập nhật giao diện:', error);
    }
  };

  const handleSelectLanguage = async (value: LanguageMode) => {
    try {
      await UserService.updatePreferences({ preferences: { language: value } });
      setLanguage(value);
      setLanguageModalVisible(false);
      await refreshUser();
    } catch (error) {
      console.error('Lỗi cập nhật ngôn ngữ:', error);
    }
  };

  const handleChangeUserName = async (newUserName: string) => {
    try {
      await UserService.updateProfile({ username: newUserName });
      setUserName(newUserName);
      setUserNameModalVisible(false);
      await refreshUser();
    } catch (error) {
      console.error('Lỗi cập nhật tên người dùng:', error);
    }
  };

  const handleSelectVoice = async (selectedVoice: VoiceType) => {
    try {
      await UserService.updatePreferences({ preferences: { voiceGender: selectedVoice } });
      setVoice(selectedVoice);
      setVoiceModalVisible(false);
      await refreshUser();
    } catch (error) {
      console.error('Lỗi cập nhật giọng đọc:', error);
    }
  };

  const handleSelectReminder = async (selectedReminder: ReminderType) => {
    try {
      let enabled = false;
      let time = '08:00';
      if (selectedReminder === 'morning') {
        enabled = true;
        time = '08:00';
      } else if (selectedReminder === 'evening') {
        enabled = true;
        time = '20:00';
      }
      await UserService.updatePreferences({ 
        preferences: { notifications: { enabled, dailyReminderTime: time } } 
      });
      setReminder(selectedReminder);
      setReminderModalVisible(false);
      await refreshUser();
    } catch (error) {
      console.error('Lỗi cập nhật nhắc nhở:', error);
    }
  };

  const displayModeLabel = displayMode === 'light' ? t('settings.light') : t('settings.dark');
  const languageLabel = LANGUAGE_LABELS[language];
  
  const voiceLabel = VOICE_LABELS[voice];
  const reminderLabel = reminder === 'none' ? t('settings.reminder') : (reminder === 'morning' ? '08:00' : '20:00');

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={t('settings.title')} style={{ backgroundColor: colors.bg2 }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.section}
          activeOpacity={0.82}
          onPress={() => setAvatarModalVisible(true)}
        >
          <View style={styles.avatarRow}>
            <Image source={selectedAvatar.imageSource} style={styles.avatarImage} />
            <View style={styles.avatarAction}>
              <Text style={styles.avatarText}>{t('settings.change')}</Text>
              <CaretRightIcon size={16} color={colors.gray} weight="bold" />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.personalInfo')}</Text>
          <View style={styles.card}>
            <SettingsRow
              icon={<UserIcon size={24} color={colors.main2} weight="regular" />}
              label={t('settings.username')}
              value={userName}
              onPress={() => setUserNameModalVisible(true)}
            />
            <SettingsRow
              icon={<EnvelopeSimpleIcon size={24} color={colors.main2} weight="regular" />}
              label={t('settings.email')}
              value={user?.email || t('settings.notUpdated')}
              onPress={() => setEmailModalVisible(true)}
            />
            <SettingsRow
              icon={<PasswordIcon size={24} color={colors.main2} weight="regular" />}
              label={t('settings.password')}
              value={t('settings.changePassword')}
              isLast
              onPress={() => setPasswordModalVisible(true)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.studyPlan')}</Text>
          <View style={styles.card}>
            <SettingsRow
              icon={<StarIcon size={24} color={colors.main2} weight="fill" />}
              label="Salio Master TOPIK"
              isLast
              onPress={() => router.push('/subscription/manage')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.interaction')}</Text>
          <View style={[styles.card, styles.gridCard]}>
            <TouchableOpacity
              style={[styles.gridItem, styles.gridItemButton]}
              activeOpacity={0.8}
              onPress={() => setDisplayModeModalVisible(true)}
            >
              {displayMode === 'light' ? (
                <SunIcon size={28} color={colors.cam} weight="fill" />
              ) : (
                <MoonIcon size={28} color={colors.cam} weight="fill" />
              )}
              <Text style={styles.gridText}>{displayModeLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridItem, styles.gridItemButton]}
              activeOpacity={0.8}
              onPress={() => setLanguageModalVisible(true)}
            >
              <TranslateIcon size={28} color={colors.cam} weight="fill" />
              <Text style={styles.gridText}>{languageLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.gridItem, styles.gridItemButton]}
              activeOpacity={0.8}
              onPress={() => setReminderModalVisible(true)}
            >
              <BellIcon size={28} color={colors.cam} weight="fill" />
              <Text style={styles.gridText}>{reminderLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.gridItem, styles.gridItemButton]}
              activeOpacity={0.8}
              onPress={() => setVoiceModalVisible(true)}
            >
              <SpeakerHighIcon size={28} color={colors.cam} weight="fill" />
              <Text style={styles.gridText}>{voiceLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.platform')}</Text>
          <View style={styles.card}>
            <SettingsRow
              icon={<GlobeIcon size={24} color={colors.main2} weight="regular" />}
              label={t('settings.website')}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
          <View style={styles.card}>
            <SettingsRow
              icon={<LockKeyIcon size={24} color={colors.main2} weight="regular" />}
              label={t('settings.privacyPolicy')}
            />
            <SettingsRow
              icon={<CookieIcon size={24} color={colors.main2} weight="regular" />}
              label={t('settings.termsOfService')}
            />
            <SettingsRow
              icon={<HeadsetIcon size={24} color={colors.main2} weight="regular" />}
              label={t('settings.supportCenter')}
            />
            <SettingsRow
              icon={<InfoIcon size={24} color={colors.main2} weight="regular" />}
              label={t('settings.aboutUs')}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <SettingsRow
              icon={<UsersIcon size={24} color={colors.xanh} weight="regular" />}
              label={t('settings.loginOther')}
              labelColor={colors.gray}
              showArrow={false}
            />
            <SettingsRow
              icon={<SignOutIcon size={24} color={colors.red} weight="regular" />}
              label={t('settings.logout')}
              labelColor={colors.red}
              showArrow={false}
              isLast
              onPress={() => setLogoutModalVisible(true)}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>v0.2</Text>
        </View>
      </ScrollView>

      <ChangeAvatarModal
        visible={isAvatarModalVisible}
        selectedAvatarId={selectedAvatar.id}
        avatarOptions={AVATAR_PRESETS}
        onSelectAvatar={handleSelectAvatar}
        onClose={() => setAvatarModalVisible(false)}
        onUploadPress={handleUploadAvatar}
      />

      <ChangeDisplayModeModal
        visible={isDisplayModeModalVisible}
        mode={displayMode}
        onSelectMode={handleSelectDisplayMode}
        onClose={() => setDisplayModeModalVisible(false)}
      />

      <ChangeLanguageModal
        visible={isLanguageModalVisible}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        onClose={() => setLanguageModalVisible(false)}
      />

      <ChangeUserNameModal
        visible={isUserNameModalVisible}
        currentUserName={userName}
        onChangeUserName={handleChangeUserName}
        onClose={() => setUserNameModalVisible(false)}
      />

      <EmailSettingsModal
        visible={isEmailModalVisible}
        email={user?.email || ''}
        onClose={() => setEmailModalVisible(false)}
        onDeleteAccount={() => {
          console.log('Xóa tài khoản đã được yêu cầu');
          setEmailModalVisible(false);
        }}
      />

      <ChangePasswordModal
        visible={isPasswordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
      />

      <ChangeVoiceModal
        visible={isVoiceModalVisible}
        voice={voice}
        onSelectVoice={handleSelectVoice}
        onClose={() => setVoiceModalVisible(false)}
      />

      <ChangeReminderModal
        visible={isReminderModalVisible}
        reminder={reminder}
        onSelectReminder={handleSelectReminder}
        onClose={() => setReminderModalVisible(false)}
      />

      <ConfirmModal
        isVisible={isLogoutModalVisible}
        title="Rời đi rồi à?"
        subtitle="Bạn sẽ cần đăng nhập lại để tiếp tục học nhé."
        confirmText={t('settings.logout')}
        cancelText="Tiếp tục học"
        isDestructive={true}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg2,
  },
  scrollContent: {
    padding: Padding.padding_15,
    paddingBottom: 40,
  },
  section: {
    marginBottom: Gap.gap_10,
    borderRadius: Border.br_15,
    padding: Padding.padding_15,
    backgroundColor: colors.bg,
  },
  sectionTitle: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: colors.gray,
    marginBottom: Gap.gap_8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.bg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Padding.padding_10,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.main2,
  },
  avatarAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  avatarText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: colors.gray,
  },
  gridCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Padding.padding_15,
    gap: 6,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    gap: Gap.gap_8,
  },
  gridItemButton: {
    borderRadius: 16,
  },
  gridText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: colors.gray,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: colors.gray,
  },
});
