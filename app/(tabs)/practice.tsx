import React, { useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { 
  CaretDownIcon, 
  HeadphonesIcon, 
  BookOpenTextIcon, 
  FactoryIcon, 
  PictureInPictureIcon,
  ReceiptIcon
} from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import { useRouter } from 'expo-router';

// Import Components
import LevelFilterModal, { Level } from '../../components/Modals/LevelFilterModal';
import WritingFeaturedCard from '../../components/WritingFeaturedCard';
import SkillCard from '../../components/SkillCard';
import MocktestCard from '../../components/MocktestCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import HistoryCardSlider from '../../components/HistoryCardSlider';
import IndustryCard from '../../components/IndustryCard';
import SafetyCard from '../../components/SafetyCard';
import AlertBanner from '../../components/AlertBanner';

export default function PracticeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const levelSheetRef = useRef<BottomSheetModal>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>('TOPIK II');
  const [showAlert, setShowAlert] = useState(true);

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
            <WritingFeaturedCard
              title={t('practice.writing_topik2', 'Luyện viết TOPIK II')}
              subtitle={t('practice.writing_desc', 'Luyện viết biểu đồ (câu 53) và viết luận (câu 54)')}
              onPress={() => router.push(`/practice/writing?examType=${getExamType(selectedLevel)}`)} 
            />
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
      
      {showAlert && (
        <View style={{ paddingTop: 20 }}>
          <AlertBanner 
            text={t('practice.alert_text', "Bạn đã đạt 200 điểm TOPIK từ lần thi thử trước đó nên trình độ TOPIK sẽ tự động thay đổi theo số điểm của bạn. Nhưng bạn cũng có thể lựa chọn lại các trình độ khác ngoài trình độ hiện tại này!")}
            buttonTitle={t('practice.close', "Đóng")}
            onPress={() => setShowAlert(false)}
          />
        </View>
      )}

      {/* Header Section */}
      <View style={styles.header}>

          <Text style={styles.headerTitle}>{t('practice.title', 'Luyện thi')}</Text>
          
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>{t('practice.level', 'Cấp độ đề')}</Text>
            <TouchableOpacity style={styles.filterDropdown} onPress={() => levelSheetRef.current?.present()}>
              <Text style={styles.filterText}>{selectedLevel}</Text>
              <CaretDownIcon size={14} color={colors.main} weight="bold" />
            </TouchableOpacity>
          </View>
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

      <LevelFilterModal 
        ref={levelSheetRef}
        currentLevel={selectedLevel}
        onClose={() => levelSheetRef.current?.dismiss()}
        onSelectLevel={(level) => setSelectedLevel(level)}
      />
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
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold, 
    fontSize: FontSize.fs_20 || 20, 
    color: colors.text || '#1E1E1E' 
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: colors.gray || '#64748B', // Xám đậm
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.text || '#98F291',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Border.br_10 || 10,
    gap: 4,
  },
  filterText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12 || 12,
    color: colors.bg,
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