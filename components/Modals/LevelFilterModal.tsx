import React, { useMemo, forwardRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { CheckCircleIcon } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

import { FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import IconButton from '../IconButton';
import { XIcon } from 'phosphor-react-native';

export type Level = 'EPS' | 'TOPIK I' | 'TOPIK II';

interface LevelFilterModalProps {
  currentLevel: Level;
  onClose: () => void;
  onSelectLevel: (level: Level) => void;
}

const LevelFilterModal = forwardRef<BottomSheetModal, LevelFilterModalProps>(({ 
  currentLevel,
  onClose,
  onSelectLevel
}, ref) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const LEVELS: { id: Level; title: string; description: string }[] = useMemo(() => [
    { id: 'EPS', title: 'EPS', description: t('level.eps_desc', 'Đề thi tiếng Hàn chuyên ngành') },
    { id: 'TOPIK I', title: 'TOPIK I', description: t('level.topik1_desc', 'Cấp 1-2, trình độ Sơ cấp') },
    { id: 'TOPIK II', title: 'TOPIK II', description: t('level.topik2_desc', 'Cấp 3-6, trình độ Trung - Cao cấp') },
  ], [t]);

  const handleSelect = (level: Level) => {
    onSelectLevel(level);
    onClose();
  };

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

  const snapPoints = useMemo(() => ['40%'], []);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.bg }}
      handleIndicatorStyle={{ backgroundColor: colors.dragHandleBg || '#CBD5E1' }}
    >
      <BottomSheetView style={styles.sheetContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('level.title', 'Chọn cấp độ đề')}</Text>
          
          <IconButton Icon={XIcon} onPress={onClose} />
        </View>

        <View style={styles.menuContainer}>
          {LEVELS.map((level) => {
            const isSelected = level.id === currentLevel;
            return (
              <TouchableOpacity 
                key={level.id}
                style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                onPress={() => handleSelect(level.id)}
                activeOpacity={0.8}
              >
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>{level.title}</Text>
                  <Text style={[styles.optionDesc, isSelected && styles.optionDescSelected]}>{level.description}</Text>
                </View>
                {isSelected && (
                  <CheckCircleIcon size={24} color={colors.bg} weight="fill" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default LevelFilterModal;

const createStyles = (colors: any) => StyleSheet.create({
  sheetContent: {
    paddingHorizontal: Padding.padding_20, 
    paddingTop: Padding.padding_10, 
    paddingBottom: 40, 
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.text },
  menuContainer: { gap: Gap.gap_10 },
  optionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.stroke, borderRadius: Border.br_20, padding: Padding.padding_15, borderWidth: 1.5, borderColor: 'transparent' },
  optionItemSelected: { backgroundColor: colors.text, borderColor: colors.main },
  optionTextContainer: { flex: 1 },
  optionTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.text, marginBottom: 2 },
  optionTitleSelected: { color: colors.bg },
  optionDesc: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: colors.gray },
  optionDescSelected: { color: colors.optionDescSelected || '#D1D5DB' },
});