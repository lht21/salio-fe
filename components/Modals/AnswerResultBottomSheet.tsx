import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../components/Button";

import { Color, FontFamily } from "../../constants/GlobalStyles";

export type BottomSheetVariant = "green" | "orange";

interface AnswerResultBottomSheetProps {
  visible: boolean;
  variant: BottomSheetVariant;
  onNext: () => void;
  onCancel?: () => void;
  buttonText?: string;
  title?: string;
}

export default function AnswerResultBottomSheet({
  visible,
  variant,
  onNext,
  onCancel,
  buttonText = "Chốt, câu tiếp theo",
  title = ""
}: AnswerResultBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const isGreen = variant === "green";

  const buttonBgColor = isGreen ? "green" : "orange";
  const buttonTextColor = isGreen ? "#0C5F35" : "#FFFFFF";

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable
          style={[
            styles.sheetContent,
            { paddingBottom: Math.max(insets.bottom, 20) }
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {title && (
            <Text
              style={[
                styles.title,
                { color: isGreen ? Color.main2 : Color.cam }
              ]}
            >
              {title}
            </Text>
          )}

          {isGreen ? (
            <Button title={buttonText} variant="Green" onPress={onNext} />
          ) : (
            <Button title={buttonText} variant="Orange" onPress={onNext} />
          )}

          {onCancel && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Chọn lại đáp án</Text>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)" // Dim background
  },
  sheetContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10
  },
  title: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center"
  },

  buttonText: {
    fontFamily: FontFamily.lexendDecaSemiBold
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  cancelText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 14,
    color: Color.gray || "#64748B",
  },
});
