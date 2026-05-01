import React, { useState } from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import { Color, FontFamily, FontSize, Padding, Border } from '../constants/GlobalStyles';

interface CustomInputProps extends TextInputProps { }

export const CustomInput = ({ style, onFocus, onBlur, ...props }: CustomInputProps) => {
  // State theo dõi trạng thái focus của input
  const [isFocused, setIsFocused] = useState(false);

  // Xử lý khi nhấn vào ô input
  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e); // Gọi hàm onFocus từ props truyền vào (nếu có)
  };

  // Xử lý khi bấm ra ngoài (bỏ focus)
  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e); // Gọi hàm onBlur từ props truyền vào (nếu có)
  };

  // Kiểm tra xem input đã có dữ liệu hay chưa
  const hasValue = props.value !== undefined && props.value !== null && props.value.toString().length > 0;

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          (isFocused || hasValue) && styles.inputFocused, // Giữ style focus khi đang focus HOẶC đã có dữ liệu
          style // Ghi đè style từ props ở cuối cùng
        ]}
        placeholderTextColor={Color.gray}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  
  // Trạng thái bình thường (Không focus)
  input: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
    backgroundColor: Color.stroke, // Nền xám
    borderWidth: 1.5, // Tăng lên 1.5 để viền rõ nét hơn khi focus
    borderColor: Color.stroke,     // Viền xám chìm vào nền
    borderRadius: Border.br_15,
    paddingHorizontal: Padding.padding_15,
    paddingVertical: Padding.padding_15, // Dùng padding 15 cho ô input được cao và thoáng
  },

  // Trạng thái khi được Focus
  inputFocused: {
    backgroundColor: Color.bg, // Nền trắng
    borderColor: Color.main,   // Viền xanh lá cây
  },
});