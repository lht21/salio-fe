import React from 'react';
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

// --- Constants ---
import { Color, FontFamily, FontSize, Padding, Gap, Height, Border } from '../../../constants/GlobalStyles';

export default function SetCredentialScreen() {
  const router = useRouter();

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
                />
                <CustomInput
                  placeholder="Mật khẩu"
                  secureTextEntry
                />
                <CustomInput
                  placeholder="Xác nhận mật khẩu"
                  secureTextEntry
                />


              </View>


              <View style={styles.actionRow}>
               
                <Button
                  title="Tiếp theo"
                  variant="Green"
                  onPress={() => router.push('/(auth)/register/verify-otp')}
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
    borderColor: Color.colorSlategray,
    borderTopWidth: 3,
    alignSelf: 'center',
    margin: Gap.gap_20,
  },
});