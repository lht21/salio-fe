import { useRouter } from "expo-router";
import { X } from "phosphor-react-native";
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AnswerResultBottomSheet, {
  BottomSheetVariant
} from "../../components/Modals/AnswerResultBottomSheet";
import SectionIntroDialog from "../../components/Modals/SectionIntroDialog";
import GrammarQuestionForm from "../../components/GrammarQuestionForm";
import ListeningQuestionForm from "../../components/ListeningQuestionForm";
import { Color, FontFamily, FontSize } from "../../constants/GlobalStyles";

const { width } = Dimensions.get("window");

// Mock Data for the placement test
const MOCK_QUESTIONS = [
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
    ]
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
    ]
  },
  {
    id: 3,
    type: "listening",
    section: 2,
    sectionTitle: "Nhiệm vụ 2",
    instruction: "Nghe và chọn",
    audioDuration: "2:30",
    question: "여기는 어디입니까?",
    options: [
      { id: "1", label: "1.", text: "병원" },
      { id: "2", label: "2.", text: "은행" },
      { id: "3", label: "3.", text: "지하철역" },
      { id: "4", label: "4.", text: "학교" }
    ]
  },
  {
    id: 4,
    type: "listening",
    section: 2,
    audioDuration: "1:45",
    question: "남자는 무엇을 하고 있습니까?",
    options: [
      { id: "1", label: "1.", text: "잠을 잡니다" },
      { id: "2", label: "2.", text: "밥을 먹습니다" },
      { id: "3", label: "3.", text: "청소를 합니다" },
      { id: "4", label: "4.", text: "공부를 합니다" }
    ]
  }
];

export default function PlacementTestExam() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [resultVariant, setResultVariant] = useState<BottomSheetVariant>("green");
  const [showSectionIntro, setShowSectionIntro] = useState(false);

  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];
  const totalQuestions = 7; // As shown in the design "1/7"
  const progress = (currentQuestionIndex + 1) / totalQuestions;

  // Check if we should show section intro
  useEffect(() => {
    // If it's the first question, or if the section changed from the previous question
    const isFirstQuestionOfSection = 
      currentQuestionIndex === 0 || 
      MOCK_QUESTIONS[currentQuestionIndex].section !== MOCK_QUESTIONS[currentQuestionIndex - 1].section;

    if (isFirstQuestionOfSection && currentQuestion.sectionTitle) {
      setShowSectionIntro(true);
    }
  }, [currentQuestionIndex]);

  const handleSelectOption = (id: string) => {
    setSelectedOptionId(id);
    // Always use green variant since we're not checking correctness
    setResultVariant("green");
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
    if (currentQuestion.type === "grammar") {
      return (
        <GrammarQuestionForm
          question={currentQuestion as any}
          selectedOptionId={selectedOptionId}
          onSelectOption={handleSelectOption}
          showResultSheet={showResultSheet}
        />
      );
    } else if (currentQuestion.type === "listening") {
      return (
        <ListeningQuestionForm
          question={currentQuestion as any}
          selectedOptionId={selectedOptionId}
          onSelectOption={handleSelectOption}
          showResultSheet={showResultSheet}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.progressBadge}>
          <Text style={styles.progressBadgeText}>
            {currentQuestionIndex + 1}/{totalQuestions}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <X size={24} color={Color.gray || "#64748B"} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
        />
      </View>

      <View style={styles.content}>
        {renderQuestionForm()}
      </View>

      {/* Result Bottom Sheet */}
      <AnswerResultBottomSheet
        visible={showResultSheet}
        variant={resultVariant}
        onNext={handleNextQuestion}
        title="Đã ghi nhận!"
        buttonText="Tiếp theo"
      />

      {/* Section Intro Dialog */}
      <SectionIntroDialog
        visible={showSectionIntro}
        sectionTitle={currentQuestion.sectionTitle || ""}
        instruction={currentQuestion.instruction || ""}
        onClose={() => setShowSectionIntro(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
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
  closeButton: {
    backgroundColor: "#E6E9F0",
    padding: 8,
    borderRadius: 25
  },
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
  content: {
    flex: 1,
    paddingHorizontal: 30
  }
});
