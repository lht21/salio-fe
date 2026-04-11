import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import CloseButton from '../CloseButton';

// IMPORT COMPONENT MỚI
import ActionMenuItem from '../ActionMenuItem';

interface SaveToFolderModalProps {
  isVisible: boolean;
  onClose: () => void;
  wordData: any;
}

export default function SaveToFolderModal({ isVisible, onClose, wordData }: SaveToFolderModalProps) {
  
  // Dữ liệu mock các thư mục của người dùng
  const userFolders = ['Từ vựng giao tiếp', 'Từ vựng TOPIK 3'];

  const handleSaveFolder = (folderName: string) => {
    onClose();
    Alert.alert("Thành công", `Đã lưu "${wordData?.word}" vào thư mục: ${folderName}`);
  };

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
          
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Lưu thẻ</Text>
            <CloseButton variant="Stroke" onPress={onClose} />
          </View>

          <View style={styles.menuContainer}>
            
            {/* Lựa chọn 1: Lưu vào Sổ tay từ vựng (Favorite) */}
            <ActionMenuItem 
              label="Sổ tay từ vựng" 
              variant="favorite"
              onPress={() => handleSaveFolder('Sổ tay từ vựng')} 
            />

            {/* Lựa chọn 2: Danh sách Flashcard Sets */}
            {userFolders.map((folder, index) => (
              <ActionMenuItem 
                key={index} 
                label={folder} 
                variant="flashcardSet"
                onPress={() => handleSaveFolder(folder)} 
              />
            ))}

            <View style={styles.divider} />

            {/* Lựa chọn 3: Tạo thư mục mới */}
            <ActionMenuItem 
              label="Tạo bộ Flashcard mới" 
              variant="createSet"
              onPress={() => {
                onClose();
                Alert.alert("Tính năng đang phát triển");
              }} 
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