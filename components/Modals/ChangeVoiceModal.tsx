import React from 'react';
import { StyleSheet, View, Modal, Pressable, Text, TouchableOpacity } from 'react-native';
import { CheckCircleIcon, CircleIcon } from 'phosphor-react-native';
import CloseButton from '../CloseButton';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';

export type VoiceType = 'male' | 'female';

export type ChangeVoiceModalProps = {
  visible: boolean;
  voice: VoiceType;
  onSelectVoice: (voice: VoiceType) => void;
  onClose: () => void;
};

const VOICES: { id: VoiceType; label: string }[] = [
  { id: 'male', label: 'Giọng Nam' },
  { id: 'female', label: 'Giọng Nữ' },
];

const ChangeVoiceModal = ({ visible, voice, onSelectVoice, onClose }: ChangeVoiceModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backgroundTouchable} onPress={onClose} />
        <View style={styles.sheetContent}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chọn Giọng Đọc</Text>
            <CloseButton variant="Stroke" onPress={onClose} />
          </View>

          <View style={styles.body}>
            {VOICES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.optionRow}
                onPress={() => onSelectVoice(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>{item.label}</Text>
                {voice === item.id ? (
                  <CheckCircleIcon size={24} color={Color.main2} weight="fill" />
                ) : (
                  <CircleIcon size={24} color={Color.gray} weight="regular" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  backgroundTouchable: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  sheetContent: {
    backgroundColor: Color.bg,
    borderTopLeftRadius: Border.br_30,
    borderTopRightRadius: Border.br_30,
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_15,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: Gap.gap_15,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text },
  body: { paddingBottom: 16 },
  optionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Color.stroke,
  },
  optionText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.text },
});

export default ChangeVoiceModal;