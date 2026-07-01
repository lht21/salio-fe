import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpenTextIcon,
  HeadphonesIcon,
  MicrophoneStageIcon,
  PenNibStraightIcon,
  BracketsAngleIcon,
} from 'phosphor-react-native';
import LessonService from '../../api/services/lesson.service';
import { LessonProgressResponse } from '../../api/types/lesson.types';
import { LessonSectionDetailItem } from './LessonSectionAccordion';
import { useTheme } from "@/contexts/ThemeContext";

export type LessonSectionConfig = {
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
};

export type ModuleItem = Record<string, any> & { _id?: string };

export type ProgressSection = {
  isUnlocked?: boolean;
  progress?: number;
  totalItems?: number;
  completedCount?: number;
  items?: Array<{
    itemId?: string | { _id?: string };
    status?: 'locked' | 'learning' | 'completed';
  }>;
};

export type LessonModulesData = {
  lessonType?: 'standard' | 'hangul';
  vocabulary?: ModuleItem[];
  grammar?: ModuleItem[];
  grammarQuizzes?: ModuleItem[];
  listening?: ModuleItem[];
  speaking?: ModuleItem[];
  reading?: ModuleItem[];
  writing?: ModuleItem[];
  finalTest?: ModuleItem | null;
};

const getItemId = (item: any) => {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item._id?.toString?.() ?? item.toString?.() ?? '';
};

const getSectionTone = (section: ProgressSection | undefined, colors: any) => {
  const progressValue = Math.max(0, Math.min(100, Math.round(section?.progress ?? 0)));
  const isUnlocked = section?.isUnlocked !== false;

  if (!isUnlocked) {
    return {
      progressValue: 0,
      progressText: 'Chưa mở khóa',
      progressColor: colors.textSecondary,
      progressTrackColor: '#E5E7EB',
      backgroundColor: '#F3F4F6',
    };
  }

  if (progressValue >= 100) {
    return {
      progressValue,
      progressText: 'Đã hoàn thành 100%',
      progressColor: colors.main400,
      progressTrackColor: colors.brown50,
    };
  }

  return {
    progressValue,
    progressText: progressValue > 0 ? `Đang học ${progressValue}%` : 'Chưa học 0%',
    progressColor: progressValue > 0 ? colors.accent1 : colors.textSecondary,
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
    };
  });
};

const buildDynamicSections = (modules: LessonModulesData | null, progress: any, colors: any): LessonSectionConfig[] => {
  if (!modules) return [];

  // Sửa lỗi Unwrapping: Payload thực sự nằm trong trường data của BaseResponse
  const actualProgress = progress?.data ?? progress;
  const progressSections = actualProgress?.sections ?? {};
  const vocabularyItems = [...(modules.vocabulary ?? [])];
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
    const tone = getSectionTone(progressSections[key], colors);

    configs.push({
      id: `intro-${key === 'vocabulary' ? 'vocab' : key}`,
      title,
      subtitle,
      icon,
      expandable: details.length > 0,
      initiallyExpanded: true,
      details,
      ...tone,
    });
  };

  pushSection('vocabulary', vocabularyItems, `${vocabularyItems.length} từ vựng`, 'Từ vựng của bài học', <BookOpenTextIcon size={24} color={colors.primary} weight="fill" />, buildDetails(vocabularyItems.slice(0, 10), progressSections.vocabulary, (item, index) => item.word ?? item.title ?? `Quiz ${index + 1}`, (item) => item.meaning ?? item.description ?? 'Bài luyện từ vựng'));
  pushSection('grammar', grammarItems, `${grammarItems.length} ngữ pháp`, 'Mẫu câu và điểm ngữ pháp', <BracketsAngleIcon size={24} color={colors.primary} weight="fill" />, buildDetails(grammarItems, progressSections.grammar, (item, index) => item.structure ?? item.title ?? `Quiz ${index + 1}`, (item) => item.meaning ?? item.description ?? 'Bài luyện ngữ pháp'));
  pushSection('listening', modules.listening ?? [], `${modules.listening?.length ?? 0} bài nghe`, 'Luyện nghe theo ngữ cảnh', <HeadphonesIcon size={24} color={colors.primary} weight="fill" />, buildDetails(modules.listening ?? [], progressSections.listening, (_, index) => `Bài ${index + 1}`, (item) => item.title ?? 'Bài nghe'));
  pushSection('speaking', modules.speaking ?? [], `${modules.speaking?.length ?? 0} bài nói`, 'Luyện phát âm và phản xạ nói', <MicrophoneStageIcon size={24} color={colors.primary} weight="fill" />, buildDetails(modules.speaking ?? [], progressSections.speaking, (_, index) => `Bài ${index + 1}`, (item) => item.title ?? item.prompt ?? 'Bài nói'));
  pushSection('reading', modules.reading ?? [], `${modules.reading?.length ?? 0} bài đọc`, 'Luyện đọc hiểu', <BookOpenTextIcon size={24} color={colors.primary} weight="fill" />, buildDetails(modules.reading ?? [], progressSections.reading, (_, index) => `Bài ${index + 1}`, (item) => item.title ?? 'Bài đọc'));
  pushSection('writing', modules.writing ?? [], `${modules.writing?.length ?? 0} bài viết`, 'Luyện viết câu và đoạn văn', <PenNibStraightIcon size={24} color={colors.primary} weight="fill" />, buildDetails(modules.writing ?? [], progressSections.writing, (_, index) => `Bài ${index + 1}`, (item) => item.title ?? item.prompt ?? 'Bài viết'));

  return configs;
};

export function useLessonModules(lessonId: string, isHangulLesson: boolean) {
  const { colors } = useTheme();
  const [modules, setModules] = useState<LessonModulesData | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgressResponse | null>(null);
  const [isLoadingModules, setIsLoadingModules] = useState(!isHangulLesson);

  useEffect(() => {
    if (isHangulLesson || !lessonId || lessonId === '0') {
      setIsLoadingModules(false);
      return;
    }

    let isMounted = true;

    const loadLessonModules = async () => {
      try {
        setIsLoadingModules(true);
        const [progressResponse, modulesResponse] = await Promise.all([
          LessonService.start(lessonId),
          LessonService.getModules(lessonId),
        ]);

        if (!isMounted) return;

        // Service mới đã return response.data trực tiếp, không cần chấm .data nữa
        setLessonProgress(progressResponse);
        // Fix: Cần lấy trường 'data' bên trong BaseResponse, fallback về chính nó nếu lúc test mock trực tiếp
        setModules((modulesResponse as any)?.data ?? (modulesResponse as unknown as LessonModulesData));
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

  const sections = useMemo(() => buildDynamicSections(modules, lessonProgress, colors), [modules, lessonProgress, colors]);

  return { modules, lessonProgress, isLoadingModules, sections };
}