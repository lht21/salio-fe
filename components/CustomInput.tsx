import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Border, Color, FontFamily, FontSize, Padding } from '../constants/GlobalStyles';

interface CustomInputProps extends TextInputProps { }

export const CustomInput = ({ style, ...props }: CustomInputProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Color.gray}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
    backgroundColor: Color.stroke,
    borderWidth: 1,
    borderColor: Color.stroke,
    borderRadius: Border.br_15,
    paddingHorizontal: Padding.padding_15,
    paddingVertical: Padding.padding_15, // Dùng padding 15 cho ô input được cao và thoáng
  },
});