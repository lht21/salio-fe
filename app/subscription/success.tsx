import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckFatIcon, CheckIcon } from 'phosphor-react-native';

// Components & Constants
import CloseButton from '../../components/CloseButton';
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import Button from '@/components/Button';

// Lấy kích thước màn hình để định vị các họa tiết mờ
const { width, height } = Dimensions.get('window');

export default function PaymentSuccessScreen() {
  const router = useRouter();

  // Hàm xử lý khi nhấn Bắt đầu hoặc nút X
  const handleStartExperience = () => {
    // Sử dụng router.replace để điều hướng về màn hình Home (thường là '/(tabs)/index' hoặc '/')
    // Thao tác này sẽ xóa lịch sử các trang thanh toán trước đó khỏi stack
    router.replace('/(tabs)'); 
  };

  return (
    <LinearGradient
      // Cập nhật dải gradient: Xanh lá -> Trắng -> Vàng
      colors={[Color.main, Color.bg, Color.vang]} 
      locations={[0, 0.4, 1]} // Điểm dừng màu để chuyển sắc mượt mà hơn
      style={styles.container}
    >
      {/* --- BACKGROUND PATTERNS (Họa tiết dấu check mờ) --- */}
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
          {/* Nút X màu vàng nhạt/stroke tùy variant bạn đã định nghĩa */}
          <CloseButton variant="Main" onPress={handleStartExperience} />
        </View>

        {/* --- BODY CONTENT --- */}
        <View style={styles.content}>
          {/* Icon Check chính */}
          <View style={styles.mainIconContainer}>
            <CheckFatIcon size={80} color={Color.green} weight="fill" />
          </View>

          <Text style={styles.title}>Thanh toán thành công</Text>
          
          <Text style={styles.message}>
            Chào mừng Tân Sứ Giả Premium! Bạn đã mở khóa toàn bộ quyền năng tối thượng. Giờ thì vào quậy tung phòng thi TOPIK thôi!
          </Text>
        </View>

        {/* --- FOOTER BUTTON --- */}
        <View style={styles.footer}>
          <Button
            title="Bắt đầu trải nghiệm"
            variant="Green"
            onPress={handleStartExperience}
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
    opacity: 0.5, // Mờ ảo để không lấn át nội dung chính
  },

  sText: {
    fontFamily: FontFamily.lexendDecaSemiBold, // Font đậm để tạo khối tốt
    color: Color.main, // Dùng màu xanh đậm mờ trên nền sáng sẽ rất sang trọng
  },

  // Header
  header: {
    alignItems: 'flex-end', // Căn nút X sang phải
    paddingTop: Padding.padding_15,
    paddingBottom: Padding.padding_30,
  },

  // Nội dung chính
  content: {
    flex: 1,// Căn giữa màn hình theo chiều dọc
    paddingHorizontal: Padding.padding_10,
    marginBottom: height * 0.1, // Đẩy nhẹ nội dung lên trên một chút
  },
  mainIconContainer: {
    marginBottom: Gap.gap_20,
    // Không căn giữa (alignItems) ở đây để icon căn lề trái cùng dòng chữ nếu thiết kế yêu cầu lề trái
    // Dựa theo prompt "nội dung căn trái", tôi để mặc định căn trái. Nếu muốn icon giữa thì thêm alignItems: 'center'
    alignItems: 'flex-start', 
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_24,
    color: Color.color, // Vàng chanh
    marginBottom: Gap.gap_15,
    textAlign: 'left',
  },
  message: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text, // Màu trắng
    textAlign: 'left',
    lineHeight: 24, // Tạo độ thoáng cho đoạn văn
  },

  // Nút bấm
  footer: {
    paddingBottom: Padding.padding_30,
  },
  primaryButton: {
    backgroundColor: Color.vang, // Nền vàng chanh sáng
    paddingVertical: 16,
    borderRadius: 100, // Bo góc hình oval tối đa
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4, // Đổ bóng nhẹ cho Android
  },
  primaryButtonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text, // Chữ màu đen đậm
  },
});