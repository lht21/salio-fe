import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// --- Components ---
import Button from '../../../components/Button';

// --- Constants ---
import { Color, FontFamily, FontSize, Padding, Gap, Height, Border } from '../../../constants/GlobalStyles';

export default function RegisterVerifyOtpScreen() {
  const router = useRouter();
  
  // State để lưu giá trị OTP 6 số
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Refs để quản lý focus của 6 ô input
  const inputRefs = useRef<Array<TextInput | null>>([]);

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
                source={require('../../../assets/images/Layer-1-1.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* --- PHẦN DƯỚI CÙNG: Form OTP --- */}
            <View style={styles.bottomSection}>
              <View style={styles.divider} />

              <Text style={styles.heading}>Mã xác nhận</Text>

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
                  onPress={() => {
                    // Lấy mã OTP hoàn chỉnh
                    const fullOtp = otp.join('');
                    console.log('OTP entered:', fullOtp);
                    // TODO: Gọi API verify OTP ở đây, nếu thành công thì chuyển trang
                    // Tạm thời điều hướng theo yêu cầu cũ
                    router.push('/(auth)/register/set-credentials')
                  }}
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
    color: Color.color,
    textAlign: 'left',
    marginBottom: Padding.padding_5,
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
    borderColor: Color.stroke,
    borderRadius: Border.br_10,
    backgroundColor: Color.stroke,
    textAlign: 'center',
    fontSize: FontSize.fs_20,
    fontFamily: FontFamily.lexendDecaSemiBold,
    color: Color.text,
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
    borderColor: Color.colorSlategray,
    borderTopWidth: 3,
    alignSelf: 'center',
    margin: Gap.gap_20,
  },
});