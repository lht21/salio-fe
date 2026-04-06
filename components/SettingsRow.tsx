import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CaretRightIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Padding, Gap } from '../constants/GlobalStyles';

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
  labelColor = Color.gray,
  valueColor = Color.text,
  showArrow = true,
  onPress,
  isLast = false,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, !isLast && styles.borderBottom]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      </View>
      
      <View style={styles.rightContent}>
        {value && <Text style={[styles.value, { color: valueColor }]}>{value}</Text>}
        {showArrow && <CaretRightIcon size={16} color={Color.gray} weight="regular" />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Padding.padding_10 || 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Color.stroke + '40', // Thêm độ trong suốt cho viền mờ
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