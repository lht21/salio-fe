import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// Sử dụng các Icon với hậu tố *Icon cho đồng bộ với dự án của bạn
import { ArrowLeftIcon, ClockCounterClockwiseIcon, CheckCircleIcon, CrownIcon, CaretRightIcon, BookOpenIcon, QuestionIcon, InfoIcon } from 'phosphor-react-native';

// Constants & Components
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import Button from '../../components/Button';
import CancelAutoRenewModal from '../../components/Modals/CancelAutoRenewModal';

// Mock Data: Danh sách quyền lợi
const BENEFITS = [
  'Học tất cả các lộ trình',
  'Thi thử không giới hạn',
  'Không bị làm phiền bởi quảng cáo'
];

export default function ManageSubscriptionScreen() {
  const router = useRouter();

  // Biến state quản lý trạng thái có gói học tập hay chưa
  // (Đổi thành true để xem giao diện quản lý gói, false để xem giao diện chưa có gói)
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(true);
  const [isCancelModalVisible, setCancelModalVisible] = useState(false);

  // Logic xử lý khi bấm nút "Hủy tự động gia hạn"
  const handleCancelSubscription = () => {
    setCancelModalVisible(true);
  };

  const handleConfirmCancelAutoRenew = () => {
    setCancelModalVisible(false);
    // TODO: Gọi API hủy gia hạn tại đây
    console.log('Đã xác nhận hủy tự động gia hạn');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon size={24} color={Color.text} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý Gói học tập</Text>
      </View>

      {/* --- BODY --- */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        
        {hasActiveSubscription ? (
          /* =========================================
             TRẠNG THÁI 1: ĐÃ CÓ GÓI HỌC TẬP (ACTIVE)
             ========================================= */
          <>
            {/* 1. Active Plan Card */}
            <View style={styles.activePlanCard}>
              <Text style={styles.planTitle}>Salio Master TOPIK</Text>
              
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Đang hoạt động</Text>
              </View>
              
              <Text style={styles.billingCycleText}>
                Chu kỳ thanh toán tiếp theo: 20/12/2025
              </Text>
            </View>

            {/* 2. History Button */}
            <TouchableOpacity 
              style={styles.historyButton} 
              activeOpacity={0.7}
              onPress={() => router.push('/subscription/history')}
            >
              <ClockCounterClockwiseIcon size={20} color={Color.gray} weight="regular" />
              <Text style={styles.historyButtonText}>Lịch sử thanh toán</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 3. Benefits List */}
            <View style={styles.benefitsSection}>
              <Text style={styles.sectionTitle}>Lợi ích hiện tại</Text>
              
              <View style={styles.benefitsList}>
                {BENEFITS.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <CheckCircleIcon size={24} color="#5E6D7E" weight="fill" />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            {/* 4. Support Section (THÊM MỚI TẠI ĐÂY) */}
            <View style={styles.supportSection}>
              <Text style={styles.sectionTitle}>Bạn cần hỗ trợ?</Text>
              
              <View style={styles.supportList}>
                {/* Item: Thông tin gói */}
                <TouchableOpacity style={styles.supportItem} activeOpacity={0.7}>
                  <View style={styles.supportItemLeft}>
                    <InfoIcon size={24} color={Color.gray} weight="regular" />
                    <Text style={styles.supportText}>Thông tin gói học tập</Text>
                  </View>
                  <CaretRightIcon size={20} color={Color.gray} weight="bold" />
                </TouchableOpacity>

                {/* Item: Câu hỏi thường gặp */}
                <TouchableOpacity style={styles.supportItem} activeOpacity={0.7}>
                  <View style={styles.supportItemLeft}>
                    <QuestionIcon size={24} color={Color.gray} weight="regular" />
                    <Text style={styles.supportText}>Câu hỏi thường gặp</Text>
                  </View>
                  <CaretRightIcon size={20} color={Color.gray} weight="bold" />
                </TouchableOpacity>

                {/* Item: Hướng dẫn sử dụng */}
                <TouchableOpacity style={styles.supportItem} activeOpacity={0.7}>
                  <View style={styles.supportItemLeft}>
                    <BookOpenIcon size={24} color={Color.gray} weight="regular" />
                    <Text style={styles.supportText}>Hướng dẫn sử dụng</Text>
                  </View>
                  <CaretRightIcon size={20} color={Color.gray} weight="bold" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          /* =========================================
             TRẠNG THÁI 2: CHƯA CÓ GÓI (EMPTY STATE)
             ========================================= */
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIconWrapper}>
              <CrownIcon size={64} color={Color.main} weight="duotone" />
            </View>
            <Text style={styles.emptyTitle}>Chưa có gói học tập nào</Text>
            <Text style={styles.emptyDescription}>
              Bạn đang sử dụng gói Cơ bản. Hãy nâng cấp ngay để mở khóa toàn bộ đặc quyền không giới hạn của Salio nhé!
            </Text>
            
            <Button 
              title="Khám phá các gói học tập" 
              variant="Green"
              onPress={() => router.push('/subscription')}
              style={styles.upgradeButton}
            />
          </View>
        )}

      </ScrollView>

      {/* --- FOOTER: Action Button (Chỉ hiện khi có gói) --- */}
      {hasActiveSubscription && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            activeOpacity={0.8}
            onPress={handleCancelSubscription}
          >
            <Text style={styles.cancelButtonText}>Hủy tự động gia hạn</Text>
          </TouchableOpacity>
        </View>
      )}

      <CancelAutoRenewModal
        visible={isCancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirmCancel={handleConfirmCancelAutoRenew}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  
  // --- HEADER ---
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

  // --- SCROLL CONTENT ---
  scrollContent: {
    paddingHorizontal: Padding.padding_15,
    paddingBottom: 40,
    flexGrow: 1, // Đảm bảo Scroll giãn đủ không gian để căn giữa Empty State
  },

  // --- ACTIVE PLAN CARD ---
  activePlanCard: {
    backgroundColor: Color.vang, // Vàng chanh nhạt mô phỏng theo thiết kế
    borderRadius: Border.br_30, // Bo góc lớn
    padding: 24,
    marginBottom: Gap.gap_20,
    marginTop: Gap.gap_20,
  },
  planTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_24,
    color: Color.color, // Xanh lá đậm
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Gap.gap_10,
    marginBottom: Gap.gap_20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#51AD00', // Xanh lá hiển thị trạng thái active
    marginRight: Gap.gap_8,
  },
  statusText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.color,
  },
  billingCycleText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.gray, // Xám nhạt
  },

  // --- HISTORY BUTTON ---
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 100, // Bo tròn dạng viên thuốc
    borderWidth: 1,
    borderColor: Color.stroke, // Viền xám mờ
    backgroundColor: Color.bg,
    gap: Gap.gap_8,
    marginBottom: Gap.gap_20,
  },
  historyButtonText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.gray,
  },

  divider: {
    height: 1,
    backgroundColor: Color.stroke,
    opacity: 0.5,
    marginBottom: Gap.gap_20,
  },

  // --- BENEFITS SECTION ---
  benefitsSection: {
    marginBottom: Gap.gap_20,
  },
  sectionTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text, // Có thể điều chỉnh sang xám đậm theo nhu cầu
    marginBottom: Gap.gap_15,
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_10,
  },
  benefitText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },

  // --- FOOTER (DANGER ACTION) ---
  footer: {
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_15,
    paddingBottom: Padding.padding_30, // Đẩy lên tránh thanh Home Bar
    backgroundColor: Color.bg,
  },
  cancelButton: {
    backgroundColor: Color.red, // Nút đỏ rực cảnh báo
    paddingVertical: 16,
    borderRadius: 100, // Bo tròn mạnh
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.bg, // Text trắng trên nền đỏ
  },

  // --- EMPTY STATE STYLES ---
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60, // Đẩy xuống một chút để cân đối
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Color.greenLight, // Nền xanh nhạt tạo viền cho icon vương miện
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Gap.gap_20,
  },
  emptyTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: Color.text,
    marginBottom: Gap.gap_10,
    textAlign: 'center',
  },
  emptyDescription: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.gray,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Padding.padding_15,
    marginBottom: 30,
  },
  upgradeButton: {
    width: '100%',
  },

  // --- SUPPORT SECTION (THÊM MỚI STYLES NÀY) ---
  supportSection: {
    marginBottom: Gap.gap_20,
  },
  supportList: {
    backgroundColor: Color.bg,
    borderRadius: Border.br_15,
    borderWidth: 1,
    borderColor: Color.stroke,
    overflow: 'hidden', // Giữ viền bo góc khi click item
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Padding.padding_15,
    borderBottomWidth: 1,
    borderBottomColor: Color.stroke, // Line ngăn cách giữa các item
  },
  supportItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_15,
  },
  supportText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
});