import { useRouter } from "expo-router";
import { X } from "phosphor-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GrammarQuestionForm from "../../components/GrammarQuestionForm";
import ListeningQuestionForm from "../../components/ListeningQuestionForm";
import AnswerResultBottomSheet, {
  BottomSheetVariant
} from "../../components/Modals/AnswerResultBottomSheet";
import SectionIntroDialog from "../../components/Modals/SectionIntroDialog";
import { Color, FontFamily, FontSize } from "../../constants/GlobalStyles";

const { width } = Dimensions.get("window");

// Mock Data đầy đủ (7 câu Section 1, 4 câu Section 2)
const MOCK_QUESTIONS = [
  // SECTION 1: 7 câu
  {
    id: 1,
    type: "grammar",
    section: 1,
    sectionTitle: "Nhiệm vụ 1",
    instruction: "Đọc hiểu và chọn",
    question: "가: 만나서 반갑습니다.\n나: 네, ______________.",
    options: [
      { id: "1", label: "1.", text: "안녕히 가세요" },
      { id: "2", label: "2.", text: "만나서 반갑습니다" },
      { id: "3", label: "3.", text: "감사합니다" },
      { id: "4", label: "4.", text: "죄송합니다" }
    ],
    correctAnswerId: "2"
  },
  {
    id: 2,
    type: "grammar",
    section: 1,
    question: "가: 이름이 무엇입니까?\n나: 제 ______________ 지민입니다.",
    options: [
      { id: "1", label: "1.", text: "이름은" },
      { id: "2", label: "2.", text: "성함은" },
      { id: "3", label: "3.", text: "나이는" },
      { id: "4", label: "4.", text: "직업은" }
    ],
    correctAnswerId: "1"
  },
  {
    id: 3,
    type: "grammar",
    section: 1,
    question: "가: 오늘 날씨가 어때요?\n나: ______________.",
    options: [
      { id: "1", label: "1.", text: "맛있어요" },
      { id: "2", label: "2.", text: "추워요" },
      { id: "3", label: "3.", text: "비싸요" },
      { id: "4", label: "4.", text: "멀어요" }
    ],
    correctAnswerId: "2"
  },
  {
    id: 4,
    type: "grammar",
    section: 1,
    question: "가: 사과가 얼마예요?\n나: 세 ______________ 5,000원이에요.",
    options: [
      { id: "1", label: "1.", text: "명" },
      { id: "2", label: "2.", text: "병" },
      { id: "3", label: "3.", text: "개" },
      { id: "4", label: "4.", text: "권" }
    ],
    correctAnswerId: "3"
  },
  {
    id: 5,
    type: "grammar",
    section: 1,
    question: "가: bây giờ bạn làm gì?\n나: 식당에서 밥을 ______________.",
    options: [
      { id: "1", label: "1.", text: "마셔요" },
      { id: "2", label: "2.", text: "읽어요" },
      { id: "3", label: "3.", text: "먹어요" },
      { id: "4", label: "4.", text: "봐요" }
    ],
    correctAnswerId: "3"
  },
  {
    id: 6,
    type: "grammar",
    section: 1,
    question: "가: 학교에 ______________ 가요?\n나: 버스로 가요.",
    options: [
      { id: "1", label: "1.", text: "어디" },
      { id: "2", label: "2.", text: "어떻게" },
      { id: "3", label: "3.", text: "언ze" },
      { id: "4", label: "4.", text: "무엇" }
    ],
    correctAnswerId: "2"
  },
  {
    id: 7,
    type: "grammar",
    section: 1,
    question: "가: Cuối tuần xem phim nhé?\n나: 미안해요. ______________.",
    options: [
      { id: "1", label: "1.", text: "바빠요" },
      { id: "2", label: "2.", text: "재미있어요" },
      { id: "3", label: "3.", text: "예뻐요" },
      { id: "4", label: "4.", text: "좋아요" }
    ],
    correctAnswerId: "1"
  },

  // SECTION 2: 4 câu
  {
    id: 8,
    type: "listening",
    section: 2,
    sectionTitle: "Nhiệm vụ 2",
    instruction: "Nghe và chọn",
    audioDuration: "2:30",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    question: "여기는 어디입니까?",
    options: [
      { id: "1", label: "1.", text: "병원" },
      { id: "2", label: "2.", text: "은행" },
      { id: "3", label: "3.", text: "지하철역" },
      { id: "4", label: "4.", text: "학교" }
    ],
    correctAnswerId: "3"
  },
  {
    id: 9,
    type: "listening",
    section: 2,
    audioDuration: "1:45",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    question: "남자는 무엇을 하고 있습니까?",
    options: [
      { id: "1", label: "1.", text: "잠을 잡니다" },
      { id: "2", label: "2.", text: "밥을 먹습니다" },
      { id: "3", label: "3.", text: "청소를 합니다" },
      { id: "4", label: "4.", text: "공부를 합니다" }
    ],
    correctAnswerId: "2"
  },
  {
    id: 10,
    type: "listening",
    section: 2,
    audioDuration: "1:20",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    question: "여자는 내일 무엇을 할 것입니까?",
    options: [
      { id: "1", label: "1.", text: "등산을 합니다" },
      { id: "2", label: "2.", text: "쇼핑을 합니다" },
      { id: "3", label: "3.", text: "수영을 합니다" },
      { id: "4", label: "4.", text: "영화 봅니다" }
    ],
    correctAnswerId: "2"
  },
  {
    id: 11,
    type: "listening",
    section: 2,
    audioDuration: "2:00",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    question: "Hai người đang nói về cái gì?",
    options: [
      { id: "1", label: "1.", text: "가족" },
      { id: "2", label: "2.", text: "취미" },
      { id: "3", label: "3.", text: "고향" },
      { id: "4", label: "4.", text: "날씨" }
    ],
    correctAnswerId: "4"
  }
];

export default function PlacementTestExam() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [resultVariant, setResultVariant] =
    useState<BottomSheetVariant>("green");
  const [showSectionIntro, setShowSectionIntro] = useState(false);

  // --- LOGIC TÍNH TOÁN THEO SECTION ---
  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];

  const sectionData = useMemo(() => {
    if (!currentQuestion)
      return { num: 0, total: 0, progress: 0, isLast: false };

    const questionsInCurrentSection = MOCK_QUESTIONS.filter(
      (q) => q.section === currentQuestion.section
    );
    const total = questionsInCurrentSection.length;
    const num =
      questionsInCurrentSection.findIndex((q) => q.id === currentQuestion.id) +
      1;

    return {
      num,
      total,
      progress: num / total,
      isLast: num === total
    };
  }, [currentQuestionIndex]);

  // Check show section intro
  useEffect(() => {
    if (!currentQuestion) return;

    const isFirstOfSection =
      currentQuestionIndex === 0 ||
      currentQuestion.section !==
        MOCK_QUESTIONS[currentQuestionIndex - 1]?.section;

    if (isFirstOfSection && currentQuestion.sectionTitle) {
      setShowSectionIntro(true);
    }
  }, [currentQuestionIndex]);

  const handleSelectOption = (id: string) => {
    setSelectedOptionId(id);
    // Nếu là câu cuối section, dùng variant da cam để notify
    setResultVariant(sectionData.isLast ? "orange" : "green");
    setShowResultSheet(true);
  };

  const handleNextQuestion = () => {
    setShowResultSheet(false);
    setTimeout(() => {
      if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOptionId(null);
      } else {
        router.push("/placement-test/result");
      }
    }, 300);
  };

  const renderQuestionForm = () => {
    if (!currentQuestion) return null;

    const FormComponent =
      currentQuestion.type === "grammar"
        ? GrammarQuestionForm
        : ListeningQuestionForm;
    return (
      <FormComponent
        question={currentQuestion as any}
        selectedOptionId={selectedOptionId}
        onSelectOption={handleSelectOption}
        showResultSheet={showResultSheet}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBadge}>
          <Text style={styles.progressBadgeText}>
            {sectionData.num}/{sectionData.total}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <X size={24} color={Color.gray || "#64748B"} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${sectionData.progress * 100}%` }
          ]}
        />
      </View>

      <View style={styles.content}>{renderQuestionForm()}</View>

      <AnswerResultBottomSheet
        visible={showResultSheet}
        variant={resultVariant}
        onNext={handleNextQuestion}
        buttonText={
          sectionData.isLast
            ? "Chốt, chuyển sang phần tiếp theo"
            : "Chốt, câu tiếp theo"
        }
      />

      <SectionIntroDialog
        visible={showSectionIntro}
        sectionTitle={currentQuestion?.sectionTitle || ""}
        instruction={currentQuestion?.instruction || ""}
        onClose={() => setShowSectionIntro(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  progressBadge: {
    backgroundColor: "#98F291",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20
  },
  progressBadgeText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: "#FFFFFF"
  },
  closeButton: { backgroundColor: "#E6E9F0", padding: 8, borderRadius: 25 },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#64748B40",
    borderRadius: 5,
    marginHorizontal: 20,
    overflow: "hidden",
    marginBottom: 40
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#98F291",
    borderRadius: 5
  },
  content: { flex: 1, paddingHorizontal: 30 }
});
