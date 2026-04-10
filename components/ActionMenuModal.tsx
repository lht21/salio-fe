import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { 
  ArrowsClockwiseIcon, 
  WarningCircleIcon, 
  ExportIcon,
  ArticleIcon, // Icon Xem bài mẫu
  DownloadSimpleIcon, // Icon Tải PDF
  ClockCounterClockwiseIcon // Icon Lịch sử
} from 'phosphor-react-native';

import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../constants/GlobalStyles';
import CloseButton from './CloseButton';

interface ActionMenuModalProps {
  isVisible: boolean;
  onClose: () => void;
  onViewSample: () => void; // Prop mới
  onViewHistory: () => void; // Prop mới
  onDownloadPDF: () => void; // Prop mới
  onRetry: () => void;
  onReport: () => void;
  onShare: () => void;
}

export default function ActionMenuModal({ 
  isVisible, 
  onClose, 
  onViewSample,
  onViewHistory,
  onDownloadPDF,
  onRetry, 
  onReport, 
  onShare 
}: ActionMenuModalProps) {
  
  return (
    <Modal
      visible={isVisible}
      animationType="slide" 
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Bấm vào nền mờ để đóng */}
        <Pressable style={styles.backgroundTouchable} onPress={onClose} />
        
        {/* KHỐI BOTTOM SHEET */}
        <View style={styles.sheetContent}>
          
          {/* Thanh gạch ngang trang trí (Drag handle) */}
          <View style={styles.dragHandle} />

          {/* Header của Bottom Sheet */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Tùy chọn</Text>
            <CloseButton variant="Stroke" onPress={onClose} />
          </View>

          {/* Khối chứa các Menu Option */}
          <View style={styles.menuContainer}>
            
            {/* --- NHÓM 1: HỌC TẬP --- */}
            
            {/* Lựa chọn: Xem bài mẫu */}
            <TouchableOpacity style={styles.menuItem} onPress={onViewSample} activeOpacity={0.7}>
              <View style={styles.iconWrapper}>
                <ArticleIcon size={24} color={Color.text} weight="regular" />
              </View>
              <Text style={styles.menuText}>Xem bài mẫu</Text>
            </TouchableOpacity>

            {/* Lựa chọn: Lịch sử luyện tập */}
            <TouchableOpacity style={styles.menuItem} onPress={onViewHistory} activeOpacity={0.7}>
              <View style={styles.iconWrapper}>
                <ClockCounterClockwiseIcon size={24} color={Color.text} weight="regular" />
              </View>
              <Text style={styles.menuText}>Lịch sử luyện tập đề này</Text>
            </TouchableOpacity>

            {/* Lựa chọn: Luyện tập lại */}
            <TouchableOpacity style={styles.menuItem} onPress={onRetry} activeOpacity={0.7}>
              <View style={styles.iconWrapper}>
                <ArrowsClockwiseIcon size={24} color={Color.text} weight="regular" />
              </View>
              <Text style={styles.menuText}>Luyện tập lại</Text>
            </TouchableOpacity>

            {/* --- ĐƯỜNG PHÂN CÁCH --- */}
            <View style={styles.divider} />

            {/* --- NHÓM 2: TIỆN ÍCH & HỆ THỐNG --- */}

            {/* Lựa chọn: Tải xuống PDF */}
            <TouchableOpacity style={styles.menuItem} onPress={onDownloadPDF} activeOpacity={0.7}>
              <View style={styles.iconWrapper}>
                <DownloadSimpleIcon size={24} color={Color.text} weight="regular" />
              </View>
              <Text style={styles.menuText}>Tải xuống PDF</Text>
            </TouchableOpacity>

            {/* Lựa chọn: Chia sẻ */}
            <TouchableOpacity style={styles.menuItem} onPress={onShare} activeOpacity={0.7}>
              <View style={styles.iconWrapper}>
                <ExportIcon size={24} color={Color.text} weight="regular" />
              </View>
              <Text style={styles.menuText}>Chia sẻ</Text>
            </TouchableOpacity>

            {/* Lựa chọn: Báo cáo lỗi sai */}
            <TouchableOpacity style={styles.menuItem} onPress={onReport} activeOpacity={0.7}>
              <View style={styles.iconWrapper}>
                <WarningCircleIcon size={24} color={Color.text} weight="regular" />
              </View>
              <Text style={styles.menuText}>Báo cáo lỗi sai</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    justifyContent: 'flex-end', 
  },
  backgroundTouchable: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
  },
  
  // --- STYLES CHO BOTTOM SHEET ---
  sheetContent: {
    backgroundColor: Color.bg,
    borderTopLeftRadius: Border.br_30, 
    borderTopRightRadius: Border.br_30,
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_15,
    paddingBottom: 40, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1', 
    alignSelf: 'center',
    marginBottom: Gap.gap_15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.gap_20,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },

  // --- STYLES CHO MENU ITEMS ---
  menuContainer: {
    gap: Gap.gap_10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.bg,
    borderRadius: Border.br_15,
    padding: Padding.padding_15,
    borderWidth: 1,
    borderColor: '#E2E8F0', 
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Gap.gap_15,
  },
  menuText: {
    flex: 1, // Để text chiếm phần không gian còn lại
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    color: '#0F172A',
  },
  
  // Đường phân cách mờ giữa 2 nhóm tính năng
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4, 
  },
});