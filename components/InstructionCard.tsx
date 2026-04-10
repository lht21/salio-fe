import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StarFourIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Padding, Border, Gap } from '../constants/GlobalStyles';

interface InstructionCardProps {
  onStart?: () => void; // Không bắt buộc, vì Modal không cần nút Bắt đầu
  isModal?: boolean; // Để điều chỉnh UI nếu đang nằm trong Modal
}

export default function InstructionCard({ onStart, isModal }: InstructionCardProps) {
  return (
    <View style={[styles.cardContainer, isModal && styles.cardModal]}>
      <View style={styles.headerRow}>
        <StarFourIcon size={24} color={Color.main} weight="fill" />
        <Text style={styles.title}>Chạy theo xu hướng</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
        <Text style={[styles.summaryText, { marginBottom: Gap.gap_15 }]}>
          Đề bài: Hãy viết một bài luận (500-700 chữ) bày tỏ quan điểm của bạn về việc giới trẻ chạy theo xu hướng hiện nay.
        </Text>

        <Text style={styles.sectionTitle}>Câu hỏi gợi ý</Text>
        <Text style={styles.bodyText}>
          1. Tại sao giới trẻ ngày nay lại thích chạy theo xu hướng?{"\n"}
          2. Việc chạy theo xu hướng mang lại lợi ích và tác hại gì?{"\n"}
          3. Quan điểm của bạn về vấn đề này là gì?
        </Text>

        <Text style={styles.sectionTitle}>Ngữ pháp nên dùng</Text>
        <Text style={styles.bodyText}>
          • -(으)ㄹ 뿐만 아니라 (Không những... mà còn){"\n"}
          • -기 마련이다 (Đương nhiên là...){"\n"}
          • -(으)로 인해 (Do, vì...)
        </Text>

        <Text style={styles.sectionTitle}>Trường từ vựng</Text>
        <Text style={styles.bodyText}>
          • 유행을 따르다 (Theo xu hướng){"\n"}
          • 개성을 잃다 (Đánh mất cá tính){"\n"}
          • 소속감 (Cảm giác thuộc về){"\n"}
          • 무분별하다 (Thiếu suy nghĩ, bừa bãi)
        </Text>

        {/* Nút bắt đầu chỉ hiển thị khi ở màn hình Intro (không phải Modal) */}
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
    gap: Gap.gap_10,
    marginBottom: Gap.gap_20,
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