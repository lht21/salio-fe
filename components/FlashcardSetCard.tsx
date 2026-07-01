import React, { useEffect, useMemo } from 'react';
import { ClockCounterClockwiseIcon, ArrowFatLineRightIcon } from 'phosphor-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Border, FontFamily, FontSize, Gap, Padding } from '../constants/GlobalStyles';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

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

  const resolvedImage = imageSource || (isSpecial ? require('../assets/images/horani/horani_vocab.png') : null);

  const content = (
    <View style={styles.cardContent}>
      {resolvedImage ? (
        <Image
          source={resolvedImage}
          style={styles.mascotImage}
          contentFit="contain"
        />
      ) : null}

      <View style={styles.textContainer}>
        <Text style={[styles.title, isSpecial && { color: '#FFFFFF' }]}>{title}</Text>

        <View style={[styles.badgeContainer, isSpecial && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
          <Text style={[styles.badgeText, isSpecial && { color: '#FFFFFF' }]}>{totalWords} {t('vocabulary.words', 'từ')}</Text>
        </View>

        <View style={styles.historyRow}>
          <ClockCounterClockwiseIcon size={14} color={isSpecial ? 'rgba(255, 255, 255, 0.8)' : colors.textSecondary} weight="bold" />
          <Text style={[styles.historyText, isSpecial && { color: 'rgba(255, 255, 255, 0.8)' }]}>{t('vocabulary.last_studied', 'Học gần nhất: 3 ngày trước')}</Text>
        </View>
      </View>

      <ArrowFatLineRightIcon size={20} color={isSpecial ? '#FFFFFF' : colors.textSecondary} weight="bold" />
    </View>
  );

  return (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isSpecial ? (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
          {content}
        </View>
      ) : (
        <View style={[styles.container, styles.normalCard, backgroundColor ? { backgroundColor } : null]}>
          {content}
        </View>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  cardWrapper: {
    width: '100%',
  },
  container: {
    flex: 1,
    borderRadius: Border.br_30,
    padding: Padding.padding_20 || 20,
  },
  normalCard: {
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderBottomWidth: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: colors.textPrimary,
    marginBottom: 6,
  },
  badgeContainer: {
    backgroundColor: colors.borderDefault,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 12,
    color: colors.primary,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default FlashcardSetCard;
