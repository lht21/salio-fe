import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';

export type CancelAutoRenewModalProps = {
  visible: boolean;
  onConfirmCancel: () => void;
  onClose: () => void;
};

const CancelAutoRenewModal = ({
  visible,
  onConfirmCancel,
  onClose,
}: CancelAutoRenewModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.dialog}>
          <Text style={styles.title}>Sắp chia tay rồi sao?</Text>
          <Text style={styles.description}>
            Nếu hủy gia hạn, hành trình học tiếng Hàn của bạn có thể bị gián đoạn đó 😢
          </Text>

          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionButton, styles.keepButton]}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Tiếp tục học"
            >
              <Text style={[styles.actionText, styles.keepText]}>Tiếp tục học</Text>
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onConfirmCancel}
              accessibilityRole="button"
              accessibilityLabel="Vẫn hủy"
            >
              <Text style={[styles.actionText, styles.cancelText]}>Vẫn hủy</Text>
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
    paddingHorizontal: 16,
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
    fontSize: FontSize.fs_24,
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
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keepButton: {
    borderWidth: 1.5,
    borderColor: Color.green,
    backgroundColor: Color.bg,
  },
  cancelButton: {
    backgroundColor: '#B40000',
  },
  actionText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 15,
  },
  keepText: {
    color: Color.green,
  },
  cancelText: {
    color: '#FFFFFF',
  },
});

export default CancelAutoRenewModal;
