import { useRouter } from 'expo-router';
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
import { useState } from 'react';
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
import { Border, Color, FontFamily, FontSize, Gap, Padding, Stroke } from '@/constants/GlobalStyles';

const LANGUAGE_LABELS: Record<LanguageMode, string> = {
  vi: 'Tiếng Việt',
  en: 'Tiếng Anh',
  ko: 'Tiếng Hàn',
};

export default function SettingsScreen() {
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarPreset>(
    AVATAR_PRESETS[1] ?? AVATAR_PRESETS[0]
  );
  const [displayMode, setDisplayMode] = useState<DisplayMode>('light');
  const [language, setLanguage] = useState<LanguageMode>('vi');
  const [userName, setUserName] = useState('tranlehuy');
  const [voice, setVoice] = useState<VoiceType>('male');
  const [reminder, setReminder] = useState<ReminderType>('none');

  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [isDisplayModeModalVisible, setDisplayModeModalVisible] = useState(false);
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isUserNameModalVisible, setUserNameModalVisible] = useState(false);
  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isVoiceModalVisible, setVoiceModalVisible] = useState(false);
  const [isReminderModalVisible, setReminderModalVisible] = useState(false);

  const handleConfirmLogout = () => {
    setLogoutModalVisible(false);
    router.replace('/(auth)/sign-in');
  };

  const handleSelectAvatar = (avatar: AvatarPreset) => {
    setSelectedAvatar(avatar);
    setAvatarModalVisible(false);
  };

  const handleUploadAvatar = () => {
    console.log('Avatar upload from device is not implemented yet.');
  };

  const handleSelectDisplayMode = (mode: DisplayMode) => {
    setDisplayMode(mode);
    setDisplayModeModalVisible(false);
  };

  const handleSelectLanguage = (value: LanguageMode) => {
    setLanguage(value);
    setLanguageModalVisible(false);
  };

  const handleChangeUserName = (newUserName: string) => {
    setUserName(newUserName);
    setUserNameModalVisible(false);
  };

  const handleChangePassword = (currentPassword: string, newPassword: string) => {
    console.log('Password changed:', { currentPassword, newPassword });
    setPasswordModalVisible(false);
  };

  const handleSelectVoice = (selectedVoice: VoiceType) => {
    setVoice(selectedVoice);
    setVoiceModalVisible(false);
  };

  const handleSelectReminder = (selectedReminder: ReminderType) => {
    setReminder(selectedReminder);
    setReminderModalVisible(false);
  };

  const displayModeLabel = displayMode === 'light' ? 'Sáng' : 'Tối';
  const languageLabel = LANGUAGE_LABELS[language];
  
  const VOICE_LABELS: Record<VoiceType, string> = { male: 'Giọng Nam', female: 'Giọng Nữ' };
  const voiceLabel = VOICE_LABELS[voice];
  const reminderLabel = reminder === 'none' ? 'Nhắc nhở' : (reminder === 'morning' ? '08:00' : '20:00');

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Cài đặt" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.section}
          activeOpacity={0.82}
          onPress={() => setAvatarModalVisible(true)}
        >
          <View style={styles.avatarRow}>
            <Image source={selectedAvatar.imageSource} style={styles.avatarImage} />
            <View style={styles.avatarAction}>
              <Text style={styles.avatarText}>Thay đổi</Text>
              <CaretRightIcon size={16} color={Color.gray} weight="bold" />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <View style={styles.card}>
            <SettingsRow
              icon={<UserIcon size={24} color={Color.main2} weight="regular" />}
              label="Tên người dùng"
              value={userName}
              onPress={() => setUserNameModalVisible(true)}
            />
            <SettingsRow
              icon={<EnvelopeSimpleIcon size={24} color={Color.main2} weight="regular" />}
              label="Email"
              value="huyt61933@gmail.com"
              onPress={() => setEmailModalVisible(true)}
            />
            <SettingsRow
              icon={<PasswordIcon size={24} color={Color.main2} weight="regular" />}
              label="Mật khẩu"
              value="Đổi mật khẩu"
              isLast
              onPress={() => setPasswordModalVisible(true)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gói học tập</Text>
          <View style={styles.card}>
            <SettingsRow
              icon={<StarIcon size={24} color={Color.main2} weight="fill" />}
              label="Salio Master TOPIK"
              isLast
              onPress={() => router.push('/subscription/manage')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tương tác</Text>
          <View style={[styles.card, styles.gridCard]}>
            <TouchableOpacity
              style={[styles.gridItem, styles.gridItemButton]}
              activeOpacity={0.8}
              onPress={() => setDisplayModeModalVisible(true)}
            >
              {displayMode === 'light' ? (
                <SunIcon size={28} color={Color.cam} weight="fill" />
              ) : (
                <MoonIcon size={28} color={Color.cam} weight="fill" />
              )}
              <Text style={styles.gridText}>{displayModeLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridItem, styles.gridItemButton]}
              activeOpacity={0.8}
              onPress={() => setLanguageModalVisible(true)}
            >
              <TranslateIcon size={28} color={Color.cam} weight="fill" />
              <Text style={styles.gridText}>{languageLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.gridItem, styles.gridItemButton]}
              activeOpacity={0.8}
              onPress={() => setReminderModalVisible(true)}
            >
              <BellIcon size={28} color={Color.cam} weight="fill" />
              <Text style={styles.gridText}>{reminderLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.gridItem, styles.gridItemButton]}
              activeOpacity={0.8}
              onPress={() => setVoiceModalVisible(true)}
            >
              <SpeakerHighIcon size={28} color={Color.cam} weight="fill" />
              <Text style={styles.gridText}>{voiceLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nền tảng</Text>
          <View style={styles.card}>
            <SettingsRow
              icon={<GlobeIcon size={24} color={Color.main2} weight="regular" />}
              label="Website"
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giới thiệu</Text>
          <View style={styles.card}>
            <SettingsRow
              icon={<LockKeyIcon size={24} color={Color.main2} weight="regular" />}
              label="Quyền riêng tư"
            />
            <SettingsRow
              icon={<CookieIcon size={24} color={Color.main2} weight="regular" />}
              label="Điều khoản dịch vụ"
            />
            <SettingsRow
              icon={<HeadsetIcon size={24} color={Color.main2} weight="regular" />}
              label="Trung tâm hỗ trợ"
            />
            <SettingsRow
              icon={<InfoIcon size={24} color={Color.main2} weight="regular" />}
              label="Về chúng tôi"
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <SettingsRow
              icon={<UsersIcon size={24} color={Color.xanh} weight="regular" />}
              label="Đăng nhập bằng tài khoản khác"
              labelColor={Color.gray}
              showArrow={false}
            />
            <SettingsRow
              icon={<SignOutIcon size={24} color={Color.red} weight="regular" />}
              label="Đăng xuất"
              labelColor={Color.red}
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
        email="huyt61933@gmail.com"
        onClose={() => setEmailModalVisible(false)}
        onDeleteAccount={() => {
          console.log('Xóa tài khoản đã được yêu cầu');
          setEmailModalVisible(false);
        }}
      />

      <ChangePasswordModal
        visible={isPasswordModalVisible}
        onChangePassword={handleChangePassword}
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
        confirmText="Đăng xuất"
        cancelText="Tiếp tục học"
        isDestructive={true}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  scrollContent: {
    padding: Padding.padding_15,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
    borderColor: Color.stroke,
    borderWidth: Stroke.stroke,
    borderRadius: Border.br_15,
    padding: Padding.padding_15,
    backgroundColor: Color.bg,
  },
  sectionTitle: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: Color.gray,
    marginBottom: Gap.gap_8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Color.bg,
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
    backgroundColor: Color.main2,
  },
  avatarAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  avatarText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.gray,
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
    color: Color.gray,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.gray,
  },
});
