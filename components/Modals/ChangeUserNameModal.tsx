import React, { useMemo, useCallback, forwardRef, useEffect } from 'react';
import { Keyboard, StyleSheet, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

import Button from '../Button';
import { CustomInput } from '../CustomInput';
import IconButton from '../IconButton';
import { XIcon } from 'phosphor-react-native';
import { FontFamily, FontSize, Border, Padding, Gap, Color } from '../../constants/GlobalStyles';
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
      detached={true}
      bottomInset={40}
      style={styles.floatingSheet}
      backgroundStyle={{ 
        backgroundColor: Color.main50,
        borderRadius: Border.br_30,
        borderBottomWidth: 7,
        borderLeftWidth: 4,
        borderWidth: 2,
        borderColor: "#4E7A00",
      }}
      handleIndicatorStyle={{ backgroundColor: colors.dragHandleBg || '#CBD5E1' }}
    >
      <BottomSheetView style={styles.sheetContent}>
        {/* Nút Close lơ lửng nằm trên cùng */}
        <View style={styles.closeButtonWrapper}>
          <IconButton Icon={XIcon} onPress={onClose} variant='Main' style={styles.closeButton}/>
        </View>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('settings.changeUserName', 'Thay đổi Tên người dùng')}</Text>
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
  floatingSheet: {
    marginHorizontal: 15,
  },
  sheetContent: {
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_15,
    paddingBottom: 40,
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: -78,   // Điều chỉnh giá trị này lên/xuống (Dùng số âm VD: -40 nếu muốn nổi bật ra ngoài mép trên sheet)
    right: 10, // Căn lề phải
    zIndex: 99,
  },
  header: { alignItems: 'center', marginBottom: Gap.gap_20, marginTop: 5 },
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_20, color: "#4A3218" },
  body: {
    gap: 16,
    paddingBottom: 16,
  },
  confirmButton: {
    height: 48,
    borderRadius: 37,
    marginVertical: 0,
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChangeUserNameModal;
