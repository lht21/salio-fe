import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  TextAUnderlineIcon, 
  TranslateIcon, 
  BookOpenIcon, 
  LinkIcon,
  TextTIcon,
  ClockIcon,
  TargetIcon,
  SealQuestionIcon,
  HouseIcon
} from 'phosphor-react-native';

// Constants & Components
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import CloseButton from '../../../../components/CloseButton';
import CategoryChip from '../../../../components/CategoryChip';
import Button from '../../../../components/Button';

// Đã import các sub-components vừa tạo
import StatCircle from '../../../../components/StatCircle';
import FeedbackCard from '../../../../components/FeedbackCard';
import DetailedCorrectionView from '../../../../components/DetailedCorrectionView';
import ActionMenuModal from '@/components/ActionMenuModal';
import ShareModal from '@/components/Modals/ShareModal';

// --- MOCK DATA ---
const FEEDBACK_DATA = [
  {
    id: '1',
    title: 'Nội dung',
    icon: <TextAUnderlineIcon size={35} color={Color.color} weight="fill" />,
    content: 'Bài viết trả lời đúng trọng tâm câu hỏi. Tuy nhiên, các ý phát triển còn hơi sơ sài, cần bổ sung thêm ví dụ thực tế để làm rõ quan điểm.',
  },
  {
    id: '2',
    title: 'Từ vựng',
    icon: <TranslateIcon size={35} color={Color.color} weight="fill" />,
    content: 'Sử dụng được một số từ vựng trung cấp tốt. Có 2 lỗi sai chính tả nhẹ và lặp từ "생각하다" quá nhiều lần.',
  },
  {
    id: '3',
    title: 'Ngữ pháp',
    icon: <BookOpenIcon size={35} color={Color.color} weight="fill" />,
    content: 'Cấu trúc -(으)ㄹ 뿐만 아니라 được áp dụng chính xác. Chú ý tiểu từ chủ ngữ (이/가) ở câu số 3 bị dùng sai thành (은/는).',
  },
  {
    id: '4',
    title: 'Độ mạch lạc',
    icon: <LinkIcon size={35} color={Color.color} weight="fill" />,
    content: 'Các câu liên kết với nhau khá tốt nhờ dùng đúng các từ nối (그래서, 그런데). Đoạn kết bài cần tóm tắt lại ý chính một cách mạnh mẽ hơn.',
  },
];

export default function WritingResultScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('overview');

 
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // --- HANDLERS DÀNH CHO ĐIỀU HƯỚNG ---
  const handleClose = () => {
    router.replace('/(tabs)');
  };

  const handleRetry = () => {
    setShowActionMenu(false); // Đóng modal trước khi chuyển trang
    router.replace(`/lessons/${lessonId}/writing/practice`);
  };

  // --- HANDLERS DÀNH CHO MODAL MENU ---
  const handleReport = () => {
    setShowActionMenu(false);
    Alert.alert("Báo cáo lỗi sai", "Ghi nhận phản hồi của bạn. Cảm ơn bạn đã giúp hệ thống tốt hơn!");
  };

  const handleShare = () => {
    setShowActionMenu(false); // Đóng menu tùy chọn
    setTimeout(() => {
      setShowShareModal(true); // Đợi 300ms rồi mở menu Chia sẻ
    }, 300); 
  };

  const handleViewSample = () => {
    setShowActionMenu(false);
    Alert.alert("Xem bài mẫu", "Đang hiển thị bài mẫu tham khảo...");
  };

  const handleViewHistory = () => {
    setShowActionMenu(false);
    Alert.alert("Lịch sử bài viết", "Đang hiển thị lịch sử các bài viết của bạn...");
  };

  const handleDownloadPDF = () => {
    setShowActionMenu(false);
    Alert.alert("Tải xuống PDF", "Đang tải xuống bài viết dưới dạng PDF...");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Kết quả bài viết</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.helpButton} onPress={() => setShowActionMenu(true)}>
              <SealQuestionIcon size={20} color={Color.bg} weight="bold" />
            </TouchableOpacity>
            <CloseButton variant="Stroke" onPress={handleClose} />
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <CategoryChip 
            label="Tổng quan" 
            isActive={activeTab === 'overview'} 
            onPress={() => setActiveTab('overview')} 
          />
          <CategoryChip 
            label="Sửa bài chi tiết" 
            isActive={activeTab === 'detailed'} 
            onPress={() => setActiveTab('detailed')} 
          />
        </View>
      </View>

      {/* --- BODY CONTENT --- */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'overview' ? (
          <>
            {/* Phần 1: Score Banner */}
            <LinearGradient
              colors={[Color.main, Color.greenLight]} 
              style={styles.scoreBanner}
            >
              {/* Điểm số trung tâm */}
              <View style={styles.mainScoreCircle}>
                <Text style={styles.mainScoreText}>38</Text>
                <Text style={styles.maxScoreText}>/50</Text>
              </View>

              {/* Chỉ số phụ sử dụng Component StatCircle */}
              <View style={styles.statsRow}>
                <StatCircle 
                  icon={<TextTIcon size={20} color={Color.color} />} 
                  value="646/700" 
                  label="ký tự" 
                />
                <StatCircle 
                  icon={<ClockIcon size={20} color={Color.color} />} 
                  value="32:15" 
                  label="phút" 
                />
                <StatCircle 
                  icon={<TargetIcon size={20} color={Color.color} />} 
                  value="85%" 
                  label="chính xác" 
                />
              </View>
            </LinearGradient>

            {/* Phần 2: Feedback List sử dụng Component FeedbackCard */}
            <View style={styles.feedbackList}>
              {FEEDBACK_DATA.map((item) => (
                <FeedbackCard 
                  key={item.id}
                  title={item.title}
                  content={item.content}
                  icon={item.icon}
                />
              ))}
            </View>
          </>
        ) : (
          <DetailedCorrectionView />
        )}
      </ScrollView>

      {/* --- FOOTER (Cố định) --- */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.retryButton} 
          activeOpacity={0.8}
          onPress={() => router.replace(`/(tabs)`)}
        >
          <HouseIcon size={20} color={Color.color} weight="duotone" />
        </TouchableOpacity>

        <Button 
          title="Luyện tập lại" 
          variant="Green" 
          onPress={handleClose}
          style={styles.continueButton}
        />
      </View>

      <ActionMenuModal 
        isVisible={showActionMenu}
        onClose={() => setShowActionMenu(false)}
        onRetry={handleRetry}
        onReport={handleReport}
        onShare={handleShare}
        onViewSample={handleViewSample}
        onViewHistory={handleViewHistory}
        onDownloadPDF={handleDownloadPDF}

      />

      <ShareModal 
        isVisible={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

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
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
    backgroundColor: Color.bg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.gap_15,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: Color.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_10,
  },
  helpButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Color.color, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSelector: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: Gap.gap_10,
    paddingBottom: Padding.padding_10,
  },
  scrollContent: {
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_15,
    paddingBottom: 40,
  },
  scoreBanner: {
    borderRadius: Border.br_30, 
    padding: 24,
    alignItems: 'center',
    marginBottom: Gap.gap_20,
  },
  mainScoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Color.color,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Color.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: Gap.gap_20,
  },
  mainScoreText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 40,
    color: Color.vang,
    lineHeight: 45,
  },
  maxScoreText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.bg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  feedbackList: {
    gap: Gap.gap_15,
  },
  // Footer Styles
  footer: {
    flexDirection: 'row', // Chuyển bố cục sang hàng ngang
    alignItems: 'center',
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_15,
    paddingBottom: Padding.padding_30,
    backgroundColor: Color.bg,
    borderTopWidth: 1,
    borderTopColor: Color.stroke,
    gap: Gap.gap_15, // Khoảng cách đều giữa 2 nút
  },
  retryButton: {
    paddingHorizontal: Padding.padding_15, // Chia đều 50% chiều rộng
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 47, // Chiều cao chuẩn đồng bộ với Button.tsx của hệ thống
    borderRadius: 37, // Bo góc mạnh đồng bộ
    borderWidth: 1.5,
    borderColor: Color.stroke, // Viền xám mờ
    backgroundColor: Color.bg,
    gap: Gap.gap_8,
  },
  retryButtonText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  continueButton: {
    flex: 1, // Chia đều 50% chiều rộng
    marginVertical: 0, // Triệt tiêu marginVertical mặc định trong Button.tsx để 2 nút thẳng hàng
  },
});
