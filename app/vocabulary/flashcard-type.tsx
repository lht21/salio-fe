import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform, Keyboard as RNKeyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PenNibIcon } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Color, FontFamily, FontSize, Gap, Padding, Border } from '../../constants/GlobalStyles';
import { QuizHeader } from '../../components/Modals/Question';
import { ConfirmModal } from '../../components/ModalResult/ConfirmModal';
import Button from '../../components/Button';
import FlashcardService from '../../api/services/flashcard.service';
import VocabularyService from '../../api/services/vocabulary.service';

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
      result += decomposeJamo(str.charAt(i)); // non-Hangul or independent jamo
    }
  }
  return result;
}

export default function FlashcardTypeScreen() {
  const router = useRouter();
  const { setId } = useLocalSearchParams<{ setId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [allVocabs, setAllVocabs] = useState<any[]>([]);
  
  // Vòng học hiện tại
  const [currentRoundCards, setCurrentRoundCards] = useState<any[]>([]);
  const [nextRoundCards, setNextRoundCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [inputText, setInputText] = useState('');
  const [isMistake, setIsMistake] = useState(false);
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
      const res = await FlashcardService.getSetById(setId as string);
      if (res && res.success && res.data && res.data.cards) {
        const validCards = res.data.cards.filter((c: any) => c.word && c.meaning);
        
        // Shuffle
        for (let i = validCards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [validCards[i], validCards[j]] = [validCards[j], validCards[i]];
        }

        setAllVocabs(validCards);
        setCurrentRoundCards(validCards);
      }
    } catch (error) {
      console.error('Lỗi khi tải bộ từ vựng:', error);
      Alert.alert('Lỗi', 'Không thể tải bộ từ vựng.');
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động focus input
  useEffect(() => {
    if (!isLoading && currentRoundCards.length > 0 && !isMistake) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, currentRoundCards, isLoading, isMistake]);

  const handleFinishGame = () => {
    router.replace({
      pathname: '/vocabulary/flashcard-quiz-result',
      params: {
        setId,
        correctCount: allVocabs.length - incorrectCount,
        totalCount: allVocabs.length,
        history: JSON.stringify({}),
      }
    });
  };

  const currentCard = currentRoundCards[currentIndex];

  const handleTextChange = (text: string) => {
    if (!currentCard || isMistake) return;
    setInputText(text);

    const targetWord = currentCard.word;

    // Nếu gõ hoàn toàn đúng
    if (text === targetWord) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      VocabularyService.markStatus(currentCard._id, { status: 'remembered' }).catch(err => console.error(err));
      
      // Chuyển sang từ tiếp theo sau một chút delay ngắn
      setTimeout(() => {
        handleNextCard();
      }, 300);
      return;
    }

    // Nếu gõ sai (text không phải là chuỗi bắt đầu của targetWord)
    const targetDecomposed = disassembleHangul(targetWord);
    const textDecomposed = disassembleHangul(text);

    if (textDecomposed.length > 0 && !targetDecomposed.startsWith(textDecomposed)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsMistake(true);
      setIncorrectCount(prev => prev + 1);
      
      // Ghi nhận vòng sau
      setNextRoundCards(prev => {
        if (!prev.find(c => c._id === currentCard._id)) {
          return [...prev, currentCard];
        }
        return prev;
      });

      VocabularyService.markStatus(currentCard._id, { status: 'learning' }).catch(err => console.error(err));
      RNKeyboard.dismiss();
    }
  };

  const handleNextCard = () => {
    setInputText('');
    setIsMistake(false);

    if (currentIndex < currentRoundCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Hết vòng hiện tại, chuyển sang vòng tiếp theo nếu có từ sai
      if (nextRoundCards.length > 0) {
        // Shuffle vòng tiếp theo
        const nextRound = [...nextRoundCards];
        for (let i = nextRound.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nextRound[i], nextRound[j]] = [nextRound[j], nextRound[i]];
        }
        setCurrentRoundCards(nextRound);
        setNextRoundCards([]);
        setCurrentIndex(0);
      } else {
        // Xong toàn bộ
        handleFinishGame();
      }
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Color.main} />
      </SafeAreaView>
    );
  }

  if (allVocabs.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: FontFamily.lexendDecaMedium }}>Không có từ vựng hợp lệ.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <QuizHeader
        current={currentIndex + 1}
        total={currentRoundCards.length}
        incorrectCount={incorrectCount}
        onClose={() => setShowExitModal(true)}
        icon={<PenNibIcon size={32} color={Color.text} />}
        sharedTransitionTag="type_icon"
      />

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.content}>
          <Text style={styles.meaningText}>{currentCard?.meaning}</Text>
          {currentCard?.phonetic ? (
            <Text style={styles.phoneticText}>{currentCard.phonetic}</Text>
          ) : (
             <View style={{height: Gap.gap_20}}/>
          )}
          
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={[styles.input, isMistake && styles.inputError]}
              value={inputText}
              onChangeText={handleTextChange}
              placeholder="Gõ từ tiếng Hàn..."
              placeholderTextColor={Color.gray}
              editable={!isMistake}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
            />
          </View>

          {isMistake && (
            <Animated.View entering={FadeInDown} style={styles.feedbackContainer}>
              <View style={styles.correctAnswerBox}>
                <Text style={styles.feedbackTitle}>Đáp án đúng:</Text>
                <Text style={styles.correctWord}>{currentCard?.word}</Text>
              </View>
              <Button title="Tiếp tục" onPress={handleNextCard} variant="Green" />
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>

      <ConfirmModal
        isVisible={showExitModal}
        title="Đang học dở mà"
        subtitle="Bạn sắp hoàn thành rồi, cố thêm chút nữa nhé!"
        cancelText="Vẫn rời đi"
        confirmText="Làm tiếp"
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
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Padding.padding_20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meaningText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_24,
    color: Color.text,
    textAlign: 'center',
    marginBottom: Gap.gap_10,
  },
  phoneticText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    color: Color.gray,
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
    color: Color.text,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: Border.br_20,
    paddingHorizontal: Padding.padding_20,
    paddingVertical: Padding.padding_15,
    textAlign: 'center',
  },
  inputError: {
    borderColor: Color.red,
    color: Color.red,
    backgroundColor: '#FFF2F2',
  },
  feedbackContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: Gap.gap_20,
  },
  correctAnswerBox: {
    backgroundColor: '#E5F4E2', // Xanh nhạt
    padding: Padding.padding_20,
    borderRadius: Border.br_20,
    width: '100%',
    alignItems: 'center',
    marginBottom: Gap.gap_20,
    borderWidth: 1,
    borderColor: Color.main,
  },
  feedbackTitle: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.main,
    marginBottom: 5,
  },
  correctWord: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 32,
    color: Color.main,
  },
});
