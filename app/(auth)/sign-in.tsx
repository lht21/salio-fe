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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import AuthService from '../../api/services/auth.service';

// --- Components ---
import Button from '../../components/Button';
import SocialButton from '../../components/SocialButton';
import { CustomInput } from '../../components/CustomInput';
import { useModal } from '../../contexts/ModalContext';
import { useUser } from '../../contexts/UserContext';


// --- Constants ---
import { Color, FontFamily, FontSize, Padding, Gap, Height, Border } from '../../constants/GlobalStyles';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { showModal } = useModal();
  const { refreshUser } = useUser();

  const showAlert = (title: string, subtitle: string) => {
    showModal({ title, subtitle, hideCancelButton: true, confirmText: 'Đóng' });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthService.login({ email, password });

      if (response.success) {
        // Lưu token vào SecureStore để sử dụng cho các request sau
        await SecureStore.setItemAsync('accessToken', response.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);
        
        // Đồng bộ thông tin user vào Context TRƯỚC KHI chuyển màn hình
        await refreshUser();

        // Chuyển hướng vào màn hình chính sau khi đăng nhập thành công
        router.replace('/(tabs)');
      } else {
        showAlert('Đăng nhập thất bại', response.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Không thể kết nối đến máy chủ';
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
            {/* --- PHẦN TRÊN: Logo --- */}
            <View style={styles.topSection}>
              <Image
                source={require('../../assets/images/horani/state_0.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              
            </View>

            {/* --- PHẦN DƯỚI: Form Đăng Nhập --- */}
            <View style={styles.bottomSection}>
              <View style={styles.socialContainer}>
                <SocialButton social="google" iconColor={Color.red} />
                <SocialButton social="facebook" iconColor={Color.blueFb} />
                <SocialButton social="apple" iconColor={Color.text} />
              </View>

              <View style={styles.divider} />

              <Text style={styles.heading}>Đăng nhập</Text>

              <View style={styles.formContainer}>
                <CustomInput
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <CustomInput
                  placeholder="Mật khẩu"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>


              <View style={styles.actionRow}>
                <Button
                  title="Đăng ký"
                  variant="TextOnly"
                  onPress={() => router.push('/(auth)/register/email')}
                />
                <Button
                  title={"Đăng nhập"}
                  variant="Green"
                  onPress={handleLogin}
                  disabled={isLoading}
                />
              </View>
              <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => router.push('/(auth)/forgot-password/email')}>
                <Text style={{ 
                  fontFamily: FontFamily.lexendDecaRegular,
                  fontSize: FontSize.fs_12,
                  color: Color.color,
                }}>
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>

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
    height: 270, // Dùng Height từ GlobalStyles hoặc số cứng tùy size thật
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
    justifyContent: 'space-between',
    alignItems: 'center',
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