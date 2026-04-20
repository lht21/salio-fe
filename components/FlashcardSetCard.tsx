import React, { useEffect } from 'react';
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
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../constants/GlobalStyles';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface FlashcardSetCardProps {
  title: string;
  totalWords: number;
  backgroundColor?: string;
  onPress?: () => void;
  isSpecial?: boolean;
  imageSource?: any;
}

const FlashcardSetCard = ({
  title,
  totalWords,
  backgroundColor,
  onPress,
  isSpecial,
  imageSource
}: FlashcardSetCardProps) => {
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
        interpolateColor(colorProgress.value, [0, 1], ['#CEF9B4', '#E6FFD1']),
        interpolateColor(colorProgress.value, [0, 1], [Color.main || '#98F291', '#5DE367']),
      ]
    } as any;
  }, [isSpecial]);

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
            <Text style={styles.subtitle}>Bạn đã lưu </Text>
            <Text style={styles.countText}>{totalWords}</Text>
            <Text style={styles.subtitle}> từ vựng</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.button, !isSpecial && styles.iconOnlyButton]}>
          <CardsIcon size={20} color={Color.bg} weight="fill" />
          {isSpecial ? (
            <Text
              style={styles.buttonText}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              Chế độ Flashcard
            </Text>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, !isSpecial && styles.iconOnlyButton]}>
          <ListChecksIcon size={20} color={Color.bg} weight="bold" />
          {isSpecial ? (
            <Text
              style={styles.buttonText}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              Chế độ Trắc nghiệm
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
          colors={['#CEF9B4', Color.main || '#98F291']}
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

const styles = StyleSheet.create({
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
    color: Color.text,
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
    color: Color.gray,
  },
  countText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 18,
    color: Color.text,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Gap.gap_10 || 10,
  },
  button: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    backgroundColor: Color.text || '#2D2D2D',
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
    color: Color.bg,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 14,
  },
});

export default FlashcardSetCard;
