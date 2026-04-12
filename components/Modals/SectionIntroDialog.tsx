import { useEffect } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

import { Color, FontFamily, FontSize } from "../../constants/GlobalStyles";

interface SectionIntroDialogProps {
  visible: boolean;
  sectionTitle: string; // e.g., "Nhiệm vụ 1"
  instruction: string; // e.g., "Đọc hiểu và chọn"
  onClose: () => void;
}

export default function SectionIntroDialog({
  visible,
  sectionTitle,
  instruction,
  onClose
}: SectionIntroDialogProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          {/* Section Header */}
          <View style={styles.titleBox}>
            <Text style={styles.titleText}>{sectionTitle}</Text>
          </View>

          {/* Instruction */}
          <View style={styles.card}>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center"
  },
  dialogContainer: {
    width: "80%",
    alignItems: "center"
  },
  titleBox: {
    backgroundColor: Color.cam || "#FF6B00",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 15,
    marginBottom: -20, // Negative margin to overlap with the card
    zIndex: 10
  },
  titleText: {
    color: "#FFFFFF",
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14 || 14
  },
  card: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 60,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  instructionText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16 || 16,
    color: "#000000",
    textAlign: "center"
  }
});
