import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { XIcon, Keyboard } from 'phosphor-react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

import { FontFamily, FontSize, Gap, Padding, Border } from '../../constants/GlobalStyles';
import IconButton from '../../components/IconButton';
import Button from '../../components/Button';
import { useTheme } from "@/contexts/ThemeContext";

const { width, height } = Dimensions.get('window');

export default function FlashcardTypeIntroScreen() {

  const router = useRouter();
  const { setId } = useLocalSearchParams<{ setId: string }>();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleStartGame = () => {
    router.replace({ pathname: '/vocabulary/flashcard-type', params: { setId } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Decorators */}
      <View style={styles.backgroundDecorators} pointerEvents="none">
        <View style={[styles.bgIcon, { top: height * 0.1, left: width * 0.05, transform: [{ rotate: '-15deg' }] }]}>
          <Keyboard size={150} color={colors.main400 || '#3AB878'} weight="fill" />
        </View>
        <View style={[styles.bgIcon, { top: height * 0.25, right: width * 0.05, transform: [{ rotate: '25deg' }] }]}>
          <Keyboard size={60} color={colors.main400 || '#3AB878'} weight="fill" />
        </View>
        <View style={[styles.bgIcon, { top: height * 0.6, left: width * 0.15, transform: [{ rotate: '45deg' }] }]}>
          <Keyboard size={100} color={colors.main400 || '#3AB878'} weight="fill" />
        </View>
        <View style={[styles.bgIcon, { bottom: height * 0.1, right: width * 0.1, transform: [{ rotate: '-30deg' }] }]}>
          <Keyboard size={70} color={colors.main400 || '#3AB878'} weight="fill" />
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <IconButton
          Icon={XIcon}
          variant="Main"
          onPress={() => router.back()}
          iconSize={24}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.View entering={FadeInUp.duration(600)} style={styles.topSection}>
          <Keyboard size={120} color={colors.brown800} weight="fill" />
          <Text style={styles.heading}>TẬP VIẾT</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(800).delay(300)} style={styles.instructionWrapper}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={20} tint="light" style={styles.instructionContainer}>
              <InstructionContent colors={colors} styles={styles} />
            </BlurView>
          ) : (
            <View style={[styles.instructionContainer, { backgroundColor: 'rgba(255, 255, 255, 0.4)' }]}>
              <InstructionContent colors={colors} styles={styles} />
            </View>
          )}
        </Animated.View>
      </View>

      {/* Footer */}
      <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.footer}>
        <Button
          title="Bắt đầu học"
          onPress={handleStartGame}
          variant="Green"
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const InstructionContent = ({ colors, styles }: any) => (
  <>
    <Text style={styles.instructionTitle}>Cách học</Text>
    <View style={styles.ruleList}>
      <View style={styles.ruleItem}>
        <View style={styles.bulletPoint} />
        <Text style={styles.ruleText}>Gõ từ vựng tiếng Hàn tương ứng với <Text style={styles.ruleTextBold}>nghĩa tiếng Việt</Text> hiện trên màn hình.</Text>
      </View>
      <View style={styles.ruleItem}>
        <View style={styles.bulletPoint} />
        <Text style={styles.ruleText}>Gõ sai bất kỳ ký tự nào, từ đó sẽ tự động được <Text style={styles.ruleTextBold}>ôn lại vào vòng sau</Text>.</Text>
      </View>
      <View style={styles.ruleItem}>
        <View style={styles.bulletPoint} />
        <Text style={styles.ruleText}>Hoàn thành việc gõ đúng tất cả các từ trong danh sách để ghi nhớ thật lâu nhé!</Text>
      </View>
    </View>
  </>
);

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.main50 || '#71D99E',
  },
  backgroundDecorators: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    opacity: 0.2,
  },
  bgIcon: {
    position: 'absolute',
  },
  header: {
    paddingHorizontal: Padding.padding_15,
    paddingTop: Gap.gap_10,
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Padding.padding_20,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: Gap.gap_22,
  },
  heading: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 32,
    color: colors.brown800,
    marginTop: Gap.gap_15,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  instructionWrapper: {
    width: '100%',
    borderRadius: Border.br_30,
    overflow: 'hidden',
  },
  instructionContainer: {
    width: '100%',
    padding: Padding.padding_20,
    alignItems: 'center',
    borderRadius: Border.br_30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  instructionTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: colors.text,
    marginBottom: Gap.gap_15,
  },
  ruleList: {
    width: '100%',
    gap: Gap.gap_10,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Gap.gap_10,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text,
    marginTop: 8,
  },
  ruleText: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: colors.text,
    lineHeight: 22,
  },
  ruleTextBold: {
    fontFamily: FontFamily.lexendDecaBold,
    color: colors.main,
  },
  footer: {
    paddingHorizontal: Padding.padding_20,
    paddingBottom: Padding.padding_20,
  },
});
