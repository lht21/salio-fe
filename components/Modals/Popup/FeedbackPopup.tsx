import React from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { Border, Color, FontFamily, FontSize } from '../../../constants/GlobalStyles';

type FeedbackType = 'success' | 'failure';

type SpeakingFeedbackPopupProps = {
  visible: boolean;
  type: FeedbackType;
  onNext: () => void;
  onOutsidePress?: () => void;
  translateY: Animated.Value;
  opacity: Animated.Value;
  imageSource: any;
};

export default function SpeakingFeedbackPopup({
  visible,
  type,
  onNext,
  onOutsidePress,
  translateY,
  opacity,
  imageSource,
}: SpeakingFeedbackPopupProps) {
  const isSuccess = type === 'success';

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onNext}>
      <Pressable style={styles.overlay} onPress={!isSuccess ? onOutsidePress : undefined}>
        <Animated.View
          style={[
            isSuccess ? styles.successCard : styles.failureCard,
            {
              opacity,
              transform: [{ translateY }],
            },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.contentRow}>
            <View style={styles.textWrap}>
              {isSuccess ? (
                <>
                  <Text style={styles.successLabel}>Tích lũy năng lượng</Text>
                  <Text style={styles.successText}>BẠN LÀM TỐT LẮM!</Text>
                </>
              ) : (
                <Text style={styles.failureText}>TÔI SAI MẤT RỒI!{'\n'}BẠN ĐANG HỌC MÀ,{'\n'}CỐ LÊN</Text>
              )}
            </View>

            <Image source={imageSource} style={isSuccess ? styles.successImage : styles.failureImage} contentFit="contain" />
          </View>

          <Pressable style={styles.button} onPress={onNext}>
            <Text style={styles.buttonText}>Câu tiếp theo</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  successCard: {
    margin: 0,
    minHeight: 150,
    backgroundColor: '#ABFF73',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
  },
  failureCard: {
    margin: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FF9A48',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  textWrap: {
    flex: 1,
  },
  successLabel: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 10,
    color: '#2E8E19',
    marginBottom: 6,
  },
  successText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    color: '#2F7D1F',
    fontWeight: '700',
  },
  failureText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 16,
    lineHeight: 24,
    color: '#8B1B00',
    fontWeight: '700',
  },
  successImage: {
    width: 130,
    height: 130,
  },
  failureImage: {
    width: 118,
    height: 118,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: Border.br_30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
});
