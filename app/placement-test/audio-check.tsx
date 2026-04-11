import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SpeakerHigh, Warning } from "phosphor-react-native";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/Button";
import { Color, FontFamily } from "../../constants/GlobalStyles";

const { width } = Dimensions.get("window");

export default function AudioCheckScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#CEF9B4", Color.main || "#98F291"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Top Cards Section */}
          <View style={styles.cardsRow}>
            {/* Left Card */}
            <View style={[styles.sideCard, styles.cardLeft]}>
              <SpeakerHigh
                size={40}
                color={Color.text || "#1E1E1E"}
                weight="fill"
              />
            </View>

            {/* Middle Card - Knight Mascot */}
            <View style={styles.middleCard}>
              <Image
                source={require("../../assets/images/tubo/sc1_b2.png")}
                style={styles.mascotImage}
                contentFit="contain"
              />
            </View>

            {/* Right Card */}
            <View style={[styles.sideCard, styles.cardRight]}>
              <SpeakerHigh
                size={40}
                color={Color.text || "#1E1E1E"}
                weight="fill"
              />
            </View>
          </View>

          {/* Alert Banner */}
          <View style={styles.alertBanner}>
            <Warning size={40} color={Color.cam || "#FF6B00"} weight="fill" />
            <View style={styles.alertTextWrapper}>
              <Text style={styles.alertTitle}>Cảnh báo</Text>
              <Text style={styles.alertSubtitle}>Kẻ địch đang đến gần!</Text>
            </View>
          </View>

          <View style={{ flex: 1 }} />

          {/* Question Text */}
          <Text style={styles.questionText}>
            Bạn có nghe rõ tiếng gầm của quái vật không?
          </Text>

          {/* Buttons Group */}
          <View style={styles.buttonGroup}>
            <Button
              title="Tôi nghe rõ, Chiến thôi!"
              variant="Green"
              onPress={() => router.push("/placement-test/exam")}
              style={styles.primaryButton}
              textStyle={styles.primaryButtonText}
            />

            <Button
              title="Nghe lại"
              variant="Outline"
              onPress={() => {}}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: "center"
  },
  cardsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: -20, // Negative gap to slightly overlap or just be very close
    marginBottom: 40
  },
  sideCard: {
    width: 90,
    height: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E6F4FF",
    zIndex: 1
  },
  cardLeft: {
    transform: [{ rotate: "-10deg" }]
  },
  cardRight: {
    transform: [{ rotate: "10deg" }]
  },
  middleCard: {
    width: 130,
    height: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#E6F4FF",
    zIndex: 2,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  mascotImage: {
    width: 100,
    height: 100
  },
  alertBanner: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 35,
    borderWidth: 2.5,
    borderColor: "#000000",
    width: "100%",
    gap: 15
  },
  alertTextWrapper: {
    flex: 1
  },
  alertTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 18,
    color: Color.cam || "#FF6B00"
  },
  alertSubtitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 14,
    color: "#000000"
  },
  questionText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 16,
    color: Color.text || "#1E1E1E",
    textAlign: "center",
    marginBottom: 30
  },
  buttonGroup: {
    width: "100%",
    gap: 5
  },
  baseButton: {
    width: "100%",
    height: 56,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  primaryButton: {
    backgroundColor: Color.cam || "#FF6B00"
  },
  primaryButtonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 14,
    color: "#FFFFFF"
  },
  buttonIcon: {
    marginLeft: 10
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: Color.cam || "#FF6B00"
  },
  secondaryButtonText: {
    color: Color.cam || "#FF6B00"
  }
});
