import { CardsIcon, ListChecksIcon } from 'phosphor-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../constants/GlobalStyles';

interface FlashcardSetCardProps {
  title: string;
  totalWords: number;
  backgroundColor?: string;
  onPress?: () => void;
}

const FlashcardSetCard = ({ title, totalWords, backgroundColor, onPress }: FlashcardSetCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, backgroundColor ? { backgroundColor } : null]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.title}>{title}</Text>
      <View style={styles.subtitleRow}>
        <Text style={styles.subtitle}>Bạn đã lưu </Text>
        <Text style={styles.countText}>{totalWords}</Text>
        <Text style={styles.subtitle}> từ vựng</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.button}>
          <CardsIcon size={20} color={Color.bg} weight="fill" />
          <Text
            style={styles.buttonText}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            Chế độ Flashcard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <ListChecksIcon size={20} color={Color.bg} weight="bold" />
          <Text
            style={styles.buttonText}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            Chế độ Trắc nghiệm
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.vang,
    borderRadius: Border.br_20,
    padding: Padding.padding_15 || 15,
    marginBottom: 24,
    width: 300, // Thêm chiều rộng cố định để các thẻ hiển thị đẹp khi trượt ngang
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20 || 20,
    color: Color.text,
    marginBottom: Gap.gap_8,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Gap.gap_20,
  },
  subtitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.gray,
  },
  countText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: Color.text,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Gap.gap_10 || 10,
  },
  button: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    backgroundColor: Color.colorDarkslategray300 || '#2D2D2D',
    borderRadius: Border.br_15,
    paddingHorizontal: Padding.padding_10 || 10,
    paddingVertical: Padding.padding_11,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Gap.gap_5,
  },
  buttonText: {
    flexShrink: 1,
    color: Color.bg,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 14,
  },
});

export default FlashcardSetCard;