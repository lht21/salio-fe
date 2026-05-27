import React, { forwardRef, useMemo, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetFooter } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  CaretRightIcon,
  TrophyIcon,
  LockKeyIcon
} from 'phosphor-react-native';

import Button from '../Button';
import HangulLessonContent from './HangulLessonContent';
import LessonSectionAccordion from './LessonSectionAccordion';
import { useLessonModules } from './useLessonModules';
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

const MASCOTS = [
  require('../../assets/images/horani/sc1_b0.png'),
  require('../../assets/images/horani/sc1_b1.png'),
  require('../../assets/images/horani/sc1_b2.png'),
  require('../../assets/images/horani/sc1_b3.png'),
  require('../../assets/images/horani/sc1_b4.png'),
];

const LessonBottomSheet = forwardRef<BottomSheet, LessonBottomSheetProps>(
  ({ lessonId, unit, title, lessonType, hangul, onClose, initialIndex = -1 }, ref) => {
    const router = useRouter();
    const isHangulLesson = lessonType === 'hangul' || lessonId === '0';
    const { modules, lessonProgress, isLoadingModules, sections } = useLessonModules(lessonId, isHangulLesson);
    const snapPoints = useMemo(() => isHangulLesson ? ['80%', '92%'] : ['80%', '85%'], [isHangulLesson]);
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
    const overallProgress = Math.round(lessonProgress?.data?.overallProgress ?? (
      sections.length > 0
        ? sections.reduce((sum, section) => sum + section.progressValue, 0) / sections.length
        : 0
    ));
    
    const unitNumber = parseInt(unit.replace(/\D/g, ''), 10) || 0;
    const dynamicMascot = MASCOTS[unitNumber % MASCOTS.length];
    const dynamicProgressText = `${overallProgress}% hoàn thành`;

    const finalTestLocked = !lessonProgress?.data?.finalTestStatus?.isUnlocked;

    // 2. Logic tính toán hành động tiếp theo (Guided Learning)
    const nextAction = useMemo(() => {
      if (sections.length === 0) return null;

      // 1. Ưu tiên cao nhất: Nếu Final Test đã mở khoá (tất cả các module đã pass >= 80%), điều hướng làm Test
      if (!finalTestLocked) {
        return { text: 'Làm bài Mini Test', route: `/lessons/${lessonId}/final-test/exam` };
      }

      // 2. Tìm module xa nhất đã được mở khoá (Frontier Module) bằng cách lặp ngược
      let frontierSection = null;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const isLocked = section.progressColor === Color.gray && section.progressValue === 0 && section.progressText.toLowerCase().includes('khóa');
        
        if (!isLocked) {
          frontierSection = section;
          break;
        }
      }

      if (frontierSection) {
        // Nếu module xa nhất cũng đã đạt 100% nhưng chưa có Mini Test
        if (frontierSection.progressValue === 100) {
          return { text: 'Ôn tập lại từ vựng', route: introRouteMap['intro-vocab'] || `/lessons/${lessonId}/vocabulary/intro` };
        }

        const route = introRouteMap[frontierSection.id];
        let text = 'Tiếp tục bài học';
        
        if (frontierSection.id.includes('vocab')) text = 'Tiếp tục luyện Từ vựng';
        else if (frontierSection.id.includes('grammar')) text = 'Tiếp tục Ngữ pháp';
        else if (frontierSection.id.includes('listen')) text = 'Tiếp tục luyện Nghe';
        else if (frontierSection.id.includes('speak')) text = 'Tiếp tục luyện Nói';
        else if (frontierSection.id.includes('read')) text = 'Tiếp tục luyện Đọc';
        else if (frontierSection.id.includes('writ')) text = 'Tiếp tục luyện Viết';

        if (frontierSection.progressValue === 0) {
          text = 'Bắt đầu ngay!';
        }

        return { text, route };
      }

      return { text: 'Ôn tập lại từ vựng', route: introRouteMap['intro-vocab'] || `/lessons/${lessonId}/vocabulary/intro` };
    }, [sections, finalTestLocked, lessonId]);

    // 4. Tạo nút Call-to-Action ghim cố định (Sticky Footer)
    const renderFooter = useCallback((props: any) => {
      if (isHangulLesson || !nextAction) return null;
      
      return (
        <BottomSheetFooter {...props} bottomInset={0}>
          <View style={styles.footerContainer}>
            <Button
              title={nextAction.text}
              variant="Green"
              onPress={() => {
            // Đóng modal rồi dùng setTimeout để chuyển trang mượt mà tránh xung đột animation
            router.back();
            setTimeout(() => router.push(nextAction.route as any), 100);
              }}
            />
          </View>
        </BottomSheetFooter>
      );
    }, [isHangulLesson, nextAction, router]);

    return (
      <BottomSheet
        ref={ref}
        index={initialIndex}
        snapPoints={snapPoints}
        enableDynamicSizing={true}
        enablePanDownToClose
        onClose={onClose}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
        footerComponent={renderFooter}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.28} />
        )}
      >
        <BottomSheetScrollView contentContainerStyle={[styles.sheetContent, !isHangulLesson && { paddingBottom: 110 }]} showsVerticalScrollIndicator={false}>
          {isHangulLesson ? (
            <HangulLessonContent lessonId={lessonId} hangul={hangul} />
          ) : (
            <>
              <View style={styles.lessonHeader}>
                <View style={styles.lessonHeaderText}>
                  <Text style={styles.lessonUnit}>{unit}</Text>
                  <Text style={styles.lessonTitle}>{title}</Text>
                </View>

                <Image source={dynamicMascot} style={styles.lessonMascot} contentFit="contain" />
              </View>

              <View style={styles.lessonSummaryRow}>
                <View style={styles.lessonSummaryBar}>
                  {progressSegments.map((segment, index) => (
                    <View key={`${lessonId}-${index}`} style={[styles.lessonSummarySegment, { backgroundColor: segment }]} />
                  ))}
                </View>

                <Text style={styles.lessonSummaryText}>{dynamicProgressText}</Text>
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
                      // 1. Gỡ bỏ điều hướng của Accordion
                      onPress={undefined} 
                      />
                    );
                  })}
                </View>
              )}

            {/* 3. Đưa Mini Test vào danh sách UI (dạng Card) */}
            {!isLoadingModules && (
              <TouchableOpacity 
                style={[styles.miniTestCard, finalTestLocked && styles.miniTestCardLocked]}
                activeOpacity={0.8}
                disabled={finalTestLocked}
                onPress={() => {
              router.back();
              setTimeout(() => router.push(`/lessons/${lessonId}/final-test/exam` as any), 100);
                }}
              >
                <View style={styles.miniTestIconWrap}>
                  {finalTestLocked ? (
                    <LockKeyIcon size={24} color={Color.gray} weight="fill" />
                  ) : (
                    <TrophyIcon size={24} color={Color.vang || '#FBBF24'} weight="fill" />
                  )}
                </View>
                <View style={styles.miniTestInfo}>
                  <Text style={[styles.miniTestTitle, finalTestLocked && styles.miniTestTextLocked]}>Bài kiểm tra cuối khóa</Text>
                  <Text style={styles.miniTestSub}>{finalTestLocked ? "Hoàn thành bài học để mở khóa" : "Kiểm tra kiến thức đã học"}</Text>
                </View>
                {!finalTestLocked && (
                  <CaretRightIcon size={20} color={Color.main2} weight="bold" />
                )}
              </TouchableOpacity>
            )}
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
  // Style cho Mini Test Card
  miniTestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB', // Nền vàng nhạt
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: Border.br_20,
    padding: Padding.padding_15,
    marginTop: Gap.gap_15,
    gap: Gap.gap_10,
  },
  miniTestCardLocked: {
    backgroundColor: '#F3F4F6', // Nền xám
    borderColor: '#E5E7EB',
  },
  miniTestIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Color.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniTestInfo: {
    flex: 1,
  },
  miniTestTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: '#D97706', // Cam đậm
    marginBottom: 2,
  },
  miniTestTextLocked: {
    color: Color.gray,
  },
  miniTestSub: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.gray,
  },
  // Style cho Sticky Footer
  footerContainer: {
    backgroundColor: Color.bg,
    paddingHorizontal: Padding.padding_20,
    paddingVertical: Padding.padding_15,
    borderTopWidth: 1,
    borderColor: Color.stroke,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default LessonBottomSheet;
