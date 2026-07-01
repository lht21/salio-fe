import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, Animated, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

import LessonService from '../../../../api/services/lesson.service';
import { FinalTest } from '../../../../api/types/lesson.types';
import Button from '../../../../components/Button';
import TimerHeader from '../../../../components/TimerHeader';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';
import IntroPopup from '../../../../components/Modals/Popup/IntroPopup';
import {
  MultipleChoiceQuestionCard,
  OXQuestionAccordion,
  ReadingPassageCard,
  ShortAnswerQuestionCard,
} from '../../../../components/Modals/Question';
import PracticeHeader from '../../../../components/Shared/PracticeHeader';
import AudioPlayerControls from '../../../../components/Listening/AudioPlayerControls';
import { useTheme } from "@/contexts/ThemeContext";

const SPEED_OPTIONS = [
  { label: 'x0.75', value: 0.75 },
  { label: 'x1.0', value: 1 },
  { label: 'x1.25', value: 1.25 },
  { label: 'x1.5', value: 1.5 },
  { label: 'x2.0', value: 2 },
];

export default function FinalTestExamScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  // Data states
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [flatQuestions, setFlatQuestions] = useState<any[]>([]);
  const [quizData, setQuizData] = useState<any>(null);

  // UI states
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(undefined);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(900);
  const startTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Audio states
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [selectedSpeed, setSelectedSpeed] = useState(1);

  // Animation refs
  const questionOpacity = useRef(new Animated.Value(1)).current;
  const questionTranslateY = useRef(new Animated.Value(0)).current;

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Load audio
  useEffect(() => {
    if (!isStarted) return;

    const currentQuestion = flatQuestions[currentIndex];
    if (currentQuestion?.sectionType === 'listening' && currentQuestion?.audioUrl) {
      loadAudio(currentQuestion.audioUrl);
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentIndex, isStarted]);

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setPositionMs(status.positionMillis);
      setDurationMs(status.durationMillis);
      setPlaybackProgress(status.positionMillis / status.durationMillis);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setPositionMs(0);
        setPlaybackProgress(0);
      }
    }
  };

  const loadAudio = async (uri: string) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false, rate: selectedSpeed },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  const handleSpeedChange = async (speed: number) => {
    setSelectedSpeed(speed);
    if (sound) {
      await sound.setRateAsync(speed, true);
    }
  };

  // Timer effect
  useEffect(() => {
    if (isStarted && !showSubmitConfirm && flatQuestions.length > 0) {
      startTimeRef.current = Date.now();
      timerIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = Math.max(0, 900 - elapsed);
        setTimeLeft(remaining);

        if (remaining === 0) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          handleAutoSubmit();
        }
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isStarted, showSubmitConfirm, flatQuestions.length]);

  const handleAutoSubmit = async () => {
    Alert.alert(
      "Hết giờ",
      "Bài thi đã hết thời gian, hệ thống sẽ tự động nộp bài.",
      [{
        text: "OK", onPress: async () => {
          try {
            setIsLoading(true);
            await LessonService.submitFinalTest(lessonId as string, sessionId!, {
              timeSpent: 900
            });
            router.replace({
              pathname: `/lessons/${lessonId}/final-test/result` as any,
              params: { sessionId }
            });
          } catch (error) {
            Alert.alert("Lỗi", "Không thể nộp bài. Vui lòng thử lại.");
          } finally {
            setIsLoading(false);
          }
        }
      }]
    );
  };

  const animateTransition = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(questionOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(questionTranslateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      Animated.parallel([
        Animated.timing(questionOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(questionTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Initialize test
  useEffect(() => {
    const initTest = async () => {
      console.log("LOG: lessonId hiện tại là:", lessonId);

      if (!lessonId || lessonId.length < 20) {
        Alert.alert("Lỗi dữ liệu", `ID bài học không hợp lệ: ${lessonId}.`);
        router.back();
        return;
      }

      try {
        const startRes = await LessonService.startFinalTest(lessonId);
        const sessionId = startRes.data.sessionId;
        const sessionRes = await LessonService.getFinalTestSession(lessonId, sessionId);
        const quiz = sessionRes.data.quiz as FinalTest;

        console.log('Quiz sections:', {
          listening: quiz.sections?.listening?.length,
          reading: quiz.sections?.reading?.length,
          listeningQuestions: quiz.sections?.listening?.reduce((sum, item) => sum + (item.questions?.length || 0), 0),
          readingQuestions: quiz.sections?.reading?.reduce((sum, item) => sum + (item.questions?.length || 0), 0)
        });

        setSessionId(sessionId);
        setQuizData(quiz);

        const tempFlat: any[] = [];

        if (quiz.sections?.listening) {
          quiz.sections.listening.forEach((item: any) => {
            if (item.questions && item.questions.length > 0) {
              item.questions.forEach((q: any) => {
                tempFlat.push({
                  ...q,
                  sectionType: 'listening',
                  itemId: item._id,
                  passage: item.content,
                  audioUrl: item.audioUrl,
                  duration: item.duration,
                  scripts: item.scripts,
                  instruction: item.title || q.questionText,
                  sectionTitle: 'Listening'
                });
              });
            }
          });
        }

        if (quiz.sections?.reading) {
          quiz.sections.reading.forEach((item: any) => {
            if (item.questions && item.questions.length > 0) {
              item.questions.forEach((q: any) => {
                tempFlat.push({
                  ...q,
                  sectionType: 'reading',
                  itemId: item._id,
                  passage: item.content,
                  translation: item.translation,
                  instruction: item.title || q.questionText,
                  sectionTitle: 'Reading'
                });
              });
            }
          });
        }

        console.log(`Đã flatten ${tempFlat.length} câu hỏi`);

        if (tempFlat.length === 0) {
          Alert.alert("Thông báo", "Bài thi này chưa có câu hỏi nào.");
          router.back();
        } else {
          setFlatQuestions(tempFlat);
        }

      } catch (error: any) {
        console.log(`LOG: Lỗi - ${error.message}`);
        Alert.alert("Lỗi", "Không thể bắt đầu bài thi. Vui lòng thử lại.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    initTest();
  }, [lessonId]);

  const currentQuestion = flatQuestions[currentIndex];

  const handleNext = async () => {
    if (isSubmitting) return;

    const answer = currentQuestion.type === 'short_answer' ? typedAnswer : selectedAnswer;

    if (currentQuestion.type !== 'short_answer' && !answer) {
      Alert.alert("Thông báo", "Vui lòng chọn đáp án trước khi tiếp tục.");
      return;
    }

    if (currentQuestion.type === 'short_answer' && (!answer || answer.trim() === '')) {
      Alert.alert("Thông báo", "Vui lòng nhập câu trả lời trước khi tiếp tục.");
      return;
    }

    try {
      setIsSubmitting(true);

      await LessonService.saveFinalTestAnswer(lessonId as string, sessionId!, {
        sectionType: currentQuestion.sectionType,
        itemId: currentQuestion.itemId,
        questionId: currentQuestion._id,
        answer: answer,
        timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
      });

      if (currentIndex < flatQuestions.length - 1) {
        animateTransition(() => {
          setCurrentIndex(prev => prev + 1);
          setSelectedAnswer(undefined);
          setTypedAnswer('');
          setExpanded(true);
        });
      } else {
        setShowSubmitConfirm(true);
      }
    } catch (err: any) {
      console.error('Save answer error:', err.response?.data);
      Alert.alert("Lỗi", err.response?.data?.message || "Không thể lưu đáp án.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const common = {
      progressLabel: `${currentIndex + 1}/${flatQuestions.length}`,
      progress: (currentIndex + 1) / flatQuestions.length,
      question: currentQuestion.questionText,
      expanded,
      onToggleExpand: () => setExpanded(!expanded),
      footer: (
        <Button
          title={currentIndex === flatQuestions.length - 1 ? "Nộp bài" : "Tiếp theo"}
          onPress={handleNext}
          disabled={isSubmitting}
        />
      )
    };

    if (currentQuestion.type === 'single_choice') {
      return (
        <MultipleChoiceQuestionCard
          {...common}
          options={currentQuestion.metadata?.options?.map((o: any) => ({
            id: o,
            label: o,
            state: selectedAnswer === o ? 'selected' : 'default'
          }))}
          onSelectOption={setSelectedAnswer}
        />
      );
    }

    if (currentQuestion.type === 'true_false') {
      return (
        <OXQuestionAccordion
          {...common}
          selectedValue={selectedAnswer}
          trueLabel="Đúng"
          falseLabel="Sai"
          onSelect={setSelectedAnswer}
        />
      );
    }

    if (currentQuestion.type === 'short_answer') {
      return (
        <ShortAnswerQuestionCard
          {...common}
          value={typedAnswer}
          onChangeText={setTypedAnswer}
          onSubmit={handleNext}
        />
      );
    }

    if (currentQuestion.type === 'multiple_choice') {
      return (
        <MultipleChoiceQuestionCard
          {...common}
          options={currentQuestion.metadata?.options?.map((o: any) => ({
            id: o,
            label: o,
            state: selectedAnswer === o ? 'selected' : 'default'
          }))}
          onSelectOption={setSelectedAnswer}
        />
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#DFF8C6' }]} edges={['top']}>
      <TimerHeader
        timeLeft={timeLeft}
        isStarted={isStarted}
        onClose={() => {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          router.back();
        }}
        onSubmit={() => setShowSubmitConfirm(true)}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <LinearGradient colors={['#DFF8C6', '#FFFFFF']} style={styles.container}>

          {isStarted && currentQuestion && (
            <>
              <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentInner}
                showsVerticalScrollIndicator={false}
              >
                <PracticeHeader
                  lessonLabel={currentQuestion.sectionTitle}
                  instruction={currentQuestion.instruction}
                />

                {currentQuestion.sectionType === 'listening' ? (
                  <View style={styles.audioControlsWrapper}>
                    <AudioPlayerControls
                      currentTimeLabel={formatTime(positionMs)}
                      durationLabel={formatTime(durationMs)}
                      progress={playbackProgress}
                      isPlaying={isPlaying}
                      speedOptions={SPEED_OPTIONS}
                      selectedSpeed={selectedSpeed}
                      onPlayPress={handlePlayPause}
                      onSpeedSelect={handleSpeedChange}
                      onRewind={() => { }}
                      onForward={() => { }}
                      onSeek={() => { }}
                    />
                  </View>
                ) : (
                  <ReadingPassageCard
                    passage={currentQuestion.passage || currentQuestion.content}
                  />
                )}
              </ScrollView>

              <View style={styles.footerSlot}>
                <Animated.View
                  style={[
                    styles.questionContainer,
                    {
                      opacity: questionOpacity,
                      transform: [{ translateY: questionTranslateY }],
                    }
                  ]}
                >
                  {renderQuestion()}
                </Animated.View>
              </View>
            </>
          )}

          <IntroPopup
            visible={showIntroModal}
            title={quizData?.title || "Mini Test"}
            description={quizData?.description || `Làm bài thi để hoàn thành khóa học.\n\n• Thời gian: 15 phút\n• Số câu hỏi: ${flatQuestions.length}\n• Bạn cần đạt 80% để vượt qua`}
            buttonLabel="Bắt đầu ngay"
            onClose={() => {
              setShowIntroModal(false);
              setIsStarted(true);
              startTimeRef.current = Date.now();
            }}
          />

          <ConfirmModal
            isVisible={showSubmitConfirm}
            title="Kết thúc bài thi?"
            confirmText="Nộp bài"
            cancelText="Tiếp tục"
            onConfirm={async () => {
              try {
                setIsLoading(true);
                if (timerIntervalRef.current) {
                  clearInterval(timerIntervalRef.current);
                }
                await LessonService.submitFinalTest(lessonId as string, sessionId!, {
                  timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000)
                });
                router.replace({
                  pathname: `/lessons/${lessonId}/final-test/result` as any,
                  params: { sessionId }
                });
              } catch (error) {
                console.error('Submit error:', error);
                Alert.alert("Lỗi", "Không thể nộp bài. Vui lòng thử lại.");
                setIsLoading(false);
              }
            }}
            onCancel={() => setShowSubmitConfirm(false)}
          />
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 14,
    overflow: 'hidden',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingBottom: 24,
  },
  audioControlsWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
  footerSlot: {
    marginTop: 'auto',
  },
  questionContainer: {
    minHeight: 180,
    justifyContent: 'flex-end',
  }
});