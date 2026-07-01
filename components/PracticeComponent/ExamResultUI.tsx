import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { HouseIcon } from 'phosphor-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

import { FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import Button from '../Button';
import { useTheme } from "@/contexts/ThemeContext";

interface ScoreCardProps {
  title: string;
  koreanTitle: string;
  score: string | number;
}

const ScoreCard = ({ title, koreanTitle, score }: ScoreCardProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.scoreCard}>
      <Text style={styles.skillTitle}>{title}</Text>
      <Text style={styles.skillKorean}>{koreanTitle}</Text>
      <Text style={styles.skillScore}>{score}</Text>
    </View>
  );
};

interface FeedbackSectionProps {
  totalScore: number;
  maxScore: number;
  onHomePress: () => void;
  onReviewPress: () => void;
  onRetryPress: () => void;
}

const FeedbackSection = ({ totalScore, maxScore, onHomePress, onReviewPress, onRetryPress }: FeedbackSectionProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const getFeedbackMessage = (score: number, max: number) => {
    if (max === 0) return "Chúc mừng bạn đã hoàn thành bài thi!";
    const ratio = score / max;
    if (ratio >= 0.9) return "Xuất sắc! Bạn đã hoàn thành bài thi với số điểm gần như tuyệt đối. Hãy tiếp tục phát huy nhé!";
    if (ratio >= 0.7) return "Rất tốt! Bạn nắm vững kiến thức khá chắc. Một chút cẩn thận nữa là sẽ đạt điểm tối đa.";
    if (ratio >= 0.5) return "Chúc mừng bạn đã hoàn thành bài thi! Tuy nhiên vẫn còn nhiều điểm có thể cải thiện. Hãy xem lại bài làm nhé.";
    return "Đừng nản chí! Hãy xem lại chi tiết bài làm để rút kinh nghiệm và đạt kết quả tốt hơn ở lần sau.";
  };

  return (
    <View style={styles.feedbackContainer}>
      <Text style={styles.feedbackText}>
        {getFeedbackMessage(totalScore, maxScore)}
      </Text>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.homeButton} onPress={onHomePress} activeOpacity={0.8}>
          <HouseIcon size={24} color={colors.background || '#FFFFFF'} weight="bold" />
        </TouchableOpacity>

        <Button
          title="Luyện tập lại"
          variant="Outline"
          onPress={onRetryPress}
          style={styles.actionButton}
        />

        <Button
          title="Xem lại bài làm"
          variant="Green"
          onPress={onReviewPress}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
};

interface ExamResultUIProps {
  type: string;
  data: any;
  onHomePress: () => void;
  onReviewPress: () => void;
  onRetryPress: () => void;
}

export default function ExamResultUI({ type, data, onHomePress, onReviewPress, onRetryPress }: ExamResultUIProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  useEffect(() => {
    let sound: Audio.Sound;

    async function playSound() {
      try {
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
      if (sound) sound.unloadAsync();
    };
  }, []);

  const totalScore = data?.totalScore || 0;
  const readingScore = data?.readingScore || 0;
  const listeningScore = data?.listeningScore || 0;
  const writingScore = data?.writingScore || 0;
  const levelName = data?.exam?.title || 'TOPIK';
  const maxScore = type === 'full' ? 300 : 100;

  return (
    <LinearGradient colors={['#CEF9B4', colors.background || '#FFFFFF']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mascotContainer}>
            <Image
              source={require('../../assets/images/horani/result_exam.png')}
              style={styles.mascotImage}
              contentFit="contain"
            />
            <Text style={styles.rankLabel}>Bài thi</Text>
            <Text style={styles.levelName}>{levelName}</Text>
          </View>

          <View style={styles.totalScoreContainer}>
            <Text style={styles.totalScoreLabel}>Tổng điểm</Text>
            <Text style={styles.totalScoreValue}>
              {totalScore}
              <Text style={styles.totalScoreMax}>/{maxScore}</Text>
            </Text>
          </View>

          <View style={styles.scoreRow}>
            {(type === 'full' || type === 'reading') && (
              <ScoreCard title="Đọc" koreanTitle="(읽기)" score={readingScore} />
            )}
            {(type === 'full' || type === 'listening') && (
              <ScoreCard title="Nghe" koreanTitle="(듣기)" score={listeningScore} />
            )}
            {type === 'full' && (
              <ScoreCard title="Viết" koreanTitle="(쓰기)" score={writingScore} />
            )}
          </View>
        </ScrollView>

        <FeedbackSection
          totalScore={totalScore}
          maxScore={maxScore}
          onHomePress={onHomePress}
          onReviewPress={onReviewPress}
          onRetryPress={onRetryPress}
        />
      </SafeAreaView>

      <ConfettiCannon count={150} origin={{ x: width / 2, y: height }} autoStart={true} fadeOut={true} />
    </LinearGradient>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: Padding.padding_20, paddingBottom: 40, alignItems: 'center' },
  mascotContainer: { alignItems: 'center', marginTop: 30, marginBottom: Gap.gap_20 },
  mascotImage: { width: 180, height: 180, marginBottom: Gap.gap_15 },
  rankLabel: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: colors.textPrimary, marginBottom: 4 },
  levelName: { fontFamily: FontFamily.lexendDecaBold, fontSize: 32, color: colors.textBrand || '#0C5F35', lineHeight: 40, textAlign: 'center' },
  totalScoreContainer: { alignItems: 'center', marginBottom: 30 },
  totalScoreLabel: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.textSecondary, marginBottom: 4 },
  totalScoreValue: { fontFamily: FontFamily.lexendDecaBold, fontSize: 40, color: colors.cam || '#F59E0B' },
  totalScoreMax: { fontSize: FontSize.fs_16, color: colors.textSecondary },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: Gap.gap_10, marginBottom: Gap.gap_20 },
  scoreCard: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: Border.br_20, padding: Padding.padding_15, alignItems: 'center', borderWidth: 1, borderBottomWidth: 5, borderBottomColor: colors.borderDefault, borderColor: 'rgba(255, 255, 255, 0.8)' },
  skillTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14, color: colors.textPrimary },
  skillKorean: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: colors.textSecondary, marginBottom: Gap.gap_10 },
  skillScore: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_24, color: colors.textBrand || '#0C5F35' },
  feedbackContainer: { backgroundColor: '#E8F5E9', borderTopLeftRadius: Border.br_30, borderTopRightRadius: Border.br_30, padding: Padding.padding_20, paddingBottom: 40 },
  feedbackText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: colors.textPrimary, textAlign: 'center', lineHeight: 22, marginBottom: Gap.gap_20 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: Gap.gap_15 },
  homeButton: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primary || '#166534', justifyContent: 'center', alignItems: 'center' },
  actionButton: { flex: 1, marginVertical: 0, paddingHorizontal: 0 },
});