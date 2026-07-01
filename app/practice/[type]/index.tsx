import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ClockCounterClockwiseIcon
} from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';

// Import Design System
import { FontFamily, FontSize, Padding, Gap, Border } from '../../../constants/GlobalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../../components/ScreenHeader';
import TopicItem from '../../../components/TopicItem';
import ExamCard from '../../../components/ExamComponent/ExamCard';
import SectionHeader from '../../../components/SectionHeader';
import FeaturedAICard from '../../../components/ExamComponent/FeaturedAICard';
import FeaturedCard from '../../../components/PracticeComponent/FeaturedCard';

import PracticeService from '../../../api/services/practice.service';
import { PracticeType } from '../../../api/types/practice.types';
import { useUser } from '../../../contexts/UserContext';
import { useTheme } from '../../../contexts/ThemeContext';

// --- CUSTOM HOOK FETCH DATA ---
const usePracticeData = (type: string, examType?: string) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response: any = await PracticeService.getSets(type as PracticeType, { page: 1, limit: 20, examType });
        const items = response?.data?.data || response?.data || response || [];
        setData(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error(`Error fetching practice sets for ${type}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [type, examType]);

  return { data, isLoading };
};

// --- COMPONENTS CON ---

// --- HELPER KIỂM TRA MỞ KHÓA ĐỀ THI ---
const checkIsUnlocked = (exam: any, user: any) => {
  if (!exam.isPremium) return true; // Đề miễn phí luôn mở

  // Kiểm tra trạng thái Premium
  const isPremiumUser = !!(user?.subscription?.isActive &&
    user?.subscription?.type === 'premium' &&
    user?.subscription?.endDate &&
    new Date(user?.subscription?.endDate) > new Date());

  return isPremiumUser;
};

// --- VIEW CHO FULL EXAM ---
const FullExamView = ({ examType }: { examType?: string }) => {

  const router = useRouter();
  const type = 'full';
  const { data, isLoading } = usePracticeData(type, examType);
  const { user } = useUser();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const featuredExams = data.slice(0, 2);
  const otherExams = data.slice(2);

  const handleStartExam = (id: string, isPremium: boolean = false) => {
    if (isPremium) {
      router.push('/subscription');
    } else {
      router.push(`/practice/${type}/${id}/intro` as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t('practice.choose_topik2_exam', "Chọn đề TOPIK II")}
        rightContent={
          <Pressable onPress={() => router.push(`/practice/${type}/history` as any)} style={styles.iconButton}>
            <ClockCounterClockwiseIcon size={24} color={colors.textPrimary} weight="bold" />
          </Pressable>
        }
      />



      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* AI Section */}
        <SectionHeader title={t('practice.ai_generated_desc', "Để tổng hợp theo trình độ của bạn")} />
        <FeaturedAICard onPress={() => handleStartExam('ai-generated', false)} />

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : data.length === 0 ? (
          <Text style={styles.emptyText}>{t('practice.empty_practice', 'Chưa có bài tập nào')}</Text>
        ) : (
          <>
            {/* Featured Exams Section */}
            {featuredExams.length > 0 && (
              <>
                <SectionHeader title={t('practice.featured_exams', "Đề nổi bật")} />
                <View style={styles.listContainer}>
                  {featuredExams.map(exam => (
                    <ExamCard key={exam._id} exam={{ ...exam, id: exam._id, isUnlocked: checkIsUnlocked(exam, user) }} onPress={() => handleStartExam(exam._id, !checkIsUnlocked(exam, user))} />
                  ))}
                </View>
              </>
            )}

            {/* Other Exams Section */}
            {otherExams.length > 0 && (
              <>
                <SectionHeader title={t('practice.other_exams', "Các đề khác")} />
                <View style={styles.gridContainer}>
                  {otherExams.map(exam => (
                    <View key={exam._id} style={styles.gridItem}>
                      <ExamCard exam={{ ...exam, id: exam._id, isUnlocked: checkIsUnlocked(exam, user) }} onPress={() => handleStartExam(exam._id, !checkIsUnlocked(exam, user))} />
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- VIEW CHO READING / LISTENING (Giống mock-exam nhưng không có Zenmode) ---
const ReadingListeningView = ({ type, examType }: { type: string; examType?: string }) => {

  const router = useRouter();
  const { data, isLoading } = usePracticeData(type, examType);
  const { user } = useUser();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const title = type === 'reading' ? t('practice.reading', 'Luyện đọc') : t('practice.listening', 'Luyện nghe');

  const featuredExams = data.slice(0, 1);
  const otherExams = data.slice(1);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={title}
        rightContent={
          <Pressable onPress={() => router.push(`/practice/${type}/history` as any)} style={styles.iconButton}>
            <ClockCounterClockwiseIcon size={24} color={colors.textPrimary} weight="bold" />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : data.length === 0 ? (
          <Text style={styles.emptyText}>{t('practice.empty_practice', 'Chưa có bài tập nào')}</Text>
        ) : (
          <>
            {/* Featured Exams Section */}
            {featuredExams.length > 0 && (
              <>
                <SectionHeader title={t('practice.featured_exams', "Đề nổi bật")} />
                <View style={styles.listContainer}>
                  {featuredExams.map(exam => (
                    <ExamCard key={exam._id} exam={{ ...exam, id: exam._id, isUnlocked: checkIsUnlocked(exam, user) }} onPress={() => checkIsUnlocked(exam, user) ? router.push({ pathname: `/practice/${type}/${exam._id}/intro` as any }) : router.push('/subscription')} />
                  ))}
                </View>
              </>
            )}

            {/* Other Exams Section */}
            {otherExams.length > 0 && (
              <>
                <SectionHeader title={t('practice.other_exams', "Các đề khác")} />
                <View style={styles.gridContainer}>
                  {otherExams.map(exam => (
                    <View key={exam._id} style={styles.gridItem}>
                      <ExamCard exam={{ ...exam, id: exam._id, isUnlocked: checkIsUnlocked(exam, user) }} onPress={() => checkIsUnlocked(exam, user) ? router.push({ pathname: `/practice/${type}/${exam._id}/intro` as any }) : router.push('/subscription')} />
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- VIEW CHO WRITING / SPEAKING (Giữ nguyên hiện tại) ---
const WritingSpeakingView = ({ type, examType }: { type: string; examType?: string }) => {

  const router = useRouter();
  const { data, isLoading } = usePracticeData(type, examType);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const featuredTopics = data.slice(0, 3);
  const otherTopics = data.slice(3);

  const handlePressTopic = (id: string) => {
    router.push({ pathname: `/practice/${type}/${id}/intro` as any });
  };

  const getTopicImage = (topic: any) => {
    return require('../../../assets/images/imageExam/ie_1.png');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ScreenHeader
        title={type === 'writing' ? t('practice.writing', "Luyện viết") : t('practice.speaking', "Luyện nói")}
        rightContent={
          <Pressable onPress={() => router.push(`/practice/${type}/history` as any)} style={styles.iconButton}>
            <ClockCounterClockwiseIcon size={24} color={colors.textPrimary} weight="bold" />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : data.length === 0 ? (
          <Text style={styles.emptyText}>{t('practice.empty_practice', 'Chưa có bài tập nào')}</Text>
        ) : (
          <>
            {/* Phần 1: Chủ đề nổi bật */}
            {featuredTopics.length > 0 && (
              <LinearGradient
                colors={['#CEF9B4', colors.primary || '#98F291']}
                style={styles.featuredSectionGradient}
              >
                <Text style={styles.featuredSectionTitle}>{t('practice.featured_topics', "Chủ đề nổi bật")}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredScrollContent}
                >
                  {featuredTopics.map((topic) => (
                    <View key={topic._id} style={styles.featuredCardWrapper}>
                      <FeaturedCard
                        topic={{
                          ...topic,
                          id: topic._id,
                          image: getTopicImage(topic)
                        }}
                        onPress={() => handlePressTopic(topic._id)}
                      />
                    </View>
                  ))}
                </ScrollView>

                {/* Đồ họa cắt lượn sóng biển ở đáy */}
                <Svg
                  height="60"
                  width="100%"
                  viewBox="0 0 1440 320"
                  preserveAspectRatio="none"
                  style={styles.waveSvg}
                >
                  <Path
                    fill={colors.background}
                    d="M0,224L60,192C120,160,240,96,360,101.3C480,107,600,181,720,218.7C840,256,960,256,1080,218.7C1200,181,1320,107,1380,69.3L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                  />
                </Svg>
              </LinearGradient>
            )}

            {/* Phần 2: Các chủ đề khác */}
            {otherTopics.length > 0 && (
              <View style={styles.section}>
                <SectionHeader title={t('practice.other_topics', "Các chủ đề khác")} />
                <View style={styles.listContainer}>
                  {otherTopics.map((topic) => (
                    <TopicItem
                      key={topic._id}
                      topic={{
                        ...topic,
                        id: topic._id,
                        description: topic.prompt || topic.instruction,
                        image: getTopicImage(topic)
                      }}
                      onPress={() => handlePressTopic(topic._id)}
                    />
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- MÀN HÌNH CHÍNH (ĐIỀU HƯỚNG THEO TYPE) ---
export default function PracticeListScreen() {
  const { type, examType } = useLocalSearchParams();
  const typeString = (type as string) || 'full';
  const examTypeString = examType as string;

  if (typeString === 'full') {
    return <FullExamView examType={examTypeString} />;
  }

  if (typeString === 'reading' || typeString === 'listening') {
    return <ReadingListeningView type={typeString} examType={examTypeString} />;
  }

  return <WritingSpeakingView type={typeString} examType={examTypeString} />;
}

// --- STYLES ---

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  iconButton: {
    padding: Padding.padding_5,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Padding.padding_20,
    paddingTop: 0,
    paddingBottom: 40,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: Gap.gap_20,
  },

  // --- Featured Section Styles ---
  featuredSectionGradient: {
    marginHorizontal: -Padding.padding_20, // Lề âm để gradient tràn ra sát 2 mép màn hình
    paddingTop: Padding.padding_30,
    paddingBottom: Padding.padding_30 + 50, // Tăng thêm padding dưới để nhường chỗ cho ngọn sóng không đè lên thẻ
    marginBottom: Gap.gap_20,
    position: 'relative',
  },
  waveSvg: {
    position: 'absolute',
    bottom: -1, // Để -1 nhằm tránh tình trạng bị lộ 1px đường kẻ mờ trên một số dòng máy Android
    left: 0,
    right: 0,
  },
  featuredSectionTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_24, // Chữ to và đậm hơn
    color: colors.textBrand,
    paddingHorizontal: Padding.padding_20, // Thụt lề lại để bằng với nội dung bên dưới
    marginBottom: Gap.gap_15,
  },
  featuredScrollContent: {
    paddingHorizontal: Padding.padding_20,
    gap: Gap.gap_15,
  },
  featuredCardWrapper: {
    width: 320, // Kích thước cố định để có thể cuộn ngang thấy được card kế tiếp
  },

  // --- Featured Card Styles ---

  // --- Topic Item Styles ---
  listContainer: {
    gap: Gap.gap_12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -(Gap.gap_10 / 2),
  },
  gridItem: {
    width: '50%',
    padding: Gap.gap_10 / 2,
  },
  emptyText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  }
});