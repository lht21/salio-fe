import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Constants & Components
import { FontFamily, FontSize, Border, Padding, Gap } from '../../../constants/GlobalStyles';
import Button from '../../../components/Button';
import SubscriptionService from '../../../api/services/subscription.service';
import { SubscriptionPlan, CheckoutRequest } from '../../../api/types/subscription.types';
import { useTheme } from "@/contexts/ThemeContext";

// Mock Data cho các phương thức thanh toán (Đã cập nhật ID để match với backend)
const PAYMENT_METHODS = [
  { id: 'bank_transfer', title: 'Chuyển khoản Ngân hàng (QR)', iconUrl: 'https://img.icons8.com/color/48/bank-cards.png' },
];

export default function OrderDetailsScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const router = useRouter();
  // Lấy planId từ route nếu cần (ví dụ: để fetch dữ liệu đơn hàng thật)
  const { planId } = useLocalSearchParams();

  // Xử lý đảm bảo planId luôn là chuỗi (tránh lỗi khi params trả về mảng)
  const currentPlanId = typeof planId === 'string' ? planId : 'month';

  // States
  const [planDetail, setPlanDetail] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  // Quản lý phương thức thanh toán được chọn
  const [selectedPayment, setSelectedPayment] = useState<string>('bank_transfer');

  // Fetch thông tin gói cước
  useEffect(() => {
    const fetchPlanDetail = async () => {
      try {
        setIsLoading(true);
        const response = await SubscriptionService.getPlanById(currentPlanId);
        if (response.success && response.data) {
          setPlanDetail(response.data);
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể lấy thông tin gói cước. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlanDetail();
  }, [currentPlanId]);

  // Xử lý thanh toán
  const handleCheckout = async () => {
    if (!planDetail) return;
    try {
      setIsProcessing(true);
      const response = await SubscriptionService.checkoutPlan(currentPlanId, {
        paymentMethod: selectedPayment as CheckoutRequest['paymentMethod']
      });

      if (response.success && response.data) {
        // Điều hướng sang trang VietQR với mã đơn hàng và số tiền
        router.push(`/subscription/${currentPlanId}/checkout-transfer?orderId=${response.data.orderId}&amount=${response.data.amount}&bankId=${response.data.bankConfig?.bankId}&accountNo=${response.data.bankConfig?.accountNo}&accountName=${response.data.bankConfig?.accountName}`);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể khởi tạo thanh toán. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeftIcon size={24} color={colors.textPrimary} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        </View>

        {/* --- BODY --- */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
          ) : planDetail ? (
            <>
              {/* Order Summary Card */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Gói cước</Text>
                  <Text style={styles.summaryValue}>{planDetail.name}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tổng tiền</Text>
                  <Text style={styles.totalPrice}>{planDetail.price.toLocaleString('vi-VN')} đ</Text>
                </View>
              </View>

              {/* Payment Methods */}
              <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

              <View style={styles.paymentList}>
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedPayment === method.id;

                  return (
                    <TouchableOpacity
                      key={method.id}
                      activeOpacity={0.8}
                      style={[
                        styles.paymentCard,
                        isSelected ? styles.paymentCardSelected : styles.paymentCardUnselected
                      ]}
                      onPress={() => setSelectedPayment(method.id)}
                    >
                      <Image
                        source={{ uri: method.iconUrl }}
                        style={styles.paymentIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.paymentTitle}>{method.title}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 50, color: colors.textSecondary }}>Không tìm thấy thông tin gói cước</Text>
          )}

        </ScrollView>

        {/* --- FOOTER (Cố định ở dưới cùng) --- */}
        <View style={styles.footer}>
          <Text style={styles.secureText}>
            Thanh toán an toàn, không tự động gia hạn
          </Text>
          <Button
            title={isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
            variant="Green"
            onPress={handleCheckout}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
    paddingBottom: Padding.padding_15,
    backgroundColor: colors.background,
  },
  backButton: {
    marginRight: Gap.gap_15,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_20,
    color: colors.textPrimary,
  },

  // Body
  scrollContent: {
    paddingHorizontal: Padding.padding_15,
    paddingBottom: 40,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: "#F3F3F3", // Xám nhạt
    borderRadius: Border.br_15,
    padding: Padding.padding_15,
    marginTop: Gap.gap_20,
    marginBottom: Gap.gap_20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Padding.padding_10,
  },
  summaryLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: colors.textPrimary,
  },
  totalPrice: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: colors.textBrand, // Xanh lá đậm theo design system của bạn
  },

  // Payment Section
  sectionTitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: colors.textPrimary,
    marginBottom: Gap.gap_15,
  },
  paymentList: {
    gap: Gap.gap_10,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Padding.padding_15,
    borderRadius: Border.br_15,
    borderWidth: 1,
    backgroundColor: colors.background,
  },
  paymentCardUnselected: {
    borderColor: colors.borderDefault, // Viền xám mờ
  },
  paymentCardSelected: {
    borderColor: colors.textBrand, // Viền xanh lá đậm khi được chọn
    borderLeftWidth: 8
  },
  paymentIcon: {
    width: 32,
    height: 32,
    marginRight: Gap.gap_15,
  },
  paymentTitle: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: colors.textPrimary,
  },

  // Footer
  footer: {
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_15,
    paddingBottom: Padding.padding_30, // Đẩy lên để tránh thanh điều hướng ảo
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
  },
  secureText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: colors.cam,
    textAlign: 'center',
    marginBottom: Gap.gap_10,
  },
});