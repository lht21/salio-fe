import React, { useEffect } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

import { Border, FontFamily, FontSize } from '../../../constants/GlobalStyles';
import Button from '../../../components/Button';
import { useTheme } from "@/contexts/ThemeContext";

type FeedbackType = 'success' | 'failure';

type SpeakingFeedbackPopupProps = {
  visible: boolean;
  type: FeedbackType;
  onNext: () => void;
  translateY: Animated.Value;
  opacity: Animated.Value;
  imageSource: any;
  onOverrideCorrect?: () => void;
};

export default function SpeakingFeedbackPopup({
  visible,
  type,
  onNext,
  translateY,
  opacity,
  imageSource,
  onOverrideCorrect,
}: SpeakingFeedbackPopupProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const isSuccess = type === 'success';

  useEffect(() => {
    let sound: Audio.Sound | null = null;

    const playSound = async () => {
      if (visible) {
        try {
          if (isSuccess) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }

          const soundAsset = isSuccess
            ? require('../../../assets/audio/correct.mp3')
            : require('../../../assets/audio/incorrect.mp3');

          const { sound: newSound } = await Audio.Sound.createAsync(soundAsset);
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

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
      onStartShouldSetResponder={() => true}
    >
      <View style={isSuccess ? styles.successCard : styles.failureCard}>
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

        {!isSuccess && onOverrideCorrect && (
          <Button
            variant="TextOnly"
            title="Đáp án của tôi là đúng!"
            onPress={onOverrideCorrect}
            style={styles.overrideButton}
            textStyle={styles.overrideButtonText}
          />
        )}

        <Button
          variant="Black"
          title="Câu tiếp theo"
          onPress={onNext}
          style={{ marginTop: 20 }}
        />
      </View>
    </Animated.View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  wrapper: {
    paddingHorizontal: 15,
    paddingBottom: 20, // Tạo khoảng cách để popup lơ lửng cách đáy
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  successCard: {
    margin: 0,
    minHeight: 150,
    backgroundColor: colors.main75,
    borderRadius: 30, // Bo tròn cả 4 góc
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    borderBottomWidth: 7,
    borderLeftWidth: 4,
    borderWidth: 2,
    borderColor: colors.main700

  },
  failureCard: {
    margin: 0,
    borderRadius: 30, // Bo tròn cả 4 góc
    backgroundColor: colors.orange300,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    borderBottomWidth: 7,
    borderLeftWidth: 4,
    borderWidth: 2,
    borderColor: colors.orange700

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
  overrideButton: {
    marginTop: 15,
    marginBottom: 5,
    alignItems: 'center',
  },
  overrideButtonText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 14,
    color: '#8B1B00',
    textDecorationLine: 'underline',
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
    color: colors.textPrimary,
  },
});
