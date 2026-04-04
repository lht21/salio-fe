import * as React from "react";
import { Text, StyleSheet, TextInput, View, Pressable } from "react-native";
import Button from "../components/Button";
import {
  FontSize,
  Height,
  Gap,
  FontFamily,
  Color,
  Border,
  Padding,
} from "../constants/GlobalStyles";

const LoginForm = () => {
  return (
    <View style={styles.loginForm}>
      <View style={styles.credentials}>
        <Text style={styles.ngK}>Đăng nhập</Text>
        <View style={styles.passwordArea}>
          <TextInput
            style={[styles.textfiled, styles.textfiledFlexBox]}
            placeholder="Email"
            multiline={false}
            placeholderTextColor="#64748b"
          />
          <TextInput
            style={[styles.textfiled, styles.textfiledFlexBox]}
            placeholder="Mật khẩu"
            multiline={false}
            placeholderTextColor="#64748b"
          />
        </View>
      </View>
      <View style={[styles.registration, styles.textfiledFlexBox]}>
        <Pressable onPress={() => {}}>
          <Text style={[styles.ngK3, styles.ngK3Typo]}>Đăng ký</Text>
        </Pressable>
        <Button 
            variant="Green" 
            title="Đăng nhập" 
        />
      </View>
      <Pressable
        style={[styles.forgotPassword, styles.textfiledFlexBox]}
        onPress={() => {}}
      >
        <Text style={[styles.qunMtKhu, styles.ngK3Typo]}>Quên mật khẩu?</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  textfiledFlexBox: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  ngK3Typo: {
    fontSize: FontSize.fs_12,
    height: Height.height_15,
    textAlign: "left",
  },
  loginForm: {
    alignItems: "flex-end",
    gap: Gap.gap_18,
    alignSelf: "stretch",
  },
  credentials: {
    gap: Gap.gap_22,
    alignSelf: "stretch",
  },
  ngK: {
    fontSize: FontSize.fs_24,
    fontWeight: "600",
    fontFamily: FontFamily.lexendDecaSemiBold,
    textAlign: "left",
    color: Color.color,
    alignSelf: "stretch",
  },
  passwordArea: {
    gap: 17,
    alignSelf: "stretch",
  },
  textfiled: {
    height: 49,
    borderRadius: Border.br_15,
    backgroundColor: Color.colorLightslategray,
    paddingHorizontal: Padding.padding_15,
    paddingVertical: Padding.padding_11,
    width: "100%",
    fontSize: FontSize.fs_14,
    fontFamily: FontFamily.lexendDecaRegular,
    textAlign: "left",
  },
  registration: {
    justifyContent: "space-between",
    gap: Gap.gap_20,
  },
  ngK3: {
    width: 53,
    fontWeight: "500",
    fontFamily: FontFamily.lexendDecaMedium,
    color: Color.colorOrangered,
  },
  forgotPassword: {
    borderRadius: Border.br_10,
    backgroundColor: Color.colorHoneydew,
    justifyContent: "center",
    padding: Padding.padding_10,
  },
  qunMtKhu: {
    width: 99,
    fontFamily: FontFamily.lexendDecaRegular,
    color: Color.color,
  },
});

export default LoginForm;
