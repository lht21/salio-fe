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
import * as SecureStore from 'expo-secure-store';
import { LockKeyIcon, UserIcon } from 'phosphor-react-native';

// --- Components ---
import Button from '../../../components/Button';
import { CustomInput } from '../../../components/CustomInput';
import { useModal } from '../../../contexts/ModalContext';
import { useUser } from '../../../contexts/UserContext';

// --- Constants ---
import { FontFamily, FontSize, Padding, Gap, Height, Border } from '../../../constants/GlobalStyles';
import AuthService from '../../../api/services/auth.service';
import { useTheme } from "@/contexts/ThemeContext";

export default function SetCredentialScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { showModal } = useModal();
  const { refreshUser } = useUser();

  const showAlert = (title: string, subtitle: string) => {
    showModal({ title, subtitle, hideCancelButton: true, confirmText: 'Đóng' });
  };

  const handleCreateAccount = async () => {
    if (!username.trim() || !password || !confirmPassword) {
      showAlert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (!email) {
      showAlert('Lỗi', 'Không tìm thấy email xác thực. Vui lòng thử lại từ đầu.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthService.createAccount({
        email,
        username: username.trim(),
        password,
        confirmPassword,
      });

      if (response.success) {
        await SecureStore.setItemAsync('accessToken', response.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
        await SecureStore.setItemAsync('pendingPlacementTest', 'true');
        await refreshUser();
        router.replace('/placement-test/intro');
      }
    } catch (error: any) {
      const errorData = error.response?.data;

      const fieldError = errorData?.errors && errorData.errors.length > 0
        ? errorData.errors[0].message
        : null;

      const generalMessage = errorData?.message;

      const finalMessage = fieldError || generalMessage || 'Đã có lỗi xảy ra, vui lòng thử lại.';

      showAlert('Thông báo', finalMessage);

      console.log('Error Data:', errorData);
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

              <Text style={styles.heading}>Đặt thông tin</Text>

              <View style={styles.formContainer}>
                <CustomInput
                  placeholder="Tên của bạn"
                  keyboardType="default"
                  autoCapitalize="words"
                  value={username}
                  onChangeText={setUsername}
                  leftIcon={<UserIcon size={20} color={colors.textSecondary} />}
                />

                <CustomInput
                  placeholder="Mật khẩu"
                  isPassword
                  value={password}
                  onChangeText={setPassword}
                  leftIcon={<LockKeyIcon size={20} color={colors.textSecondary} />}
                />

                {/* Gợi ý độ mạnh mật khẩu (Chỉ hiện khi bắt đầu gõ) */}
                {password.length > 0 && (
                  <View style={styles.criteriaContainer}>
                    <Text style={password.length >= 8 ? styles.criteriaMet : styles.criteriaUnmet}>
                      {password.length >= 8 ? '✓' : '○'} Tối thiểu 8 ký tự
                    </Text>
                    <Text style={/[A-Z]/.test(password) ? styles.criteriaMet : styles.criteriaUnmet}>
                      {/[A-Z]/.test(password) ? '✓' : '○'} Ít nhất 1 chữ hoa
                    </Text>
                    <Text style={/[0-9]/.test(password) ? styles.criteriaMet : styles.criteriaUnmet}>
                      {/[0-9]/.test(password) ? '✓' : '○'} Ít nhất 1 chữ số
                    </Text>
                  </View>
                )}

                <CustomInput
                  placeholder="Xác nhận mật khẩu"
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
                  onPress={handleCreateAccount}
                  style={styles.loginButton}
                  disabled={isLoading}
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
