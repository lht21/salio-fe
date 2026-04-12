import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../../components/Button";
import { Color, FontFamily } from "../../constants/GlobalStyles";

const { width } = Dimensions.get("window");

export default function PlacementTestResult() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#ADFF66", "#8AFF81", "#FFFFFF"]}
      locations={[0, 0.0535, 0.1825]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.content}>
          {/* Mascot Section */}
          <View style={styles.mascotContainer}>
            <Image
              source={require("../../assets/images/horani/result-levelup.png")}
              style={styles.mascotImage}
              contentFit="contain"
            />
          </View>

          {/* Rank Section */}
          <View style={styles.rankSection}>
            <Text style={styles.rankLabel}>Cấp bậc</Text>
            <Text style={styles.rankValue}>Trung cấp</Text>
          </View>

          {/* Score Capsule */}
          <View style={styles.scoreCapsule}>
            <Text style={styles.scoreText}>Đúng 7/10</Text>
          </View>

          <View style={{ flex: 1 }} />

          {/* Bottom Card */}
          <View style={styles.bottomCard}>
            <Text style={styles.congratsText}>
              Chúc mừng bạn đã hoàn thành thử thách!{"\n"}
              Hãy tiếp tục chinh phục những nhiệm vụ khó hơn nhé!
            </Text>

            <Button
              variant="Orange"
              title="Xem kết quả bài học được bỏ qua"
              onPress={() => router.push("/placement-test/skipped-lessons")}
              style={styles.actionButton}
              textStyle={styles.actionButtonText}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 35
  },
  safeArea: {
    flex: 1
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60
  },
  mascotContainer: {
    marginBottom: 40
  },
  mascotHalo: {
    width: 180,
    height: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#E6F4FF",
    // Halo shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8
  },
  mascotImage: {
    width: 180,
    height: 180
  },
  rankSection: {
    alignItems: "center",
    marginBottom: 20
  },
  rankLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 17,
    fontWeight: "700",

    color: Color.text || "#1E1E1E",
    marginBottom: 10
  },
  rankValue: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 32,
    fontWeight: "600",
    color: Color.main2 || "#3C8137" // Intermediate green
  },
  scoreCapsule: {
    backgroundColor: Color.mainLighter,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  },
  scoreText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 14,
    fontWeight: "700",
    color: Color.text || "#1E1E1E"
  },
  bottomCard: {
    width: width,
    backgroundColor: "#98F291", // Light green base
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center"
  },
  congratsText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 14,
    color: Color.text || "#1E1E1E",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40
  },
  actionButton: {
    backgroundColor: Color.vang || "#F9F871",
    width: "100%",
    height: 60,
    borderRadius: 30,
    marginVertical: 0,

    elevation: 3
  },
  actionButtonText: {
    color: Color.text || "#1E1E1E"
  }
});
