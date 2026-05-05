import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { PlayIcon, PauseIcon } from 'phosphor-react-native';
import { Image } from 'expo-image';

// Import Design System & Components
import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import ExamHeader from '../ExamComponent/ExamHeader';
import QuestionBlock from '../ExamComponent/QuestionBlock';
import { ConfirmModal } from '../ModalResult/ConfirmModal';

const ExamCover = ({ title, type }: { title: string, type: string }) => (
  <View style={styles.coverBanner}>
    <Text style={styles.coverTitle}>{title}</Text>
    <View style={styles.coverInfoRow}>
      <Text style={styles.coverInfoChip}>TOPIK II</Text>
      <Text style={styles.coverInfoChip}>{type === 'reading' ? '읽기' : '듣기'}</Text>
    </View>
  </View>
);

const MiniAudioPlayer = ({ url, id, currentlyPlayingId, onPlay, onFinish, autoPlay = false }: { url: string, id: string, currentlyPlayingId: string | null, onPlay: (id: string) => void, onFinish?: (id: string) => void, autoPlay?: boolean }) => {
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
          { progressUpdateIntervalMillis: 500, shouldPlay: autoPlay },
          (status: AVPlaybackStatus) => {
            if (!isMounted) return;
            if (status.isLoaded) {
              setPosition(status.positionMillis);
              setDuration(status.durationMillis || 0);
              setIsPlaying(status.isPlaying);
              if (status.didJustFinish) {
                setIsPlaying(false);
                newSound.setPositionAsync(0);
                if (onFinish) onFinish(id);
              }
            }
          }
        );
        soundInstance = newSound;
        if (autoPlay && isMounted) {
          onPlay(id);
        }
        if (isMounted) setSound(newSound);
      } catch (error) {
        console.log('Lỗi khi tải Audio:', error);
      }
    };

    if (url) loadAudio();

    return () => {
      isMounted = false;
      if (soundInstance) soundInstance.unloadAsync(); // Tránh rò rỉ bộ nhớ
    };
  }, [url]);

  useEffect(() => {
    if (autoPlay && sound) {
      sound.getStatusAsync().then((status) => {
        if (status.isLoaded && !status.isPlaying) {
          sound.playAsync();
          onPlay(id);
        }
      });
    }
  }, [autoPlay, sound]);

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.audioPlayerContainer}>
      <View style={styles.playButton}>
        {isPlaying ? <PauseIcon size={20} color={Color.bg} weight="fill" /> : <PlayIcon size={20} color={Color.bg} weight="fill" />}
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
};

const MultipleChoiceUI = ({ data, answers, timeLeft, onSelectAnswer, onSubmit, onExit, type }: any) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const questionLayouts = useRef<Record<string, number>>({});
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showQuestionListModal, setShowQuestionListModal] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null); // Trạng thái dùng cho Auto-Stop
  const examTitle = data?.title || 'Bài thi trắc nghiệm';

  // Làm phẳng danh sách câu hỏi để tính toán và Modal Grid
  const allQuestions = useMemo(() => {
    if (!data?.items) return [];
    let questions: any[] = [];

    if (type === 'full') {
      const sections = ['listening', 'reading'];
      sections.forEach(sec => {
        if (data.items[sec]) {
          data.items[sec].forEach((item: any) => {
            if (item.questions) {
              questions.push(...item.questions);
            }
          });
        }
      });
    } else {
      // For 'reading' or 'listening', data.items is an array
      data.items.forEach((item: any) => {
        if (item.questions) {
          questions.push(...item.questions);
        }
      });
    }
    return questions;
  }, [data, type]);

  const allAudioIds = useMemo(() => {
    if (!data?.items) return null;

    const ids: string[] = [];
    const findAudioInItems = (items: any[]) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.audioUrl || item.passageAudioUrl) {
          ids.push(`item-${item._id || i}`);
        }
        if (item.questions) {
          for (let j = 0; j < item.questions.length; j++) {
            const q = item.questions[j];
            if (q.audioUrl) {
              ids.push(`q-${q._id || j}`);
            }
          }
        }
      }
    };

    if (type === 'full') {
      if (data.items.listening) findAudioInItems(data.items.listening);
      if (data.items.reading) findAudioInItems(data.items.reading);
    } else if (Array.isArray(data.items)) {
      findAudioInItems(data.items);
    }
    return ids;
  }, [data, type]);

  const [autoPlayId, setAutoPlayId] = useState<string | null>(null);

  useEffect(() => {
    if (allAudioIds.length > 0 && !autoPlayId) {
      setAutoPlayId(allAudioIds[0]);
    }
  }, [allAudioIds]);

  const handleAudioFinish = (finishedId: string) => {
    const currentIndex = allAudioIds.indexOf(finishedId);
    if (currentIndex !== -1 && currentIndex + 1 < allAudioIds.length) {
      setAutoPlayId(allAudioIds[currentIndex + 1]);
    }
  };

  const totalQuestions = allQuestions.length;
  const answeredQuestions = Object.keys(answers).length;
  const remainingQuestions = totalQuestions - answeredQuestions;

  const handleJumpToQuestion = (questionId: string) => {
    const y = questionLayouts.current[questionId];
    if (y !== undefined && scrollViewRef.current) {
      setShowQuestionListModal(false);
      scrollViewRef.current.scrollTo({ y: y - 10, animated: true });
    }
  };

  const renderOptions = (questionId: string, options: any[], secType: string) => {
    return (
      <View style={styles.textOptionsContainer}>
        {options?.map((opt, index) => {
          // Hỗ trợ cả options là chuỗi ("...") hoặc Object ({ label, text, _id })
          const isString = typeof opt === 'string';
          const optValue = isString ? opt : (opt.label || opt._id);
          const optLabel = isString ? opt : (opt.text || opt.label);

          return (
            <TouchableOpacity
              key={isString ? index : (opt._id || index)}
              style={[styles.textOptionCard, answers[questionId] === optValue && styles.optionSelected]}
              onPress={() => onSelectAnswer(questionId, optValue, secType)}
            >
              <Text style={styles.textOptionContent}>{optLabel}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderSection = (secType: string, title: string) => {
    const items = type === 'full' ? data?.items?.[secType] : data?.items;
    if (!items || items.length === 0) return null;

    return (
      <>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {items.map((item: any, itemIndex: number) => {
          const passageAudioUrl = item.audioUrl || item.passageAudioUrl;
          return (
            <View key={item._id || itemIndex} style={{ marginBottom: Gap.gap_20 }}>
              {item.title && <Text style={styles.instructionText}>{item.title}</Text>}
              
              {passageAudioUrl && (
                <MiniAudioPlayer
                  id={`item-${item._id || itemIndex}`}
                  url={passageAudioUrl}
                  currentlyPlayingId={playingAudioId}
                  onPlay={setPlayingAudioId}
                  onFinish={handleAudioFinish}
                  autoPlay={`item-${item._id || itemIndex}` === autoPlayId}
                />
              )}

              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.contentImage} contentFit="contain" />
              )}

              {(item.passage || item.content) ? <Text style={styles.passageText}>{item.passage || item.content}</Text> : null}
              
              {item.questions?.map((q: any, qIndex: number) => (
                <View
                  key={q._id || qIndex}
                  onLayout={(e) => { questionLayouts.current[q._id] = e.nativeEvent.layout.y; }}
                >
                  {q.audioUrl && (
                    <MiniAudioPlayer
                      id={`q-${q._id || qIndex}`}
                      url={q.audioUrl}
                      currentlyPlayingId={playingAudioId}
                      onPlay={setPlayingAudioId}
                      onFinish={handleAudioFinish}
                      autoPlay={`q-${q._id || qIndex}` === autoPlayId}
                    />
                  )}
                  <QuestionBlock number={qIndex + 1} questionText={q.questionText || q.text}>
                    {q.imageUrl && (
                      <Image source={{ uri: q.imageUrl }} style={styles.contentImage} contentFit="contain" />
                    )}
                    {renderOptions(q._id, q.metadata?.options || q.answers, secType)}
                  </QuestionBlock>
                </View>
              ))}
            </View>
          );
        })}
      </>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ExamHeader
        timeLeft={timeLeft}
        remainingQuestions={remainingQuestions}
        onClose={() => setShowExitModal(true)}
        onSubmit={() => setShowSubmitModal(true)}
        onOpenQuestionList={() => setShowQuestionListModal(true)}
      />
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        <ExamCover title={examTitle} type={type} />
        
        {(type === 'listening' || type === 'full') && renderSection('listening', 'TOPIK 듣기')}
        {(type === 'reading' || type === 'full') && renderSection('reading', 'TOPIK 읽기')}
      </ScrollView>

      <ConfirmModal
        isVisible={showExitModal}
        title="Dừng bài thi?"
        subtitle="Tiến trình sẽ không được lưu. Bạn có chắc muốn thoát?"
        confirmText="Thoát"
        cancelText="Ở lại"
        isDestructive={true}
        onConfirm={onExit}
        onCancel={() => setShowExitModal(false)}
      />

      <ConfirmModal
        isVisible={showSubmitModal}
        title="Nộp bài ngay?"
        subtitle="Sau khi nộp, bạn sẽ không thể sửa lại bài làm của mình."
        confirmText="Nộp bài"
        cancelText="Kiểm tra lại"
        isDestructive={false}
        onConfirm={() => { setShowSubmitModal(false); onSubmit(); }}
        onCancel={() => setShowSubmitModal(false)}
      />

      <Modal
        visible={showQuestionListModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowQuestionListModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackground} onPress={() => setShowQuestionListModal(false)} />
          <View style={styles.questionListContainer}>
            <Text style={styles.questionListTitle}>Danh sách câu hỏi</Text>
            <ScrollView contentContainerStyle={styles.questionGrid}>
              {allQuestions.map((q: any, index: number) => {
                const isAnswered = !!answers[q._id]; 
                return (
                  <TouchableOpacity 
                    key={q._id || index} 
                    style={[styles.questionBox, isAnswered ? styles.questionBoxAnswered : styles.questionBoxPending]}
                    onPress={() => handleJumpToQuestion(q._id)}
                  >
                    <Text style={[styles.questionBoxText, isAnswered && { color: Color.bg }]}>{index + 1}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: Padding.padding_15, paddingBottom: 50 },
  coverBanner: { backgroundColor: '#1E293B', borderRadius: Border.br_20, padding: Padding.padding_20, marginBottom: 40 },
  coverTitle: { fontFamily: FontFamily.notoSerifBold, fontSize: FontSize.fs_20, color: Color.bg, textAlign: 'center', marginBottom: Gap.gap_15 },
  coverInfoRow: { flexDirection: 'row', justifyContent: 'center', gap: Gap.gap_10, marginBottom: Gap.gap_20 },
  coverInfoChip: { fontFamily: FontFamily.notoSerifRegular, fontSize: FontSize.fs_12, color: '#1E293B', backgroundColor: Color.stroke, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, overflow: 'hidden' },
  sectionHeader: { borderBottomWidth: 2, borderColor: Color.stroke, paddingBottom: 10, marginBottom: 20 },
  sectionTitle: { fontFamily: FontFamily.notoSerifBold, fontSize: FontSize.fs_16, color: Color.text },
  instructionText: { fontFamily: FontFamily.notoSerifBold, fontSize: FontSize.fs_16, color: Color.text, marginBottom: Gap.gap_10 },
  passageText: { fontFamily: FontFamily.notoSerifRegular, fontSize: FontSize.fs_14, color: Color.color, lineHeight: 24, marginBottom: Gap.gap_15, backgroundColor: '#F8FAFC', padding: 15, borderRadius: Border.br_10 },
  imageOptionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: Gap.gap_15 },
  imageOptionCard: { width: '48%', aspectRatio: 1, borderWidth: 2, borderColor: Color.stroke, borderRadius: Border.br_15, padding: Padding.padding_10, alignItems: 'center', justifyContent: 'space-between' },
  optionImage: { flex: 1, width: '100%', borderRadius: Border.br_10 },
  optionLabel: { fontFamily: FontFamily.notoSerifRegular, fontSize: FontSize.fs_14, color: Color.gray, marginTop: 8 },
  textOptionsContainer: { gap: Gap.gap_10 },
  textOptionCard: { borderWidth: 2, borderColor: Color.stroke, borderRadius: Border.br_15, padding: Padding.padding_15 },
  textOptionContent: { fontFamily: FontFamily.notoSerifRegular, fontSize: FontSize.fs_16, color: Color.text, lineHeight: 24 },
  optionSelected: { borderColor: Color.main, backgroundColor: Color.greenLight },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBackground: { ...StyleSheet.absoluteFillObject },
  questionListContainer: { backgroundColor: Color.bg, borderTopLeftRadius: Border.br_20, borderTopRightRadius: Border.br_20, padding: Padding.padding_20, maxHeight: '70%' },
  questionListTitle: { fontFamily: FontFamily.notoSerifBold, fontSize: FontSize.fs_16, color: Color.text, marginBottom: Gap.gap_20, textAlign: 'center' },
  questionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Gap.gap_10, justifyContent: 'center' },
  questionBox: { width: 44, height: 44, borderRadius: Border.br_10, justifyContent: 'center', alignItems: 'center' },
  questionBoxPending: { backgroundColor: Color.stroke },
  questionBoxAnswered: { backgroundColor: Color.main },
  questionBoxText: { fontFamily: FontFamily.notoSerifRegular, fontSize: FontSize.fs_14, color: Color.gray },
  audioPlayerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: Padding.padding_10, borderRadius: Border.br_10, marginBottom: Gap.gap_10, borderWidth: 1, borderColor: Color.stroke },
  playButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: Color.main2, justifyContent: 'center', alignItems: 'center', marginRight: Gap.gap_10 },
  progressContainer: { flex: 1, justifyContent: 'center' },
  progressBarBg: { height: 6, backgroundColor: Color.stroke, borderRadius: 3, marginBottom: 6 },
  progressBarFill: { height: 6, backgroundColor: Color.main2, borderRadius: 3 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { fontFamily: FontFamily.notoSerifRegular, fontSize: FontSize.fs_12, color: Color.gray },
  contentImage: { width: '100%', height: 200, borderRadius: Border.br_10, marginBottom: Gap.gap_15, backgroundColor: '#F8FAFC' },
});

export default MultipleChoiceUI;