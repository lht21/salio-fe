import React from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  ListeningPromptCard,
  MultipleChoiceQuestionCard,
  OXQuestionAccordion,
  ShortAnswerQuestionCard,
} from '../../../../components/Modals/Question';

type ListeningQuestion =
  | {
      id: string;
      type: 'multiple-choice';
      question: string;
      options: { id: string; label: string }[];
      correctOptionId: string;
    }
  | {
      id: string;
      type: 'ox';
      question: string;
      correctValue: 'O' | 'X';
      trueLabel: string;
      falseLabel: string;
    }
  | {
      id: string;
      type: 'short-answer';
      question: string;
      placeholder?: string;
      acceptedAnswers: string[];
      exampleAnswer: string;
    };

type ListeningExercise = {
  id: string;
  title: string;
  transcript: string;
  audioSource: number;
  questions: ListeningQuestion[];
};

type ListeningCourse = {
  exercises: ListeningExercise[];
};

const SPEED_OPTIONS = [
  { label: 'x0.5', value: 0.55 },
  { label: 'x0.75', value: 0.75 },
  { label: 'x1.0', value: 1 },
  { label: 'x1.25', value: 1.25 },
  { label: 'x1.5', value: 1.5 },
  { label: 'x2', value: 2},
];

const LISTENING_COURSES: Record<string, ListeningCourse> = {
  '1': {
    exercises: [
      {
        id: '1',
        title: '1 - 대화를 잘 듣고 맞는 것에 고르십시오.',
        audioSource: require('../../../../assets/audio/1.mp3'),
        transcript:
          '여: 남 씨는 학생입니까? (Nữ: Anh Nam có phải là học sinh/sinh viên không ạ?)\n남: 네, 학생입니다. (Nam: Vâng, là học sinh/sinh viên ạ.)\n\n여: 이지훈 씨는 선생님입니까? (Nữ: Anh Lee Ji-hoon có phải là giáo viên không ạ?)\n남: 아니요, 회사원입니다. (Nam: Không, là nhân viên công ty ạ.)\n\n여: 조현우 씨는 공무원입니까? (Nữ: Anh Jo Hyun-woo có phải là công chức không ạ?)\n남: 아니요, 은행원입니다. (Nam: Không, là nhân viên ngân hàng ạ.)\n\n여: 와완 씨는 의사입니까? (Nữ: Anh Wawan có phải là bác sĩ không ạ?)\n남: 네, 의사입니다. (Nam: Vâng, là bác sĩ ạ.)',
        questions: [
          {
            id: 'l1-e1-ox-1',
            type: 'ox',
            question: '남 씨는 학생입니다.',
            correctValue: 'O',
            trueLabel: '같은',
            falseLabel: '다른',
          },
          {
            id: 'l1-e1-ox-2',
            type: 'ox',
            question: '이지훈 씨는 회사원입니다.',
            correctValue: 'O',
            trueLabel: '같은',
            falseLabel: '다른',
          },
          {
            id: 'l1-e1-ox-3',
            type: 'ox',
            question: '조현우 씨는 공무원입니다.',
            correctValue: 'X',
            trueLabel: '같은',
            falseLabel: '다른',
          },
          {
            id: 'l1-e1-ox-4',
            type: 'ox',
            question: '와완 씨는 의사입니다.',
            correctValue: 'O',
            trueLabel: '같은',
            falseLabel: '다른',
          },
        ],
      },
      {
        id: '2',
        title: '2 - 다음 빈칸에 알맞은 말을 쓰십시오.',
        audioSource: require('../../../../assets/audio/2.1.mp3'),
        transcript:
          '수빈: 안녕하세요? 박수빈입니다. (Subin: Xin chào? Tôi là Park Subin.)\n화: 저는 화입니다. 반갑습니다. (Hwa: Tôi là Hwa. Rất vui được gặp bạn.)\n\n수빈: 화 씨는 회사원입니까? (Subin: Chị Hwa có phải là nhân viên công ty không ạ?)\n화: 아니요, 의사입니다. (Hwa: Không, tôi là bác sĩ.)\n박수빈 씨는 선생님입니까? (Chị Park Subin có phải là giáo viên không ạ?)\n\n수빈: 네, 한국어 선생님입니다. (Subin: Vâng, tôi là giáo viên tiếng Hàn.)',
        questions: [
          {
            id: 'l2-e1-sa-1',
            type: 'short-answer',
            question: '수빈: _____? 박수빈입니다.',
            placeholder: 'Nhập kết quả của bạn',
            acceptedAnswers: ['안녕하세요', '안녕하십니까'],
            exampleAnswer: '안녕하세요.',
          },
          {
            id: 'l2-e1-sa-2',
            type: 'short-answer',
            question: '화: __ 화입니다. 반갑습니다.',
            placeholder: 'Nhập kết quả của bạn',
            acceptedAnswers: ['저는', '전'],
            exampleAnswer: '저는.',
          },
          {
            id: 'l2-e1-sa-3',
            type: 'short-answer',
            question: '수빈: 화 씨는 ___입니까?',
            placeholder: 'Nhập kết quả của bạn',
            acceptedAnswers: ['회사원'],
            exampleAnswer: '회사원',
          },
          {
            id: 'l2-e1-sa-4',
            type: 'short-answer',
            question: '화: ___, 의사입니다. 박수빈 씨는 ___입니까?',
            placeholder: 'Nhập kết quả của bạn',
            acceptedAnswers: ['아니요/선생님'],
            exampleAnswer: '아니요/선생님.',
          },
          {
            id: 'l2-e1-sa-5',
            type: 'short-answer',
            question: '수빈: _, 한국어 ___입니다.',
            placeholder: 'Nhập kết quả của bạn',
            acceptedAnswers: ['네/선생님'],
            exampleAnswer: '네/선생님.',
          },
        ],
      },
      {
        id: '3',
        title: '3 - 대화를 잘 듣고 맞는 것에 고르십시오.',
        audioSource: require('../../../../assets/audio/3.mp3'),
        transcript:
          '남: 저, 한국 사람입니까? (Nam: Cho tôi hỏi, anh/chị là người Hàn Quốc phải không ạ?)\n준영: 네, 한국 사람입니다. (Joon-young: Vâng, tôi là người Hàn Quốc.)\n\n남: 박준영 씨입니까? (Nam: Anh/chị có phải là Park Joon-young không ạ?)\n준영: 네, 박준영입니다. (Joon-young: Vâng, tôi là Park Joon-young.)\n\n남: 안녕하십니까? 제 이름은 남입니다. 베트남대학교 학생입니다. (Nam: Xin chào ạ? Tên tôi là Nam. Tôi là sinh viên trường Đại học Việt Nam.)\n\n준영: 아, 남 씨. 반갑습니다. (Joon-young: À, anh Nam ạ. Rất vui được gặp anh.)',
        questions: [
          {
            id: 'l2-e1-mc-1',
            type: 'multiple-choice',
            question: '남 씨는 누구를 찾고 있습니까?',
            options: [
              { id: 'a', label: '박준영 씨' },
              { id: 'b', label: '최정우 씨' },
              { id: 'c', label: '이지훈 씨' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'l2-e1-mc-2',
            type: 'multiple-choice',
            question: '남 씨의 직업은 무엇입니까?',
            options: [
              { id: 'a', label: '의사' },
              { id: 'b', label: '학생' },
              { id: 'c', label: '회사원' },
            ],
            correctOptionId: 'b',
          },
        ],
      },
    ],
  },
};

function normalizeAnswer(value: string) {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

export default function ListeningPracticeScreen() {
  const router = useRouter();
  const { lessonId, exerciseId } = useLocalSearchParams<{ lessonId?: string; exerciseId?: string }>();
  const resolvedLessonId = lessonId ?? '1';
  const course = LISTENING_COURSES[resolvedLessonId] ?? LISTENING_COURSES['1'];
  const exercise = course.exercises.find((item) => item.id === (exerciseId ?? '1')) ?? course.exercises[0];
  const exerciseIndex = course.exercises.findIndex((item) => item.id === exercise.id);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [expanded, setExpanded] = React.useState(true);
  const [selectedSpeed, setSelectedSpeed] = React.useState(1);
  const [showTranscript, setShowTranscript] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [playbackProgress, setPlaybackProgress] = React.useState(0);
  const [durationMs, setDurationMs] = React.useState(0);
  const [positionMs, setPositionMs] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | undefined>(undefined);
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [typedAnswer, setTypedAnswer] = React.useState('');
  const [audioReady, setAudioReady] = React.useState(false);
  const audioRef = React.useRef<Audio.Sound | null>(null);

  const questionOpacity = React.useRef(new Animated.Value(1)).current;
  const questionTranslateY = React.useRef(new Animated.Value(0)).current;
  const progressAnimation = React.useRef(new Animated.Value(1 / exercise.questions.length)).current;

  const currentQuestion = exercise.questions[currentIndex];
  const progressLabel = `${currentIndex + 1}/${exercise.questions.length}`;
  const progress = (currentIndex + 1) / exercise.questions.length;
  const currentAnswer = selectedAnswer;
  const currentTypedValue = typedAnswer;

  const resetQuestionState = React.useCallback(() => {
    setSelectedAnswer(undefined);
    setIsRevealed(false);
    setTypedAnswer('');
  }, []);

  React.useLayoutEffect(() => {
    setCurrentIndex(0);
    setExpanded(true);
    resetQuestionState();
  }, [exercise.id]);

  React.useEffect(() => {
    const setup = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          exercise.audioSource,
          { shouldPlay: false, rate: selectedSpeed, shouldCorrectPitch: true },
          (status) => {
            if (!status.isLoaded) {
              return;
            }

            setIsPlaying(status.isPlaying);
            setDurationMs(status.durationMillis ?? 0);
            setPositionMs(status.positionMillis ?? 0);
            setPlaybackProgress(
              status.durationMillis ? (status.positionMillis ?? 0) / status.durationMillis : 0
            );
          }
        );

        audioRef.current = sound;
        setAudioReady(true);
      } catch {
        setAudioReady(false);
      }
    };

    void setup();

    return () => {
      if (audioRef.current) {
        void audioRef.current.unloadAsync();
        audioRef.current = null;
      }
    };
  }, [exercise.audioSource, selectedSpeed]);

  React.useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    void audioRef.current.setRateAsync(selectedSpeed, true);
  }, [selectedSpeed]);

  React.useEffect(() => {
    questionOpacity.setValue(0);
    questionTranslateY.setValue(18);

    Animated.parallel([
      Animated.timing(questionOpacity, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(questionTranslateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progressAnimation, {
        toValue: progress,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, [currentIndex, progress, progressAnimation, questionOpacity, questionTranslateY]);

  const goNext = React.useCallback(() => {
    if (currentIndex >= exercise.questions.length - 1) {
      const nextExercise = course.exercises[exerciseIndex + 1];

      if (nextExercise) {
        resetQuestionState();
        router.replace(
          {
            pathname: '/lessons/[lessonId]/listening/practice',
            params: {
              lessonId: resolvedLessonId,
              exerciseId: nextExercise.id,
            },
          } as any
        );
        return;
      }

      router.replace(`/lessons/${resolvedLessonId}/listening/explanation` as any);
      return;
    }

    resetQuestionState();
    setExpanded(true);
    setCurrentIndex((value) => value + 1);
  }, [course.exercises, currentIndex, exercise.questions.length, exerciseIndex, resetQuestionState, resolvedLessonId, router]);

  const animateToNext = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(questionOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(questionTranslateY, {
        toValue: -10,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        goNext();
      }
    });
  }, [goNext, questionOpacity, questionTranslateY]);

  const revealThenAdvance = React.useCallback(
    (answerValue: string) => {
      if (isRevealed) {
        return;
      }

      setSelectedAnswer(answerValue);
      setIsRevealed(true);

      setTimeout(() => {
        animateToNext();
      }, 900);
    },
    [animateToNext, isRevealed]
  );

  const submitShortAnswer = React.useCallback(() => {
    if (currentQuestion.type !== 'short-answer') {
      return;
    }

    if (!currentTypedValue.trim() || isRevealed) {
      return;
    }

    const normalized = normalizeAnswer(currentTypedValue);
    const isCorrect = currentQuestion.acceptedAnswers.some((answer) => normalizeAnswer(answer) === normalized);

    setSelectedAnswer(isCorrect ? 'correct' : 'incorrect');
    setIsRevealed(true);

    setTimeout(() => {
      animateToNext();
    }, 1100);
  }, [animateToNext, currentQuestion, currentTypedValue, isRevealed]);

  const handlePlayPress = React.useCallback(() => {
    const run = async () => {
      if (!audioRef.current || !audioReady) {
        return;
      }

      if (isPlaying) {
        await audioRef.current.pauseAsync();
        return;
      }

      if (durationMs > 0 && positionMs >= durationMs) {
        await audioRef.current.setPositionAsync(0);
      }

      await audioRef.current.playAsync();
    };

    void run();
  }, [audioReady, durationMs, isPlaying, positionMs]);

  const handleSpeedSelect = React.useCallback((value: number) => {
    setSelectedSpeed(value);
    if (audioRef.current) {
      void audioRef.current.setRateAsync(value, true);
    }
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const questionCard = (() => {
    if (currentQuestion.type === 'multiple-choice') {
      return (
        <MultipleChoiceQuestionCard
          progressLabel={progressLabel}
          progress={progress}
          animatedProgress={progressAnimation}
          question={currentQuestion.question}
          options={currentQuestion.options.map((option) => {
            if (!isRevealed) {
              return {
                id: option.id,
                label: option.label,
                state: currentAnswer === option.id ? 'selected' : 'default',
              };
            }

            if (option.id === currentQuestion.correctOptionId) {
              return { id: option.id, label: option.label, state: 'correct' as const };
            }

            if (currentAnswer === option.id) {
              return { id: option.id, label: option.label, state: 'incorrect' as const };
            }

            return { id: option.id, label: option.label, state: 'default' as const };
          })}
          expanded={expanded}
          onToggleExpand={() => setExpanded((value) => !value)}
          onSelectOption={revealThenAdvance}
        />
      );
    }

    if (currentQuestion.type === 'ox') {
      return (
        <OXQuestionAccordion
          progressLabel={progressLabel}
          progress={progress}
          animatedProgress={progressAnimation}
          question={currentQuestion.question}
          expanded={expanded}
          selectedValue={(currentAnswer as 'O' | 'X' | undefined) ?? undefined}
          answerState={
            isRevealed
              ? {
                  O:
                    currentQuestion.correctValue === 'O'
                      ? 'correct'
                      : currentAnswer === 'O'
                        ? 'incorrect'
                        : 'default',
                  X:
                    currentQuestion.correctValue === 'X'
                      ? 'correct'
                      : currentAnswer === 'X'
                        ? 'incorrect'
                        : 'default',
                }
              : undefined
          }
          trueLabel={currentQuestion.trueLabel}
          falseLabel={currentQuestion.falseLabel}
          onToggleExpand={() => setExpanded((value) => !value)}
          onSelect={(value) => revealThenAdvance(value)}
        />
      );
    }

    const shortAnswerCorrect = currentAnswer === 'correct';
    const shortAnswerIncorrect = currentAnswer === 'incorrect';

    return (
      <ShortAnswerQuestionCard
        progressLabel={progressLabel}
        progress={progress}
        animatedProgress={progressAnimation}
        question={currentQuestion.question}
        value={currentTypedValue}
        expanded={expanded}
        answerState={shortAnswerCorrect ? 'correct' : shortAnswerIncorrect ? 'incorrect' : 'default'}
        placeholder={currentQuestion.placeholder}
        helperText={
          isRevealed
            ? shortAnswerCorrect
              ? '정답입니다.'
              : `정답 예시: ${currentQuestion.exampleAnswer}`
            : undefined
        }
        submitLabel="Kiểm tra"
        onToggleExpand={() => setExpanded((value) => !value)}
        onChangeText={setTypedAnswer}
        onSubmit={submitShortAnswer}
        disabled={isRevealed}
      />
    );
  })();

  return (
    <LinearGradient colors={['#C8FF84', '#E9FFD1', '#FFFFFF']} style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        {currentQuestion.type === 'short-answer' ? (
          <KeyboardAwareScrollView
            enableOnAndroid
            extraScrollHeight={Platform.OS === 'ios' ? 90 : 70}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.keyboardContent}
          >
            <View style={styles.sheet}>
              <ListeningPromptCard
                instruction={exercise.title}
                currentTimeLabel={formatTime(positionMs)}
                durationLabel={formatTime(durationMs)}
                progress={playbackProgress}
                isPlaying={isPlaying}
                speedOptions={SPEED_OPTIONS}
                selectedSpeed={selectedSpeed}
                onPlayPress={handlePlayPress}
                onSpeedSelect={handleSpeedSelect}
                showTranscript={showTranscript}
                transcript={exercise.transcript}
                transcriptButtonLabel="Hiển thị Transcript"
                shadowingButtonLabel="Luyện Shadowing với bài này"
                onToggleTranscript={() => setShowTranscript((value) => !value)}
                onPressShadowing={() => {}}
                onClose={() => router.back()}
                footer={
                  <View style={styles.footerWrap}>
                    <Animated.View
                      key={`q-${currentQuestion.id}`}
                      style={[
                        styles.questionWrap,
                        { opacity: questionOpacity, transform: [{ translateY: questionTranslateY }] },
                      ]}
                    >
                      {questionCard}
                    </Animated.View>
                  </View>
                }
              />
            </View>
          </KeyboardAwareScrollView>
        ) : (
          <View style={styles.sheet}>
            <ListeningPromptCard
              instruction={exercise.title}
              currentTimeLabel={formatTime(positionMs)}
              durationLabel={formatTime(durationMs)}
              progress={playbackProgress}
              isPlaying={isPlaying}
              speedOptions={SPEED_OPTIONS}
              selectedSpeed={selectedSpeed}
              onPlayPress={handlePlayPress}
              onSpeedSelect={handleSpeedSelect}
              showTranscript={showTranscript}
              transcript={exercise.transcript}
              transcriptButtonLabel="Hiển thị Transcript"
              shadowingButtonLabel="Luyện Shadowing với bài này"
              onToggleTranscript={() => setShowTranscript((value) => !value)}
              onPressShadowing={() => {}}
              onClose={() => router.back()}
              footer={
                <View style={styles.footerWrap}>
                  <Animated.View
                    key={`q-${currentQuestion.id}`}
                    style={[
                      styles.questionWrap,
                      { opacity: questionOpacity, transform: [{ translateY: questionTranslateY }] },
                    ]}
                  >
                    {questionCard}
                  </Animated.View>
                </View>
              }
            />
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  sheet: {
    flex: 1,
    paddingTop: 10,
  },
  keyboardContent: {
    flexGrow: 1,
  },
  questionWrap: {
    minHeight: 260,
    justifyContent: 'flex-end',
  },
  footerWrap: {
    marginTop: 8,
    marginHorizontal: -14,
    marginBottom: -12,
  },
});
