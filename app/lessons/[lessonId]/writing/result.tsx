import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withTiming, useAnimatedProps, Easing } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
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
import { MotiView } from 'moti';

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

// Khởi tạo Component Circle có khả năng nhận Animation
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function WritingResultScreen() {
  const router = useRouter();
  // Lấy thêm các tham số được truyền từ màn hình Practice
  const { lessonId, userText, charCount, timeUsed } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('overview');

 
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // State quản lý kết quả AI và trạng thái Loading Skeleton
  const [aiData, setAiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Gọi API lấy kết quả chấm điểm sau khi đã chuyển sang trang Result
  useEffect(() => {
    const fetchGrading = async () => {
      try {
        const BACKEND_URL = 'http://192.168.1.11:5000/api/grade/writing'; 
        
        const response = await fetch(BACKEND_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topicTitle: 'Mạng xã hội', 
            topicDescription: 'Bày tỏ quan điểm của bạn về việc giới trẻ chạy theo xu hướng hiện nay.',
            userText: userText
          })
        });

        const result = await response.json();
        if (result.success) {
          setAiData(result.data);
        }
      } catch (error) {
        console.error('Lỗi khi gọi AI chấm bài:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userText) {
      fetchGrading();
    } else {
      // Nếu không có bài viết (vào xem lịch sử) thì tắt loading
      setIsLoading(false);
    }
  }, [userText]);

  const aiScore = aiData?.score || 0;
  const aiFeedbacks = aiData?.feedback || [];
  const aiDetailedCorrection = aiData?.detailedCorrection || [];

  // --- ANIMATION ĐIỂM SỐ & VÒNG TRÒN ---
  const CIRCLE_RADIUS = 60;
  const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
  const progressValue = useSharedValue(0); // Giá trị từ 0 đến 1 cho Reanimated
  const [displayScore, setDisplayScore] = useState(0); // Biến hiển thị số chạy

  useEffect(() => {
    if (aiScore > 0) {
      // 1. Chạy animation vòng tròn SVG
      progressValue.value = withTiming(aiScore / 50, {
        duration: 1500,
        easing: Easing.out(Easing.cubic),
      });

      // 2. Chạy animation đếm số bằng setInterval
      let startValue = 0;
      const duration = 1500;
      const interval = duration / aiScore; // Tính toán tốc độ nhảy số cho khớp 1.5 giây

      const counter = setInterval(() => {
        startValue += 1;
        setDisplayScore(startValue);
        if (startValue >= aiScore) {
          clearInterval(counter);
          setDisplayScore(aiScore); // Chốt điểm số chính xác cuối cùng
        }
      }, interval);

      return () => clearInterval(counter);
    } else {
      setDisplayScore(0);
      progressValue.value = 0;
    }
  }, [aiScore]);

  // Nội suy giá trị nét đứt cho SVG Circle
  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: CIRCUMFERENCE - CIRCUMFERENCE * progressValue.value,
    };
  });

  // Format thời gian hiển thị (giây -> phút:giây)
  const formatTime = (secondsStr: any) => {
    const totalSeconds = parseInt(secondsStr) || 0;
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Hàm map Icon dựa vào tiêu đề mà AI trả về
  const getIconForTitle = (title: string) => {
    if (title.includes('Nội dung')) return <TextAUnderlineIcon size={35} color={Color.color} weight="fill" />;
    if (title.includes('Từ vựng')) return <TranslateIcon size={35} color={Color.color} weight="fill" />;
    if (title.includes('Ngữ pháp')) return <BookOpenIcon size={35} color={Color.color} weight="fill" />;
    if (title.includes('mạch lạc')) return <LinkIcon size={35} color={Color.color} weight="fill" />;
    return <TextTIcon size={35} color={Color.color} weight="fill" />;
  };

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

  // --- COMPONENT SKELETON ĐỂ TẠO KHỐI XÁM NHẤP NHÁY ---
  const SkeletonBlock = ({ width, height, borderRadius = 8, style }: any) => (
    <MotiView
      from={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, type: 'timing', duration: 800 }}
      style={[{ width, height, backgroundColor: '#E2E8F0', borderRadius }, style]}
    />
  );

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
        {isLoading ? (
          // --- HIỂN THỊ SKELETON TRONG LÚC ĐỢI AI ---
          <View style={{ width: '100%' }}>
            {/* Giả lập Banner Điểm số */}
            <SkeletonBlock width="100%" height={220} borderRadius={Border.br_30} style={{ marginBottom: Gap.gap_20 }} />
            
            {/* Giả lập 4 thẻ Feedback */}
            <View style={{ gap: Gap.gap_15 }}>
              {[1, 2, 3, 4].map((i) => (
                <SkeletonBlock key={i} width="100%" height={120} borderRadius={Border.br_20} />
              ))}
            </View>
          </View>
        ) : activeTab === 'overview' ? (
          <>
            {/* Phần 1: Score Banner */}
            <LinearGradient
              colors={[Color.main, Color.greenLight]} 
              style={styles.scoreBanner}
            >
              {/* Điểm số trung tâm */}
              <View style={styles.scoreWrapper}>
                {/* Vòng tròn SVG */}
                <Svg width={136} height={136} style={styles.svgRing}>
                  {/* Vòng tròn nền mờ đằng sau */}
                  <Circle
                    cx={68} cy={68} r={CIRCLE_RADIUS}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={8} fill="transparent"
                  />
                  {/* Vòng tròn màu vàng chạy tiến độ */}
                  <AnimatedCircle
                    cx={68} cy={68} r={CIRCLE_RADIUS}
                    stroke={Color.vang || "#F9F871"}
                    strokeWidth={8} fill="transparent"
                    strokeDasharray={CIRCUMFERENCE}
                    animatedProps={animatedCircleProps}
                    strokeLinecap="round"
                    transform="rotate(-90 68 68)" // Quay -90 độ để vòng tròn bắt đầu từ hướng 12 giờ
                  />
                </Svg>
                
                {/* Chữ số bên trong */}
                <View style={styles.mainScoreCircle}>
                  <Text style={styles.mainScoreText}>{displayScore}</Text>
                  <Text style={styles.maxScoreText}>/50</Text>
                </View>
              </View>

              {/* Chỉ số phụ sử dụng Component StatCircle */}
              <View style={styles.statsRow}>
                <StatCircle 
                  icon={<TextTIcon size={20} color={Color.color} />} 
                  value={`${charCount || 0}/700`} 
                  label="ký tự" 
                />
                <StatCircle 
                  icon={<ClockIcon size={20} color={Color.color} />} 
                  value={formatTime(timeUsed)} 
                  label="phút" 
                />
                <StatCircle 
                  icon={<TargetIcon size={20} color={Color.color} />} 
                  value={`${Math.round((aiScore / 50) * 100)}%`} 
                  label="hoàn thành" 
                />
              </View>
            </LinearGradient>

            {/* Phần 2: Feedback List sử dụng Component FeedbackCard */}
            <View style={styles.feedbackList}>
              {aiFeedbacks.map((item: any, index: number) => (
                <FeedbackCard 
                  key={index.toString()}
                  title={item.title}
                  content={item.content}
                  icon={getIconForTitle(item.title)}
                />
              ))}
            </View>
          </>
        ) : (
          <DetailedCorrectionView correctionData={aiDetailedCorrection} />
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
  scoreWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Gap.gap_20,
    position: 'relative',
    width: 136,
    height: 136,
  },
  svgRing: {
    position: 'absolute',
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
