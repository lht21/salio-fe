import React from 'react';
import { Keyboard, StyleSheet, View, Modal, Pressable, Text, KeyboardAvoidingView, Platform } from 'react-native';

import Button from '../Button';
import { CustomInput } from '../CustomInput';
import CloseButton from '../CloseButton';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';

export type ChangePasswordModalProps = {
  visible: boolean;
  onChangePassword: (currentPassword: string, newPassword: string) => void;
  onClose: () => void;
};

const ChangePasswordModal = ({
  visible,
  onChangePassword,
  onClose,
}: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleClose = () => {
    Keyboard.dismiss();
    resetForm();
    onClose();
  };

  const handleConfirm = () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    Keyboard.dismiss();
    onChangePassword(currentPassword, newPassword);
    resetForm();
  };

  const isFormValid = Boolean(
    currentPassword.trim() &&
    newPassword.trim() &&
    confirmPassword.trim() &&
    newPassword === confirmPassword
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.overlay} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backgroundTouchable} onPress={handleClose} />
        <View style={styles.sheetContent}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
            <CloseButton variant="Stroke" onPress={handleClose} />
          </View>

          <View style={styles.body}>
            <CustomInput
              placeholder="Nhập mật khẩu hiện tại"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              returnKeyType="next"
              accessibilityLabel="Mật khẩu hiện tại"
            />

            <CustomInput
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              returnKeyType="done"
              accessibilityLabel="Mật khẩu mới"
            />

            <CustomInput
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              accessibilityLabel="Xác nhận mật khẩu mới"
            />

            <Button
              title="Lưu"
              variant="Green"
              onPress={handleConfirm}
              style={styles.confirmButton}
              disabled={!isFormValid}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  backgroundTouchable: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  sheetContent: { backgroundColor: Color.bg, borderTopLeftRadius: Border.br_30, borderTopRightRadius: Border.br_30, paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_15, paddingBottom: 40 },
  dragHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: Gap.gap_15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text },
  body: {
    gap: 16,
    paddingBottom: 16,
  },
  confirmButton: {
    height: 48,
    borderRadius: 37,
    marginVertical: 0,
  },
});

export default ChangePasswordModal;
