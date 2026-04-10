import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';

export type LogoutConfirmModalProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const LogoutConfirmModal = ({
  visible,
  onConfirm,
  onCancel,
}: LogoutConfirmModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

        <View style={styles.dialog}>
          <Text style={styles.title}>Rời đi rồi à?</Text>
          <Text style={styles.description}>
            Bạn sẽ cần đăng nhập lại để tiếp tục học nhé.
          </Text>

          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Tiếp tục học"
            >
              <Text style={[styles.actionText, styles.cancelText]}>Tiếp tục học</Text>
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.confirmButton]}
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel="Đăng xuất"
            >
              <Text style={[styles.actionText, styles.confirmText]}>Đăng xuất</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.36)',
    paddingHorizontal: 18,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Border.br_20,
    backgroundColor: Color.bg,
    paddingHorizontal: Padding.padding_19,
    paddingVertical: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 10,
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: Color.text,
  },
  description: {
    marginTop: Gap.gap_10,
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_16,
    lineHeight: 24,
    color: Color.text,
  },
  actionRow: {
    marginTop: Gap.gap_20,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: Color.green,
    backgroundColor: Color.bg,
  },
  confirmButton: {
    backgroundColor: '#B40000',
  },
  actionText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
  },
  cancelText: {
    color: Color.green,
  },
  confirmText: {
    color: '#FFFFFF',
  },
});

export default LogoutConfirmModal;
