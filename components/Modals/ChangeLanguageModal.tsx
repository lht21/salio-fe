import React, { useMemo, useCallback, forwardRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

import { FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import CloseButton from '../CloseButton';

export type LanguageMode = 'vi' | 'en' | 'ko';

export type ChangeLanguageModalProps = {
  language: LanguageMode;
  onSelectLanguage: (language: LanguageMode) => void;
  onClose: () => void;
};

const ChangeLanguageModal = forwardRef<BottomSheetModal, ChangeLanguageModalProps>(({
  language,
  onSelectLanguage,
  onClose,
}, ref) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const snapPoints = useMemo(() => ['45%'], []);

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

  const LANGUAGE_OPTIONS: Array<{
    value: LanguageMode;
    label: string;
    flag: string;
  }> = [
      { value: 'vi', label: t('settings.vietnamese', 'Tiếng Việt'), flag: '🇻🇳' },
      { value: 'en', label: t('settings.english', 'Tiếng Anh'), flag: '🇬🇧' },
      { value: 'ko', label: t('settings.korean', 'Tiếng Hàn'), flag: '🇰🇷' },
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
            <Text style={styles.headerTitle}>{t('settings.language', 'Ngôn ngữ')}</Text>
            <CloseButton variant="Stroke" onPress={onClose} />
          </View>

          <View style={styles.body}>
            {LANGUAGE_OPTIONS.map((option, index) => {
              const isActive = option.value === language;

              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.optionCard,
                    isActive && styles.optionCardActive,
                    index === LANGUAGE_OPTIONS.length - 1 && styles.optionCardLast,
                  ]}
                  onPress={() => onSelectLanguage(option.value)}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.flagBadge}>
                      <Text style={styles.flagText}>{option.flag}</Text>
                    </View>

                    <Text style={styles.optionLabel}>{option.label}</Text>
                  </View>

                  {isActive ? <View style={styles.activeAccent} /> : null}
                </Pressable>
              );
            })}
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
    minHeight: 288,
    paddingBottom: 4,
  },
  optionCard: {
    position: 'relative',
    minHeight: 74,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.optionCardBorder || '#C9D7E8',
    backgroundColor: colors.bg,
    marginBottom: 18,
    overflow: 'hidden',
  },
  optionCardActive: {
    borderColor: colors.optionCardActiveBorder || '#D8E3F2',
  },
  optionCardLast: {
    marginBottom: 0,
  },
  optionContent: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 18,
  },
  flagBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  flagText: {
    fontSize: 28,
    lineHeight: 30,
  },
  optionLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: colors.text,
  },
  activeAccent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 5,
    backgroundColor: colors.activeAccentBg || '#0B663B',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});

export default ChangeLanguageModal;
