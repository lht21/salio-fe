import React, { useMemo } from 'react';
import { StyleSheet, View, Modal, Pressable, Text, TouchableOpacity } from 'react-native';
import { CheckCircleIcon, CircleIcon } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import CloseButton from '../CloseButton';
import { FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';

export type ReminderType = 'none' | 'morning' | 'evening';

export type ChangeReminderModalProps = {
  visible: boolean;
  reminder: ReminderType;
  onSelectReminder: (reminder: ReminderType) => void;
  onClose: () => void;
};

const ChangeReminderModal = ({ visible, reminder, onSelectReminder, onClose }: ChangeReminderModalProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const REMINDERS: { id: ReminderType; label: string }[] = [
    { id: 'none', label: t('settings.reminderNone', 'Tắt nhắc nhở') },
    { id: 'morning', label: t('settings.reminderMorning', 'Buổi sáng (08:00)') },
    { id: 'evening', label: t('settings.reminderEvening', 'Buổi tối (20:00)') },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backgroundTouchable} onPress={onClose} />
        <View style={styles.sheetContent}>
          <View style={styles.dragHandle} />

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
        </View>
      </View>
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
  body: { paddingBottom: 16 },
  optionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.stroke,
  },
  optionText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.text },
});

export default ChangeReminderModal;