import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SpeakerHighIcon, XIcon } from 'phosphor-react-native';

import LessonService from '@/api/services/lesson.service';
import { HangulCharacter } from '@/api/types/lesson.types';
import Button from '../../../../components/Button';
import HangulCompleteModal from '../../../../components/Modals/HangulCompleteModal';
import HangulPracticeCanvas from '../../../../components/Modals/HangulPracticeCanvas';
import HangulTracingGlyph from '../../../../components/Modals/HangulTracingGlyph';
import {
  HANGUL_WRITING_SEQUENCE,
  getHangulWritingItemAt,
  getHangulWritingIndex,
} from '../../../../components/Modals/hangulWritingSequence';
import { Border, FontFamily, FontSize, Gap, Padding } from '../../../../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

const WritingPracticeScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const router = useRouter();
  const params = useLocalSearchParams<{
    lessonId?: string;
    glyph?: string;
    label?: string;
    mode?: string;
    sequenceIndex?: string;
  }>();

  const lessonId = params.lessonId ?? '0';
  const parsedSequenceIndex = Number(params.sequenceIndex);
  const currentIndex = Number.isFinite(parsedSequenceIndex)
    ? Math.max(0, Math.min(parsedSequenceIndex, HANGUL_WRITING_SEQUENCE.length - 1))
    : Math.max(0, getHangulWritingIndex(params.glyph, params.label));
  const currentItem = getHangulWritingItemAt(currentIndex) ?? HANGUL_WRITING_SEQUENCE[0];
  const progress = ((currentIndex + 1) / HANGUL_WRITING_SEQUENCE.length) * 100;

  const [renderSeed, setRenderSeed] = React.useState(0);
  const [canvasResetToken, setCanvasResetToken] = React.useState(0);
  const [showCompleteModal, setShowCompleteModal] = React.useState(false);
  const [hangulItems, setHangulItems] = React.useState<HangulCharacter[]>([]);
  const [resolvedLessonId, setResolvedLessonId] = React.useState(lessonId);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoadingLesson, setIsLoadingLesson] = React.useState(true);

  React.useEffect(() => {
    if (!lessonId) return;

    let isMounted = true;

    const loadLesson = async () => {
      try {
        if (isMounted) setIsLoadingLesson(true);
        let targetLessonId = lessonId;
        let lessonListHangulItems: HangulCharacter[] = [];

        if (targetLessonId === '0') {
          const lessonsResponse = await LessonService.getAll({ limit: 50 });
          const hangulLesson = lessonsResponse.data?.lessons?.find((lesson) => lesson.lessonType === 'hangul');
          if (!hangulLesson?._id) return;
          targetLessonId = hangulLesson._id;
          lessonListHangulItems = hangulLesson.hangul ?? [];
        }

        await LessonService.start(targetLessonId);
        const modulesResponse = await LessonService.getModules(targetLessonId);
        let items = [...(modulesResponse.data?.hangul ?? [])].sort((a, b) => a.order - b.order);

        if (items.length === 0) {
          if (lessonListHangulItems.length === 0) {
            const lessonsResponse = await LessonService.getAll({ limit: 50 });
            const hangulLesson = lessonsResponse.data?.lessons?.find((lesson) => {
              return lesson._id === targetLessonId || lesson.lessonType === 'hangul';
            });
            lessonListHangulItems = hangulLesson?.hangul ?? [];
          }

          items = [...lessonListHangulItems].sort((a, b) => a.order - b.order);
        }

        if (isMounted) {
          setResolvedLessonId(targetLessonId);
          setHangulItems(items);
        }
      } catch (error: any) {
        console.warn('Could not load Hangul lesson progress:', error.response?.data || error.message);
      } finally {
        if (isMounted) setIsLoadingLesson(false);
      }
    };

    loadLesson();

    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  const handleClose = React.useCallback(() => {
    router.back();
  }, [router]);

  const handleReset = React.useCallback(() => {
    setCanvasResetToken((value) => value + 1);
  }, []);

  const handleReplayGlyph = React.useCallback(() => {
    setRenderSeed((value) => value + 1);
  }, []);

  const markCurrentItemCompleted = React.useCallback(async () => {
    const currentHangulItem =
      hangulItems.find((item) => item.label === currentItem.label)
      ?? hangulItems.find((item) => item.glyph === currentItem.glyph && item.order === currentIndex + 1)
      ?? hangulItems[currentIndex];

    if (!resolvedLessonId || resolvedLessonId === '0' || !currentHangulItem?._id) {
      console.warn('Missing real Hangul lessonId/itemId for saving progress', {
        lessonId: resolvedLessonId,
        currentIndex,
        currentItem,
        loadedItems: hangulItems.length,
      });
      return false;
    }

    await LessonService.updateSectionProgress(resolvedLessonId, 'hangul', currentHangulItem._id, {
      moduleType: 'hangul',
      status: 'completed',
      score: 100,
      maxScore: 100,
      percentage: 100,
      resultKind: 'Manual',
      breakdown: {
        glyph: currentItem.glyph,
        label: currentItem.label,
        sequenceIndex: currentIndex,
      },
      title: currentItem.label,
    });
    return true;
  }, [currentIndex, currentItem, hangulItems, resolvedLessonId]);

  const handleNext = React.useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    let didSave = false;
    try {
      didSave = await markCurrentItemCompleted();
    } catch (error: any) {
      console.warn('Could not save Hangul progress:', error.response?.data || error.message);
    } finally {
      setIsSaving(false);
    }

    if (!didSave) return;

    const nextItem = HANGUL_WRITING_SEQUENCE[currentIndex + 1];

    if (!nextItem) {
      if (resolvedLessonId && resolvedLessonId !== '0') {
        try {
          await LessonService.complete(resolvedLessonId);
        } catch (error: any) {
          console.warn('Could not complete Hangul lesson:', error.response?.data || error.message);
        }
      }
      setShowCompleteModal(true);
      return;
    }

    router.replace({
      pathname: '/lessons/[lessonId]/writing/practiceHangul',
      params: {
        lessonId: resolvedLessonId,
        glyph: nextItem.glyph,
        label: nextItem.label,
        mode: params.mode ?? 'sequence',
        sequenceIndex: String(currentIndex + 1),
      },
    });
  }, [currentIndex, isSaving, markCurrentItemCompleted, params.mode, resolvedLessonId, router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <XIcon size={24} color={colors.textSecondary} weight="bold" />
          </Pressable>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.content}>
          <Pressable style={styles.letterCard} onPress={handleReplayGlyph}>
            <Text style={styles.letterLabel}>{currentItem.label}</Text>

            <Pressable style={styles.speakerButton}>
              <SpeakerHighIcon size={20} color={colors.textPrimary} weight="regular" />
            </Pressable>
          </Pressable>

          <View style={styles.glyphWrap}>
            <HangulTracingGlyph key={`${currentItem.glyph}-${renderSeed}`} glyph={currentItem.glyph} baseDelayMs={0} />
          </View>

          <View style={styles.practiceCard}>
            <View style={styles.practiceHeader}>
              <Text style={styles.practiceTitle}>Ô luyện viết</Text>
            </View>
            <HangulPracticeCanvas glyph={currentItem.glyph} resetToken={canvasResetToken} />
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Xóa, viết lại"
            variant="Orange"
            onPress={handleReset}
            style={styles.resetButton}
          />

          <Button
            title={isLoadingLesson ? 'Đang tải...' : currentIndex === HANGUL_WRITING_SEQUENCE.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
            onPress={handleNext}
            disabled={isSaving || isLoadingLesson || resolvedLessonId === '0' || hangulItems.length === 0}
            style={styles.nextButton}
          />
        </View>
      </View>

      <HangulCompleteModal
        visible={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          router.replace('/(tabs)');
        }}
      />
    </SafeAreaView>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
    paddingBottom: Padding.padding_10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#A3A3A3',
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 24,
    gap: Gap.gap_20,
  },
  letterCard: {
    borderWidth: 1,
    borderColor: '#D6DFEA',
    borderRadius: Border.br_20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Gap.gap_10,
  },
  letterLabel: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: '#63B900',
  },
  speakerButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
  },
  practiceCard: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#E9E9E9',
  },
  practiceHeader: {
    backgroundColor: colors.vang,
    paddingVertical: 12,
    alignItems: 'center',
  },
  practiceTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: colors.textPrimary,
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: Padding.padding_30,
    gap: Gap.gap_10,
  },
  resetButton: {
    marginVertical: 0,
  },
  nextButton: {
    marginVertical: 0,
  },
});

export default WritingPracticeScreen;
