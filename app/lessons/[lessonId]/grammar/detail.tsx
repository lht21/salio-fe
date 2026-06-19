import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowBendUpLeftIcon, ArrowBendUpRightIcon, CaretRight, SpeakerHigh } from 'phosphor-react-native';
import * as Speech from 'expo-speech';
import { GestureResponderEvent, Pressable, StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import IconButton from '../../../../components/IconButton';
import { XIcon } from 'phosphor-react-native';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../../../constants/GlobalStyles';
import GrammarService from '@/api/services/grammar.service';
import LessonService from '@/api/services/lesson.service';
import type { Grammar } from '@/api/types/grammar.types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const CARD_WIDTH = SCREEN_WIDTH * 0.86;
const CARD_HEIGHT = SCREEN_WIDTH * 1.16;

type GrammarFlashcardData = {
  id: string;
  structure: string;
  meaning: string;
  description: string;
  rules: string[];
  exampleKo: string;
  exampleVi: string;
};

const mapGrammarToFlashcard = (grammar: Grammar): GrammarFlashcardData => {
  const usageLines = grammar.usage?.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  return {
    id: grammar._id || (grammar as any).id || '',
    structure: grammar.structure,
    meaning: grammar.meaning,
    description: grammar.usage || grammar.explanation || 'Không có mô tả ngữ pháp.',
    rules: usageLines && usageLines.length > 0 ? usageLines : grammar.explanation ? [grammar.explanation] : [],
    exampleKo: grammar.exampleSentences?.[0]?.korean || grammar.exampleSentences?.[0]?.vietnamese ? grammar.exampleSentences[0].korean : '',
    exampleVi: grammar.exampleSentences?.[0]?.vietnamese || '',
  };
};

function GrammarStudyCard({
  card,
  onSwipedLeft,
  onSwipedRight,
}: {
  card: GrammarFlashcardData;
  onSwipedLeft: () => void;
  onSwipedRight: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const handleTap = () => {
    if (step === 1) {
      rotateY.value = withTiming(180, { duration: 320 });
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    rotateY.value = withTiming(0, { duration: 320 });
    setStep(1);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.18;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH);
        runOnJS(onSwipedRight)();
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH);
        runOnJS(onSwipedLeft)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(translateX.value, [-SCREEN_WIDTH, SCREEN_WIDTH], [-14, 14], Extrapolation.CLAMP);
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ: `${rotateZ}deg` },
      ],
    };
  });

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotateY.value, [0, 180], [0, 180], Extrapolation.CLAMP)}deg` }],
    backfaceVisibility: 'hidden',
    zIndex: rotateY.value < 90 ? 2 : 0,
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotateY.value, [0, 180], [180, 360], Extrapolation.CLAMP)}deg` }],
    backfaceVisibility: 'hidden',
    zIndex: rotateY.value >= 90 ? 2 : 0,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
        <Pressable onPress={handleTap} style={styles.pressableArea}>
          <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
            <LinearGradient colors={['#92EB72', '#D9FF9B']} style={styles.frontFace}>
              <Text style={styles.faceLabel}>Ngữ pháp</Text>
              <Text style={styles.structureText}>{card.structure}</Text>
              <View style={styles.meaningPill}>
                <Text style={styles.meaningPillText}>{card.meaning}</Text>
              </View>
              <Text style={styles.descriptionText}>{card.description}</Text>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={[styles.cardFace, backAnimatedStyle]}>
            <View style={styles.backFace}>
              {step === 2 ? (
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Cách dùng</Text>
                  <View style={styles.ruleList}>
                    {card.rules.map((rule) => (
                      <View key={rule} style={styles.ruleItem}>
                        <CaretRight size={16} color={Color.cam} weight="bold" />
                        <Text style={styles.ruleText}>{rule}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.stepContent}>
                  <Text style={styles.exampleKo}>{card.exampleKo}</Text>
                  <Text style={styles.exampleVi}>{card.exampleVi}</Text>
                  <Pressable
                    onPress={(event: GestureResponderEvent) => {
                      event.stopPropagation();
                      if (card.exampleKo) {
                        Speech.stop();
                        Speech.speak(card.exampleKo, {
                          language: 'ko-KR',
                          rate: 0.85,
                          pitch: 1.0,
                        });
                      }
                    }}
                    style={styles.exampleBadge}
                    disabled={!card.exampleKo}
                  >
                    <SpeakerHigh size={18} color="#FFFFFF" weight="fill" />
                    <Text style={styles.exampleBadgeText}>Ví dụ</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </Animated.View>
        </Pressable>

        <View style={styles.tapInstruction}>
          <Text style={styles.stepIndicator}>Mặt {step}</Text>
          <Text style={styles.tapText}>Tap để xoay thẻ, quét để đánh dấu</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

export default function GrammarDetailScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [learnCount, setLearnCount] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [grammarCards, setGrammarCards] = useState<GrammarFlashcardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadGrammar = async () => {
      const lessonIdValue = String(lessonId ?? '');
      if (!lessonIdValue) {
        setErrorMessage('Không tìm thấy lessonId.');
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const grammars = await GrammarService.getLessonGrammar(lessonIdValue);
        setGrammarCards(grammars.map(mapGrammarToFlashcard));
        setCurrentIndex(0);
      } catch (error: any) {
        setErrorMessage(error?.response?.data?.message || error?.message || 'Lỗi khi tải nội dung ngữ pháp.');
      } finally {
        setIsLoading(false);
      }
    };

    loadGrammar();
  }, [lessonId]);

  const totalCards = grammarCards.length;
  const currentCard = grammarCards[currentIndex];

  const handleClose = () => {
    if (currentIndex > 0) {
      setShowExitModal(true);
      return;
    }

    router.back();
  };

  const handleNextCard = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    router.replace(`/lessons/${lessonId}/grammar/exercise` as any);
  };

  const onSwipedLeft = async () => {
    const cardId = currentCard.id;
    if (!cardId) return handleNextCard(); // Bỏ qua gọi API nếu ID không hợp lệ

    setLearnCount((prev) => prev + 1);
    handleNextCard();

    try {
      if (LessonService.updateLessonSectionProgress) {
        await LessonService.updateLessonSectionProgress(String(lessonId), 'grammar', cardId, {
          status: 'learning',
          percentage: 50, // Ghi nhận 50% tiến độ nếu chưa nhớ
          title: currentCard.structure
        });
      }
    } catch (error: any) {
      console.error("Lỗi cập nhật trạng thái learning ngữ pháp:", error.response?.data || error.message);
    }
  };

  const onSwipedRight = async () => {
    const cardId = currentCard.id;
    if (!cardId) return handleNextCard(); // Bỏ qua gọi API nếu ID không hợp lệ

    setKnownCount((prev) => prev + 1);
    handleNextCard();

    try {
      if (LessonService.updateLessonSectionProgress) {
        await LessonService.updateLessonSectionProgress(String(lessonId), 'grammar', cardId, {
          status: 'completed',
          percentage: 100, // Hoàn thành 100% nếu đã nhớ
          title: currentCard.structure
        });
      }
    } catch (error: any) {
      console.error("Lỗi cập nhật trạng thái completed ngữ pháp:", error.response?.data || error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.progressPill}>
            <Text style={styles.progressPillText}>{currentIndex + 1}/{totalCards}</Text>
          </View>
          <IconButton Icon={XIcon} onPress={handleClose} />
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${((currentIndex + 1) / totalCards) * 100}%` }]} />
        </View>

        <View style={styles.counterRow}>
          <Text style={styles.counterLearn}>Chưa nhớ {learnCount}</Text>
          <Text style={styles.counterKnown}>Nhớ {knownCount}</Text>
        </View>
      </View>

      <View style={styles.flashcardArea}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Color.main} />
            <Text style={styles.loadingText}>Đang tải ngữ pháp...</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : totalCards > 0 ? (
          <GrammarStudyCard
            key={currentCard.id}
            card={currentCard}
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.emptyText}>Không có nội dung ngữ pháp cho bài này.</Text>
          </View>
        )}
      </View>

      {totalCards > 0 && !isLoading && !errorMessage ? (
        <View style={styles.swipeHints}>
          <View style={styles.hintColumn}>
            <ArrowBendUpLeftIcon size={40} color={Color.cam} weight="bold" />
            <Text style={styles.hintLearn}>Chưa nhớ</Text>
          </View>
          <View style={styles.hintColumn}>
            <ArrowBendUpRightIcon size={40} color={Color.main} weight="bold" />
            <Text style={styles.hintKnown}>Nhớ</Text>
          </View>
        </View>
      ) : null}

      <ConfirmModal
        isVisible={showExitModal}
        title="Đang học ngữ pháp"
        subtitle="Bạn đang học bài này, nếu thoát bây giờ thì tiến độ sẽ dừng lại."
        cancelText="Thoát"
        confirmText="Học tiếp"
        onCancel={() => {
          setShowExitModal(false);
          router.back();
        }}
        onConfirm={() => setShowExitModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  header: {
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.gap_15,
  },
  progressPill: {
    backgroundColor: Color.main,
    paddingHorizontal: Padding.padding_15,
    paddingVertical: Padding.padding_5,
    borderRadius: Border.br_20,
  },
  progressPillText: {
    color: Color.bg,
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Color.stroke,
    borderRadius: 2,
    marginBottom: Gap.gap_15,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: Color.main,
    borderRadius: 2,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  counterLearn: {
    color: Color.cam,
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
  },
  counterKnown: {
    color: Color.main,
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
  },
  flashcardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  pressableArea: {
    width: '100%',
    height: '100%',
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    borderRadius: 28,
    overflow: 'hidden',
  },
  frontFace: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backFace: {
    flex: 1,
    backgroundColor: '#FFFDF6',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderWidth: 2,
    borderColor: '#E4DCCB',
    borderRadius: 28,
  },
  faceLabel: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12,
    color: '#487431',
    marginBottom: 12,
  },
  structureText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 34,
    lineHeight: 42,
    color: Color.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  meaningPill: {
    backgroundColor: '#215B33',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginBottom: 18,
  },
  meaningPillText: {
    color: '#FFFFFF',
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
  },
  descriptionText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#35513E',
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  stepTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 22,
    color: Color.text,
    textAlign: 'center',
  },
  ruleList: {
    gap: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 16,
    backgroundColor: '#F5F8EA',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  ruleText: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    lineHeight: 21,
    color: Color.text,
  },
  exampleBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Color.cam,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  exampleBadgeText: {
    color: '#FFFFFF',
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
  },
  exampleKo: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 28,
    lineHeight: 36,
    color: Color.text,
    textAlign: 'center',
  },
  exampleVi: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_16,
    lineHeight: 24,
    color: Color.gray,
    textAlign: 'center',
  },
  tapInstruction: {
    position: 'absolute',
    bottom: -62,
    width: '100%',
    alignItems: 'center',
  },
  stepIndicator: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.gray,
    marginBottom: 2,
  },
  tapText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: '#94A3B8',
  },
  swipeHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.padding_30,
    paddingBottom: Padding.padding_30,
  },
  hintColumn: {
    alignItems: 'center',
  },
  hintLearn: {
    color: Color.cam,
    fontFamily: FontFamily.lexendDecaBold,
    marginTop: Gap.gap_5,
  },
  hintKnown: {
    color: Color.main,
    fontFamily: FontFamily.lexendDecaBold,
    marginTop: Gap.gap_5,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: CARD_HEIGHT,
  },
  loadingText: {
    marginTop: Gap.gap_12,
    color: Color.text,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
  },
  errorText: {
    textAlign: 'center',
    color: Color.main,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
  },
  emptyText: {
    textAlign: 'center',
    color: Color.text,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
  },
});
