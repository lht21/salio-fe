import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable, Alert, Dimensions } from 'react-native';
import { 
  LinkIcon, 
  FacebookLogoIcon, 
  InstagramLogoIcon, 
  MessengerLogoIcon,
  ChatTeardropTextIcon, // Icon chung cho Zalo (Phosphor không có logo Zalo)
  EnvelopeIcon // Icon phong bì cho Email
} from 'phosphor-react-native';

import { Color, FontFamily, FontSize, Padding, Border, Gap } from '../../constants/GlobalStyles';
import CloseButton from '../CloseButton';

// Lấy chiều rộng màn hình để tính toán chiều rộng item linh hoạt
const { width } = Dimensions.get('window');

interface ShareModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ShareModal({ isVisible, onClose }: ShareModalProps) {
  
  // Hàm xử lý mockup khi bấm vào các nút chia sẻ
  const handleShareAction = (platform: string) => {
    onClose();
    Alert.alert("Chia sẻ", `Đang mở ${platform}...`);
  };

  // Dữ liệu cho các lựa chọn chia sẻ
  const shareOptions = [
    { name: 'Messenger', platform: 'Messenger', icon: MessengerLogoIcon, color: "#0084FF" },
    { name: 'Sao chép\nliên kết', platform: 'Sao chép liên kết', icon: LinkIcon, color: "#1E293B", weight: "bold" },
    { name: 'Facebook', platform: 'Facebook', icon: FacebookLogoIcon, color: "#1877F2" },
    { name: 'Instagram', platform: 'Instagram', icon: InstagramLogoIcon, color: "#E1306C" },
    { name: 'Zalo', platform: 'Zalo', icon: ChatTeardropTextIcon, color: "#0084FF" }, // Tô màu xanh tương tự Messenger
    { name: 'Email', platform: 'Email', icon: EnvelopeIcon, color: "#0084FF" },
    { name: 'Stories', platform: 'Stories', icon: InstagramLogoIcon, color: "#E1306C" } // Dùng logo Instagram cho Stories
  ];

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backgroundTouchable} onPress={onClose} />
        
        {/* KHỐI BOTTOM SHEET */}
        <View style={styles.sheetContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chia sẻ đến</Text>
            <CloseButton variant="Stroke" onPress={onClose} />
          </View>

          {/* Lưới chứa các lựa chọn chia sẻ */}
          <View style={styles.shareRow}>
            {shareOptions.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity 
                  key={index}
                  style={styles.shareItem} 
                  activeOpacity={0.7}
                  onPress={() => handleShareAction(item.platform)}
                >
                  <View style={styles.iconContainer}>
                    {/* Bọc icon trong View iconWrapper để tô màu nền và căn chỉnh giống ActionMenuModal */}
                    <View style={styles.iconWrapper}>
                      <IconComponent 
                        size={40} // Kích thước icon Phosphor thống nhất 40
                        color={item.color} 
                        weight={"fill"} // Mặc định dùng weight fill cho logo, bold cho link icon
                      />
                    </View>
                  </View>
                  <Text style={styles.shareText} numberOfLines={2}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </View>
      </View>
    </Modal>
  );
}

// Tính toán chiều rộng item để render 3 cái trên mỗi hàng
const numColumns = 3;
const horizontalPadding = Padding.padding_20;
const columnGap = 5;
const itemWidth = (width - horizontalPadding * 2 - columnGap * (numColumns - 1)) / numColumns;

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
  sheetContent: {
    backgroundColor: Color.bg,
    borderTopLeftRadius: Border.br_30,
    borderTopRightRadius: Border.br_30,
    paddingHorizontal: horizontalPadding,
    paddingTop: Padding.padding_20,
    paddingBottom: 40, // Cách đáy một khoảng an toàn
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // Khoảng cách giữa header và icon row
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold, // Chữ đậm theo ảnh
    fontSize: FontSize.fs_16,
    color: '#1E293B',
  },
  shareRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Cho phép xuống dòng
    justifyContent: 'flex-start', // Căn trái
    alignItems: 'flex-start', // Căn trên để các text không bị xô lệch nếu có 2 dòng
    gap: columnGap, // Khoảng cách cột
  },
  shareItem: {
    alignItems: 'center',
    width: itemWidth, // Chiều rộng item tính toán dynamic
    marginBottom: Gap.gap_20, // Khoảng cách hàng
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Gap.gap_10, // Khoảng cách từ icon xuống chữ
  },
  iconWrapper: {
    width: 60, // Kích thước hình tròn wrapper icon lớn hơn 
    height: 60,
    borderRadius: 30, // Tròn xoe
    backgroundColor: '#F1F5F9', // Nền icon xám tròn tương tự ActionMenuModal
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: '#0F172A',
    textAlign: 'center', // Căn giữa chữ
    lineHeight: 18,
    width: '100%', // Đảm bảo text chiếm hết chiều rộng item để rớt dòng đẹp
  },
});