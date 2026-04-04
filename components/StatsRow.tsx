import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FireIcon, BookmarkSimpleIcon, TrophyIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding } from '../constants/GlobalStyles';

const StatsRow = () => {
  return (
    <View style={styles.container}>
      {/* Thẻ 1: Chuỗi ngày */}
      <View style={styles.card}>
        <View style={styles.textWrap}>
          <Text style={styles.number}>15</Text>
          <Text style={styles.label}>ngày</Text>
        </View>
        <FireIcon size={24} color="#991B1B" weight="fill" />
      </View>

      {/* Thẻ 2: Từ vựng */}
      <View style={styles.card}>
        <View style={styles.textWrap}>
          <Text style={styles.number}>124</Text>
          <Text style={styles.label}>từ vựng</Text>
        </View>
        <BookmarkSimpleIcon size={24} color={Color.xanh || '#1877F2'} weight="fill" />
      </View>

      {/* Thẻ 3: Điểm */}
      <View style={styles.card}>
        <View style={styles.textWrap}>
          <Text style={styles.number}>215</Text>
          <Text style={styles.label}>điểm</Text>
        </View>
        <TrophyIcon size={24} color="#D97706" weight="fill" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.padding_15 || 15,
    marginBottom: 20,
    gap: 10,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Color.bg,
    borderWidth: 2,
    borderColor: Color.stroke || '#E2E8F0',
    borderRadius: Border.br_15 || 15,
    paddingVertical: Padding.padding_10 || 10,
    paddingHorizontal: Padding.padding_15 || 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textWrap: {
    flexDirection: 'column',
  },
  number: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20 || 20,
    color: Color.text,
    lineHeight: 22,
  },
  label: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12 || 12,
    color: Color.gray,
  },
});

export default StatsRow;