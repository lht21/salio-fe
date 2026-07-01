import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform, Keyboard as RNKeyboard, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PenNibIcon, XIcon, CheckCircleIcon } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { FontFamily, FontSize, Gap, Padding, Border } from '../../../../constants/GlobalStyles';
import { QuizHeader, AnswerOption } from '../../../../components/Modals/Question';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';
import Button from '../../../../components/Button';
import IconButton from '../../../../components/IconButton';
import PracticeService from '../../../../api/services/practice.service';
import VocabularyService from '../../../../api/services/vocabulary.service';
import SwipableFlashcard, { FlashcardData } from '../../../../components/SwipableFlashcard';
import CheckListIcon from '../../../../components/icons/CheckListIcon';
import { useTheme } from "@/contexts/ThemeContext";
import { PracticeType } from '../../../../api/types/practice.types';

const CHO_SUNG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JUNG_SUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const JONG_SUNG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

const COMPLEX_JUNG: Record<string, string> = {
  'ㅘ': 'ㅗㅏ', 'ㅙ': 'ㅗㅐ', 'ㅚ': 'ㅗㅣ',
  'ㅝ': 'ㅜㅓ', 'ㅞ': 'ㅜㅔ', 'ㅟ': 'ㅜㅣ',
  'ㅢ': 'ㅡㅣ'
};

const COMPLEX_JONG: Record<string, string> = {
  'ㄳ': 'ㄱㅅ', 'ㄵ': 'ㄴㅈ', 'ㄶ': 'ㄴㅎ',
  'ㄺ': 'ㄹㄱ', 'ㄻ': 'ㄹㅁ', 'ㄼ': 'ㄹㅂ',
  'ㄽ': 'ㄹㅅ', 'ㄾ': 'ㄹㅌ', 'ㄿ': 'ㄹㅍ', 'ㅀ': 'ㄹㅎ',
  'ㅄ': 'ㅂㅅ'
};

function decomposeJamo(jamo: string) {
  return COMPLEX_JUNG[jamo] || COMPLEX_JONG[jamo] || jamo;
}

function disassembleHangul(str: string) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 0xAC00;
    if (code > -1 && code < 11172) {
      result += CHO_SUNG[Math.floor(code / 588)];
      result += decomposeJamo(JUNG_SUNG[Math.floor((code % 588) / 28)]);
      if (code % 28 !== 0) result += decomposeJamo(JONG_SUNG[code % 28]);
    } else {
      result += decomposeJamo(str.charAt(i));
    }
  }
  return result;
}

type QueueItem = {
  vocab: any;
  stage: number; // 1: Quiz, 2: Type
  options?: { id: string; text: string }[];
};

export default function ReviewVocabScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const router = useRouter();
  const { type, setId } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [allVocabs, setAllVocabs] = useState<any[]>([]);

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const [inputText, setInputText] = useState('');

  const [showMistakeFlashcard, setShowMistakeFlashcard] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (setId) {
      fetchVocabularies();
    }
  }, [setId]);

  const fetchVocabularies = async () => {
    try {
      setIsLoading(true);
      const res = await PracticeService.getPreparationMaterials(type as PracticeType, setId as string);
      if (res && res.success && res.data && res.data.vocabularies) {
        const validCards = res.data.vocabularies.filter((c: any) => c.word && c.meaning);

        if (validCards.length === 0) {
          Alert.alert('Trống', 'Không có từ vựng nào trong đề thi này.', [
            { text: 'Trở về', onPress: () => router.back() }
          ]);
          return;
        }

        // Shuffle
        const shuffled = [...validCards].sort(() => Math.random() - 0.5);
        setAllVocabs(validCards);

        // Prepare initial queue (Stage 1)
        const initialQueue: QueueItem[] = shuffled.map(vocab => ({
          vocab,
          stage: 1,
          options: generateOptions(vocab, validCards)
        }));
        setQueue(initialQueue);
      }
    } catch (error) {
      console.error('Lỗi khi tải bộ từ vựng:', error);
      Alert.alert('Lỗi', 'Không thể tải bộ từ vựng.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateOptions = (word: any, allWords: any[]) => {
    const others = allWords.filter(w => w._id !== word._id);
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    const opts = [word, ...shuffledOthers].map(w => ({ id: w._id, text: w.meaning }));
    return opts.sort(() => 0.5 - Math.random());
  };

  // Tự động focus input ở Stage 2
  useEffect(() => {
    if (!isLoading && queue[currentIndex]?.stage === 2 && !showMistakeFlashcard) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, queue, isLoading, showMistakeFlashcard]);

  const currentItem = queue[currentIndex];
  const isFinished = currentIndex >= queue.length && queue.length > 0;

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedAnswerId(null);
    setInputText('');
    setShowMistakeFlashcard(false);
    setCurrentIndex(prev => prev + 1);
  };

  const playSound = async (isCorrect: boolean) => {
    try {
      const soundFile = isCorrect ? require('../../../../assets/audio/correct.mp3') : require('../../../../assets/audio/incorrect.mp3');
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log("Lỗi phát âm thanh:", error);
    }
  };

  // --- STAGE 1: QUIZ ---
  const handleSelectOption = (optionId: string) => {
    if (isAnswered || !currentItem) return;

    setSelectedAnswerId(optionId);
    setIsAnswered(true);

    const isAnswerCorrect = optionId === currentItem.vocab._id;

    if (isAnswerCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playSound(true);
      VocabularyService.markStatus(currentItem.vocab._id, { status: 'learning' }).catch(err => console.error(err));

      // Push to end of queue as stage 2
      setQueue(prev => [...prev, { vocab: currentItem.vocab, stage: 2 }]);

      setTimeout(() => {
        handleNext();
      }, 500);
    } else {
      handleIncorrectAnswer();
    }
  };

  const handleDontKnowQuiz = () => {
    if (isAnswered) return;
    setSelectedAnswerId('dont_know');
    setIsAnswered(true);
    handleIncorrectAnswer();
  };

  // --- STAGE 2: TYPE ---
  const handleTextChange = (text: string) => {
    if (!currentItem || showMistakeFlashcard) return;
    setInputText(text);

    const targetWord = currentItem.vocab.word;

    // Gõ đúng
    if (text === targetWord) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playSound(true);
      VocabularyService.markStatus(currentItem.vocab._id, { status: 'remembered' }).catch(err => console.error(err));
      // Xong hoàn toàn từ này, không push thêm
      setTimeout(() => {
        handleNext();
      }, 300);
      return;
    }

    // Gõ sai
    const targetDecomposed = disassembleHangul(targetWord);
    const textDecomposed = disassembleHangul(text);

    if (textDecomposed.length > 0 && !targetDecomposed.startsWith(textDecomposed)) {
      handleIncorrectAnswer();
      RNKeyboard.dismiss();
    }
  };

  const handleIncorrectAnswer = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    playSound(false);
    setIncorrectCount(prev => prev + 1);

    // Giáng cấp về Vòng 1 và push xuống cuối hàng đợi để học lại
    setQueue(prev => [...prev, {
      vocab: currentItem.vocab,
      stage: 1,
      options: generateOptions(currentItem.vocab, allVocabs)
    }]);

    VocabularyService.markStatus(currentItem.vocab._id, { status: 'forgotten' }).catch(err => console.error(err));
    setShowMistakeFlashcard(true);
  };

  const getOptionStatus = (optionId: string) => {
    if (!isAnswered || !currentItem) return 'default';
    const isThisOptionSelected = selectedAnswerId === optionId;
    const isThisOptionCorrect = currentItem.vocab._id === optionId;

    if (isThisOptionSelected && isThisOptionCorrect) return 'correct';
    if (isThisOptionSelected && !isThisOptionCorrect) return 'incorrect';
    if (!isThisOptionSelected && isThisOptionCorrect) return 'missed-correct';
    return 'disabled';
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  // Màn hình hoàn thành
  if (isFinished) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <CheckCircleIcon size={80} color={colors.primary} weight="fill" />
        <Text style={styles.congratsText}>Chúc mừng!</Text>
        <Text style={styles.congratsSubText}>Bạn đã ghi nhớ toàn bộ từ vựng trong đề thi này.</Text>
        <Button title="Quay lại đề thi" variant="Green" onPress={() => router.back()} style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  // Màn hình hiển thị lỗi (Flashcard)
  if (showMistakeFlashcard && currentItem) {
    const flashcardData: FlashcardData = {
      id: currentItem.vocab._id,
      word: currentItem.vocab.word,
      phonetic: currentItem.vocab.pronunciation || currentItem.vocab.phonetic || '',
      meaning: currentItem.vocab.meaning,
      type: currentItem.vocab.pos || currentItem.vocab.type || '',
      hanja: Array.isArray(currentItem.vocab.hanja) ? currentItem.vocab.hanja : (currentItem.vocab.hanja ? [currentItem.vocab.hanja] : []),
      example: currentItem.vocab.example || '',
      highlight: currentItem.vocab.highlight || '',
      image: currentItem.vocab.image || ''
    };

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <IconButton Icon={XIcon} onPress={() => setShowExitModal(true)} />
          <Text style={styles.headerTitle}>Học lại từ này nhé</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.flashcardWrapper}>
          <SwipableFlashcard
            card={flashcardData}
            onSwipedLeft={handleNext}
            onSwipedRight={handleNext}
          />
        </View>
        <View style={styles.bottomFixed}>
          <Button title="Tiếp tục" variant="Green" onPress={handleNext} />
        </View>

        <ConfirmModal
          isVisible={showExitModal}
          title="Đang ôn tập dở mà"
          subtitle="Bạn có chắc chắn muốn rời đi không?"
          cancelText="Vẫn rời đi"
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <QuizHeader
        current={currentIndex + 1}
        total={queue.length}
        incorrectCount={incorrectCount}
        onClose={() => setShowExitModal(true)}
        icon={currentItem?.stage === 1 ? <CheckListIcon width={32} height={32} /> : <PenNibIcon size={32} color={colors.textPrimary} />}
      />

      {currentItem?.stage === 1 ? (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.questionText}>{currentItem.vocab.word}</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.dontKnowButton} onPress={handleDontKnowQuiz} disabled={isAnswered}>
              <Text style={styles.dontKnowText}>Bạn không biết?</Text>
            </TouchableOpacity>
            {currentItem.options?.map((opt, idx) => (
              <AnswerOption
                key={opt.id}
                index={idx}
                text={opt.text}
                status={getOptionStatus(opt.id)}
                onPress={() => handleSelectOption(opt.id)}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.contentType}>
            <Text style={styles.meaningText}>{currentItem?.vocab.meaning}</Text>
            {currentItem?.vocab.pronunciation || currentItem?.vocab.phonetic ? (
              <Text style={styles.phoneticText}>{currentItem.vocab.pronunciation || currentItem.vocab.phonetic}</Text>
            ) : (
              <View style={{ height: Gap.gap_20 }} />
            )}

            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={[styles.input, showMistakeFlashcard && styles.inputError]}
                value={inputText}
                onChangeText={handleTextChange}
                placeholder="Gõ từ tiếng Hàn..."
                placeholderTextColor={colors.textSecondary}
                editable={!showMistakeFlashcard}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
              />
            </View>
            <TouchableOpacity style={styles.dontKnowButtonType} onPress={() => handleIncorrectAnswer()} disabled={showMistakeFlashcard}>
              <Text style={styles.dontKnowText}>Bạn không nhớ?</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      <ConfirmModal
        isVisible={showExitModal}
        title="Đang ôn tập dở mà"
        subtitle="Bạn sắp hoàn thành rồi, cố thêm chút nữa nhé!"
        cancelText="Vẫn rời đi"
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

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_30,
    paddingBottom: 40,
  },
  questionText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 32,
    color: colors.textPrimary,
    marginBottom: Gap.gap_20,
    textAlign: 'center',
  },
  optionsContainer: { width: '100%' },
  dontKnowButton: {
    marginBottom: Gap.gap_15,
    alignSelf: "flex-end"
  },
  dontKnowText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 16,
    color: colors.cam,
    textDecorationLine: 'underline',
  },
  contentType: {
    flex: 1,
    paddingHorizontal: Padding.padding_20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meaningText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_24,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: Gap.gap_10,
  },
  phoneticText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: Gap.gap_20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: Gap.gap_20,
  },
  input: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_24,
    color: colors.textPrimary,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: Border.br_20,
    paddingHorizontal: Padding.padding_20,
    paddingVertical: Padding.padding_15,
    textAlign: 'center',
  },
  inputError: {
    borderColor: colors.red,
    color: colors.red,
    backgroundColor: '#FFF2F2',
  },
  dontKnowButtonType: {
    marginTop: Gap.gap_10,
  },
  congratsText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 28,
    color: colors.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  congratsSubText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.padding_20,
    paddingTop: 10,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    color: colors.cam,
  },
  flashcardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomFixed: {
    paddingHorizontal: Padding.padding_20,
    paddingBottom: 40,
  }
});
