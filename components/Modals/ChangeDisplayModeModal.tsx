import React, { useMemo } from 'react';
import { MoonIcon, SunIcon } from 'phosphor-react-native';
import { Pressable, StyleSheet, Text, View, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

import { FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import CloseButton from '../CloseButton';

export type DisplayMode = 'light' | 'dark';

export type ChangeDisplayModeModalProps = {
  visible: boolean;
  mode: DisplayMode;
  onSelectMode: (mode: DisplayMode) => void;
  onClose: () => void;
};

const ChangeDisplayModeModal = ({
  visible,
  mode,
  onSelectMode,
  onClose,
}: ChangeDisplayModeModalProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const DISPLAY_MODE_OPTIONS: Array<{
    value: DisplayMode;
    label: string;
  }> = [
      { value: 'light', label: t('settings.light', 'Sáng') },
      { value: 'dark', label: t('settings.dark', 'Tối') },
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
            <Text style={styles.headerTitle}>{t('settings.display', 'Hiển thị')}</Text>
            <CloseButton variant="Stroke" onPress={onClose} />
          </View>

          <View style={styles.body}>
            {DISPLAY_MODE_OPTIONS.map((option, index) => {
              const isActive = option.value === mode;
              const Icon = option.value === 'light' ? SunIcon : MoonIcon;
              const iconColor = option.value === 'light' ? (colors.sunIconColor || '#8CED82') : (colors.moonIconColor || '#202124');

              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.optionCard,
                    isActive && styles.optionCardActive,
                    index === DISPLAY_MODE_OPTIONS.length - 1 && styles.optionCardLast,
                  ]}
                  onPress={() => onSelectMode(option.value)}
                  accessibilityRole="button"
                  accessibilityLabel={`${t('settings.mode', 'Chế độ')} ${option.label}`}
                >
                  <View style={styles.optionInner}>
                    <View style={styles.optionLeft}>
                      <Icon size={42} color={iconColor} weight="fill" />
                      <Text style={styles.optionLabel}>{option.label}</Text>
                    </View>

                    {isActive ? (
                      <View style={styles.appliedBadge}>
                        <Text style={styles.appliedBadgeText}>{t('settings.applied', 'Đang áp dụng')}</Text>
                      </View>
                    ) : null}
                  </View>

                  {isActive ? <View style={styles.activeAccent} /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.modalOverlayBg || 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  backgroundTouchable: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  sheetContent: { backgroundColor: colors.bg, borderTopLeftRadius: Border.br_30, borderTopRightRadius: Border.br_30, paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_15, paddingBottom: 40 },
  dragHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: colors.dragHandleBg || '#CBD5E1', alignSelf: 'center', marginBottom: Gap.gap_15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.text },
  body: {
    minHeight: 320,
    paddingBottom: 4,
  },
  optionCard: {
    position: 'relative',
    minHeight: 96,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  optionCardActive: {
    minHeight: 112,
    borderWidth: 1,
    borderColor: colors.displayOptionBorder || '#EDF0F5',
    backgroundColor: colors.bg,
    paddingBottom: 20,
    shadowColor: colors.displayOptionShadow || '#0C5F35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  optionCardLast: {
    marginBottom: 0,
  },
  optionInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionLeft: {
    gap: 12,
  },
  optionLabel: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: colors.text,
  },
  appliedBadge: {
    minWidth: 108,
    borderRadius: 8,
    backgroundColor: colors.appliedBadgeBg || '#C9D3E3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appliedBadgeText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 11,
    color: colors.gray || '#64748B',
  },
  activeAccent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 6,
    backgroundColor: colors.activeAccentBg || '#0B663B',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
});

export default ChangeDisplayModeModal;
