import React from 'react';
import { Animated, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CloseButton from '../CloseButton';
import { Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';

export type SettingsSheetModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: number | `${number}%`;
  showCloseButton?: boolean;
  edgeToBottom?: boolean;
};

const ENTER_DURATION = 220;
const EXIT_DURATION = 180;

const SettingsSheetModal = ({
  visible,
  title,
  onClose,
  children,
  maxHeight = '75%',
  showCloseButton = true,
  edgeToBottom = false,
}: SettingsSheetModalProps) => {
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = React.useState(visible);
  const animation = React.useRef(new Animated.Value(visible ? 1 : 0)).current;
  const bottomOffset = edgeToBottom ? 0 : Platform.OS === 'android' ? 72 : Math.max(insets.bottom, 18);

  React.useEffect(() => {
    if (visible) {
      setIsMounted(true);

      Animated.timing(animation, {
        toValue: 1,
        duration: ENTER_DURATION,
        useNativeDriver: true,
      }).start();

      return;
    }

    if (!isMounted) {
      return;
    }

    Animated.timing(animation, {
      toValue: 0,
      duration: EXIT_DURATION,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsMounted(false);
      }
    });
  }, [animation, isMounted, visible]);

  if (!isMounted) {
    return null;
  }

  const backdropOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [56, 0],
  });

  return (
    <Modal
      transparent
      visible={isMounted}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <View style={styles.modalRoot}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </Pressable>

        <View
          style={[
            styles.sheetWrapper,
            edgeToBottom && styles.sheetWrapperEdgeToBottom,
            { paddingBottom: bottomOffset },
          ]}
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              styles.sheet,
              edgeToBottom && styles.sheetEdgeToBottom,
              {
                maxHeight,
                paddingBottom: edgeToBottom
                  ? Platform.OS === 'android'
                    ? 36
                    : Math.max(insets.bottom, 24)
                  : 16,
                opacity: animation,
                transform: [{ translateY }],
              },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              {showCloseButton ? (
                <CloseButton
                  variant="Stroke"
                  onPress={onClose}
                  style={styles.closeButton}
                />
              ) : null}
            </View>

            <View style={styles.content}>{children}</View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.26)',
  },
  sheetWrapper: {
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 0,
  },
  sheetWrapperEdgeToBottom: {
    paddingHorizontal: 0,
  },
  sheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    backgroundColor: Color.bg,
    overflow: 'hidden',
    paddingTop: 18,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 8,
  },
  sheetEdgeToBottom: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Gap.gap_10,
    paddingHorizontal: 2,
    marginBottom: 14,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  content: {
    borderRadius: 20,
    flexShrink: 1,
  },
});

export default SettingsSheetModal;
