import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CaretRight, SpeakerHigh } from 'phosphor-react-native';
import * as Speech from 'expo-speech';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import IconButton from '../../../../components/IconButton';
import { XIcon } from 'phosphor-react-native';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal';
import { QuizHeader } from '../../../../components/Modals/Question';
import Button from '../../../../components/Button';
import { Border, FontFamily, FontSize, Gap, Padding } from '../../../../constants/GlobalStyles';
import GrammarService from '@/api/services/grammar.service';
import LessonService from '@/api/services/lesson.service';
import type { Grammar } from '@/api/types/grammar.types';
import { useTheme } from "@/contexts/ThemeContext";

function GrammarContent({
  grammar,
  onUnderstand,
  onNeedReview,
  isSubmitting
}: {
  grammar: Grammar;
  onUnderstand: () => void;
  onNeedReview: () => void;
  isSubmitting?: boolean;
}) {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const usageLines = grammar.usage?.split(/\r?\n/).map(line => line.trim()).filter(Boolean) || [];
  const rules = usageLines.length > 0 ? usageLines : grammar.explanation ? [grammar.explanation] : [];

  return (
    <View style={styles.contentContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* HEADER SECTION */}
        <View style={styles.headerCard}>
          <Text style={styles.faceLabel}>Ngữ pháp</Text>
          <Text style={styles.structureText}>{grammar.structure}</Text>
          <View style={styles.meaningPill}>
            <Text style={styles.meaningPillText}>{grammar.meaning}</Text>
          </View>
        </View>

        {/* RULES SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cách dùng</Text>
          <View style={styles.ruleList}>
            {rules.map((rule, idx) => (
              <View key={idx} style={styles.ruleItem}>
                <CaretRight size={16} color={colors.cam} weight="bold" style={{ marginTop: 2 }} />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* EXAMPLES SECTION */}
        {grammar.exampleSentences && grammar.exampleSentences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ví dụ</Text>
            <View style={styles.exampleList}>
              {grammar.exampleSentences.map((ex, idx) => (
                <View key={idx} style={styles.exampleItem}>
                  <View style={styles.exampleTextContainer}>
                    <Text style={styles.exampleKo}>{ex.korean}</Text>
                    <Text style={styles.exampleVi}>{ex.vietnamese}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.speakerButton}
                    onPress={() => {
                      Speech.stop();
                      Speech.speak(ex.korean, { language: 'ko-KR', rate: 0.85, pitch: 1.0 });
                    }}
                  >
                    <SpeakerHigh size={24} color={colors.main} weight="fill" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={styles.footerActions}>
        <Button variant="Green" title="Đã hiểu, Tiếp tục" onPress={onUnderstand} disabled={isSubmitting} />
        <Button 
          variant="TextOnly" 
          title="Cần xem lại sau" 
          onPress={onNeedReview} 
          disabled={isSubmitting}
          textStyle={{ color: colors.gray, textDecorationLine: 'underline' }}
        />
      </View>
    </View>
  );
}

export default function GrammarDetailScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const router = useRouter();
  const { lessonId } = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadGrammar = async () => {
      const lessonIdValue = String(lessonId ?? '');
      if (!lessonIdValue) {
        setErrorMessage('Không tìm thấy lessonId.');
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const grammarsData = await GrammarService.getLessonGrammar(lessonIdValue);
        setGrammars(grammarsData);
        setCurrentIndex(0);
      } catch (error: any) {
        setErrorMessage(error?.response?.data?.message || error?.message || 'Lỗi khi tải nội dung ngữ pháp.');
      } finally {
        setIsLoading(false);
      }
    };

    loadGrammar();
  }, [lessonId]);

  const totalGrammars = grammars.length;
  const currentGrammar = grammars[currentIndex];

  const handleClose = () => {
    if (currentIndex > 0) {
      setShowExitModal(true);
      return;
    }
    router.back();
  };

  const handleNextGrammar = () => {
    if (currentIndex < totalGrammars - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }
    router.replace(`/lessons/${lessonId}/grammar/exercise` as any);
  };

  const handleUnderstand = async () => {
    if (isSubmitting) return;
    const grammarId = currentGrammar?._id || (currentGrammar as any)?.id;
    if (!grammarId) return handleNextGrammar();

    setIsSubmitting(true);

    try {
      if (LessonService.updateSectionProgress) {
        await LessonService.updateSectionProgress(String(lessonId), 'grammar', grammarId, {
          status: 'completed',
          percentage: 100,
          title: currentGrammar.structure
        });
      }
    } catch (error: any) {
      console.error("Lỗi cập nhật trạng thái completed ngữ pháp:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
      handleNextGrammar();
    }
  };

  const handleNeedReview = async () => {
    if (isSubmitting) return;
    const grammarId = currentGrammar?._id || (currentGrammar as any)?.id;
    if (!grammarId) return handleNextGrammar();

    setIsSubmitting(true);

    try {
      if (LessonService.updateSectionProgress) {
        await LessonService.updateSectionProgress(String(lessonId), 'grammar', grammarId, {
          status: 'learning',
          percentage: 50,
          title: currentGrammar.structure
        });
      }
    } catch (error: any) {
      console.error("Lỗi cập nhật trạng thái learning ngữ pháp:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
      handleNextGrammar();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <QuizHeader
        current={currentIndex + 1}
        total={Math.max(totalGrammars, 1)}
        incorrectCount={0}
        onClose={handleClose}
      />

      <View style={styles.mainArea}>
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.main} />
            <Text style={styles.loadingText}>Đang tải ngữ pháp...</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : totalGrammars > 0 && currentGrammar ? (
          <GrammarContent
            key={currentGrammar._id}
            grammar={currentGrammar}
            onUnderstand={handleUnderstand}
            onNeedReview={handleNeedReview}
            isSubmitting={isSubmitting}
          />
        ) : (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>Không có nội dung ngữ pháp cho bài này.</Text>
          </View>
        )}
      </View>

      <ConfirmModal
        isVisible={showExitModal}
        title="Đang học ngữ pháp"
        subtitle="Bạn đang học bài này, nếu thoát bây giờ thì tiến độ sẽ dừng lại."
        cancelText="Thoát"
        confirmText="Học tiếp"
        onCancel={() => {
          setShowExitModal(false);
          router.back();
        }}
        onConfirm={() => setShowExitModal(false)}
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: colors.bg,
      },

      mainArea: {
        flex: 1,
      },
      centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Padding.padding_20,
      },
      loadingText: {
        marginTop: Gap.gap_12,
        color: colors.text,
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_16,
      },
      errorText: {
        textAlign: 'center',
        color: colors.main,
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_16,
      },
      emptyText: {
        textAlign: 'center',
        color: colors.text,
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_16,
      },

      // Grammar Content Styles
      contentContainer: {
        flex: 1,
      },
      scrollContent: {
        paddingHorizontal: Padding.padding_20,
        paddingBottom: 40,
      },
      headerCard: {
        backgroundColor: '#C8ED6A',
        paddingHorizontal: 24,
        paddingVertical: 32,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
      },
      faceLabel: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_14,
        color: '#487431',
        marginBottom: 12,
      },
      structureText: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: 32,
        lineHeight: 40,
        color: colors.text,
        textAlign: 'center',
        marginBottom: 16,
      },
      meaningPill: {
        backgroundColor: '#215B33',
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 8,
      },
      meaningPillText: {
        color: '#FFFFFF',
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_14,
      },
      section: {
        marginBottom: 30,
      },
      sectionTitle: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: 20,
        color: colors.text,
        marginBottom: 16,
      },
      ruleList: {
        gap: 12,
      },
      ruleItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: '#F5F8EA',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
      },
      ruleText: {
        flex: 1,
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_16,
        lineHeight: 22,
        color: colors.text,
      },
      exampleList: {
        gap: 12,
      },
      exampleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: colors.stroke,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 16,
      },
      exampleTextContainer: {
        flex: 1,
        paddingRight: 12,
      },
      exampleKo: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: 18,
        color: colors.text,
        marginBottom: 6,
      },
      exampleVi: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_16,
        color: colors.gray,
      },
      speakerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F0F9EA',
        justifyContent: 'center',
        alignItems: 'center',
      },
      footerActions: {
        paddingHorizontal: Padding.padding_20,
        paddingVertical: Padding.padding_20,
        borderTopWidth: 1,
        borderTopColor: colors.stroke,
        backgroundColor: colors.bg,
      },
    });
