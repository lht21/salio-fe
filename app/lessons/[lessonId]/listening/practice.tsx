import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router'; 
import { MotiView, AnimatePresence } from 'moti';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

import LessonService from '../../../../api/services/lesson.service';
import { ListeningItem, LessonModules } from '../../../../api/types/lesson.types';

import {
  MultipleChoiceQuestionCard,
  OXQuestionAccordion,
  ShortAnswerQuestionCard,
} from '../../../../components/Modals/Question';
import useAudioPlayer from '../../../../api/hooks/useAudioPlayer';
import PracticeHeader from '../../../../components/Shared/PracticeHeader';
import AudioPlayerControls from '../../../../components/Listening/AudioPlayerControls';
import TranscriptBox from '../../../../components/Listening/TranscriptBox';
import ImmediateFeedbackBar from '../../../../components/Listening/ImmediateFeedbackBar';
import { useTheme } from "@/contexts/ThemeContext";

const SPEED_OPTIONS = [
  { label: 'x0.5', value: 0.55 },
  { label: 'x0.75', value: 0.75 },
  { label: 'x1.0', value: 1 },
  { label: 'x1.25', value: 1.25 },
  { label: 'x1.5', value: 1.5 },
  { label: 'x2', value: 2 },
];

export default function ListeningPracticeScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const resolvedLessonId = lessonId as string;

  // --- DATA STATES ---
  const [allExerciseIds, setAllExerciseIds] = useState<string[]>([]);
  const [currentExIndex, setCurrentExIndex] = useState(0); 
  const [listeningItem, setListeningItem] = useState<ListeningItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [allUserAnswers, setAllUserAnswers] = useState<Record<string, any[]>>({});
  const startTimeRef = useRef<number>(Date.now());

  // --- UI STATES ---
  const [expanded, setExpanded] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ visible: boolean; isCorrect: boolean } | null>(null);

  // 1. Lấy danh sách ID khi vào bài
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const modulesRes = await LessonService.getModules(resolvedLessonId);
        const ids = (modulesRes.data as LessonModules).listening.map(item => 
          typeof item === 'string' ? item : item._id
        );
        setAllExerciseIds(ids);
        if (ids.length > 0) loadExercise(ids[0]);
      } catch (error) {
        console.error('Lỗi tải danh sách bài nghe:', error);
      }
    };
    fetchModules();
  }, [resolvedLessonId]);

  const loadExercise = async (id: string) => {
    try {
      setLoading(true);
      const response = await LessonService.getSkillItem<ListeningItem>(resolvedLessonId, 'listening', id);
      setListeningItem(response.data);
      setCurrentIndex(0);
      setTypedAnswer('');
      setExpanded(true);
    } catch (error) {
      console.error('Lỗi tải bài nghe:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Map dữ liệu sang FE format
  const exercise = useMemo(() => {
    if (!listeningItem) return null;
    return {
      id: listeningItem._id,
      title: listeningItem.title,
      transcript: listeningItem.scripts?.map(s => s.korean).join('\n') || '',
      audioSource: listeningItem.audioUrl || '',
      questions: (listeningItem.questions || []).map(q => ({
        id: q._id,
        type: q.type === 'true_false' ? 'ox' : q.type === 'single_choice' ? 'multiple-choice' : 'short-answer',
        question: q.questionText,
        options: q.metadata?.options?.map(opt => ({ id: opt, label: opt })) || [],
        correctAnswer: q.correctAnswer,
      })),
    };
  }, [listeningItem]);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  // --- AUDIO LOGIC ---
  const {
    isPlaying,
    playbackProgress,
    durationMs,
    positionMs,
    selectedSpeed,
    audioReady,
    togglePlayPause,
    setSpeed,
    rewind,
    forward,
    seek,
  } = useAudioPlayer(exercise?.audioSource);

  // 4. Logic Xử lý nộp bài và chuyển bài
  const goNext = useCallback(async () => {
    setFeedback(null);
    if (!exercise) return;

    if (currentIndex < exercise.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTypedAnswer('');
      setExpanded(true);
    } 
    else {
      if (currentExIndex < allExerciseIds.length - 1) {
        const nextIdx = currentExIndex + 1;
        setCurrentExIndex(nextIdx);
        loadExercise(allExerciseIds[nextIdx]);
      } 
      else {
          try {
            setLoading(true);
            let totalScore = 0;
            let totalMaxScore = 0;
            
            let categories = {
              trueFalse: { score: 0, max: 0 },
              choice: { score: 0, max: 0 },
              deepComprehension: { score: 0, max: 0 }
            };

            const timeSpentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
            const timeSpentPerEx = Math.max(1, Math.floor(timeSpentSeconds / Math.max(1, allExerciseIds.length)));

            for (const exId of allExerciseIds) {
              const answers = allUserAnswers[exId] || [];
              const result = await LessonService.submitSkillItem(resolvedLessonId, 'listening', exId, {
                answers,
                timeSpent: timeSpentPerEx
              });

              const payload = result.data; 
              totalScore += payload.result.totalScore;
              totalMaxScore += payload.result.maxScore;

              const b = payload.result.breakdown;
              if (b) {
                if (b.trueFalse) {
                  categories.trueFalse.score += b.trueFalse.score;
                  categories.trueFalse.max += b.trueFalse.maxScore;
                }
                if (b.choice) {
                  categories.choice.score += b.choice.score;
                  categories.choice.max += b.choice.maxScore;
                }
                if (b.deepComprehension) {
                  categories.deepComprehension.score += b.deepComprehension.score;
                  categories.deepComprehension.max += b.deepComprehension.maxScore;
                }
              }
            }

            const calcPercent = (cat: {score: number, max: number}) => 
              cat.max > 0 ? Math.round((cat.score / cat.max) * 100) : 0;

            router.replace({
              pathname: '/lessons/[lessonId]/listening/result',
              params: { 
                lessonId: resolvedLessonId, 
                exerciseId: exercise.id,
                score: String(totalScore),
                total: String(totalMaxScore),
                tfPercent: String(calcPercent(categories.trueFalse)),
                choicePercent: String(calcPercent(categories.choice)),
                deepPercent: String(calcPercent(categories.deepComprehension))
              }
            } as any);

          } catch (error) {
            console.error("Lỗi nộp bài:", error);
          } finally {
            setLoading(false);
          }
        }
      }
  }, [currentIndex, exercise, allUserAnswers, currentExIndex, allExerciseIds, resolvedLessonId]);

  const playFeedbackSound = async (isCorrect: boolean) => {
    try {
      const soundAsset = isCorrect 
        ? require('../../../../assets/audio/correct.mp3') 
        : require('../../../../assets/audio/incorrect.mp3');
      
      const { sound } = await Audio.Sound.createAsync(soundAsset);
      
      await sound.playAsync();
      
      // Dọn dẹp RAM sau khi phát xong
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (e) {
      console.log('Lỗi phát âm thanh:', e);
    }
  };

  const saveAnswer = (value: any) => {
    if (!exercise || !exercise.questions[currentIndex]) return;
    const currentQ = exercise.questions[currentIndex];
    const qId = currentQ.id || (currentQ as any)._id;
    
    let isCorrect = false;
    if (Array.isArray(currentQ.correctAnswer)) {
      isCorrect = currentQ.correctAnswer.includes(value);
    } else {
      isCorrect = currentQ.correctAnswer === value;
    }
    
    setAllUserAnswers(prev => {
      const currentExAnswers = prev[exercise.id] || [];
      const filtered = currentExAnswers.filter(a => a.questionId !== qId);
      return {
        ...prev,
        [exercise.id]: [...filtered, { questionId: qId, answer: value, isCorrect }]
      };
    });
    
    // Yếu tố Gamification: Rung + Âm thanh + Lắc
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playFeedbackSound(true);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      playFeedbackSound(false);
      
      // Hiệu ứng lắc ngang (Shake)
      shakeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
    }

    setFeedback({ visible: true, isCorrect });
  };

  if (loading || !exercise) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4ACB40" />
        <Text style={{marginTop: 12, fontFamily: 'LexendDeca_500Medium'}}>Đang tải dữ liệu bài nghe...</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = exercise.questions[currentIndex];
  const totalQuestions = Math.max(1, exercise.questions.length);
  const progressLabel = `${currentIndex + 1}/${totalQuestions}`;

  const renderQuestionCard = () => {
    if (!currentQuestion) return null;

    const currentExAnswers = allUserAnswers[exercise.id] || [];
    const selectedAns = currentExAnswers.find(a => a.questionId === currentQuestion.id)?.answer;

    if (currentQuestion.type === 'multiple-choice') {
      return (
        <MultipleChoiceQuestionCard
          progressLabel={progressLabel} progress={(currentIndex + 1) / totalQuestions}
          question={currentQuestion.question}
          options={currentQuestion.options.map(opt => ({
            id: opt.id, label: opt.label,
            state: selectedAns === opt.id ? 'selected' : 'default'
          }))}
          expanded={expanded} onToggleExpand={() => setExpanded(!expanded)}
          onSelectOption={saveAnswer}
        />
      );
    }

    if (currentQuestion.type === 'ox') {
      return (
        <OXQuestionAccordion
          progressLabel={progressLabel} progress={(currentIndex + 1) / totalQuestions}
          question={currentQuestion.question}
          expanded={expanded} selectedValue={selectedAns}
          trueLabel="Đúng" falseLabel="Sai"
          onToggleExpand={() => setExpanded(!expanded)}
          onSelect={saveAnswer}
        />
      );
    }

    return (
      <ShortAnswerQuestionCard
        progressLabel={progressLabel} progress={(currentIndex + 1) / totalQuestions}
        question={currentQuestion.question}
        value={typedAnswer} expanded={expanded}
        placeholder="Nhập câu trả lời..." submitLabel="Tiếp tục"
        onToggleExpand={() => setExpanded(!expanded)}
        onChangeText={setTypedAnswer} 
        onSubmit={() => saveAnswer(typedAnswer)}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.main200 }]} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <LinearGradient colors={[colors.main200, '#FFFFFF']} style={styles.container}>
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
          >
            <PracticeHeader 
              instruction={exercise.title} 
              onClose={() => router.back()} 
            />
            
            <AudioPlayerControls 
              currentTimeLabel={formatTime(positionMs)}
              durationLabel={formatTime(durationMs)}
              progress={playbackProgress}
              isPlaying={isPlaying}
              speedOptions={SPEED_OPTIONS}
              selectedSpeed={selectedSpeed}
              onPlayPress={togglePlayPause}
              onSpeedSelect={setSpeed}
              onRewind={rewind}
              onForward={forward}
              onSeek={seek}
            />

            <TranscriptBox 
              transcript={exercise.transcript}
              showTranscript={showTranscript}
              onToggleTranscript={() => setShowTranscript(!showTranscript)}
              onPressShadowing={() => {}}
            />
          </ScrollView>

          <View style={styles.footerSlot} pointerEvents={feedback?.visible ? 'none' : 'auto'}>
            <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
              <AnimatePresence exitBeforeEnter>
                <MotiView
                  key={`q-${currentQuestion?.id || 'empty'}`}
                  from={{ opacity: 0, translateX: 50 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  exit={{ opacity: 0, translateX: -50 }}
                  transition={{ type: 'timing', duration: 250 } as any}
                >
                  {renderQuestionCard()}
                </MotiView>
              </AnimatePresence>
            </Animated.View>
          </View>
        </LinearGradient>

        <ImmediateFeedbackBar
          visible={!!feedback?.visible}
          isCorrect={!!feedback?.isCorrect}
          onNext={goNext}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const formatTime = (ms: number) => {
  const totalSec = Math.floor(ms / 1000);
  return `${Math.floor(totalSec / 60)}:${(totalSec % 60).toString().padStart(2, '0')}`;
};

const getStyles = (colors: any) => StyleSheet.create({
      screen: { flex: 1 },
      safeArea: { flex: 1 },
      container: {
        flex: 1,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 14,
        overflow: 'hidden',
      },
      content: {
        flex: 1,
      },
      contentInner: {
        paddingBottom: 24,
      },
      footerSlot: {
        marginTop: 'auto',
      },
    });