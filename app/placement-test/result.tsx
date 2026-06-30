import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PlacementTestService from "@/api/services/placement-test.service";
import { PlacementSession } from "@/api/types/placement-test.types";
import Button from "../../components/Button";
import { FontFamily } from "../../constants/GlobalStyles";
import { useTheme } from "@/contexts/ThemeContext";

const { width } = Dimensions.get("window");

export default function PlacementTestResult() {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId;
  const [result, setResult] = useState<PlacementSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      if (!sessionId) {
        Alert.alert("Thiếu phiên kiểm tra", "Vui lòng làm lại bài kiểm tra.");
        router.replace("/placement-test/intro");
        return;
      }

      try {
        setIsLoading(true);
        const response = await PlacementTestService.getResult(sessionId);
        setResult(response.data);
      } catch (error: any) {
        Alert.alert(
          "Không thể tải kết quả",
          error.message || "Vui lòng thử lại sau.",
          [{ text: "OK", onPress: () => router.replace("/(tabs)") }]
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadResult();
  }, [router, sessionId]);

  const scoreText = useMemo(() => {
    if (!result) return "";
    if (result.maxScore && result.maxScore > 0) {
      return `Đúng ${result.totalScore || 0}/${result.maxScore} điểm`;
    }
    return `Hoàn thành ${result.percentage || 0}%`;
  }, [result]);

  if (isLoading) {
    return (
      <LinearGradient colors={["#ADFF66", "#8AFF81", "#FFFFFF"]} style={styles.container}>
        <SafeAreaView style={[styles.safeArea, styles.centered]}>
          <ActivityIndicator color={colors.main2} size="large" />
          <Text style={styles.loadingText}>Đang tải kết quả...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#ADFF66", "#8AFF81", "#FFFFFF"]}
      locations={[0, 0.0535, 0.1825]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.content}>
          <View style={styles.mascotContainer}>
            <Image
              source={require("../../assets/images/horani/result-levelup.png")}
              style={styles.mascotImage}
              contentFit="contain"
            />
          </View>

          <View style={styles.rankSection}>
            <Text style={styles.rankLabel}>Cấp bậc</Text>
            <Text style={styles.rankValue}>{result?.recommendedLevel || "Chưa xác định"}</Text>
          </View>

          <View style={styles.scoreCapsule}>
            <Text style={styles.scoreText}>{scoreText}</Text>
            <Text style={styles.percentText}>{result?.percentage || 0}%</Text>
          </View>

          <View style={{ flex: 1 }} />

          <View style={styles.bottomCard}>
            <Text style={styles.congratsText}>
              Chúc mừng bạn đã hoàn thành thử thách!{"\n"}
              Salio đã ghi nhận cấp độ phù hợp để gợi ý lộ trình học tiếp theo.
            </Text>

            <Button
              variant="Orange"
              title="Xem bài học được bỏ qua"
              onPress={() =>
                router.push({
                  pathname: "/placement-test/skipped-lessons",
                  params: { sessionId }
                })
              }
              style={styles.actionButton}
              textStyle={styles.actionButtonText}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      container: {
        flex: 1,
        paddingHorizontal: 35
      },
      safeArea: {
        flex: 1
      },
      centered: {
        alignItems: "center",
        justifyContent: "center"
      },
      content: {
        flex: 1,
        alignItems: "center",
        paddingTop: 60
      },
      loadingText: {
        marginTop: 12,
        fontFamily: FontFamily.lexendDecaRegular,
        color: colors.text
      },
      mascotContainer: {
        marginBottom: 40
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
        color: colors.text || "#1E1E1E",
        marginBottom: 10
      },
      rankValue: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: 30,
        fontWeight: "600",
        color: colors.main2 || "#3C8137",
        textAlign: "center"
      },
      scoreCapsule: {
        backgroundColor: colors.mainLighter,
        paddingVertical: 12,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10
      },
      scoreText: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: 14,
        fontWeight: "700",
        color: colors.text || "#1E1E1E"
      },
      percentText: {
        marginTop: 4,
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: 22,
        color: colors.main2 || "#3C8137"
      },
      bottomCard: {
        width,
        backgroundColor: "#98F291",
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
        color: colors.text || "#1E1E1E",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 40
      },
      actionButton: {
        backgroundColor: colors.vang || "#F9F871",
        width: "100%",
        height: 60,
        borderRadius: 30,
        marginVertical: 0,
        elevation: 3
      },
      actionButtonText: {
        color: colors.text || "#1E1E1E"
      }
    });
