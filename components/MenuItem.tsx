// components/MenuItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CaretRightIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Padding } from '../constants/GlobalStyles';

interface Props {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export const MenuItem = ({ icon, title, subtitle }: Props) => (
  <TouchableOpacity style={styles.menuContainer}>
    <View style={styles.menuIcon}>{icon}</View>
    <View style={styles.menuTextWrap}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuSub}>{subtitle}</Text>
    </View>
    <CaretRightIcon size={20} color={Color.gray} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Padding.padding_15 || 15,
    paddingVertical: 12,
  },
  menuIcon: { marginRight: 16 },
  menuTextWrap: { flex: 1 },
  menuTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14, color: Color.text, marginBottom: 2 },
  menuSub: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: Color.gray },
});

