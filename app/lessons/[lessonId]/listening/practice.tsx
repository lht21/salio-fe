﻿import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Animated, Easing, Platform, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router'; 
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

import LessonService from '../../../../api/services/lesson.service';
import { ListeningItem, LessonModules } from '../../../../api/types/lesson.types';

import {
  ListeningPromptCard,
  MultipleChoiceQuestionCard,
  OXQuestionAccordion,
  ShortAnswerQuestionCard,
} from '../../../../components/Modals/Question';

const SPEED_OPTIONS = [
  { label: 'x0.5', value: 0.55 },
  { label: 'x0.75', value: 0.75 },
  { label: 'x1.0', value: 1 },
  { label: 'x1.25', value: 1.25 },
  { label: 'x1.5', value: 1.5 },
  { label: 'x2', value: 2 },
];

export default function ListeningPracticeScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const resolvedLessonId = lessonId as string;

  // --- DATA STATES ---
  const [allExerciseIds, setAllExerciseIds] = useState<string[]>([]);
  const [currentExIndex, setCurrentExIndex] = useState(0); // Chỉ số bài nghe hiện tại (0 -> 3)
  const [listeningItem, setListeningItem] = useState<ListeningItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // Chỉ số câu hỏi trong bài hiện tại

  // QUAN TRỌNG: Lưu tất cả đáp án của tất cả các bài nghe
  // Cấu trúc: { [exerciseId]: [ { questionId, answer }, ... ] }
  const [allUserAnswers, setAllUserAnswers] = useState<Record<string, any[]>>({});
  const startTimeRef = useRef<number>(Date.now());

  // --- AUDIO STATES ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [positionMs, setPositionMs] = useState(0);
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<Audio.Sound | null>(null);

  // --- UI STATES ---
  const [expanded, setExpanded] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');

  // --- ANIMATIONS ---
  const questionOpacity = useRef(new Animated.Value(1)).current;
  const questionTranslateY = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;

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

  // Hàm tải dữ liệu bài nghe cụ thể (không reset state allUserAnswers)
  const loadExercise = async (id: string) => {
    try {
      setLoading(true);
      console.log(`[ListeningPractice] Đang tải dữ liệu bài nghe ID: ${id}`);
      
      const response = await LessonService.getSkillItem<ListeningItem>(resolvedLessonId, 'listening', id);
      console.log(`[ListeningPractice] Dữ liệu nhận về từ Server:`, response);
      
      // Bóc tách phần 'data' từ BaseResponse để gán vào state
      setListeningItem(response.data);
      setCurrentIndex(0);
      setTypedAnswer('');
      setExpanded(true);
      setAudioReady(false);
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
      })),
    };
  }, [listeningItem]);

  // 3. Audio Setup (giữ nguyên logic của bạn)
  useEffect(() => {
    if (!exercise?.audioSource) return;
    const setup = async () => {
      try {
        if (audioRef.current) await audioRef.current.unloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false, playsInSilentModeIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: true,
        });
        const { sound } = await Audio.Sound.createAsync(
          { uri: exercise.audioSource },
          { shouldPlay: false, rate: selectedSpeed, shouldCorrectPitch: true },
          (status) => {
            if (status.isLoaded) {
              setIsPlaying(status.isPlaying);
              setDurationMs(status.durationMillis ?? 0);
              setPositionMs(status.positionMillis ?? 0);
              setPlaybackProgress(status.durationMillis ? status.positionMillis / status.durationMillis : 0);

              // Khi audio chạy xong, tự động reset vị trí về đầu để dễ dàng bấm nghe lại
              if (status.didJustFinish) {
                setIsPlaying(false);
                if (audioRef.current) audioRef.current.setPositionAsync(0);
              }
            }
          }
        );
        audioRef.current = sound;
        setAudioReady(true);
      } catch (err) { console.error("Audio error:", err); }
    };
    setup();
    return () => { if (audioRef.current) audioRef.current.unloadAsync(); };
  }, [exercise?.audioSource]);

  // 4. Logic Xử lý nộp bài và chuyển bài
  const goNext = useCallback(async () => {
    if (!exercise) return;

    // TH 1: Còn câu hỏi trong bài hiện tại
    if (currentIndex < exercise.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTypedAnswer('');
      setExpanded(true);
    } 
    // TH 2: Hết câu hỏi của bài hiện tại
    else {
      // Nếu còn bài nghe tiếp theo
      if (currentExIndex < allExerciseIds.length - 1) {
        const nextIdx = currentExIndex + 1;
        setCurrentExIndex(nextIdx);
        loadExercise(allExerciseIds[nextIdx]);
      } 
      // TH 3: ĐÃ LÀM XONG TẤT CẢ CÁC BÀI (Bài cuối cùng)
      else {
          try {
            setLoading(true);
            let totalScore = 0;
            let totalMaxScore = 0;
            
            // Khởi tạo bộ đếm cho 3 loại kỹ năng
            let categories = {
              trueFalse: { score: 0, max: 0 },
              choice: { score: 0, max: 0 },
              deepComprehension: { score: 0, max: 0 }
            };

            for (const exId of allExerciseIds) {
              const answers = allUserAnswers[exId] || [];
              const result = await LessonService.submitSkillItem(resolvedLessonId, 'listening', exId, {
                answers,
                timeSpent: 0
              });

              // result là BaseResponse, dữ liệu thực nằm trong result.data
              const payload = result.data; 
              totalScore += payload.result.totalScore;
              totalMaxScore += payload.result.maxScore;

              // Cộng dồn breakdown từ server trả về
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

            // Tính % cho từng loại (nếu không có câu hỏi loại đó thì mặc định 0 hoặc 100 tùy bạn)
            const calcPercent = (cat: {score: number, max: number}) => 
              cat.max > 0 ? Math.round((cat.score / cat.max) * 100) : 0;

            router.replace({
              pathname: '/lessons/[lessonId]/listening/result',
              params: { 
                lessonId: resolvedLessonId, 
                exerciseId: exercise.id,
                score: String(totalScore),
                total: String(totalMaxScore),
                // Truyền thêm 3 thông số breakdown
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

  const animateToNext = useCallback(() => {
    Animated.parallel([
      Animated.timing(questionOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(questionTranslateY, { toValue: -10, duration: 180, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) {
        goNext();
        questionOpacity.setValue(1);
        questionTranslateY.setValue(0);
      }
    });
  }, [goNext]);

  const handleRewind = () => {
    if (!audioRef.current || durationMs === 0) return;
    const newPosition = Math.max(0, positionMs - 10000); // 10 seconds
    audioRef.current.setPositionAsync(newPosition);
  };

  const handleForward = () => {
    if (!audioRef.current || durationMs === 0) return;
    const newPosition = Math.min(durationMs, positionMs + 10000); // 10 seconds
    audioRef.current.setPositionAsync(newPosition);
  };

  const saveAnswer = (value: any) => {
    if (!exercise || !exercise.questions[currentIndex]) return;
    const qId = exercise.questions[currentIndex].id;
    
    setAllUserAnswers(prev => {
      const currentExAnswers = prev[exercise.id] || [];
      // Cập nhật hoặc thêm mới đáp án
      const filtered = currentExAnswers.filter(a => a.questionId !== qId);
      return {
        ...prev,
        [exercise.id]: [...filtered, { questionId: qId, answer: value }]
      };
    });
    
    setTimeout(animateToNext, 400);
  };

  // 5. Render logic (Giống bản trước)
  if (loading || !exercise) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4ACB40" />
        <Text style={{marginTop: 12, fontFamily: 'LexendDeca_500Medium'}}>Đang tải dữ liệu bài nghe...</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = exercise.questions[currentIndex];
  const totalInCourse = allExerciseIds.length;
  // Progress Label hiển thị: Câu 1/4
  const totalQuestions = Math.max(1, exercise.questions.length);
  const progressLabel = `${currentIndex + 1}/${totalQuestions}`;

  const renderQuestionCard = () => {
    if (!currentQuestion) return null;

    // Tìm đáp án đã chọn cho câu này (nếu có)
    const currentExAnswers = allUserAnswers[exercise.id] || [];
    const selectedAns = currentExAnswers.find(a => a.questionId === currentQuestion.id)?.answer;

    if (currentQuestion.type === 'multiple-choice') {
      return (
        <MultipleChoiceQuestionCard
          progressLabel={progressLabel} progress={(currentIndex + 1) / totalQuestions}
          animatedProgress={progressAnimation} question={currentQuestion.question}
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
          animatedProgress={progressAnimation} question={currentQuestion.question}
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
        animatedProgress={progressAnimation} question={currentQuestion.question}
        value={typedAnswer} expanded={expanded}
        placeholder="Nhập câu trả lời..." submitLabel="Tiếp tục"
        onToggleExpand={() => setExpanded(!expanded)}
        onChangeText={setTypedAnswer} 
        onSubmit={() => saveAnswer(typedAnswer)}
      />
    );
  };

  return (
    <LinearGradient colors={['#C8FF84', '#E9FFD1', '#FFFFFF']} style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.sheet}>
          <ListeningPromptCard
            instruction={exercise.title}
            currentTimeLabel={formatTime(positionMs)}
            durationLabel={formatTime(durationMs)}
            progress={playbackProgress}
            isPlaying={isPlaying} 
            speedOptions={SPEED_OPTIONS}
            selectedSpeed={selectedSpeed}
            onPlayPress={() => {
              if (!audioRef.current || !audioReady) return;
              if (isPlaying) {
                audioRef.current.pauseAsync();
              } else if (durationMs > 0 && positionMs >= durationMs) {
                audioRef.current.replayAsync(); // Phát lại từ đầu nếu đang ở cuối
              } else {
                audioRef.current.playAsync();
              }
            }} 
            onSpeedSelect={(val) => {
              setSelectedSpeed(val);
              if (audioRef.current) audioRef.current.setRateAsync(val, true);
            }}
            showTranscript={showTranscript}
            transcript={exercise.transcript}
            onToggleTranscript={() => setShowTranscript(!showTranscript)} 
            onClose={() => router.back()}
            footer={<Animated.View key={`q-${currentQuestion?.id || 'empty'}`} style={{ opacity: questionOpacity, transform: [{ translateY: questionTranslateY }] }}>
              {renderQuestionCard()}
            </Animated.View>}
            onRewind={handleRewind}
            onForward={handleForward}
            onSeek={(newProgress) => {
              if (audioRef.current && durationMs > 0) {
                const newPosition = newProgress * durationMs;
                audioRef.current.setPositionAsync(newPosition);
              }
            }}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const formatTime = (ms: number) => {
  const totalSec = Math.floor(ms / 1000);
  return `${Math.floor(totalSec / 60)}:${(totalSec % 60).toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1 },
  sheet: { flex: 1 },
});