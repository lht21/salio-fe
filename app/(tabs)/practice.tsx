import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { 
  CaretDownIcon, 
  HeadphonesIcon, 
  BookOpenTextIcon, 
  FactoryIcon, 
  PictureInPictureIcon,
  ReceiptIcon
} from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
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
  const [isLevelModalVisible, setLevelModalVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level>('TOPIK II');
  const [showAlert, setShowAlert] = useState(true);

  // TODO: Dựa vào `selectedLevel` để fetch và hiển thị dữ liệu tương ứng
  // Ví dụ: const { data, isLoading } = useQuery(['practiceContent', selectedLevel], () => fetchPracticeContent(selectedLevel));

  const renderContentByLevel = () => {
    switch (selectedLevel) {
      case 'TOPIK I':
        return (
          <>
            <WritingFeaturedCard
              title="Luyện viết & Sắp xếp câu"
              subtitle="Nắm vững ngữ pháp để làm tốt phần Đọc hiểu"
              onPress={() => router.push('/practice/writing')} 
            />
            <View style={styles.skillsRow}>
              <SkillCard 
                title="Luyện nghe" 
                backgroundColor={Color.mintPastel}
                onPress={() => router.push('/practice/listening')}
                titleColor={Color.mint}
              />
              <SkillCard 
                title="Luyện đọc" 
                backgroundColor={Color.bluePastel}
                onPress={() => router.push('/practice/reading')}
                titleColor={Color.blue}
              />
            </View>
            <View style={styles.mocktestContainer}>
              <MocktestCard 
                title="Thi thử TOPIK I"
                badges={[
                  { text: 'Nghe: 30 câu', type: 'purple' },
                  { text: 'Đọc: 40 câu', type: 'gray' }
                ]}
                onPress={() => router.push('/practice/mock-exam-topik1')}
              />
            </View>
          </>
        );
      
      case 'TOPIK II':
        return (
          <>
            <WritingFeaturedCard
              title="Luyện viết TOPIK II"
              subtitle="Luyện viết biểu đồ (câu 53) và viết luận (câu 54)"
              onPress={() => router.push('/practice/writing')} 
            />
            <View style={styles.skillsRow}>
              <SkillCard 
                title="Luyện nghe" 
                backgroundColor={Color.mintPastel}
                onPress={() => router.push('/practice/listening')}
                titleColor={Color.mint}
              />
              <SkillCard 
                title="Luyện đọc" 
                backgroundColor={Color.bluePastel}
                onPress={() => router.push('/practice/reading')}
                titleColor={Color.blue}
              />
            </View>
            <View style={styles.mocktestContainer}>
              <MocktestCard 
                title="Thi thử TOPIK II"
                badges={[
                  { text: 'Nghe, Viết, Đọc', type: 'purple' },
                ]}
                onPress={() => router.push('/practice/mock-exam')}
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
                title="Luyện nghe EPS" 
                icon={<HeadphonesIcon size={24} color={Color.mint} weight="fill" />}
                backgroundColor={Color.mintPastel}
                onPress={() => router.push('/practice/listening')}
              />
              <SkillCard 
                title="Luyện đọc EPS" 
                icon={<BookOpenTextIcon size={24} color={Color.blue} weight="fill" />}
                backgroundColor={Color.bluePastel}
                onPress={() => router.push('/practice/reading')}
              />
            </View>
            <View style={styles.skillsRow}>
              <SkillCard 
                title="Nhìn hình chọn từ" 
                icon={<PictureInPictureIcon size={24} color={Color.green} weight="fill" />}
                backgroundColor="#DCFCE7"
                titleColor="#16A34A"
                onPress={() => { /* TODO: Navigate */ }}
              />
              <SkillCard 
                title="Thông tin thực tế" 
                icon={<ReceiptIcon size={24} color={Color.purple} weight="fill" />}
                backgroundColor={Color.purplePastel}
                onPress={() => { /* TODO: Navigate */ }}
              />
            </View>

            {/* Nhóm các thẻ đặc thù của EPS */}
            <IndustryCard 
              title="Chọn ngành nghề"
              subtitle="Sản xuất, Xây dựng, Nông nghiệp, Ngư nghiệp"
              icon={<FactoryIcon size={24} color="#B45309" weight="fill" />}
              onPress={() => { /* TODO: Navigate to industry selection */ }}
            />
            <SafetyCard onPress={() => { /* TODO: Navigate to safety practice */ }} />
            
            {/* Thi thử */}
            <MocktestCard 
              title="Thi thử EPS-TOPIK"
              badges={[
                { text: '20 câu Đọc + 20 câu Nghe', type: 'purple' },
                { text: 'Mô phỏng CBT', type: 'gray' }
              ]}
              onPress={() => router.push('/practice/mock-exam-eps')}
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
            text="Bạn đã đạt 200 điểm TOPIK từ lần thi thử trước đó nên trình độ TOPIK sẽ tự động thay đổi theo số điểm của bạn. Nhưng bạn cũng có thể lựa chọn lại các trình độ khác ngoài trình độ hiện tại này!"
            buttonTitle="Đóng"
            onPress={() => setShowAlert(false)}
          />
        </View>
      )}

      {/* Header Section */}
      <View style={styles.header}>

          <Text style={styles.headerTitle}>Luyện thi</Text>
          
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Cấp độ đề</Text>
            <TouchableOpacity style={styles.filterDropdown} onPress={() => setLevelModalVisible(true)}>
              <Text style={styles.filterText}>{selectedLevel}</Text>
              <CaretDownIcon size={14} color={Color.text} weight="bold" />
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
        isVisible={isLevelModalVisible}
        currentLevel={selectedLevel}
        onClose={() => setLevelModalVisible(false)}
        onSelectLevel={(level) => setSelectedLevel(level)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg
    
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
    color: Color.text || '#1E1E1E' 
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: '#64748B', // Xám đậm
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.main || '#98F291',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Border.br_10 || 10,
    gap: 4,
  },
  filterText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12 || 12,
    color: Color.text,
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