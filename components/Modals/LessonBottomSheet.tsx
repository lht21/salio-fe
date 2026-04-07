import React, { forwardRef, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { BookOpenTextIcon, CaretRightIcon, HeadphonesIcon, MicrophoneStageIcon, SpeakerHighIcon } from 'phosphor-react-native';

import Button from '../Button';
import LessonSectionAccordion, { LessonSectionDetailItem } from './LessonSectionAccordion';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';

type LessonBottomSheetProps = {
  lessonId: string;
  unit: string;
  title: string;
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

const VOCAB_DETAILS: LessonSectionDetailItem[] = [
  { id: 'voc-1', left: '학생', right: 'Học sinh', status: 'learning' },
  { id: 'voc-2', left: '학생', right: 'Học sinh', status: 'done' },
  { id: 'voc-3', left: '학생', right: 'Học sinh', status: 'todo' },
];

const GRAMMAR_DETAILS: LessonSectionDetailItem[] = [
  { id: 'gr-1', left: '입니다', right: 'là', status: 'done' },
  { id: 'gr-2', left: '이건', right: 'Cái này', status: 'done' },
];

const LESSON_SECTION_MAP: Record<string, LessonSectionConfig[]> = {
  '0': [
    {
      id: 'hangul-vocab',
      title: '12 từ vựng',
      subtitle: 'Chữ cái Hangul',
      progressText: 'Đã hoàn thành 100%',
      progressValue: 100,
      progressColor: Color.green,
      progressTrackColor: '#DDF7D8',
      icon: <BookOpenTextIcon size={20} color={Color.main} weight="fill" />,
      expandable: true,
      details: VOCAB_DETAILS,
      footerBadges: ['Chưa học', 'Đang học', 'Chỉ ôn'],
    },
    {
      id: 'hangul-speaking',
      title: '3 bài nói',
      subtitle: 'Phát âm cơ bản',
      progressText: 'Đã hoàn thành 100%',
      progressValue: 100,
      progressColor: Color.green,
      progressTrackColor: '#DDF7D8',
      icon: <MicrophoneStageIcon size={20} color={Color.main} weight="fill" />,
    },
  ],
  '1': [
    {
      id: 'intro-vocab',
      title: '15 từ vựng',
      subtitle: 'Từ vựng giới thiệu',
      progressText: 'Đã hoàn thành 100%',
      progressValue: 100,
      progressColor: Color.green,
      progressTrackColor: '#DDF7D8',
      icon: <BookOpenTextIcon size={20} color={Color.main} weight="fill" />,
      expandable: true,
      initiallyExpanded: true,
      details: VOCAB_DETAILS,
      footerBadges: ['Chưa học', 'Đang học', 'Chỉ ôn'],
    },
    {
      id: 'intro-grammar',
      title: '2 ngữ pháp',
      subtitle: 'Từ vựng giới thiệu',
      progressText: 'Đã hoàn thành 100%',
      progressValue: 100,
      progressColor: Color.green,
      progressTrackColor: '#DDF7D8',
      icon: <SpeakerHighIcon size={20} color={Color.main} weight="fill" />,
      expandable: true,
      initiallyExpanded: true,
      details: GRAMMAR_DETAILS,
    },
    {
      id: 'intro-speaking',
      title: '5 bài nói',
      subtitle: 'Từ vựng giới thiệu',
      progressText: 'Đã khóa 0%',
      progressValue: 0,
      progressColor: Color.gray,
      backgroundColor: '#F3F4F6',
      icon: <MicrophoneStageIcon size={20} color={Color.main} weight="fill" />,
    },
    {
      id: 'intro-listening',
      title: '6 bài nghe',
      subtitle: 'Liên quan đến hội thoại địa điểm',
      progressText: 'Đã khóa 0%',
      progressValue: 0,
      progressColor: Color.gray,
      backgroundColor: '#F3F4F6',
      icon: <HeadphonesIcon size={20} color={Color.main} weight="fill" />,
    },
  ],
};

const DEFAULT_SECTIONS: LessonSectionConfig[] = [
  {
    id: 'default-vocab',
    title: '10 từ vựng',
    subtitle: 'ội dung bài học',
    progressText: 'Đang học 25%',
    progressValue: 25,
    progressColor: Color.xanh,
    progressTrackColor: '#DBEAFE',
    icon: <BookOpenTextIcon size={20} color={Color.main} weight="fill" />,
  },
  {
    id: 'default-grammar',
    title: '2 ngữ pháp',
    subtitle: 'Nội dung bài học',
    progressText: 'Chưa mở khóa',
    progressValue: 0,
    progressColor: Color.gray,
    backgroundColor: '#F3F4F6',
    icon: <SpeakerHighIcon size={20} color={Color.main} weight="fill" />,
  },
];

const LESSON_META_MAP: Record<string, { progressText: string; progressSegments: string[]; mascot: any }> = {
  '0': {
    progressText: '100% hoàn thành',
    progressSegments: [Color.green, Color.green, Color.green, Color.green],
    mascot: require('../../assets/images/tubo/sc1_b0.png'),
  },
  '1': {
    progressText: '25% hoàn thành',
    progressSegments: [Color.green, Color.xanh, '#E5E7EB', '#E5E7EB'],
    mascot: require('../../assets/images/tubo/sc1_b1.png'),
  },
};

const LessonBottomSheet = forwardRef<BottomSheet, LessonBottomSheetProps>(
  ({ lessonId, unit, title, onClose, initialIndex = -1 }, ref) => {
  const router = useRouter();
  const snapPoints = useMemo(() => ['80%'], []);
  const sections = LESSON_SECTION_MAP[lessonId] ?? DEFAULT_SECTIONS;
  const meta = LESSON_META_MAP[lessonId] ?? {
    progressText: '25% hoàn thành',
    progressSegments: [Color.xanh, '#E5E7EB', '#E5E7EB', '#E5E7EB'],
    mascot: require('../../assets/images/tubo/sc1_b1.png'),
  };

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

        <View style={styles.sections}>
          {sections.map((section, index) => (
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
            />
          ))}
        </View>

        <View style={styles.ctaWrapper}>
          <Button
            title={`Tiep tuc: ${title}`}
            style={styles.ctaButton}
            onPress={() => router.push(`/lessons/${lessonId}/grammar/intro`)}
          />

          <View style={styles.ctaIcon}>
            <CaretRightIcon size={18} color={Color.text} weight="bold" />
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

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
