// components/UpgradeBanner.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { Border, FontSize } from '../constants/GlobalStyles';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CaretRightIcon } from 'phosphor-react-native';
import { Color, FontFamily, Padding } from '../constants/GlobalStyles';

export  const UpgradeBanner = () => (
  <TouchableOpacity style={bannerStyles.wrapper}>
    <LinearGradient colors={[Color.color, Color.color]} start={{x:0, y:0}} end={{x:1, y:1}} style={bannerStyles.gradient}>
      <Text style={bannerStyles.title}>Trải nghiệm không giới hạn</Text>
      <View style={bannerStyles.row}>
        <Text style={bannerStyles.sub}>Nâng cấp ngay</Text>
        <CaretRightIcon size={14} color={Color.bg} weight="bold" />
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const bannerStyles = StyleSheet.create({
  wrapper: { marginHorizontal: Padding.padding_15 || 15, marginTop: 10, marginBottom: 40 },
  gradient: { borderRadius: Border.br_30 || 15, padding: 20 },
  title: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.bg, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sub: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.vang },
});