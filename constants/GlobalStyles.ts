/* Fonts */
export const FontFamily = {
  lexendDecaMedium: "LexendDeca-Medium",
  lexendDecaRegular: "LexendDeca-Regular",
  lexendDecaSemiBold: "LexendDeca-SemiBold",
  lexendDecaBold: "LexendDeca-Bold",
  notoSerifBold: "NotoSerif-Bold",
  notoSerifRegular: "NotoSerif-Regular",
};
/* Font sizes */
export const FontSize = {
  fs_10: 10,
  fs_12: 12,
  fs_14: 14,
  fs_16: 16,
  fs_20: 20,
  fs_24: 24,
};
/* Colors - Refactored for Theme support */
export const lightTheme = {
  // --- BASE ---
  bg: "#FFFFFF",
  bg2: "#F1FAF9",
  text: "#1E1E1E",
  stroke: "#E2E8F0",
  gray: "#64748B",

  // --- GREEN (cũ của bạn - giữ lại) ---
  main: "#98F291",
  mainLighter: "rgba(152, 242, 145, 0.10)",
  main2: "#6FAE6C",
  green: "#059669",
  greenLight: "#ECFFEB",

  // --- BLUE ---
  bluePastel: "#BFD7FF",
  blue: "#2F6DF6",
  blueFb: "#1877F2",
  xanh: "#1877F2",

  // --- PURPLE (gốc + nâng cấp) ---
  purplePastel: "#C9B6FF",
  purple: "#6A3DF0",

  // --- PINK / PURPLE SOFT ---
  pinkPastel: "#F6C1FF",
  pink: "#C13DF2",

  // --- MINT ---
  mintPastel: "#B8F2E6",
  mint: "#00BFA6",

  // --- ORANGE / YELLOW ---
  orangePastel: "#FFE7B3",
  orange: "#FF9F1C",
  cam: "#F6993A",
  vang: "#F9F871",
  textInVang: "#FFFFFF",

  // --- CORAL / RED ---
  coralPastel: "#FFC1C1",
  coral: "#FF4D6D",
  red: "#FF6B6B",
  redDark: "#AB2424",

  // --- TEXT / BRAND EXTRA ---
  color: "#0C5F35",
  bgTest: "#FFFFFF",
  colorBlack: "#000000",
};

export const darkTheme = {
  // --- BASE ---
  bg: "#121212",
  bg2: "#1E1E1E",
  text: "#FFFFFF",
  stroke: "#333333",
  gray: "#A0AAB5",

  // --- GREEN ---
  main: "#6FAE6C", 
  mainLighter: "rgba(111, 174, 108, 0.20)",
  main2: "#98F291",
  green: "#10B981",
  greenLight: "#064E3B",

  // --- BLUE ---
  bluePastel: "#1E3A8A",
  blue: "#60A5FA",
  blueFb: "#3B82F6",
  xanh: "#3B82F6",

  // --- PURPLE ---
  purplePastel: "#4C1D95",
  purple: "#8B5CF6",

  // --- PINK / PURPLE SOFT ---
  pinkPastel: "#701A75",
  pink: "#D946EF",

  // --- MINT ---
  mintPastel: "#134E4A",
  mint: "#34D399",

  // --- ORANGE / YELLOW ---
  orangePastel: "#78350F",
  orange: "#F59E0B",
  cam: "#F97316",
  vang: "#FBBF24",
  textInVang: "#000000",

  // --- CORAL / RED ---
  coralPastel: "#7F1D1D",
  coral: "#F43F5E",
  red: "#EF4444",
  redDark: "#991B1B",

  // --- TEXT / BRAND EXTRA ---
  color: "#6EE7B7",
  bgTest: "#121212",
  colorBlack: "#FFFFFF",
};

// Giữ lại export Color trỏ đến lightTheme để tương thích ngược với các components hiện tại
export const Color = lightTheme;

/* Gaps */
export const Gap = {
  gap_1: 1,
  gap_5: 5,
  gap_8: 8,
  gap_10: 10,
  gap_12: 12,
  gap_14: 14,
  gap_15: 15,
  gap_18: 18,
  gap_20: 20,
  gap_22: 22,
};

export const Stroke ={
  stroke: 1.5,
}
/* Paddings */
export const Padding = {
  padding_2: 2,
  padding_3: 3,
  padding_4: 4,
  padding_5: 5,
  padding_8: 8,
  padding_10: 10,
  padding_11: 11,
  padding_15: 15,
  padding_20: 20,
  padding_30: 30,
};
/* border radiuses */
export const Border = {
  br_10: 10,
  br_15: 15,
  br_20: 20,
  br_30: 30,
  br_5: 5,
};
/* box shadows */
export const BoxShadow = {
  shadow_drop: "-4px -4px 16px #aeff67",
};
/* width */
export const Width = {
  width_104_83: 105,
  width_106_01: 106,
  width_131: 131,
  width_18: 18,
  width_24: 24,
  width_32: 32,
  width_33: 33,
  width_38: 38,
  width_64: 64,
  width_80: 80,
  width_92: 92,
};
/* height */
export const Height = {
  height_100: 100,
  height_113: 113,
  height_15: 15,
  height_18: 18,
  height_24: 24,
  height_37: 37,
  height_61: 61,
};
