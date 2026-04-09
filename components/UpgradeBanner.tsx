// components/UpgradeBanner.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CaretRightIcon } from 'phosphor-react-native';
import { useRouter } from 'expo-router';

import { Color, FontFamily, Padding, Border, FontSize } from '../constants/GlobalStyles';

export const UpgradeBanner = () => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={bannerStyles.wrapper}
      activeOpacity={0.8}
      // Điều hướng đến thư mục subscription
      onPress={() => router.push('/subscription')} 
    >
      <LinearGradient 
        colors={[Color.green, Color.main]} 
        start={{x:0, y:0}} 
        end={{x:1, y:1}} 
        style={bannerStyles.gradient}
      >
        <Text style={bannerStyles.title}>Trải nghiệm không giới hạn</Text>
        <View style={bannerStyles.row}>
          <Text style={bannerStyles.sub}>Nâng cấp ngay</Text>
          <CaretRightIcon size={14} color={Color.bg} weight="bold" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const bannerStyles = StyleSheet.create({
  wrapper: { marginHorizontal: Padding.padding_15 || 15, marginTop: 10, marginBottom: 40 },
  gradient: { borderRadius: Border.br_30 || 15, padding: 20 },
  title: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.bg, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sub: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: Color.vang },
});