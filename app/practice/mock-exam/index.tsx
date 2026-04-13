import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ClockCounterClockwise } from "phosphor-react-native";
import Button from "../../../components/Button";
import StatusBadge from "../../../components/StatusBadge";
import {
  Border,
  Color,
  FontFamily,
  FontSize,
  Padding,
} from "../../../constants/GlobalStyles";

// Mock data cho các đề luyện tập
const mockExams = [
  {
    id: "ai",
    title: "Đề tổng hợp dành riêng cho bạn",
    subtitle: "Luyện tập theo trình độ hiện tại",
    badge: { text: "Tổng hợp từ AI", color: Color.cam },
    isFeatured: true,
    number: "#",
  },
  {
    id: "96",
    title: "제96회 한국어능력시험",
    subtitle: "Kỳ thi chính thức 2024",
    badge: { text: "Đã mã khoá", color: Color.main2 },
    isFeatured: false,
    number: "96",
  },
  {
    id: "21",
    title: "제21회 한국어능력시험",
    subtitle: "Kỳ thi chính thức 2024",
    badge: { text: "Đã mã khoá", color: Color.main2 },
    isFeatured: false,
    number: "21",
  },
];

export default function MockExamIndex() {
  const [zenMode, setZenMode] = useState(true);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <ArrowLeft size={20} color={Color.gray} weight="bold" />
        </Pressable>
        <Text style={styles.headerTitle}>Chọn đề TOPIK II</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.iconButton}
          onPress={() => router.push("/practice/mock-exam/history")}
        >
          <ClockCounterClockwise size={20} color={Color.gray} weight="bold" />
        </Pressable>
      </View>

      {/* Zenmode switch */}
      <View style={styles.zenRow}>
        <View style={styles.zenBadge}>
          <Text style={styles.zenTitle}>Zenmode</Text>
          <Text style={styles.zenSubtitle}>Chế độ tập trung</Text>
        </View>
        <Switch
          value={zenMode}
          onValueChange={setZenMode}
          trackColor={{ false: "#E5E7EB", true: "#C4B5FD" }}
          thumbColor={zenMode ? "#8B5CF6" : "#F3F4F6"}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Đề tổng hợp theo trình độ */}
        <Text style={styles.sectionLabel}>
          Đề tổng hợp theo trình độ của bạn
        </Text>
        <View style={styles.examCardFeatured}>
          <View style={styles.examBadgeRow}>
            <StatusBadge
              text={mockExams[0].badge.text}
              bgColor={mockExams[0].badge.color}
            />
          </View>
          <Text style={styles.examTitle}>{mockExams[0].title}</Text>
          <Text style={styles.examSubtitle}>{mockExams[0].subtitle}</Text>
          <View style={styles.featuredFooter}>
            <Text style={styles.featuredHash}>#</Text>
            <Button
              title="Luyện tập"
              variant="Green"
              style={styles.practiceBtn}
              onPress={() =>
                router.push(`/practice/mock-exam/${mockExams[0].id}/intro`)
              }
            />
          </View>
        </View>

        {/* Đề nổi bật */}
        <Text style={styles.featuredLabel}>Đề nổi bật</Text>
        {mockExams.slice(1).map((exam) => (
          <View key={exam.id} style={styles.examCard}>
            <View style={styles.examBadgeRow}>
              <StatusBadge text={exam.badge.text} bgColor={exam.badge.color} />
              <Text style={styles.examNumber}>{exam.number}</Text>
            </View>
            <Text style={styles.examTitle}>{exam.title}</Text>
            <Text style={styles.examSubtitle}>{exam.subtitle}</Text>
            <Button
              title="Luyện tập"
              variant="Green"
              style={styles.practiceBtnFull}
              onPress={() =>
                router.push(`/practice/mock-exam/${exam.id}/intro`)
              }
            />
          </View>
        ))}
      </ScrollView>
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
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_20,
    color: Color.text,
    flex: 1,
    textAlign: "center",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  zenRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9C6FF",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    justifyContent: "space-between",
    marginBottom: 18,
  },
  zenBadge: {
    flexDirection: "column",
  },
  zenTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14,
    color: "#6D28D9",
  },
  zenSubtitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_10,
    color: "#6B7280",
  },
  sectionLabel: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: "#6B7280",
    marginBottom: 8,
  },
  examCardFeatured: {
    backgroundColor: "#F8FAFC",
    borderRadius: Border.br_15 || 15,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  examCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: Border.br_15 || 15,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  examBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  examNumber: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 32,
    color: Color.gray,
    marginLeft: 8,
    marginTop: -6,
  },
  examTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
    marginBottom: 4,
  },
  examSubtitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.gray,
    marginBottom: 12,
  },
  featuredFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  featuredHash: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 56,
    color: "#E2E8F0",
  },
  practiceBtn: {
    alignSelf: "flex-start",
    minWidth: 120,
  },
  practiceBtnFull: {
    alignSelf: "stretch",
  },
  featuredLabel: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
    marginBottom: 8,
  },
});
