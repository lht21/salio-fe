import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Animated, Platform, StyleSheet, View, Text, ActivityIndicator, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { MotiView, AnimatePresence } from 'moti';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

import LessonService from '../../../../api/services/lesson.service';
import { ReadingItem, LessonModules } from '../../../../api/types/lesson.types';

import {
  ReadingPassageCard,
  MultipleChoiceQuestionCard,
  ShortAnswerQuestionCard,
  OXQuestionAccordion,
} from '../../../../components/Modals/Question';
import ImmediateFeedbackBar from '../../../../components/Listening/ImmediateFeedbackBar';
import PracticeHeader from '../../../../components/Shared/PracticeHeader';
import { Color } from '../../../../constants/GlobalStyles';

export default function ReadingPracticeScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const resolvedLessonId = lessonId as string;

  const [allExerciseIds, setAllExerciseIds] = useState<string[]>([]);
  const [currentExIndex, setCurrentExIndex] = useState(0); 
  const [readingItem, setReadingItem] = useState<ReadingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [allUserAnswers, setAllUserAnswers] = useState<Record<string, any[]>>({});
  const [expanded, setExpanded] = useState(true);
  const [typedAnswer, setTypedAnswer] = useState('');
  
  const [feedback, setFeedback] = useState<{ visible: boolean; isCorrect: boolean } | null>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const modulesRes = await LessonService.getModules(resolvedLessonId);
        const ids = (modulesRes.data as LessonModules).reading.map(item => 
          typeof item === 'string' ? item : item._id
        );
        setAllExerciseIds(ids);
        if (ids.length > 0) loadExercise(ids[0]);
      } catch (error) {
        console.error('Lỗi tải danh sách bài đọc:', error);
      }
    };
    fetchModules();
  }, [resolvedLessonId]);

  const loadExercise = async (id: string) => {
    try {
      setLoading(true);
      const response = await LessonService.getSkillItem<ReadingItem>(resolvedLessonId, 'reading', id);
      setReadingItem(response.data);
      setCurrentIndex(0);
      setTypedAnswer('');
      setExpanded(true);
    } catch (error) {
      console.error('Lỗi tải bài đọc:', error);
    } finally {
      setLoading(false);
    }
  };

  const exercise = useMemo(() => {
    if (!readingItem) return null;
    return {
      id: readingItem._id,
      title: readingItem.title,
      content: readingItem.content,
      questions: (readingItem.questions || []).map(q => ({
        id: q._id,
        type: q.type === 'true_false' ? 'ox' : q.type === 'single_choice' ? 'multiple-choice' : 'short-answer',
        question: q.questionText,
        options: q.metadata?.options?.map(opt => ({ id: opt, label: opt })) || [],
        correctAnswer: q.correctAnswer,
      })),
    };
  }, [readingItem]);

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
          let cats = { vocabulary: { score: 0, max: 0 }, choice: { score: 0, max: 0 }, deepComprehension: { score: 0, max: 0 } };

          const timeSpentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const timeSpentPerEx = Math.max(1, Math.floor(timeSpentSeconds / Math.max(1, allExerciseIds.length)));

          for (const exId of allExerciseIds) {
            const answers = allUserAnswers[exId] || [];
            const result = await LessonService.submitSkillItem(resolvedLessonId, 'reading', exId, { answers, timeSpent: timeSpentPerEx });
            totalScore += result.data.result.totalScore;
            totalMaxScore += result.data.result.maxScore;
            const b = result.data.result.breakdown;
            if (b) {
              if (b.vocabularyClassification) { cats.vocabulary.score += b.vocabularyClassification.score; cats.vocabulary.max += b.vocabularyClassification.maxScore; }
              if (b.choice) { cats.choice.score += b.choice.score; cats.choice.max += b.choice.maxScore; }
              if (b.trueFalse) { cats.choice.score += b.trueFalse.score; cats.choice.max += b.trueFalse.maxScore; }
              if (b.deepComprehension) { cats.deepComprehension.score += b.deepComprehension.score; cats.deepComprehension.max += b.deepComprehension.maxScore; }
            }
          }
          const calcPercent = (cat: {score: number, max: number}) => cat.max > 0 ? Math.round((cat.score / cat.max) * 100) : 0;
          router.replace({
            pathname: '/lessons/[lessonId]/reading/result',
            params: { 
              lessonId: resolvedLessonId, 
              score: String(totalScore), total: String(totalMaxScore),
              vocabPercent: String(calcPercent(cats.vocabulary)),
              choicePercent: String(calcPercent(cats.choice)),
              deepPercent: String(calcPercent(cats.deepComprehension))
            }
          } as any);
        } catch (error) { console.error("Lỗi nộp bài Reading:", error); }
        finally { setLoading(false); }
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
    if (!exercise) return;
    if (!exercise.questions[currentIndex]) return;
    
    const currentQ = exercise.questions[currentIndex];
    const qId = currentQ.id;
    
    let isCorrect = false;
    if (Array.isArray(currentQ.correctAnswer)) {
      isCorrect = currentQ.correctAnswer.includes(value);
    } else {
      isCorrect = currentQ.correctAnswer === value;
    }
    
    setAllUserAnswers(prev => {
      const currentExAnswers = prev[exercise.id] || [];
      const filtered = currentExAnswers.filter(a => a.questionId !== qId);
      return { ...prev, [exercise.id]: [...filtered, { questionId: qId, answer: value, isCorrect }] };
    });

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playFeedbackSound(true);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      playFeedbackSound(false);
      
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

  if (loading || !exercise) return <SafeAreaView style={styles.center}><ActivityIndicator size="large" color="#4ACB40" /></SafeAreaView>;

  const currentQuestion = exercise.questions[currentIndex];
  const progressLabel = `${currentIndex + 1}/${exercise.questions.length}`;

  const renderQuestionCard = () => {
    if (!currentQuestion) return null;

    const currentExAnswers = allUserAnswers[exercise.id] || [];
    const selectedAns = currentExAnswers.find(a => a.questionId === currentQuestion.id)?.answer;

    if (currentQuestion.type === 'multiple-choice') {
      return (
        <MultipleChoiceQuestionCard
          progressLabel={progressLabel} progress={(currentIndex + 1) / exercise.questions.length}
          question={currentQuestion.question}
          options={currentQuestion.options.map(opt => ({ id: opt.id, label: opt.label, state: selectedAns === opt.id ? 'selected' : 'default' }))}
          expanded={expanded} onToggleExpand={() => setExpanded(!expanded)}
          onSelectOption={saveAnswer}
        />
      );
    }

    if (currentQuestion.type === 'ox') {
      return (
        <OXQuestionAccordion
          progressLabel={progressLabel} progress={(currentIndex + 1) / exercise.questions.length}
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
        progressLabel={progressLabel} progress={(currentIndex + 1) / exercise.questions.length}
        question={currentQuestion.question}
        value={typedAnswer} expanded={expanded}
        placeholder="Nhập câu trả lời..." submitLabel="Kiểm tra"
        onToggleExpand={() => setExpanded(!expanded)}
        onChangeText={setTypedAnswer} 
        onSubmit={() => saveAnswer(typedAnswer)}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: Color.main200 }]} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <LinearGradient colors={[Color.main200, '#FFFFFF']} style={styles.container}>
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
          >
            <PracticeHeader 
              lessonLabel={exercise.title}
              instruction="Đọc đoạn văn và trả lời câu hỏi" 
              onClose={() => router.back()} 
            />

            <ReadingPassageCard
              passage={exercise.content}
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

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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