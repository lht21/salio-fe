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
import { ClockCounterClockwiseIcon, UsersIcon } from 'phosphor-react-native';

// Import Design System
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../constants/GlobalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../../components/ScreenHeader';
import TopicItem from '../../../components/TopicItem';

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
    title: 'Bảo vệ môi trường & Rác thải nhựa',
    description: 'Viết bài luận (600-700 chữ) nêu nguyên nhân của việc gia tăng rác thải nhựa và các biện pháp giải quyết thực tiễn.',
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

// --- COMPONENTS CON ---

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

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


// --- MÀN HÌNH CHÍNH ---

export default function PracticeListScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams(); // Có thể dùng để xác định loại practice (writing, speaking...)

  // Lọc dữ liệu
  const featuredTopic = writingTopics.find(t => t.isFeatured);
  const otherTopics = writingTopics.filter(t => !t.isFeatured);

  const handlePressTopic = (id: string) => {
    // Điều hướng theo yêu cầu: /writing/practice (Hoặc đường dẫn tùy chỉnh của dự án)
    router.push({ pathname: '/lessons/[lessonId]/writing/practice' as any, params: { lessonId: id } });
    // Note: Nếu route của bạn chính xác là /writing/practice như mô tả, hãy sửa lại thành:
    // router.push({ pathname: '/writing/practice' as any, params: { id } });
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
  sectionHeader: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: Color.gray,
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
    shadowColor: Color.colorBlack,
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
});