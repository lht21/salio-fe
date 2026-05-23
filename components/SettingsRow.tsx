import React, { ReactNode, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CaretRightIcon } from 'phosphor-react-native';
import { FontFamily, FontSize, Padding, Gap } from '../constants/GlobalStyles';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsRowProps {
  icon: ReactNode;
  label: string;
  value?: string;
  labelColor?: string;
  valueColor?: string;
  showArrow?: boolean;
  onPress?: () => void;
  isLast?: boolean; // Để ẩn viền dưới của hàng cuối cùng nếu cần
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  value,
  labelColor,
  valueColor,
  showArrow = true,
  onPress,
  isLast = false,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity 
      style={[styles.container, !isLast && styles.borderBottom]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={[styles.label, { color: labelColor || colors.gray }]}>{label}</Text>
      </View>
      
      <View style={styles.rightContent}>
        {value && <Text style={[styles.value, { color: valueColor || colors.text }]}>{value}</Text>}
        {showArrow && <CaretRightIcon size={16} color={colors.gray} weight="regular" />}
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Padding.padding_10 || 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke + '40', // Thêm độ trong suốt cho viền mờ
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_10 || 10,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
  },
  label: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_8 || 8,
  },
  value: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
  },
});