import React, { useMemo, useCallback, forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import Button from '../Button';
import IconButton from '../IconButton';
import { XIcon } from 'phosphor-react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTheme } from "@/contexts/ThemeContext";

interface EmailSettingsModalProps {
  email: string;
  onClose: () => void;
  onDeleteAccount: () => void;
}

const EmailSettingsModal = forwardRef<BottomSheetModal, EmailSettingsModalProps>(({ email, onClose, onDeleteAccount }, ref) => {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const snapPoints = useMemo(() => ['40%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      backgroundStyle={{ 
        backgroundColor: colors.bg,
        borderTopLeftRadius: Border.br_30,
        borderTopRightRadius: Border.br_30 
      }}
      handleIndicatorStyle={{ backgroundColor: '#CBD5E1' }}
    >
      <BottomSheetView style={styles.sheetContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Địa chỉ Email</Text>
            <IconButton Icon={XIcon} onPress={onClose} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          <Text style={styles.infoText}>
            Vì lý do bảo mật, hệ thống không hỗ trợ thay đổi email đã đăng ký. Nếu bạn không muốn sử dụng ứng dụng nữa, bạn có thể xóa hoàn toàn tài khoản và dữ liệu.
          </Text>

          <Button
            variant="Red"
            title="Xóa tài khoản"
            onPress={onDeleteAccount}
            style={styles.deleteButton}
          />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const getStyles = (colors: any) => StyleSheet.create({
      sheetContent: {
        paddingHorizontal: Padding.padding_20,
        paddingTop: Padding.padding_15,
        paddingBottom: 40,
      },
      header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
      headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.text },
      inputContainer: {
        backgroundColor: '#F1F5F9', // Nền xám nhạt thể hiện ô input bị vô hiệu hóa
        padding: Padding.padding_15,
        borderRadius: Border.br_15,
        marginBottom: Gap.gap_15,
      },
      emailText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.gray },
      infoText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: colors.gray, lineHeight: 22, marginBottom: Gap.gap_20 },
      deleteButton: { width: '100%' }
    });

export default EmailSettingsModal;