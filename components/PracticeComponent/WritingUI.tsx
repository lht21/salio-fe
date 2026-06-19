import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { BookOpenIcon, CaretDownIcon, XIcon } from 'phosphor-react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';

// Import Design System & Components
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import TimerHeader from '../TimerHeader';
import WonGoJiGrid from '../WonGoJiGrid';
import IconButton from '../IconButton';
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
  const instructionSheetRef = useRef<BottomSheetModal>(null);
  const rulesSheetRef = useRef<BottomSheetModal>(null);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const snapPoints = useMemo(() => ['50%', '80%'], []);
  const renderBackdrop = useCallback(
    (backdropProps: any) => (
      <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ),
    []
  );

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
          onPress={() => { Keyboard.dismiss(); instructionSheetRef.current?.present(); }}
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
            onPress={() => { Keyboard.dismiss(); rulesSheetRef.current?.present(); }}
          >
            <BookOpenIcon size={18} color={Color.color} weight="fill" />
            <Text style={styles.rulesText}>Quy tắc viết bài</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheetModal
        ref={instructionSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: Color.bg }}
        handleIndicatorStyle={{ backgroundColor: Color.stroke }}
      >
        <BottomSheetView style={styles.modalContentSheet}>
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalHeaderTitle}>Chi tiết đề bài</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => instructionSheetRef.current?.dismiss()}>
              <XIcon size={20} color={Color.text} weight="bold" />
            </TouchableOpacity>
          </View>
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.topicFullText}>{data?.prompt}</Text>
            {data?.instruction && <Text style={styles.instructionText}>{data.instruction}</Text>}
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>

      <BottomSheetModal
        ref={rulesSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: Color.bg }}
        handleIndicatorStyle={{ backgroundColor: Color.stroke }}
      >
        <BottomSheetView style={[styles.modalContentSheet, { flex: 1 }]}> 
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalHeaderTitle}>Quy tắc viết bài</Text>
            <IconButton Icon={XIcon} onPress={() => rulesSheetRef.current?.dismiss()} />
              
          </View>
          <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {WRITING_RULES.map((rule, index) => (
                <View key={index} style={styles.ruleItem}>
                  <View style={styles.ruleBadge}><Text style={styles.ruleBadgeText}>{index + 1}</Text></View>
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>

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
  modalContentSheet: { padding: Padding.padding_20, paddingBottom: 40 },
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