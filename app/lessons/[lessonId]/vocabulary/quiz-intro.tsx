import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

// --- IMPORT COMPONENTS & CONSTANTS ---
import { FontFamily, FontSize, Padding, Border, Gap } from '../../../../constants/GlobalStyles';
import Button from '../../../../components/Button';
import IconButton from '../../../../components/IconButton';
import { XIcon } from 'phosphor-react-native';
import VocabularyService from '../../../../api/services/vocabulary.service';
import { useTheme } from "@/contexts/ThemeContext";

export default function QuizIntroScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);

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
          <ActivityIndicator size="large" color={colors.main} />
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
                stroke={colors.stroke}
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Vòng tròn phần trăm (Phần thành thạo) */}
              <Circle
                cx="80"
                cy="80"
                r={radius}
                stroke={colors.main}
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
              <View style={[styles.dot, { backgroundColor: colors.main }]} />
              <Text style={styles.statLabel}>Thành thạo:</Text>
              <Text style={styles.statValue}>{stats.remembered} từ</Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.statLabel}>Đang học:</Text>
              <Text style={styles.statValue}>{stats.learning} từ</Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.dot, { backgroundColor: colors.cam }]} />
              <Text style={styles.statLabel}>Chưa học (Đã quên):</Text>
              <Text style={styles.statValue}>{stats.forgotten} từ</Text>
            </View>
          </View>

          {/* Phần 4: Nhắc nhở điều kiện thi */}
          {!canStartQuiz && stats.total > 0 && unmasteredCount > 0 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Bạn cần có ít nhất 4 từ vựng "Đang học" hoặc "Chưa học" để tạo bài trắc nghiệm ôn tập. Hiện tại bạn chỉ còn {unmasteredCount} từ.
              </Text>
            </View>
          )}
          
          {!canStartQuiz && stats.total > 0 && unmasteredCount === 0 && (
            <View style={[styles.warningBox, { backgroundColor: '#F0FFF0', borderColor: colors.main }]}>
              <Text style={[styles.warningText, { color: colors.main }]}>
                Tuyệt vời! Bạn đã thông thạo toàn bộ từ vựng trong bài này.
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
        ) : (!canStartQuiz && stats.total > 0 && unmasteredCount === 0) ? (
          <Button 
            title="Tiếp tục sang Ngữ pháp" 
            variant="Green" 
            onPress={() => router.push(`/lessons/${lessonId}/grammar/intro` as any)} 
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
const getStyles = (colors: any) => StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: colors.bg,
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
        color: colors.text,
        marginTop: Gap.gap_10,
      },

      titleRow: {
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: 30,
      },
      
      roundText: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: FontSize.fs_20,
        color: colors.text, // Xám đậm / Đen
      },
      
      titleText: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: FontSize.fs_24,
        color: colors.cam, // Màu cam từ thiết kế
      },

      descriptionBox: {
        width: '100%',
        backgroundColor: '#F0FFF0', // Nền xanh mờ
        paddingVertical: Padding.padding_20,
        paddingHorizontal: Padding.padding_15,
        borderRadius: Border.br_20,
        borderWidth: 1.5,
        borderColor: colors.main,
        borderStyle: 'dashed',
        alignItems: 'center',
      },
      descriptionText: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_14,
        color: colors.text,
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
        color: colors.main,
      },
      chartLabel: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: 12,
        color: colors.gray,
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
        color: colors.text,
      },
      statValue: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: FontSize.fs_14,
        color: colors.text,
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