import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { FontFamily, Border, Padding, Gap, Stroke } from '../constants/GlobalStyles';

interface IndustryCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

const IndustryCard = ({ title, subtitle, icon, onPress }: IndustryCardProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
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
    borderRadius: Border.br_15 || 15,
    padding: Padding.padding_15 || 15,
    marginBottom: Gap.gap_20 || 20,
    
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
    color: colors.industryTitle || '#B45309', 
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 12,
    color: colors.industrySubtitle || '#D97706', 
  },
});

export default IndustryCard;