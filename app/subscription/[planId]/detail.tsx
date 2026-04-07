import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Constants & Components
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../../constants/GlobalStyles';
import Button from '../../../components/Button';

// Mock Data cho các phương thức thanh toán
const PAYMENT_METHODS = [
  { id: 'momo', title: 'Ví MoMo', iconUrl: 'https://img.icons8.com/color/48/momo.png' },
  { id: 'zalo', title: 'Ví ZaloPay', iconUrl: 'https://img.icons8.com/color/48/zalo.png' }, // Sửa lại text ZaloPay
  { id: 'visa', title: 'Thẻ Visa/Mastercard', iconUrl: 'https://img.icons8.com/color/48/visa.png' },
  { id: 'apple', title: 'Apple Pay', iconUrl: 'https://img.icons8.com/ios-filled/50/mac-os.png' },
];

// Data thông tin các gói cước để map với planId
const PLAN_DETAILS: Record<string, { title: string; price: string }> = {
  month: {
    title: 'Gói 1 tháng (Salio Master)',
    price: '99.000 VNĐ'
  },
  year: {
    title: 'Gói 1 năm (Salio Master)',
    price: '699.000 VNĐ'
  }
};

export default function OrderDetailsScreen() {
  const router = useRouter();
  // Lấy planId từ route nếu cần (ví dụ: để fetch dữ liệu đơn hàng thật)
  const { planId } = useLocalSearchParams(); 

  // Xử lý đảm bảo planId luôn là chuỗi (tránh lỗi khi params trả về mảng)
  const currentPlanId = typeof planId === 'string' ? planId : 'month';
  
  // Lấy thông tin gói cước tương ứng, nếu không có ID hợp lệ thì mặc định lấy gói tháng
  const planInfo = PLAN_DETAILS[currentPlanId] || PLAN_DETAILS['month'];

  // Quản lý phương thức thanh toán được chọn
  const [selectedPayment, setSelectedPayment] = useState<string>('momo');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeftIcon size={24} color={Color.text} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        </View>

        {/* --- BODY --- */}
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          
          {/* Order Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Gói cước</Text>
              {/* Hiển thị tên gói động */}
              <Text style={styles.summaryValue}>{planInfo.title}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tổng tiền</Text>
              {/* Hiển thị giá tiền động */}
              <Text style={styles.totalPrice}>{planInfo.price}</Text>
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

        </ScrollView>

        {/* --- FOOTER (Cố định ở dưới cùng) --- */}
        <View style={styles.footer}>
          <Text style={styles.secureText}>
            Thanh toán an toàn, không tự động gia hạn
          </Text>
          <Button
            title="Xác nhận thanh toán"
            variant="Green"
            onPress={() => {
              router.push('/subscription/failed'); // Điều hướng đến trang thất bại sau khi xác nhận
            }}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg,
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
    backgroundColor: Color.bg,
  },
  backButton: {
    marginRight: Gap.gap_15,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_20,
    color: Color.text,
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
    color: Color.gray,
  },
  summaryValue: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  totalPrice: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: Color.color, // Xanh lá đậm theo design system của bạn
  },

  // Payment Section
  sectionTitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
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
    backgroundColor: Color.bg,
  },
  paymentCardUnselected: {
    borderColor: Color.stroke, // Viền xám mờ
  },
  paymentCardSelected: {
    borderColor: Color.color, // Viền xanh lá đậm khi được chọn
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
    color: Color.text,
  },

  // Footer
  footer: {
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_15,
    paddingBottom: Padding.padding_30, // Đẩy lên để tránh thanh điều hướng ảo
    backgroundColor: Color.bg,
    borderTopWidth: 1,
    borderTopColor: Color.stroke,
  },
  secureText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.cam,
    textAlign: 'center',
    marginBottom: Gap.gap_10,
  },
});