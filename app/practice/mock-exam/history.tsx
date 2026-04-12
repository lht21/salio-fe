import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
} from "phosphor-react-native";
import {
  Border,
  Color,
  FontFamily,
  FontSize,
  Gap,
  Padding,
} from "../../../constants/GlobalStyles";

const MOCK_HISTORY = [
  { id: "1", title: "Đề thi thử TOPIK I - Đề 1", score: "180/200", time: "Hôm nay" },
  { id: "2", title: "Đề thi thử TOPIK I - Đề 2", score: "150/200", time: "Hôm qua" },
  { id: "3", title: "Bài tập Ngữ pháp Sơ cấp", score: "90/100", time: "3 ngày trước" },
];

export default function MockExamHistory() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={20} color={Color.gray} weight="bold" />
        </Pressable>
        <Text style={styles.headerTitle}>Lịch sử luyện thi</Text>
      </View>

      <View style={styles.list}>
        {MOCK_HISTORY.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.infoRow}>
              <View style={styles.badge}>
                <CheckCircle size={14} color={Color.green || "#4A9F00"} weight="fill" />
                <Text style={styles.scoreText}>{item.score}</Text>
              </View>
              <View style={styles.timeWrap}>
                <Clock size={14} color={Color.gray || "#64748B"} weight="regular" />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bg,
    paddingHorizontal: Padding.padding_15 || 15,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  list: {
    gap: Gap.gap_15 || 15,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Color.bg || "#FFFFFF",
    borderWidth: 1,
    borderColor: Color.stroke || "#E2E8F0",
    borderRadius: Border.br_20 || 20,
    padding: Padding.padding_15 || 15,
  },
  cardTitle: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14 || 14,
    color: Color.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_12 || 12,
    color: Color.green || "#4A9F00",
  },
  timeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12 || 12,
    color: Color.gray || "#64748B",
  },
});
