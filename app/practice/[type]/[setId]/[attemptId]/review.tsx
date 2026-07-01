import React, { useRef, useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircleIcon, XCircleIcon, PlayIcon, PauseIcon } from 'phosphor-react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Image as ExpoImage } from 'expo-image';

import { FontFamily, FontSize, Padding, Gap, Border } from '../../../../../constants/GlobalStyles';
import ScreenHeader from '../../../../../components/ScreenHeader';
import QuestionBlock from '../../../../../components/ExamComponent/QuestionBlock';
import PracticeService from '../../../../../api/services/practice.service';
import ProgressBar from '../../../../../components/ProgressBar';
import { useTheme } from "@/contexts/ThemeContext";

// --- SUB-COMPONENTS ---

const QuestionNavigation = ({ questions, onJumpToQuestion }: { questions: any[], onJumpToQuestion: (id: string) => void }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.navContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navScrollContent}>
        {questions.map((q) => {
          const isCorrect = q.isCorrect;
          return (
            <TouchableOpacity
              key={q.id}
              style={[
                styles.navButton,
                isCorrect ? styles.navButtonCorrect : styles.navButtonWrong,
              ]}
              onPress={() => onJumpToQuestion(q.id)}
            >
              <Text style={styles.navButtonText}>{q.number}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const ExamCover = ({ title, type }: { title: string, type: string }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const typeLabel = type === 'reading' ? '읽기' : type === 'listening' ? '듣기' : '종합';
  return (
    <View style={styles.coverBanner}>
      <Text style={styles.coverTitle}>{title}</Text>
      <View style={styles.coverInfoRow}>
        <Text style={styles.coverInfoChip}>TOPIK II</Text>
        <Text style={styles.coverInfoChip}>{typeLabel}</Text>
      </View>
    </View>
  );
};

const MiniAudioPlayer = ({ url, id, currentlyPlayingId, onPlay }: { url: string, id: string, currentlyPlayingId: string | null, onPlay: (id: string) => void }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let soundInstance: Audio.Sound | null = null;

    const loadAudio = async () => {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: url },
          { progressUpdateIntervalMillis: 500 },
          (status: AVPlaybackStatus) => {
            if (!isMounted) return;
            if (status.isLoaded) {
              setPosition(status.positionMillis);
              setDuration(status.durationMillis || 0);
              setIsPlaying(status.isPlaying);
              if (status.didJustFinish) {
                setIsPlaying(false);
                newSound.setPositionAsync(0);
              }
            }
          }
        );
        soundInstance = newSound;
        if (isMounted) setSound(newSound);
      } catch (error) {
        console.log('Lỗi khi tải Audio:', error);
      }
    };

    if (url) loadAudio();

    return () => {
      isMounted = false;
      if (soundInstance) soundInstance.unloadAsync();
    };
  }, [url]);

  useEffect(() => {
    if (currentlyPlayingId !== id && isPlaying && sound) {
      sound.pauseAsync();
    }
  }, [currentlyPlayingId, isPlaying, sound, id]);

  const handlePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      onPlay(id);
      await sound.playAsync();
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.audioPlayerContainer}>
      <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
        {isPlaying ? <PauseIcon size={20} color={colors.background} weight="fill" /> : <PlayIcon size={20} color={colors.background} weight="fill" />}
      </TouchableOpacity>
      <View style={styles.progressContainer}>
        <ProgressBar progress={progressPercent / 100} height={6} style={{ marginBottom: 6 }} />
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
};

export default function MockExamReviewScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const { examId, attemptId, type } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const questionLayouts = useRef<Record<string, number>>({});

  const [reviewData, setReviewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Lấy dữ liệu Review từ API
  useEffect(() => {
    const fetchReview = async () => {
      try {
        setIsLoading(true);
        if (attemptId) {
          const res = await PracticeService.reviewAttempt(attemptId as string);
          if (res.success) {
            setReviewData(res.data);
          }
        }
      } catch (error) {
        console.error('Lỗi khi fetch review data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReview();
  }, [attemptId]);

  // Transform Data: Giữ cấu trúc Section để render giống lúc làm bài
  const { allQuestions, structuredSections } = useMemo(() => {
    if (!reviewData || !reviewData.exam || !reviewData.exam.sections) return { allQuestions: [], structuredSections: {} };

    let qIndex = 1;
    const flatQs: any[] = [];
    const sections: any = {};
    const examType = type as string || 'full';
    const sectionsToMap = examType === 'full' ? ['listening', 'reading'] : [examType];

    sectionsToMap.forEach((sectionType) => {
      const sectionItems = JSON.parse(JSON.stringify(reviewData.exam.sections[sectionType] || []));
      const userAnswers = sectionType === 'listening' ? reviewData.listeningAnswers : reviewData.readingAnswers;

      sectionItems.forEach((item: any) => {
        (item.questions || []).forEach((q: any) => {
          q.number = qIndex++;
          const ansRecord = (userAnswers || []).find((a: any) => String(a.questionId) === String(q._id));
          const userAnswer = ansRecord ? ansRecord.userAnswer : null;
          const isBackendCorrect = ansRecord ? ansRecord.isCorrect : false;

          const rawOptions = q.metadata?.options || q.answers || [];

          // 1. Chuẩn hóa options: Đảm bảo id duy nhất và là chuỗi
          const options = rawOptions.map((a: any, index: number) => {
            const isString = typeof a === 'string';
            // Ưu tiên lấy _id, nếu không có lấy label, text, hoặc index làm id dự phòng
            const optId = isString ? a : (a._id || a.label || a.text || String(index));
            const content = isString ? a : (a.text || a.label || a.imageUrl || '');
            const optType = (!isString && (a.imageUrl || a.type === 'image')) ? 'image' : 'text';
            return {
              id: String(optId),
              type: optType,
              content: String(content),
              rawRef: a
            };
          });

          // 2. Tìm correctOptionId chuẩn
          const correctOptIndex = rawOptions.findIndex((a: any) => a.isCorrect === true || a.isCorrect === 'true');
          let correctOptionId = null;

          if (correctOptIndex !== -1) {
            correctOptionId = options[correctOptIndex].id;
          } else if (q.correctAnswer !== undefined && q.correctAnswer !== null) {
            const fallbackAns = String(q.correctAnswer);
            const matchedOpt = options.find((o: any) =>
              o.id === fallbackAns || o.content === fallbackAns ||
              (o.rawRef && typeof o.rawRef !== 'string' && (String(o.rawRef._id) === fallbackAns || String(o.rawRef.label) === fallbackAns || String(o.rawRef.text) === fallbackAns))
            );
            correctOptionId = matchedOpt ? matchedOpt.id : fallbackAns;
          }

          // 3. Tìm userOptionId chuẩn
          let userOptionId = (userAnswer !== undefined && userAnswer !== null) ? String(userAnswer) : null;
          if (userOptionId !== null) {
            const matchedOpt = options.find((o: any) =>
              o.id === userOptionId || o.content === userOptionId ||
              (o.rawRef && typeof o.rawRef !== 'string' && (String(o.rawRef._id) === userOptionId || String(o.rawRef.label) === userOptionId || String(o.rawRef.text) === userOptionId))
            );
            if (matchedOpt) userOptionId = matchedOpt.id;
          }

          q.processedOptions = options;
          q.correctOptionId = correctOptionId;
          q.userOptionId = userOptionId;

          flatQs.push({
            id: q._id,
            number: q.number,
            isCorrect: isBackendCorrect
          });
        });
      });
      sections[sectionType] = sectionItems;
    });

    return { allQuestions: flatQs, structuredSections: sections };
  }, [reviewData, type]);

  const handleJumpToQuestion = (questionId: string) => {
    const y = questionLayouts.current[questionId];
    if (y !== undefined && scrollViewRef.current) {
      // Trừ đi một khoảng nhỏ để Header của QuestionBlock không bị che
      scrollViewRef.current.scrollTo({ y: y - 10, animated: true });
    }
  };

  const renderOptions = (question: any) => {
    const { correctOptionId, userOptionId, processedOptions: options, explanation } = question;

    let optionsView = null;

    if (options && options[0]?.type === 'image') {
      optionsView = (
        <View style={styles.imageOptionsGrid}>
          {options?.map((opt: any, index: number) => {
            const isCorrect = opt.id === correctOptionId;
            const isUserChoice = opt.id === userOptionId;
            const isWrongChoice = isUserChoice && !isCorrect;

            return (
              <View
                key={opt.id}
                style={[
                  styles.imageOptionCard,
                  isCorrect && styles.optionCorrect,
                  isWrongChoice && styles.optionWrong,
                ]}
              >
                <Image source={{ uri: opt.content }} style={styles.optionImage} />
                <Text style={styles.optionLabel}>{`①②③④`[index]}</Text>

                {/* Huy hiệu Đúng/Sai cho ảnh */}
                {isCorrect && <View style={styles.iconBadge}><CheckCircleIcon size={28} color="#16A34A" weight="fill" /></View>}
                {isWrongChoice && <View style={styles.iconBadge}><XCircleIcon size={28} color="#DC2626" weight="fill" /></View>}
              </View>
            );
          })}
        </View>
      );
    } else {
      optionsView = (
        <View style={styles.textOptionsContainer}>
          {options?.map((opt: any) => {
            const isCorrect = opt.id === correctOptionId;
            const isUserChoice = opt.id === userOptionId;
            const isWrongChoice = isUserChoice && !isCorrect;

            return (
              <View
                key={opt.id}
                style={[
                  styles.textOptionCard,
                  isCorrect && styles.optionCorrect,
                  isWrongChoice && styles.optionWrong,
                ]}
              >
                <Text style={[
                  styles.textOptionContent,
                  isCorrect && { color: '#16A34A', fontFamily: FontFamily.lexendDecaMedium },
                  isWrongChoice && { color: '#DC2626' }
                ]}>
                  {opt.content}
                </Text>

                {/* Icon đánh dấu câu hỏi Text */}
                {isCorrect && <CheckCircleIcon size={24} color="#16A34A" weight="fill" />}
                {isWrongChoice && <XCircleIcon size={24} color="#DC2626" weight="fill" />}
              </View>
            );
          })}
        </View>
      );
    }

    return (
      <View>
        {optionsView}
        {explanation ? (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationText}>Giải thích: {explanation}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  const renderSection = (secType: string, title: string) => {
    const items = structuredSections[secType];
    if (!items || items.length === 0) return null;

    return (
      <View key={secType}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {items.map((item: any, itemIndex: number) => {
          const passageAudioUrl = item.audioUrl || item.passageAudioUrl;
          return (
            <View key={item._id || itemIndex} style={{ marginBottom: Gap.gap_20 }}>
              {item.title && <Text style={styles.instructionText}>{item.title}</Text>}

              {passageAudioUrl && (
                <MiniAudioPlayer id={`item-${item._id || itemIndex}`} url={passageAudioUrl} currentlyPlayingId={playingAudioId} onPlay={setPlayingAudioId} />
              )}

              {item.imageUrl && (
                <ExpoImage source={{ uri: item.imageUrl }} style={styles.contentImage} contentFit="contain" />
              )}

              {(item.passage || item.content) ? <Text style={styles.passageText}>{item.passage || item.content}</Text> : null}

              {item.questions?.map((q: any) => (
                <View
                  key={q._id}
                  onLayout={(e) => { questionLayouts.current[q._id] = e.nativeEvent.layout.y; }}
                >
                  {q.audioUrl && (
                    <MiniAudioPlayer id={`q-${q._id}`} url={q.audioUrl} currentlyPlayingId={playingAudioId} onPlay={setPlayingAudioId} />
                  )}
                  <QuestionBlock number={q.number} questionText={q.questionText || q.text}>
                    {q.imageUrl && (
                      <ExpoImage source={{ uri: q.imageUrl }} style={styles.contentImage} contentFit="contain" />
                    )}
                    {renderOptions(q)}
                  </QuestionBlock>
                </View>
              ))}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScreenHeader title="Xem lại bài làm" />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ExamCover title={reviewData?.exam?.title || 'Đề thi'} type={type as string || 'full'} />

        {renderSection('listening', 'TOPIK 듣기')}
        {renderSection('reading', 'TOPIK 읽기')}
      </ScrollView>

      <QuestionNavigation questions={allQuestions} onJumpToQuestion={handleJumpToQuestion} />
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: Padding.padding_15, paddingBottom: 50 },

  coverBanner: { backgroundColor: '#1E293B', borderRadius: Border.br_20, padding: Padding.padding_20, marginBottom: 40 },
  coverTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_20, color: colors.background, textAlign: 'center', marginBottom: Gap.gap_15 },
  coverInfoRow: { flexDirection: 'row', justifyContent: 'center', gap: Gap.gap_10, marginBottom: Gap.gap_20 },
  coverInfoChip: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: '#1E293B', backgroundColor: colors.borderDefault, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, overflow: 'hidden' },
  sectionHeader: { borderBottomWidth: 2, borderColor: colors.borderDefault, paddingBottom: 10, marginBottom: 20 },
  sectionTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.textPrimary },
  instructionText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.textPrimary, marginBottom: Gap.gap_10 },
  passageText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.textBrand, lineHeight: 24, marginBottom: Gap.gap_15, backgroundColor: '#F8FAFC', padding: 15, borderRadius: Border.br_10 },

  imageOptionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: Gap.gap_15 },
  imageOptionCard: { width: '48%', aspectRatio: 1, borderWidth: 2, borderColor: colors.borderDefault, borderRadius: Border.br_15, padding: Padding.padding_10, alignItems: 'center', justifyContent: 'space-between', position: 'relative' },
  optionImage: { flex: 1, width: '100%', borderRadius: Border.br_10 },
  optionLabel: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.textSecondary, marginTop: 8 },
  iconBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: colors.background, borderRadius: 14 },

  textOptionsContainer: { gap: Gap.gap_10 },
  textOptionCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderColor: colors.borderDefault, borderRadius: Border.br_15, padding: Padding.padding_15 },
  textOptionContent: { flex: 1, fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_16, color: colors.textPrimary, lineHeight: 24 },

  // Trạng thái đáp án
  optionCorrect: { borderColor: '#22C55E', backgroundColor: '#F0FDF4' },
  optionWrong: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },

  explanationContainer: {
    marginTop: Gap.gap_15,
    padding: Padding.padding_15,
    backgroundColor: '#F8FAFC',
    borderRadius: Border.br_10,
    borderLeftWidth: 3,
    borderLeftColor: '#94A3B8',
  },
  explanationText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: '#64748B',
    fontStyle: 'italic',
    lineHeight: 22,
  },

  // --- Question Navigation Styles ---
  navContainer: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
    paddingVertical: Padding.padding_10,
  },
  navScrollContent: {
    paddingHorizontal: Padding.padding_15,
    gap: Gap.gap_10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  navButtonCorrect: { backgroundColor: '#F0FDF4', borderColor: '#22C55E' },
  navButtonWrong: { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
  navButtonText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.textPrimary },

  audioPlayerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: Padding.padding_10, borderRadius: Border.br_10, marginBottom: Gap.gap_10, borderWidth: 1, borderColor: colors.borderDefault },
  playButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: Gap.gap_10 },
  progressContainer: { flex: 1, justifyContent: 'center' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: colors.textSecondary },
  contentImage: { width: '100%', height: 200, borderRadius: Border.br_10, marginBottom: Gap.gap_15, backgroundColor: '#F8FAFC' },
});