import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CardsIcon, ListChecksIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../constants/GlobalStyles';

const FlashcardSetCard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BỘ DU LỊCH</Text>
      <View style={styles.subtitleRow}>
        <Text style={styles.subtitle}>Bạn đã lưu </Text>
        <Text style={styles.countText}>16</Text>
        <Text style={styles.subtitle}> từ vựng</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.button}>
          <CardsIcon size={20} color={Color.bg} weight="fill" />
          <Text style={styles.buttonText}>Chế độ Flashcard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <ListChecksIcon size={20} color={Color.bg} weight="bold" />
          <Text style={styles.buttonText}>Chế độ Trắc nghiệm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.vang,
    borderRadius: Border.br_20,
    padding: Padding.padding_15 || 15,
    marginBottom: 24,
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
    flexDirection: 'row',
    backgroundColor: Color.colorDarkslategray300 || '#2D2D2D',
    borderRadius: Border.br_15,
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