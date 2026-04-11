import React from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  MultipleChoiceQuestionCard,
  OXQuestionAccordion,
  ReadingPassageCard,
  ShortAnswerQuestionCard,
} from '../../../../components/Modals/Question';

type ReadingQuestion =
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

type ReadingExercise = {
  id: string;
  lessonLabel: string;
  instruction: string;
  passage: string;
  questions: ReadingQuestion[];
};

type ReadingCourse = {
  exercises: ReadingExercise[];
};

const READING_COURSES: Record<string, ReadingCourse> = {
  '1': {
    exercises: [
      {
        id: '1',
        lessonLabel: 'Bài 1',
        instruction: '다음 글을 읽고 물음에 답하세요.',
        passage:
          '박수진: 안녕하세요? 제 이름은 박수진입니다. 한국 사람입니다. 저는 회사원입니다.\n\n최유진: 안녕하세요? 제 이름은 최유진입니다. 한국 사람입니다. 한국대학교 학생입니다. 반갑습니다.\n\n리양: 안녕하십니까? 저는 리양입니다. 중국 사람입니다. 은행원입니다.',
        questions: [
          {
            id: 'reading-1',
            type: 'ox',
            question: '박수진 씨는 의사입니다.',
            correctValue: 'X',
            trueLabel: '다른',
            falseLabel: '같은',
          },
          {
            id: 'reading-2',
            type: 'ox',
            question: '최유진 씨는 한국대학교 학생입니다.',
            correctValue: 'O',
            trueLabel: '같은',
            falseLabel: '다른',
          },
          {
            id: 'reading-3',
            type: 'ox',
            question: '리양 씨는 의사입니다.',
            correctValue: 'X',
            trueLabel: '같은',
            falseLabel: '다른',
          },
        ],
      },
      {
        id: '2',
        lessonLabel: 'Bài 2',
        instruction: '다음 글을 읽고 물음에 답하세요.',
        passage:
          '안녕하세요? 제 이름은 리양입니다. 중국 사람입니다. 저는 공무원입니다.',
        questions: [
          {
            id: 'reading-4',
            type: 'multiple-choice',
            question: '이 사람은 리양입니까?',
            options: [
              { id: 'a', label: '네' },
              { id: 'b', label: '아니요' },
            ],
            correctOptionId: 'a',
          },
          {
            id: 'reading-5',
            type: 'short-answer',
            question: '이 사람은 중국 학생입니까?',
            placeholder: 'Nhập câu trả lời của bạn',
            acceptedAnswers: ['아니요, 중국 공무원입니다', '아니요, 공무원이에요'],
            exampleAnswer: '아니요, 중국 공무원입니다',
          },
          {
            id: 'reading-6',
            type: 'short-answer',
            question: '이 사람은 관광 가이드입니까?',
            placeholder: 'Nhập câu trả lời của bạn',
            acceptedAnswers: ['아니요, 중국 공무원입니다', '아니요, 공무원이에요'],
            exampleAnswer: '아니요, 중국 공무원입니다',
          },
        ],
      },
    ],
  },
};

function normalizeAnswer(value: string) {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

export default function ReadingPracticeScreen() {
  const router = useRouter();
  const { lessonId, exerciseId } = useLocalSearchParams<{ lessonId?: string; exerciseId?: string }>();
  const resolvedLessonId = lessonId ?? '1';
  const course = READING_COURSES[resolvedLessonId] ?? READING_COURSES['1'];
  const exercise = course.exercises.find((item) => item.id === (exerciseId ?? '1')) ?? course.exercises[0];
  const exerciseIndex = course.exercises.findIndex((item) => item.id === exercise.id);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [expanded, setExpanded] = React.useState(true);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | undefined>(undefined);
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [typedAnswer, setTypedAnswer] = React.useState('');

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
  }, [exercise.id, resetQuestionState]);

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
            pathname: '/lessons/[lessonId]/reading/practice',
            params: {
              lessonId: resolvedLessonId,
              exerciseId: nextExercise.id,
            },
          } as any
        );
        return;
      }

      router.replace(`/lessons/${resolvedLessonId}/reading/explanation` as any);
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
    <LinearGradient colors={['#D8FFAA', '#F5FFE8', '#FFFFFF']} style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        {currentQuestion.type === 'short-answer' ? (
          <KeyboardAwareScrollView
            enableOnAndroid
            extraScrollHeight={Platform.OS === 'ios' ? 90 : 70}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.keyboardContent}
          >
            <View style={styles.sheet}>
              <ReadingPassageCard
                lessonLabel={exercise.lessonLabel}
                instruction={exercise.instruction}
                passage={exercise.passage}
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
            <ReadingPassageCard
              lessonLabel={exercise.lessonLabel}
              instruction={exercise.instruction}
              passage={exercise.passage}
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