import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

import { FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import CloseButton from '../../components/CloseButton';
import Button from '../../components/Button';
import SaveToFolderModal from '../../components/ModalOption/SaveToFolderModal';
import { ConfirmModal } from '../../components/ModalResult/ConfirmModal';
import FlashcardService from '../../api/services/flashcard.service';
import VocabularyCard from '../../components/VocabularyCard';

export default function FlashcardStudyResultScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { setId, knownCount, totalCount, history } = useLocalSearchParams();
  
  const [words, setWords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  // Parse lịch sử quẹt thẻ (Format: { [wordId]: boolean } -> true = Đã thuộc, false = Cần học lại)
  const historyMap = history ? JSON.parse(history as string) : {};

  useEffect(() => {
    const fetchSetDetail = async () => {
      if (!setId) return;
      try {
        setIsLoading(true);
        const res = await FlashcardService.getSetById(setId as string);
        if (res.success && res.data) {
          const mappedWords = (res.data.cards || []).map((card: any) => ({
            id: card._id,
            word: card.word,
            type: card.type || card.category || 'Từ vựng',
            phonetic: card.pronunciationText || '',
            meaning: card.meaning,
          }));
          setWords(mappedWords);
        }
      } catch (error) {
        console.error('Lỗi lấy chi tiết bộ flashcard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSetDetail();
  }, [setId]);

  const handleBookmark = (item: any) => {
    setSelectedWord(item);
    setShowSaveModal(true);
  };

  const handleDone = () => {
    router.back();
  };

  const handleRetry = () => {
    router.replace({ pathname: '/vocabulary/flashcard-study', params: { setId } });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.main} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <CloseButton variant="Stroke" onPress={() => setShowExitModal(true)} />
      </View>

      <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* 2. CELEBRATION */}
        <View style={styles.celebrationSection}>
          <Image 
            source={require('../../assets/images/horani/result-levelup.png')} 
            style={styles.illustration} 
            resizeMode="contain" 
          />
          <Text style={styles.titleText}>{t('vocabulary.study_complete', 'Hoàn thành ôn tập!')}</Text>
        </View>

        {/* 3. SCORE BANNER */}
        <View style={styles.scoreBanner}>
          <Text style={styles.scoreText}>{t('vocabulary.remembered_count', 'Đã thuộc')}</Text>
          <Text style={styles.scoreText}>{knownCount}/{totalCount}</Text>
        </View>

        {/* 4. RESULT LIST */}
        <View style={styles.listSection}>
          {words.map((item) => {
            const isKnown = historyMap[item.id] ?? false; 
            return (
              <View key={item.id}>
                <Text style={[styles.resultLabel, isKnown ? styles.textKnown : styles.textLearning]}>
                  {isKnown ? t('vocabulary.remembered_count', 'Đã thuộc') : t('vocabulary.learn_again', 'Cần học lại')}
                </Text>
                <VocabularyCard 
                  item={{ ...item, pos: item.type }} 
                  onToggleFavorite={() => handleBookmark(item)} 
                />
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* 5. ACTION BUTTONS */}
      <View style={styles.footer}>
        <Button 
          title={t('vocabulary.back_to_set', 'Về bộ từ vựng')} 
          variant="Outline" 
          onPress={handleDone} 
        />
        <Button 
          title={t('vocabulary.study_again', 'Ôn tập lại')} 
          variant="Green" 
          onPress={handleRetry} 
          style={{ marginTop: Gap.gap_10 }}
        />
      </View>

      {/* MODALS */}
      <SaveToFolderModal 
        isVisible={showSaveModal} 
        onClose={() => setShowSaveModal(false)}
        wordData={selectedWord}
      />

      <ConfirmModal 
        isVisible={showExitModal}
        title="Đang xem kết quả mà"
        subtitle="Bạn muốn trở về bộ từ vựng ngay bây giờ?"
        cancelText="Ở lại"
        confirmText="Về bộ từ vựng"
        onCancel={() => setShowExitModal(false)}
        onConfirm={() => {
          setShowExitModal(false);
          handleDone();
        }}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  header: { alignItems: 'flex-end', paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_10 },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: Padding.padding_20, paddingBottom: 40 },
  
  celebrationSection: { alignItems: 'center', marginBottom: Gap.gap_20 },
  illustration: { width: 160, height: 160, marginBottom: Gap.gap_10 },
  titleText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_24, color: colors.xanh },

  scoreBanner: {
    flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.greenLight,
    padding: Padding.padding_15, borderRadius: Border.br_15, marginBottom: Gap.gap_20,
  },
  scoreText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: colors.main2 },
  
  listSection: { width: '100%' },

  resultLabel: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14,
    marginBottom: 8,
    marginLeft: 4,
  },
  textKnown: { color: colors.main2 },
  textLearning: { color: colors.cam },
  
  footer: {
    paddingHorizontal: Padding.padding_20, paddingVertical: Padding.padding_20,
    backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.stroke,
  }
});