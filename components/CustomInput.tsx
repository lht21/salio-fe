import React, { useState, useEffect } from 'react';
import { TextInput, TextInputProps, StyleSheet, View, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { FontFamily, FontSize, Padding, Border, Gap } from '../constants/GlobalStyles';
import { EyeIcon, EyeSlashIcon } from 'phosphor-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring, 
  withSequence, 
  interpolateColor 
} from 'react-native-reanimated';
import { useTheme } from "@/contexts/ThemeContext";

interface CustomInputProps extends Omit<TextInputProps, 'style'> {
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export const CustomInput = ({ style, inputStyle, onFocus, onBlur, leftIcon, isPassword, ...props }: CustomInputProps) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(isPassword);

  const hasValue = props.value !== undefined && props.value !== null && props.value.toString().length > 0;

  const focusAnim = useSharedValue(hasValue ? 1 : 0);
  const scaleAnim = useSharedValue(1);

  useEffect(() => {
    if (isFocused || hasValue) {
      focusAnim.value = withTiming(1, { duration: 300 });
    } else {
      focusAnim.value = withTiming(0, { duration: 300 });
    }
  }, [isFocused, hasValue]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    // Hiệu ứng nảy (bounce) nhẹ khi focus
    scaleAnim.value = withSequence(
      withTiming(0.98, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Nội suy màu sắc mượt mà dựa theo giá trị của focusAnim
  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      focusAnim.value,
      [0, 1],
      [colors.stroke || '#F1F5F9', colors.bg || '#FFFFFF']
    );
    const borderColor = interpolateColor(
      focusAnim.value,
      [0, 1],
      [colors.stroke || '#F1F5F9', colors.main || '#98F291']
    );

    return {
      backgroundColor,
      borderColor,
      transform: [{ scale: scaleAnim.value }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        animatedContainerStyle,
        style 
      ]}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor={colors.gray}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={isPassword ? isSecure : props.secureTextEntry}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity
          style={styles.rightIcon}
          onPress={() => setIsSecure(!isSecure)}
          activeOpacity={0.7}
        >
          {isSecure ? <EyeSlashIcon size={20} color={colors.gray} /> : <EyeIcon size={20} color={colors.gray} />}
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
      container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5, 
        borderRadius: Border.br_20 || 20, // Tăng bo góc cho cảm giác mềm mại hơn
        paddingHorizontal: Padding.padding_15 || 15,
      },

      leftIcon: {
        marginRight: Gap.gap_10 || 8,
      },

      rightIcon: {
        marginLeft: Gap.gap_10 || 8,
      },

      input: {
        flex: 1,
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_14 || 14,
        color: colors.text || '#1E1E1E',
        paddingVertical: Padding.padding_15 || 15, 
      },
    });