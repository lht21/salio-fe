import { useRouter, useFocusEffect } from 'expo-router';
import React, { useCallback, useState, useMemo } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Border, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';

// Import các components đã tách
import FlashcardSetCard from '../../components/FlashcardSetCard';
import VocabularyService from '../../api/services/vocabulary.service';
import FlashcardService from '../../api/services/flashcard.service';
import apiClient from '../../api/client';
import ReviewModeCard from '../../components/ReviewModeCard';
import StatCard from '../../components/StatCard';
import CreateSetButton from '../../components/CreateSetButton';
import PuzzleIcon from '../../components/icons/PuzzleIcon';
import Cards02Icon from '../../components/icons/Cards02Icon';
import CheckListIcon from '../../components/icons/CheckListIcon';
import { CaretDoubleRightIcon } from 'phosphor-react-native';

type VocabularyItem = {
  id: string;
  word: string;
  pos: string;
  phonetic: string;
  meaning: string;
  isFavorite: boolean;
  status: string;
};


export default function VocabularyScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [missionD2, setMissionD2] = useState<any>(null);
  const [stats, setStats] = useState({ mastered: 0, learning: 0, forgotten: 0 });

  const fetchData = async () => {
    try {
      const [setsRes, favoriteRes, missionsRes, masteredRes, learningRes, forgottenRes] = await Promise.all([
        FlashcardService.getAllSets('my_sets'),
        FlashcardService.getSetById('favorite'),
        apiClient.get('/api/v1/gamification/daily-missions').catch(() => null),
        VocabularyService.getLearningProgress({ status: 'remembered', limit: 1 }).catch(() => ({ data: { total: 0 } } as any)),
        VocabularyService.getLearningProgress({ status: 'learning', limit: 1 }).catch(() => ({ data: { total: 0 } } as any)),
        VocabularyService.getLearningProgress({ status: 'forgotten', limit: 1 }).catch(() => ({ data: { total: 0 } } as any)),
      ]);

      if (missionsRes?.data?.success) {
        const d2 = missionsRes.data.data.find((m: any) => m.id === 'D2');
        setMissionD2(d2);
      }

      setStats({
        mastered: masteredRes?.data?.total || 0,
        learning: learningRes?.data?.total || 0,
        forgotten: forgottenRes?.data?.total || 0,
      });

      if (setsRes.success) {
        const images = [
          require('../../assets/images/horani/sc1_b0.png'),
          require('../../assets/images/horani/sc1_b2.png'),
          require('../../assets/images/horani/sc1_b3.png'),
        ];

        const mappedSets = setsRes.data.map((set: any, index: number) => ({
          id: set._id,
          title: set.name,
          totalWords: set.cards.length,
          index,
          imageSource: images[index % images.length],
        }));
        setFlashcardSets(mappedSets);
      }

      if (favoriteRes.success && favoriteRes.data) {
        const cards = favoriteRes.data.cards || [];
        const mappedVocabs: VocabularyItem[] = cards.map((card: any) => ({
          id: card._id,
          word: card.word,
          pos: card.type || card.category || '',
          phonetic: card.pronunciationText || '',
          meaning: card.meaning,
          isFavorite: true,
          status: card.learningStatus?.status || 'learning',
        }));
        setVocabularyItems(mappedVocabs);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu Vocabulary Screen:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData().finally(() => setIsLoading(false));
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, []);

  const favoriteCount = vocabularyItems.filter(item => item.isFavorite).length;
  const allSetsCount = flashcardSets.reduce((sum, set) => sum + (set.totalWords || 0), 0);
  const totalAllCount = favoriteCount + allSetsCount;

  const handleStudyFlashcard = (setId: string, wordCount: number) => {
    if (wordCount === 0) {
      return Alert.alert(t('common.notice', 'Thông báo'), t('vocabulary.empty_study', 'Bộ từ vựng này chưa có từ nào. Hãy thêm từ vựng trước khi học nhé!'));
    }
    router.push({ pathname: '/vocabulary/flashcard-study', params: { setId } });
  };

  const handleQuiz = (setId: string, wordCount: number) => {
    if (wordCount === 0) {
      return Alert.alert(t('common.notice', 'Thông báo'), t('vocabulary.empty_quiz', 'Bộ từ vựng này chưa có từ nào. Hãy thêm từ vựng trước khi kiểm tra nhé!'));
    }
    router.push({ pathname: '/vocabulary/flashcard-quiz', params: { setId } });
  };

  const handleMatch = (setId: string, wordCount: number) => {
    if (wordCount === 0) {
      return Alert.alert(t('common.notice', 'Thông báo'), t('vocabulary.empty_match', 'Bộ từ vựng này chưa có từ nào. Hãy thêm từ vựng trước khi chơi ghép thẻ nhé!'));
    }
    router.push({ pathname: '/vocabulary/flashcard-match', params: { setId } });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          // Bù trừ chiều cao của Tab Bar (86px) + lề bổ sung (24px) + safe area
          { paddingBottom: 110 + insets.bottom }
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.main}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('vocabulary.notebook', 'Sổ tay từ vựng')}</Text>
          <CreateSetButton onPress={() => router.push('/vocabulary/create-set')} />
        </View>

        {/* Mission Banner */}
        {missionD2 && !missionD2.isCompleted && (
          <View style={styles.missionBanner}>
            <Text style={styles.missionBannerText}>
              🎯 Nhiệm vụ hôm nay: Hãy học thêm {10 - missionD2.progress} từ vựng nữa để nhận mây nhé!
            </Text>
          </View>
        )}

        {/* Stats Section */}
        <View style={styles.statsSectionWrapper}>
          <LinearGradient
            // Tạo dải màu chuyển từ trong suốt sang màu #DFF5A0 ở đúng 50% chiều cao
            colors={['transparent', 'transparent', '#DFF5A0', '#DFF5A0']}
            locations={[0, 0.5, 0.5, 1]}
            style={styles.statsBg}
          >
            <View style={styles.statsContainer}>
              <StatCard label="Thành thạo" value={stats.mastered} valueColor={colors.main2} />
              <StatCard label="Đang học" value={stats.learning} valueColor={colors.blue} />
              <StatCard label="Quên rồi" value={stats.forgotten} valueColor={colors.red} />
            </View>
            <TouchableOpacity style={styles.detailBtn} activeOpacity={0.7} onPress={() => {/* TODO: Navigate to detail */ }}>
              <CaretDoubleRightIcon size={18} color={colors.text} weight="bold" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Ôn luyện tổng hợp */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ôn luyện tổng hợp</Text>
          <View style={styles.reviewModesContainer}>
            <ReviewModeCard
              label="Chế độ flashcard"
              icon={<Cards02Icon />}
              onPress={() => handleStudyFlashcard('all', totalAllCount)}
              sharedTransitionTag="study_flashcard_icon"
            />
            <ReviewModeCard
              label="Câu hỏi trắc nghiệm"
              icon={<CheckListIcon />}
              onPress={() => handleQuiz('all', totalAllCount)}
              sharedTransitionTag="quiz_icon"
            />
            <ReviewModeCard
              label="Ghép thẻ"
              icon={<PuzzleIcon />}
              onPress={() => handleMatch('all', totalAllCount)}
              sharedTransitionTag="match_icon"
            />
          </View>
        </View>



        {/* Flashcard Sets List */}
        <View style={styles.setsListContainer}>
          {favoriteCount >= 0 && (
            <FlashcardSetCard
              title={t('vocabulary.favorite', 'Từ vựng yêu thích')}
              totalWords={favoriteCount}
              isSpecial={true}
              imageSource={require('../../assets/images/horani/horani_vocab.png')}
              onPress={() => {
                router.push({
                  pathname: '/vocabulary/flashcardset-detail',
                  params: { id: 'favorite', title: t('vocabulary.favorite', 'Từ vựng yêu thích') }
                });
              }}
            />
          )}

          {flashcardSets.map((set) => (
            <FlashcardSetCard
              key={set.id}
              title={set.title}
              totalWords={set.totalWords}
              backgroundColor={colors.bg}
              imageSource={set.imageSource}
              onPress={() => {
                router.push({
                  pathname: '/vocabulary/flashcardset-detail',
                  params: { id: set.id, title: set.title }
                });
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Padding.padding_15 || 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.gap_20 || 20
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_24 || 24,
    color: colors.text
  },
  missionBanner: {
    backgroundColor: colors.historyYellowBg || '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  missionBannerText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 14,
    color: colors.text,
    flex: 1
  },
  sectionContainer: {
    marginTop: Gap.gap_20 || 20,
    marginBottom: Gap.gap_15 || 15,
  },
  sectionTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: colors.text,
    marginBottom: Gap.gap_15 || 15,
  },
  reviewModesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Gap.gap_10 || 10,
  },
  statsSectionWrapper: {
    height: 150, // Chiều cao để thẻ stat có thể absolute bên trong
    marginHorizontal: -(Padding.padding_15 || 15), // Tràn ra 2 bên
    marginBottom: Gap.gap_20 || 20,
  },
  statsBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  statsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: Padding.padding_15 || 15,
    gap: Gap.gap_10 || 10,
  },
  detailBtn: {
    position: 'absolute',
    top: 1,
    right: 15,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.main400,
    borderRadius: Border.br_30,

    paddingVertical: Gap.gap_5 || 5,
    paddingLeft: Padding.padding_10 + 4 || 14,
    paddingRight: Padding.padding_5,// Tăng khoảng cách bên trái để icon không bị sát viền
  },
  detailText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: colors.main400 || '#3AB878',
  },
  setsListContainer: {
    gap: Gap.gap_15 || 15,
  },
});
