import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'phosphor-react-native';

import Button from '../../../../components/Button';
import { Border, Color, FontFamily, FontSize, Gap } from '../../../../constants/GlobalStyles';

const explanationSections = [
  {
    id: 'pronunciation',
    title: 'Phát âm - 90%',
    description: 'Bạn đọc rõ âm tiết và phần lớn từ vựng được phát âm đúng. Tiếp tục giữ nhịp nói chậm và rõ như hiện tại.',
  },
  {
    id: 'intonation',
    title: 'Ngữ điệu - 70%',
    description: 'Ngữ điệu đã có lên xuống, nhưng một vài câu hỏi và câu giới thiệu vẫn chưa tự nhiên. Hãy nghe mẫu rồi lặp lại theo cụm ngắn.',
  },
  {
    id: 'accuracy',
    title: 'Độ chính xác - 30%',
    description: 'Bạn đã nhầm ở một số từ khóa và câu trả lời chưa khớp hoàn toàn với mẫu. Nên tập trung vào các cụm có sẵn trong bài rồi mới mở rộng thêm.',
  },
  {
    id: 'fluency',
    title: 'Độ lưu loát - 90%',
    description: 'Tốc độ nói khá ổn và ít bị ngắt quãng. Đây là điểm mạnh của bạn trong bài speaking này.',
  },
];

export default function SpeakingExplanationScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const resolvedLessonId = lessonId ?? '1';

  return (
    <LinearGradient colors={['#FFF7E8', '#FFFFFF', '#FFFFFF']} style={styles.gradientScreen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeftIcon size={22} color={Color.text} weight="bold" />
          </Pressable>

          <Text style={styles.heading}>Giải thích bài nói</Text>
          <Text style={styles.subheading}>
            Đây là nhận xét tổng quan để bạn biết cần cải thiện phần nào sau khi hoàn thành bài speaking.
          </Text>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {explanationSections.map((section) => (
              <View key={section.id} style={styles.card}>
                <Text style={styles.cardTitle}>{section.title}</Text>
                <Text style={styles.cardText}>{section.description}</Text>
              </View>
            ))}
          </ScrollView>

          <Button
            title="Làm lại bài nói"
            onPress={() => router.replace(`/lessons/${resolvedLessonId}/speaking/practice` as any)}
            style={styles.primaryButton}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientScreen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  heading: {
    marginTop: 16,
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 24,
    color: Color.cam,
  },
  subheading: {
    marginTop: 8,
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    lineHeight: 22,
    color: Color.text,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
    gap: Gap.gap_14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Border.br_20,
    padding: 16,
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  cardText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    lineHeight: 22,
    color: '#666666',
  },
  primaryButton: {
    marginVertical: 0,
    borderRadius: Border.br_30,
  },
});
