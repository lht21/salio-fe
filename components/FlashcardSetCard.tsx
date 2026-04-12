import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { CardsIcon, ListChecksIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';

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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionRow}>
        <TouchableOpacity style={styles.button}>
          <CardsIcon size={20} color={Color.bg} weight="fill" />
          <Text style={styles.buttonText}>Chế độ Flashcard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <ListChecksIcon size={20} color={Color.bg} weight="bold" />
          <Text style={styles.buttonText}>Chế độ Trắc nghiệm</Text>
        </TouchableOpacity>
      </ScrollView>
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
    flexDirection: 'row',
    backgroundColor: Color.colorDarkslategray300 || '#2D2D2D',
    borderRadius: Border.br_15,
    paddingHorizontal: Padding.padding_15 || 15,
    paddingVertical: Padding.padding_11,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Gap.gap_5,
  },
  buttonText: {
    color: Color.bg,
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 12,
  },
});

export default FlashcardSetCard;