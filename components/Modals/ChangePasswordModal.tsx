import React, { useState } from 'react';
import { Keyboard, StyleSheet, View, Modal, Pressable, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';

import Button from '../Button';
import { CustomInput } from '../CustomInput';
import CloseButton from '../CloseButton';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import UserService from '../../api/services/user.service';

export type ChangePasswordModalProps = {
  visible: boolean;
  onClose: () => void;
};

const ChangePasswordModal = ({
  visible,
  onClose,
}: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    resetForm();
    onClose();
  };

  const handleConfirm = async () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận không khớp!');
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const response = await UserService.changePassword({
        currentPassword,
        newPassword,
      });

      if (response.success) {
        Alert.alert('Thành công', 'Đổi mật khẩu thành công!');
        resetForm();
        onClose();
      } else {
        Alert.alert('Lỗi', response.message || 'Đổi mật khẩu thất bại!');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
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
            <View style={styles.inputWrapper}>
              <CustomInput
                placeholder="Nhập mật khẩu hiện tại"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrent}
                returnKeyType="next"
                accessibilityLabel="Mật khẩu hiện tại"
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowCurrent(!showCurrent)} activeOpacity={0.7}>
                {showCurrent ? <Eye size={20} color={Color.gray} /> : <EyeSlash size={20} color={Color.gray} />}
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <CustomInput
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNew}
                returnKeyType="next"
                accessibilityLabel="Mật khẩu mới"
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowNew(!showNew)} activeOpacity={0.7}>
                {showNew ? <Eye size={20} color={Color.gray} /> : <EyeSlash size={20} color={Color.gray} />}
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <CustomInput
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                returnKeyType="done"
                onSubmitEditing={handleConfirm}
                accessibilityLabel="Xác nhận mật khẩu mới"
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirm(!showConfirm)} activeOpacity={0.7}>
                {showConfirm ? <Eye size={20} color={Color.gray} /> : <EyeSlash size={20} color={Color.gray} />}
              </TouchableOpacity>
            </View>

            <Button
              title="Lưu"
              variant="Green"
              onPress={handleConfirm}
              style={styles.confirmButton}
              disabled={!isFormValid || isLoading}
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
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: Padding.padding_15,
    height: '100%',
    justifyContent: 'center',
  },
  confirmButton: {
    height: 48,
    borderRadius: 37,
    marginVertical: 0,
  },
});

export default ChangePasswordModal;
