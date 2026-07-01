import React from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { XIcon } from 'phosphor-react-native';

import Button from '../../../../components/Button';
import { Border, FontFamily, FontSize } from '../../../../constants/GlobalStyles';
import LessonService from '../../../../api/services/lesson.service';
import { useTheme } from "@/contexts/ThemeContext";

export default function SpeakingResultScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const resolvedLessonId = lessonId || '1';

  const [loading, setLoading] = React.useState(true);
  const [summary, setSummary] = React.useState({
    totalItems: 0,
    passedCount: 0,
    averageScore: 0,
    isPassed: false,
    metrics: [
      { id: 'pronunciation', label: 'Phát âm', value: 0, color: '#4ACB40' },
      { id: 'intonation', label: 'Ngữ điệu', value: 0, color: '#FFB200' },
      { id: 'accuracy', label: 'Độ chính xác', value: 0, color: '#A10202' },
      { id: 'fluency', label: 'Độ lưu loát', value: 0, color: '#FF9898' },
    ]
  });

  const screenOpacity = React.useRef(new Animated.Value(0)).current;
  const screenTranslateY = React.useRef(new Animated.Value(26)).current;
  const metricAnimations = React.useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  React.useEffect(() => {
    const fetchFullResults = async () => {
      try {
        // 1. Lấy danh sách bài speaking trong lesson
        const modules = await LessonService.getModules(resolvedLessonId);
        const speakingItems = modules.data.speaking;

        // 2. Lấy kết quả từng bài
        const results = await Promise.all(
          speakingItems.map(async (item: any) => {
            try {
              return await LessonService.getSkillResult(resolvedLessonId, 'speaking', item._id);
            } catch {
              return null;
            }
          })
        );

        const validResults = results.filter((r) => r !== null);
        const count = validResults.length;

        if (count > 0) {
          // Tính toán trung bình cộng các chỉ số
          const avg = (key: string) => Math.round(validResults.reduce((acc, r) => acc + (r.evaluation[key] || 0), 0) / count);
          const totalAvgScore = Math.round(validResults.reduce((acc, r) => acc + (r.evaluation.percentage || 0), 0) / count);
          const passed = validResults.filter(r => r.evaluation.percentage >= 70).length;

          setSummary({
            totalItems: speakingItems.length,
            passedCount: passed,
            averageScore: totalAvgScore,
            isPassed: totalAvgScore >= 80,
            metrics: [
              { id: 'pronunciation', label: 'Phát âm', value: avg('pronunciation'), color: '#4ACB40' },
              { id: 'intonation', label: 'Ngữ điệu', value: avg('intonation'), color: '#FFB200' },
              { id: 'accuracy', label: 'Độ chính xác', value: avg('accuracy'), color: '#A10202' },
              { id: 'fluency', label: 'Độ lưu loát', value: avg('fluency'), color: '#FF9898' },
            ]
          });
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể lấy kết quả tổng hợp.");
      } finally {
        setLoading(false);
        startAnimations();
      }
    };

    fetchFullResults();
  }, [resolvedLessonId]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(screenOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(screenTranslateY, { toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    Animated.stagger(150, metricAnimations.map((value) =>
      Animated.timing(value, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: false })
    )).start();
  };

  if (loading) {
    return (
      <View style={[styles.gradientScreen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.cam} />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#DFF8C6', '#FFFFFF', '#FFFFFF']} style={styles.gradientScreen}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, { opacity: screenOpacity, transform: [{ translateY: screenTranslateY }] }]}>

          <Pressable style={styles.closeButton} onPress={() => router.replace('/(tabs)' as any)}>
            <XIcon size={22} color="#A3A3A3" weight="bold" />
          </Pressable>

          <Image
            source={require('../../../../assets/images/horani/result.png')}
            style={styles.heroImage}
            contentFit="contain"
          />

          <Text style={styles.title}>Hoàn thành bài học!</Text>

          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Đạt {summary.passedCount}/{summary.totalItems} bài</Text>
            <Text style={styles.scoreValue}>{summary.averageScore} điểm</Text>
          </View>

          <View style={styles.metricsWrap}>
            <Text style={styles.metricsHeading}>Phân tích kỹ năng tổng quát</Text>

            {summary.metrics.map((metric, index) => (
              <View key={metric.id} style={styles.metricBlock}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <View style={styles.track}>
                  <Animated.View
                    style={[
                      styles.fill,
                      {
                        width: metricAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', `${metric.value}%`],
                        }),
                        backgroundColor: metric.color,
                      },
                    ]}
                  >
                    <Animated.Text style={[styles.trackValue, { opacity: metricAnimations[index] }]}>
                      {metric.value}%
                    </Animated.Text>
                  </Animated.View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Button
              title="Xem giải thích chi tiết từng bài"
              onPress={() => router.push({
                pathname: `/lessons/${resolvedLessonId}/speaking/explanation`,
                params: { avgScore: summary.averageScore }
              } as any)}
              style={styles.primaryButton}

            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  gradientScreen: { flex: 1 },
  safeArea: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 18 },
  closeButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  heroImage: { width: 148, height: 148, alignSelf: 'center', marginTop: 12, marginBottom: 10 },
  title: { fontFamily: FontFamily.lexendDecaBold, fontSize: 28, color: colors.cam, textAlign: 'center', marginBottom: 22 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingHorizontal: 6 },
  scoreLabel: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.textPrimary },
  scoreValue: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_20, color: '#C62B1F' },
  metricsWrap: { marginTop: 8, gap: 14 },
  metricsHeading: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.textPrimary },
  metricBlock: { gap: 8 },
  metricLabel: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.textPrimary },
  track: { height: 24, borderRadius: 999, backgroundColor: 'rgba(0, 0, 0, 0.14)', overflow: 'hidden', justifyContent: 'center' },
  fill: { height: '100%', borderRadius: 999, justifyContent: 'center', alignItems: 'flex-end' },
  trackValue: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_12, color: '#FFFFFF', paddingRight: 10 },
  footer: { marginTop: 'auto', paddingTop: 16 },
  primaryButton: { marginVertical: 0, borderRadius: Border.br_30 },
});