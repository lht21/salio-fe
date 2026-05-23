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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ClockCounterClockwiseIcon, 
  UsersIcon
} from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';

// Import Design System
import { FontFamily, FontSize, Padding, Gap, Border, Color } from '../../../constants/GlobalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../../components/ScreenHeader';
import TopicItem from '../../../components/TopicItem';
import ExamCard from '../../../components/ExamComponent/ExamCard';
import SectionHeader from '../../../components/SectionHeader';
import FeaturedAICard from '../../../components/ExamComponent/FeaturedAICard';

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

const FeaturedCard = ({ topic, onPress }: { topic: any; onPress: () => void }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.featuredContainer}>
      <Pressable style={styles.featuredCard} onPress={onPress}>
        <View style={styles.featuredTextContent}>
          <Text style={styles.featuredTitle} numberOfLines={2}>{topic.title}</Text>
          <Text style={styles.featuredDesc} numberOfLines={3}>{topic.prompt || topic.instruction || t('practice.no_description', 'Không có mô tả')}</Text>
        </View>
        <View>
          <Image source={topic.image} style={styles.featuredImage} resizeMode="cover" />
          {(topic.level || (topic.tags && topic.tags.length > 0)) && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{topic.level || topic.tags[0]}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

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
            <ClockCounterClockwiseIcon size={24} color={colors.text} weight="bold" />
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
          <ActivityIndicator size="large" color={colors.main} style={{ marginTop: 40 }} />
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
            <ClockCounterClockwiseIcon size={24} color={colors.text} weight="bold" />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.main} style={{ marginTop: 40 }} />
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

  const featuredTopic = data.length > 0 ? data[0] : null;
  const otherTopics = data.length > 1 ? data.slice(1) : [];

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
            <ClockCounterClockwiseIcon size={24} color={colors.text} weight="bold" />
          </Pressable>
        }
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.main} style={{ marginTop: 40 }} />
        ) : data.length === 0 ? (
          <Text style={styles.emptyText}>{t('practice.empty_practice', 'Chưa có bài tập nào')}</Text>
        ) : (
          <>
            {/* Phần 1: Chủ đề nổi bật */}
            {featuredTopic && (
              <View style={styles.section}>
                <SectionHeader title={t('practice.featured_topics', "Chủ đề nổi bật")} />
                <FeaturedCard 
                  topic={{
                    ...featuredTopic,
                    id: featuredTopic._id,
                    image: getTopicImage(featuredTopic)
                  }} 
                  onPress={() => handlePressTopic(featuredTopic._id)} 
                />
              </View>
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
    backgroundColor: colors.bg,
  },
  iconButton: {
    padding: Padding.padding_5,
  },
  scrollContent: {
    flex: 1,
    padding: Padding.padding_20,
    paddingTop: 0,
    paddingBottom: 40,
    backgroundColor: colors.bg2,
  },
  section: {
    marginBottom: Gap.gap_20,
  },

  // --- Featured Card Styles ---
  featuredContainer: {
    gap: Gap.gap_10,
  },
  featuredCard: {
    flexDirection: 'row',
    backgroundColor: Color.greenLight, // Hoặc Color.main tùy vào độ đậm thiết kế muốn
    borderRadius: Border.br_20,
    padding: Padding.padding_15,
    alignItems: 'center',
    // Shadow nhẹ
    shadowColor: Color.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  featuredTextContent: {
    flex: 1,
    paddingRight: Padding.padding_15,
  },
  featuredTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    color: colors.text,
    marginBottom: Gap.gap_5,
  },
  featuredDesc: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: colors.color, 
    lineHeight: 20,
  },
  featuredImage: {
    width: 90,
    height: 90,
    borderRadius: Border.br_15,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: colors.vang,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Border.br_10,
  },
  badgeText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 10,
    color: colors.text,
  },

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
    color: colors.gray,
    textAlign: 'center',
    marginTop: 40,
  }
});