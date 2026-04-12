import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { 
  ArrowsClockwiseIcon, 
  WarningCircleIcon, 
  ExportIcon,
  ArticleIcon, 
  DownloadSimpleIcon, 
  ClockCounterClockwiseIcon 
} from 'phosphor-react-native';

import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../constants/GlobalStyles';
import CloseButton from './CloseButton';

// IMPORT COMPONENT MỚI
import ActionMenuItem from './ActionMenuItem';

interface ActionMenuModalProps {
  isVisible: boolean;
  onClose: () => void;
  onViewSample: () => void;
  onViewHistory: () => void;
  onDownloadPDF: () => void;
  onRetry: () => void;
  onReport: () => void;
  onShare: () => void;
}

export default function ActionMenuModal({ 
  isVisible, onClose, onViewSample, onViewHistory, onDownloadPDF, onRetry, onReport, onShare 
}: ActionMenuModalProps) {
  
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
            <Text style={styles.headerTitle}>Tùy chọn</Text>
            <CloseButton variant="Stroke" onPress={onClose} />
          </View>

          <View style={styles.menuContainer}>
            
            {/* NHÓM 1: HỌC TẬP */}
            <ActionMenuItem 
              label="Xem bài mẫu" 
              icon={<ArticleIcon size={24} color={Color.text} weight="regular" />} 
              onPress={onViewSample} 
            />
            <ActionMenuItem 
              label="Lịch sử luyện tập đề này" 
              icon={<ClockCounterClockwiseIcon size={24} color={Color.text} weight="regular" />} 
              onPress={onViewHistory} 
            />
            <ActionMenuItem 
              label="Luyện tập lại" 
              icon={<ArrowsClockwiseIcon size={24} color={Color.text} weight="regular" />} 
              onPress={onRetry} 
            />

            <View style={styles.divider} />

            {/* NHÓM 2: TIỆN ÍCH */}
            <ActionMenuItem 
              label="Tải xuống PDF" 
              icon={<DownloadSimpleIcon size={24} color={Color.text} weight="regular" />} 
              onPress={onDownloadPDF} 
            />
            <ActionMenuItem 
              label="Chia sẻ" 
              icon={<ExportIcon size={24} color={Color.text} weight="regular" />} 
              onPress={onShare} 
            />
            <ActionMenuItem 
              label="Báo cáo lỗi sai" 
              icon={<WarningCircleIcon size={24} color={Color.text} weight="regular" />} 
              onPress={onReport} 
            />

          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end', 
  },
  backgroundTouchable: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
  },
  sheetContent: {
    backgroundColor: Color.bg, borderTopLeftRadius: Border.br_30, borderTopRightRadius: Border.br_30,
    paddingHorizontal: Padding.padding_20, paddingTop: Padding.padding_15, paddingBottom: 40, 
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10,
  },
  dragHandle: {
    width: 40, height: 5, borderRadius: 3, backgroundColor: '#CBD5E1', 
    alignSelf: 'center', marginBottom: Gap.gap_15,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text,
  },
  menuContainer: {
    gap: Gap.gap_10,
  },
  divider: {
    height: 1, backgroundColor: '#E2E8F0', marginVertical: 4, 
  },
});