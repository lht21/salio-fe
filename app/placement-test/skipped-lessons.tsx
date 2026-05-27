import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PlacementTestService from "@/api/services/placement-test.service";
import { PlacementLesson, SkippedLessonsData } from "@/api/types/placement-test.types";
import Button from "../../components/Button";
import { Color, FontFamily } from "../../constants/GlobalStyles";

const { width } = Dimensions.get("window");

export default function SkippedLessonsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId;
  const [data, setData] = useState<SkippedLessonsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSkippedLessons = async () => {
      if (!sessionId) {
        Alert.alert("Thiếu phiên kiểm tra", "Vui lòng làm lại bài kiểm tra.");
        router.replace("/placement-test/intro");
        return;
      }

      try {
        setIsLoading(true);
        const response = await PlacementTestService.getSkippedLessons(sessionId);
        setData(response.data);
      } catch (error: any) {
        Alert.alert(
          "Không thể tải danh sách bài học",
          error.message || "Vui lòng thử lại sau."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSkippedLessons();
  }, [router, sessionId]);

  const lastSkippedLesson = useMemo(() => {
    const lessons = data?.skippedLessons || [];
    if (lessons.length === 0) return null;
    return [...lessons].sort((a, b) => (b.order || 0) - (a.order || 0))[0];
  }, [data]);

  const handleStartLearning = () => {
    router.replace("/(tabs)");
  };

  const renderLesson = ({ item }: { item: PlacementLesson }) => (
    <View style={styles.lessonItem}>
      <Text style={styles.lessonCode}>{item.code || `Bài ${item.order || ""}`}</Text>
      <Text style={styles.lessonName}>{item.title}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <LinearGradient colors={["#ADFF66", "#8AFF81", "#FFFFFF"]} style={styles.container}>
        <SafeAreaView style={[styles.safeArea, styles.centered]}>
          <ActivityIndicator color={Color.main2} size="large" />
          <Text style={styles.loadingText}>Đang tải lộ trình...</Text>
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
          <View style={styles.headerSection}>
            <Text style={styles.startLabel}>
              {lastSkippedLesson ? "Được bỏ qua đến" : "Bắt đầu học từ"}
            </Text>
            <Text style={styles.lessonTitle}>
              {lastSkippedLesson?.title || "Bài nền tảng đầu tiên"}
            </Text>
          </View>

          <View style={styles.rankCapsule}>
            <Text style={styles.rankText}>{data?.recommendedLevel || "Cấp độ mới"}</Text>
          </View>

          <View style={styles.listWrap}>
            <Text style={styles.listTitle}>Bài học được bỏ qua</Text>
            {(data?.skippedLessons?.length || 0) > 0 ? (
              <FlatList
                data={data?.skippedLessons || []}
                keyExtractor={(item) => item._id}
                renderItem={renderLesson}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.emptyText}>
                Chưa có bài học nào được bỏ qua. Bạn sẽ bắt đầu từ nền tảng đầu tiên.
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }} />

          <View style={styles.bottomCard}>
            <Text style={styles.instructionText}>
              Chuẩn bị tinh thần và học ngay nhé!
            </Text>

            <Button
              variant="Orange"
              title="Bắt đầu học"
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
  centered: {
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80
  },
  loadingText: {
    marginTop: 12,
    fontFamily: FontFamily.lexendDecaRegular,
    color: Color.text
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
    fontSize: 30,
    color: Color.main2 || "#3C8137",
    textAlign: "center"
  },
  rankCapsule: {
    backgroundColor: Color.mainLighter || "rgba(236, 255, 235, 0.8)",
    paddingVertical: 16,
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
  listWrap: {
    width: "100%",
    maxHeight: 220,
    marginTop: 24
  },
  listTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    color: Color.text || "#1E1E1E",
    marginBottom: 10
  },
  lessonItem: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8
  },
  lessonCode: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    color: Color.main2 || "#3C8137",
    fontSize: 12,
    marginBottom: 4
  },
  lessonName: {
    fontFamily: FontFamily.lexendDecaRegular,
    color: Color.text || "#1E1E1E",
    fontSize: 14
  },
  emptyText: {
    fontFamily: FontFamily.lexendDecaRegular,
    color: Color.text || "#1E1E1E",
    lineHeight: 22
  },
  bottomCard: {
    width,
    backgroundColor: "#98F291",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 35,
    paddingTop: 60,
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
