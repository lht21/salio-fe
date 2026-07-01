import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeftIcon } from 'phosphor-react-native';

// Constants
import { FontFamily, FontSize, Padding, Gap } from '../../../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

export default function CheckoutScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const router = useRouter();
  // Lấy thêm planId từ URL nếu sau này cần dùng
  const { planId, url } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Giải mã URL nhận được từ màn hình Detail
  const paymentUrl = typeof url === 'string' ? decodeURIComponent(url) : '';

  // Hàm theo dõi sự thay đổi của URL trong WebView
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const currentUrl = navState.url;

    /**
     * LOGIC LẮNG NGHE KẾT QUẢ THANH TOÁN (Callback URL)
     * - VNPay: Trả về vnp_ResponseCode=00 nếu thành công
     * - MoMo: Trả về resultCode=0 nếu thành công
     */

    // VNPay & MoMo thành công
    if (currentUrl.includes('vnp_ResponseCode=00') || currentUrl.includes('resultCode=0')) {
      // Đóng WebView và chuyển hướng sang màn thành công
      router.replace('/subscription/success');
    }
    // VNPay & MoMo thất bại / hủy bỏ
    else if (
      (currentUrl.includes('vnp_ResponseCode=') && !currentUrl.includes('vnp_ResponseCode=00')) ||
      (currentUrl.includes('resultCode=') && !currentUrl.includes('resultCode=0'))
    ) {
      // Đóng WebView và chuyển hướng sang màn thất bại
      router.replace('/subscription/failed');
    }
  };

  if (!paymentUrl) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không tìm thấy đường dẫn thanh toán hợp lệ.</Text>
          <TouchableOpacity style={styles.backButtonCenter} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon size={24} color={colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán an toàn</Text>
      </View>

      {/* --- WEBVIEW --- */}
      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: paymentUrl }}
          style={styles.webview}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onNavigationStateChange={handleNavigationStateChange}
        />

        {/* Hiển thị Loading mờ lên trên trong lúc WebView đang load */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
    paddingBottom: Padding.padding_15,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  backButton: { marginRight: Gap.gap_15 },
  headerTitle: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_20, color: colors.textPrimary },
  webviewContainer: { flex: 1 },
  webview: { flex: 1 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 255, 255, 0.7)', justifyContent: 'center', alignItems: 'center' },

  // State Lỗi
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Padding.padding_15 },
  errorText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_16, color: colors.textSecondary, textAlign: 'center', marginBottom: Gap.gap_20 },
  backButtonCenter: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  backButtonText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.textBrand }
});