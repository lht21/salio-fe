import React, { useMemo, useCallback, forwardRef } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

import { AvatarPreset } from '../../constants/avatarPresets';
import { FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import Button from '../Button';
import IconButton from '../IconButton';
import { XIcon } from 'phosphor-react-native';

export type ChangeAvatarModalProps = {
  selectedAvatarId: string;
  avatarOptions: AvatarPreset[];
  onSelectAvatar: (avatar: AvatarPreset) => void;
  onClose: () => void;
  onUploadPress?: () => void;
};

const ChangeAvatarModal = forwardRef<BottomSheetModal, ChangeAvatarModalProps>(({
  selectedAvatarId,
  avatarOptions,
  onSelectAvatar,
  onClose,
  onUploadPress,
}, ref) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const snapPoints = useMemo(() => ['65%'], []);

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

  const handleUploadPress = () => {
    if (onUploadPress) {
      onUploadPress();
      return;
    }

    console.log('Avatar upload from device is not implemented yet.');
  };

  const avatarRows: AvatarPreset[][] = [];
  for (let index = 0; index < avatarOptions.length; index += 4) {
    avatarRows.push(avatarOptions.slice(index, index + 4));
  }

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      backgroundStyle={{ 
        backgroundColor: colors.bg,
        borderTopLeftRadius: Border.br_30,
        borderTopRightRadius: Border.br_30 
      }}
      handleIndicatorStyle={{ backgroundColor: colors.dragHandleBg || '#CBD5E1' }}
    >
      <BottomSheetView style={styles.sheetContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('settings.changeAvatar', 'Thay đổi ảnh đại diện')}</Text>
            <IconButton Icon={XIcon} onPress={onClose} />
          </View>

          <View style={styles.body}>
            <Button
              title={t('settings.uploadFromDevice', 'Tải lên từ thiết bị')}
              variant="Green"
              onPress={handleUploadPress}
              style={styles.uploadButton}
            />

            <Text style={styles.sectionLabel}>{t('settings.availableImages', 'Hình ảnh có sẵn')}</Text>

            <View style={styles.gridCard}>
              {avatarRows.map((row, rowIndex) => (
                <View
                  key={`avatar-row-${rowIndex}`}
                  style={[styles.gridRow, rowIndex === avatarRows.length - 1 && styles.gridRowLast]}
                >
                  {row.map((avatar) => {
                    const isSelected = avatar.id === selectedAvatarId;

                    return (
                      <Pressable
                        key={avatar.id}
                        style={styles.avatarButton}
                        onPress={() => onSelectAvatar(avatar)}
                        accessibilityRole="button"
                        accessibilityLabel={avatar.label}
                      >
                        <View style={[styles.avatarFrame, isSelected && styles.avatarFrameSelected]}>
                          <Image source={avatar.imageSource} style={styles.avatarImage} resizeMode="cover" />
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
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
    gap: 0,
    paddingBottom: 10,
  },
  uploadButton: {
    marginTop: 0,
    marginBottom: 14,
    marginHorizontal: 0,
    height: 40,
    borderRadius: 22,
  },
  sectionLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: colors.gray,
    marginBottom: 10,
    marginLeft: 2,
  },
  gridCard: {
    borderWidth: 1.2,
    borderColor: colors.gridCardBorder || '#7F8B99',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.bg,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  gridRowLast: {
    marginBottom: 0,
  },
  avatarButton: {
    width: 62,
    height: 62,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  avatarFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    borderWidth: 1.2,
    borderColor: colors.avatarFrameBorder || '#658067',
    padding: 2,
    backgroundColor: colors.bg,
  },
  avatarFrameSelected: {
    borderWidth: 1.6,
    borderColor: colors.avatarFrameSelectedBorder || '#2F7A4D',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
});

export default ChangeAvatarModal;
