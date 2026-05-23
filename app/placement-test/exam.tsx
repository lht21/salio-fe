import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PlacementTestService from "@/api/services/placement-test.service";
import {
  PlacementListeningItem,
  PlacementQuestion,
  PlacementReadingItem,
  PlacementSectionType,
  PlacementSessionData
} from "@/api/types/placement-test.types";
import Button from "../../components/Button";
import GrammarQuestionForm from "../../components/GrammarQuestionForm";
import ListeningQuestionForm from "../../components/ListeningQuestionForm";
import AnswerResultBottomSheet, {
  BottomSheetVariant
} from "../../components/Modals/AnswerResultBottomSheet";
import IntroPopup from "../../components/Modals/Popup/IntroPopup";
import QuizHeader from "../../components/Modals/Question/QuizHeader";
import { Color, FontFamily } from "../../constants/GlobalStyles";

const DEFAULT_TIME_LIMIT_SECONDS = 180;

type UiPlacementQuestion = {
  id: string;
  itemId?: string;
  sectionType: PlacementSectionType;
  type: "grammar" | "listening" | "reading";
  section: number;
  sectionTitle?: string;
  instruction?: string;
  question: string;
  options: Array<{ id: string; label: string; text: string }>;
  audioDuration?: string;
  audioUrl?: { uri: string };
  raw: PlacementQuestion;
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${rest < 10 ? "0" : ""}${rest}`;
};

const formatCountdown = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
};

const buildOptions = (question: PlacementQuestion) => {
  const options = question.metadata?.options || [];

  if (question.type === "true_false" && options.length === 0) {
    return [
      { id: "true", label: "1.", text: "Đúng" },
      { id: "false", label: "2.", text: "Sai" }
    ];
  }

  return options.map((option, index) => ({
    id: option,
    label: `${index + 1}.`,
    text: option
  }));
};

const getInlineQuestionUiType = (question: PlacementQuestion) => {
  if (question.audioUrl) return "listening";
  return "grammar";
};

const flattenQuestions = (data?: PlacementSessionData): UiPlacementQuestion[] => {
  if (!data?.quiz) return [];

  const questions: UiPlacementQuestion[] = [];
  let section = 1;

  const inlineQuestions = data.quiz.questions || [];
  if (inlineQuestions.length > 0) {
    inlineQuestions.forEach((question, index) => {
      const uiType = getInlineQuestionUiType(question);

      questions.push({
        id: question._id,
        sectionType: "quiz",
        type: uiType,
        section,
        sectionTitle: index === 0 ? `Nhiệm vụ ${section}` : undefined,
        instruction:
          uiType === "listening"
            ? "Nghe audio và chọn đáp án đúng"
            : "Đọc câu hỏi và chọn đáp án đúng",
        question: question.questionText || "",
        options: buildOptions(question),
        audioDuration: "0:00",
        audioUrl: question.audioUrl ? { uri: question.audioUrl } : undefined,
        raw: question
      });
    });
    section += 1;
  }

  const readingItems = data.quiz.sections?.reading || [];
  if (readingItems.length > 0) {
    readingItems.forEach((item: PlacementReadingItem, itemIndex) => {
      item.questions?.forEach((question) => {
        const prompt = [item.content, question.questionText].filter(Boolean).join("\n\n");

        questions.push({
          id: question._id,
          itemId: item._id,
          sectionType: "reading",
          type: "reading",
          section,
          sectionTitle: itemIndex === 0 ? `Nhiệm vụ ${section}` : undefined,
          instruction: "Đọc đoạn văn và chọn đáp án đúng",
          question: prompt || item.title,
          options: buildOptions(question),
          raw: question
        });
      });
    });
    section += 1;
  }

  const listeningItems = data.quiz.sections?.listening || [];
  if (listeningItems.length > 0) {
    listeningItems.forEach((item: PlacementListeningItem, itemIndex) => {
      item.questions?.forEach((question) => {
        questions.push({
          id: question._id,
          itemId: item._id,
          sectionType: "listening",
          type: "listening",
          section,
          sectionTitle: itemIndex === 0 ? `Nhiệm vụ ${section}` : undefined,
          instruction: "Nghe audio và chọn đáp án đúng",
          question: question.questionText || item.title,
          options: buildOptions(question),
          audioDuration: formatDuration(item.duration),
          audioUrl: question.audioUrl
            ? { uri: question.audioUrl }
            : item.audioUrl
              ? { uri: item.audioUrl }
              : undefined,
          raw: question
        });
      });
    });
  }

  return questions;
};

export default function PlacementTestExam() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId;
  const startedAtRef = useRef(Date.now());
  const hasSubmittedRef = useRef(false);

  const [sessionData, setSessionData] = useState<PlacementSessionData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [shortAnswer, setShortAnswer] = useState("");
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [resultVariant, setResultVariant] = useState<BottomSheetVariant>("green");
  const [showSectionIntro, setShowSectionIntro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const questions = useMemo(() => flattenQuestions(sessionData || undefined), [sessionData]);
  const currentQuestion = questions[currentQuestionIndex];
  const timeLimitSeconds = sessionData
    ? sessionData.quiz.timeLimit || DEFAULT_TIME_LIMIT_SECONDS
    : 0;

  const sectionData = useMemo(() => {
    if (!currentQuestion) return { num: 0, total: 0, isLast: false };

    const questionsInCurrentSection = questions.filter(
      (q) => q.section === currentQuestion.section
    );
    const total = questionsInCurrentSection.length;
    const num =
      questionsInCurrentSection.findIndex((q) => q.id === currentQuestion.id) + 1;

    return {
      num,
      total,
      isLast: num === total
    };
  }, [currentQuestion, questions]);

  const elapsedSeconds = () => Math.floor((Date.now() - startedAtRef.current) / 1000);

  const submitExam = async (isAutoSubmit = false) => {
    if (hasSubmittedRef.current || !sessionId) return;

    try {
      hasSubmittedRef.current = true;
      setShowResultSheet(false);
      setIsSaving(true);
      await PlacementTestService.submit(sessionId, { timeSpent: elapsedSeconds() });
      if (isAutoSubmit) {
        Alert.alert("Hết giờ", "Bài kiểm tra đã hết thời gian và được tự động nộp.");
      }
      router.replace({
        pathname: "/placement-test/result",
        params: { sessionId }
      });
    } catch (error: any) {
      hasSubmittedRef.current = false;
      Alert.alert(
        "Không thể nộp bài",
        error.response?.data?.message || "Vui lòng thử lại."
      );
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId) {
        Alert.alert(
          "Thiếu phiên kiểm tra",
          "Vui lòng bắt đầu lại bài kiểm tra."
        );
        router.replace("/placement-test/audio-check");
        return;
      }

      try {
        setIsLoading(true);
        const response = await PlacementTestService.getSession(sessionId);
        const timeLimit = response.data.quiz.timeLimit || DEFAULT_TIME_LIMIT_SECONDS;
        startedAtRef.current = Date.now();
        setSessionData(response.data);
        setTimeLeft(timeLimit);
      } catch (error: any) {
        Alert.alert(
          "Không thể tải bài kiểm tra",
          error.response?.data?.message || "Vui lòng thử lại sau.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [router, sessionId]);

  useEffect(() => {
    if (!currentQuestion) return;

    const previousQuestion = questions[currentQuestionIndex - 1];
    const isFirstOfSection =
      currentQuestionIndex === 0 ||
      currentQuestion.section !== previousQuestion?.section;

    if (isFirstOfSection && currentQuestion.sectionTitle) {
      setShowSectionIntro(true);
    }
  }, [currentQuestion, currentQuestionIndex, questions]);

  useEffect(() => {
    if (!sessionId || !timeLimitSeconds || isLoading || hasSubmittedRef.current) return;

    const timer = setInterval(() => {
      const remaining = Math.max(0, timeLimitSeconds - elapsedSeconds());
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(timer);
        submitExam(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, sessionId, timeLimitSeconds]);

  const saveAnswer = async (answer: unknown, selectedId?: string) => {
    if (!sessionId || !currentQuestion || isSaving || hasSubmittedRef.current) return;

    if (selectedId) setSelectedOptionId(selectedId);
    setIsSaving(true);

    try {
      await PlacementTestService.saveAnswer(sessionId, {
        sectionType: currentQuestion.sectionType,
        itemId: currentQuestion.itemId,
        questionId: currentQuestion.id,
        answer,
        timeSpent: elapsedSeconds()
      });

      setResultVariant(sectionData.isLast ? "orange" : "green");
      setShowResultSheet(true);
    } catch (error: any) {
      if (selectedId) setSelectedOptionId(null);
      Alert.alert(
        "Không thể lưu đáp án",
        error.response?.data?.message || "Vui lòng thử lại."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectOption = (id: string) => {
    saveAnswer(id, id);
  };

  const handleNextQuestion = async () => {
    setShowResultSheet(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((index) => index + 1);
      setSelectedOptionId(null);
      setShortAnswer("");
      return;
    }

    submitExam();
  };

  const renderShortAnswerForm = () => {
    if (!currentQuestion) return null;

    return (
      <View style={styles.shortAnswerWrap}>
        <Text style={styles.shortAnswerQuestion}>{currentQuestion.question}</Text>
        <TextInput
          value={shortAnswer}
          onChangeText={setShortAnswer}
          editable={!isSaving && !showResultSheet}
          multiline
          placeholder="Nhập câu trả lời của bạn"
          placeholderTextColor="#8E9AAF"
          style={styles.shortAnswerInput}
        />
        <Button
          title="Lưu câu trả lời"
          variant="Green"
          disabled={!shortAnswer.trim() || isSaving || showResultSheet}
          onPress={() => saveAnswer(shortAnswer.trim())}
          style={styles.shortAnswerButton}
        />
      </View>
    );
  };

  const renderQuestionForm = () => {
    if (!currentQuestion) return null;

    if (currentQuestion.options.length === 0) {
      return renderShortAnswerForm();
    }

    const commonProps = {
      question: currentQuestion as any,
      selectedOptionId,
      onSelectOption: handleSelectOption,
      showResultSheet: showResultSheet || isSaving
    };

    if (currentQuestion.type === "listening") {
      return <ListeningQuestionForm {...commonProps} />;
    }

    return <GrammarQuestionForm {...commonProps} />;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator color={Color.main} size="large" />
        <Text style={styles.loadingText}>Đang tải bài kiểm tra...</Text>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Bài kiểm tra chưa có câu hỏi.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <QuizHeader
        current={sectionData.num}
        total={sectionData.total}
        incorrectCount={0}
        timerLabel={timeLeft === null ? undefined : formatCountdown(timeLeft)}
        onClose={() => router.back()}
      />

      <View style={styles.content}>{renderQuestionForm()}</View>

      <AnswerResultBottomSheet
        visible={showResultSheet}
        variant={resultVariant}
        onNext={handleNextQuestion}
        onCancel={() => setShowResultSheet(false)}
        buttonText={
          currentQuestionIndex === questions.length - 1
            ? "Nộp bài"
            : sectionData.isLast
              ? "Chốt, chuyển sang phần tiếp theo"
              : "Chốt, câu tiếp theo"
        }
      />

      <IntroPopup
        visible={showSectionIntro}
        title={currentQuestion.sectionTitle || ""}
        description={currentQuestion.instruction || ""}
        buttonLabel="Tiếp tục"
        onClose={() => setShowSectionIntro(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 25 },
  loadingText: {
    marginTop: 12,
    fontFamily: FontFamily.lexendDecaRegular,
    color: Color.text
  },
  emptyText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    color: Color.text,
    textAlign: "center"
  },
  shortAnswerWrap: {
    flex: 1
  },
  shortAnswerQuestion: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 18,
    color: Color.text || "#1E1E1E",
    lineHeight: 30,
    marginBottom: 24
  },
  shortAnswerInput: {
    minHeight: 140,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E6E9F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 15,
    color: Color.text || "#1E1E1E",
    textAlignVertical: "top"
  },
  shortAnswerButton: {
    marginTop: 20
  }
});
