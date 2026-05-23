import React, { useMemo, useCallback, forwardRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CheckCircleIcon, CircleIcon } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import CloseButton from '../CloseButton';
import { FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

export type ReminderType = 'none' | 'morning' | 'evening';

export type ChangeReminderModalProps = {
  reminder: ReminderType;
  onSelectReminder: (reminder: ReminderType) => void;
  onClose: () => void;
};

const ChangeReminderModal = forwardRef<BottomSheetModal, ChangeReminderModalProps>(({ reminder, onSelectReminder, onClose }, ref) => {
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

  const REMINDERS: { id: ReminderType; label: string }[] = [
    { id: 'none', label: t('settings.reminderNone', 'Tắt nhắc nhở') },
    { id: 'morning', label: t('settings.reminderMorning', 'Buổi sáng (08:00)') },
    { id: 'evening', label: t('settings.reminderEvening', 'Buổi tối (20:00)') },
  ];

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
            <Text style={styles.headerTitle}>{t('settings.reminderTitle', 'Nhắc Nhở Học Tập')}</Text>
            <CloseButton variant="Stroke" onPress={onClose} />
          </View>

          <View style={styles.body}>
            {REMINDERS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.optionRow}
                onPress={() => onSelectReminder(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{item.label}</Text>
                {reminder === item.id ? (
                  <CheckCircleIcon size={24} color={colors.main2} weight="fill" />
                ) : (
                  <CircleIcon size={24} color={colors.gray} weight="regular" />
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
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.text },
  body: { paddingBottom: 16 },
  optionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  optionText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.text },
});

export default ChangeReminderModal;