import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import {
  PlusIcon,
  BookmarkSimpleIcon,
  CardsIcon,
  StackPlusIcon
} from 'phosphor-react-native';

import { FontFamily, FontSize, Border, Gap, Padding } from '../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

export type MenuItemVariant = 'default' | 'favorite' | 'flashcardSet' | 'createSet' | 'danger';

interface MenuItemProps {
  label: string;
  variant?: MenuItemVariant;
  icon?: React.ReactNode; // Dùng cho variant 'default' nếu muốn custom icon
  onPress: () => void;
}

export default function ActionMenuItem({ label, variant = 'default', icon, onPress }: MenuItemProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);


  // Xác định style và icon dựa trên variant
  let textStyle = styles.defaultText;
  let iconBgStyle = styles.defaultIconBg;
  let iconColor = colors.textPrimary;
  let LeftIconComponent = icon;
  let showRightPlus = false;

  switch (variant) {
    case 'favorite':
      // Lưu vào Sổ tay từ vựng
      iconColor = '#C92323';
      iconBgStyle = { backgroundColor: '#FFEBEB' }; // Đỏ nhạt
      textStyle = { ...styles.defaultText, color: iconColor };
      LeftIconComponent = <BookmarkSimpleIcon size={24} color={iconColor} weight="fill" />;
      showRightPlus = true;
      break;

    case 'flashcardSet':
      // Lưu vào một bộ Flashcard đã có
      iconColor = colors.textBrand; // Màu xanh đậm
      iconBgStyle = { backgroundColor: colors.primaryLight }; // Xanh nhạt
      textStyle = { ...styles.defaultText, color: iconColor };
      LeftIconComponent = <CardsIcon size={24} color={iconColor} weight="fill" />;
      showRightPlus = true;
      break;

    case 'createSet':
      // Tạo bộ Flashcard mới
      iconColor = colors.textSecondary;
      iconBgStyle = { backgroundColor: '#F1F5F9' };
      textStyle = { ...styles.defaultText, color: iconColor };
      LeftIconComponent = <StackPlusIcon size={24} color={iconColor} weight="bold" />;
      break;

    case 'danger':
      // Nút Xóa / Cảnh báo
      iconColor = colors.red || '#EF4444';
      iconBgStyle = { backgroundColor: '#FEE2E2' }; // Đỏ nhạt
      textStyle = { ...styles.defaultText, color: iconColor };
      break;

    default:
      // Mặc định (như ActionMenuModal)
      break;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        {LeftIconComponent && (
          <View style={[styles.iconWrapper, iconBgStyle]}>
            {LeftIconComponent}
          </View>
        )}
        <Text style={textStyle}>{label}</Text>
      </View>

      {/* Hiển thị dấu + nhỏ ở bên phải nếu cần */}
      {showRightPlus && (
        <PlusIcon size={20} color={iconColor} weight="bold" />
      )}
    </TouchableOpacity>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: Border.br_15,
    padding: Padding.padding_15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Gap.gap_15,
  },

  // --- DEFAULT STYLES ---
  defaultIconBg: {
    backgroundColor: '#F1F5F9', // Xám mờ cho icon mặc định
  },
  defaultText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    color: colors.textPrimary,
  },
});