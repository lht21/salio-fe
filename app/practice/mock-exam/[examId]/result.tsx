import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { HouseIcon } from 'phosphor-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Audio } from 'expo-av';

// Lấy kích thước màn hình cho hiệu ứng pháo giấy
const { width, height } = Dimensions.get('window');

// Import Design System & Components
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import Button from '../../../../components/Button';

// --- SUB-COMPONENTS ---

interface ScoreCardProps {
  title: string;
  koreanTitle: string;
  score: string | number;
}

const ScoreCard = ({ title, koreanTitle, score }: ScoreCardProps) => (
  <View style={styles.scoreCard}>
    <Text style={styles.skillTitle}>{title}</Text>
    <Text style={styles.skillKorean}>{koreanTitle}</Text>
    <Text style={styles.skillScore}>{score}</Text>
  </View>
);

interface FeedbackSectionProps {
  onHomePress: () => void;
  onReviewPress: () => void;
}

const FeedbackSection = ({ onHomePress, onReviewPress }: FeedbackSectionProps) => (
  <View style={styles.feedbackContainer}>
    <Text style={styles.feedbackText}>
      Chúc mừng bạn đã hoàn thành bài thi! Hãy tiếp tục giữ vững phong độ và ôn luyện chăm chỉ để đạt điểm cao hơn trong các bài thi tiếp theo nhé.
    </Text>
    <View style={styles.actionRow}>
      {/* Nút Home bên trái */}
      <TouchableOpacity style={styles.homeButton} onPress={onHomePress} activeOpacity={0.8}>
        <HouseIcon size={24} color={Color.bg || '#FFFFFF'} weight="bold" />
      </TouchableOpacity>
      
      {/* Nút Xem lại bài làm bên phải */}
      <Button 
        title="Xem lại bài làm" 
        variant="Green" 
        onPress={onReviewPress} 
        style={styles.reviewButton}
      />
    </View>
  </View>
);

// --- MAIN SCREEN ---

export default function MockExamResultScreen() {
  const router = useRouter();
  // Lấy dữ liệu động từ route params (có thể truyền từ màn thi trước đó)
  const { 
    examId, 
    levelName = 'TOPIK 3', 
    readingScore = 85, 
    listeningScore = 90, 
    writingScore = 65 
  } = useLocalSearchParams();

  // Phát âm thanh chúc mừng khi vào màn hình
  useEffect(() => {
    let sound: Audio.Sound;

    async function playSound() {
      try {
        // Thay bằng file âm thanh local của bạn, ví dụ: require('../../../../assets/sounds/victory.mp3')
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3' } 
        );
        sound = newSound;
        await sound.playAsync();
      } catch (error) {
        console.log('Lỗi phát âm thanh:', error);
      }
    }

    playSound();

    return () => {
      if (sound) sound.unloadAsync(); // Dọn dẹp bộ nhớ khi thoát trang
    };
  }, []);

  // Phần 4: Tính toán điểm tổng hợp
  const totalScore = Number(readingScore) + Number(listeningScore) + Number(writingScore);

  // Handlers điều hướng
  const handleHome = () => {
    router.replace('/(tabs)');
  };

  const handleReview = () => {
    // Điều hướng tới màn hình review bài thi của examId tương ứng
    router.push(`/practice/mock-exam/${examId}/review` as any);
  };

  return (
    <LinearGradient 
      colors={['#CEF9B4', Color.bg || '#FFFFFF']} // Gradient từ xanh lá nhạt sang trắng
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* Phần 1 & Phần 2: Mascot và Level */}
          <View style={styles.mascotContainer}>
            <Image 
              source={require('../../../../assets/images/horani/result_exam.png')} 
              style={styles.mascotImage} 
              contentFit="contain"
            />
            <Text style={styles.rankLabel}>Cấp bậc</Text>
            <Text style={styles.levelName}>{levelName}</Text>
          </View>

          {/* Phần 4: Kết quả tổng hợp */}
          <View style={styles.totalScoreContainer}>
            <Text style={styles.totalScoreLabel}>Tổng điểm</Text>
            <Text style={styles.totalScoreValue}>
              {totalScore}
              <Text style={styles.totalScoreMax}>/300</Text>
            </Text>
          </View>

          {/* Phần 3: Thẻ điểm các kỹ năng */}
          <View style={styles.scoreRow}>
            <ScoreCard title="Đọc" koreanTitle="(읽기)" score={readingScore as string} />
            <ScoreCard title="Nghe" koreanTitle="(듣기)" score={listeningScore as string} />
            <ScoreCard title="Viết" koreanTitle="(쓰기)" score={writingScore as string} />
          </View>

        </ScrollView>

        {/* Phần 5: Feedback và Nút hành động ở đáy màn hình */}
        <FeedbackSection 
          onHomePress={handleHome} 
          onReviewPress={handleReview} 
        />

      </SafeAreaView>

      {/* Hiệu ứng pháo giấy bắn lên từ đáy màn hình */}
      <ConfettiCannon 
        count={150} 
        origin={{ x: width / 2, y: height }} 
        autoStart={true} 
        fadeOut={true} 
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { 
    paddingHorizontal: Padding.padding_20, 
    paddingBottom: 40, 
    alignItems: 'center' 
  },
  
  // Mascot & Level
  mascotContainer: { alignItems: 'center', marginTop: 30, marginBottom: Gap.gap_20 },
  mascotImage: { width: 180, height: 180, marginBottom: Gap.gap_15 },
  rankLabel: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: Color.text, marginBottom: 4 },
  levelName: { fontFamily: FontFamily.lexendDecaBold, fontSize: 48, color: Color.color || '#0C5F35', lineHeight: 56 },
  
  // Total Score
  totalScoreContainer: { alignItems: 'center', marginBottom: 30 },
  totalScoreLabel: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.gray, marginBottom: 4 },
  totalScoreValue: { fontFamily: FontFamily.lexendDecaBold, fontSize: 40, color: Color.cam || '#F59E0B' },
  totalScoreMax: { fontSize: FontSize.fs_16, color: Color.gray },
  
  // Skill Scores
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: Gap.gap_10, marginBottom: Gap.gap_20 },
  scoreCard: { 
    flex: 1, 
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Trắng mờ
    borderRadius: Border.br_20, 
    padding: Padding.padding_15, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderBottomWidth: 5,
    borderBottomColor: Color.stroke,
    borderColor: 'rgba(255, 255, 255, 0.8)' 
  },
  skillTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14, color: Color.text },
  skillKorean: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: Color.gray, marginBottom: Gap.gap_10 },
  skillScore: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_24, color: Color.color || '#0C5F35' },
  
  // Feedback & Footer
  feedbackContainer: { 
    backgroundColor: '#E8F5E9', // Xanh lá siêu nhạt
    borderTopLeftRadius: Border.br_30, 
    borderTopRightRadius: Border.br_30, 
    padding: Padding.padding_20, 
    paddingBottom: 40 
  },
  feedbackText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.text, textAlign: 'center', lineHeight: 22, marginBottom: Gap.gap_20 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: Gap.gap_15 },
  homeButton: { width: 52, height: 52, borderRadius: 26, backgroundColor: Color.main2 || '#166534', justifyContent: 'center', alignItems: 'center' },
  reviewButton: { flex: 1, marginVertical: 0 },
});