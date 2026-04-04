import * as React from "react";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RadialGradient from "../../components/RadialGradient";
import SocialButton from "../../components/SocialButton";
import LoginForm from "../../components/LoginForm";
import { Gap, Color } from "../../constants/GlobalStyles";

const SignIn = () => {
  

  return (
    <RadialGradient
      style={[styles.signIn, styles.signInLayout]}
      locations={[0, 0.6]}
      colors={["#d7ffb4", Color.main]}
      cx={"92.44%"}
      cy={"-2.43%"}
      rx={"77.68%"}
      ry={"101.37%"}
    >
      <KeyboardAwareScrollView
        style={[styles.keyboardawarescrollview, styles.signInLayout]}
        contentContainerStyle={styles.signInScrollViewContent}
      >
        <View style={[styles.headerParent, styles.logoFlexBox]}>
          <View style={[styles.header, styles.headerFlexBox]}>
            <Image
              style={styles.layer11Icon}
              contentFit="cover"
              source={require("../assets/Layer-1-1.png")}
            />
          </View>
          <LinearGradient
            style={[styles.logo, styles.logoFlexBox]}
            locations={[0, 1]}
            colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]}
          >
            <View style={[styles.socialMediaIcons, styles.headerFlexBox]}>
                <SocialButton
                    social="google"
                />
                <SocialButton
                    social="apple"
                    
                />
                <SocialButton
                    social="facebook"
                   
                />
            </View>
            <View style={styles.divider} />
            <LoginForm />
          </LinearGradient>
        </View>
      </KeyboardAwareScrollView>
    </RadialGradient>
  );
};

const styles = StyleSheet.create({
  signInScrollViewContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 844,
    flex: 1,
  },
  signInLayout: {
    maxWidth: "100%",
    width: "100%",
    backgroundColor: "transparent",
    flex: 1,
  },
  logoFlexBox: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  headerFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  signIn: {
    backgroundColor: "transparent",
  },
  keyboardawarescrollview: {
    backgroundColor: "transparent",
  },
  headerParent: {
    justifyContent: "space-between",
    gap: Gap.gap_20,
    flex: 1,
  },
  header: {
    flex: 1,
  },
  layer11Icon: {
    width: 163,
    height: 74,
  },
  logo: {
    height: 527,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 30,
    gap: 31,
    backgroundColor: "transparent",
  },
  socialMediaIcons: {
    flexDirection: "row",
    gap: 29,
  },
  divider: {
    width: 76,
    height: 3,
    borderStyle: "solid",
    borderColor: Color.colorSlategray,
    borderTopWidth: 3,
  },
});

export default SignIn;
