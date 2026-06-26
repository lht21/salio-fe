import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XIcon } from 'phosphor-react-native';
import PuzzleIcon from '../../components/icons/PuzzleIcon';
import * as Haptics from 'expo-haptics';

import { Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import { QuizHeader } from '../../components/Modals/Question';
import { ConfirmModal } from '../../components/ModalResult/ConfirmModal';
import IconButton from '../../components/IconButton';
import FlashcardService from '../../api/services/flashcard.service';
import VocabularyService from '../../api/services/vocabulary.service';
import apiClient from '../../api/client';
import MatchCard from '../../components/MatchCard'; // We will create this

type CardType = 'word' | 'meaning';

export interface MatchCardData {
  id: string;
  vocabId: string;
  type: CardType;
  text: string;
}

const BATCH_SIZE = 6; // Số cặp từ mỗi vòng (12 thẻ)

export default function FlashcardMatchScreen() {
  const router = useRouter();
  const { setId } = useLocalSearchParams<{ setId: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [allVocabs, setAllVocabs] = useState<any[]>([]);
  const [batchIndex, setBatchIndex] = useState(0);
  const [currentBatch, setCurrentBatch] = useState<MatchCardData[]>([]);

  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [matchedCardIds, setMatchedCardIds] = useState<string[]>([]);
  const [errorCardIds, setErrorCardIds] = useState<string[]>([]);
  
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);

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
        // Lọc các từ hợp lệ
        const validCards = res.data.cards.filter((c: any) => c.word && c.meaning);
        setAllVocabs(validCards);
        loadBatch(validCards, 0);
      }
    } catch (error) {
      console.error('Lỗi khi tải bộ từ vựng:', error);
      Alert.alert('Lỗi', 'Không thể tải bộ từ vựng.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBatch = (vocabs: any[], index: number) => {
    const startIndex = index * BATCH_SIZE;
    const endIndex = startIndex + BATCH_SIZE;
    const subset = vocabs.slice(startIndex, endIndex);

    if (subset.length === 0) {
      // Hoàn thành tất cả các từ
      handleFinishGame();
      return;
    }

    const cards: MatchCardData[] = [];
    subset.forEach(v => {
      cards.push({ id: `${v._id}-word`, vocabId: v._id, type: 'word', text: v.word });
      cards.push({ id: `${v._id}-meaning`, vocabId: v._id, type: 'meaning', text: v.meaning });
    });

    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    setCurrentBatch(cards);
    setSelectedCardIds([]);
    setMatchedCardIds([]);
    setErrorCardIds([]);
  };

  const handleFinishGame = () => {
    router.replace({
      pathname: '/vocabulary/flashcard-quiz-result',
      params: {
        setId,
        correctCount: allVocabs.length - incorrectCount,
        totalCount: allVocabs.length,
        history: JSON.stringify({}), // Gửi history rỗng hoặc ghi nhận thật nếu cần
      }
    });
  };

  const handleCardPress = (card: MatchCardData) => {
    // Không cho bấm nếu đang chọn 2 thẻ, hoặc thẻ đã ghép, hoặc đang có lỗi
    if (selectedCardIds.length >= 2 || matchedCardIds.includes(card.id) || errorCardIds.length > 0) return;

    // Bấm lại thẻ đang chọn thì bỏ chọn
    if (selectedCardIds.includes(card.id)) {
      setSelectedCardIds(prev => prev.filter(id => id !== card.id));
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newSelected = [...selectedCardIds, card.id];
    setSelectedCardIds(newSelected);

    // Khi đã chọn đủ 2 thẻ
    if (newSelected.length === 2) {
      const card1 = currentBatch.find(c => c.id === newSelected[0]);
      const card2 = currentBatch.find(c => c.id === newSelected[1]);

      if (!card1 || !card2) return;

      if (card1.vocabId === card2.vocabId) {
        // ĐÚNG CẶP
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Cập nhật tiến độ: Nếu muốn, có thể gọi API ở đây
        VocabularyService.markStatus(card1.vocabId, { status: 'remembered' }).catch(err => console.error(err));

        // Đợi 1 tí để User nhìn thấy màu xanh (nếu cần), ở đây cho xanh thẳng và fade ra
        setTimeout(() => {
          const newMatched = [...matchedCardIds, card1.id, card2.id];
          setMatchedCardIds(newMatched);
          setSelectedCardIds([]);

          // Kiểm tra xem đã ghép hết vòng này chưa
          if (newMatched.length === currentBatch.length) {
            setTimeout(() => {
              setBatchIndex(prev => {
                const nextIdx = prev + 1;
                loadBatch(allVocabs, nextIdx);
                return nextIdx;
              });
            }, 600);
          }
        }, 500);

      } else {
        // SAI CẶP
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setIncorrectCount(prev => prev + 1);
        setErrorCardIds(newSelected);

        setTimeout(() => {
          setErrorCardIds([]);
          setSelectedCardIds([]);
        }, 800);
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
        <Text style={{ fontFamily: FontFamily.lexendDecaMedium }}>Không có câu hỏi nào để hiển thị.</Text>
        <IconButton Icon={XIcon} onPress={() => router.back()} style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  const currentCount = Math.min(batchIndex * BATCH_SIZE + BATCH_SIZE, allVocabs.length);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* HEADER */}
      <QuizHeader
        current={currentCount}
        total={allVocabs.length}
        incorrectCount={incorrectCount}
        onClose={() => setShowExitModal(true)}
        icon={<PuzzleIcon width={40} height={40} />}
        sharedTransitionTag="match_icon"
      />

      {/* GAME AREA */}
      <ScrollView 
        style={styles.gameArea}
        contentContainerStyle={styles.gameAreaContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsContainer}>
          {currentBatch.map(card => {
            const isSelected = selectedCardIds.includes(card.id);
            const isMatched = matchedCardIds.includes(card.id);
            const isError = errorCardIds.includes(card.id);
            
            return (
              <MatchCard
                key={card.id}
                data={card}
                isSelected={isSelected}
                isMatched={isMatched}
                isError={isError}
                onPress={() => handleCardPress(card)}
              />
            );
          })}
        </View>
      </ScrollView>

      <ConfirmModal
        isVisible={showExitModal}
        title="Đang chơi dở mà"
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
  gameArea: {
    flex: 1,
    paddingHorizontal: Padding.padding_15,
    paddingTop: 20,
  },
  gameAreaContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
