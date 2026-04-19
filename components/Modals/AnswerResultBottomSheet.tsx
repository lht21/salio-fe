import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
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
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(220)).current;
  const [isMounted, setIsMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      overlayOpacity.setValue(0);
      sheetTranslateY.setValue(220);

      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        })
      ]).start();
      return;
    }

    if (!isMounted) {
      return;
    }

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 220,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true
      })
    ]).start(() => {
      setIsMounted(false);
    });
  }, [isMounted, overlayOpacity, sheetTranslateY, visible]);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      visible={isMounted}
      transparent={true}
      animationType="none"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Animated.View
          pointerEvents="none"
          style={[styles.backdrop, { opacity: overlayOpacity }]}
        />
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <Animated.View
          style={[
            styles.sheetContent,
            {
              paddingBottom: Math.max(insets.bottom, 20),
              transform: [{ translateY: sheetTranslateY }]
            }
          ]}
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
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end"
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)"
  },
  sheetContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 10,
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
    textAlign: "center"
  },

  buttonText: {
    fontFamily: FontFamily.lexendDecaSemiBold
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  cancelText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 14,
    color: Color.gray || "#64748B",
  },
});
