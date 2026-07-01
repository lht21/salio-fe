import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { PlusIcon } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { FontFamily, FontSize } from '../constants/GlobalStyles';

interface CreateSetButtonProps {
  onPress: () => void;
  title?: string;
  icon?: React.ReactNode;
}

export default function CreateSetButton({ onPress, title, icon }: CreateSetButtonProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity style={styles.createSetButton} onPress={onPress}>
      {icon ? icon : <PlusIcon size={15} color="#FFFFFF" weight="bold" />}
      <Text style={styles.createSetText}>{title ? title : t('vocabulary.create_set', 'Tạo bộ mới')}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  createSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100, // Border radius full dạng viên thuốc
    gap: 4,
  },
  createSetText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12 || 12,
    color: colors.background || '#1E1E1E',
  },
});