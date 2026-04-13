import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { House } from "phosphor-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Border,
  Color,
  FontFamily,
  FontSize,
  Padding,
} from "../../../../constants/GlobalStyles";

export default function MockExamResult() {
  const router = useRouter();
  const { examId } = useLocalSearchParams();

  return (
    <LinearGradient
      colors={["#A9F6A2", "#FFFFFF", "#FFFFFF", "#9AF09B"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.centerContent}>
            <Image
              source={require("../../../../assets/images/horani/result-levelup.png")}
              style={styles.mascot}
              contentFit="contain"
            />

            <Text style={styles.levelLabel}>Cấp bậc</Text>
            <Text style={styles.levelValue}>TOPIK 3</Text>

            <View style={styles.scoreRow}>
              <View style={styles.scoreCard}>
                <Text style={styles.scoreTitle}>읽기</Text>
                <Text style={styles.scoreValue}>58</Text>
              </View>
              <View style={styles.scoreCard}>
                <Text style={styles.scoreTitle}>듣기</Text>
                <Text style={styles.scoreValue}>48</Text>
              </View>
              <View style={styles.scoreCard}>
                <Text style={styles.scoreTitle}>쓰기</Text>
                <Text style={styles.scoreValue}>27</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomCard}>
            <Text style={styles.congratsText}>
              Chúc mừng bạn đã hoàn thành bài luyện viết! Bạn đã cố gắng rất
              tốt. Hãy tiếp tục luyện tập để cải thiện kỹ năng viết tiếng Hàn
              của mình nhé.
            </Text>

            <View style={styles.actionRow}>
              <Pressable
                accessibilityRole="button"
                style={styles.homeButton}
                onPress={() => router.replace("/(tabs)" as any)}
              >
                <House size={20} color="#2E7D32" weight="fill" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={styles.reviewButton}
                onPress={() =>
                  router.push(`/practice/mock-exam/${String(examId)}/review`)
                }
              >
                <Text style={styles.reviewButtonText}>Xem lại bài làm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Padding.padding_15 || 15,
    paddingTop: 16,
    paddingBottom: 24,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mascot: {
    width: 140,
    height: 140,
    marginTop: 6,
    marginBottom: 14,
  },
  levelLabel: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
    marginBottom: 6,
  },
  levelValue: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 26,
    color: "#2E7D32",
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  scoreCard: {
    backgroundColor: "#F2FBF2",
    borderRadius: Border.br_10 || 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    minWidth: 78,
  },
  scoreTitle: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: "#2E7D32",
    marginBottom: 4,
  },
  scoreValue: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  bottomCard: {
    width: "100%",
    backgroundColor: "#9AF09B",
    borderTopLeftRadius: Border.br_20 || 20,
    borderTopRightRadius: Border.br_20 || 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  congratsText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.text,
    textAlign: "center",
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  homeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#8FEA8E",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewButton: {
    flex: 1,
    backgroundColor: "#F6F169",
    borderRadius: Border.br_20 || 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  reviewButtonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12,
    color: Color.text,
  },
});
