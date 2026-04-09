import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// Thay đổi Icon thành XCircle để thể hiện lỗi/thất bại
import { XIcon } from 'phosphor-react-native';

// Components & Constants
import CloseButton from '../../components/CloseButton';
import { Color, FontFamily, FontSize, Padding, Gap } from '../../constants/GlobalStyles';
import Button from '../../components/Button';

// Lấy kích thước màn hình để định vị các họa tiết mờ
const { width, height } = Dimensions.get('window');

export default function PaymentFailedScreen() {
  const router = useRouter();

  // Hàm xử lý khi nhấn nút X (Hủy bỏ hoàn toàn và về Home)
  const handleClose = () => {
    router.replace('/(tabs)'); 
  };

  // Hàm xử lý khi nhấn "Thử lại" (Quay lại trang chi tiết đơn hàng trước đó)
  const handleRetry = () => {
    router.back();
  };

  return (
    <LinearGradient
      // Cập nhật dải gradient: Đỏ nhạt -> Trắng -> Xám mờ (thể hiện sự không thành công)
      colors={['#FFE5E5', Color.bg, Color.stroke]} 
      locations={[0, 0.4, 1]} 
      style={styles.container}
    >
      {/* --- BACKGROUND PATTERNS (Họa tiết chữ S mờ) --- */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Text style={[styles.bgPattern, styles.sText, { fontSize: 220, top: height * 0.02, left: -40, transform: [{ rotate: '-15deg' }] }]}>
          S
        </Text>
        <Text style={[styles.bgPattern, styles.sText, { fontSize: 150, top: height * 0.4, right: -30, transform: [{ rotate: '25deg' }] }]}>
          S
        </Text>
        <Text style={[styles.bgPattern, styles.sText, { fontSize: 250, bottom: height * 0.05, left: width * 0.2, transform: [{ rotate: '-10deg' }] }]}>
          S
        </Text>
      </View>

      <SafeAreaView style={styles.safeArea}>
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          {/* Nút X thoát hoàn toàn luồng thanh toán */}
          <CloseButton variant="Stroke" onPress={handleClose} />
        </View>

        {/* --- BODY CONTENT --- */}
        <View style={styles.content}>
          {/* Icon X/Lỗi chính */}
          <View style={styles.mainIconContainer}>
            <XIcon size={80} color={Color.red} weight="bold" />
          </View>

          <Text style={styles.title}>Thanh toán thất bại</Text>
          
          <Text style={styles.message}>
            Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng kiểm tra lại số dư, phương thức thanh toán hoặc thử lại sau ít phút.
          </Text>
        </View>

        {/* --- FOOTER BUTTONS --- */}
        <View style={styles.footer}>
          {/* Nút Thử lại */}
          <Button
            title="Thử lại"
            variant="Orange" // Sử dụng màu Cam hoặc Outline tùy vào hệ thống Design System của bạn
            onPress={handleRetry}
          />
          
          {/* Nút Hủy (Tùy chọn bổ sung để UX rõ ràng hơn) */}
          <Button
            title="Về trang chủ"
            variant="TextOnly" // Chỉ hiện chữ
            onPress={handleClose}
          />
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Padding.padding_15,
  },
  
  // Họa tiết nền
  bgPattern: {
    position: 'absolute',
    opacity: 0.04, // Mờ ảo hòa quyện vào nền
  },
  sText: {
    fontFamily: FontFamily.lexendDecaSemiBold, 
    color: Color.red, // Dùng tone đỏ mờ cho background thất bại
  },

  // Header
  header: {
    alignItems: 'flex-end',
    paddingTop: Padding.padding_15,
    paddingBottom: Padding.padding_30,
  },

  // Nội dung chính
  content: {
    flex: 1,
    paddingHorizontal: Padding.padding_10,
    marginBottom: height * 0.1, 
  },
  mainIconContainer: {
    marginBottom: Gap.gap_20,
    alignItems: 'flex-start', 
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_24,
    color: Color.red, // Màu đỏ nổi bật thông báo lỗi
    marginBottom: Gap.gap_15,
    textAlign: 'left',
  },
  message: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text, 
    textAlign: 'left',
    lineHeight: 24, 
  },

  // Nút bấm
  footer: {
    paddingBottom: Padding.padding_30,
    gap: Gap.gap_10, // Khoảng cách giữa 2 nút (Thử lại & Về trang chủ)
  },
});