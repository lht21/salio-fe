import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../../components/Button";
import { Color, FontFamily } from "../../constants/GlobalStyles";

const { width } = Dimensions.get("window");

// Mock data for the starting point
const STARTING_POINT_DATA = {
  label: "Bắt đầu học từ",
  lessonTitle: "Bài 1",
  rank: "Trung cấp 3",
  congratsMessage: "Chuẩn bị tinh thần và học ngay nhé!",
  buttonTitle: "Bắt đầu học"
};

export default function SkippedLessonsScreen() {
  const router = useRouter();

  const handleStartLearning = () => {
    // Navigate to home/tabs to start learning
    router.replace("/(tabs)");
  };

  return (
    <LinearGradient
      colors={["#ADFF66", "#8AFF81", "#FFFFFF"]}
      locations={[0, 0.0535, 0.1825]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.startLabel}>{STARTING_POINT_DATA.label}</Text>
            <Text style={styles.lessonTitle}>
              {STARTING_POINT_DATA.lessonTitle}
            </Text>
          </View>

          {/* Rank Capsule */}
          <View style={styles.rankCapsule}>
            <Text style={styles.rankText}>{STARTING_POINT_DATA.rank}</Text>
          </View>

          <View style={{ flex: 1 }} />

          {/* Bottom Card */}
          <View style={styles.bottomCard}>
            <Text style={styles.instructionText}>
              {STARTING_POINT_DATA.congratsMessage}
            </Text>

            <Button
              variant="Orange" // Overridden style for yellow button
              title={STARTING_POINT_DATA.buttonTitle}
              onPress={handleStartLearning}
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
    paddingTop: 100
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 30
  },
  startLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 17,
    color: Color.text || "#1E1E1E",
    marginBottom: 15
  },
  lessonTitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 32,
    color: Color.main2 || "#3C8137" // Intermediate green
  },
  rankCapsule: {
    backgroundColor: Color.mainLighter || "rgba(236, 255, 235, 0.8)",
    paddingVertical: 18,
    width: "100%",

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15
  },
  rankText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 14,
    color: Color.text || "#1E1E1E"
  },
  bottomCard: {
    width: width,
    backgroundColor: "#98F291",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 35,
    paddingTop: 80,
    paddingBottom: 50,
    alignItems: "center"
  },
  instructionText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 14,
    color: Color.text || "#1E1E1E",
    textAlign: "center",
    marginBottom: 50
  },
  actionButton: {
    backgroundColor: Color.vang || "#F9F871",
    width: "100%",
    height: 62,
    borderRadius: 31,
    marginVertical: 0
  },
  actionButtonText: {
    color: Color.text || "#1E1E1E",
    fontWeight: "500"
  }
});
