import React from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { Border, Color, FontFamily, FontSize } from '../../../constants/GlobalStyles';

type SpeakingIntroPopupProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  buttonLabel?: string;
  mascotLeft?: any;
  mascotRight?: any;
  mascotSources?: any[];
  children?: React.ReactNode;
  delayMs?: number;
};

export default function SpeakingIntroPopup({
  visible,
  onClose,
  title,
  description,
  buttonLabel = 'Bat dau ngay',
  mascotLeft,
  mascotRight,
  mascotSources,
  children,
  delayMs = 180,
}: SpeakingIntroPopupProps) {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-54)).current;
  const [isMounted, setIsMounted] = React.useState(visible);
  const [isClosing, setIsClosing] = React.useState(false);
  const resolvedMascots = React.useMemo(
    () => mascotSources ?? [mascotLeft, mascotRight].filter(Boolean),
    [mascotLeft, mascotRight, mascotSources]
  );

  React.useEffect(() => {
    if (!visible) {
      setIsMounted(false);
      setIsClosing(false);
      opacity.setValue(0);
      translateY.setValue(-54);
      return;
    }

    setIsMounted(true);
    setIsClosing(false);
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, opacity, translateY, visible]);

  const handleClose = React.useCallback(() => {
    if (isClosing) {
      return;
    }

    setIsClosing(true);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 54,
        duration: 260,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsMounted(false);
      setIsClosing(false);
      onClose();
    });
  }, [isClosing, onClose, opacity, translateY]);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal visible={isMounted} transparent animationType="none" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          {resolvedMascots.length ? (
            <View style={styles.mascotRow}>
              {resolvedMascots.map((source, index) => (
                <Image key={`${index}`} source={source} style={styles.mascot} contentFit="contain" />
              ))}
            </View>
          ) : null}

          {title ? <Text style={styles.title}>{title}</Text> : null}
          {description ? <Text style={styles.text}>{description}</Text> : null}
          {children}

          <Pressable style={styles.button} onPress={handleClose}>
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: Border.br_20,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    alignItems: 'center',
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: -100,
    marginBottom: -30,
  },
  mascot: {
    width: 180,
    height: 180,
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 8,
  },
  text: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.text,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    minWidth: 156,
    borderRadius: 999,
    backgroundColor: Color.cam,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  buttonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
