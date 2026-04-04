import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SpeakerSimpleHighIcon, BookmarkSimpleIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';

interface Props {
  item: {
    word: string;
    pos: string;
    phonetic: string;
    meaning: string;
  };
}

const VocabularyCard = ({ item }: Props) => {
  const getBadgeColor = (pos: string) => {
    if (pos === 'Danh từ') return { bg: '#DCFCE7', text: '#15803D' };
    if (pos === 'Động từ') return { bg: '#F3E8FF', text: '#7E22CE' };
    return { bg: '#FFEDD5', text: '#C2410C' };
  };

  const badge = getBadgeColor(item.pos);

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.word}>{item.word}</Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{item.pos}</Text>
          </View>
        </View>
        <Text style={styles.phonetic}>{item.phonetic}</Text>
        <Text style={styles.meaning}>{item.meaning}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity>
          <SpeakerSimpleHighIcon size={24} color={Color.text} weight="regular" />
        </TouchableOpacity>
        <TouchableOpacity>
          <BookmarkSimpleIcon size={24} color={Color.colorLimegreen || '#22C55E'} weight="fill" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Color.bg,
    borderWidth: 1,
    borderColor: Color.stroke,
    borderRadius: Border.br_20,
    padding: Padding.padding_15,
    marginBottom: Gap.gap_15,
    alignItems: 'center',
  },
  content: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  word: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16 || 16, color: Color.text },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Border.br_5 },
  badgeText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 10 },
  phonetic: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: Color.colorDarkgray, marginBottom: 2 },
  meaning: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.color },
  actions: { flexDirection: 'row', gap: Gap.gap_15 || 15 },
});

export default VocabularyCard;