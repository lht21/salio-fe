import React from 'react';
import {
  Alert,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { BookOpenIcon, MicrophoneIcon, SpeakerHighIcon, XIcon } from 'phosphor-react-native';

import FeedbackPopup from '../../../../components/Modals/Popup/FeedbackPopup';
import IntroPopup from '../../../../components/Modals/Popup/IntroPopup';
import { Border, Color, FontFamily, FontSize, Gap } from '../../../../constants/GlobalStyles';
import LessonService from '../../../../api/services/lesson.service';
import { SpeakingItem as BESpeakingItem } from '../../../../api/types/lesson.types';

// --- CONFIG CHUYÊN SÂU ---
type VoiceSlot = 'woman1' | 'woman2' | 'man1' | 'man2';

const voicePlaybackConfig: Record<VoiceSlot, { rate: number; pitch: number; fallbackSlot?: VoiceSlot }> = {
  woman1: { rate: 1.0, pitch: 1.3 }, // Nữ trẻ, cao
  woman2: { rate: 0.85, pitch: 0.8 }, // Nữ trầm, chậm
  man1: { rate: 0.95, pitch: 0.85 }, // Nam rất trầm
  man2: { rate: 1.0, pitch: 1.1 }, // Nam trẻ, cao hơn
};

const voiceSlotConfig: Record<VoiceSlot, { keywords: string[]; fallbackIndex: number; excludedKeywords?: string[] }> = {
  woman1: { keywords: ['female', 'woman', 'yuna', 'sora', 'sunhi', 'a'], fallbackIndex: 0 },
  woman2: { keywords: ['female', 'woman', 'nari', 'soyoung', 'jihyun', 'b'], fallbackIndex: 1 },
  man1: {
    keywords: ['male', 'man', 'minho', 'jinho', 'dong', 'c'],
    fallbackIndex: 0,
    excludedKeywords: ['female', 'woman'],
  },
  man2: {
    keywords: ['male', 'man', 'taeho', 'seok', 'woo', 'd'],
    fallbackIndex: 1,
    excludedKeywords: ['female', 'woman'],
  },
};

const avatarBySpeaker: Record<string, any> = {
  woman1: require('../../../../assets/images/horani/woman1.png'),  
  woman2: require('../../../../assets/images/horani/woman2.png'), 
  man1: require('../../../../assets/images/horani/man1.png'),     
  man2: require('../../../../assets/images/horani/man2.png'),   
};

const waveformBars = [18, 28, 40, 24, 34, 48, 30, 22, 38, 26, 20];

export default function SpeakingPracticeScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const resolvedLessonId = lessonId || '1';

  // --- States ---
  const [items, setItems] = React.useState<BESpeakingItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showIntroModal, setShowIntroModal] = React.useState(true);
  const [recordingState, setRecordingState] = React.useState<'idle' | 'requesting' | 'recording' | 'recorded'>('idle');
  const [recordedUris, setRecordedUris] = React.useState<Record<string, string>>({});
  const [recordedDurations, setRecordedDurations] = React.useState<Record<string, number>>({});
  const [feedbackState, setFeedbackState] = React.useState<'hidden' | 'success' | 'failure'>('hidden');
  const [isPlayingUserAudio, setIsPlayingUserAudio] = React.useState(false);
  const [isPlayingSampleId, setIsPlayingSampleId] = React.useState<string | null>(null);
  const [waveTick, setWaveTick] = React.useState(0);
  
  // State lưu trữ bản đồ giọng nói thực tế của máy
  const [voiceMap, setVoiceMap] = React.useState<Record<string, Speech.Voice | null>>({});

  // --- Refs & Animation ---
  const recordingRef = React.useRef<Audio.Recording | null>(null);
  const playbackRef = React.useRef<Audio.Sound | null>(null);
  const recordingStartRef = React.useRef<number | null>(null);
  const contentOpacity = React.useRef(new Animated.Value(0)).current;
  const contentTranslateY = React.useRef(new Animated.Value(24)).current;
  const feedbackOpacity = React.useRef(new Animated.Value(0)).current;
  const feedbackTranslateY = React.useRef(new Animated.Value(150)).current;

  // --- LOGIC CHỌN GIỌNG NÓI ---
  const initVoices = async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      const koreanVoices = voices.filter(v => v.language.toLowerCase().startsWith('ko'));
      const usedIdentifiers = new Set<string>();
      const newVoiceMap: Record<string, Speech.Voice | null> = {};

      const slots: VoiceSlot[] = ['woman1', 'woman2', 'man1', 'man2'];

      slots.forEach(slot => {
        const config = voiceSlotConfig[slot];
        // Tìm các giọng khớp từ khóa và không nằm trong danh sách loại trừ
        const matches = koreanVoices.filter(v => {
          const haystack = `${v.name} ${v.identifier}`.toLowerCase();
          const hasKeyword = config.keywords.some(word => haystack.includes(word));
          const hasExcluded = config.excludedKeywords?.some(word => haystack.includes(word));
          return hasKeyword && !hasExcluded;
        });

        // Ưu tiên chọn giọng chưa bị slot khác chiếm
        const finalVoice = matches.find(v => !usedIdentifiers.has(v.identifier)) 
                          || matches[0] 
                          || koreanVoices[config.fallbackIndex] 
                          || koreanVoices[0];

        if (finalVoice) {
          usedIdentifiers.add(finalVoice.identifier);
          newVoiceMap[slot] = finalVoice;
        }
      });

      setVoiceMap(newVoiceMap);
    } catch (e) {
      console.warn("Không thể tải danh sách giọng nói hệ thống");
    }
  };

  // --- Fetch API & Voices ---
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const modulesRes = await LessonService.getModules(resolvedLessonId);
        const speakingItems = modulesRes.data.speaking;
        const itemsRes = await Promise.all(
          speakingItems.map((item: any) => LessonService.getSkillItem<BESpeakingItem>(resolvedLessonId, 'speaking', typeof item === 'string' ? item : item._id))
        );
        
        setItems(itemsRes.map((res: any) => res.data || res));
        await initVoices(); // Khởi tạo giọng nói sau khi có data
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải bài tập.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    return () => { stopPlayback(); stopRecordingIfNeeded(); };
  }, [resolvedLessonId]);

  // Chuyển bài animation
  React.useEffect(() => {
    if (isLoading) return;
    contentOpacity.setValue(0);
    contentTranslateY.setValue(24);
    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 1, duration: 360, useNativeDriver: true }),
      Animated.timing(contentTranslateY, { toValue: 0, duration: 420, useNativeDriver: true }),
    ]).start();
  }, [currentIndex, isLoading]);

  // Waveform tick
  React.useEffect(() => {
    if (recordingState !== 'recording') return;
    const t = setInterval(() => setWaveTick(v => v + 1), 140);
    return () => clearInterval(t);
  }, [recordingState]);

  const currentItem = items[currentIndex];

  const stopPlayback = async () => {
    if (playbackRef.current) {
      try {
        await playbackRef.current.stopAsync();
        await playbackRef.current.unloadAsync();
      } catch (error) {
        console.log("Error stopping audio:", error);
      }
      playbackRef.current = null;
    }
    setIsPlayingUserAudio(false);
    setIsPlayingSampleId(null);
    Speech.stop();
  };

  const stopRecordingIfNeeded = async () => {
    if (recordingRef.current) {
      try { await recordingRef.current.stopAndUnloadAsync(); } catch {}
      recordingRef.current = null;
    }
  };

  const handleMicPress = async () => {
    if (recordingState === 'recording') {
      try {
        await recordingRef.current?.stopAndUnloadAsync();
        const uri = recordingRef.current?.getURI();
        const duration = Date.now() - (recordingStartRef.current || 0);
        if (uri) {
          setRecordedUris(prev => ({ ...prev, [currentItem._id]: uri }));
          setRecordedDurations(prev => ({ ...prev, [currentItem._id]: duration }));
        }
        setRecordingState('recorded');
      } catch { setRecordingState('idle'); }
    } else {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;
      await stopPlayback();
      try {
        setRecordingState('requesting');
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        recordingRef.current = recording;
        recordingStartRef.current = Date.now();
        setRecordingState('recording');
      } catch { setRecordingState('idle'); }
    }
  };

  const showFeedback = (type: 'success' | 'failure') => {
    setFeedbackState(type);
    feedbackOpacity.setValue(0);
    feedbackTranslateY.setValue(type === 'success' ? 150 : 40); 
    Animated.parallel([
      Animated.timing(feedbackOpacity, { toValue: 1, duration: 240, useNativeDriver: true }),
      Animated.timing(feedbackTranslateY, { toValue: 0, duration: 360, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  };

  const handleEvaluatePress = async () => {
    const uri = recordedUris[currentItem._id];
    if (!uri) return;
    try {
      setRecordingState('requesting');
      const res = await LessonService.submitAudio(resolvedLessonId, currentItem._id, uri, recordedDurations[currentItem._id]);
      
      // Truy cập an toàn để không bị crash nếu cấu trúc object thay đổi
      const submissionData = res?.data?.data?.submission || res?.data?.submission || res?.submission;
      const evaluation = submissionData?.evaluation || res?.data?.data?.aiEvaluation || res?.data?.aiEvaluation;

      if (!evaluation) {
        throw new Error('Không nhận được kết quả đánh giá từ hệ thống.');
      }

      const isPassed = evaluation.percentage >= (currentItem.passingScore || 70);
      showFeedback(isPassed ? 'success' : 'failure');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'AI không thể chấm điểm lúc này.';
      console.error('Speaking assessment failed:', error?.response?.data || error);
      Alert.alert('Lỗi', message);
    } finally {
      setRecordingState('recorded');
    }
  };

  const speakText = (id: string, text: string, speakerSlot: string) => {
    Speech.stop();
    setIsPlayingSampleId(id);

    // Lấy giọng nói thực tế từ Map
    const voice = voiceMap[speakerSlot];
    // Lấy thông số Playback (Pitch/Rate)
    const config = voicePlaybackConfig[speakerSlot as VoiceSlot] || { pitch: 1.0, rate: 1.0 };

    Speech.speak(text, {
      language: 'ko-KR',
      voice: voice?.identifier, // ID của bộ giọng thực tế giúp thay đổi âm sắc (Timbre)
      pitch: config.pitch,
      rate: config.rate,
      onDone: () => setIsPlayingSampleId(null),
      onStopped: () => setIsPlayingSampleId(null),
      onError: () => setIsPlayingSampleId(null),
    });
  };

  const goNext = () => {
    if (currentIndex === items.length - 1) {
      router.replace(`/lessons/${resolvedLessonId}/speaking/result` as any);
    } else {
      setFeedbackState('hidden');
      setRecordingState('idle');
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={Color.cam} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.sheetTop}>
          <Text style={styles.counter}>{currentIndex + 1}/{items.length}</Text>
          <Pressable onPress={() => router.back()} hitSlop={10}><XIcon size={22} color="#A1A1AA" weight="bold" /></Pressable>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${((currentIndex + 1) / items.length) * 100}%` }]} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentTranslateY }], gap: 16 }}>
            
            <SectionTitle title={currentItem.title} />
            <Text style={styles.instructionText}>{currentItem.prompt}</Text>

            {currentItem.type === 'shadowing' ? (
              <>
                <View style={styles.card}>
                  {currentItem?.scripts?.map((s, idx) => (
                    <LineRow 
                      key={idx} 
                      line={s} 
                      isPlaying={isPlayingSampleId === (s._id || idx.toString())} 
                      onPressSpeaker={() => speakText(s._id || idx.toString(), s.korean, s.speaker)} 
                    />
                  ))}
                </View>

                <SectionTitle title="Câu cần luyện nói" />
                <View style={styles.card}>
                  <View style={styles.sampleAnswerBox}>
                    <Text style={styles.lineKorean}>{currentItem.sampleAnswer}</Text>
                    <Text style={styles.lineTranslation}>{currentItem.sampleTranslation}</Text>
                  </View>
                  <RecordPad recordingState={recordingState} waveTick={waveTick} onPress={handleMicPress} instruction={currentItem.instruction} />
                </View>
              </>
            ) : (
              <>
                <View style={styles.dialogueWrap}>
                    {currentItem?.scripts?.map((s, idx) => (
                      <DialogueBubble 
                        key={idx} 
                        line={s} 
                        isPlaying={isPlayingSampleId === (s._id || idx.toString())} 
                        onPressSpeaker={() => speakText(s._id || idx.toString(), s.korean, s.speaker)} 
                      />
                    ))}
                </View>
                <RecordPad recordingState={recordingState} waveTick={waveTick} onPress={handleMicPress} instruction={currentItem.instruction} />
              </>
            )}

            {recordedUris[currentItem._id] && (
              <View style={styles.evaluationArea}>
                <Pressable 
                  style={styles.replayButton} 
                  onPress={async () => {
                    if (isPlayingUserAudio) {
                      await stopPlayback();
                    } else {
                      await stopPlayback(); 
                      
                      const uri = recordedUris[currentItem._id];
                      const { sound } = await Audio.Sound.createAsync(
                        { uri }, 
                        { shouldPlay: true }
                      );
                      
                      playbackRef.current = sound;
                      setIsPlayingUserAudio(true);

                      sound.setOnPlaybackStatusUpdate((s: any) => {
                        if (s.didJustFinish) {
                          setIsPlayingUserAudio(false);
                          sound.unloadAsync();
                          playbackRef.current = null;
                        }
                      });
                    }
                  }}
                >
                  <SpeakerHighIcon 
                    size={18} 
                    color={Color.cam} 
                    weight={isPlayingUserAudio ? "fill" : "regular"} 
                  />
                  <Text style={styles.replayText}>
                    {isPlayingUserAudio ? 'Đang phát - Bấm để dừng' : 'Nghe lại giọng mình'}
                  </Text>
                </Pressable>

                <Pressable 
                  style={[styles.evaluateButton, recordingState === 'requesting' && styles.evaluateButtonDisabled]} 
                  onPress={handleEvaluatePress} 
                  disabled={recordingState === 'requesting'}
                >
                  {recordingState === 'requesting' ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.evaluateButtonText}>Kiểm tra</Text>
                  )}
                </Pressable>
              </View>
            )}
          </Animated.View>
        </ScrollView>

        <View style={styles.bottomAction}>
          <Pressable style={[styles.micButtonOuter, recordingState === 'recording' && styles.micButtonOuterActive]} onPress={handleMicPress}>
            <View style={styles.micButtonInner}><MicrophoneIcon size={30} color={Color.cam} weight="fill" /></View>
          </Pressable>
        </View>
      </View>

      <IntroPopup visible={showIntroModal} onClose={() => setShowIntroModal(false)} description={currentItem.prompt} mascotSources={[require('../../../../assets/images/horani/popup.png')]} />
      
      <FeedbackPopup 
        visible={feedbackState !== 'hidden'} 
        type={feedbackState === 'failure' ? 'failure' : 'success'} 
        onNext={goNext} 
        onOutsidePress={() => setFeedbackState('hidden')}
        translateY={feedbackTranslateY}
        opacity={feedbackOpacity}
        imageSource={feedbackState === 'failure' ? require('../../../../assets/images/horani/failure.png') : require('../../../../assets/images/horani/success.png')}
      />
    </SafeAreaView>
  );
}

// --- Sub-components (Avatar mapping) ---
const SectionTitle = ({ title }: { title: string }) => (
  <View style={styles.sectionTitleRow}>
    <BookOpenIcon size={18} color={Color.cam} weight="fill" />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const LineRow = ({ line, isPlaying, onPressSpeaker }: any) => (
  <View style={styles.lineRow}>
    <Image source={avatarBySpeaker[line.speaker] || avatarBySpeaker.man1} style={styles.avatar} />
    <View style={styles.lineContent}>
      <Text style={styles.lineKoreanSmall}>{line.korean}</Text>
      <Text style={styles.lineTranslationSmall}>{line.vietnamese}</Text>
    </View>
    <Pressable onPress={onPressSpeaker}><SpeakerHighIcon size={18} color={isPlaying ? '#FF8B2B' : Color.cam} weight="fill" /></Pressable>
  </View>
);

const DialogueBubble = ({ line, isPlaying, onPressSpeaker }: any) => {
  const speakerRole = line.speaker;
  const isWoman = speakerRole.includes('woman');
  return (
    <View style={[styles.dialogueRow, isWoman && styles.dialogueRowReverse]}>
      <Image source={avatarBySpeaker[speakerRole] || avatarBySpeaker.man1} style={styles.avatarLarge} />
      <View style={[styles.dialogueBubble, isWoman ? styles.dialogueBubbleRight : styles.dialogueBubbleLeft]}>
        <Text style={styles.lineKorean}>{line.korean}</Text>
        <Text style={styles.lineTranslation}>{line.vietnamese}</Text>
        <Pressable onPress={onPressSpeaker} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
            <SpeakerHighIcon size={18} color={isPlaying ? '#FF8B2B' : Color.cam} weight="fill" />
        </Pressable>
      </View>
    </View>
  );
};

const RecordPad = ({ recordingState, waveTick, onPress, instruction }: any) => (
  <Pressable style={[styles.answerPad, recordingState === 'recording' && styles.answerPadRecording]} onPress={onPress}>
    <View style={styles.waveformRow}>
      {waveformBars.map((b, i) => (
        <View key={i} style={[styles.waveformBar, { height: recordingState === 'recording' ? Math.max(12, b + ((waveTick + i) % 5) * 4 - 8) : 14, opacity: recordingState === 'recording' ? 1 : 0.3 }]} />
      ))}
    </View>
    <Text style={styles.answerPadText}>{recordingState === 'recording' ? 'Đang ghi âm... Nhấn để dừng' : 'Nhấn vào Micro để bắt đầu ghi âm'}</Text>
    <Text style={styles.hintText}>{instruction}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#4A4A4A' },
  sheet: { flex: 1, backgroundColor: Color.bg, borderTopLeftRadius: 26, borderTopRightRadius: 26, overflow: 'hidden' },
  sheetTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  counter: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 16, color: Color.text },
  progressTrack: { height: 4, backgroundColor: '#E5E5E5' },
  progressFill: { height: '100%', backgroundColor: Color.main },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 4 },
  sectionTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 15, color: Color.text },
  instructionText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: 14, color: '#666', lineHeight: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 18, padding: 14, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, gap: 12 },
  lineRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 28, height: 28, borderRadius: 14 },
  avatarLarge: { width: 36, height: 36, borderRadius: 18 },
  lineContent: { flex: 1 },
  lineKorean: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 16, color: Color.text, lineHeight: 24 },
  lineTranslation: { fontFamily: FontFamily.lexendDecaRegular, fontSize: 14, color: '#888', fontStyle: 'italic' },
  lineKoreanSmall: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 14, color: Color.text },
  lineTranslationSmall: { fontFamily: FontFamily.lexendDecaRegular, fontSize: 12, color: '#AAA' },
  sampleAnswerBox: { paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', marginBottom: 5 },
  answerPad: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#CCC', borderRadius: 15, padding: 20, alignItems: 'center', backgroundColor: '#FFFDF9' },
  answerPadRecording: { borderColor: Color.main, backgroundColor: '#F0FFF4' },
  answerPadText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 13, color: '#666', marginTop: 10 },
  hintText: { fontSize: 11, color: '#AAA', textAlign: 'center', marginTop: 4 },
  waveformRow: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 30 },
  waveformBar: { width: 3, backgroundColor: '#67C76B', borderRadius: 2 },
  evaluationArea: { gap: 10, marginTop: 10 },
  replayButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  replayText: { fontSize: 13, color: Color.cam, fontFamily: FontFamily.lexendDecaMedium },
  evaluateButton: { backgroundColor: Color.cam, borderRadius: 25, height: 48, alignItems: 'center', justifyContent: 'center' },
  evaluateButtonDisabled: { backgroundColor: '#CCC' },
  evaluateButtonText: { color: '#FFF', fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 15 },
  dialogueWrap: { gap: 16 },
  dialogueRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  dialogueRowReverse: { flexDirection: 'row-reverse' },
  dialogueBubble: { maxWidth: '80%', padding: 14, borderRadius: 18, backgroundColor: '#FFF', elevation: 2 },
  dialogueBubbleLeft: { borderTopLeftRadius: 2 },
  dialogueBubbleRight: { borderTopRightRadius: 2, backgroundColor: '#FFF9F2' },
  bottomAction: { paddingBottom: 25, alignItems: 'center' },
  micButtonOuter: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFEAAE', alignItems: 'center', justifyContent: 'center' },
  micButtonOuterActive: { backgroundColor: '#FFF2C7' },
  micButtonInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF7D7', alignItems: 'center', justifyContent: 'center' },
});
