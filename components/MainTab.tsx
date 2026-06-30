import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { FontFamily, FontSize, Border } from '../constants/GlobalStyles';
import { useTheme } from '../contexts/ThemeContext';
import { MotiView } from 'moti';

interface MainTabProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: React.ReactNode; // Prop nhận vào các icon bạn vừa tạo
  activeBgColor?: string;
  activeTextColor?: string;
  activeBorderColor?: string;
  style?: ViewStyle;
}

const MainTab = ({ 
  label, 
  isActive, 
  onPress, 
  icon,
  activeBgColor, 
  activeTextColor, 
  activeBorderColor,
  style
}: MainTabProps) => {

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Áp dụng các màu mặc định theo yêu cầu (kèm màu fallback nếu Theme không có)
  const resolvedActiveBgColor =  colors.main400 || '#3AB878';
  const resolvedActiveTextColor =  colors.main50 || '#F0FFF0';
  const resolvedInactiveBgColor = colors.main75 || '#E6FFD1';
  const resolvedInactiveTextColor = colors.main400 || '#3AB878';

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Phần background & label cơ bản giống CategoryChip */}
      <View style={[
        styles.tab, 
        isActive 
          ? { backgroundColor: resolvedActiveBgColor, borderColor: activeBorderColor || resolvedActiveBgColor } 
          : { backgroundColor: resolvedInactiveBgColor, borderColor: 'transparent' },
      ]}>
        {/* Phần Icon nằm bên trái và to hơn một chút */}
        {isActive && icon && (
          <MotiView 
            from={{ opacity: 0, scale: 0.8, translateY: 30 }}
            animate={{ opacity: 1, scale: 1.4, translateY: 0 }}
            transition={{ type: 'spring', damping: 14, stiffness: 200 } as any}
            style={styles.iconWrapper}
          >
            {icon}
          </MotiView>
        )}
        
        <Text style={[
          styles.tabText, 
          isActive ? { color: resolvedActiveTextColor } : { color: resolvedInactiveTextColor },
        ]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: Border.br_20 || 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  tabText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14 || 14,
  },
  iconWrapper: {
    position: 'absolute',
    left: 10, // Dịch icon qua trái
    top: -15, // Đẩy icon nổi lên trên khỏi khung tab
    zIndex: 10,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainTab;