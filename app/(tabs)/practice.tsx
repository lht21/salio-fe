import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  HeadphonesIcon, 
  BookOpenTextIcon, 
  FactoryIcon, 
  PictureInPictureIcon,
  ReceiptIcon,
  MagnifyingGlassIcon
} from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import { useRouter } from 'expo-router';

// Import Components
import CategoryChip from '../../components/CategoryChip';
import SkillCard from '../../components/SkillCard';
import MocktestCard from '../../components/MocktestCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import HistoryCardSlider from '../../components/HistoryCardSlider';
import IndustryCard from '../../components/IndustryCard';
import SafetyCard from '../../components/SafetyCard';
import CreateSetButton from '../../components/CreateSetButton';

export type Level = 'EPS' | 'TOPIK I' | 'TOPIK II';

export default function PracticeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [selectedLevel, setSelectedLevel] = useState<Level>('TOPIK II');

  // Hàm helper getExamType(level: string) để map selectedLevel sang mã tương ứng của backend
  const getExamType = (level: string) => {
    if (level === 'TOPIK I') return 'topik1';
    if (level === 'TOPIK II') return 'topik2';
    if (level === 'EPS') return 'eps';
    return '';
  };

  // TODO: Dựa vào `selectedLevel` để fetch và hiển thị dữ liệu tương ứng
  // Ví dụ: const { data, isLoading } = useQuery(['practiceContent', selectedLevel], () => fetchPracticeContent(selectedLevel));

  const renderContentByLevel = () => {
    switch (selectedLevel) {
      case 'TOPIK I':
        return (
          <>
            <View style={styles.skillsRow}>
              <SkillCard 
                title={t('practice.listening', 'Luyện nghe')} 
                backgroundColor={colors.mintPastel}
                onPress={() => router.push(`/practice/listening?examType=${getExamType(selectedLevel)}`)}
                titleColor={colors.mint}
              />
              <SkillCard 
                title={t('practice.reading', 'Luyện đọc')} 
                backgroundColor={colors.bluePastel}
                onPress={() => router.push(`/practice/reading?examType=${getExamType(selectedLevel)}`)}
                titleColor={colors.blue}
              />
            </View>
            <View style={styles.mocktestContainer}>
              <MocktestCard 
                title={t('practice.mocktest_topik1', 'Thi thử TOPIK I')}
                badges={[
                  { text: t('practice.listen_30', 'Nghe: 30 câu'), type: 'purple' },
                  { text: t('practice.read_40', 'Đọc: 40 câu'), type: 'gray' }
                ]}
                onPress={() => router.push(`/practice/full?examType=${getExamType(selectedLevel)}`)}
              />
            </View>
          </>
        );
      
      case 'TOPIK II':
        return (
          <>
            <View style={styles.skillsRow}>
              <SkillCard 
                title={t('practice.listening', 'Luyện nghe')} 
                backgroundColor={colors.mintPastel}
                onPress={() => router.push(`/practice/listening?examType=${getExamType(selectedLevel)}`)}
                titleColor={colors.mint}
              />
              <SkillCard 
                title={t('practice.reading', 'Luyện đọc')} 
                backgroundColor={colors.bluePastel}
                onPress={() => router.push(`/practice/reading?examType=${getExamType(selectedLevel)}`)}
                titleColor={colors.blue}
              />
              <SkillCard 
                title={t('practice.writing', 'Luyện viết')} 
                backgroundColor={colors.orangePastel || '#FFEDD5'}
                onPress={() => router.push(`/practice/writing?examType=${getExamType(selectedLevel)}`)}
                titleColor={colors.cam || '#F97316'}
              />
            </View>
            <View style={styles.mocktestContainer}>
              <MocktestCard 
                title={t('practice.mocktest_topik2', 'Thi thử TOPIK II')}
                badges={[
                  { text: t('practice.listen_write_read', 'Nghe, Viết, Đọc'), type: 'purple' },
                ]}
                onPress={() => router.push(`/practice/full?examType=${getExamType(selectedLevel)}`)}
              />
            </View>
          </>
        );

      case 'EPS':
        return (
          <>
            {/* Nhóm các kỹ năng luyện tập */}
            <View style={styles.skillsRow}>
              <SkillCard 
                title={t('practice.listening_eps', 'Luyện nghe EPS')} 
                icon={<HeadphonesIcon size={24} color={colors.mint} weight="fill" />}
                backgroundColor={colors.mintPastel}
                onPress={() => router.push(`/practice/listening?examType=${getExamType(selectedLevel)}`)}
              />
              <SkillCard 
                title={t('practice.reading_eps', 'Luyện đọc EPS')} 
                icon={<BookOpenTextIcon size={24} color={colors.blue} weight="fill" />}
                backgroundColor={colors.bluePastel}
                onPress={() => router.push(`/practice/reading?examType=${getExamType(selectedLevel)}`)}
              />
            </View>
            <View style={styles.skillsRow}>
              <SkillCard 
                title={t('practice.pic_vocab', 'Nhìn hình chọn từ')} 
                icon={<PictureInPictureIcon size={24} color={colors.green} weight="fill" />}
                backgroundColor={colors.picVocabBg || "#DCFCE7"}
                titleColor={colors.picVocabText || "#16A34A"}
                onPress={() => { /* TODO: Navigate */ }}
              />
              <SkillCard 
                title={t('practice.real_info', 'Thông tin thực tế')} 
                icon={<ReceiptIcon size={24} color={colors.purple} weight="fill" />}
                backgroundColor={colors.purplePastel}
                onPress={() => { /* TODO: Navigate */ }}
              />
            </View>

            {/* Nhóm các thẻ đặc thù của EPS */}
            <IndustryCard 
              title={t('practice.industry', 'Chọn ngành nghề')}
              subtitle={t('practice.industry_desc', 'Sản xuất, Xây dựng, Nông nghiệp, Ngư nghiệp')}
              icon={<FactoryIcon size={24} color={colors.factoryIcon || "#B45309"} weight="fill" />}
              onPress={() => { /* TODO: Navigate to industry selection */ }}
            />
            <SafetyCard onPress={() => { /* TODO: Navigate to safety practice */ }} />
            
            {/* Thi thử */}
            <MocktestCard 
              title={t('practice.mocktest_eps', 'Thi thử EPS-TOPIK')}
              badges={[
                { text: t('practice.eps_20_20', '20 câu Đọc + 20 câu Nghe'), type: 'purple' },
                { text: t('practice.cbt_sim', 'Mô phỏng CBT'), type: 'gray' }
              ]}
              onPress={() => router.push(`/practice/full?examType=${getExamType(selectedLevel)}`)}
            />
          </>
        );
      default:
        return null;
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('practice.title', 'Luyện thi')}</Text>
        <CreateSetButton 
          title="Tìm mọi đề"
          icon={<MagnifyingGlassIcon size={15} color={colors.bg} weight="bold" />}
          onPress={() => router.push('/practice/search-exam')}
        />
      </View>

      <View style={styles.chipRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {(['TOPIK II', 'TOPIK I', 'EPS'] as Level[]).map(level => (
            <CategoryChip
              key={level}
              label={level}
              isActive={selectedLevel === level}
              onPress={() => setSelectedLevel(level)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Render content based on selected level */}
        {renderContentByLevel()}
        
        {/* Lịch sử làm bài (History Slider) */}
        <View style={styles.historyContainer}>
          <HistoryCardSlider />
        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg
    
  },
  scrollContent: {
    paddingHorizontal: Padding.padding_15 || 15,
    paddingTop: 0,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Padding.padding_15 || 15,
    paddingTop: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold, 
    fontSize: FontSize.fs_20 || 20, 
    color: colors.text || '#1E1E1E' 
  },
  chipRow: {
    marginBottom: Gap.gap_20 || 20,
  },
  chipScroll: {
    paddingHorizontal: Padding.padding_15 || 15,
    gap: 10,
  },
  skillsRow: {
    flexDirection: 'row',
    gap: Gap.gap_15 || 15,
    marginBottom: Gap.gap_20 || 20,
  },
  mocktestContainer: {
    width: '100%',
  },
  historyContainer: {
    marginTop: Gap.gap_20 || 20,
  },
});