import React, { useMemo } from 'react';
import { Keyboard, StyleSheet, View, Modal, Pressable, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

import Button from '../Button';
import { CustomInput } from '../CustomInput';
import CloseButton from '../CloseButton';
import { FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';

export type ChangeUserNameModalProps = {
  visible: boolean;
  currentUserName: string;
  onChangeUserName: (newUserName: string) => void;
  onClose: () => void;
};

const ChangeUserNameModal = ({
  visible,
  currentUserName,
  onChangeUserName,
  onClose,
}: ChangeUserNameModalProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [newUserName, setNewUserName] = React.useState(currentUserName);

  React.useEffect(() => {
    if (visible) {
      setNewUserName(currentUserName);
    }
  }, [currentUserName, visible]);

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleConfirm = () => {
    const trimmedUserName = newUserName.trim();

    if (!trimmedUserName) {
      return;
    }

    Keyboard.dismiss();
    onChangeUserName(trimmedUserName);
  };

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
            <Text style={styles.headerTitle}>{t('settings.changeUserName', 'Thay đổi Tên người dùng')}</Text>
            <CloseButton variant="Stroke" onPress={handleClose} />
          </View>

          <View style={styles.body}>
            <CustomInput
              placeholder={t('settings.newName', 'Tên mới')}
              value={newUserName}
              onChangeText={setNewUserName}
              maxLength={50}
              returnKeyType="done"
              onSubmitEditing={handleConfirm}
            />
            <Button
              title={t('common.save', 'Lưu')}
              variant="Green"
              onPress={handleConfirm}
              style={styles.confirmButton}
              disabled={!newUserName.trim() || newUserName.trim() === currentUserName}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.modalOverlayBg || 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  backgroundTouchable: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  sheetContent: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: Border.br_30,
    borderTopRightRadius: Border.br_30,
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_15,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.dragHandleBg || '#CBD5E1',
    alignSelf: 'center',
    marginBottom: Gap.gap_15,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.text },
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

export default ChangeUserNameModal;
