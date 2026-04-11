import React from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import Button from '../Button';
import { CustomInput } from '../CustomInput';
import SettingsSheetModal from './SettingsSheetModal';

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
    <SettingsSheetModal
      visible={visible}
      title="Đổi mật khẩu"
      onClose={handleClose}
      showCloseButton
      maxHeight="100%"
      edgeToBottom
      keyboardAware
      expandOnKeyboard
      contentScrollable
    >
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
    </SettingsSheetModal>
  );
};

const styles = StyleSheet.create({
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
