import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap, Stroke } from '../constants/GlobalStyles';

interface IndustryCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

const IndustryCard = ({ title, subtitle, icon, onPress }: IndustryCardProps) => {
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

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.bg, // Light yellow background
    borderWidth: Stroke.stroke,
    borderColor: Color.stroke, // Yellow border
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
    color: '#B45309', // Dark yellow
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 12,
    color: '#D97706', // Medium yellow
  },
});

export default IndustryCard;