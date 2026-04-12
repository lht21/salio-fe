import React from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Button from '../../../../components/Button';
import TimerHeader from '../../../../components/TimerHeader';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';
import IntroPopup from '../../../../components/Modals/Popup/IntroPopup';
import {
  ListeningPromptCard,
  MultipleChoiceQuestionCard,
  OXQuestionAccordion,
  ReadingPassageCard,
  ShortAnswerQuestionCard,
} from '../../../../components/Modals/Question';

type ExamQuestion =
  | {
      id: string;
      section: 'listening';
      type: 'multiple-choice';
      sectionTitle: string;
      instruction: string;
      audioSource: number;
      question: string;
      options: { id: string; label: string }[];
    }
  | {
      id: string;
      section: 'listening';
      type: 'ox';
      sectionTitle: string;
      instruction: string;
      audioSource: number;
      question: string;
      trueLabel: string;
      falseLabel: string;
    }
  | {
      id: string;
      section: 'listening';
      type: 'short-answer';
      sectionTitle: string;
      instruction: string;
      audioSource: number;
      question: string;
      placeholder?: string;
    }
  | {
      id: string;
      section: 'reading';
      type: 'multiple-choice';
      sectionTitle: string;
      lessonLabel: string;
      instruction: string;
      passage: string;
      question: string;
      options: { id: string; label: string }[];
    }
  | {
      id: string;
      section: 'reading';
      type: 'ox';
      sectionTitle: string;
      lessonLabel: string;
      instruction: string;
      passage: string;
      question: string;
      trueLabel: string;
      falseLabel: string;
    }
  | {
      id: string;
      section: 'reading';
      type: 'short-answer';
      sectionTitle: string;
      lessonLabel: string;
      instruction: string;
      passage: string;
      question: string;
      placeholder?: string;
    };

const SPEED_OPTIONS = [
  { label: 'x0.5', value: 0.5 },
  { label: 'x0.75', value: 0.75 },
  { label: 'x1.0', value: 1 },
  { label: 'x1.25', value: 1.25 },
  { label: 'x1.5', value: 1.5 },
  { label: 'x2', value: 2 },
];

const EXAM_QUESTIONS: Record<string, ExamQuestion[]> = {
  '1': [
    {
      id: 'l1-e1-ox-1',
      section: 'listening',
      type: 'ox',
      sectionTitle: 'Phần 1 - Listening',
      instruction: '1 - 대화를 잘 듣고 맞는 것에 고르십시오.',
      audioSource: require('../../../../assets/audio/1.mp3'),
      question: '남 씨는 학생입니다.',
      trueLabel: '같은',
      falseLabel: '다른',
    },
    {
      id: 'l1-e1-ox-2',
      section: 'listening',
      type: 'ox',
      sectionTitle: 'Phần 1 - Listening',
      instruction: '1 - 대화를 잘 듣고 맞는 것에 고르십시오.',
      audioSource: require('../../../../assets/audio/1.mp3'),
      question: '이지훈 씨는 회사원입니다.',
      trueLabel: '같은',
      falseLabel: '다른',
    },
    {
      id: 'l1-e1-ox-3',
      section: 'listening',
      type: 'ox',
      sectionTitle: 'Phần 1 - Listening',
      instruction: '1 - 대화를 잘 듣고 맞는 것에 고르십시오.',
      audioSource: require('../../../../assets/audio/1.mp3'),
      question: '조현우 씨는 공무원입니다.',
      trueLabel: '같은',
      falseLabel: '다른',
    },
    {
      id: 'l1-e1-ox-4',
      section: 'listening',
      type: 'ox',
      sectionTitle: 'Phần 1 - Listening',
      instruction: '1 - 대화를 잘 듣고 맞는 것에 고르십시오.',
      audioSource: require('../../../../assets/audio/1.mp3'),
      question: '와완 씨는 의사입니다.',
      trueLabel: '같은',
      falseLabel: '다른',
    },
    {
      id: 'l2-e1-sa-1',
      section: 'listening',
      type: 'short-answer',
      sectionTitle: 'Phần 1 - Listening',
      instruction: '2 - 다음 빈칸에 알맞은 말을 쓰십시오.',
      audioSource: require('../../../../assets/audio/2.1.mp3'),
      question: '수빈: _____? 박수빈입니다.',
      placeholder: 'Nhập kết quả của bạn',
    },
    {
      id: 'l2-e1-sa-2',
      section: 'listening',
      type: 'short-answer',
      sectionTitle: 'Phần 1 - Listening',
      instruction: '2 - 다음 빈칸에 알맞은 말을 쓰십시오.',
      audioSource: require('../../../../assets/audio/2.1.mp3'),
      question: '화: __ 화입니다. 반갑습니다.',
      placeholder: 'Nhập kết quả của bạn',
    },
    {
      id: 'l2-e1-sa-3',
      section: 'listening',
      type: 'short-answer',
      sectionTitle: 'Phần 1 - Listening',
      instruction: '2 - 다음 빈칸에 알맞은 말을 쓰십시오.',
      audioSource: require('../../../../assets/audio/2.1.mp3'),
      question: '수빈: 화 씨는 ___입니까?',
      placeholder: 'Nhập kết quả của bạn',
    },
    {
      id: 'l2-e1-sa-4',
      section: 'listening',
      type: 'short-answer',
      sectionTitle: 'Phần 1 - Listening',
      instruction: '2 - 다음 빈칸에 알맞은 말을 쓰십시오.',
      audioSource: require('../../../../assets/audio/2.1.mp3'),
      question: '화: ___, 의사입니다. 박수빈 씨는 ___입니까?',
      placeholder: 'Nhập kết quả của bạn',
    },
    {
      id: 'l2-e1-sa-5',
      section: 'listening',
      type: 'short-answer',
      sectionTitle: 'Phần 1 - Listening',
      instruction: '2 - 다음 빈칸에 알맞은 말을 쓰십시오.',
      audioSource: require('../../../../assets/audio/2.1.mp3'),
      question: '수빈: _, 한국어 ___입니다.',
      placeholder: 'Nhập kết quả của bạn',
    },
    {
      id: 'l2-e1-mc-1',
      section: 'listening',
      type: 'multiple-choice',
      sectionTitle: 'Phần 1 - Listening',
      instruction: '3 - 대화를 잘 듣고 맞는 것에 고르십시오.',
      audioSource: require('../../../../assets/audio/3.mp3'),
      question: '남 씨는 누구를 찾고 있습니까?',
      options: [
        { id: 'a', label: '박준영 씨' },
        { id: 'b', label: '최정우 씨' },
        { id: 'c', label: '이지훈 씨' },
      ],
    },
    {
      id: 'l2-e1-mc-2',
      section: 'listening',
      type: 'multiple-choice',
      sectionTitle: 'Phần 1 - Listening',
      instruction: '3 - 대화를 잘 듣고 맞는 것에 고르십시오.',
      audioSource: require('../../../../assets/audio/3.mp3'),
      question: '남 씨의 직업은 무엇입니까?',
      options: [
        { id: 'a', label: '의사' },
        { id: 'b', label: '학생' },
        { id: 'c', label: '회사원' },
      ],
    },
    {
      id: 'reading-1',
      section: 'reading',
      type: 'ox',
      sectionTitle: 'Phần 2 - Reading',
      lessonLabel: 'Bài 1',
      instruction: '다음 글을 읽고 물음에 답하세요.',
      passage:
        '박수진: 안녕하세요? 제 이름은 박수진입니다. 한국 사람입니다. 저는 회사원입니다.\n\n최유진: 안녕하세요? 제 이름은 최유진입니다. 한국 사람입니다. 한국대학교 학생입니다. 반갑습니다.\n\n리양: 안녕하십니까? 저는 리양입니다. 중국 사람입니다. 은행원입니다.',
      question: '박수진 씨는 의사입니다.',
      trueLabel: '다른',
      falseLabel: '같은',
    },
    {
      id: 'reading-2',
      section: 'reading',
      type: 'ox',
      sectionTitle: 'Phần 2 - Reading',
      lessonLabel: 'Bài 1',
      instruction: '다음 글을 읽고 물음에 답하세요.',
      passage:
        '박수진: 안녕하세요? 제 이름은 박수진입니다. 한국 사람입니다. 저는 회사원입니다.\n\n최유진: 안녕하세요? 제 이름은 최유진입니다. 한국 사람입니다. 한국대학교 학생입니다. 반갑습니다.\n\n리양: 안녕하십니까? 저는 리양입니다. 중국 사람입니다. 은행원입니다.',
      question: '최유진 씨는 한국대학교 학생입니다.',
      trueLabel: '같은',
      falseLabel: '다른',
    },
    {
      id: 'reading-3',
      section: 'reading',
      type: 'ox',
      sectionTitle: 'Phần 2 - Reading',
      lessonLabel: 'Bài 1',
      instruction: '다음 글을 읽고 물음에 답하세요.',
      passage:
        '박수진: 안녕하세요? 제 이름은 박수진입니다. 한국 사람입니다. 저는 회사원입니다.\n\n최유진: 안녕하세요? 제 이름은 최유진입니다. 한국 사람입니다. 한국대학교 학생입니다. 반갑습니다.\n\n리양: 안녕하십니까? 저는 리양입니다. 중국 사람입니다. 은행원입니다.',
      question: '리양 씨는 의사입니다.',
      trueLabel: '같은',
      falseLabel: '다른',
    },
    {
      id: 'reading-4',
      section: 'reading',
      type: 'multiple-choice',
      sectionTitle: 'Phần 2 - Reading',
      lessonLabel: 'Bài 2',
      instruction: '다음 글을 읽고 물음에 답하세요.',
      passage:
        '안녕하세요? 제 이름은 리양입니다. 중국 사람입니다. 저는 공무원입니다.',
      question: '이 사람은 리양입니까?',
      options: [
        { id: 'a', label: '네' },
        { id: 'b', label: '아니요' },
      ],
    },
    {
      id: 'reading-5',
      section: 'reading',
      type: 'short-answer',
      sectionTitle: 'Phần 2 - Reading',
      lessonLabel: 'Bài 2',
      instruction: '다음 글을 읽고 물음에 답하세요.',
      passage:
        '안녕하세요? 제 이름은 리양입니다. 중국 사람입니다. 저는 공무원입니다.',
      question: '이 사람은 중국 학생입니까?',
      placeholder: 'Nhập câu trả lời của bạn',
    },
    {
      id: 'reading-6',
      section: 'reading',
      type: 'short-answer',
      sectionTitle: 'Phần 2 - Reading',
      lessonLabel: 'Bài 2',
      instruction: '다음 글을 읽고 물음에 답하세요.',
      passage:
        '안녕하세요? 제 이름은 리양입니다. 중국 사람입니다. 저는 공무원입니다.',
      question: '이 사람은 관광 가이드입니까?',
      placeholder: 'Nhập câu trả lời của bạn',
    },
  ],
};

export default function FinalTestExamScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const resolvedLessonId = lessonId ?? '1';
  const questions = EXAM_QUESTIONS[resolvedLessonId] ?? EXAM_QUESTIONS['1'];

  const [showIntroModal, setShowIntroModal] = React.useState(true);
  const [isStarted, setIsStarted] = React.useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = React.useState(false);
  const [showLockedExitModal, setShowLockedExitModal] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [expanded, setExpanded] = React.useState(true);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | undefined>(undefined);
  const [typedAnswer, setTypedAnswer] = React.useState('');
  const [timeLeft, setTimeLeft] = React.useState(20 * 60);
  const [selectedSpeed, setSelectedSpeed] = React.useState(1);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [playbackProgress, setPlaybackProgress] = React.useState(0);
  const [durationMs, setDurationMs] = React.useState(0);
  const [positionMs, setPositionMs] = React.useState(0);
  const [audioReady, setAudioReady] = React.useState(false);

  const audioRef = React.useRef<Audio.Sound | null>(null);
  const questionOpacity = React.useRef(new Animated.Value(1)).current;
  const questionTranslateY = React.useRef(new Animated.Value(0)).current;
  const progressAnimation = React.useRef(new Animated.Value(1 / questions.length)).current;

  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;
  const progressLabel = `${currentIndex + 1}/${questions.length}`;
  const listeningSource = currentQuestion.section === 'listening' ? currentQuestion.audioSource : null;
  const canProceed =
    currentQuestion.type === 'short-answer' ? typedAnswer.trim().length > 0 : Boolean(selectedAnswer);

  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isStarted, timeLeft]);

  React.useEffect(() => {
    if (isStarted && timeLeft === 0) {
      router.replace(`/lessons/${resolvedLessonId}/final-test/result` as any);
    }
  }, [isStarted, resolvedLessonId, router, timeLeft]);

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

  React.useEffect(() => {
    const setup = async () => {
      if (!listeningSource) {
        if (audioRef.current) {
          await audioRef.current.unloadAsync();
          audioRef.current = null;
        }
        setAudioReady(false);
        setIsPlaying(false);
        setPlaybackProgress(0);
        setDurationMs(0);
        setPositionMs(0);
        return;
      }

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

        if (audioRef.current) {
          await audioRef.current.unloadAsync();
        }

        const { sound } = await Audio.Sound.createAsync(
          listeningSource,
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
  }, [listeningSource, selectedSpeed]);

  React.useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    void audioRef.current.setRateAsync(selectedSpeed, true);
  }, [selectedSpeed]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const resetQuestionState = React.useCallback(() => {
    setSelectedAnswer(undefined);
    setTypedAnswer('');
    setExpanded(true);
  }, []);

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

  const animateToNext = React.useCallback(
    (onDone: () => void) => {
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
          onDone();
        }
      });
    },
    [questionOpacity, questionTranslateY]
  );

  const goNext = React.useCallback(() => {
    if (!canProceed) {
      return;
    }

    animateToNext(() => {
      if (currentIndex >= questions.length - 1) {
        setShowSubmitConfirm(true);
        resetQuestionState();
        return;
      }

      resetQuestionState();
      setCurrentIndex((value) => value + 1);
    });
  }, [animateToNext, canProceed, currentIndex, questions.length, resetQuestionState]);

  const submitExam = React.useCallback(() => {
    setShowSubmitConfirm(false);
    router.replace(`/lessons/${resolvedLessonId}/final-test/explanation` as any);
  }, [resolvedLessonId, router]);

  const footerButton = (
    <Button
      title={currentIndex >= questions.length - 1 ? 'Nộp bài' : 'Chốt và sang câu tiếp theo'}
      onPress={currentIndex >= questions.length - 1 ? () => setShowSubmitConfirm(true) : goNext}
      disabled={!canProceed}
      style={styles.nextButton}
    />
  );

  const questionCard =
    currentQuestion.type === 'multiple-choice' ? (
      <MultipleChoiceQuestionCard
        progressLabel={progressLabel}
        progress={progress}
        animatedProgress={progressAnimation}
        question={currentQuestion.question}
        options={currentQuestion.options.map((option) => ({
          id: option.id,
          label: option.label,
          state: selectedAnswer === option.id ? 'selected' : 'default',
        }))}
        expanded={expanded}
        onToggleExpand={() => setExpanded((value) => !value)}
        onSelectOption={setSelectedAnswer}
        footer={footerButton}
      />
    ) : currentQuestion.type === 'ox' ? (
      <OXQuestionAccordion
        progressLabel={progressLabel}
        progress={progress}
        animatedProgress={progressAnimation}
        question={currentQuestion.question}
        expanded={expanded}
        selectedValue={(selectedAnswer as 'O' | 'X' | undefined) ?? undefined}
        trueLabel={currentQuestion.trueLabel}
        falseLabel={currentQuestion.falseLabel}
        onToggleExpand={() => setExpanded((value) => !value)}
        onSelect={setSelectedAnswer}
        footer={footerButton}
      />
    ) : (
      <ShortAnswerQuestionCard
        progressLabel={progressLabel}
        progress={progress}
        animatedProgress={progressAnimation}
        question={currentQuestion.question}
        value={typedAnswer}
        expanded={expanded}
        answerState="default"
        placeholder={currentQuestion.placeholder}
        submitLabel={currentIndex >= questions.length - 1 ? 'Nộp bài' : 'Chốt và sang câu tiếp theo'}
        onToggleExpand={() => setExpanded((value) => !value)}
        onChangeText={setTypedAnswer}
        onSubmit={currentIndex >= questions.length - 1 ? () => setShowSubmitConfirm(true) : goNext}
      />
    );

  return (
    <LinearGradient colors={['#DFF8C6',  '#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF',]} style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <TimerHeader
          timeLeft={timeLeft}
          isStarted={isStarted}
          onClose={() => setShowLockedExitModal(true)}
          onSubmit={() => setShowSubmitConfirm(true)}
        />

        {!isStarted ? <View style={styles.placeholder} /> : null}

        {isStarted ? (
          currentQuestion.type === 'short-answer' ? (
            <KeyboardAwareScrollView
              enableOnAndroid
              extraScrollHeight={Platform.OS === 'ios' ? 90 : 70}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.keyboardContent}
            >
              {currentQuestion.section === 'listening' ? (
                <View style={styles.sheet}>
                  <ListeningPromptCard
                    lessonLabel={currentQuestion.sectionTitle}
                    instruction={currentQuestion.instruction}
                    currentTimeLabel={formatTime(positionMs)}
                    durationLabel={formatTime(durationMs)}
                    progress={playbackProgress}
                    isPlaying={isPlaying}
                    speedOptions={SPEED_OPTIONS}
                    selectedSpeed={selectedSpeed}
                    onPlayPress={handlePlayPress}
                    onSpeedSelect={setSelectedSpeed}
                    showTranscript={false}
                    showTranscriptButton={false}
                    showShadowingButton={false}
                    onToggleTranscript={() => {}}
                    onPressShadowing={() => {}}
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
              ) : (
                <View style={styles.sheet}>
                  <ReadingPassageCard
                    lessonLabel={currentQuestion.lessonLabel}
                    instruction={currentQuestion.instruction}
                    passage={currentQuestion.passage}
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
            </KeyboardAwareScrollView>
          ) : currentQuestion.section === 'listening' ? (
            <View style={styles.sheet}>
              <ListeningPromptCard
                lessonLabel={currentQuestion.sectionTitle}
                instruction={currentQuestion.instruction}
                currentTimeLabel={formatTime(positionMs)}
                durationLabel={formatTime(durationMs)}
                progress={playbackProgress}
                isPlaying={isPlaying}
                speedOptions={SPEED_OPTIONS}
                selectedSpeed={selectedSpeed}
                onPlayPress={handlePlayPress}
                onSpeedSelect={setSelectedSpeed}
                showTranscript={false}
                showTranscriptButton={false}
                showShadowingButton={false}
                onToggleTranscript={() => {}}
                onPressShadowing={() => {}}
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
          ) : (
            <View style={styles.sheet}>
              <ReadingPassageCard
                lessonLabel={currentQuestion.lessonLabel}
                instruction={currentQuestion.instruction}
                passage={currentQuestion.passage}
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
          )
        ) : null}

        <IntroPopup
          visible={showIntroModal}
          title="Mini Test"
          description="Khi vào bài thi, bạn sẽ không thể thoát ra trừ khi nộp bài. Hãy chuẩn bị trước khi bắt đầu nhé!"
          buttonLabel="Bắt đầu thi"
          mascotSources={[require('../../../../assets/images/horani/sc1_b1.png')]}
          onClose={() => {
            setShowIntroModal(false);
            setIsStarted(true);
          }}
        />

        <ConfirmModal
          isVisible={showLockedExitModal}
          title="Không thể thoát giữa bài thi"
          subtitle="Bạn chỉ có thể tiếp tục làm bài hoặc nộp bài để kết thúc."
          confirmText="Nộp bài"
          cancelText="Tiếp tục làm bài"
          onConfirm={submitExam}
          onCancel={() => setShowLockedExitModal(false)}
        />

        <ConfirmModal
          isVisible={showSubmitConfirm}
          title="Nộp bài ngay?"
          subtitle="Sau khi nộp bài, bạn sẽ kết thúc mini test của unit này."
          confirmText="Nộp bài"
          cancelText="Kiểm tra lại"
          onConfirm={submitExam}
          onCancel={() => setShowSubmitConfirm(false)}
        />
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
  placeholder: {
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
  nextButton: {
    marginVertical: 0,
  },
});
