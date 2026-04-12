import { BookmarkSimpleIcon, FireIcon, TrophyIcon } from 'phosphor-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Border, Color, FontFamily, FontSize, Padding } from '../constants/GlobalStyles';

type StatsRowProps = {
  onScorePress?: () => void;
  onStreakPress?: () => void;
};

const StatsRow = ({ onScorePress, onStreakPress }: StatsRowProps) => {
  return (
    <View style={styles.container}>
      {/* Thẻ 1: Chuỗi ngày */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.82}
        onPress={onStreakPress}
        disabled={!onStreakPress}
      >
        <View style={styles.textWrap}>
          <Text style={styles.number}>15</Text>
          <Text style={styles.label}>ngày</Text>
        </View>
        <FireIcon size={24} color="#991B1B" weight="fill" />
      </TouchableOpacity>

      {/* Thẻ 2: Từ vựng */}
      <View style={styles.card}>
        <View style={styles.textWrap}>
          <Text style={styles.number}>124</Text>
          <Text style={styles.label}>từ vựng</Text>
        </View>
        <BookmarkSimpleIcon size={24} color={Color.xanh || '#1877F2'} weight="fill" />
      </View>

      {/* Thẻ 3: Điểm */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.82}
        onPress={onScorePress}
        disabled={!onScorePress}
      >
        <View style={styles.textWrap}>
          <Text style={styles.number}>215</Text>
          <Text style={styles.label}>điểm</Text>
        </View>
        <TrophyIcon size={24} color="#D97706" weight="fill" />
      </TouchableOpacity>
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