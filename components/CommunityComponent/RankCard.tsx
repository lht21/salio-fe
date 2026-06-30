import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

import { FontFamily, FontSize, Padding, Gap, Border, Stroke } from '../../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

export default function RankCard({ item, isCurrentUser = false }: { item: any, isCurrentUser?: boolean }) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  return (
    <View style={[styles.rankCard, isCurrentUser && styles.currentUserCard]}>
      <View style={styles.rankCardLeft}>
        <View style={styles.rankNumberWrapper}>
          <Text style={styles.hashText}>#</Text>
          <Text style={styles.rankText}>{item.rank}</Text>
        </View>
        <Image source={{ uri: item.avatar }} style={styles.rankAvatar} />
        <Text style={[styles.rankName, isCurrentUser && { color: colors.main2 }]} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <View style={styles.scoreWrapper}>
        <Text style={styles.rankScore}>{item.score}</Text>
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      rankCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: colors.bg, borderRadius: Border.br_20, padding: Padding.padding_15,
        marginBottom: Gap.gap_10, borderWidth: Stroke.stroke, borderColor: colors.stroke,
      },
      rankCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
      rankNumberWrapper: { flexDirection: 'row', alignItems: 'baseline', width: 38 },
      hashText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 11, color: colors.main2, marginRight: 2 },
      rankText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: colors.text },
      rankAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: Gap.gap_10 },
      rankName: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14, color: colors.text, flex: 1 },
      scoreWrapper: { paddingLeft: Gap.gap_10 },
      rankScore: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: colors.cam },
      currentUserCard: { borderColor: colors.main, backgroundColor: '#F0FDF4', marginBottom: 0, borderWidth: 2 },
    });