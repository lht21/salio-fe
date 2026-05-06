import React, { useEffect, useMemo } from 'react';
import { CardsIcon, ListChecksIcon } from 'phosphor-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  interpolateColor,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { Border, FontFamily, FontSize, Gap, Padding } from '../constants/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface FlashcardSetCardProps {
  title: string;
  totalWords: number;
  backgroundColor?: string;
  onPress?: () => void;
  isSpecial?: boolean;
  imageSource?: any;
  onFlashcardPress?: () => void;
  onQuizPress?: () => void;
}

const FlashcardSetCard = ({
  title,
  totalWords,
  backgroundColor,
  onPress,
  isSpecial,
  imageSource,
  onFlashcardPress,
  onQuizPress
}: FlashcardSetCardProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    if (isSpecial) {
      colorProgress.value = withRepeat(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [colorProgress, isSpecial]);

  const animatedGradientProps = useAnimatedProps(() => {
    if (!isSpecial) {
      return { colors: ['transparent', 'transparent'] } as any;
    }

    return {
      colors: [
        interpolateColor(colorProgress.value, [0, 1], [colors.cardGreenBg, colors.greenLight]),
        interpolateColor(colorProgress.value, [0, 1], [colors.main, colors.main2]),
      ]
    };
  }, [isSpecial, colors, colorProgress]);

  const resolvedImage = imageSource || (isSpecial ? require('../assets/images/horani/horani_vocab.png') : null);

  const content = (
    <>
      <View style={styles.topRow}>
        {resolvedImage ? (
          <Image
            source={resolvedImage}
            style={styles.mascotImage}
            contentFit="contain"
          />
        ) : null}

        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitle}>{t('vocabulary.saved_words_prefix', 'Bạn đã lưu ')}</Text>
            <Text style={styles.countText}>{totalWords}</Text>
            <Text style={styles.subtitle}>{t('vocabulary.saved_words_suffix', ' từ vựng')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.button, !isSpecial && styles.iconOnlyButton]} onPress={onFlashcardPress}>
          <CardsIcon size={20} color={colors.bg} weight="fill" />
          {isSpecial ? (
            <Text
              style={styles.buttonText}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {t('vocabulary.flashcard_mode', 'Chế độ Flashcard')}
            </Text>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, !isSpecial && styles.iconOnlyButton]} onPress={onQuizPress}>
          <ListChecksIcon size={20} color={colors.bg} weight="bold" />
          {isSpecial ? (
            <Text
              style={styles.buttonText}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {t('vocabulary.quiz_mode', 'Chế độ Trắc nghiệm')}
            </Text>
          ) : null}
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isSpecial ? (
        <AnimatedLinearGradient
          colors={[colors.cardGreenBg, colors.main]}
          animatedProps={animatedGradientProps}
          style={styles.container}
        >
          {content}
        </AnimatedLinearGradient>
      ) : (
        <View style={[styles.container, backgroundColor ? { backgroundColor } : null]}>
          {content}
        </View>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  cardWrapper: {
    marginBottom: 24,
    width: 300,
  },
  container: {
    flex: 1,
    borderRadius: Border.br_30,
    padding: Padding.padding_15 || 15,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Gap.gap_20,
  },
  mascotImage: {
    width: 80,
    height: 80,
    marginRight: Gap.gap_15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 16,
    color: colors.text,
    marginBottom: Gap.gap_8,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 13,
    color: colors.gray,
  },
  countText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 18,
    color: colors.text,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Gap.gap_10 || 10,
  },
  button: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    backgroundColor: colors.text,
    borderRadius: Border.br_15,
    paddingHorizontal: Padding.padding_10 || 10,
    paddingVertical: Padding.padding_11,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Gap.gap_5,
  },
  iconOnlyButton: {
    flex: 0,
    width: 44,
    height: 44,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  buttonText: {
    flexShrink: 1,
    color: colors.bg,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 14,
  },
});

export default FlashcardSetCard;
