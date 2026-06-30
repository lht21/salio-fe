import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { GoogleLogoIcon, AppleLogoIcon, FacebookLogoIcon } from "phosphor-react-native";
import { Padding } from "../constants/GlobalStyles";
import { useTheme } from "@/contexts/ThemeContext";

// Định nghĩa kiểu icon hỗ trợ
export type SocialType = "google" | "apple" | "facebook";

export type SocialButtonType = {
  social: SocialType;        // ← truyền vào để chọn icon
  onPress?: () => void;
  size?: number;
  iconColor?: string;
};

// Map social → icon tương ứng
const SOCIAL_ICONS = {
  google:   GoogleLogoIcon,
  apple:    AppleLogoIcon,
  facebook: FacebookLogoIcon,
};

const SocialButton = ({
  social,
  onPress,
  size = 35,
  iconColor,
}: SocialButtonType) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const IconComponent = SOCIAL_ICONS[social];
  // Nếu không truyền iconColor từ ngoài vào thì lấy mặc định từ Color.stroke
  const finalIconColor = iconColor || colors.stroke;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.wrapper,
        pressed && styles.wrapperPressed,  // feedback khi nhấn
      ]}
      onPress={onPress}
    >
      <IconComponent
        size={size}
        color={finalIconColor}
        weight="fill"   // thin | light | regular | bold | fill | duotone
      />
    </Pressable>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
      wrapper: {
        height: 65,
        width: 65,
        borderRadius: 43,
        backgroundColor: colors.bg,
        borderStyle: "solid",
        borderColor: colors.stroke,
        borderWidth: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: Padding.padding_10,
      },
      wrapperPressed: {
        opacity: 0.7,
      },
    });

export default SocialButton;