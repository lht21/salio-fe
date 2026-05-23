import React, { forwardRef, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  BookOpenTextIcon,
  CaretRightIcon,
  HeadphonesIcon,
  MicrophoneStageIcon,
  PenNibStraightIcon,
  SpeakerHighIcon,
} from 'phosphor-react-native';

import Button from '../Button';
import HangulLessonContent from './HangulLessonContent';
import { closeLessonBottomSheet } from './lessonBottomSheetBus';
import LessonSectionAccordion, { LessonSectionDetailItem } from './LessonSectionAccordion';
import LessonService from '../../api/services/lesson.service';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';

type LessonBottomSheetProps = {
  lessonId: string;
  unit: string;
  title: string;
  lessonType?: 'standard' | 'hangul';
  hangul?: Array<{
    _id: string;
    glyph: string;
    label: string;
    order: number;
    group: string;
    romanization?: string;
  }>;
  onClose?: () => void;
  initialIndex?: number;
};

type LessonSectionConfig = {
  id: string;
  title: string;
  subtitle: string;
  progressText: string;
  progressValue: number;
  progressColor: string;
  progressTrackColor?: string;
  backgroundColor?: string;
  expandable?: boolean;
  initiallyExpanded?: boolean;
  icon: React.ReactNode;
  details?: LessonSectionDetailItem[];
  footerBadges?: string[];
};

type ModuleItem = Record<string, any> & { _id?: string };

type ProgressSection = {
  isUnlocked?: boolean;
  progress?: number;
  totalItems?: number;
  completedCount?: number;
  items?: Array<{
    itemId?: string | { _id?: string };
    status?: 'locked' | 'learning' | 'completed';
  }>;
};

type LessonModulesData = {
  lessonType?: 'standard' | 'hangul';
  vocabulary?: ModuleItem[];
  vocabularyQuizzes?: ModuleItem[];
  grammar?: ModuleItem[];
  grammarQuizzes?: ModuleItem[];
  listening?: ModuleItem[];
  speaking?: ModuleItem[];
  reading?: ModuleItem[];
  writing?: ModuleItem[];
  finalTest?: ModuleItem | null;
};

const VOCAB_DETAILS: LessonSectionDetailItem[] = [
  { id: 'voc-1', left: '학생', right: 'Học sinh', status: 'learning' },
  { id: 'voc-2', left: '교사', right: 'Trường học', status: 'done' },
  { id: 'voc-3', left: '친구', right: 'Bạn bè', status: 'todo' },
];

const GRAMMAR_DETAILS: LessonSectionDetailItem[] = [
  { id: 'gr-1', left: '입니다', right: 'là', status: 'done' },
  { id: 'gr-2', left: '이건', right: 'cái này', status: 'done' },
];

const SPEAKING_DETAILS: LessonSectionDetailItem[] = [
  { id: 'sp-1', left: 'Bài 1', right: 'Chào hỏi', status: 'learning' },
  { id: 'sp-2', left: 'Bài 2', right: 'Giới thiệu bản thân', status: 'done' },
  { id: 'sp-3', left: 'Bài 3', right: 'Giới thiệu người khác', status: 'learning' },
];

const LISTENING_DETAILS: LessonSectionDetailItem[] = [
  { id: 'ls-1', left: 'Bài 1', right: 'Nghe chọn bức tranh', status: 'done' },
  { id: 'ls-2', left: 'Bài 2', right: 'Nghe và nối', status: 'done' },
  { id: 'ls-3', left: 'Bài 3', right: 'Nghe và điền từ', status: 'learning' },
];

const READING_DETAILS: LessonSectionDetailItem[] = [
  { id: 'rd-1', left: 'Bài 1', right: 'Đọc và nối tranh', status: 'done' },
  { id: 'rd-2', left: 'Bài 2', right: 'Đọc và đánh dấu X/O', status: 'done' },
];

const WRITING_DETAILS: LessonSectionDetailItem[] = [
  { id: 'wr-1', left: 'Bài 1', right: 'Viết tên quốc gia', status: 'learning' },
  { id: 'wr-2', left: 'Bài 2', right: 'Hoàn thành câu', status: 'done' },
  { id: 'wr-3', left: 'Bài 3', right: 'Viết bài văn giới thiệu về người hàn quốc', status: 'learning' },
];

const LESSON_SECTION_MAP: Record<string, LessonSectionConfig[]> = {
  '1': [
    {
      id: 'intro-vocab',
      title: '15 từ vựng',
      subtitle: 'Từ vựng giới thiệu',
      progressText: 'Đã hoàn thành 100%',
      progressValue: 100,
      progressColor: Color.green,
      progressTrackColor: '#DDF7D8',
      icon: <BookOpenTextIcon size={24} color={Color.main2} weight="fill" />,
      expandable: true,
      initiallyExpanded: true,
      details: VOCAB_DETAILS,
      footerBadges: ['Chưa học', 'Đang học', 'Đã học'],
    },
    {
      id: 'intro-grammar',
      title: '2 ngữ pháp',
      subtitle: 'Từ vựng giới thiệu',
      progressText: 'Đã hoàn thành 100%',
      progressValue: 100,
      progressColor: Color.green,
      progressTrackColor: '#DDF7D8',
      icon: <SpeakerHighIcon size={24} color={Color.main2} weight="fill" />,
      expandable: true,
      initiallyExpanded: true,
      details: GRAMMAR_DETAILS,
      footerBadges: ['Chưa học', 'Đang học', 'Đã học'],
    },
    {
      id: 'intro-speaking',
      title: '3 bài nói',
      subtitle: 'Chào hỏi, giới thiệu bản thân, giới thiệu người khác',
      progressText: 'Đã hoàn thành 100%',
      progressValue: 100,
      progressColor: Color.green,
      progressTrackColor: '#DDF7D8',
      backgroundColor: Color.bg,
      icon: <MicrophoneStageIcon size={24} color={Color.main2} weight="fill" />,
      expandable: true,
      initiallyExpanded: true,
      details: SPEAKING_DETAILS,
      footerBadges: ['Chưa học', 'Đang học', 'Đã học'],
    },
    {
      id: 'intro-listening',
      title: '3 bài nghe',
      subtitle: 'Nghe chọn bức tranh, nghe và nối, nghe và điền từ',
      progressText: 'Đã hoàn thành 100%',
      progressValue: 100,
      progressColor: Color.green,
      progressTrackColor: '#DDF7D8',
      backgroundColor: Color.bg,
      icon: <HeadphonesIcon size={24} color={Color.main2} weight="fill" />,
      expandable: true,
      initiallyExpanded: true,
      details: LISTENING_DETAILS,
      footerBadges: ['Chưa học', 'Đang học', 'Đã học'],
    },
    {
      id: 'intro-reading',
      title: '2 bài đọc',
      subtitle: 'Đọc và nối tranh, đọc và đánh dấu X/O',
      progressText: 'Đã hoàn thành 100%',
      progressValue: 100,
      progressColor: Color.green,
      progressTrackColor: '#DDF7D8',
      backgroundColor: Color.bg,
      icon: <BookOpenTextIcon size={24} color={Color.main2} weight="fill" />,
      expandable: true,
      initiallyExpanded: true,
      details: READING_DETAILS,
      footerBadges: ['Chưa học', 'Đang học', 'Đã học'],
    },
    {
      id: 'intro-writing',
      title: '3 bài viết',
      subtitle: 'Viết tên quốc gia, hoàn thành câu, viết bài văn giới thiệu về người hàn quốc',
      progressText: 'Đã hoàn thành 100%',
      progressValue: 100,
      progressColor: Color.green,
      progressTrackColor: '#DDF7D8',
      backgroundColor: Color.bg,
      icon: <PenNibStraightIcon size={24} color={Color.main2} weight="fill" />,
      expandable: true,
      initiallyExpanded: true,
      details: WRITING_DETAILS,
      footerBadges: ['Chưa học', 'Đang học', 'Đã học'],
    },
  ],
  '2': [
    {
      id: 'intro-vocab',
      title: '15 từ vựng',
      subtitle: 'Từ vựng giới thiệu',
      progressText: 'Đã hoàn thành 100%',
      progressValue: 100,
      progressColor: Color.green,
      progressTrackColor: '#DDF7D8',
      icon: <BookOpenTextIcon size={24} color={Color.main2} weight="fill" />,
      expandable: true,
      initiallyExpanded: true,
      details: VOCAB_DETAILS,
      footerBadges: ['Chưa học', 'Đang học', 'Đã học'],
    },
    {
      id: 'intro-grammar',
      title: '2 ngữ pháp',
      subtitle: 'Từ vựng giới thiệu',
      progressText: 'Đã hoàn thành 100%',
      progressValue: 100,
      progressColor: Color.green,
      progressTrackColor: '#DDF7D8',
      icon: <SpeakerHighIcon size={24} color={Color.main2} weight="fill" />,
      expandable: true,
      initiallyExpanded: true,
      details: GRAMMAR_DETAILS,
      footerBadges: ['Chưa học', 'Đang học', 'Đã học'],
    },
    {
      id: 'intro-speaking',
      title: '5 bài nói',
      subtitle: 'Từ vựng giới thiệu',
      progressText: 'Chưa mở khóa 0%',
      progressValue: 0,
      progressColor: Color.gray,
      backgroundColor: '#F3F4F6',
      icon: <MicrophoneStageIcon size={24} color={Color.main2} weight="fill" />,
    },
    {
      id: 'intro-listening',
      title: '6 bài nghe',
      subtitle: 'Liên quan đến hội thoại địa điểm',
      progressText: 'Chưa mở khóa 0%',
      progressValue: 0,
      progressColor: Color.gray,
      backgroundColor: '#F3F4F6',
      icon: <HeadphonesIcon size={24} color={Color.main2} weight="fill" />,
    },
  ],
};

const DEFAULT_SECTIONS: LessonSectionConfig[] = [
  {
    id: 'default-vocab',
    title: '10 từ vựng',
    subtitle: 'Nội dung bài học',
    progressText: 'Đang học 25%',
    progressValue: 25,
    progressColor: Color.xanh,
    progressTrackColor: '#DBEAFE',
    icon: <BookOpenTextIcon size={24} color={Color.main2} weight="fill" />,
  },
  {
    id: 'default-grammar',
    title: '2 ngữ pháp',
    subtitle: 'Nội dung bài học',
    progressText: 'Chưa mở khóa',
    progressValue: 0,
    progressColor: Color.gray,
    backgroundColor: '#F3F4F6',
    icon: <SpeakerHighIcon size={24} color={Color.main2} weight="fill" />,
  },
];

const getItemId = (item: any) => {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item._id?.toString?.() ?? item.toString?.() ?? '';
};

const getProgressItemStatus = (section: ProgressSection | undefined, itemId: string): LessonSectionDetailItem['status'] => {
  const itemProgress = section?.items?.find((item) => getItemId(item.itemId) === itemId);
  if (itemProgress?.status === 'completed') return 'done';
  if (itemProgress?.status === 'learning') return 'learning';
  return 'todo';
};

const getSectionTone = (section: ProgressSection | undefined) => {
  const progressValue = Math.max(0, Math.min(100, Math.round(section?.progress ?? 0)));
  const isUnlocked = section?.isUnlocked !== false;

  if (!isUnlocked) {
    return {
      progressValue: 0,
      progressText: 'Chưa mở khóa',
      progressColor: Color.gray,
      progressTrackColor: '#E5E7EB',
      backgroundColor: '#F3F4F6',
    };
  }

  if (progressValue >= 100) {
    return {
      progressValue,
      progressText: 'Đã hoàn thành 100%',
      progressColor: Color.green,
      progressTrackColor: '#DDF7D8',
    };
  }

  return {
    progressValue,
    progressText: progressValue > 0 ? `Đang học ${progressValue}%` : 'Chưa học 0%',
    progressColor: progressValue > 0 ? Color.xanh : Color.gray,
    progressTrackColor: progressValue > 0 ? '#DBEAFE' : '#E5E7EB',
  };
};

const buildDetails = (
  items: ModuleItem[],
  section: ProgressSection | undefined,
  leftGetter: (item: ModuleItem, index: number) => string,
  rightGetter: (item: ModuleItem, index: number) => string
): LessonSectionDetailItem[] => {
  return items.map((item, index) => {
    const itemId = getItemId(item);

    return {
      id: itemId || `${index}`,
      left: leftGetter(item, index),
      right: rightGetter(item, index),
      status: getProgressItemStatus(section, itemId),
    };
  });
};

const buildDynamicSections = (modules: LessonModulesData | null, progress: any): LessonSectionConfig[] => {
  if (!modules) return [];

  const progressSections = progress?.sections ?? {};
  const vocabularyItems = [...(modules.vocabulary ?? []), ...(modules.vocabularyQuizzes ?? [])];
  const grammarItems = [...(modules.grammar ?? []), ...(modules.grammarQuizzes ?? [])];
  const configs: LessonSectionConfig[] = [];

  const pushSection = (
    key: string,
    items: ModuleItem[],
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    details: LessonSectionDetailItem[]
  ) => {
    if (items.length === 0) return;
    const tone = getSectionTone(progressSections[key]);

    configs.push({
      id: `intro-${key === 'vocabulary' ? 'vocab' : key}`,
      title,
      subtitle,
      icon,
      expandable: details.length > 0,
      initiallyExpanded: true,
      details,
      footerBadges: ['Chưa học', 'Đang học', 'Đã học'],
      ...tone,
    });
  };

  pushSection(
    'vocabulary',
    vocabularyItems,
    `${vocabularyItems.length} từ vựng`,
    'Từ vựng của bài học',
    <BookOpenTextIcon size={24} color={Color.main2} weight="fill" />,
    buildDetails(
      vocabularyItems.slice(0, 10),
      progressSections.vocabulary,
      (item, index) => item.word ?? item.title ?? `Quiz ${index + 1}`,
      (item) => item.meaning ?? item.description ?? 'Bài luyện từ vựng'
    )
  );

  pushSection(
    'grammar',
    grammarItems,
    `${grammarItems.length} ngữ pháp`,
    'Mẫu câu và điểm ngữ pháp',
    <SpeakerHighIcon size={24} color={Color.main2} weight="fill" />,
    buildDetails(
      grammarItems,
      progressSections.grammar,
      (item, index) => item.structure ?? item.title ?? `Quiz ${index + 1}`,
      (item) => item.meaning ?? item.description ?? 'Bài luyện ngữ pháp'
    )
  );

  pushSection(
    'listening',
    modules.listening ?? [],
    `${modules.listening?.length ?? 0} bài nghe`,
    'Luyện nghe theo ngữ cảnh',
    <HeadphonesIcon size={24} color={Color.main2} weight="fill" />,
    buildDetails(modules.listening ?? [], progressSections.listening, (_, index) => `Bài ${index + 1}`, (item) => item.title ?? 'Bài nghe')
  );

  pushSection(
    'speaking',
    modules.speaking ?? [],
    `${modules.speaking?.length ?? 0} bài nói`,
    'Luyện phát âm và phản xạ nói',
    <MicrophoneStageIcon size={24} color={Color.main2} weight="fill" />,
    buildDetails(modules.speaking ?? [], progressSections.speaking, (_, index) => `Bài ${index + 1}`, (item) => item.title ?? item.prompt ?? 'Bài nói')
  );

  pushSection(
    'reading',
    modules.reading ?? [],
    `${modules.reading?.length ?? 0} bài đọc`,
    'Luyện đọc hiểu',
    <BookOpenTextIcon size={24} color={Color.main2} weight="fill" />,
    buildDetails(modules.reading ?? [], progressSections.reading, (_, index) => `Bài ${index + 1}`, (item) => item.title ?? 'Bài đọc')
  );

  pushSection(
    'writing',
    modules.writing ?? [],
    `${modules.writing?.length ?? 0} bài viết`,
    'Luyện viết câu và đoạn văn',
    <PenNibStraightIcon size={24} color={Color.main2} weight="fill" />,
    buildDetails(modules.writing ?? [], progressSections.writing, (_, index) => `Bài ${index + 1}`, (item) => item.title ?? item.prompt ?? 'Bài viết')
  );

  return configs;
};

const LESSON_META_MAP: Record<string, { progressText: string; progressSegments: string[]; mascot: any }> = {
  '1': {
    progressText: '100% hoàn thành',
    progressSegments: [Color.green, Color.green, Color.green, Color.green, Color.green, Color.green],
    mascot: require('../../assets/images/horani/sc1_b1.png'),
  },
  '2': {
    progressText: '16% hoàn thành',
    progressSegments: [Color.green, Color.xanh, Color.gray, Color.gray, Color.gray, Color.gray],
    mascot: require('../../assets/images/horani/sc1_b1.png'),
  },
};

const LessonBottomSheet = forwardRef<BottomSheet, LessonBottomSheetProps>(
  ({ lessonId, unit, title, lessonType, hangul, onClose, initialIndex = -1 }, ref) => {
    const router = useRouter();
    const isHangulLesson = lessonType === 'hangul' || lessonId === '0';
    const [modules, setModules] = React.useState<LessonModulesData | null>(null);
    const [lessonProgress, setLessonProgress] = React.useState<any>(null);
    const [isLoadingModules, setIsLoadingModules] = React.useState(!isHangulLesson);
    const snapPoints = useMemo(() => [isHangulLesson ? '92%' : '80%'], [isHangulLesson]);
    const sections = useMemo(() => buildDynamicSections(modules, lessonProgress), [modules, lessonProgress]);
    const introRouteMap: Record<string, string> = {
      'intro-vocab': `/lessons/${lessonId}/vocabulary/intro`,
      'intro-grammar': `/lessons/${lessonId}/grammar/intro`,
      'intro-speaking': `/lessons/${lessonId}/speaking/intro`,
      'intro-listening': `/lessons/${lessonId}/listening/intro`,
      'intro-reading': `/lessons/${lessonId}/reading/intro`,
      'intro-writing': `/lessons/${lessonId}/writing/intro`,
    };
    const progressSegments = sections.length > 0
      ? sections.map((section) => section.progressValue >= 100 ? Color.green : section.progressValue > 0 ? Color.xanh : '#E5E7EB')
      : ['#E5E7EB'];
    const overallProgress = Math.round(lessonProgress?.overallProgress ?? (
      sections.length > 0
        ? sections.reduce((sum, section) => sum + section.progressValue, 0) / sections.length
        : 0
    ));
    const meta = LESSON_META_MAP[lessonId] ?? {
      progressText: `${overallProgress}% hoàn thành`,
      progressSegments,
      mascot: require('../../assets/images/horani/sc1_b0.png'),
    };
    const finalTestLocked = !lessonProgress?.finalTestStatus?.isUnlocked;

    React.useEffect(() => {
      if (isHangulLesson || !lessonId || lessonId === '0') return;

      let isMounted = true;

      const loadLessonModules = async () => {
        try {
          setIsLoadingModules(true);
          const [progressResponse, modulesResponse] = await Promise.all([
            LessonService.start(lessonId),
            LessonService.getModules(lessonId),
          ]);

          if (!isMounted) return;
          setLessonProgress(progressResponse.data);
          setModules(modulesResponse.data as unknown as LessonModulesData);
        } catch (error: any) {
          console.warn('Could not load lesson modules:', error.response?.data || error.message);
        } finally {
          if (isMounted) setIsLoadingModules(false);
        }
      };

      loadLessonModules();

      return () => {
        isMounted = false;
      };
    }, [isHangulLesson, lessonId]);

    return (
      <BottomSheet
        ref={ref}
        index={initialIndex}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={onClose}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.28} />
        )}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
          {isHangulLesson ? (
            <HangulLessonContent lessonId={lessonId} hangul={hangul} />
          ) : (
            <>
              <View style={styles.lessonHeader}>
                <View style={styles.lessonHeaderText}>
                  <Text style={styles.lessonUnit}>{unit}</Text>
                  <Text style={styles.lessonTitle}>{title}</Text>
                </View>

                <Image source={meta.mascot} style={styles.lessonMascot} contentFit="contain" />
              </View>

              <View style={styles.lessonSummaryRow}>
                <View style={styles.lessonSummaryBar}>
                  {meta.progressSegments.map((segment, index) => (
                    <View key={`${lessonId}-${index}`} style={[styles.lessonSummarySegment, { backgroundColor: segment }]} />
                  ))}
                </View>

                <Text style={styles.lessonSummaryText}>{meta.progressText}</Text>
              </View>

              {isLoadingModules ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator color={Color.main} />
                  <Text style={styles.loadingText}>Đang tải module...</Text>
                </View>
              ) : (
                <View style={styles.sections}>
                  {sections.length === 0 ? (
                    <Text style={styles.emptyText}>Lesson này chưa có module học.</Text>
                  ) : null}

                  {sections.map((section, index) => {
                    const isLocked =
                      section.progressColor === Color.gray &&
                      section.progressValue === 0 &&
                      section.progressText.toLowerCase().includes('khóa');
                    const introRoute = introRouteMap[section.id];

                    return (
                      <LessonSectionAccordion
                        key={section.id}
                        delay={50 + index * 50}
                        icon={section.icon}
                        title={section.title}
                        subtitle={section.subtitle}
                        progressText={section.progressText}
                        progressValue={section.progressValue}
                        progressColor={section.progressColor}
                        progressTrackColor={section.progressTrackColor}
                        backgroundColor={section.backgroundColor}
                        expandable={section.expandable}
                        initiallyExpanded={section.initiallyExpanded}
                        details={section.details}
                        footerBadges={section.footerBadges}
                        onPress={
                          introRoute && !isLocked
                            ? () => {
                                closeLessonBottomSheet();
                                router.push(introRoute as any);
                              }
                            : undefined
                        }
                      />
                    );
                  })}
                </View>
              )}

              <View style={styles.ctaWrapper}>
                  <Button
                    title={`Mini test: ${title}`}
                    style={styles.ctaButton}
                    disabled={finalTestLocked}
                    onPress={() => {
                      router.push(`/lessons/${lessonId}/final-test/exam` as any);
                    }}
                  />

                <View style={styles.ctaIcon}>
                  <CaretRightIcon size={18} color={Color.text} weight="bold" />
                </View>
              </View>
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

LessonBottomSheet.displayName = 'LessonBottomSheet';

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: Color.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sheetHandle: {
    backgroundColor: Color.stroke,
    width: 56,
  },
  sheetContent: {
    paddingHorizontal: Padding.padding_15,
    paddingBottom: 32,
    gap: Gap.gap_15,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Gap.gap_15,
  },
  lessonHeaderText: {
    flex: 1,
    gap: Gap.gap_5,
  },
  lessonUnit: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.gray,
  },
  lessonTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_20,
    color: Color.text,
  },
  lessonMascot: {
    width: 58,
    height: 58,
  },
  lessonSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_10,
  },
  lessonSummaryBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lessonSummarySegment: {
    flex: 1,
    height: 4,
    borderRadius: Border.br_5,
  },
  lessonSummaryText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: Color.xanh,
  },
  sections: {
    gap: Gap.gap_14,
  },
  loadingBox: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Gap.gap_10,
  },
  loadingText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: Color.gray,
  },
  emptyText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.gray,
    textAlign: 'center',
    paddingVertical: 24,
  },
  ctaWrapper: {
    marginTop: Gap.gap_10,
    position: 'relative',
    justifyContent: 'center',
  },
  ctaButton: {
    marginVertical: 0,
    paddingRight: 48,
  },
  ctaIcon: {
    position: 'absolute',
    right: 18,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LessonBottomSheet;
