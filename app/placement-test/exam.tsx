import { useRouter } from "expo-router";
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
import IntroPopup from "../../components/Modals/Popup/IntroPopup";
import QuizHeader from "../../components/Modals/Question/QuizHeader";
import { Color, FontFamily, FontSize } from "../../constants/GlobalStyles";

const { width } = Dimensions.get("window");

const MOCK_QUESTIONS = [
  // SECTION 1: 7 câu
  {
    "id": 1,
    "type": "grammar",
    "section": 1,
    "sectionTitle": "Nhiệm vụ 1",
    "instruction": "Đọc hiểu và chọn đáp án đúng",
    "question": "가: 저 사람이 누구입니까?\n나: 저 분은 우리 ______________ 선생님입니다.",
    "options": [
      { "id": "1", "label": "1.", "text": "학교의" },
      { "id": "2", "label": "2.", "text": "학교가" },
      { "id": "3", "label": "3.", "text": "학교에" },
      { "id": "4", "label": "4.", "text": "학교를" }
    ],
    "correctAnswerId": "1"
  },
  {
    "id": 2,
    "type": "grammar",
    "section": 1,
    "question": "가: 주말에 보통 뭐 해요?\n나: 친구를 ______________ 영화를 봐요.",
    "options": [
      { "id": "1", "label": "1.", "text": "만나고" },
      { "id": "2", "label": "2.", "text": "만나지만" },
      { "id": "3", "label": "3.", "text": "만나서" },
      { "id": "4", "label": "4.", "text": "만나러" }
    ],
    "correctAnswerId": "1"
  },
  {
    "id": 3,
    "type": "grammar",
    "section": 1,
    "question": "가: 한국 음식을 좋아해요?\n나: 비빔밥은 좋아해요. ______________ 김치찌개는 매워서 못 먹어요.",
    "options": [
      { "id": "1", "label": "1.", "text": "그래서" },
      { "id": "2", "label": "2.", "text": "하지만" },
      { "id": "3", "label": "3.", "text": "그러니까" },
      { "id": "4", "label": "4.", "text": "그러면" }
    ],
    "correctAnswerId": "2"
  },
  {
    "id": 4,
    "type": "grammar",
    "section": 1,
    "question": "가: 수영을 할 줄 알아요?\n나: 아니요, 수영을 ______________ 테니스를 잘 쳐요.",
    "options": [
      { "id": "1", "label": "1.", "text": "못하는 대신에" },
      { "id": "2", "label": "2.", "text": "못하기 때문에" },
      { "id": "3", "label": "3.", "text": "못하게 되어서" },
      { "id": "4", "label": "4.", "text": "못할까 봐" }
    ],
    "correctAnswerId": "1"
  },
  {
    "id": 5,
    "type": "grammar",
    "section": 1,
    "question": "가: 민수 씨, 이 책 읽어 봤어요?\n나: 아니요, 아직 ______________ 적이 없어요.",
    "options": [
      { "id": "1", "label": "1.", "text": "읽는" },
      { "id": "2", "label": "2.", "text": "읽은" },
      { "id": "3", "label": "3.", "text": "읽을" },
      { "id": "4", "label": "4.", "text": "읽어서" }
    ],
    "correctAnswerId": "2"
  },
  {
    "id": 6,
    "type": "grammar",
    "section": 1,
    "question": "가: 어제 왜 파티에 안 왔어요?\n나: 늦게까지 ______________ 못 갔어요. 미안해요.",
    "options": [
      { "id": "1", "label": "1.", "text": "일하느라고" },
      { "id": "2", "label": "2.", "text": "일하려고" },
      { "id": "3", "label": "3.", "text": "일하더니" },
      { "id": "4", "label": "4.", "text": "일하다가" }
    ],
    "correctAnswerId": "1"
  },
  {
    "id": 7,
    "type": "grammar",
    "section": 1,
    "question": "가: 컴퓨터가 갑자기 안 돼요.\n나: 산 지 얼마 안 됐는데 벌써 ______________ 이상하네요.",
    "options": [
      { "id": "1", "label": "1.", "text": "고장이 날 리가 없어서" },
      { "id": "2", "label": "2.", "text": "고장이 났을 리가 없는데" },
      { "id": "3", "label": "3.", "text": "고장이 날 것 같아서" },
      { "id": "4", "label": "4.", "text": "고장이 나면 안 되니까" }
    ],
    "correctAnswerId": "2"
  },

  // SECTION 2: 4 câu
  {
    id: 8,
    type: "listening",
    section: 2,
    sectionTitle: "Nhiệm vụ 2",
    instruction: "Nghe và chọn",
    audioDuration: "2:30",
    audioUrl: require("../../assets/audio/1.mp3"),
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
    audioUrl: require("../../assets/audio/1.mp3"),
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
    audioUrl: require("../../assets/audio/1.mp3"),
    question: "여자는 내일 무엇을 할 것입니까?",
    options: [
      { id: "1", label: "1.", text: "등산을 합니다" },
      { id: "2", label: "2.", text: "쇼핑을 합니다" },
      { id: "3", label: "3.", text: "수영을 합니다" },
      { id: "4", label: "4.", text: "영화 봅니다" }
    ],
    correctAnswerId: "2"
  },
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
      <QuizHeader
        current={sectionData.num}
        total={sectionData.total}
        incorrectCount={0}
        onClose={() => router.back()}
      />

      <View style={styles.content}>{renderQuestionForm()}</View>

      <AnswerResultBottomSheet
        visible={showResultSheet}
        variant={resultVariant}
        onNext={handleNextQuestion}
        onCancel={() => setShowResultSheet(false)}
        buttonText={
          sectionData.isLast
            ? "Chốt, chuyển sang phần tiếp theo"
            : "Chốt, câu tiếp theo"
        }
      />

      <IntroPopup
        visible={showSectionIntro}
        title={currentQuestion?.sectionTitle || ""}
        description={currentQuestion?.instruction || ""}
        buttonLabel="Tiếp tục"
        onClose={() => setShowSectionIntro(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 25 }
});
