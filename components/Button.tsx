import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
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
  title = "Label",
  onPress,
  style,
  textStyle,
  disabled = false
}: ButtonType) => {

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
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // --- STYLES DÙNG CHUNG ---
  baseButton: {
    height: 47, // Bạn có thể dùng Height.height_47 nếu có
    borderRadius: Border.br_20 || 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 23, // Đã gộp paddingLeft và paddingRight để text luôn căn giữa chuẩn
    paddingVertical: Padding.padding_5,
    marginVertical: 8, // Thêm margin để các nút cách nhau khi render list
  },
  baseText: {
    fontSize: FontSize.fs_14,
    fontFamily: FontFamily.lexendDecaMedium,
    textAlign: "center",
  },
  buttonDisabled: {
    backgroundColor: Color.stroke,
    borderColor: Color.stroke,
  },
  textDisabled: {
    color: Color.gray,
  },

  // --- STYLES TỪNG VARIANT ---

  // 1. Green (Mặc định)
  variantGreen: {
    backgroundColor: Color.main,
    borderColor: '#3AB878', // Màu xanh lá đậm hơn cho viền
    borderBottomWidth: 5,
    borderLeftWidth:2,// Bạn có thể đổi sang Color.main nếu khớp màu
  },
  textGreen: {
    color: Color.color,
    fontWeight: "500",
  },

  // 2. Orange
  variantOrange: {
    backgroundColor: Color.cam,
    borderColor: '#BB5D11', // Màu xanh lá đậm hơn cho viền
    borderBottomWidth: 5,
    borderLeftWidth:2,

  },
  textOrange: {
    color: Color.bg,
    fontWeight: "500",
  },

  // 3. Outline
  variantOutline: {
    backgroundColor: Color.bg,
    borderWidth: 1.5,
    borderColor: Color.color,
    borderBottomWidth: 5,
  },
  textOutline: {
    color: Color.color,
    fontWeight: "500",
  },

  // 4. Gray (Disabled / Phụ)
  variantGray: {
    backgroundColor: Color.stroke,
    borderColor: Color.gray, // Màu xanh lá đậm hơn cho viền
    borderBottomWidth: 5,
    borderLeftWidth:2,
  },
  textGray: {
    color: Color.gray,
    fontWeight: "500",
  },

  // 5. Green Bold
  variantGreenBold: {
    backgroundColor: "#A3E88A",
  },
  textGreenBold: {
    color: "#000000",
    fontWeight: "700", // Chữ đậm hơn bản Green thường
  },

  // 6. Text Only
  variantTextOnly: {
    backgroundColor: "transparent", // Không có nền
  },
  textTextOnly: {
    color: Color.cam,
    fontWeight: "500",
  },

  // 7. Red (Cảnh báo / Thoát / Xóa)
  variantRed: {
    backgroundColor: Color.red || "#E53E3E",
     borderColor: Color.redDark || "#AB2424", // Màu xanh lá đậm hơn cho viền
      borderBottomWidth: 5,
    borderLeftWidth:2,

  },
  textRed: {
    color: Color.bg || "#FFFFFF", // Chữ màu trắng/nền để nổi bật trên nền đỏ
    fontWeight: "500",
  },

  // 8. Black
  variantBlack: {
    backgroundColor: Color.text,
    borderColor: Color.main || '#3AB878', // Màu xanh lá đậm hơn cho viền
    borderBottomWidth: 5,
    borderLeftWidth: 2,
  },
  textBlack: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
});

export default Button;