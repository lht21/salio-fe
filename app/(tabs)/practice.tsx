import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  CaretDownIcon,
  HeadphonesIcon,
  BookOpenTextIcon,
} from "phosphor-react-native";
import {
  Color,
  FontFamily,
  FontSize,
  Border,
  Padding,
  Gap,
} from "../../constants/GlobalStyles";
import { useRouter } from "expo-router";

// Import Components
import WritingFeaturedCard from "../../components/WritingFeaturedCard";
import SkillCard from "../../components/SkillCard";
import MocktestCard from "../../components/MocktestCard";
import { SafeAreaView } from "react-native-safe-area-context";
import HistoryCardSlider from "../../components/HistoryCardSlider";

export default function PracticeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Luyện thi</Text>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Cấp độ đề</Text>
          <TouchableOpacity style={styles.filterDropdown}>
            <Text style={styles.filterText}>ESP</Text>
            <CaretDownIcon size={14} color={Color.text} weight="bold" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured Card (Luyện viết) */}
        <WritingFeaturedCard onPress={() => router.push("/practice/writing")} />

        {/* Secondary Cards (Luyện nghe & Luyện đọc) */}
        <View style={styles.skillsRow}>
          <SkillCard
            title="Luyện nghe"
            icon={<HeadphonesIcon size={24} color="#4A9F00" weight="fill" />}
            onPress={() => router.push("/practice/listening")}
          />
          <SkillCard
            title="Luyện đọc"
            icon={<BookOpenTextIcon size={24} color="#1877F2" weight="fill" />}
            onPress={() => router.push("/practice/reading")}
          />
        </View>

        {/* Mocktest Card (Thi thử) */}
        <View style={styles.mocktestContainer}>
          <MocktestCard onPress={() => router.push("/practice/mock-exam")} />
        </View>

        {/* Lịch sử làm bài (History Slider) */}
        <View style={styles.historyContainer}>
          <HistoryCardSlider />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  scrollContent: {
    paddingHorizontal: Padding.padding_15 || 15,
    paddingTop: 0,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Padding.padding_15 || 15,
    paddingTop: 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20 || 20,
    color: Color.text || "#1E1E1E",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterLabel: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: "#64748B", // Xám đậm
  },
  filterDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.main || "#98F291",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Border.br_10 || 10,
    gap: 4,
  },
  filterText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12 || 12,
    color: Color.text,
  },
  skillsRow: {
    flexDirection: "row",
    gap: Gap.gap_15 || 15,
    marginBottom: Gap.gap_20 || 20,
  },
  mocktestContainer: {
    width: "100%",
  },
  historyContainer: {
    marginTop: Gap.gap_20 || 20,
  },
});
