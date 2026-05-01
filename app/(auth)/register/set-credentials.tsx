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
import { Eye, EyeSlash } from 'phosphor-react-native';

// --- Components ---
import Button from '../../../components/Button';
import { CustomInput } from '../../../components/CustomInput';
import { useModal } from '../../../contexts/ModalContext';
import { useUser } from '../../../contexts/UserContext';

// --- Constants ---
import { Color, FontFamily, FontSize, Padding, Gap, Height, Border } from '../../../constants/GlobalStyles';
import AuthService from '../../../api/services/auth.service';

export default function SetCredentialScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        // Đăng nhập tự động: Lưu token vào thiết bị
        await SecureStore.setItemAsync('accessToken', response.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);

        // Cập nhật state toàn cục để useAuth nhận diện đã đăng nhập
        await refreshUser();

        // Điều hướng vào màn hình chính
        router.replace('/(tabs)');
      } else {
        showAlert('Tạo tài khoản thất bại', response.message || 'Vui lòng thử lại');
      }
    } catch (error: any) {
      // In chi tiết lỗi ra Terminal để bạn dễ debug
      console.log('=== CHI TIẾT LỖI TỪ BACKEND ===', JSON.stringify(error.response?.data, null, 2));
      
      // Xử lý bắt lỗi sâu hơn (hỗ trợ cả mảng errors của express-validator nếu có)
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || (errorData?.errors && errorData.errors[0]?.msg) || 'Dữ liệu không hợp lệ (400)';
      
      showAlert('Lỗi', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[Color.main, Color.bg]}
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
                />

                {/* Ô nhập Mật khẩu có Icon Mắt */}
                <View style={styles.inputWrapper}>
                  <CustomInput
                    placeholder="Mật khẩu"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon} 
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    {showPassword ? <Eye size={20} color={Color.gray} /> : <EyeSlash size={20} color={Color.gray} />}
                  </TouchableOpacity>
                </View>

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

                {/* Ô Xác nhận mật khẩu có Icon Mắt */}
                <View style={styles.inputWrapper}>
                  <CustomInput
                    placeholder="Xác nhận mật khẩu"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon} 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    activeOpacity={0.7}
                  >
                    {showConfirmPassword ? <Eye size={20} color={Color.gray} /> : <EyeSlash size={20} color={Color.gray} />}
                  </TouchableOpacity>
                </View>
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

const styles = StyleSheet.create({
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
    color: Color.color,
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

  // --- THÊM STYLE CHO ICON MẮT VÀ GỢI Ý MẬT KHẨU ---
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: Padding.padding_15,
    height: '100%',
    justifyContent: 'center',
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
    color: Color.gray,
  },

  forgotPasswordButton: {
    marginTop: Padding.padding_10,
    backgroundColor: Color.greenLight,
    paddingVertical: Padding.padding_10,
    borderRadius: Border.br_10,
    alignItems: 'center',
  },

  divider: {
    width: 76,
    height: 3,
    borderStyle: "solid",
    borderColor: Color.gray,
    borderTopWidth: 3,
    alignSelf: 'center',
    margin: Gap.gap_20,
  },
});