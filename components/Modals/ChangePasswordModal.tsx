import React, { useState, useMemo, useCallback, forwardRef } from 'react';
import { Keyboard, StyleSheet, View, Text, Platform, TouchableOpacity, Alert } from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

import Button from '../Button';
import { CustomInput } from '../CustomInput';
import CloseButton from '../CloseButton';
import { FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import UserService from '../../api/services/user.service';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

export type ChangePasswordModalProps = {
  onClose: () => void;
};

const ChangePasswordModal = forwardRef<BottomSheetModal, ChangePasswordModalProps>(({ onClose }, ref) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const snapPoints = useMemo(() => ['50%'], []);

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
      Alert.alert(t('common.error', 'Lỗi'), t('settings.pwdMismatch', 'Mật khẩu mới và xác nhận không khớp!'));
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
        Alert.alert(t('common.success', 'Thành công'), t('settings.pwdSuccess', 'Đổi mật khẩu thành công!'));
        resetForm();
        onClose();
      } else {
        Alert.alert(t('common.error', 'Lỗi'), response.message || t('settings.pwdFailed', 'Đổi mật khẩu thất bại!'));
      }
    } catch (error: any) {
      Alert.alert(t('common.error', 'Lỗi'), error.response?.data?.message || t('settings.pwdCurrentWrong', 'Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra'));
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
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backgroundStyle={{ 
        backgroundColor: colors.bg,
        borderTopLeftRadius: Border.br_30,
        borderTopRightRadius: Border.br_30 
      }}
      handleIndicatorStyle={{ backgroundColor: colors.dragHandleBg || '#CBD5E1' }}
    >
      <BottomSheetView style={styles.sheetContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('settings.changePassword', 'Đổi mật khẩu')}</Text>
            <CloseButton variant="Stroke" onPress={handleClose} />
          </View>

          <View style={styles.body}>
            <View style={styles.inputWrapper}>
              <CustomInput
                placeholder={t('settings.enterCurrentPwd', 'Nhập mật khẩu hiện tại')}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrent}
                returnKeyType="next"
                accessibilityLabel={t('settings.currentPwd', 'Mật khẩu hiện tại')}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowCurrent(!showCurrent)} activeOpacity={0.7}>
                {showCurrent ? <Eye size={20} color={colors.gray} /> : <EyeSlash size={20} color={colors.gray} />}
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <CustomInput
                placeholder={t('settings.enterNewPwd', 'Nhập mật khẩu mới')}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNew}
                returnKeyType="next"
                accessibilityLabel={t('settings.newPwd', 'Mật khẩu mới')}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowNew(!showNew)} activeOpacity={0.7}>
                {showNew ? <Eye size={20} color={colors.gray} /> : <EyeSlash size={20} color={colors.gray} />}
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <CustomInput
                placeholder={t('settings.confirmNewPwd', 'Nhập lại mật khẩu mới')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirm}
                returnKeyType="done"
                onSubmitEditing={handleConfirm}
                accessibilityLabel={t('settings.confirmNewPwdLabel', 'Xác nhận mật khẩu mới')}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirm(!showConfirm)} activeOpacity={0.7}>
                {showConfirm ? <Eye size={20} color={colors.gray} /> : <EyeSlash size={20} color={colors.gray} />}
              </TouchableOpacity>
            </View>

            <Button
              title={t('common.save', 'Lưu')}
              variant="Green"
              onPress={handleConfirm}
              style={styles.confirmButton}
              disabled={!isFormValid || isLoading}
            />
          </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const createStyles = (colors: any) => StyleSheet.create({
  sheetContent: { paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_15, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.text },
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
