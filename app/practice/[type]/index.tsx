import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Image 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ClockCounterClockwiseIcon, 
  UsersIcon
} from 'phosphor-react-native';

// Import Design System
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../constants/GlobalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../../components/ScreenHeader';
import TopicItem from '../../../components/TopicItem';
import ExamCard, { Exam } from '../../../components/ExamComponent/ExamCard';
import SectionHeader from '../../../components/SectionHeader';

// --- MOCK DATA ---
interface WritingTopic {
  id: string;
  title: string;
  description: string;
  image: any;
  isFeatured: boolean;
  usersCount?: string;
}

const writingTopics: WritingTopic[] = [
  {
    id: '1',
    title: 'Chạy theo xu hướng',
    description: 'Viết bài luận (500-700 từ) về việc con người có nên chạy theo các xu hướng mới nổi hay không, và tại sao.',
    image: require('../../../assets/images/imageExam/ie_1.png'),
    isFeatured: true,
    usersCount: '12k',
  },
  {
    id: '2',
    title: 'Trí tuệ nhân tạo (AI) và Tương lai',
    description: 'Trình bày suy nghĩ của bạn về những lợi ích và rủi ro mà AI mang lại cho thị trường lao động trong tương lai.',
    image: require('../../../assets/images/imageExam/ie_2.png'),
    isFeatured: false,
  },
  {
    id: '3',
    title: 'Ảnh hưởng của Mạng xã hội',
    description: 'Mạng xã hội giúp con người kết nối dễ dàng nhưng cũng làm suy giảm giao tiếp trực tiếp. Hãy phân tích vấn đề này.',
    image: require('../../../assets/images/imageExam/ie_2.png'),
    isFeatured: false,
  },
  {
    id: '4',
    title: 'Tỷ lệ sinh thấp & Già hóa dân số',
    description: 'Viết bài luận về nguyên nhân của hiện tượng tỷ lệ sinh thấp hiện nay và đề xuất phương hướng khắc phục.',
    image: require('../../../assets/images/imageExam/ie_2.png'),
    isFeatured: false,
  },
];

// --- MOCK DATA FOR READING/LISTENING ---
const mockReadingExams: Exam[] = [
  { id: 'r96', title: '제96회 한국어능력시험', edition: 96, year: 2024, isUnlocked: true, isFeatured: true, questionCount: 50, duration: 70 },
  { id: 'r95', title: '제95회 한국어능력시험', edition: 95, year: 2024, isUnlocked: true, isFeatured: true, questionCount: 50, duration: 70 },
  { id: 'r94', title: '제94회 한국어능력시험', edition: 94, year: 2023, isUnlocked: false, isFeatured: false, questionCount: 50, duration: 70 },
  { id: 'r93', title: '제93회 한국어능력시험', edition: 93, year: 2023, isUnlocked: false, isFeatured: false, questionCount: 50, duration: 70 },
  { id: 'r92', title: '제92회 한국어능력시험', edition: 92, year: 2023, isUnlocked: false, isFeatured: false, questionCount: 50, duration: 70 },
  { id: 'r91', title: '제91회 한국어능력시험', edition: 91, year: 2023, isUnlocked: false, isFeatured: false, questionCount: 50, duration: 70 },
];

const mockListeningExams: Exam[] = [
  { id: 'l96', title: '제96회 한국어능력시험', edition: 96, year: 2024, isUnlocked: true, isFeatured: true, questionCount: 50, duration: 60 },
  { id: 'l95', title: '제95회 한국어능력시험', edition: 95, year: 2024, isUnlocked: true, isFeatured: true, questionCount: 50, duration: 60 },
  { id: 'l94', title: '제94회 한국어능력시험', edition: 94, year: 2023, isUnlocked: false, isFeatured: false, questionCount: 50, duration: 60 },
  { id: 'l93', title: '제93회 한국어능력시험', edition: 93, year: 2023, isUnlocked: false, isFeatured: false, questionCount: 50, duration: 60 },
  { id: 'l92', title: '제92회 한국어능력시험', edition: 92, year: 2023, isUnlocked: false, isFeatured: false, questionCount: 50, duration: 60 },
  { id: 'l91', title: '제91회 한국어능력시험', edition: 91, year: 2023, isUnlocked: false, isFeatured: false, questionCount: 50, duration: 60 },
];

// --- COMPONENTS CON ---

const FeaturedCard = ({ topic, onPress }: { topic: WritingTopic; onPress: () => void }) => (
  <View style={styles.featuredContainer}>
    <Pressable style={styles.featuredCard} onPress={onPress}>
      <View style={styles.featuredTextContent}>
        <Text style={styles.featuredTitle} numberOfLines={2}>{topic.title}</Text>
        <Text style={styles.featuredDesc} numberOfLines={3}>{topic.description}</Text>
      </View>
      <Image source={topic.image} style={styles.featuredImage} resizeMode="cover" />
    </Pressable>
    
    {/* Dòng thông tin xã hội dưới Card */}
    {topic.usersCount && (
      <View style={styles.socialRow}>
        <UsersIcon size={18} color={Color.gray} weight="fill" />
        <Text style={styles.socialText}>{topic.usersCount} người dùng đã viết thử</Text>
      </View>
    )}
  </View>
);

// --- VIEW CHO READING / LISTENING (Giống mock-exam nhưng không có Zenmode) ---
const ReadingListeningView = ({ type }: { type: string }) => {
  const router = useRouter();
  const isReading = type === 'reading';
  const exams = isReading ? mockReadingExams : mockListeningExams;
  const title = isReading ? 'Luyện đọc' : 'Luyện nghe';

  const featuredExams = exams.filter(e => e.isFeatured);
  const otherExams = exams.filter(e => !e.isFeatured);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader 
        title={title} 
        rightContent={
          <Pressable onPress={() => router.push(`/practice/${type}/history` as any)} style={styles.iconButton}>
            <ClockCounterClockwiseIcon size={24} color={Color.text} weight="bold" />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Featured Exams Section */}
        {featuredExams.length > 0 && (
          <>
            <SectionHeader title="Đề nổi bật" />
            <View style={styles.listContainer}>
              {featuredExams.map(exam => (
                <ExamCard key={exam.id} exam={exam} onPress={() => router.push({ pathname: `/practice/${type}/${exam.id}/practice` as any })} />
              ))}
            </View>
          </>
        )}

        {/* Other Exams Section */}
        {otherExams.length > 0 && (
          <>
            <SectionHeader title="Các đề khác" />
            <View style={styles.gridContainer}>
              {otherExams.map(exam => (
                <View key={exam.id} style={styles.gridItem}>
                  <ExamCard exam={exam} onPress={() => router.push({ pathname: `/practice/${type}/${exam.id}/practice` as any })} />
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- VIEW CHO WRITING / SPEAKING (Giữ nguyên hiện tại) ---
const WritingSpeakingView = ({ type }: { type: string }) => {
  const router = useRouter();

  // Lọc dữ liệu
  const featuredTopic = writingTopics.find(t => t.isFeatured);
  const otherTopics = writingTopics.filter(t => !t.isFeatured);

  const handlePressTopic = (id: string) => {
    // Điều hướng sang màn hình làm bài tự do, không còn phụ thuộc vào 'lessons'
    router.push({ pathname: `/practice/${type}/${id}/practice` as any });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ScreenHeader 
        title="Luyện viết" 
        rightContent={
          <Pressable onPress={() => router.push(`/practice/${type}/history` as any)} style={styles.iconButton}>
            <ClockCounterClockwiseIcon size={24} color={Color.text} weight="bold" />
          </Pressable>
        }
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Phần 1: Chủ đề nổi bật */}
        {featuredTopic && (
          <View style={styles.section}>
            <SectionHeader title="Chủ đề nổi bật" />
            <FeaturedCard 
              topic={featuredTopic} 
              onPress={() => handlePressTopic(featuredTopic.id)} 
            />
          </View>
        )}

        {/* Phần 2: Các chủ đề khác */}
        <View style={styles.section}>
          <SectionHeader title="Các chủ đề khác" />
          <View style={styles.listContainer}>
            {otherTopics.map((topic) => (
              <TopicItem 
                key={topic.id} 
                topic={topic} 
                onPress={() => handlePressTopic(topic.id)} 
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- MÀN HÌNH CHÍNH (ĐIỀU HƯỚNG THEO TYPE) ---
export default function PracticeListScreen() {
  const { type } = useLocalSearchParams(); 
  const typeString = (type as string) || 'writing';

  const isReadingOrListening = typeString === 'reading' || typeString === 'listening';

  if (isReadingOrListening) {
    return <ReadingListeningView type={typeString} />;
  }

  return <WritingSpeakingView type={typeString} />;
}

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  iconButton: {
    padding: Padding.padding_5,
  },
  scrollContent: {
    padding: Padding.padding_20,
    paddingTop: 0,
    paddingBottom: 40,
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
    color: Color.text,
    marginBottom: Gap.gap_5,
  },
  featuredDesc: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.color, // Chữ xanh đậm để nổi bật trên nền xanh nhạt
    lineHeight: 20,
  },
  featuredImage: {
    width: 90,
    height: 90,
    borderRadius: Border.br_15,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_5,
    paddingHorizontal: Padding.padding_5,
  },
  socialText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.gray, // Tương đương textSecondary
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
});