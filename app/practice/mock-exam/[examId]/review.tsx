import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Share, X } from "phosphor-react-native";
import {
  Border,
  Color,
  FontFamily,
  FontSize,
  Padding,
} from "../../../../constants/GlobalStyles";

const examMetaMap: Record<string, any> = {
  ai: {
    titleKo: "한국어능력시험",
    titleEn: "Test of Proficiency in Korean",
    round: "AI",
  },
  "96": {
    titleKo: "한국어능력시험",
    titleEn: "The 96th Test of Proficiency in Korean",
    round: "96",
  },
  "21": {
    titleKo: "한국어능력시험",
    titleEn: "The 21st Test of Proficiency in Korean",
    round: "21",
  },
};

export default function MockExamReview() {
  const { examId } = useLocalSearchParams();
  const router = useRouter();
  const meta = examMetaMap[String(examId)] || examMetaMap["96"];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Kết quả bài thi</Text>
        <View style={styles.topIcons}>
          <Pressable accessibilityRole="button" style={styles.iconButton}>
            <Share size={18} color={Color.gray} weight="bold" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <X size={18} color={Color.gray} weight="bold" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.paperCard}>
          <View style={styles.paperHeaderBlack}>
            <Text
              style={styles.paperHeaderText}
            >{`제${meta.round}회    ${meta.titleKo}`}</Text>
            <Text style={styles.paperHeaderSub}>{meta.titleEn}</Text>
          </View>

          <View style={styles.paperTitleRow}>
            <Text style={styles.paperTitle}>TOPIK II</Text>
            <View style={styles.paperBadge}>
              <Text style={styles.paperBadgeText}>B</Text>
            </View>
          </View>

          <View style={styles.paperCenterLabel}>
            <Text style={styles.paperCenterText}>1교시 듣기, 쓰기</Text>
          </View>

          <View style={styles.paperForm}>
            <View style={styles.paperFormRow}>
              <Text style={styles.paperFormLabel}>
                수험번호 (Registration No.)
              </Text>
            </View>
            <View style={styles.paperFormRow}>
              <Text style={styles.paperFormLabel}>이름 (Name)</Text>
              <View style={styles.paperFormNameRow}>
                <Text style={styles.paperFormSubLabel}>한국어 (Korean)</Text>
                <Text style={styles.paperFormSubLabel}>영어 (English)</Text>
              </View>
            </View>
          </View>

          <View style={styles.paperDivider} />

          <View style={styles.noticeBlock}>
            <Text style={styles.noticeTitle}>유의사항</Text>
            <Text style={styles.noticeSubtitle}>Information</Text>
            <View style={styles.noticeList}>
              <Text style={styles.noticeItem}>
                1. 시험 시작 지시가 있을 때까지 문제를 풀지 마십시오.
              </Text>
              <Text style={styles.noticeItem}>
                2. 수험번호와 이름을 정확하게 기입해 주세요.
              </Text>
              <Text style={styles.noticeItem}>
                3. 답안지를 구기거나 훼손하지 마십시오.
              </Text>
              <Text style={styles.noticeItem}>
                4. 답안지에 기입한 정보를 수정할 때는 펜을 사용해 주십시오.
              </Text>
              <Text style={styles.noticeItem}>
                5. 답안지에 정확하게 표시하여 주십시오.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bg,
    paddingTop: 8,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Padding.padding_15 || 15,
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  topIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: Padding.padding_15 || 15,
    paddingBottom: 24,
  },
  paperCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: Border.br_15 || 15,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  paperHeaderBlack: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  paperHeaderText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14,
    color: "#FFFFFF",
  },
  paperHeaderSub: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_10,
    color: "#D1D5DB",
  },
  paperTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },
  paperTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
    letterSpacing: 1,
  },
  paperBadge: {
    backgroundColor: "#111827",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  paperBadgeText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_12,
    color: "#FFFFFF",
  },
  paperCenterLabel: {
    alignItems: "center",
    marginBottom: 12,
  },
  paperCenterText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  paperForm: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    marginBottom: 16,
  },
  paperFormRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  paperFormLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_10,
    color: Color.text,
  },
  paperFormNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  paperFormSubLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_10,
    color: "#6B7280",
  },
  paperDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 12,
  },
  noticeBlock: {
    alignItems: "center",
  },
  noticeTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12,
    color: Color.text,
  },
  noticeSubtitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_10,
    color: "#6B7280",
    marginBottom: 8,
  },
  noticeList: {
    width: "100%",
  },
  noticeItem: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_10,
    color: "#374151",
    marginBottom: 6,
  },
});
