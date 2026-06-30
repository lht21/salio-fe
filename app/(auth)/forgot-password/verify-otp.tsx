import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AuthService from '../../../api/services/auth.service';

// --- Components ---
import Button from '../../../components/Button';
import { ConfirmModal } from '../../../components/ModalResult/ConfirmModal';

// --- Constants ---
import { FontFamily, FontSize, Padding, Gap, Height, Border } from '../../../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

export default function ForgotPasswordVerifyOtpScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [isLoading, setIsLoading] = useState(false);
  
  // State để lưu giá trị OTP 6 số
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Refs để quản lý focus của 6 ô input
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // --- State cho Countdown & Resend ---
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // --- State cho Modal Thông báo ---
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', subtitle: '' });

  const showAlert = (title: string, subtitle: string) => {
    setModalConfig({ title, subtitle });
    setModalVisible(true);
  };

  // Effect cho bộ đếm ngược
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Hàm xử lý khi thay đổi text trong từng ô input
  const handleChangeText = (text: string, index: number) => {
    // Chỉ lấy ký tự đầu tiên nếu dán nhiều số
    const newValue = text.replace(/[^0-9]/g, '').slice(0, 1);
    
    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);

    // Tự động chuyển sang ô tiếp theo nếu nhập xong
    if (newValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Hàm xử lý khi nhấn nút xóa (Backspace)
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      setIsLoading(true);
      const response = await AuthService.sendForgotPasswordOtp({ email });
      if (response.success) {
        setCountdown(60);
        setCanResend(false);
        showAlert('Thành công', 'Mã xác nhận mới đã được gửi đến email của bạn.');
      } else {
        showAlert('Lỗi', response.message || 'Không thể gửi lại mã.');
      }
    } catch (error: any) {
      showAlert('Lỗi', error.response?.data?.message || 'Không thể kết nối đến máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      showAlert('Lỗi', 'Vui lòng nhập đủ 6 số mã xác nhận');
      return;
    }
    if (!email) {
      showAlert('Lỗi', 'Không tìm thấy thông tin email. Vui lòng quay lại bước trước.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthService.verifyForgotPasswordOtp({ email, code });

      if (response.success) {
        router.push({
          pathname: '/(auth)/forgot-password/reset-password',
          params: { email, code } // Truyền cả email và mã OTP sang màn hình đặt lại mật khẩu
        });
      } else {
        showAlert('Xác thực thất bại', response.message || 'Mã OTP không hợp lệ');
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
      colors={[colors.main, colors.bg]}
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
                source={require('../../../assets/images/Layer-1-1.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* --- PHẦN DƯỚI CÙNG: Form OTP --- */}
            <View style={styles.bottomSection}>
              <View style={styles.divider} />

              <Text style={styles.heading}>Mã xác nhận</Text>
              <Text style={styles.subHeading}>
                Chúng tôi đã gửi mã gồm 6 chữ số đến {'\n'}
                <Text style={{ fontFamily: FontFamily.lexendDecaSemiBold }}>{email}</Text>
              </Text>

              {/* Khu vực chứa 6 ô OTP */}
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={1} // Mặc dù có chặn ở handleChangeText nhưng vẫn nên để
                    value={digit}
                    onChangeText={(text) => handleChangeText(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    selectTextOnFocus // Tự bôi đen text khi focus để dễ xóa/nhập lại
                  />
                ))}
              </View>

              <View style={styles.actionRow}>
                <Button
                  title="Tiếp theo"
                  variant="Green"
                  onPress={handleVerify}
                  disabled={isLoading}
                  style={styles.loginButton}
                />
              </View>

              {/* Resend Code Section */}
              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Chưa nhận được mã? </Text>
                <TouchableOpacity disabled={!canResend} onPress={handleResend}>
                  <Text style={[styles.resendButtonText, !canResend && styles.resendButtonDisabled]}>
                    Gửi lại {countdown > 0 ? `(sau ${countdown}s)` : ''}
                  </Text>
                </TouchableOpacity>
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
        height: Height.height_113, 
        aspectRatio: 1, 
        marginBottom: Padding.padding_10,
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
        color: colors.color,
        textAlign: 'left',
        marginBottom: Padding.padding_5,
      },
      subHeading: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_14,
        color: colors.gray,
        textAlign: 'left',
        marginBottom: Gap.gap_10,
        lineHeight: 20,
      },
      
      // --- OTP SECTION ---
      otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: Padding.padding_10,
      },
      otpInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: colors.stroke,
        borderRadius: Border.br_10,
        backgroundColor: colors.stroke,
        textAlign: 'center',
        fontSize: FontSize.fs_20,
        fontFamily: FontFamily.lexendDecaSemiBold,
        color: colors.text,
      },

      loginButton: {
        marginTop: Padding.padding_5,
      },
      actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      divider: {
        width: 76,
        height: 3,
        borderStyle: "solid",
        borderColor: colors.gray,
        borderTopWidth: 3,
        alignSelf: 'center',
        margin: Gap.gap_20,
      },
      resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Padding.padding_20,
      },
      resendText: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_14,
        color: colors.gray,
      },
      resendButtonText: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_14,
        color: colors.main, 
      },
      resendButtonDisabled: {
        color: colors.stroke,
      },
    });