import React, { useMemo, useCallback, forwardRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CheckCircleIcon, CircleIcon } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import IconButton from '../IconButton';
import { XIcon } from 'phosphor-react-native';
import { FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

export type VoiceType = 'male' | 'female';

export type ChangeVoiceModalProps = {
  voice: VoiceType;
  onSelectVoice: (voice: VoiceType) => void;
  onClose: () => void;
};

const ChangeVoiceModal = forwardRef<BottomSheetModal, ChangeVoiceModalProps>(({ voice, onSelectVoice, onClose }, ref) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const snapPoints = useMemo(() => ['40%'], []);

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

  const VOICES: { id: VoiceType; label: string }[] = [
    { id: 'male', label: t('settings.maleVoice', 'Giọng Nam') },
    { id: 'female', label: t('settings.femaleVoice', 'Giọng Nữ') },
  ];

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={true}
      backgroundStyle={{
        backgroundColor: colors.background,
        borderTopLeftRadius: Border.br_30,
        borderTopRightRadius: Border.br_30
      }}
      handleIndicatorStyle={{ backgroundColor: colors.dragHandleBg || '#CBD5E1' }}
    >
      <BottomSheetView style={styles.sheetContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('settings.chooseVoice', 'Chọn Giọng Đọc')}</Text>
          <IconButton Icon={XIcon} onPress={onClose} />
        </View>

        <View style={styles.body}>
          {VOICES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.optionRow}
              onPress={() => {
                onSelectVoice(item.id);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{item.label}</Text>
              {voice === item.id ? (
                <CheckCircleIcon size={24} color={colors.primary} weight="fill" />
              ) : (
                <CircleIcon size={24} color={colors.textSecondary} weight="regular" />
              )}
            </TouchableOpacity>
          ))}
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
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.textPrimary },
  body: { paddingBottom: 16 },
  optionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.borderDefault,
  },
  optionText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.textPrimary },
});

export default ChangeVoiceModal;