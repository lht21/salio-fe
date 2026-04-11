import { BookmarkSimpleIcon, SpeakerSimpleHighIcon } from 'phosphor-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../constants/GlobalStyles';

interface Props {
  item: {
    id: string;
    word: string;
    pos: string;
    phonetic: string;
    meaning: string;
    isFavorite?: boolean;
  };
  onToggleFavorite?: () => void;
}

const VocabularyCard = ({ item, onToggleFavorite }: Props) => {
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
        <TouchableOpacity
          onPress={onToggleFavorite}
          style={styles.favoriteButton}
          activeOpacity={0.85}
        >
          <BookmarkSimpleIcon
            size={24}
            color={item.isFavorite ? (Color.colorLimegreen || '#22C55E') : Color.text}
            weight={item.isFavorite ? 'fill' : 'regular'}
          />
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
  favoriteButton: {
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VocabularyCard;