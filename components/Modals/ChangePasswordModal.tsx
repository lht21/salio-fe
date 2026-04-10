import React from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Color, FontFamily, FontSize } from '../../constants/GlobalStyles';
import SettingsSheetModal from './SettingsSheetModal';
import { CustomInput } from '../CustomInput';
import Button from '../Button';

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
  const newPasswordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);
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
        {/* <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu hiện tại"
          placeholderTextColor="#9CA3AF"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => newPasswordInputRef.current?.focus()}
          accessibilityLabel="Mật khẩu hiện tại"
        /> */}

        <CustomInput
          placeholder="Nhập mật khẩu hiện tại"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />

        <CustomInput
          ref={newPasswordInputRef}
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
        />

        <CustomInput
          ref={confirmPasswordInputRef}
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
  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E5EBF5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  confirmButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },
  confirmButtonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: '#FFFFFF',
  },
});

export default ChangePasswordModal;
