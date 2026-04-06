import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';

interface SkillCardProps {
  title: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

const SkillCard = ({ title, icon, onPress }: SkillCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.bg,
    borderWidth: 1.5,
    borderColor: Color.stroke || '#E2E8F0',
    borderRadius: Border.br_15 || 15,
    padding: Padding.padding_19 || 19,
    justifyContent: 'center',
    gap: Gap.gap_10 || 10,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14 || 14,
    color: Color.text,
  },
});

export default SkillCard;