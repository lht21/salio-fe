import React from 'react';
import { 
  Pressable, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeftIcon, InfoIcon, CheckCircleIcon, WarningCircleIcon } from 'phosphor-react-native';

import Button from '../../../../components/Button';
import { Border, Color, FontFamily, FontSize } from '../../../../constants/GlobalStyles';
import LessonService from '../../../../api/services/lesson.service';

export default function SpeakingExplanationScreen() {
  const router = useRouter();
  // Lấy lessonId và điểm trung bình từ màn hình Result truyền sang
  const { lessonId, avgScore } = useLocalSearchParams<{ lessonId: string, avgScore: string }>();
  
  const [loading, setLoading] = React.useState(true);
  const [speakingResults, setSpeakingResults] = React.useState<any[]>([]);

  // Kiểm tra điều kiện vượt qua (ngưỡng 80 điểm)
  const isPassed = Number(avgScore) >= 80;

  React.useEffect(() => {
    const fetchAllSpeakingResults = async () => {
      try {
        if (!lessonId) return;

        // 1. Lấy danh sách các bài speaking trong lesson
        const modulesResponse = await LessonService.getModules(lessonId);
        const speakingItems = modulesResponse.data.speaking; 

        // 2. Lấy kết quả chi tiết của từng bài đã làm
        const resultsPromise = speakingItems.map(async (item: any) => {
          try {
            const res = await LessonService.getSkillResult(lessonId, 'speaking', item._id);
            return {
              title: item.title,
              evaluation: res.evaluation,
              status: 'done'
            };
          } catch (e) {
            // Trường hợp bài này chưa có dữ liệu kết quả
            return { title: item.title, status: 'none' };
          }
        });

        const results = await Promise.all(resultsPromise);
        // Chỉ hiển thị những bài đã làm (status === 'done')
        setSpeakingResults(results.filter(r => r.status === 'done'));

      } catch (error) {
        console.error("Error fetching explanation:", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu chi tiết bài học.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllSpeakingResults();
  }, [lessonId]);

  // Hàm xử lý nút bấm cuối trang
  const handleBottomAction = () => {
    if (isPassed) {
      router.replace(`/lessons/${lessonId}/reading/intro` as any);
    } else {
      router.replace(`/lessons/${lessonId}/speaking/intro` as any);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.cam} />
        <Text style={styles.loadingText}>Đang phân tích kết quả...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#FFF7E8', '#FFFFFF', '#FFFFFF']} style={styles.gradientScreen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeftIcon size={22} color={Color.text} weight="bold" />
            </Pressable>
            <View>
              <Text style={styles.heading}>Phân tích bài tập</Text>
              <Text style={styles.subheading}>Chi tiết đánh giá từng câu nói</Text>
            </View>
          </View>

          {/* List nội dung */}
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {speakingResults.map((item, index) => {
              const evalData = item.evaluation;
              return (
                <View key={index} style={styles.itemWrapper}>
                  <View style={styles.itemHeader}>
                    <CheckCircleIcon size={20} color={Color.cam} weight="fill" />
                    <Text style={styles.itemTitle}>{item.title}</Text>
                  </View>

                  {/* Nhận xét từ AI */}
                  <View style={styles.feedbackCard}>
                    <InfoIcon size={18} color="#855E28" weight="fill" />
                    <Text style={styles.feedbackText}>
                      {evalData?.feedback || "Không có nhận xét chi tiết cho bài này."}
                    </Text>
                  </View>

                  {/* Các chỉ số phần trăm */}
                  <View style={styles.scoreRow}>
                    <ScoreBadge label="Phát âm" score={evalData?.pronunciation} />
                    <ScoreBadge label="Ngữ điệu" score={evalData?.intonation} />
                    <ScoreBadge label="Chính xác" score={evalData?.accuracy} />
                    <ScoreBadge label="Lưu loát" score={evalData?.fluency} />
                  </View>

                  {/* Gợi ý cải thiện */}
                  {evalData?.suggestions && (
                    <View style={styles.suggestionBox}>
                      <Text style={styles.suggestionTitle}>💡 Gợi ý cải thiện:</Text>
                      <Text style={styles.suggestionContent}>{evalData.suggestions}</Text>
                    </View>
                  )}
                  
                  <View style={styles.divider} />
                </View>
              );
            })}
          </ScrollView>

          {/* Footer: Hiển thị thông báo và nút dựa trên điểm số */}
          <View style={styles.footer}>
            {!isPassed && (
              <View style={styles.alertBox}>
                <WarningCircleIcon size={20} color="#C62B1F" weight="fill" />
                <Text style={styles.alertText}>
                  Bạn cần đạt trung bình 80 điểm để qua bài. Hãy luyện tập lại nhé!
                </Text>
              </View>
            )}
            
            <Button
              title={isPassed ? "Tiếp tục học Đọc" : "Làm lại bài luyện tập"} 
              onPress={handleBottomAction}
              style={[
                styles.primaryButton, 
                { backgroundColor: isPassed ? Color.main : '#555555' }
              ]}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Component hiển thị các ô điểm nhỏ
const ScoreBadge = ({ label, score }: { label: string, score: number }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeLabel}>{label}</Text>
    <Text style={[styles.badgeScore, { color: score >= 80 ? '#4CAF50' : score >= 50 ? '#FF9800' : '#F44336' }]}>
      {score || 0}%
    </Text>
  </View>
);

const styles = StyleSheet.create({
  gradientScreen: { flex: 1 },
  safeArea: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 18, paddingTop: 12 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  loadingText: { marginTop: 12, fontFamily: FontFamily.lexendDecaMedium, color: '#666' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  backButton: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 20, 
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  heading: { fontFamily: FontFamily.lexendDecaBold, fontSize: 22, color: Color.text },
  subheading: { fontFamily: FontFamily.lexendDecaRegular, fontSize: 14, color: '#666' },
  scrollContent: { paddingBottom: 30 },
  itemWrapper: { marginBottom: 24 },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  itemTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 16, color: Color.text },
  feedbackCard: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF9F0', 
    padding: 14, 
    borderRadius: 12, 
    gap: 10, 
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FFE0B2'
  },
  feedbackText: { flex: 1, fontFamily: FontFamily.lexendDecaMedium, fontSize: 13, color: '#855E28', lineHeight: 18 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  badge: { alignItems: 'center', backgroundColor: '#F8F8F8', paddingVertical: 10, borderRadius: 10, width: '23%', borderWidth: 1, borderColor: '#EEE' },
  badgeLabel: { fontSize: 10, fontFamily: FontFamily.lexendDecaRegular, color: '#888', marginBottom: 4 },
  badgeScore: { fontSize: 14, fontFamily: FontFamily.lexendDecaBold },
  suggestionBox: { padding: 14, backgroundColor: '#F0F7FF', borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#1976D2' },
  suggestionTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 13, color: '#1976D2', marginBottom: 4 },
  suggestionContent: { fontFamily: FontFamily.lexendDecaRegular, fontSize: 13, color: '#444', lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginTop: 24 },
  footer: { 
    paddingVertical: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#EEE',
    backgroundColor: '#FFF' 
  },
  alertBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF1F0', 
    padding: 10, 
    borderRadius: 8, 
    gap: 8, 
    marginBottom: 12 
  },
  alertText: { flex: 1, fontFamily: FontFamily.lexendDecaMedium, fontSize: 12, color: '#C62B1F' },
  primaryButton: { borderRadius: Border.br_30, height: 52 },
});