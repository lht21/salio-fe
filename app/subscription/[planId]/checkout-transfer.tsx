import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeftIcon, CopyIcon } from 'phosphor-react-native';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';

// Constants & Components
import { FontFamily, FontSize, Padding, Gap, Border } from '../../../constants/GlobalStyles';
import Button from '../../../components/Button';
import { useTheme } from "@/contexts/ThemeContext";

export default function CheckoutTransferScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const router = useRouter();
  const { orderId, amount, bankId, accountNo, accountName } = useLocalSearchParams();

  // Ép kiểu chuẩn xác từ params
  const safeOrderId = typeof orderId === 'string' ? orderId : '';
  const safeAmount = typeof amount === 'string' ? amount : '0';
  const safeBankId = typeof bankId === 'string' ? bankId : 'MB';
  const safeAccountNo = typeof accountNo === 'string' ? accountNo : '';
  const safeAccountName = typeof accountName === 'string' ? accountName : '';

  // Tạo URL VietQR (Tự động tạo ảnh mã QR chứa toàn bộ thông tin)
  const qrUrl = `https://img.vietqr.io/image/${safeBankId}-${safeAccountNo}-compact2.png?amount=${safeAmount}&addInfo=${safeOrderId}&accountName=${encodeURIComponent(safeAccountName)}`;

  // Hàm copy vào khay nhớ tạm
  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Đã sao chép', `Đã lưu ${label} vào khay nhớ tạm!`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon size={24} color={colors.text} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán chuyển khoản</Text>
      </View>

      {/* --- BODY --- */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.instructionText}>
          Mở ứng dụng ngân hàng của bạn để quét mã QR bên dưới, hoặc sao chép thông tin để chuyển khoản thủ công.
        </Text>

        {/* Khung chứa ảnh QR */}
        <View style={styles.qrContainer}>
          <Image 
            source={{ uri: qrUrl }} 
            style={styles.qrImage} 
            contentFit="contain" 
            transition={300}
          />
        </View>

        {/* Khung chi tiết thông tin chuyển khoản */}
        <View style={styles.detailsBox}>
          {/* Số tài khoản */}
          <View style={styles.detailRow}>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Số tài khoản ({safeBankId})</Text>
              <Text style={styles.detailValue}>{safeAccountNo}</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} onPress={() => copyToClipboard(safeAccountNo, 'số tài khoản')}>
              <CopyIcon size={20} color={colors.gray} weight="duotone" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />

          {/* Tên tài khoản (Không cần copy) */}
          <View style={styles.detailRow}>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Tên người nhận</Text>
              <Text style={styles.detailValue}>{safeAccountName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Số tiền */}
          <View style={styles.detailRow}>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Số tiền cần chuyển</Text>
              <Text style={styles.amountValue}>
                {Number(safeAmount).toLocaleString('vi-VN')} đ
              </Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} onPress={() => copyToClipboard(safeAmount, 'số tiền')}>
              <CopyIcon size={20} color={colors.gray} weight="duotone" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Nội dung chuyển khoản */}
          <View style={styles.detailRow}>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Nội dung chuyển khoản (Bắt buộc)</Text>
              <Text style={[styles.detailValue, { color: colors.cam }]}>{safeOrderId}</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} onPress={() => copyToClipboard(safeOrderId, 'nội dung')}>
              <CopyIcon size={20} color={colors.gray} weight="duotone" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* --- FOOTER --- */}
      <View style={styles.footer}>
        <Button
          title="Tôi đã chuyển khoản thành công"
          variant="Green"
          onPress={() => router.replace('/subscription/success')}
        />
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      safeArea: { flex: 1, backgroundColor: colors.bg },
      
      // Header
      header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_10, paddingBottom: Padding.padding_15, backgroundColor: colors.bg },
      backButton: { marginRight: Gap.gap_15 },
      headerTitle: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_20, color: colors.text },
      
      // Body
      scrollContent: { paddingHorizontal: Padding.padding_15, paddingBottom: 40 },
      instructionText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: colors.gray, textAlign: 'center', marginVertical: Gap.gap_20, lineHeight: 22 },
      
      // QR Image
      qrContainer: { alignItems: 'center', marginBottom: Gap.gap_22, backgroundColor: '#FFF', padding: 15, borderRadius: Border.br_20, borderWidth: 1, borderColor: colors.stroke, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
      qrImage: { width: 280, height: 280 },
      
      // Details Box
      detailsBox: { backgroundColor: '#F8FAFC', borderRadius: Border.br_15, padding: Padding.padding_15, borderWidth: 1, borderColor: colors.stroke },
      detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Padding.padding_10 },
      detailTextContainer: { flex: 1, paddingRight: Gap.gap_10 },
      detailLabel: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: colors.gray, marginBottom: 4 },
      detailValue: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.text },
      amountValue: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.color }, // Màu nổi bật cho tiền
      
      // Utils
      copyBtn: { padding: 8, backgroundColor: '#E2E8F0', borderRadius: Border.br_10 },
      divider: { height: 1, backgroundColor: colors.stroke, opacity: 0.5 },
      
      // Footer
      footer: { paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_15, paddingBottom: Padding.padding_30, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.stroke }
    });