import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { 
  ArrowsClockwiseIcon, 
  ExportIcon,
  TrashIcon
} from 'phosphor-react-native';

import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import CloseButton from '../CloseButton';
import ActionMenuItem from '../ActionMenuItem';

interface HistoryActionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onRetry: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export default function HistoryActionModal({ 
  isVisible, onClose, onRetry, onShare, onDelete 
}: HistoryActionModalProps) {
  
  return (
    <Modal
      visible={isVisible}
      animationType="slide" 
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backgroundTouchable} onPress={onClose} />
        
        <View style={styles.sheetContent}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Tùy chọn bài viết</Text>
            <CloseButton variant="Stroke" onPress={onClose} />
          </View>

          <View style={styles.menuContainer}>
            <ActionMenuItem 
              label="Luyện tập lại đề này" 
              icon={<ArrowsClockwiseIcon size={24} color={Color.text} weight="regular" />} 
              onPress={onRetry} 
            />
            <ActionMenuItem 
              label="Chia sẻ kết quả" 
              icon={<ExportIcon size={24} color={Color.text} weight="regular" />} 
              onPress={onShare} 
            />
            <ActionMenuItem 
              label="Xóa khỏi lịch sử" 
              variant="danger"
              icon={<TrashIcon size={24} color={Color.red || '#EF4444'} weight="regular" />} 
              onPress={onDelete} 
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  backgroundTouchable: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  sheetContent: {
    backgroundColor: Color.bg, borderTopLeftRadius: Border.br_30, borderTopRightRadius: Border.br_30,
    paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_15, paddingBottom: 40, 
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10,
  },
  dragHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: Gap.gap_15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text },
  menuContainer: { gap: Gap.gap_10 },
});