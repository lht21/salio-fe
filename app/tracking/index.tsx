import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LineChart } from 'react-native-chart-kit';

// Import Design System
import { FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import ScreenHeader from '../../components/ScreenHeader';
import CategoryChip from '../../components/CategoryChip';
import SkillHistoryCard from '../../components/ExamComponent/SkillHistoryCard';

// Import API Services & Types
import ProgressService from '../../api/services/progress.service';
import { SkillHistory, SkillType } from '../../api/types/progress.type';
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Tiện ích chuyển đổi Hex sang RGBA dùng cho react-native-chart-kit
 */
const hexToRgba = (hex: string, opacity: number) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16) || 144;
  const g = parseInt(h.substring(2, 4), 16) || 204;
  const b = parseInt(h.substring(4, 6), 16) || 24;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function HistoryScreen() {

  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const screenWidth = Dimensions.get('window').width;

  const [historyData, setHistoryData] = useState<SkillHistory[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [insight, setInsight] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<SkillType>('reading');

  const skills: { id: SkillType, label: string }[] = [
    { id: 'reading', label: t('practice.reading', 'Luyện đọc') },
    { id: 'listening', label: t('practice.listening', 'Luyện nghe') },
    { id: 'writing', label: t('practice.writing', 'Luyện viết') },
    { id: 'speaking', label: t('practice.speaking', 'Luyện nói') },
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        // 1. Lấy lịch sử học tập theo kỹ năng
        const response: any = await ProgressService.getSkillHistory({ page: 1, limit: 50, skill: selectedSkill });
        
        // Parse data an toàn tùy thuộc vào cấu trúc trả về của Axios
        const items = response?.data?.history || response?.history || [];
        setHistoryData(items);

        // 2. Lấy dữ liệu biểu đồ và nhận xét
        const chartRes: any = await ProgressService.getSkillChartData(selectedSkill, 10); // Hiển thị 10 bài gần nhất trên biểu đồ
        const rawChartData = chartRes?.data?.chartData || chartRes?.chartData || [];
        const rawInsight = chartRes?.data?.insight || chartRes?.insight || null;

        // Chuẩn bị dữ liệu cho react-native-chart-kit
        if (Array.isArray(rawChartData) && rawChartData.length > 0) {
          const labels = rawChartData.map((item: any) => {
            const d = new Date(item.date || item.createdAt);
            return `${d.getDate()}/${d.getMonth() + 1}`;
          });
          const scores = rawChartData.map((item: any) => item.percentage || 0);
          
          setChartData({
            labels,
            datasets: [{ data: scores }]
          });
        } else {
          setChartData(null);
        }
        setInsight(rawInsight);
      } catch (error) {
        console.error('Error fetching skill history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [selectedSkill]);

  const chartConfig = {
    backgroundColor: colors.bg2,
    backgroundGradientFrom: colors.bg2,
    backgroundGradientTo: colors.bg2,
    decimalPlaces: 0,
    color: (opacity = 1) => hexToRgba(colors.main || '#90CC18', opacity),
    labelColor: (opacity = 1) => colors.gray,
    style: { borderRadius: Border.br_15 },
    propsForDots: { r: "4", strokeWidth: "2", stroke: colors.main }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={'Lịch sử học tập'} />
      
      {/* Thanh lọc kỹ năng */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {skills.map(s => (
            <CategoryChip
              key={s.id}
              label={s.label}
              isActive={selectedSkill === s.id}
              onPress={() => setSelectedSkill(s.id)}
              activeBgColor={colors.main}
              activeBorderColor={colors.main}
              activeTextColor="#FFF"
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.main} style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Phần Biểu đồ */}
            <View style={styles.chartSection}>
              <Text style={styles.sectionTitle}>Biểu đồ tiến độ</Text>
              
              {chartData && chartData.labels.length > 0 ? (
                <View style={styles.chartWrapper}>
                  <LineChart
                    data={chartData}
                    width={screenWidth - Padding.padding_20 * 2}
                    height={220}
                    yAxisSuffix="%"
                    chartConfig={chartConfig}
                    bezier
                    style={{ borderRadius: Border.br_15, marginVertical: Gap.gap_10 }}
                  />
                </View>
              ) : (
                <View style={[styles.chartWrapper, { justifyContent: 'center', alignItems: 'center', height: 180 }]}>
                  <Text style={styles.emptyText}>Chưa đủ dữ liệu để vẽ biểu đồ</Text>
                </View>
              )}

              {/* Insight Nhận xét */}
              {insight?.message && (
                <View style={styles.insightBox}>
                  <Text style={styles.insightText}>{insight.message}</Text>
                </View>
              )}
            </View>

            {/* Phần Lịch sử chi tiết */}
            <Text style={styles.sectionTitle}>Lịch sử chi tiết</Text>
            
            {historyData.length === 0 ? (
              <Text style={styles.emptyText}>{t('history.empty', 'Chưa có lịch sử làm bài')}</Text>
            ) : (
              <View style={styles.listContainer}>
                {historyData.map((item, index) => {
                  const isLast = index === historyData.length - 1;
                  return (
                    <SkillHistoryCard
                      key={item._id}
                      title={item.title || t('history.unknown_exam', 'Đề thi không xác định')}
                      skill={item.skill}
                      score={item.score}
                      maxScore={item.maxScore}
                      percentage={item.percentage}
                      createdAt={item.createdAt}
                      isLast={isLast}
                    />
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  filterContainer: { borderBottomWidth: 1, borderBottomColor: colors.stroke, paddingBottom: Gap.gap_10 },
  filterScroll: { paddingHorizontal: Padding.padding_20, gap: Gap.gap_10 },
  scrollContent: { flexGrow: 1, padding: Padding.padding_20, paddingTop: Gap.gap_20, paddingBottom: 60, backgroundColor: colors.bg },
  sectionTitle: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: colors.text, marginBottom: Gap.gap_15 },
  chartSection: { marginBottom: Gap.gap_20 },
  chartWrapper: { backgroundColor: colors.bg2, borderRadius: Border.br_15, borderWidth: 1, borderColor: colors.stroke, overflow: 'hidden' },
  insightBox: { backgroundColor: colors.main + '15', padding: Padding.padding_15, borderRadius: Border.br_10, marginTop: Gap.gap_15 },
  insightText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.text, lineHeight: 22 },
  emptyText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.gray, textAlign: 'center', marginTop: 40 },
  listContainer: { 
    backgroundColor: colors.bg, 
    borderRadius: Border.br_15, 
    overflow: 'hidden' 
  },
});