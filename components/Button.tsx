import React, { useMemo } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import {
  Border,
  Color,
  FontFamily,
  FontSize,
  Padding
} from "../constants/GlobalStyles";

export type ButtonVariant =
  | "Green"       // Nền xanh lá, chữ thường
  | "Orange"      // Nền cam, chữ trắng
  | "Outline"     // Viền cam, nền trắng, chữ cam
  | "Gray"        // Nền xám, chữ xám
  | "GreenBold"   // Nền xanh lá, chữ in đậm
  | "TextOnly"    // Chỉ có chữ cam, không nền
  | "Red"         // Nền đỏ, chữ trắng (Dùng cho cảnh báo/xóa)
  | "Black";      // Nền đen, viền xanh lá đậm

export type ButtonType = {
  variant?: ButtonVariant;
  title?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

const Button = ({
  variant = "Green",
  title,
  onPress,
  style,
  textStyle,
  disabled = false
}: ButtonType) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const displayTitle = title || t('common.label', 'Nhãn');

  // Hàm mapping style cho background/border của Button
  const getButtonVariantStyle = (): StyleProp<ViewStyle> => {
    switch (variant) {
      case "Orange": return styles.variantOrange;
      case "Outline": return styles.variantOutline;
      case "Gray": return styles.variantGray;
      case "GreenBold": return styles.variantGreenBold;
      case "TextOnly": return styles.variantTextOnly;
      case "Red": return styles.variantRed;
      case "Black": return styles.variantBlack;
      case "Green":
      default: return styles.variantGreen;
    }
  };

  // Hàm mapping style cho màu sắc/độ đậm của Text
  const getTextVariantStyle = (): StyleProp<TextStyle> => {
    switch (variant) {
      case "Orange": return styles.textOrange;
      case "Outline": return styles.textOutline;
      case "Gray": return styles.textGray;
      case "GreenBold": return styles.textGreenBold;
      case "TextOnly": return styles.textTextOnly;
      case "Red": return styles.textRed;
      case "Black": return styles.textBlack;
      case "Green":
      default: return styles.textGreen;
    }
  };

  return (
    <Pressable
      style={[
        styles.baseButton,
        getButtonVariantStyle(),
        disabled && styles.buttonDisabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.baseText,
        getTextVariantStyle(),
        disabled && styles.textDisabled,
        textStyle,
      ]}>
        {displayTitle}
      </Text>
    </Pressable>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  // --- STYLES DÙNG CHUNG ---
  baseButton: {
    height: 47, // Bạn có thể dùng Height.height_47 nếu có
    borderRadius: Border.br_20 || 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 23, // Đã gộp paddingLeft và paddingRight để text luôn căn giữa chuẩn
    paddingVertical: Padding.padding_5,
  },
  baseText: {
    fontSize: FontSize.fs_14,
    fontFamily: FontFamily.lexendDecaMedium,
    textAlign: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.stroke,
    borderColor: colors.stroke,
  },
  textDisabled: {
    color: colors.gray,
  },

  // --- STYLES TỪNG VARIANT ---

  // 1. Green (Mặc định)
  variantGreen: {
    backgroundColor: Color.main,
    borderColor: Color.main500, // Màu xanh lá đậm hơn cho viền
    borderBottomWidth: 5,
    borderLeftWidth:2,// Bạn có thể đổi sang Color.main nếu khớp màu
  },
  textGreen: {
    color: Color.color,
    fontWeight: "500",
  },

  // 2. Orange
  variantOrange: {
    backgroundColor: colors.cam,
    borderColor: colors.btnOrangeBorder || '#BB5D11', // Màu xanh cam đậm hơn cho viền
    borderBottomWidth: 5,
    borderLeftWidth:2,

  },
  textOrange: {
    color: colors.bg,
    fontWeight: "500",
  },

  // 3. Outline
  variantOutline: {
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: Color.main900,
    borderBottomWidth: 5,
  },
  textOutline: {
    color: colors.color,
    fontFamily: FontFamily.lexendDecaMedium,
  },

  // 4. Gray (Disabled / Phụ)
  variantGray: {
    backgroundColor: colors.stroke,
    borderColor: colors.gray, // Màu xám cho viền
    borderBottomWidth: 5,
    borderLeftWidth:2,
  },
  textGray: {
    color: colors.gray,
    fontWeight: "500",
  },

  // 5. Green Bold
  variantGreenBold: {
    backgroundColor: colors.btnGreenBoldBg || "#A3E88A",
  },
  textGreenBold: {
    color: colors.btnGreenBoldText || "#000000",
    fontWeight: "700", // Chữ đậm hơn bản Green thường
  },

  // 6. Text Only
  variantTextOnly: {
    backgroundColor: "transparent", // Không có nền
  },
  textTextOnly: {
    color: colors.main500,
    fontWeight: "500",
  },

  // 7. Red (Cảnh báo / Thoát / Xóa)
  variantRed: {
    backgroundColor: colors.red || "#E53E3E",
    borderColor: colors.redDark || "#AB2424", // Màu đỏ đậm hơn cho viền
      borderBottomWidth: 5,
    borderLeftWidth:2,

  },
  textRed: {
    color: colors.whiteText || "#FFFFFF", // Chữ màu trắng/nền để nổi bật trên nền đỏ
    fontWeight: "500",
  },

  // 8. Black
  variantBlack: {
    backgroundColor: Color.text,
    borderColor: colors.main || '#3AB878', // Màu xanh lá cho viền
    borderBottomWidth: 5,
    borderLeftWidth: 2,
  },
  textBlack: {
    color: Color.bg, // Màu nghịch đảo tự động
    fontWeight: "500",
  },
});

export default Button;