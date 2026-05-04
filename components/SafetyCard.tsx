import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WarningOctagonIcon } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { FontFamily, Border, Padding, Gap, Stroke } from '../constants/GlobalStyles';

interface SafetyCardProps {
  onPress?: () => void;
}

const SafetyCard = ({ onPress }: SafetyCardProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <WarningOctagonIcon size={24} color={colors.safetyIcon || "#DC2626"} weight="fill" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{t('practice.safety', 'An toàn lao động')}</Text>
        <Text style={styles.subtitle}>{t('practice.safety_desc', 'Biển báo cấm, nguy hiểm, chỉ dẫn')}</Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg, 
    borderWidth: Stroke.stroke,
    borderColor: colors.stroke, 
    padding: Padding.padding_15 || 15,
    marginBottom: Gap.gap_20 || 20,
    borderRadius: Border.br_15 || 15,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Border.br_10 || 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Gap.gap_15 || 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 15,
    color: colors.safetyTitle || '#B91C1C', 
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 12,
    color: colors.safetySubtitle || '#EF4444', 
  },
});

export default SafetyCard;