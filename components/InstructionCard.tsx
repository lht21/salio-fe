import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StarFourIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Gap } from '../constants/GlobalStyles';
import { WritingItem } from '../api/types/lesson.types';

interface InstructionCardProps {
  data: WritingItem | null;
  onStart?: () => void;
  isModal?: boolean;
}

export default function InstructionCard({ data, onStart, isModal }: InstructionCardProps) {
  if (!data) return null;

  return (
    <View style={[styles.cardContainer, isModal && styles.cardModal]}>
      <View style={styles.headerRow}>
        <StarFourIcon size={24} color={Color.main} weight="fill" />
        <Text style={styles.title}>{data.title}</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
        <Text style={[styles.summaryText, { marginBottom: Gap.gap_15 }]}>
          Đề bài: {data.prompt}
        </Text>

        {data.instruction && (
          <>
            <Text style={styles.sectionTitle}>Yêu cầu</Text>
            <Text style={styles.bodyText}>{data.instruction}</Text>
          </>
        )}

        {data.hints?.grammar && data.hints.grammar.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Ngữ pháp nên dùng</Text>
            <Text style={styles.bodyText}>
              {data.hints.grammar.map(g => `• ${g}`).join('\n')}
            </Text>
          </>
        )}

        {data.hints?.vocabulary && data.hints.vocabulary.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Trường từ vựng</Text>
            <Text style={styles.bodyText}>
              {data.hints.vocabulary.map(v => `• ${v}`).join('\n')}
            </Text>
          </>
        )}

        {!isModal && onStart && (
          <TouchableOpacity style={styles.startButton} onPress={onStart}>
            <Text style={styles.startButtonText}>Bắt đầu viết</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: Color.bg,
    borderRadius: Border.br_30,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardModal: {
    shadowOpacity: 0, // Bỏ bóng đổ nếu nằm trong modal
    elevation: 0,
    padding: 0, // Bỏ padding để modal tự quản lý
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.color,
  },
  summaryText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.color,
    lineHeight: 22,
  },
  scrollArea: { flex: 1 },
  sectionTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
    marginTop: Gap.gap_15,
    marginBottom: Gap.gap_8,
  },
  bodyText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.gray,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: Color.main,
    paddingVertical: 18,
    borderRadius: Border.br_30,
    alignItems: 'center',
    marginTop: 30,
  },
  startButtonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.color,
  },
});