import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { 
  ArrowLeftIcon,
  CaretRightIcon,
  UserIcon,
  EnvelopeSimpleIcon,
  StarIcon, 
  SunIcon,
  TranslateIcon,
  BellIcon,
  SpeakerHighIcon,
  GlobeIcon, 
  LockKeyIcon,
  CookieIcon,
  HeadsetIcon,
  InfoIcon,
  UsersIcon,
  SignOutIcon,
  PasswordIcon,

} from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import { SettingsRow } from '../../components/SettingsRow';
import { UpgradeBanner } from '../../components/UpgradeBanner';
import { useRouter } from 'expo-router';
import { ConfirmModal } from '@/components/ModalConfirm/ConfirmModal';


export default function SettingsScreen() {

  const router = useRouter();

  // State quản lý việc hiển thị Modal đăng xuất
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  // Hàm xử lý khi người dùng nhấn "Có"
  const handleConfirmLogout = () => {
    setLogoutModalVisible(false);
    // TODO: Xóa token, clear store state...
    // Sau khi xử lý xong, điều hướng về màn hình Đăng nhập
    router.replace('/(auth)/sign-in'); 
  };
  return (
    <View style={styles.container}>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon size={24} color={Color.text} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 2. Khối Đổi Avatar */}
        <TouchableOpacity style={styles.section}>
          <View style={styles.avatarRow}>
            {/* Giả lập Avatar với hình ảnh, thay source bằng ảnh thật của bạn */}
            <Image 
              source={{ uri: 'https://i.pravatar.cc/100' }} 
              style={styles.avatarImage} 
            />
            <View style={styles.avatarAction}>
              <Text style={styles.avatarText}>Thay đổi</Text>
              <CaretRightIcon size={16} color={Color.gray} weight="bold" />
            </View>
          </View>
        </TouchableOpacity>

        {/* 3. Khối Thông tin cá nhân */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <View style={styles.card}>
            <SettingsRow 
              icon={<UserIcon size={24} color={Color.main2} weight="regular" />} 
              label="Tên người dùng" 
              value="tranlehuy" 
            />
            <SettingsRow 
              icon={<EnvelopeSimpleIcon size={24} color={Color.main2} weight="regular" />} 
              label="Email" 
              value="huyt61933@gmail.com" 
            />
            <SettingsRow 
              icon={<PasswordIcon size={24} color={Color.main2} weight="regular" />} 
              label="Mật khẩu" 
              value="Đổi mật khẩu" 
              isLast={true}
            />
          </View>
        </View>

        {/* 4. Khối Gói học tập */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gói học tập</Text>
          {/* Box của UpgradeBanner đã có margin, bọc trong View có margin âm để cân đối nếu cần, hoặc chỉnh trực tiếp trong file của bạn */}
          <View style={styles.card}>
            <SettingsRow 
              icon={<StarIcon size={24} color={Color.main2} weight="fill" />} 
              label="Salio Master TOPIK" 
              isLast={true}
              onPress={() => router.push('/subscription/manage')}
            />
          </View>
        </View>

        {/* 5. Khối Tương tác */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tương tác</Text>
          <View style={[styles.card, styles.gridCard]}>
            <View style={styles.gridItem}>
              <SunIcon size={28} color={Color.cam} weight="fill" />
              <Text style={styles.gridText}>Sáng</Text>
            </View>
            <View style={styles.gridItem}>
              <TranslateIcon size={28} color={Color.cam} weight="fill" />
              <Text style={styles.gridText}>Tiếng Việt</Text>
            </View>
            <View style={styles.gridItem}>
              <BellIcon size={28} color={Color.cam} weight="fill" />
              <Text style={styles.gridText}>Nhắc nhở</Text>
            </View>
            <View style={styles.gridItem}>
              <SpeakerHighIcon size={28} color={Color.cam} weight="fill" />
              <Text style={styles.gridText}>Giọng Nam</Text>
            </View>
          </View>
        </View>

        {/* 6. Khối Nền tảng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nền tảng</Text>
          <View style={styles.card}>
            <SettingsRow 
              icon={<GlobeIcon size={24} color={Color.main2} weight="regular" />} 
              label="Website" 
              isLast={true}
            />
          </View>
        </View>

        {/* Khối Giới thiệu */}
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
              isLast={true}
            />
          </View>
        </View>

        {/* 7. Khối Hành động (Tài khoản) */}
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
              isLast={true}
              onPress={() => setLogoutModalVisible(true)} // Mở modal khi bấm
            />
          </View>
        </View>

        {/* 8. Footer */}
        <View style={styles.footer}>
          
          <Text style={styles.versionText}>v0.2</Text>
        </View>

      </ScrollView>

      <ConfirmModal 
        isVisible={isLogoutModalVisible}
        title="Bạn chắc chắn muốn đăng xuất chứ?"
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bg, // Nền tổng thể hơi xám nhẹ để nổi bật các Card trắng
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Padding.padding_15,
    paddingTop: 50, // Điều chỉnh cho SafeArea (Tai thỏ)
    paddingBottom: 20,
    backgroundColor: Color.bg,
  },
  backButton: {
    marginRight: Gap.gap_15,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_20,
    color: Color.text,
  },
  scrollContent: {
    padding: Padding.padding_15,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
    borderColor: Color.stroke,
    borderWidth: 1,
    borderRadius: Border.br_15,
    padding: Padding.padding_15,
    backgroundColor: Color.bg, // Nền trắng cho từng section để nổi bật trên nền tổng thể
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
  // Style riêng cho khối đổi Avatar
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
    backgroundColor: Color.main2, // Fallback color
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
  // Style riêng cho khối Grid (Tương tác)
  gridCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Padding.padding_15,
  },
  gridItem: {
    alignItems: 'center',
    gap: Gap.gap_8,
    flex: 1,
  },
  gridText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.gray,
    textAlign: 'center',
  },
  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: Border.br_10,
    backgroundColor: Color.bg,
    borderWidth: 2,
    borderColor: Color.main2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Gap.gap_8,
  },
  logoText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: '#FF69B4', // Màu hồng đại diện như mô tả
  },
  versionText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.gray,
  },
});