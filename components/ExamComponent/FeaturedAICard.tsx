import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SparkleIcon } from 'phosphor-react-native';
import { FontFamily, FontSize, Padding, Border } from '../../constants/GlobalStyles';
import Button from '../Button';
import { useTheme } from "@/contexts/ThemeContext";

interface FeaturedAICardProps {
  onPress: () => void;
}

export default function FeaturedAICard({ onPress }: FeaturedAICardProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.aiCard}>
      <View style={styles.aiCardHeader}>
        <SparkleIcon size={20} color={colors.cam} weight="fill" />
        <Text style={styles.aiCardLabel}>Tổng hợp từ AI</Text>
      </View>
      <View style={styles.aiCardBody}>
        <View style={styles.aiCardTextContent}>
          <Text style={styles.aiCardTitle}>Đề tổng hợp dành riêng cho bạn</Text>
          <Text style={styles.aiCardDesc}>Luyện tập theo trình độ của bạn</Text>
        </View>
        <Text style={styles.aiCardHashtag}>#</Text>
      </View>
      <Button
        title="Luyện tập"
        variant="Green"
        onPress={onPress}
        style={{ marginTop: 16 }}
      />
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  aiCard: { backgroundColor: colors.background, borderRadius: Border.br_20, padding: Padding.padding_15, borderWidth: 1.5, borderColor: colors.borderDefault },
  aiCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  aiCardLabel: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: colors.textSecondary },
  aiCardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aiCardTextContent: { flex: 1 },
  aiCardTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.textPrimary, marginBottom: 4 },
  aiCardDesc: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: colors.textSecondary },
  aiCardHashtag: { fontFamily: FontFamily.lexendDecaBold, fontSize: 80, color: '#E2E8F0' },
});