import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SpeakerHigh, Warning } from "phosphor-react-native";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native"; // Thêm ScrollView
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
        {/* Bọc toàn bộ nội dung trong ScrollView */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Top Cards Section */}
            <View style={styles.cardsRow}>
              <View style={[styles.sideCard, styles.cardLeft]}>
                <SpeakerHigh
                  size={40}
                  color={Color.text || "#1E1E1E"}
                  weight="fill"
                />
              </View>

              <View style={styles.middleCard}>
                <Image
                  source={require("../../assets/images/tubo/sc1_b2.png")}
                  style={styles.mascotImage}
                  contentFit="contain"
                />
              </View>

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

            {/* Spacer để đẩy các nút xuống dưới trên màn hình lớn */}
            <View style={{ height: 40 }} />

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
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1, // Đảm bảo nội dung có thể giãn ra để căn giữa
    justifyContent: "center" // Căn giữa nội dung theo chiều dọc nếu màn hình dài
  },
  content: {
    paddingHorizontal: 25,
    paddingTop: 40, // Giảm bớt paddingTop nếu đã có ScrollView
    paddingBottom: 40,
    alignItems: "center"
  },
  // ... Giữ nguyên các styles còn lại của bạn ...
  cardsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: -20,
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
    gap: 12
  },
  primaryButton: {
    backgroundColor: Color.cam || "#FF6B00",
    width: "100%",
    height: 56,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryButtonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 14,
    color: "#FFFFFF"
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: Color.cam || "#FF6B00",
    width: "100%",
    height: 56,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryButtonText: {
    color: Color.cam || "#FF6B00"
  }
});
