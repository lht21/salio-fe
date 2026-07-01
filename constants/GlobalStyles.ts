import { blue } from "react-native-reanimated/lib/typescript/Colors";

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
  fs_18: 18,
  fs_20: 20,
  fs_24: 24,
};

export const baseColor = {

  white: "#ffffff",


  main20: "#FAFEF5",
  main: "#9FD52C",
  main50: "#F2FCD0",
  main75: "#E8F7C0",
  main100: '#DFF5A0',
  main200: "#C8ED6A",
  main300: '#AEDD40',
  main400: "#90CC18",
  main500: '#6EAA00',
  main700: '#4E7A00',
  main900: '#2F4D00',

  brown50: "#FDF7F0",
  brown200: "#D4B896",
  brown500: "#7A5530",
  brown800: "#4A3218",

  sand50: "#FEF9E8",
  sand300: "#F5D87A",
  sand400: "#E8C030",
  sand600: "#C8962A",

  blue50: '#E0F2FF',
  blue200: '#A8DAFF',
  blue400: '#60B8F8',
  blue600: '#2896E0',

  orange50: '#FFF0E0',
  orange100: '#FFD0A0',
  orange300: '#FFAB58',
  orange500: '#F07C18',
  orange700: '#B05200',

  neutral0: "#FAFEF5",
  neutral50: "#F1F6EA",
  neutral100: "#E2E9D8",
  neutral200: "#C8D2BC",
  neutral300: "#A8B59A",
  neutral400: "#879678",
  neutral500: "#67785A",
  neutral600: "#4C5C40",
  neutral700: "#354229",
  neutral800: "#222D17",
  neutral900: "#141C0C",
  neutral950: "#0A1006",

  // --- CORAL / RED ---
  coralPastel: "#FFC1C1",
  coral: "#FF4D6D",
  red: "#FF6B6B",
  redDark: "#AB2424",

  // --- PURPLE (gốc + nâng cấp) ---
  purplePastel: "#C9B6FF",
  purple: "#6A3DF0",

  // --- PINK / PURPLE SOFT ---
  pinkPastel: "#F6C1FF",
  pink: "#C13DF2",

  // --- MINT ---
  mintPastel: "#B8F2E6",
  mint: "#00BFA6",

}


/* Colors - Refactored for Theme support */
export const lightTheme = {

  headerSection: baseColor.main200,
  textGreenButton: baseColor.main900,

  // --- nền ---
  background: baseColor.neutral0,
  backgroundSubtle: baseColor.neutral50,
  surface: baseColor.white,
  backgroundOverlay: baseColor.neutral950,

  // --- Chữ & Icon (Content) ---
  textPrimary: baseColor.neutral900,          // thay cho `text`
  textSecondary: baseColor.neutral500,        // thay cho `optionDescSelected`
  textInverse: baseColor.neutral0,            // thay cho `whiteText`, chữ trắng trên nền tối
  textBrand: baseColor.main900,

  // --- Đường viền (Borders) ---
  borderDefault: baseColor.neutral100,        // thay cho `stroke`, `displayOptionBorder`
  borderActive: baseColor.main500,

  //màu thương hiệu
  primary: baseColor.main,
  primaryLight: baseColor.main50,

  main75: "#E8F7C0",
  main100: '#DFF5A0',
  main200: "#C8ED6A",

  main400: "#90CC18",
  main500: '#6EAA00',
  main700: '#4E7A00',
  main900: '#2F4D00',

  brown50: "#FDF7F0",
  brown200: "#D4B896",
  brown500: "#7A5530",
  brown800: "#4A3218",

  blue50: '#E0F2FF',
  blue200: '#A8DAFF',
  blue400: '#60B8F8',
  blue600: '#2896E0',

  orange50: '#FFF0E0',
  orange100: '#FFD0A0',
  orange300: '#FFAB58',
  orange500: '#F07C18',
  orange700: '#B05200',


  neutral800: "#222D17",
  neutral900: "#141C0C",
  neutral950: "#0A1006",

  borderSkillCard: baseColor.blue200,

  accent1: baseColor.blue600,

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

  success: baseColor.main500,
  successBackground: baseColor.main50,

  error: baseColor.redDark,                    // thay cho `textRedError`, `safetyIcon`
  errorBackground: baseColor.coralPastel,

  warning: baseColor.sand600,               // thay cho `industryTitle`, `starIconExcellent`
  warningBackground: baseColor.sand50,


  fireIcon: baseColor.red,
  trophyIcon: baseColor.orange500, // Màu cam/vàng cho thẻ cúp điểm

  shadow: '#000000',


  dragHandleBg: baseColor.neutral100,

  sunIconColor: '#8CED82',
  moonIconColor: '#202124',

  avatarFrameSelectedBorder: '#2F7A4D',

  borderAvatar: baseColor.main900,

  picVocabText: baseColor.main900,
  factoryIcon: baseColor.orange500,
  optionDescSelected: baseColor.neutral500,
  badgePurpleBg: baseColor.purplePastel,
  badgePurpleText: baseColor.purple,

  safetyIcon: baseColor.red,
  safetyTitle: baseColor.redDark,
  safetySubtitle: baseColor.redDark,
  industryTitle: baseColor.orange500,
  industrySubtitle: baseColor.orange700,
  historyRedBg: baseColor.coral,
  historyOrangeBg: baseColor.orange500,
  historyYellowBg: baseColor.sand400,
  historySelectedBg: baseColor.neutral100,

  starIconExcellent: baseColor.sand400,

  chipActiveBg: baseColor.neutral900, // Trùng với màu text ở Light Mode
  chipActiveText: baseColor.neutral0, // Trùng với màu bg ở Light Mode


  feedbackCorrectBorder: baseColor.main50,
  feedbackIncorrectBorder: baseColor.coralPastel,

  bgLevel: baseColor.sand400,
};

export const darkTheme = {
  headerSection: '#C8ED6A',
  textGreenButton: baseColor.main900,

  // --- nền ---
  background: '#0D0D0D',
  backgroundSubtle: '#161616',
  surface: '#212121',
  backgroundOverlay: baseColor.neutral950,

  // --- Chữ & Icon (Content) ---
  textPrimary: baseColor.main50,          // thay cho `text`
  textSecondary: baseColor.neutral300,        // thay cho `optionDescSelected`
  textInverse: baseColor.neutral0,            // thay cho `whiteText`, chữ trắng trên nền tối
  textBrand: baseColor.main900,

  // --- Đường viền (Borders) ---
  borderDefault: '#303030',        // thay cho `stroke`, `displayOptionBorder`
  borderActive: baseColor.main300,

  //màu thương hiệu
  primary: baseColor.main,
  primaryLight: baseColor.main50,

  main75: "#E8F7C0",
  main100: '#DFF5A0',
  main200: "#C8ED6A",

  main400: "#90CC18",
  main500: '#6EAA00',
  main700: '#4E7A00',
  main900: '#2F4D00',

  brown50: "#FDF7F0",
  brown200: "#D4B896",
  brown500: "#7A5530",
  brown800: "#4A3218",

  blue50: '#E0F2FF',
  blue200: '#A8DAFF',
  blue400: '#60B8F8',
  blue600: '#2896E0',

  orange50: '#FFF0E0',
  orange100: '#FFD0A0',
  orange300: '#FFAB58',
  orange500: '#F07C18',
  orange700: '#FFAB58',


  neutral800: "#222D17",
  neutral900: "#141C0C",
  neutral950: "#0A1006",

  borderSkillCard: baseColor.blue200,

  accent1: baseColor.blue600,

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

  success: baseColor.main500,
  successBackground: baseColor.main50,

  error: baseColor.redDark,                    // thay cho `textRedError`, `safetyIcon`
  errorBackground: baseColor.coralPastel,

  warning: baseColor.sand600,               // thay cho `industryTitle`, `starIconExcellent`
  warningBackground: baseColor.sand50,


  fireIcon: baseColor.red,
  trophyIcon: baseColor.orange500, // Màu cam/vàng cho thẻ cúp điểm

  shadow: '#000000',


  dragHandleBg: baseColor.neutral100,

  sunIconColor: '#8CED82',
  moonIconColor: '#202124',

  avatarFrameSelectedBorder: '#2F7A4D',

  borderAvatar: baseColor.main900,

  picVocabText: baseColor.main900,
  factoryIcon: baseColor.orange500,
  optionDescSelected: baseColor.neutral500,
  badgePurpleBg: baseColor.purplePastel,
  badgePurpleText: baseColor.purple,

  safetyIcon: baseColor.red,
  safetyTitle: baseColor.redDark,
  safetySubtitle: baseColor.redDark,
  industryTitle: baseColor.orange500,
  industrySubtitle: baseColor.orange700,
  historyRedBg: baseColor.coral,
  historyOrangeBg: baseColor.orange500,
  historyYellowBg: baseColor.sand400,
  historySelectedBg: baseColor.neutral100,

  starIconExcellent: baseColor.sand400,

  chipActiveBg: baseColor.main, // Trùng với màu text ở Light Mode
  chipActiveText: baseColor.neutral900, // Trùng với màu bg ở Light Mode


  feedbackCorrectBorder: baseColor.main50,
  feedbackIncorrectBorder: baseColor.coralPastel,

  bgLevel: baseColor.sand600,
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

export const Stroke = {
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
