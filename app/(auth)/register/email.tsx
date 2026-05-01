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

// --- Components ---
import Button from '../../../components/Button';
import SocialButton from '../../../components/SocialButton';
import { CustomInput } from '../../../components/CustomInput';
import { ConfirmModal } from '../../../components/ModalResult/ConfirmModal';

// --- Constants ---
import { Color, FontFamily, FontSize, Padding, Gap, Height, Border } from '../../../constants/GlobalStyles';
import AuthService from '../../../api/services/auth.service';

export default function RegisterEmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- State cho Modal Thông báo ---
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', subtitle: '' });

  const showAlert = (title: string, subtitle: string) => {
    setModalConfig({ title, subtitle });
    setModalVisible(true);
  };

  const handleRequestOtp = async () => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      showAlert('Lỗi', 'Vui lòng nhập địa chỉ email của bạn');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showAlert('Lỗi', 'Định dạng email không hợp lệ');
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthService.sendRegisterOtp({ email: trimmedEmail });

      if (response.success) {
        router.push({
          pathname: '/(auth)/register/verify-otp',
          params: { email: trimmedEmail }
        });
      } else {
        showAlert('Lỗi', response.message || 'Không thể gửi mã OTP. Vui lòng thử lại sau.');
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
              <View style={styles.socialContainer}>
                {/* Truyền props tương ứng vào SocialButton của bạn */}
                <SocialButton social="google" iconColor={Color.red} />
                <SocialButton social="facebook" iconColor={Color.blueFb} />
                <SocialButton social="apple" iconColor={Color.text} />
              </View>

              <View style={styles.divider} />

              <Text style={styles.heading}>Đăng ký</Text>

              <View style={styles.formContainer}>
                <CustomInput
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>


              <View style={styles.actionRow}>
                <Button
                  title="Đăng nhập"
                  variant="TextOnly"
                  onPress={() => router.push('/(auth)/sign-in')}
                />
                <Button
                  title="Tiếp theo"
                  variant="Green"
                  onPress={handleRequestOtp}
                  style={styles.loginButton}
                  disabled={isLoading}
                />
              </View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <ConfirmModal
        isVisible={isModalVisible}
        title={modalConfig.title}
        subtitle={modalConfig.subtitle}
        confirmText="Đóng"
        hideCancelButton={true}
        onConfirm={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
      />
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