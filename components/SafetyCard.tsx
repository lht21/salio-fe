import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WarningOctagonIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap, Stroke } from '../constants/GlobalStyles';

interface SafetyCardProps {
  onPress?: () => void;
}

const SafetyCard = ({ onPress }: SafetyCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <WarningOctagonIcon size={24} color="#DC2626" weight="fill" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>An toàn lao động</Text>
        <Text style={styles.subtitle}>Biển báo cấm, nguy hiểm, chỉ dẫn</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.bg, 
    borderWidth: Stroke.stroke,
    borderColor: Color.stroke, 
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
    color: '#B91C1C', // Dark red
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 12,
    color: '#EF4444', // Medium red
  },
});

export default SafetyCard;