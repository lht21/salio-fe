import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AuthService from '../../../api/services/auth.service';
import { LockKeyIcon } from 'phosphor-react-native';

// --- Components ---
import Button from '../../../components/Button';
import SocialButton from '../../../components/SocialButton';
import { CustomInput } from '../../../components/CustomInput';
import { useModal } from '../../../contexts/ModalContext';

// --- Constants ---
import { FontFamily, FontSize, Padding, Gap, Height, Border } from '../../../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

export default function SetCredentialScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const router = useRouter();
  const { email, code } = useLocalSearchParams<{ email: string, code: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { showModal } = useModal();

  const showAlert = (title: string, subtitle: string, onConfirmAction?: () => void, confirmText: string = 'Đóng') => {
    showModal({
      title,
      subtitle,
      confirmText,
      onConfirm: onConfirmAction,
      hideCancelButton: true
    });
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showAlert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (!email || !code) {
      showAlert('Lỗi', 'Không tìm thấy thông tin email hoặc mã OTP. Vui lòng thử lại từ đầu.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthService.resetPassword({
        email,
        code,
        newPassword,
        confirmNewPassword: confirmPassword
      });

      if (response.success) {
        showAlert(
          'Thành công',
          'Mật khẩu của bạn đã được đặt lại. Vui lòng đăng nhập bằng mật khẩu mới.',
          () => {
            router.replace('/(auth)/sign-in');
          },
          'Đăng nhập ngay'
        );
      } else {
        showAlert('Lỗi', response.message || 'Không thể đặt lại mật khẩu');
      }
    } catch (error: any) {
      // In chi tiết lỗi ra Terminal để dễ debug
      console.log('=== CHI TIẾT LỖI TỪ BACKEND ===', JSON.stringify(error.response?.data, null, 2));

      const errorData = error.response?.data;
      const errorMessage = errorData?.message || (errorData?.errors && errorData.errors[0]?.msg) || 'Dữ liệu không hợp lệ (400)';

      showAlert('Lỗi', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.primary, colors.background]}
      locations={[0, 0.5]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* --- PHẦN TRÊN: Logo & Nút đăng nhập MXH --- */}
            <View style={styles.topSection}>
              <Image
                source={require('../../../assets/images/Layer-1-1.png')}
                style={styles.logo}
                resizeMode="contain"
              />

            </View>

            {/* --- PHẦN DƯỚI CÙNG: Form Đăng Nhập --- */}
            <View style={styles.bottomSection}>


              <View style={styles.divider} />

              <Text style={styles.heading}>Đặt lại mật khẩu</Text>

              <View style={styles.formContainer}>
                <CustomInput
                  placeholder="Mật khẩu mới"
                  isPassword
                  value={newPassword}
                  onChangeText={setNewPassword}
                  leftIcon={<LockKeyIcon size={20} color={colors.textSecondary} />}
                />
                {/* Gợi ý độ mạnh mật khẩu */}
                {newPassword.length > 0 && (
                  <View style={styles.criteriaContainer}>
                    <Text style={newPassword.length >= 8 ? styles.criteriaMet : styles.criteriaUnmet}>
                      {newPassword.length >= 8 ? '✓' : '○'} Tối thiểu 8 ký tự
                    </Text>
                    <Text style={/[A-Z]/.test(newPassword) ? styles.criteriaMet : styles.criteriaUnmet}>
                      {/[A-Z]/.test(newPassword) ? '✓' : '○'} Ít nhất 1 chữ hoa
                    </Text>
                    <Text style={/[0-9]/.test(newPassword) ? styles.criteriaMet : styles.criteriaUnmet}>
                      {/[0-9]/.test(newPassword) ? '✓' : '○'} Ít nhất 1 chữ số
                    </Text>
                  </View>
                )}
                <CustomInput
                  placeholder="Xác nhận mật khẩu mới"
                  isPassword
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  leftIcon={<LockKeyIcon size={20} color={colors.textSecondary} />}
                />


              </View>


              <View style={styles.actionRow}>

                <Button
                  title="Hoàn tất"
                  variant="Green"
                  onPress={handleResetPassword}
                  disabled={isLoading}
                  style={styles.loginButton}
                />
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    // Thuộc tính này kết hợp với flexGrow giúp chia màn hình làm 2 khối đẩy xa nhau (trên - dưới)
    justifyContent: 'space-between',
    padding: Padding.padding_15,
  },

  // --- TOP SECTION ---
  topSection: {
    alignItems: 'center',
    paddingTop: Padding.padding_30,
    gap: Gap.gap_20,
  },
  logo: {
    height: Height.height_113, // Dùng Height từ GlobalStyles hoặc số cứng tùy size thật
    aspectRatio: 1, // Đảm bảo hình vuông nếu logo là hình vuông
    marginBottom: Padding.padding_10,
  },
  socialContainer: {
    width: '100%',
    gap: Gap.gap_20,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  // --- BOTTOM SECTION ---
  bottomSection: {
    width: '100%',
    gap: Gap.gap_15,
    paddingTop: Padding.padding_30,

  },
  heading: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_24,
    color: colors.textBrand,
    textAlign: 'left',
    marginBottom: Padding.padding_5,
  },
  formContainer: {
    width: '100%',
    gap: Gap.gap_15,
  },
  loginButton: {
    marginTop: Padding.padding_5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  criteriaContainer: {
    marginTop: -Gap.gap_5,
    paddingHorizontal: Padding.padding_5,
    gap: Gap.gap_5,
  },
  criteriaMet: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: '#4CAF50', // Màu xanh báo hiệu đạt yêu cầu
  },
  criteriaUnmet: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: colors.textSecondary,
  },

  forgotPasswordButton: {
    marginTop: Padding.padding_10,
    backgroundColor: colors.primaryLight,
    paddingVertical: Padding.padding_10,
    borderRadius: Border.br_10,
    alignItems: 'center',
  },

  divider: {
    width: 76,
    height: 3,
    borderStyle: "solid",
    borderColor: colors.textSecondary,
    borderTopWidth: 3,
    alignSelf: 'center',
    margin: Gap.gap_20,
  },
});