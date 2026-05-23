import React, { useMemo, useCallback, forwardRef, useEffect } from 'react';
import { Keyboard, StyleSheet, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

import Button from '../Button';
import { CustomInput } from '../CustomInput';
import CloseButton from '../CloseButton';
import { FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

export type ChangeUserNameModalProps = {
  currentUserName: string;
  onChangeUserName: (newUserName: string) => void;
  onClose: () => void;
};

const ChangeUserNameModal = forwardRef<BottomSheetModal, ChangeUserNameModalProps>(({ currentUserName, onChangeUserName, onClose }, ref) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [newUserName, setNewUserName] = React.useState(currentUserName);

  const snapPoints = useMemo(() => ['50%'], []);

  useEffect(() => {
    setNewUserName(currentUserName);
  }, [currentUserName]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      Keyboard.dismiss();
      setNewUserName(currentUserName); // Reset lại tên khi đóng
    } else if (index === 0) {
      setNewUserName(currentUserName); // Đảm bảo đúng tên khi mở
    }
  }, [currentUserName]);

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

  const handleConfirm = () => {
    const trimmedUserName = newUserName.trim();

    if (!trimmedUserName) {
      return;
    }

    Keyboard.dismiss();
    onChangeUserName(trimmedUserName);
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
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
          <Text style={styles.headerTitle}>{t('settings.changeUserName', 'Thay đổi Tên người dùng')}</Text>
          <CloseButton variant="Stroke" onPress={onClose} />
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
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const createStyles = (colors: any) => StyleSheet.create({
  sheetContent: {
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_15,
    paddingBottom: 40,
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
