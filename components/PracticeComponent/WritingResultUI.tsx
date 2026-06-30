import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withTiming, useAnimatedProps, Easing } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { 
  TextAUnderlineIcon, TranslateIcon, BookOpenIcon, LinkIcon,
  TextTIcon, ClockIcon, TargetIcon, SealQuestionIcon, HouseIcon,
  XIcon
} from 'phosphor-react-native';

import { FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import IconButton from '../IconButton';
import CategoryChip from '../CategoryChip';
import Button from '../Button';
import StatCircle from '../StatCircle';
import FeedbackCard from '../FeedbackCard';
import DetailedCorrectionView from '../DetailedCorrectionView';
import ActionMenuModal from '@/components/ActionMenuModal';
import ShareModal from '@/components/Modals/ShareModal';
import { useTheme } from "@/contexts/ThemeContext";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface WritingResultUIProps {
  data: any;
  onHomePress: () => void;
  onRetryPress: () => void;
}

export default function WritingResultUI({ data, onHomePress, onRetryPress }: WritingResultUIProps) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('overview');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const evaluation = data?.evaluation || {};
  const aiScore = evaluation?.totalScore || 0;
  const aiFeedbacks = evaluation?.aiFeedback || [];
  const aiDetailedCorrection = evaluation?.detailedCorrection || [];
  const charCount = data?.content?.length || 0;
  const timeUsed = data?.timeSpent || 0;
  
  const CIRCLE_RADIUS = 60;
  const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
  const progressValue = useSharedValue(0);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (aiScore > 0) {
      progressValue.value = withTiming(aiScore / 50, {
        duration: 1500,
        easing: Easing.out(Easing.cubic),
      });

      let startValue = 0;
      const duration = 1500;
      const interval = duration / aiScore;

      const counter = setInterval(() => {
        startValue += 1;
        setDisplayScore(startValue);
        if (startValue >= aiScore) {
          clearInterval(counter);
          setDisplayScore(aiScore);
        }
      }, interval);
      return () => clearInterval(counter);
    } else {
      setDisplayScore(0);
      progressValue.value = 0;
    }
  }, [aiScore]);

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: CIRCUMFERENCE - CIRCUMFERENCE * progressValue.value,
    };
  });

  const formatTime = (secondsStr: any) => {
    const totalSeconds = parseInt(secondsStr) || 0;
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getIconForTitle = (title: string) => {
    if (title.includes('Nội dung')) return <TextAUnderlineIcon size={35} color={colors.color} weight="fill" />;
    if (title.includes('Từ vựng')) return <TranslateIcon size={35} color={colors.color} weight="fill" />;
    if (title.includes('Ngữ pháp')) return <BookOpenIcon size={35} color={colors.color} weight="fill" />;
    if (title.includes('mạch lạc')) return <LinkIcon size={35} color={colors.color} weight="fill" />;
    return <TextTIcon size={35} color={colors.color} weight="fill" />;
  };

  const handleReport = () => {
    setShowActionMenu(false);
    Alert.alert("Báo cáo lỗi sai", "Ghi nhận phản hồi của bạn. Cảm ơn bạn đã giúp hệ thống tốt hơn!");
  };

  const handleShare = () => {
    setShowActionMenu(false);
    setTimeout(() => { setShowShareModal(true); }, 300); 
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
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Kết quả bài viết</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.helpButton} onPress={() => setShowActionMenu(true)}>
              <SealQuestionIcon size={20} color={colors.bg} weight="bold" />
            </TouchableOpacity>
            <IconButton Icon={XIcon} onPress={onHomePress} />
            
          </View>
        </View>

        <View style={styles.tabSelector}>
          <CategoryChip label="Tổng quan" isActive={activeTab === 'overview'} onPress={() => setActiveTab('overview')} />
          <CategoryChip label="Sửa bài chi tiết" isActive={activeTab === 'detailed'} onPress={() => setActiveTab('detailed')} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'overview' ? (
          <>
            <LinearGradient colors={[colors.main, colors.greenLight]} style={styles.scoreBanner}>
              <View style={styles.scoreWrapper}>
                <Svg width={136} height={136} style={styles.svgRing}>
                  <Circle cx={68} cy={68} r={CIRCLE_RADIUS} stroke="rgba(255,255,255,0.2)" strokeWidth={8} fill="transparent" />
                  <AnimatedCircle
                    cx={68} cy={68} r={CIRCLE_RADIUS}
                    stroke={colors.vang || "#F9F871"} strokeWidth={8} fill="transparent"
                    strokeDasharray={CIRCUMFERENCE} animatedProps={animatedCircleProps}
                    strokeLinecap="round" transform="rotate(-90 68 68)"
                  />
                </Svg>
                
                <View style={styles.mainScoreCircle}>
                  <Text style={styles.mainScoreText}>{displayScore}</Text>
                  <Text style={styles.maxScoreText}>/50</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <StatCircle icon={<TextTIcon size={20} color={colors.color} />} value={`${charCount}/700`} label="ký tự" />
                <StatCircle icon={<ClockIcon size={20} color={colors.color} />} value={formatTime(timeUsed)} label="phút" />
                <StatCircle icon={<TargetIcon size={20} color={colors.color} />} value={`${Math.round((aiScore / 50) * 100)}%`} label="hoàn thành" />
              </View>
            </LinearGradient>

            <View style={styles.feedbackList}>
              {aiFeedbacks.map((item: any, index: number) => (
                <FeedbackCard 
                  key={index.toString()} title={item.title} content={item.content} icon={getIconForTitle(item.title)}
                />
              ))}
            </View>
          </>
        ) : (
          <DetailedCorrectionView correctionData={aiDetailedCorrection} />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.retryButton} activeOpacity={0.8} onPress={onHomePress}>
          <HouseIcon size={20} color={colors.color} weight="duotone" />
        </TouchableOpacity>

        <Button title="Luyện tập lại" variant="Green" onPress={onRetryPress} style={styles.continueButton} />
      </View>

      <ActionMenuModal 
        isVisible={showActionMenu} onClose={() => setShowActionMenu(false)} onRetry={onRetryPress} onReport={handleReport}
        onShare={handleShare} onViewSample={handleViewSample} onViewHistory={handleViewHistory} onDownloadPDF={handleDownloadPDF}
      />

      <ShareModal isVisible={showShareModal} onClose={() => setShowShareModal(false)} />
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      safeArea: { flex: 1, backgroundColor: colors.bg },
      header: { paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_10, backgroundColor: colors.bg },
      headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_15 },
      headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_20, color: colors.text },
      headerActions: { flexDirection: 'row', alignItems: 'center', gap: Gap.gap_10 },
      helpButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.color, justifyContent: 'center', alignItems: 'center' },
      tabSelector: { flexDirection: 'row', alignSelf: 'center', gap: Gap.gap_10, paddingBottom: Padding.padding_10 },
      scrollContent: { paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_15, paddingBottom: 40 },
      scoreBanner: { borderRadius: Border.br_30, padding: 24, alignItems: 'center', marginBottom: Gap.gap_20 },
      scoreWrapper: { justifyContent: 'center', alignItems: 'center', marginBottom: Gap.gap_20, position: 'relative', width: 136, height: 136 },
      svgRing: { position: 'absolute' },
      mainScoreCircle: {
        width: 120, height: 120, borderRadius: 60, backgroundColor: colors.color, justifyContent: 'center', alignItems: 'center',
        shadowColor: colors.color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5
      },
      mainScoreText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 40, color: colors.vang, lineHeight: 45 },
      maxScoreText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.bg },
      statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
      feedbackList: { gap: Gap.gap_15 },
      footer: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_15,
        paddingBottom: Padding.padding_30, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.stroke, gap: Gap.gap_15
      },
      retryButton: {
        paddingHorizontal: Padding.padding_15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        height: 47, borderRadius: 37, borderWidth: 1.5, borderColor: colors.stroke, backgroundColor: colors.bg, gap: Gap.gap_8
      },
      continueButton: { flex: 1, marginVertical: 0 },
    });