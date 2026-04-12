import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import Button from '../Button';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';

type HangulCompleteModalProps = {
  visible: boolean;
  onClose: () => void;
};

const HangulCompleteModal = ({ visible, onClose }: HangulCompleteModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.hero}>
            <Image
              source={require('../../assets/images/horani/result-levelup.png')}
              style={styles.heroImage}
              contentFit="contain"
            />

            <Text style={styles.kicker}>Cấp bậc</Text>
            <Text style={styles.title}>Sơ cấp 1</Text>

            <View style={styles.scorePill}>
              <Text style={styles.scoreText}>Hoàn thành bảng chữ cái Hangul</Text>
            </View>
          </View>

          <View style={styles.messageCard}>
            <Text style={styles.messageText}>
              Chúc mừng bạn đã học xong bảng chữ cái Hangul!
              {'\n'}
              Hãy tiếp tục chinh phục những nhiệm vụ khó hơn nhe!
            </Text>

            <Button
              title="Quay lại bài học"
              variant="GreenBold"
              onPress={onClose}
              style={styles.ctaButton}
            />
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.22)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  sheet: {
    borderRadius: 34,
    backgroundColor: Color.bg,
    overflow: 'hidden',
  },
  hero: {
    alignItems: 'center',
    paddingTop: 36,
    paddingHorizontal: 24,
    paddingBottom: 28,
    backgroundColor: '#F7FFF6',
  },
  heroImage: {
    width: 150,
    height: 150,
    marginBottom: 14,
  },
  kicker: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: Color.text,
    marginBottom: 10,
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 42,
    color: '#48A800',
    marginBottom: 18,
  },
  scorePill: {
    minWidth: 220,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: Border.br_15,
    backgroundColor: '#F1FAF0',
    alignItems: 'center',
  },
  scoreText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
    textAlign: 'center',
  },
  messageCard: {
    backgroundColor: '#9BF08A',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 26,
    gap: Gap.gap_20,
  },
  messageText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    color: Color.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaButton: {
    marginVertical: 0,
    backgroundColor: Color.vang,
  },
});

export default HangulCompleteModal;