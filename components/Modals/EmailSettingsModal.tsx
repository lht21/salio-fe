import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import Button from '../Button';
import CloseButton from '../CloseButton';

interface EmailSettingsModalProps {
  visible: boolean;
  email: string;
  onClose: () => void;
  onDeleteAccount: () => void;
}

export default function EmailSettingsModal({ visible, email, onClose, onDeleteAccount }: EmailSettingsModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backgroundTouchable} onPress={onClose} />
        <View style={styles.sheetContent}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Địa chỉ Email</Text>
            <CloseButton variant="Stroke" onPress={onClose} />
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
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  backgroundTouchable: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
  },
  sheetContent: {
    backgroundColor: Color.bg,
    borderTopLeftRadius: Border.br_30,
    borderTopRightRadius: Border.br_30,
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_15,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 40, height: 5, borderRadius: 3, backgroundColor: '#CBD5E1', 
    alignSelf: 'center', marginBottom: Gap.gap_15,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text },
  inputContainer: {
    backgroundColor: '#F1F5F9', // Nền xám nhạt thể hiện ô input bị vô hiệu hóa
    padding: Padding.padding_15,
    borderRadius: Border.br_15,
    marginBottom: Gap.gap_15,
  },
  emailText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.gray },
  infoText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.gray, lineHeight: 22, marginBottom: Gap.gap_20 },
  deleteButton: { width: '100%' }
});