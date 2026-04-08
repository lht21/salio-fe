import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import Button from '../Button'; // Nhớ trỏ đường dẫn đúng vị trí file Button.tsx của bạn

interface ConfirmModalProps {
  isVisible: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  title,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onCancel} // Hỗ trợ nút Back trên Android
    >
      <View style={styles.overlay}>
        {/* Bấm ra ngoài để đóng Modal */}
        <Pressable style={styles.backgroundTouchable} onPress={onCancel} />
        
        <View style={styles.alertBox}>
          <Text style={styles.titleText}>{title}</Text>
          
          <View style={styles.buttonRow}>
            <Button 
              variant="Green" 
              title="Có" 
              onPress={onConfirm} 
              style={styles.actionButton} 
            />
            <Button 
              variant="Orange" 
              title="Không" 
              onPress={onCancel} 
              style={styles.actionButton} 
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundTouchable: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  alertBox: {
    width: '80%',
    backgroundColor: Color.bg,
    borderRadius: 24, // Bo góc lớn theo yêu cầu
    paddingHorizontal: Padding.padding_19,
    paddingVertical: Padding.padding_30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  titleText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    color: Color.text, // Chữ màu xám đậm/đen
    textAlign: 'center',
    marginBottom: Gap.gap_20,
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12, // Khoảng cách giữa 2 nút
  },
  actionButton: {
    flex: 1, // Để 2 nút chia đều chiều rộng
    marginVertical: 0, // Ghi đè marginVertical mặc định trong Button.tsx để 2 nút thẳng hàng chuẩn
  },
});