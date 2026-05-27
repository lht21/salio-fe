import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HouseIcon, TextAUnderlineIcon, TranslateIcon, BookOpenIcon, LinkIcon } from 'phosphor-react-native';

import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import CategoryChip from '../../../../components/CategoryChip';
import FeedbackCard from '../../../../components/FeedbackCard';
import DetailedCorrectionView from '../../../../components/DetailedCorrectionView';
import LessonService from '../../../../api/services/lesson.service';
import Button from '../../../../components/Button';

export default function WritingResultScreen() {
  const router = useRouter();
  const { lessonId, payload, timeUsed } = useLocalSearchParams();
  
  const [results, setResults] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processResults = async () => {
      try {
        if (!payload) return;
        const answers = JSON.parse(payload as string);
        const itemIds = Object.keys(answers);
        
        // Nộp tất cả bài viết lên AI
        const responses = await Promise.all(
          itemIds.map(id => 
            LessonService.submitSkillItem(lessonId as string, 'writing', id, {
              answers: [{ questionId: id, answer: answers[id] }],
              content: answers[id],
              timeSpent: Math.round(Number(timeUsed) / itemIds.length)
            })
          )
        );

        // Dự phòng tương thích object trả về từ Backend (thường nằm trong `res.result`)
        setResults(responses.map(res => res.result || res.submission || res));
      } catch (error) {
        console.error("Lỗi AI:", error);
        Alert.alert("Lỗi", "AI không thể phản hồi lúc này.");
      } finally {
        setIsLoading(false);
      }
    };
    processResults();
  }, [payload, lessonId]);

  // Hàm lấy Icon tương ứng với title trong mảng feedback của DB
  const getIconByTitle = (title: string) => {
    if (title.includes("Nội dung")) return <TextAUnderlineIcon size={24} color={Color.color} weight="fill" />;
    if (title.includes("Từ vựng")) return <TranslateIcon size={24} color={Color.color} weight="fill" />;
    if (title.includes("Ngữ pháp")) return <BookOpenIcon size={24} color={Color.color} weight="fill" />;
    if (title.includes("mạch lạc")) return <LinkIcon size={24} color={Color.color} weight="fill" />;
    return <TextAUnderlineIcon size={24} color={Color.color} weight="fill" />;
  };

  if (isLoading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Color.main} />
      <Text style={styles.loadingText}>AI đang phân tích bài viết của bạn...</Text>
    </View>
  );

  const currentSubmission = results[currentIndex];
  // Trong DB của bạn: evaluation chứa totalScore, aiFeedback (hoặc feedback trong breakdown)
  const evaluation = currentSubmission?.evaluation;
  
  // Lấy mảng feedback từ cấu trúc DB bạn gửi
  const feedbackList = evaluation?.aiFeedback || []; // Hoặc evaluation?.feedback tùy theo mapping của Backend

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER TABS */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kết quả bài viết ({results.length} bài)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabContainer}>
          {results.map((_, idx) => (
            <CategoryChip 
              key={idx}
              label={`Bài tập ${idx + 1}`} 
              isActive={currentIndex === idx} 
              onPress={() => setCurrentIndex(idx)} 
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* BANNER ĐIỂM SỐ */}
        <View style={styles.scoreBanner}>
            <View style={styles.scoreCircle}>
                <Text style={styles.scoreText}>{evaluation?.totalScore || 0}</Text>
                <Text style={styles.maxScore}>/50</Text>
            </View>
            <View style={styles.scoreInfo}>
               <Text style={styles.scoreStatus}>
                 {(evaluation?.totalScore || 0) >= 40 ? "Xuất sắc!" : "Cố gắng lên!"}
               </Text>
               <Text style={styles.charCountText}>Số ký tự: {currentSubmission?.charCount || 0}</Text>
            </View>
        </View>

        {/* PHẦN NHẬN XÉT CHI TIẾT (RENDER TỪ MẢNG FEEDBACK CỦA DB) */}
        <Text style={styles.sectionTitle}>Phân tích chi tiết</Text>
        <View style={styles.feedbackContainer}>
          {Array.isArray(feedbackList) && feedbackList.length > 0 ? (
            feedbackList.map((item: any, index: number) => (
              <FeedbackCard 
                key={index}
                title={item.title} // DB: "Nội dung", "Từ vựng"...
                content={item.content} // DB: "Bài viết trả lời đúng trọng tâm..."
                icon={getIconByTitle(item.title)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Đang cập nhật nhận xét...</Text>
          )}
        </View>

        {/* PHẦN SỬA LỖI CHI TIẾT */}
        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Sửa lỗi & Gợi ý</Text>
        <DetailedCorrectionView 
            correctionData={evaluation?.detailedCorrection || []} 
        />
        
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* FOOTER NÚT BẤM */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.homeBtn} 
          onPress={() => router.replace('/(tabs)')}
        >
          <HouseIcon size={24} color={Color.text} />
        </TouchableOpacity>
        
        <Button 
          title="Luyện tập lại" 
          variant="Green"
          style={{ flex: 1, marginVertical: 0 }}
          onPress={() => router.replace(`/lessons/${lessonId}/writing/practice`)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.bg },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 15, fontFamily: FontFamily.lexendDecaMedium, color: Color.gray },
  header: { padding: 15, backgroundColor: Color.bg, borderBottomWidth: 1, borderBottomColor: Color.stroke },
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 18, marginBottom: 15, color: Color.text },
  tabContainer: { gap: 10 },
  content: { padding: 15 },
  scoreBanner: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: Color.main, padding: 20, 
    borderRadius: Border.br_20, marginBottom: 25 
  },
  scoreCircle: { 
    width: 80, height: 80, borderRadius: 40, 
    backgroundColor: Color.bg, justifyContent: 'center', 
    alignItems: 'center', marginRight: 20 
  },
  scoreText: { fontSize: 28, fontFamily: FontFamily.lexendDecaSemiBold, color: Color.color },
  maxScore: { fontSize: 12, color: Color.gray },
  scoreInfo: { flex: 1 },
  scoreStatus: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 20, color: Color.color, marginBottom: 5 },
  charCountText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: 14, color: Color.color, opacity: 0.8 },
  sectionTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 16, marginBottom: 15, color: Color.text },
  feedbackContainer: { gap: 15 },
  emptyText: { textAlign: 'center', fontFamily: FontFamily.lexendDecaRegular, color: Color.gray, marginTop: 10 },
  footer: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: Color.stroke, gap: 15, backgroundColor: Color.bg },
  homeBtn: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: Color.stroke, justifyContent: 'center', alignItems: 'center' }
});