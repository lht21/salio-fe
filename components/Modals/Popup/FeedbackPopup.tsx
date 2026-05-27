import React, { useEffect } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';

import { Border, Color, FontFamily, FontSize } from '../../../constants/GlobalStyles';

type FeedbackType = 'success' | 'failure';

type SpeakingFeedbackPopupProps = {
  visible: boolean;
  type: FeedbackType;
  onNext: () => void;
  translateY: Animated.Value;
  opacity: Animated.Value;
  imageSource: any;
};

export default function SpeakingFeedbackPopup({
  visible,
  type,
  onNext,
  translateY,
  opacity,
  imageSource,
}: SpeakingFeedbackPopupProps) {
  const isSuccess = type === 'success';

  useEffect(() => {
    let sound: Audio.Sound | null = null;

    const playSound = async () => {
      if (visible) {
        try {
          // Khuyến nghị: Thay URI bằng file nội bộ nếu bạn có file âm thanh sẵn trong assets để không bị độ trễ mạng
          // Ví dụ: const soundAsset = isSuccess ? require('../../../assets/audio/correct.mp3') : require('../../../assets/audio/wrong.mp3');
          // const { sound: newSound } = await Audio.Sound.createAsync(soundAsset);
          
          const audioUri = isSuccess 
            ? 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3?filename=correct-2-46134.mp3'
            : 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_73151eb42b.mp3?filename=error-126627.mp3';

          const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUri });
          sound = newSound;
          await sound.playAsync();
        } catch (error) {
          console.log('Lỗi phát âm thanh feedback:', error);
        }
      }
    };

    playSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [visible, isSuccess]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onNext}>
      <View style={styles.overlay}>
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
      </View>
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
