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

}
  

/* Colors - Refactored for Theme support */
export const lightTheme = {

  headerSection: baseColor.main200,
  textGreen: baseColor.main900,
  bgFlashCardSet: '#FAFEF5',
  // --- BASE ---
  bg: "#FAFEF5",
  bg2: "#F6FBF5",
  text: "#141C0C",
  stroke: "#E2E8F0",
  gray: "#4C5C40",

  // --- new colors ---
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

  
  // --- BLUE ---
  mainLighter: "rgba(152, 242, 145, 0.10)",
  main2: "#6FAE6C",
  green: "#059669",
  greenLight: "#ECFFEB",

  
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

  fireIcon: '#991B1B',   // Màu đỏ tối cho thẻ chuỗi ngày
  trophyIcon: '#D97706', // Màu cam/vàng cho thẻ cúp điểm
  monthBlockBorder: 'rgba(80, 141, 78, 0.22)', // Viền lịch chuỗi ngày

  upgradeBannerGradientStart: '#1E293B',
  upgradeBannerGradientEnd: '#0F172A',
  upgradeBannerIconBg: 'rgba(255, 255, 255, 0.1)',
  upgradeBannerDesc: '#CBD5E1',
  upgradeBannerActionText: '#0F172A',
  modalOverlayBg: 'rgba(0, 0, 0, 0.5)',
  shadow: '#000000',

  btnGreenBorder: '#3AB878',
  btnOrangeBorder: '#BB5D11',
  btnGreenBoldBg: '#A3E88A',
  btnGreenBoldText: '#000000',
  whiteText: '#FFFFFF',

  dragHandleBg: '#CBD5E1',
  optionCardBorder: '#C9D7E8',
  optionCardActiveBorder: '#D8E3F2',
  activeAccentBg: '#0B663B',
  sunIconColor: '#8CED82',
  moonIconColor: '#202124',
  displayOptionBorder: '#EDF0F5',
  displayOptionShadow: '#0C5F35',
  appliedBadgeBg: '#C9D3E3',
  gridCardBorder: '#7F8B99',
  avatarFrameBorder: '#658067',
  avatarFrameSelectedBorder: '#2F7A4D',

  borderAvatar: '#0C5F35',
  picVocabBg: '#DCFCE7',
  picVocabText: '#16A34A',
  factoryIcon: '#B45309',
  optionDescSelected: '#D1D5DB',

  badgePurpleBg: '#E9D5FF',
  badgePurpleText: '#7E22CE',
  safetyIcon: '#DC2626',
  safetyTitle: '#B91C1C',
  safetySubtitle: '#EF4444',
  industryTitle: '#B45309',
  industrySubtitle: '#D97706',
  historyRedBg: '#FEF2F2',
  historyRedText: '#EF4444',
  historyOrangeBg: '#D97706',
  historyOrangeText: '#FFFFFF',
  historyYellowBg: '#FEF08A',
  historyYellowText: '#B45309',
  historySelectedBg: '#F0FDF4',
  cardGreenBg: '#CEF9B4',
  starIconExcellent: '#D97706',
  searchKeywordBg: '#D5DCE6',
  chipActiveBg: '#1E1E1E', // Trùng với màu text ở Light Mode
  chipActiveText: '#FFFFFF', // Trùng với màu bg ở Light Mode

  textDarkGreen: '#064E3B',
  blackActionBg: '#0F172A',
  blackActionText: '#FFFFFF',
  addBtnBg: '#22C55E',
  toastBg: '#1E293B',
  toastText: '#FFFFFF',
  whiteActionBg: '#FFFFFF',
  whiteActionText: '#0F172A',

  textGreenSuccess: '#15803D',
  textRedError: '#B91C1C',
  badgeYellowBg: '#FDE68A',
  badgeYellowText: '#92400E',
  bgLightBlue: '#F8FAFC',
  aiButtonBg: '#A855F7',
  aiButtonDisabledBg: '#D8B4FE',
  feedbackCorrectBorder: '#BBF7D0',
  feedbackIncorrectBorder: '#FECACA',
};

export const darkTheme = {
  headerSection: '#303030',
  textGreen: baseColor.main900,
  bgFlashCardSet: '#212121',
  // --- BASE ---
  bg: "#0D0D0D",
  bg2: "#1C2C0E",
  text: "#F2FCD0",
  stroke: "#616161",
  gray: "#7A9068",

  main50: "#F2FCD0",
  main75: "#E8F7C0",
  main100: '#DFF5A0',
  main200: "#C8ED6A",
  main300: '#AEDD40',
  main400: "#90CC18",
  main500: '#6EAA00',
  main700: '#4E7A00',
  main900: '#2F4D00',

  brown50: "#2E2408",
  brown200: "#F5D87A",
  brown500: "#E8C030",
  brown800: "#4A3218",

  blue50: '#0D2D4A',
  blue200: '#A8DAFF',
  blue400: '#60B8F8',
  blue600: '#2896E0',

  orange50: '#2E1400',
  orange100: '#FFD0A0',
  orange300: '#FFAB58',
  orange500: '#F07C18',
  orange700: '#B05200',

  neutral0: "#FAFEF5",
  neutral50: "#F1F6EA",
  neutral100: "#DDE8D0",
  neutral200: "#C8D2BC",
  neutral300: "#B0C0A0",
  neutral400: "#879678",
  neutral500: "#7A9068",
  neutral600: "#4A5C3A",
  neutral700: "#3A4A2C",
  neutral800: "#2A3820",
  neutral900: "#1C2A14",
  neutral950: "#141F08",
  neutral1000: "#0A1006",

  // --- GREEN ---
  main: "#AEDD40", 
  mainLighter: "rgba(174, 221, 64, 0.20)",
  main2: "#C8ED6A",
  green: "#AEDD40",
  greenLight: "#4E7A00",

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
  color: baseColor.main300,
  bgTest: "#121212",
  colorBlack: "#FFFFFF",

  fireIcon: '#FFAB58',   // Đổi sang đỏ sáng trong dark mode
  trophyIcon: '#F5D87A', // Đổi sang vàng sáng hơn trong dark mode
  monthBlockBorder: 'rgba(80, 141, 78, 0.40)', // Viền lịch chuỗi ngày sáng hơn trong dark mode

  upgradeBannerGradientStart: '#0F172A',
  upgradeBannerGradientEnd: '#000000',
  upgradeBannerIconBg: 'rgba(255, 255, 255, 0.05)',
  upgradeBannerDesc: '#94A3B8',
  upgradeBannerActionText: '#0F172A',
  modalOverlayBg: 'rgba(0, 0, 0, 0.7)',
  shadow: '#000000',

  btnGreenBorder: '#22C55E',
  btnOrangeBorder: '#C2410C',
  btnGreenBoldBg: '#14532D',
  btnGreenBoldText: '#FFFFFF',
  whiteText: '#FFFFFF',

  dragHandleBg: '#475569',
  optionCardBorder: '#334155',
  optionCardActiveBorder: '#475569',
  activeAccentBg: '#22C55E',
  sunIconColor: '#8CED82',
  moonIconColor: '#E2E8F0',
  displayOptionBorder: '#334155',
  displayOptionShadow: '#000000',
  appliedBadgeBg: '#334155',
  gridCardBorder: '#475569',
  avatarFrameBorder: '#475569',
  avatarFrameSelectedBorder: '#22C55E',

  borderAvatar: '#98F291',
  picVocabBg: '#052E16',
  picVocabText: '#4ADE80',
  factoryIcon: '#D97706',
  optionDescSelected: '#9CA3AF',

  badgePurpleBg: '#4C1D95',
  badgePurpleText: '#DDD6FE',
  safetyIcon: '#EF4444',
  safetyTitle: '#FCA5A5',
  safetySubtitle: '#F87171',
  industryTitle: '#FBBF24',
  industrySubtitle: '#FCD34D',
  historyRedBg: '#450A0A',
  historyRedText: '#FCA5A5',
  historyOrangeBg: '#9A3412',
  historyOrangeText: '#FFFFFF',
  historyYellowBg: '#451A03',
  historyYellowText: '#FDE047',
  historySelectedBg: '#064E3B',
  cardGreenBg: '#14532D',
  starIconExcellent: '#FBBF24',
  searchKeywordBg: '#334155',
  chipActiveBg: lightTheme.main, // Trùng với màu main ở Dark Mode
  chipActiveText: '#121212', // Trùng với màu bg ở Dark Mode

  textDarkGreen: '#A7F3D0',
  blackActionBg: '#F8FAFC',
  blackActionText: '#0F172A',
  addBtnBg: '#15803D',
  toastBg: '#0F172A',
  toastText: '#F8FAFC',
  whiteActionBg: '#1E293B',
  whiteActionText: '#F8FAFC',

  textGreenSuccess: '#4ADE80',
  textRedError: '#FCA5A5',
  badgeYellowBg: '#78350F',
  badgeYellowText: '#FDE68A',
  bgLightBlue: '#1E293B',
  aiButtonBg: '#9333EA',
  aiButtonDisabledBg: '#6B21A8',
  feedbackCorrectBorder: '#14532D',
  feedbackIncorrectBorder: '#7F1D1D',
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
