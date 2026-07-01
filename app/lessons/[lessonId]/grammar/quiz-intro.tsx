import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FontFamily, FontSize, Padding, Border, Gap } from '../../../../constants/GlobalStyles';
import Button from '../../../../components/Button';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';
import IconButton from '../../../../components/IconButton';
import { XIcon } from 'phosphor-react-native';
import { useTheme } from "@/contexts/ThemeContext";

export default function GrammarQuizIntroScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const router = useRouter();
  const { lessonId } = useLocalSearchParams();
  const [showExitModal, setShowExitModal] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <IconButton Icon={XIcon} onPress={() => setShowExitModal(true)} />

      </View>

      <View style={styles.content}>
        <Image
          source={require('../../../../assets/images/horani/intro-grammar.jpeg')}
          style={styles.illustration}
          resizeMode="contain"
        />

        <View style={styles.titleRow}>
          <Text style={styles.roundText}>Vòng 4</Text>
          <Text style={styles.titleText}>Quiz Ngữ Pháp</Text>
        </View>

        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>
            Bạn đã luyện tập rất tốt! Giờ là lúc kiểm tra lại toàn bộ cấu trúc ngữ pháp trong bài học này bằng các câu hỏi trắc nghiệm.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Bắt đầu Quiz"
          variant="Green"
          onPress={() => router.push({
            pathname: '/lessons/[lessonId]/grammar/quiz',
            params: { lessonId: String(lessonId) }
          })}
        />
      </View>

      <ConfirmModal
        isVisible={showExitModal}
        title="Dừng học sao?"
        subtitle="Bạn đã đi tới đây rồi, làm nốt bài Quiz này nhé!"
        cancelText="Thoát"
        confirmText="Làm tiếp"
        onCancel={() => router.back()}
        onConfirm={() => setShowExitModal(false)}
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'flex-end', paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_10 },
  content: { flex: 1, paddingHorizontal: Padding.padding_20, justifyContent: 'center', alignItems: 'center' },
  illustration: { width: 250, height: 250, marginBottom: 40 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: Gap.gap_20 },
  roundText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_20, color: colors.textPrimary },
  titleText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_20, color: colors.cam },
  descriptionBox: { width: '100%', backgroundColor: colors.primaryLight, padding: Padding.padding_20, borderRadius: Border.br_20, borderWidth: 1.5, borderColor: colors.primary, borderStyle: 'dashed', alignItems: 'center' },
  descriptionText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.textPrimary, textAlign: 'center', lineHeight: 22 },
  footer: { paddingHorizontal: Padding.padding_15, paddingBottom: Padding.padding_30 },
});