import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CrownIcon } from 'phosphor-react-native';

// Import Design System & Components
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import CloseButton from '../CloseButton';
import Button from '../Button';
import ZenmodeBanner from '../ExamComponent/ZenmodeBanner';

const WritingIntroView = ({ data, onStart, onExit, isStarting, isZenmodeEnabled, onToggleZenmode }: any) => {
  const timeMinutes = data?.timeLimit ? Math.floor(data.timeLimit / 60) : 50;
  const wordMin = data?.wordLimit?.min || 0;
  const wordMax = data?.wordLimit?.max || 700;

  return (
    <View style={styles.viewContainer}>
      <View style={styles.header}>
        <CloseButton variant="Stroke" onPress={onExit} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          {data?.isPremium && (
            <View style={styles.premiumBadge}>
              <CrownIcon size={14} color={Color.bg} weight="fill" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
          <Text style={styles.examTitle}>{data?.title || 'Luyện viết'}</Text>
        </View>

        <ZenmodeBanner isEnabled={isZenmodeEnabled} onToggle={onToggleZenmode} />

        {data?.prompt && (
          <View style={styles.promptCard}>
            <Text style={styles.promptText}>{data.prompt}</Text>
          </View>
        )}

        {data?.instruction && (
          <Text style={styles.instructionText}>{data.instruction}</Text>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Thông tin làm bài:</Text>
          <View style={styles.skillsList}>
            <View style={styles.skillItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.skillText}>Thể loại: {data?.type === 'essay_writing' ? 'Viết luận' : 'Biểu đồ/Tự do'}</Text>
            </View>
            <View style={styles.skillItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.skillText}>Thời gian: {timeMinutes} phút</Text>
            </View>
            <View style={styles.skillItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.skillText}>Giới hạn từ: {wordMin} - {wordMax} chữ</Text>
            </View>
          </View>
        </View>

        {data?.hints && (
          <View style={styles.hintsContainer}>
            <Text style={styles.hintsMainTitle}>Gợi ý làm bài:</Text>

            {data.hints.vocabulary && data.hints.vocabulary.length > 0 && (
              <View style={styles.hintBlock}>
                <Text style={styles.hintSubTitle}>Từ vựng</Text>
                <View style={styles.tagsContainer}>
                  {data.hints.vocabulary.map((v: string, idx: number) => (
                    <View key={idx} style={styles.tagPill}>
                      <Text style={styles.tagText}>{v}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {data.hints.grammar && data.hints.grammar.length > 0 && (
              <View style={styles.hintBlock}>
                <Text style={styles.hintSubTitle}>Ngữ pháp</Text>
                <View style={styles.tagsContainer}>
                  {data.hints.grammar.map((g: string, idx: number) => (
                    <View key={idx} style={styles.tagPill}>
                      <Text style={styles.tagText}>{g}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {data.hints.outline && (
              <View style={styles.hintBlock}>
                <Text style={styles.hintSubTitle}>Dàn ý</Text>
                <Text style={styles.outlineText}>{data.hints.outline}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.readyText}>Bạn đã sẵn sàng chưa?</Text>
        <Button
          title={isStarting ? "Đang xử lý..." : "Bắt đầu viết"}
          variant="Green"
          onPress={onStart}
          style={{ width: '100%', opacity: isStarting ? 0.7 : 1 }}
          disabled={isStarting}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: { flex: 1 },
  header: { alignItems: 'flex-end', paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_10 },
  scrollContent: { flexGrow: 1, paddingHorizontal: Padding.padding_20, alignItems: 'center', paddingBottom: 20 },
  titleContainer: { alignItems: 'center', marginBottom: Gap.gap_20, gap: Gap.gap_8 },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Border.br_10, gap: 4 },
  premiumText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_12, color: Color.bg },
  examTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_24, color: Color.text, textAlign: 'center' },
  infoCard: { width: '100%', backgroundColor: '#F8FAFC', borderRadius: Border.br_15, padding: Padding.padding_20, marginBottom: Gap.gap_20, borderWidth: 1, borderColor: Color.stroke },
  infoCardTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text, marginBottom: Gap.gap_15 },
  skillsList: { gap: Gap.gap_10 },
  skillItem: { flexDirection: 'row', alignItems: 'center' },
  bulletPoint: { width: 6, height: 6, borderRadius: 3, backgroundColor: Color.gray, marginRight: Gap.gap_10 },
  skillText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.gray },
  footer: { paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_10, paddingBottom: Padding.padding_30, alignItems: 'center', gap: Gap.gap_10 },
  readyText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.gray },
  
  // --- WRITING UI STYLES ---
  promptCard: { backgroundColor: Color.vang, padding: Padding.padding_15, borderRadius: Border.br_15, marginBottom: Gap.gap_15, width: '100%' },
  promptText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text, textAlign: 'center', lineHeight: 24 },
  instructionText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.gray, marginBottom: Gap.gap_20, textAlign: 'center', fontStyle: 'italic' },
  hintsContainer: { width: '100%', marginTop: Gap.gap_10, alignItems: 'flex-start' },
  hintsMainTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text, marginBottom: Gap.gap_15 },
  hintBlock: { marginBottom: Gap.gap_15, width: '100%' },
  hintSubTitle: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.main2, marginBottom: Gap.gap_8 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Gap.gap_8 },
  tagPill: { backgroundColor: Color.bg, borderWidth: 1, borderColor: Color.stroke, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Border.br_20, alignItems: 'center', justifyContent: 'center' },
  tagText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.text },
  outlineText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.gray,
    lineHeight: 22,
    backgroundColor: '#F8FAFC',
    padding: Padding.padding_15,
    borderRadius: Border.br_10,
    overflow: 'hidden',
  },
});

export default WritingIntroView;