import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
import SubscriptionService from '../../api/services/subscription.service';
import { SubscriptionPlan } from '../../api/types/subscription.types';

// Dữ liệu mẫu (Tách biệt logic)
const BENEFITS = [
  'Mở khóa toàn bộ kho đề thi sát với thực tế',
  'Xem giải thích đáp án chi tiết từng câu',
  'Lưu và ôn tập từ vựng không giới hạn',
  'Loại bỏ hoàn toàn quảng cáo',
];

export default function SubscriptionScreen() {
  const router = useRouter();
  
  // Quản lý trạng thái gọi API
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  // Fetch dữ liệu các gói từ API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await SubscriptionService.getPlans();
        if (response.success && response.data) {
          setPlans(response.data);
          // Tự động chọn gói có isPopular === true, nếu không thì chọn gói đầu tiên
          const defaultPlan = response.data.find(p => p.isPopular) || response.data[0];
          if (defaultPlan) setSelectedPlanId(defaultPlan._id);
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể lấy danh sách gói cước. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Lấy ra gói đang được chọn để hiển thị thông tin ở nút Tiếp tục
  const currentPlan = plans.find((p) => p._id === selectedPlanId);

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

            {isLoading ? (
              <ActivityIndicator size="large" color={Color.vang} style={{ marginVertical: 30 }} />
            ) : (
              <View style={styles.plansContainer}>
                  {plans.map((plan) => {
                    const formattedPrice = plan.price.toLocaleString('vi-VN');
                    let unit = 'đ / tháng';
                    if (plan.type === 'premium_yearly') unit = 'đ / năm';
                    else if (plan.type === 'premium_quarterly') unit = 'đ / 3 tháng';
                    else if (plan.type === 'lifetime') unit = 'đ / vĩnh viễn';

                    return (
                      <SubscriptionCard
                          key={plan._id}
                          title={plan.name}
                          price={formattedPrice}
                          unit={unit}
                          subText={plan.description || ''}
                          isRecommended={plan.isPopular}
                          isSelected={selectedPlanId === plan._id}
                          onPress={() => setSelectedPlanId(plan._id)}
                      />
                    );
                  })}
              </View>
            )}

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
                  onPress={() => {
                    if (selectedPlanId) {
                      router.push(`/subscription/${selectedPlanId}/detail`);
                    }
                  }}
                >
                  <Text style={styles.continueButtonText}>
                    Tiếp tục - {currentPlan ? currentPlan.price.toLocaleString('vi-VN') : '0'} đ
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