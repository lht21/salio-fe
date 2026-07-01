import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Modal,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BookOpenIcon,
  CaretDownIcon,
  XIcon,
  ArrowRightIcon
} from 'phosphor-react-native';

import { FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import TimerHeader from '../../../../components/TimerHeader';
import InstructionCard from '../../../../components/InstructionCard';
import IconButton from '../../../../components/IconButton';

import WonGoJiGrid from '../../../../components/WonGoJiGrid';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';
import LessonService from '../../../../api/services/lesson.service';
import { WritingItem } from '../../../../api/types/lesson.types';
import { useTheme } from "@/contexts/ThemeContext";

// DANH SÁCH QUY TẮC VIẾT
const WRITING_RULES = [
  "Đầu đoạn hoặc chuyển đoạn thì bỏ ô đầu tiên, mỗi ô chỉ viết một chữ cái tiếng Hàn",
  "Hai chữ số có thể viết trong một ô, nếu là số lẻ thì một chữ số trong một ô",
  "Các dấu câu như: . , ! ? phải được viết riêng trong một ô.",
  "Sau khi viết dấu chấm hoặc dấu phẩy phải chừa một ô trống trước khi viết tiếp.",
  "Nếu viết sai có thể gạch nhẹ và viết lại, nhưng nên hạn chế lỗi vì sẽ bị trừ điểm trình bày.",
  "Số La mã thì mỗi số 1 ô."
];

export default function WritingPracticeScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const router = useRouter();
  const { lessonId, attemptId } = useLocalSearchParams();

  const [writingItems, setWritingItems] = useState<WritingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allAnswers, setAllAnswers] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [text, setText] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    const fetchAllWriting = async () => {
      try {
        const modules = await LessonService.getModules(lessonId as string);
        const items = modules.data.writing || [];
        setWritingItems(items);
        const totalTime = items.reduce((acc, item) => acc + (item.timeLimit || 600), 0);
        setTimeLeft(totalTime);
      } catch (error) {
        console.error("Lỗi load danh sách bài tập:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllWriting();
  }, [lessonId]);

  const saveCurrentText = () => {
    const currentItemId = writingItems[currentIndex]?._id;
    if (currentItemId) {
      setAllAnswers(prev => ({ ...prev, [currentItemId]: text }));
    }
  };

  useEffect(() => {
    const itemId = writingItems[currentIndex]?._id;
    if (itemId) {
      setText(allAnswers[itemId] || '');
    }
  }, [currentIndex, writingItems]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  const handleNext = () => {
    saveCurrentText();
    if (currentIndex < writingItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
      Keyboard.dismiss();
    }
  };

  const handlePrev = () => {
    saveCurrentText();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      Keyboard.dismiss();
    }
  };

  const confirmSubmit = async () => {
    setShowSubmitConfirm(false);
    const finalAnswers = { ...allAnswers, [writingItems[currentIndex]._id]: text };

    router.replace({
      pathname: `/lessons/${lessonId}/writing/result` as any,
      params: {
        lessonId,
        payload: JSON.stringify(finalAnswers),
        timeUsed: (writingItems.reduce((acc, i) => acc + (i.timeLimit || 600), 0)) - timeLeft
      }
    });
  };

  if (loading) return <View style={[styles.safeArea, { justifyContent: 'center' }]}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (writingItems.length === 0) return <View style={styles.safeArea}><Text>Không có bài tập nào.</Text></View>;

  const currentItem = writingItems[currentIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TimerHeader
          timeLeft={timeLeft}
          isStarted={isStarted}
          onClose={() => setShowExitConfirm(true)}
          onSubmit={() => {
            saveCurrentText();
            setShowSubmitConfirm(true);
          }}
        />

        {!isStarted ? (
          <View style={styles.introWrapper}>
            <InstructionCard data={currentItem} onStart={() => setIsStarted(true)} />
          </View>
        ) : (
          <View style={styles.editorContainer}>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>Câu hỏi {currentIndex + 1} / {writingItems.length}</Text>
            </View>

            <TouchableOpacity style={styles.topicBanner} onPress={() => {
              Keyboard.dismiss();
              setShowInstructionModal(true);
            }}>
              <Text style={styles.topicTitle} numberOfLines={2}>Đề bài: {currentItem?.prompt}</Text>
              <CaretDownIcon size={16} color={colors.textPrimary} />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <WonGoJiGrid text={text} setText={setText} maxChars={currentItem?.wordLimit?.max || 700} />

              <View style={styles.navigationButtons}>
                {currentIndex > 0 ? (
                  <TouchableOpacity style={styles.navBtn} onPress={handlePrev}>
                    <Text style={styles.navBtnText}>Câu trước</Text>
                  </TouchableOpacity>
                ) : <View />}

                {currentIndex < writingItems.length - 1 && (
                  <TouchableOpacity style={[styles.navBtn, styles.nextBtn]} onPress={handleNext}>
                    <Text style={styles.nextBtnText}>Câu tiếp theo</Text>
                    <ArrowRightIcon size={18} color={colors.background} />
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            <View style={styles.bottomBar}>
              <View style={styles.charCountPill}>
                <Text style={styles.charCountText}>{text.length}/{currentItem?.wordLimit?.max || 700} 글자</Text>
              </View>
              <TouchableOpacity style={styles.rulesButton} onPress={() => {
                Keyboard.dismiss();
                setShowRulesModal(true);
              }}>
                <BookOpenIcon size={18} color={colors.textBrand} weight="fill" />
                <Text style={styles.rulesText}>Quy tắc viết</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* MODAL ĐỀ BÀI CHI TIẾT */}
      <Modal visible={showInstructionModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Đề bài chi tiết</Text>
              <TouchableOpacity onPress={() => setShowInstructionModal(false)}><XIcon size={20} color={colors.textPrimary} /></TouchableOpacity>
            </View>
            <InstructionCard data={currentItem} isModal={true} />
          </View>
        </View>
      </Modal>

      {/* MODAL QUY TẮC VIẾT BÀI - ĐÃ THÊM LẠI Ở ĐÂY */}
      <Modal visible={showRulesModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Quy tắc viết bài</Text>
              <IconButton Icon={XIcon} onPress={() => setShowRulesModal(false)} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {WRITING_RULES.map((rule, index) => (
                <View key={index} style={styles.ruleItem}>
                  <View style={styles.ruleBadge}>
                    <Text style={styles.ruleBadgeText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ConfirmModal isVisible={showExitConfirm} title="Thoát luyện tập?" confirmText="Thoát" onConfirm={() => router.back()} onCancel={() => setShowExitConfirm(false)} />
      <ConfirmModal isVisible={showSubmitConfirm} title="Nộp toàn bộ bài làm?" onConfirm={confirmSubmit} onCancel={() => setShowSubmitConfirm(false)} />
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  keyboardAvoid: { flex: 1 },
  introWrapper: { flex: 1, padding: Padding.padding_15 },
  editorContainer: { flex: 1 },
  stepIndicator: { paddingHorizontal: 20, paddingTop: 10 },
  stepText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 14, color: colors.primary },
  topicBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, padding: 15, margin: 15, borderRadius: 15, borderWidth: 1, borderColor: colors.borderDefault },
  topicTitle: { flex: 1, fontFamily: FontFamily.lexendDecaMedium, fontSize: 14, color: colors.textBrand },
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.borderDefault },
  charCountPill: { backgroundColor: colors.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  charCountText: { color: colors.textBrand, fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 12 },
  rulesButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rulesText: { color: colors.textBrand, fontSize: 12, fontFamily: FontFamily.lexendDecaMedium },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.background, borderTopLeftRadius: 30, borderTopRightRadius: 30, height: '70%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalHeaderTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 16 },
  navigationButtons: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  navBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, backgroundColor: colors.borderDefault, justifyContent: 'center' },
  nextBtn: { backgroundColor: colors.textBrand, flexDirection: 'row', alignItems: 'center', gap: 8 },
  navBtnText: { fontFamily: FontFamily.lexendDecaMedium, color: colors.textPrimary },
  nextBtnText: { fontFamily: FontFamily.lexendDecaMedium, color: colors.background },
  // Styles cho Rule Item
  ruleItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  ruleBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  ruleBadgeText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 16, color: colors.textBrand },
  ruleText: { flex: 1, fontFamily: FontFamily.lexendDecaMedium, fontSize: 14, color: '#64748B', lineHeight: 22 },
});