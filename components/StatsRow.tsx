import { BookmarkSimpleIcon, FireIcon, TrophyIcon, CertificateIcon, CloudIcon, CaretRightIcon } from 'phosphor-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Border, Color, FontFamily, FontSize, Padding } from '../constants/GlobalStyles';

type StatsRowProps = {
  onScorePress?: () => void;
  onStreakPress?: () => void;
  streak?: number;
  vocabCount?: number;
  score?: number;
  certificates?: number;
  clouds?: number;
};

const StatsRow = ({ onScorePress, onStreakPress, streak = 0, vocabCount = 0, score = 0, certificates = 0, clouds = 0 }: StatsRowProps) => {
  return (
    <View style={styles.container}>
      {/* Hàng 1 */}
      <View style={styles.row}>
        {/* Thẻ 1: Chuỗi ngày */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.82}
          onPress={onStreakPress}
          disabled={!onStreakPress}
        >
          <View style={styles.textWrap}>
            <Text style={styles.number}>{streak}</Text>
            <View style={styles.labelRow}>
              <Text style={styles.label}>ngày</Text>
              <CaretRightIcon size={12} color={Color.main2} weight="bold" />
            </View>
          </View>
          <FireIcon size={24} color="#991B1B" weight="fill" />
        </TouchableOpacity>

        {/* Thẻ 2: Từ vựng */}
        <View style={styles.card}>
          <View style={styles.textWrap}>
            <Text style={styles.number}>{vocabCount}</Text>
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
            <Text style={styles.number}>{score}</Text>
            <View style={styles.labelRow}>
              <Text style={styles.label}>điểm</Text>
              <CaretRightIcon size={12} color={Color.main2} weight="bold" />
            </View>
          </View>
          <TrophyIcon size={24} color="#D97706" weight="fill" />
        </TouchableOpacity>
      </View>

      {/* Hàng 2 */}
      <View style={styles.row}>
        {/* Thẻ 4: Chứng chỉ */}
        <TouchableOpacity style={styles.card} activeOpacity={0.82}>
          <View style={styles.textWrap}>
            <Text style={styles.number}>{certificates}</Text>
            <Text style={styles.label}>chứng chỉ</Text>
          </View>
          <CertificateIcon size={24} color={Color.main2} weight="fill" />
        </TouchableOpacity>

        {/* Thẻ 5: Đám mây */}
        <TouchableOpacity style={styles.card} activeOpacity={0.82}>
          <View style={styles.textWrap}>
            <Text style={styles.number}>{clouds}</Text>
            <Text style={styles.label}>đám mây</Text>
          </View>
          <CloudIcon size={24} color={Color.main2} weight="fill" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginBottom: 20,
    gap: 10,
    width: '100%', // Đảm bảo container chiếm trọn không gian ngang
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: Padding.padding_15 || 15, // Chuyển lề vào đây để các thẻ cách mép một chút
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});

export default StatsRow;