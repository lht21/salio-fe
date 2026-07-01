import { BookmarkSimpleIcon, FireIcon, TrophyIcon, CertificateIcon, CloudIcon, CaretRightIcon } from 'phosphor-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Border, FontFamily, FontSize, Padding } from '../constants/GlobalStyles';

type StatsRowProps = {
  onScorePress?: () => void;
  onStreakPress?: () => void;
  onCertificatePress?: () => void;
  onVocabPress?: () => void;
  onCloudPress?: () => void;
  streak?: number;
  vocabCount?: number;
  score?: number;
  certificates?: number;
  clouds?: number;
};

const StatsRow = ({ onScorePress, onStreakPress, onCertificatePress, onVocabPress, onCloudPress, streak = 0, vocabCount = 0, score = 0, certificates = 0, clouds = 0 }: StatsRowProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {/* Hàng 1 */}
      <View style={styles.row}>
        {/* Thẻ 1: Chuỗi ngày */}
        <TouchableOpacity
          style={[styles.card, { transform: [{ rotate: '1deg' }] }]}
          activeOpacity={0.82}
          onPress={onStreakPress}
          disabled={!onStreakPress}
        >
          <View style={styles.textWrap}>
            <Text style={styles.number}>{streak}</Text>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{t('stats.days', 'ngày')}</Text>
              <CaretRightIcon size={12} color={colors.primary} weight="bold" />
            </View>
          </View>
          <FireIcon size={24} color={colors.fireIcon || '#991B1B'} weight="fill" />
        </TouchableOpacity>

        {/* Thẻ 2: Từ vựng */}
        <TouchableOpacity
          style={[styles.card, { transform: [{ rotate: '-1deg' }] }]}
          activeOpacity={0.82}
          onPress={onVocabPress}
          disabled={!onVocabPress}
        >
          <View style={styles.textWrap}>
            <Text style={styles.number}>{vocabCount}</Text>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{t('stats.vocab', 'từ vựng')}</Text>
              <CaretRightIcon size={12} color={colors.primary} weight="bold" />
            </View>
          </View>
          <BookmarkSimpleIcon size={24} color={colors.accent1 || '#1877F2'} weight="fill" />
        </TouchableOpacity>

        {/* Thẻ 3: Điểm */}
        <TouchableOpacity
          style={[styles.card, { transform: [{ rotate: '1deg' }] }]}
          activeOpacity={0.82}
          onPress={onScorePress}
          disabled={!onScorePress}
        >
          <View style={styles.textWrap}>
            <Text style={styles.number}>{score}</Text>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{t('stats.score', 'điểm')}</Text>
              <CaretRightIcon size={12} color={colors.primary} weight="bold" />
            </View>
          </View>
          <TrophyIcon size={24} color={colors.trophyIcon || '#D97706'} weight="fill" />
        </TouchableOpacity>
      </View>

      {/* Hàng 2 */}
      <View style={styles.row}>
        {/* Thẻ 4: Chứng chỉ */}
        <TouchableOpacity
          style={[styles.card, { transform: [{ rotate: '-1deg' }] }]}
          activeOpacity={0.82}
          onPress={onCertificatePress}
          disabled={!onCertificatePress}
        >
          <View style={styles.textWrap}>
            <Text style={styles.number}>{certificates}</Text>
            <Text style={styles.label}>{t('stats.certificates', 'huy hiệu')}</Text>
          </View>
          <CertificateIcon size={24} color={colors.primary} weight="fill" />
        </TouchableOpacity>

        {/* Thẻ 5: Đám mây */}
        <TouchableOpacity
          style={[styles.card, { transform: [{ rotate: '1deg' }] }]}
          activeOpacity={0.82}
          onPress={onCloudPress}
          disabled={!onCloudPress}
        >
          <View style={styles.textWrap}>
            <Text style={styles.number}>{clouds}</Text>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{t('stats.clouds', 'đám mây')}</Text>
              <CaretRightIcon size={12} color={colors.primary} weight="bold" />
            </View>
          </View>
          <CloudIcon size={24} color={colors.primary} weight="fill" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: 20,
    gap: 10,
    width: '100%', // Đảm bảo container chiếm trọn không gian ngang
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: Padding.padding_15 || 15, // Chuyển lề vào đây để các thẻ cách mép một chút
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.borderDefault || '#E2E8F0',
    borderRadius: Border.br_15 || 15,
    paddingVertical: Padding.padding_10 || 10,
    paddingHorizontal: Padding.padding_15 || 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textWrap: {
    flexDirection: 'column',
  },
  number: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20 || 20,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  label: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12 || 12,
    color: colors.textSecondary,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});

export default StatsRow;