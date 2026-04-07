import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Components
import CloseButton from '../../components/CloseButton';
import BenefitItem from '../../components/BenefitItem';
import SubscriptionCard from '../../components/SubscriptionCard';

// Constants
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import { MotiView } from 'moti';

// Dữ liệu mẫu (Tách biệt logic)
const BENEFITS = [
  'Mở khóa toàn bộ kho đề thi sát với thực tế',
  'Xem giải thích đáp án chi tiết từng câu',
  'Lưu và ôn tập từ vựng không giới hạn',
  'Loại bỏ hoàn toàn quảng cáo',
];

const PLANS = [
  {
    id: 'month',
    title: 'Gói 1 tháng',
    price: '99.000',
    unit: 'đ / tháng',
    subText: 'Thanh toán hàng tháng',
    isRecommended: false,
  },
  {
    id: 'year',
    title: 'Gói 1 năm',
    price: '699.000',
    unit: 'đ / năm',
    subText: 'Tiết kiệm 40% (~58k/tháng)',
    isRecommended: true,
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  // Quản lý plan đang chọn. Mặc định chọn gói năm (phần tử thứ 2)
  const [selectedPlanId, setSelectedPlanId] = useState<string>(PLANS[1].id);

  // Lấy ra giá của gói đang được chọn để hiển thị ở nút bấm
  const currentPlan = PLANS.find((p) => p.id === selectedPlanId);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={{ flex: 1 }}
    >
        <ImageBackground
        source={require('../../assets/images/bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        >
        <SafeAreaView style={styles.safeArea}>
            
            {/* --- HEADER --- */}
            <View style={styles.header}>
              <CloseButton variant="Main" onPress={() => router.back()} />
            </View>

            {/* --- NỘI DUNG CUỘN ĐƯỢC --- */}
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
            <Text style={styles.mainTitle}>Salio Master TOPIK</Text>


            <View style={styles.plansContainer}>
                {PLANS.map((plan) => (
                <SubscriptionCard
                    key={plan.id}
                    title={plan.title}
                    price={plan.price}
                    unit={plan.unit}
                    subText={plan.subText}
                    isRecommended={plan.isRecommended}
                    isSelected={selectedPlanId === plan.id}
                    onPress={() => setSelectedPlanId(plan.id)}
                />
                ))}
            </View>
            <View style={styles.benefitsContainer}>
                {BENEFITS.map((text, index) => (
                <BenefitItem key={index} text={text} />
                ))}
            </View>
            </ScrollView>

            {/* --- BOTTOM CỐ ĐỊNH --- */}
            <View style={styles.bottomFixed}>
                {/* Banner người dùng */}
                <View style={styles.statusBanner}>
                    <Text style={styles.statusText}>Bạn đang dùng gói Cơ bản (Miễn phí)</Text>
                </View>

                {/* Nút Tiếp tục nền đen */}
                <TouchableOpacity 
                  style={styles.continueButton} 
                  activeOpacity={0.8}
                  onPress={() => router.push(`/subscription/${selectedPlanId}/detail`)} // Điều hướng đến trang chi tiết gói đã chọn
                >
                  <Text style={styles.continueButtonText}>
                    Tiếp tục - {currentPlan?.price} đ
                  </Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
        </ImageBackground>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
    alignItems: 'flex-end', // Căn phải nút X
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Padding.padding_15,
    paddingBottom: 40,
  },
  mainTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 32,
    color: Color.color, // Màu chữ sáng trên nền tối
    marginTop: Padding.padding_10,
    marginBottom: Padding.padding_30,
  },
  benefitsContainer: {
    marginTop: Padding.padding_30,
  },
  plansContainer: {
    gap: Gap.gap_15,
  },
  
  // --- BOTTOM FIXED UI ---
  bottomFixed: {
    paddingHorizontal: Padding.padding_15,
    paddingBottom: Padding.padding_30, // Đẩy lên một chút cho các dòng máy có thanh Home ảo
    paddingTop: Padding.padding_15,
    backgroundColor: "transparent", // Trong suốt để lộ nền
    borderTopLeftRadius: Border.br_20,
    borderTopRightRadius: Border.br_20,
  },
  statusBanner: {
    backgroundColor: "transparent", // Xám nhạt
    paddingVertical: Padding.padding_10,
    borderRadius: Border.br_10,
    alignItems: 'center',
  },
  statusText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: Color.gray,
  },
  continueButton: {
    backgroundColor: Color.vang, // Nền màu đen cố định theo yêu cầu
    paddingVertical: Padding.padding_15,
    borderRadius: 37, // Bo tròn mạnh
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.color, // Chữ trắng trên nền đen
  },
});