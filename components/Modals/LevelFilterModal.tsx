import React, { useMemo } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { CheckCircleIcon } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

import { FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import CloseButton from '../CloseButton';

export type Level = 'EPS' | 'TOPIK I' | 'TOPIK II';

interface LevelFilterModalProps {
  isVisible: boolean;
  currentLevel: Level;
  onClose: () => void;
  onSelectLevel: (level: Level) => void;
}

export default function LevelFilterModal({ 
  isVisible,
  currentLevel,
  onClose,
  onSelectLevel
}: LevelFilterModalProps) {
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

  return (
    <Modal
      visible={isVisible}
      animationType="slide" 
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backgroundTouchable} onPress={onClose} />
        
        <View style={styles.sheetContent}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('level.title', 'Chọn cấp độ đề')}</Text>
            <CloseButton variant="Stroke" onPress={onClose} />
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
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.modalOverlayBg || 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  backgroundTouchable: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  sheetContent: {
    backgroundColor: colors.bg, borderTopLeftRadius: Border.br_30, borderTopRightRadius: Border.br_30,
    paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_15, paddingBottom: 40, 
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10,
  },
  dragHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: colors.dragHandleBg || '#CBD5E1', alignSelf: 'center', marginBottom: Gap.gap_15 },
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