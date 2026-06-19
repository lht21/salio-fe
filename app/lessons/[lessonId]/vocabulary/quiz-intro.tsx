import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

// --- IMPORT COMPONENTS & CONSTANTS ---
import { Color, FontFamily, FontSize, Padding, Border, Gap } from '../../../../constants/GlobalStyles';
import Button from '../../../../components/Button';
import IconButton from '../../../../components/IconButton';
import { XIcon } from 'phosphor-react-native';
import VocabularyService from '../../../../api/services/vocabulary.service';


export default function QuizIntroScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams();

   const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ remembered: 0, learning: 0, forgotten: 0, total: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Lấy danh sách từ vựng và tiến độ học
        const response = await VocabularyService.getStudyQueue({ lessonId: lessonId as string, limit: 100 });
        if (response.success && response.data) {
          let remembered = 0, learning = 0, forgotten = 0;
          response.data.forEach((item: any) => {
            const status = item.learningStatus?.status;
            if (status === 'remembered') remembered++;
            else if (status === 'learning') learning++;
            else if (status === 'forgotten') forgotten++;
            else learning++; // Mặc định là đang học
          });
          setStats({ remembered, learning, forgotten, total: response.data.length });
        }
      } catch (error) {
        console.error('Lỗi tải thống kê:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (lessonId) fetchStats();
  }, [lessonId]);

  // --- XỬ LÝ SỰ KIỆN ---


  const handleStart = () => {
    // Điều hướng tới màn hình làm bài trắc nghiệm
    router.push(`/lessons/${lessonId}/vocabulary/quiz`);
  };

  const unmasteredCount = stats.learning + stats.forgotten;
  const canStartQuiz = unmasteredCount >= 4;
  
  // Thông số cho biểu đồ tròn (Pie Chart)
  const radius = 60;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  const masterPercent = stats.total > 0 ? (stats.remembered / stats.total) * 100 : 0;
  const strokeDashoffset = circumference - (masterPercent / 100) * circumference;


  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* 1. HEADER: Chỉ có nút X ở góc phải */}
      <View style={styles.header}>
        <IconButton Icon={XIcon} onPress={() => router.push(`/lessons/${lessonId}/vocabulary/intro` as any)} />
          
      </View>

      {/* 2. NỘI DUNG CHÍNH */}
       {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Color.main} />
          <Text style={styles.loadingText}>Đang tổng hợp kết quả...</Text>
        </View>
      ) : (
        <View style={styles.content}>
        
        {/* Phần 1: Hình ảnh minh họa */}
                  {/* Phần 1: Tiêu đề */}
          <View style={styles.titleRow}>
            <Text style={styles.roundText}>Thống kê</Text>
            <Text style={styles.titleText}>Flashcard</Text>
          </View>

  {/* Phần 2: Biểu đồ tròn (Pie Chart) */}
          <View style={styles.chartContainer}>
            <Svg width={160} height={160} viewBox="0 0 160 160">
              {/* Vòng tròn nền (Phần chưa thành thạo) */}
              <Circle
                cx="80"
                cy="80"
                r={radius}
                stroke={Color.stroke}
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Vòng tròn phần trăm (Phần thành thạo) */}
              <Circle
                cx="80"
                cy="80"
                r={radius}
                stroke={Color.main}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
              />
            </Svg>
            <View style={styles.chartInner}>
              <Text style={styles.chartPercent}>{Math.round(masterPercent)}%</Text>
              <Text style={styles.chartLabel}>Thành thạo</Text>
            </View>
          </View>

          {/* Phần 3: Chi tiết số liệu */}
          <View style={styles.statsBox}>
            <View style={styles.statRow}>
              <View style={[styles.dot, { backgroundColor: Color.main }]} />
              <Text style={styles.statLabel}>Thành thạo:</Text>
              <Text style={styles.statValue}>{stats.remembered} từ</Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.statLabel}>Đang học:</Text>
              <Text style={styles.statValue}>{stats.learning} từ</Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.dot, { backgroundColor: Color.cam }]} />
              <Text style={styles.statLabel}>Chưa học (Đã quên):</Text>
              <Text style={styles.statValue}>{stats.forgotten} từ</Text>
            </View>
          </View>

          {/* Phần 4: Nhắc nhở điều kiện thi */}
          {!canStartQuiz && stats.total > 0 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Bạn cần có ít nhất 4 từ vựng "Đang học" hoặc "Chưa học" để tạo bài trắc nghiệm ôn tập. Hiện tại bạn chỉ còn {unmasteredCount} từ.
              </Text>
            </View>
          )}
          
        </View>
      )}

      {/* 3. FOOTER: Nút Bắt đầu */}
      <View style={styles.footer}>
           {canStartQuiz ? (
          <Button 
            title="Bắt đầu Trắc nghiệm" 
            variant="Green" 
            onPress={handleStart} 
          />
        ) : (
          <Button 
            title="Quay lại Bài học" 
            variant="Outline" 
            onPress={() => router.push(`/lessons/${lessonId}/vocabulary/intro` as any)} 
          />
        )}
      </View>


    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
  },

  content: {
    flex: 1,
    paddingHorizontal: Padding.padding_20,
    justifyContent: 'center', // Căn giữa toàn bộ cụm nội dung theo trục dọc
    alignItems: 'center',
  },

  illustration: {
    width: 250,
    height: 270,
    borderRadius: 40,
    marginBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    color: Color.text,
    marginTop: Gap.gap_10,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  
  roundText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_20,
    color: Color.text, // Xám đậm / Đen
  },
  
  titleText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_20,
    color: Color.cam, // Màu cam từ thiết kế
  },

  descriptionBox: {
    width: '100%',
    backgroundColor: '#F0FFF0', // Nền xanh mờ
    paddingVertical: Padding.padding_20,
    paddingHorizontal: Padding.padding_15,
    borderRadius: Border.br_20,
    borderWidth: 1.5,
    borderColor: Color.main,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  descriptionText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.text,
    textAlign: 'center',
    lineHeight: 22,
  },

  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  chartInner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPercent: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 28,
    color: Color.main,
  },
  chartLabel: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 12,
    color: Color.gray,
  },

  statsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    padding: Padding.padding_20,
    borderRadius: Border.br_20,
    gap: 15,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statLabel: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  statValue: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },

  warningBox: {
    width: '100%',
    marginTop: Gap.gap_20,
    padding: 15,
    backgroundColor: '#FEF2F2',
    borderRadius: Border.br_15,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  warningText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: '#EF4444',
    textAlign: 'center',
    lineHeight: 22,
  },

  footer: {
    paddingHorizontal: Padding.padding_15,
    paddingBottom: Padding.padding_30,
    paddingTop: Padding.padding_10,
  },
});