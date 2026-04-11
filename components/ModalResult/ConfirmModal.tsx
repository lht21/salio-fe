import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import Button from '../Button'; // Đảm bảo đường dẫn đúng tới Button.tsx

interface ConfirmModalProps {
  isVisible: boolean;
  title: string;
  subtitle?: string; // Dòng mô tả nhỏ (không bắt buộc)
  confirmText?: string; // Mặc định là "Đồng ý"
  cancelText?: string; // Mặc định là "Hủy"
  isDestructive?: boolean; // Xác định nút confirm là Xanh lá (false) hay Đỏ (true)
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  title,
  subtitle,
  confirmText = "Đồng ý",
  cancelText = "Hủy",
  isDestructive = false, // Mặc định các action bình thường là an toàn (Nộp bài...)
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onCancel} 
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backgroundTouchable} onPress={onCancel} />
        
        <View style={styles.alertBox}>
          
          {/* TIÊU ĐỀ */}
          <Text style={styles.titleText}>{title}</Text>
          
          {/* MÔ TẢ (Nếu có) */}
          {subtitle && (
            <Text style={styles.subtitleText}>{subtitle}</Text>
          )}
          
          {/* HÀNG NÚT BẤM */}
          <View style={styles.buttonRow}>
            {/* Nút Cancel: Thường là Outline hoặc màu nhạt. Trong ảnh thiết kế, nút Hủy (Tiếp tục học) có dạng viền xanh */}
            <Button 
              variant="Outline" // Bạn có thể tạo thêm variant "OutlineGreen" trong Button.tsx nếu cần viền xanh chính xác
              title={cancelText} 
              onPress={onCancel} 
              style={styles.actionButton} 
            />

            {/* Nút Confirm: Tuỳ thuộc vào tính chất hành động */}
            <Button 
              variant={isDestructive ? "Red" : "Green"} // Đăng xuất/Thoát bài -> Đỏ; Nộp bài -> Xanh lá
              title={confirmText} 
              onPress={onConfirm} 
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
    paddingHorizontal: Padding.padding_15, // Tạo lề cho an toàn
  },
  backgroundTouchable: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  alertBox: {
    width: '100%',
    maxWidth: 340, // Giới hạn chiều rộng tối đa để UI không bị quá bành trướng trên màn hình to
    backgroundColor: Color.bg,
    borderRadius: Border.br_20, // Bo góc mềm mại
    padding: Padding.padding_20, // Padding đều các góc theo chuẩn UI hiện đại
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  titleText: {
    fontFamily: FontFamily.lexendDecaSemiBold, // Tiêu đề thường in đậm hơn
    fontSize: FontSize.fs_16, // To hơn để làm điểm nhấn
    color: Color.text,
    textAlign: 'left', // Theo thiết kế của bạn, nội dung căn trái
    marginBottom: Gap.gap_10,
  },
  subtitleText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text, 
    textAlign: 'left',
    marginBottom: Gap.gap_20,
    lineHeight: 22,
    opacity: 0.8, // Làm text hơi mờ xuống để phân cấp thông tin với tiêu đề
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12, 
    marginTop: 10,
  },
  actionButton: {
    flex: 1, 
    marginVertical: 0, 
  },
});