import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { BookOpenIcon, CaretDownIcon, XIcon } from 'phosphor-react-native';

// Import Design System & Components
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import TimerHeader from '../TimerHeader';
import WonGoJiGrid from '../WonGoJiGrid';
import CloseButton from '../CloseButton';
import { ConfirmModal } from '../ModalResult/ConfirmModal';

const WRITING_RULES = [
  "Đầu đoạn hoặc chuyển đoạn thì bỏ ô đầu tiên, mỗi ô chỉ viết một chữ cái tiếng Hàn",
  "Hai chữ số có thể viết trong một ô, nếu là số lẻ thì một chữ số trong một ô",
  "Các dấu câu như: . , ! ? phải được viết riêng trong một ô.",
  "Sau khi viết dấu chấm hoặc dấu phẩy phải chừa một ô trống trước khi viết tiếp.",
  "Nếu viết sai có thể gạch nhẹ và viết lại, nhưng nên hạn chế lỗi vì bài thi TOPIK viết sẽ bị trừ điểm nếu trình bày xấu.",
  "Số La mã thì mỗi số 1 ô."
];

const WritingUI = ({ data, text, timeLeft, onChangeText, onSubmit, onExit }: any) => {
  const maxChars = data?.wordLimit?.max || 700;
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TimerHeader 
        timeLeft={timeLeft} 
        isStarted={true} 
        onClose={() => setShowExitModal(true)} 
        onSubmit={() => setShowSubmitModal(true)} 
      />

      <View style={styles.editorContainer}>
        <TouchableOpacity 
          style={styles.topicBanner} 
          activeOpacity={0.7}
          onPress={() => { Keyboard.dismiss(); setShowInstructionModal(true); }}
        >
          <Text style={styles.topicTitle} numberOfLines={2}>
            {data?.prompt || 'Đề bài chưa được cập nhật'}
          </Text>
          <View style={styles.openModalBtn}>
            <Text style={styles.openModalText}>Chi tiết</Text>
            <CaretDownIcon size={16} color={Color.text} />
          </View>
        </TouchableOpacity>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <WonGoJiGrid text={text} setText={onChangeText} maxChars={maxChars} />
        </ScrollView>

        <View style={styles.bottomBar}>
          <View style={styles.charCountPill}>
            <Text style={styles.charCountText}>{text.length}/{maxChars} 글자</Text>
          </View>
          <TouchableOpacity 
            style={styles.rulesButton} 
            activeOpacity={0.7}
            onPress={() => { Keyboard.dismiss(); setShowRulesModal(true); }}
          >
            <BookOpenIcon size={18} color={Color.color} weight="fill" />
            <Text style={styles.rulesText}>Quy tắc viết bài</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showInstructionModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Chi tiết đề bài</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowInstructionModal(false)}>
                <XIcon size={20} color={Color.text} weight="bold" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.topicFullText}>{data?.prompt}</Text>
              {data?.instruction && <Text style={styles.instructionText}>{data.instruction}</Text>}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showRulesModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '80%' }]}> 
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeaderTitle}>Quy tắc viết bài</Text>
              <CloseButton variant="Stroke" onPress={() => setShowRulesModal(false)} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {WRITING_RULES.map((rule, index) => (
                <View key={index} style={styles.ruleItem}>
                  <View style={styles.ruleBadge}><Text style={styles.ruleBadgeText}>{index + 1}</Text></View>
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ConfirmModal
        isVisible={showExitModal}
        title="Dừng bài viết tại đây?"
        subtitle="Tiến trình đã được tự động lưu tạm."
        confirmText="Thoát"
        cancelText="Ở lại"
        isDestructive={true}
        onConfirm={onExit}
        onCancel={() => setShowExitModal(false)}
      />

      <ConfirmModal
        isVisible={showSubmitModal}
        title="Nộp bài ngay?"
        subtitle="Bạn có chắc chắn muốn nộp bài để AI chấm điểm luôn không?"
        confirmText="Nộp bài"
        cancelText="Kiểm tra lại"
        isDestructive={false}
        onConfirm={() => { setShowSubmitModal(false); onSubmit(); }}
        onCancel={() => setShowSubmitModal(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  editorContainer: { flex: 1 },
  topicBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Color.bg, padding: Padding.padding_15, marginHorizontal: Padding.padding_15, borderRadius: Border.br_15, marginBottom: Gap.gap_15, borderWidth: 2, borderColor: '#C8E6C9' },
  topicTitle: { flex: 1, fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.color, lineHeight: 20, marginRight: Gap.gap_10 },
  openModalBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Color.vang, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  openModalText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.text },
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Padding.padding_15, paddingVertical: Padding.padding_10, backgroundColor: Color.bg, borderTopWidth: 1, borderTopColor: Color.stroke },
  charCountPill: { backgroundColor: Color.main, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Border.br_20 },
  charCountText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_12, color: Color.color },
  rulesButton: { flexDirection: 'row', alignItems: 'center', gap: Gap.gap_8, paddingHorizontal: Padding.padding_10 },
  rulesText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.color },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Color.bg, borderTopLeftRadius: Border.br_30, borderTopRightRadius: Border.br_30, padding: Padding.padding_20, paddingBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
  modalHeaderTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text },
  modalCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Color.stroke, justifyContent: 'center', alignItems: 'center' },
  topicFullText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_16, color: Color.text, lineHeight: 24, marginBottom: Gap.gap_10 },
  instructionText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.gray, fontStyle: 'italic' },
  ruleItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Gap.gap_20 },
  ruleBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: Color.greenLight, justifyContent: 'center', alignItems: 'center', marginRight: Gap.gap_15, marginTop: 2 },
  ruleBadgeText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.color },
  ruleText: { flex: 1, fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: '#64748B', lineHeight: 22 },
});

export default WritingUI;