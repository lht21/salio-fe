import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ClockIcon } from 'phosphor-react-native';

// Import Design System & Components
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import CloseButton from '../../../../components/CloseButton';
import Button from '../../../../components/Button';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';

// --- DỮ LIỆU MẪU ---
const EXAM_SKILLS = [
  { name: 'Nghe', count: 50 },
  { name: 'Viết', count: 4 },
  { name: 'Đọc', count: 50 },
];

export default function MockExamIntroScreen() {
  const router = useRouter();
  const { examId } = useLocalSearchParams();

  // State quản lý modal xác nhận thoát
  const [showExitModal, setShowExitModal] = useState(false);

  // Lấy tiêu đề đề thi (giả lập, bạn có thể thay bằng logic fetch từ API)
  const examTitle = `제${examId}회 한국어능력시험`;

  const handleStart = () => {
    // Điều hướng đến màn hình làm bài thi thực tế
    router.push(`/practice/mock-exam/${examId}/exam` as any);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. HEADER: Chỉ có nút X ở góc phải */}
      <View style={styles.header}>
        <CloseButton variant="Stroke" onPress={() => setShowExitModal(true)} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Phần 1: Mascot */}
        <Image
          source={require('../../../../assets/images/horani/horani_ei.png')}
          style={styles.mascotImage}
          resizeMode="contain"
        />

        {/* Phần 2: Title */}
        <Text style={styles.examTitle}>{examTitle}</Text>

        {/* Phần 3: Exam Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Phần thi:</Text>
          <View style={styles.skillsList}>
            {EXAM_SKILLS.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.skillText}>
                  {skill.name} ({skill.count} câu)
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Phần 4: Stats */}
        <View style={styles.statsRow}>
          <ClockIcon size={20} color={Color.cam} weight="fill" />
          <Text style={styles.statsText}>Thời gian: 180 phút</Text>
        </View>
      </ScrollView>

      {/* Phần 5: Footer */}
      <View style={styles.footer}>
        <Text style={styles.readyText}>Bạn đã sẵn sàng chưa?</Text>
        <Button
          title="Sẵn sàng"
          variant="Green"
          onPress={handleStart}
          style={{ width: '100%' }}
        />
      </View>

      {/* Modal xác nhận thoát */}
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
    </SafeAreaView>
  );
}

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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Padding.padding_20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  mascotImage: {
    width: 200,
    height: 200,
    marginBottom: Gap.gap_20,
  },
  examTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_24,
    color: Color.text,
    textAlign: 'center',
    marginBottom: Gap.gap_20,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#F8FAFC', // Màu xám rất nhạt
    borderRadius: Border.br_15,
    padding: Padding.padding_20,
    marginBottom: Gap.gap_20,
    borderWidth: 1,
    borderColor: Color.stroke,
  },
  infoCardTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
    marginBottom: Gap.gap_15,
  },
  skillsList: {
    gap: Gap.gap_10,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Color.gray,
    marginRight: Gap.gap_10,
  },
  skillText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.gray,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_8,
    alignSelf: 'flex-start', // Căn trái
    paddingLeft: Padding.padding_5,
  },
  statsText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  footer: {
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
    paddingBottom: Padding.padding_30,
    alignItems: 'center',
    gap: Gap.gap_10,
  },
  readyText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.gray,
  },
});