import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Import Design System & Components
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';
import ZenmodeCheckModal from '../../../../components/Modals/ZenmodeCheckModal';
import PracticeService from '../../../../api/services/practice.service';
import { PracticeType } from '../../../../api/types/practice.types';

import ExamIntroView from '../../../../components/PracticeComponent/ExamIntroView';
import WritingIntroView from '../../../../components/PracticeComponent/WritingIntroView';
import { useTheme } from "@/contexts/ThemeContext";

// --- MAIN SCREEN ---
export default function PracticeIntroScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const router = useRouter();
  const { type, setId } = useLocalSearchParams();
  
  // Đảm bảo type và setId luôn là string (useLocalSearchParams có thể trả về string[])
  const resolvedType = Array.isArray(type) ? type[0] : type;
  const resolvedSetId = Array.isArray(setId) ? setId[0] : setId;
  const practiceType = (resolvedType as PracticeType) || 'full';

  const [introData, setIntroData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isZenmodeEnabled, setIsZenmodeEnabled] = useState(false);
  const [showZenmodeCheck, setShowZenmodeCheck] = useState(false);

  // Lấy dữ liệu giới thiệu đề bài
  useEffect(() => {
    const fetchIntro = async () => {
      try {
        setIsLoading(true);
        const res = await PracticeService.getSetById(practiceType, resolvedSetId as string);
        if (res.success) {
          setIntroData(res.data);
        } else {
          Alert.alert('Lỗi', res.message || 'Không thể tải thông tin đề bài.');
        }
      } catch (err: any) {
        Alert.alert('Lỗi', err.message || 'Không kết nối được với máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };

    if (practiceType && resolvedSetId) fetchIntro();
  }, [practiceType, resolvedSetId]);

  const handleStart = () => {
    if (isStarting) return;
    if (isZenmodeEnabled) {
      setShowZenmodeCheck(true); // Mở trạm kiểm tra Zenmode trước
    } else {
      proceedToExam(); // Trạng thái bình thường -> vào thẳng
    }
  };

  const proceedToExam = async () => {
    try {
      setIsStarting(true);
      const res = await PracticeService.startAttempt(practiceType, resolvedSetId as string);
      if (res.success && res.data?.attemptId) {
        const attemptId = res.data.attemptId;
        
        // Sử dụng cấu trúc Object cho Router Push để Expo truyền Path an toàn hơn
        const params: any = {};
        if (isZenmodeEnabled) params.zenmode = 'true';

        if (practiceType === 'listening' || practiceType === 'full') {
          // audio-check.tsx nằm ở [setId], nên ta đẩy attemptId vào params để lấy qua useLocalSearchParams
          params.attemptId = attemptId; 
          router.push({
            pathname: `/practice/${practiceType}/${resolvedSetId}/audio-check`,
            params
          } as any);
        } else {
          router.push({
            pathname: `/practice/${practiceType}/${resolvedSetId}/${attemptId}/exam`,
            params
          } as any);
        }
      } else {
        Alert.alert('Lỗi', res.message || 'Không thể bắt đầu bài làm.');
      }
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Có lỗi xảy ra khi bắt đầu làm bài.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.main} />
        </View>
      ) : practiceType === 'writing' ? (
        <WritingIntroView 
          data={introData} 
          onStart={handleStart} 
          onExit={() => setShowExitModal(true)} 
          isStarting={isStarting} 
          isZenmodeEnabled={isZenmodeEnabled}
          onToggleZenmode={setIsZenmodeEnabled}
        />
      ) : (
        <ExamIntroView 
          data={introData} 
          onStart={handleStart} 
          onExit={() => setShowExitModal(true)} 
          isStarting={isStarting} 
          isZenmodeEnabled={isZenmodeEnabled}
          onToggleZenmode={setIsZenmodeEnabled}
          onPreparationPress={() => router.push({ pathname: `/practice/${practiceType}/${resolvedSetId}/preparation`, params: { title: introData?.title } } as any)}
        />
      )}

      <ConfirmModal
        isVisible={showExitModal}
        title="Dừng bài thi tại đây?"
        subtitle="Nếu thoát bây giờ, tiến trình sẽ không được lưu lại."
        confirmText="Thoát"
        cancelText="Ở lại"
        isDestructive={true}
        onConfirm={handleConfirmExit}
        onCancel={() => setShowExitModal(false)}
      />

      <ZenmodeCheckModal
        isVisible={showZenmodeCheck}
        onClose={() => setShowZenmodeCheck(false)}
        onConfirm={() => { setShowZenmodeCheck(false); proceedToExam(); }} // Đo xong thì mới cho chạy tiếp
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: colors.bg,
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    });