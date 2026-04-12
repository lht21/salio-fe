import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Modal
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpenIcon, CaretDownIcon, XIcon } from 'phosphor-react-native';

// Import Components & Constants
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import TimerHeader from '../../../../components/TimerHeader';
import InstructionCard from '../../../../components/InstructionCard';
import WonGoJiGrid from '../../../../components/WonGoJiGrid';
import CloseButton from '@/components/CloseButton';
// Kéo ConfirmModal vào
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal'; 

const MAX_CHARS = 700;

// --- DỮ LIỆU QUY TẮC VIẾT BÀI ---
const WRITING_RULES = [
  "Đầu đoạn hoặc chuyển đoạn thì bỏ ô đầu tiên, mỗi ô chỉ viết một chữ cái tiếng Hàn",
  "Hai chữ số có thể viết trong một ô, nếu là số lẻ thì một chữ số trong một ô",
  "Các dấu câu như: . , ! ? phải được viết riêng trong một ô.",
  "Sau khi viết dấu chấm hoặc dấu phẩy phải chừa một ô trống trước khi viết tiếp.",
  "Nếu viết sai có thể gạch nhẹ và viết lại, nhưng nên hạn chế lỗi vì bài thi TOPIK viết sẽ bị trừ điểm nếu trình bày xấu.",
  "Số La mã thì mỗi số 1 ô."
];

export default function WritingPracticeScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams();
  
  const [isStarted, setIsStarted] = useState(false);
  const [text, setText] = useState('');
  const [timeLeft, setTimeLeft] = useState(45 * 60); 
  
  // States quản lý Modal (BottomSheet)
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false); 

  // States quản lý Confirm Modal (Hộp thoại xác nhận)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  // --- HANDLERS CHO NÚT BẤM HEADER ---
  const requestClose = () => {
    Keyboard.dismiss();
    // Nếu chưa làm bài, có thể thoát thẳng không cần hỏi
    if (!isStarted || text.length === 0) {
      router.replace('/(tabs)');
    } else {
      // Đã làm bài thì hiện popup cảnh báo mất dữ liệu
      setShowExitConfirm(true); 
    }
  };

  const requestSubmit = () => {
    Keyboard.dismiss();
    setShowSubmitConfirm(true); // Mở hộp thoại xác nhận nộp bài
  };

  // --- HANDLERS CHO HÀNH ĐỘNG THỰC SỰ (XÁC NHẬN) ---
  const confirmExit = () => {
    setShowExitConfirm(false);
    router.replace('/(tabs)');
  };

  const confirmSubmit = async () => {
    setShowSubmitConfirm(false);

    const timeUsed = (45 * 60) - timeLeft; 
        
    // Điều hướng NGAY LẬP TỨC sang trang Kết quả và truyền bài viết sang đó
    router.replace({
      pathname: `/lessons/${lessonId}/writing/result`,
      params: { 
        userText: text,
        charCount: text.length,
        timeUsed: timeUsed
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TimerHeader 
          timeLeft={timeLeft} 
          isStarted={isStarted} 
          onClose={requestClose} // Đã đổi thành hàm request
          onSubmit={requestSubmit} // Đã đổi thành hàm request
        />

        {/* --- TRẠNG THÁI 1: CHƯA BẮT ĐẦU --- */}
        {!isStarted ? (
          <View style={styles.introWrapper}>
            <InstructionCard onStart={() => setIsStarted(true)} />
          </View>
        ) : (
          
          /* --- TRẠNG THÁI 2: TRONG KHI VIẾT --- */
          <View style={styles.editorContainer}>
            
            {/* 1. Dải Banner Đề Bài */}
            <TouchableOpacity 
              style={styles.topicBanner} 
              activeOpacity={0.7}
              onPress={() => {
                Keyboard.dismiss(); 
                setShowInstructionModal(true);
              }}
            >
              <Text style={styles.topicTitle} numberOfLines={2}>
                Đề bài: Hãy viết một bài luận (500-700 chữ) bày tỏ quan điểm của bạn về việc giới trẻ chạy theo xu hướng hiện nay.
              </Text>
              <View style={styles.openModalBtn}>
                <Text style={styles.openModalText}>Chi tiết</Text>
                <CaretDownIcon size={16} color={Color.text} />
              </View>
            </TouchableOpacity>

            {/* 2. Lưới viết bài */}
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
              keyboardShouldPersistTaps="handled"
            >
              <WonGoJiGrid text={text} setText={setText} maxChars={MAX_CHARS} />
            </ScrollView>

            {/* 3. Bottom Bar */}
            <View style={styles.bottomBar}>
              <View style={styles.charCountPill}>
                <Text style={styles.charCountText}>
                  {text.length}/{MAX_CHARS} 글자
                </Text>
              </View>

              {/* Nút Quy tắc viết bài - Bật Modal */}
              <TouchableOpacity 
                style={styles.rulesButton} 
                activeOpacity={0.7}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowRulesModal(true);
                }}
              >
                <BookOpenIcon size={18} color={Color.color} weight="fill" />
                <Text style={styles.rulesText}>Quy tắc viết bài</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
      </KeyboardAvoidingView>

      {/* ==================================================== */}
      {/* CÁC BOTTOM SHEET MODAL (HƯỚNG DẪN / QUY TẮC) */}
      {/* ==================================================== */}
      <Modal
        visible={showInstructionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowInstructionModal(false)} 
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Hướng dẫn làm bài</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowInstructionModal(false)}>
                <XIcon size={20} color={Color.text} weight="bold" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <InstructionCard isModal={true} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showRulesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRulesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '80%' }]}> 
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Quy tắc viết bài</Text>
              <CloseButton variant="Stroke" onPress={() => setShowRulesModal(false)} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
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

      {/* ==================================================== */}
      {/* CÁC CONFIRM MODAL (HỘP THOẠI XÁC NHẬN) */}
      {/* ==================================================== */}
      
      {/* Modal Cảnh báo Thoát bài */}
      <ConfirmModal
        isVisible={showExitConfirm}
        title="Dừng bài viết tại đây?"
        subtitle="Bài làm của bạn sẽ không được lưu lại đâu nhé!"
        confirmText="Thoát bài"
        cancelText="Ở lại làm tiếp"
        isDestructive={true} // Nút Xác nhận sẽ màu Đỏ
        onConfirm={confirmExit}
        onCancel={() => setShowExitConfirm(false)}
      />

      {/* Modal Cảnh báo Nộp bài */}
      <ConfirmModal
        isVisible={showSubmitConfirm}
        title="Nộp bài ngay?"
        subtitle="Bạn vẫn chưa dùng hết thời gian. Bạn có chắc chắn muốn nộp bài luôn không?"
        confirmText="Nộp bài"
        cancelText="Kiểm tra lại"
        isDestructive={false} // Nút Xác nhận sẽ màu Xanh lá
        onConfirm={confirmSubmit}
        onCancel={() => setShowSubmitConfirm(false)}
      />

    </SafeAreaView>
  );
}
// ... CÁC STYLES CŨ GIỮ NGUYÊN BÊN DƯỚI ...
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  keyboardAvoid: { flex: 1 },
  introWrapper: { flex: 1, padding: Padding.padding_15 },
  editorContainer: { flex: 1 },

  topicBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Color.bg, padding: Padding.padding_15, marginHorizontal: Padding.padding_15,
    borderRadius: Border.br_15, marginBottom: Gap.gap_15, borderWidth: 2, borderColor: '#C8E6C9',
  },
  topicTitle: { flex: 1, fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.color, lineHeight: 20, marginRight: Gap.gap_10 },
  openModalBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Color.vang, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  openModalText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.text },

  bottomBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Padding.padding_15, paddingVertical: Padding.padding_10,
    backgroundColor: Color.bg, borderTopWidth: 1, borderTopColor: Color.stroke,
  },
  charCountPill: { backgroundColor: Color.main, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Border.br_20 },
  charCountText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_12, color: Color.color },
  rulesButton: { flexDirection: 'row', alignItems: 'center', gap: Gap.gap_8, paddingHorizontal: Padding.padding_10 },
  rulesText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.color },

  // --- MODAL STYLES CHUNG ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end', 
  },
  modalContent: {
    backgroundColor: Color.bg,
    borderTopLeftRadius: Border.br_30,
    borderTopRightRadius: Border.br_30,
    height: '75%', 
    padding: Padding.padding_15,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.gap_20,
  },
  modalHeaderTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold, // Font đậm cho tiêu đề Modal
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Color.stroke,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- STYLES RIÊNG CHO MODAL QUY TẮC ---
  divider: {
    height: 1,
    backgroundColor: Color.stroke,
    marginBottom: Gap.gap_20,
    opacity: 0.6,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Căn trên cùng để text dài rơi xuống dưới
    marginBottom: Gap.gap_20,
  },
  ruleBadge: {
    width: 36,
    height: 36,
    borderRadius: 18, // Tròn xoe
    backgroundColor: Color.greenLight, // Xám sáng giống ảnh
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Gap.gap_15,
    marginTop: 2, // Đẩy xuống một xíu để căn giữa với dòng text đầu tiên
  },
  ruleBadgeText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.color, // Đen đậm
  },
  ruleText: {
    flex: 1, // Để text chiếm hết phần còn lại và tự xuống dòng
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: '#64748B', // Xám xanh hơi trầm giống ảnh
    lineHeight: 22,
  },
});