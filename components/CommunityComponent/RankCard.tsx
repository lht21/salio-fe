import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

import { Color, FontFamily, FontSize, Padding, Gap, Border, Stroke } from '../../constants/GlobalStyles';

export default function RankCard({ item, isCurrentUser = false }: { item: any, isCurrentUser?: boolean }) {
  return (
    <View style={[styles.rankCard, isCurrentUser && styles.currentUserCard]}>
      <View style={styles.rankCardLeft}>
        <View style={styles.rankNumberWrapper}>
          <Text style={styles.hashText}>#</Text>
          <Text style={styles.rankText}>{item.rank}</Text>
        </View>
        <Image source={{ uri: item.avatar }} style={styles.rankAvatar} />
        <Text style={[styles.rankName, isCurrentUser && { color: Color.main2 }]} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <View style={styles.scoreWrapper}>
        <Text style={styles.rankScore}>{item.score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rankCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Color.bg, borderRadius: Border.br_20, padding: Padding.padding_15,
    marginBottom: Gap.gap_10, borderWidth: Stroke.stroke, borderColor: Color.stroke,
  },
  rankCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rankNumberWrapper: { flexDirection: 'row', alignItems: 'baseline', width: 38 },
  hashText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 11, color: Color.main2, marginRight: 2 },
  rankText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: Color.text },
  rankAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: Gap.gap_10 },
  rankName: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14, color: Color.text, flex: 1 },
  scoreWrapper: { paddingLeft: Gap.gap_10 },
  rankScore: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: Color.cam },
  currentUserCard: { borderColor: Color.main, backgroundColor: '#F0FDF4', marginBottom: 0, borderWidth: 2 },
});