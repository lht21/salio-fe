import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle, Clock, SquaresFour, X } from "phosphor-react-native";
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

export default function MockExamPaper() {
  const { examId } = useLocalSearchParams();
  const router = useRouter();
  const meta = examMetaMap[String(examId)] || examMetaMap["96"];
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <X size={18} color={Color.gray} weight="bold" />
        </Pressable>

        <View style={styles.topPills}>
          <Pressable
            accessibilityRole="button"
            style={styles.pillBlue}
            onPress={() => setIsQuestionModalOpen(true)}
          >
            <SquaresFour size={14} color="#2563EB" weight="fill" />
            <Text style={styles.pillBlueText}>còn 5 câu</Text>
          </Pressable>
          <View style={styles.pillOrange}>
            <Clock size={14} color="#F97316" weight="fill" />
            <Text style={styles.pillOrangeText}>45:00</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            style={styles.pillGreen}
            onPress={() => setIsSubmitConfirmOpen(true)}
          >
            <CheckCircle size={14} color="#16A34A" weight="fill" />
            <Text style={styles.pillGreenText}>Nộp bài</Text>
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
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={isQuestionModalOpen}
        onRequestClose={() => setIsQuestionModalOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsQuestionModalOpen(false)}
        >
          <Pressable style={styles.modalCard}>
            <Text style={styles.modalTitle}>Câu hỏi</Text>
            <View style={styles.modalDivider} />
            <View style={styles.questionGrid}>
              {Array.from({ length: 20 }).map((_, index) => {
                const questionNumber = index + 1;
                const isAnswered = typeof answers[questionNumber] === "number";
                const isActive = selectedQuestionIndex === index;

                return (
                  <Pressable
                    key={String(index)}
                    accessibilityRole="button"
                    style={[
                      styles.questionChip,
                      isAnswered && styles.questionChipAnswered,
                      isActive && styles.questionChipActive,
                    ]}
                    onPress={() => setSelectedQuestionIndex(index)}
                  >
                    <Text
                      style={[
                        styles.questionText,
                        isAnswered && styles.questionTextAnswered,
                      ]}
                    >
                      {questionNumber}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {selectedQuestionIndex !== null && (
              <View style={styles.answerRow}>
                {Array.from({ length: 4 }).map((_, optionIndex) => {
                  const optionNumber = optionIndex + 1;
                  const questionNumber = selectedQuestionIndex + 1;
                  const isSelected = answers[questionNumber] === optionNumber;

                  return (
                    <Pressable
                      key={String(optionIndex)}
                      accessibilityRole="button"
                      style={[
                        styles.answerOption,
                        isSelected && styles.answerOptionSelected,
                      ]}
                      onPress={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [questionNumber]: optionNumber,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.answerOptionText,
                          isSelected && styles.answerOptionTextSelected,
                        ]}
                      >
                        {optionNumber}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={isSubmitConfirmOpen}
        onRequestClose={() => setIsSubmitConfirmOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsSubmitConfirmOpen(false)}
        >
          <Pressable style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Chưa làm xong!</Text>
            <Text style={styles.confirmText}>
              Những câu chưa trả lời sẽ bị tính sai. Bạn vẫn muốn nộp chứ?
            </Text>
            <View style={styles.confirmActions}>
              <Pressable
                accessibilityRole="button"
                style={styles.confirmGhost}
                onPress={() => setIsSubmitConfirmOpen(false)}
              >
                <Text style={styles.confirmGhostText}>Quay lại làm</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={styles.confirmPrimary}
                onPress={() => {
                  setIsSubmitConfirmOpen(false);
                  router.push(`/practice/mock-exam/${String(examId)}/result`);
                }}
              >
                <Text style={styles.confirmPrimaryText}>Vẫn nộp</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    marginBottom: 10,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  topPills: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pillBlue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillBlueText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_10,
    color: "#2563EB",
  },
  pillOrange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFEDD5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillOrangeText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_10,
    color: "#F97316",
  },
  pillGreen: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillGreenText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_10,
    color: "#16A34A",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: Border.br_15 || 15,
    padding: 16,
  },
  modalTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },
  questionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  questionChip: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  questionChipAnswered: {
    backgroundColor: "#86EFAC",
  },
  questionChipActive: {
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  questionText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12,
    color: Color.text,
  },
  questionTextAnswered: {
    color: "#14532D",
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 10,
  },
  answerOption: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  answerOptionSelected: {
    backgroundColor: "#86EFAC",
    borderColor: "#22C55E",
  },
  answerOptionText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12,
    color: Color.text,
  },
  answerOptionTextSelected: {
    color: "#14532D",
  },
  confirmCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: Border.br_15 || 15,
    padding: 16,
    alignSelf: "center",
  },
  confirmTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
    marginBottom: 6,
  },
  confirmText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.gray,
    marginBottom: 14,
  },
  confirmActions: {
    flexDirection: "row",
    gap: 10,
  },
  confirmGhost: {
    flex: 1,
    borderRadius: Border.br_20 || 20,
    borderWidth: 1,
    borderColor: "#86EFAC",
    paddingVertical: 10,
    alignItems: "center",
  },
  confirmGhostText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12,
    color: "#166534",
  },
  confirmPrimary: {
    flex: 1,
    borderRadius: Border.br_20 || 20,
    backgroundColor: "#86EFAC",
    paddingVertical: 10,
    alignItems: "center",
  },
  confirmPrimaryText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12,
    color: Color.text,
  },
});
