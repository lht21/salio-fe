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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import * as Speech from 'expo-speech';
import { BookOpenIcon, MicrophoneIcon, SpeakerHighIcon, XIcon } from 'phosphor-react-native';

import FeedbackPopup from '../../../../components/Modals/Popup/FeedbackPopup';
import IntroPopup from '../../../../components/Modals/Popup/IntroPopup';
import { Border, Color, FontFamily, FontSize, Gap } from '../../../../constants/GlobalStyles';

type SpeakerRole = 'woman' | 'man';
type VoiceSlot = 'woman1' | 'woman2' | 'man1' | 'man2';
type DialogueLine = {
  id: string;
  speaker: SpeakerRole;
  voiceSlot: VoiceSlot;
  korean: string;
  vietnamese?: string;
};

type SpeakingItem =
  | {
      id: string;
      type: 'model-response';
      sampleTitle: string;
      sampleLines: DialogueLine[];
      practicePrompt: DialogueLine;
      hint: string;
    }
  | {
      id: string;
      type: 'shadow-dialogue';
      prompt: string;
      dialogueLines: DialogueLine[];
    };

type FeedbackState = 'hidden' | 'success' | 'failure';

type VoiceMeta = {
  identifier?: string;
  language?: string;
  name?: string;
};

const voicePlaybackConfig: Record<VoiceSlot, { rate: number; pitch: number; fallbackSlot?: VoiceSlot }> = {
  woman1: { rate: 0.94, pitch: 1.12 },
  woman2: { rate: 0.92, pitch: 1.06 },
  man1: { rate: 0.82, pitch: 0.68, fallbackSlot: 'man2' },
  man2: { rate: 0.9, pitch: 0.88, fallbackSlot: 'man1' },
};

const voiceSlotConfig: Record<VoiceSlot, { keywords: string[]; fallbackIndex: number; excludedKeywords?: string[]; strict?: boolean }> = {
  woman1: { keywords: ['female', 'woman', 'girl', 'yuna', 'sora', 'sunhi'], fallbackIndex: 0 },
  woman2: { keywords: ['female', 'woman', 'girl', 'nari', 'soyoung', 'jihyun'], fallbackIndex: 1 },
  man1: {
    keywords: ['male', 'man', 'boy', 'minho', 'tae', 'seok', 'woo', 'jinho', 'dong'],
    fallbackIndex: 0,
    excludedKeywords: ['female', 'woman', 'girl', 'yuna', 'sora', 'sunhi', 'nari', 'soyoung', 'jihyun'],
    strict: true,
  },
  man2: {
    keywords: ['male', 'man', 'boy', 'tae', 'ho', 'seok', 'woo', 'min'],
    fallbackIndex: 1,
    excludedKeywords: ['female', 'woman', 'girl', 'yuna', 'sora', 'sunhi', 'nari', 'soyoung', 'jihyun'],
    strict: true,
  },
};

const SPEAKING_ITEMS: SpeakingItem[] = [
  {
    id: 'spk-1',
    type: 'model-response',
    sampleTitle: 'Mẫu (보기)',
    sampleLines: [
      { id: 's1-1', speaker: 'woman', voiceSlot: 'woman1', korean: '안녕하세요? 저는 김민준입니다.' },
      { id: 's1-2', speaker: 'man', voiceSlot: 'man1', korean: '제 이름은 히엔입니다.' },
    ],
    practicePrompt: {
      id: 's1-3',
      speaker: 'man',
      voiceSlot: 'man2',
      korean: '안녕하세요? 저는 박수빈입니다.',
    },
    hint: 'Trả lời theo mẫu câu ở trên và có thể bắt đầu bằng cách chào hỏi và giới thiệu tên của bạn nhé.',
  },
  {
    id: 'spk-2',
    type: 'model-response',
    sampleTitle: 'Mẫu (보기)',
    sampleLines: [
      { id: 's2-1', speaker: 'man', voiceSlot: 'man1', korean: '란 씨는 베트남 사람입니까?' },
      { id: 's2-2', speaker: 'woman', voiceSlot: 'woman2', korean: '네, 베트남 사람입니다.' },
    ],
    practicePrompt: {
      id: 's2-3',
      speaker: 'man',
      voiceSlot: 'man2',
      korean: '이유나 씨는 한국 사람입니까?',
    },
    hint: 'Lặp lại câu trả lời tương tự câu mẫu và chú ý ngữ điều khẳng định.',
  },
  {
    id: 'spk-3',
    type: 'shadow-dialogue',
    prompt: 'Hãy nghe và đọc theo đoạn hội thoại dưới đây.',
    dialogueLines: [
      { id: 's3-1', speaker: 'man', voiceSlot: 'man1', korean: '안녕하세요? 저는 박준영입니다.', vietnamese: 'Xin chào? Tôi là Park Jun-young.' },
      {
        id: 's3-2',
        speaker: 'woman',
        voiceSlot: 'woman1',
        korean: '안녕하세요? 제 이름은 흐엉입니다. 박준영 씨는 한국 사람입니까?',
        vietnamese: 'Xin chào? Tên tôi là Hương. Anh Park Jun-young là người Hàn Quốc phải không ạ?',
      }, 
      {
        id: 's3-3',
        speaker: 'man',
        voiceSlot: 'man1',
        korean: '네, 한국 사람입니다. 흐엉 씨는 말레이시아 사람입니까?',
        vietnamese: 'Vâng, là người Hàn Quốc. Chị Hương là người Malaysia phải không ạ?',
      },
      {
        id: 's3-4',
        speaker: 'woman',
        voiceSlot: 'woman1',
        korean: '아니요, 저는 베트남 사람입니다.',
        vietnamese: 'Không, tôi là người Việt Nam.',
      },
    ],
  },
  {
    id: 'spk-4',
    type: 'shadow-dialogue',
    prompt: 'Hãy nghe và đọc theo đoạn hội thoại dưới đây.',
    dialogueLines: [
      { id: 's4-1', speaker: 'man', voiceSlot: 'man1', korean: '박준영 씨, 이 사람은 풍 씨입니다. 풍 씨, 이 사람은 박준영 씨입니다.', vietnamese: 'Anh Park Jun-young, đây là anh Phong.' },
      {
        id: 's4-2',
        speaker: 'woman',
        voiceSlot: 'woman2',
        korean: '안녕하세요? 박준영입니다.',
        vietnamese: 'Xin chào? Tôi là Park Jun-young.',
      }, 
      {
        id: 's4-3',
        speaker: 'man',
        voiceSlot: 'man2',
        korean: '안녕하세요? 제 이름은 풍입니다. 반갑습니다.',
        vietnamese: 'Xin chào? Tên tôi là Phong. Rất vui được gặp.',
      },
    ],
  },
];

const avatarBySpeaker = {
  woman: require('../../../../assets/images/tubo/woman.png'),
  man: require('../../../../assets/images/tubo/man.png'),
} as const;

const introMascots = [
  require('../../../../assets/images/tubo/popup.png'),
];

const feedbackImages = {
  success: require('../../../../assets/images/tubo/success.png'),
  failure: require('../../../../assets/images/tubo/failure.png'),
} as const;

const waveformBars = [18, 28, 40, 24, 34, 48, 30, 22, 38, 26, 20];
const evaluationThresholds: Record<SpeakingItem['type'], number> = {
  'model-response': 1600,
  'shadow-dialogue': 2200,
};

async function setPlaybackMode() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });
}

async function setRecordingMode() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });
}

function mockEvaluateRecording(durationMs: number, item: SpeakingItem) {
  return durationMs >= evaluationThresholds[item.type];
}

function getVoiceHaystack(voice: VoiceMeta) {
  return `${voice.name ?? ''} ${voice.identifier ?? ''} ${voice.language ?? ''}`.toLowerCase();
}

function pickVoiceForSlot(voices: VoiceMeta[], slot: VoiceSlot, usedIdentifiers: Set<string>) {
  const config = voiceSlotConfig[slot];
  const korean = voices.filter((voice) => voice.language?.toLowerCase().startsWith('ko'));
  const keywordMatches = korean.filter((voice) => {
    const haystack = getVoiceHaystack(voice);
    const matchesKeyword = config.keywords.some((word) => haystack.includes(word));
    const matchesExcludedKeyword = config.excludedKeywords?.some((word) => haystack.includes(word)) ?? false;
    return matchesKeyword && !matchesExcludedKeyword;
  });
  const base = keywordMatches.length ? keywordMatches : (korean.length ? korean : voices);

  const unusedVoice = base.find((voice) => voice.identifier && !usedIdentifiers.has(voice.identifier));
  if (unusedVoice?.identifier) {
    usedIdentifiers.add(unusedVoice.identifier);
    return unusedVoice;
  }

  return base[config.fallbackIndex] ?? base[0] ?? null;
}

function buildVoiceMap(voices: VoiceMeta[]) {
  const usedIdentifiers = new Set<string>();

  return {
    woman1: pickVoiceForSlot(voices, 'woman1', usedIdentifiers),
    woman2: pickVoiceForSlot(voices, 'woman2', usedIdentifiers),
    man1: pickVoiceForSlot(voices, 'man1', usedIdentifiers),
    man2: pickVoiceForSlot(voices, 'man2', usedIdentifiers),
  } satisfies Record<VoiceSlot, VoiceMeta | null>;
}

export default function SpeakingPracticeScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const resolvedLessonId = lessonId ?? '1';

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showIntroModal, setShowIntroModal] = React.useState(true);
  const [recordingState, setRecordingState] = React.useState<'idle' | 'requesting' | 'recording' | 'recorded'>('idle');
  const [recordedUris, setRecordedUris] = React.useState<Record<string, string>>({});
  const [recordedDurations, setRecordedDurations] = React.useState<Record<string, number>>({});
  const [feedbackState, setFeedbackState] = React.useState<FeedbackState>('hidden');
  const [isPlayingUserAudio, setIsPlayingUserAudio] = React.useState(false);
  const [isPlayingSampleId, setIsPlayingSampleId] = React.useState<string | null>(null);
  const [waveTick, setWaveTick] = React.useState(0);
  const [voiceMap, setVoiceMap] = React.useState<Record<VoiceSlot, VoiceMeta | null>>({
    woman1: null,
    woman2: null,
    man1: null,
    man2: null,
  });

  const recordingRef = React.useRef<Audio.Recording | null>(null);
  const playbackRef = React.useRef<Audio.Sound | null>(null);
  const recordingStartRef = React.useRef<number | null>(null);
  const hasPermissionRef = React.useRef(false);
  const speakingIdRef = React.useRef<string | null>(null);

  const contentOpacity = React.useRef(new Animated.Value(0)).current;
  const contentTranslateY = React.useRef(new Animated.Value(24)).current;
  const feedbackOpacity = React.useRef(new Animated.Value(0)).current;
  const feedbackTranslateY = React.useRef(new Animated.Value(150)).current;
  const micScale = React.useRef(new Animated.Value(1)).current;
  const shadowMicOpacity = React.useRef(new Animated.Value(0)).current;
  const shadowMicTranslateY = React.useRef(new Animated.Value(18)).current;

  const currentItem = SPEAKING_ITEMS[currentIndex];
  const progress = ((currentIndex + 1) / SPEAKING_ITEMS.length) * 100;

  React.useEffect(() => {
    void setPlaybackMode();
    void Speech.getAvailableVoicesAsync().then((voices) => {
      setVoiceMap(buildVoiceMap(voices as VoiceMeta[]));
    }).catch(() => undefined);

    return () => {
      void stopPlayback();
      void stopRecordingIfNeeded();
      Speech.stop();
    };
  }, []);

  React.useEffect(() => {
    contentOpacity.setValue(0);
    contentTranslateY.setValue(24);
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [contentOpacity, contentTranslateY, currentIndex]);

  React.useEffect(() => {
    if (recordingState !== 'recording') {
      micScale.stopAnimation();
      micScale.setValue(1);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(micScale, { toValue: 1.1, duration: 650, useNativeDriver: true }),
        Animated.timing(micScale, { toValue: 0.96, duration: 650, useNativeDriver: true }),
      ])
    );
    pulse.start();

    const timer = setInterval(() => {
      setWaveTick((value) => value + 1);
    }, 140);

    return () => {
      pulse.stop();
      micScale.setValue(1);
      clearInterval(timer);
    };
  }, [micScale, recordingState]);

  React.useEffect(() => {
    if (currentItem.type !== 'shadow-dialogue') {
      shadowMicOpacity.setValue(0);
      shadowMicTranslateY.setValue(18);
      return;
    }

    Animated.parallel([
      Animated.timing(shadowMicOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(shadowMicTranslateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentItem.type, shadowMicOpacity, shadowMicTranslateY]);

  const stopPlayback = React.useCallback(async () => {
    if (playbackRef.current) {
      try {
        await playbackRef.current.stopAsync();
        await playbackRef.current.unloadAsync();
      } catch {}
      playbackRef.current = null;
    }

    setIsPlayingUserAudio(false);
    setIsPlayingSampleId(null);
    Speech.stop();
    speakingIdRef.current = null;
  }, []);

  const stopRecordingIfNeeded = React.useCallback(async () => {
    if (!recordingRef.current) {
      return;
    }

    try {
      await recordingRef.current.stopAndUnloadAsync();
    } catch {}

    recordingRef.current = null;
    recordingStartRef.current = null;
    await setPlaybackMode();
  }, []);

  const ensureAudioPermission = React.useCallback(async () => {
    if (hasPermissionRef.current) {
      return true;
    }

    const permission = await Audio.requestPermissionsAsync();
    hasPermissionRef.current = permission.granted;
    if (!permission.granted) {
      Alert.alert('Cần quyền micro', 'Hãy cho phép microphone để ghi âm bài nói và nghe lại giọng nói của bạn.');
    }
    return permission.granted;
  }, []);

  const playUserRecording = React.useCallback(async (uri: string) => {
    await stopPlayback();
    await setPlaybackMode();

    const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
    playbackRef.current = sound;
    setIsPlayingUserAudio(true);
    sound.setOnPlaybackStatusUpdate((status) => {
      if ('didJustFinish' in status && status.didJustFinish) {
        setIsPlayingUserAudio(false);
        void sound.unloadAsync();
        if (playbackRef.current === sound) {
          playbackRef.current = null;
        }
      }
    });
  }, [stopPlayback]);

  const speakSample = React.useCallback(async (line: DialogueLine) => {
    await stopPlayback();
    setIsPlayingSampleId(line.id);
    speakingIdRef.current = line.id;

    const playbackConfig = voicePlaybackConfig[line.voiceSlot];
    const selectedVoice = voiceMap[line.voiceSlot] ?? (playbackConfig.fallbackSlot ? voiceMap[playbackConfig.fallbackSlot] : null);
    Speech.speak(line.korean, {
      language: selectedVoice?.language ?? 'ko-KR',
      voice: selectedVoice?.identifier,
      rate: playbackConfig.rate,
      pitch: playbackConfig.pitch,
      onDone: () => {
        if (speakingIdRef.current === line.id) {
          setIsPlayingSampleId(null);
          speakingIdRef.current = null;
        }
      },
      onStopped: () => {
        if (speakingIdRef.current === line.id) {
          setIsPlayingSampleId(null);
          speakingIdRef.current = null;
        }
      },
      onError: () => {
        setIsPlayingSampleId(null);
        speakingIdRef.current = null;
      },
    });
  }, [stopPlayback, voiceMap]);

  const showFeedback = React.useCallback((type: Exclude<FeedbackState, 'hidden'>) => {
    setFeedbackState(type);
    feedbackOpacity.setValue(0);
    feedbackTranslateY.setValue(type === 'success' ? 150 : 40);
    Animated.parallel([
      Animated.timing(feedbackOpacity, { toValue: 1, duration: 240, useNativeDriver: true }),
      Animated.timing(feedbackTranslateY, {
        toValue: 0,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [feedbackOpacity, feedbackTranslateY]);

  const goNext = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(feedbackOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(feedbackTranslateY, {
        toValue: feedbackState === 'success' ? 150 : 40,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setFeedbackState('hidden');
      setRecordingState('idle');
      if (currentIndex === SPEAKING_ITEMS.length - 1) {
        router.replace(`/lessons/${resolvedLessonId}/speaking/result` as any);
        return;
      }
      setCurrentIndex((prev) => prev + 1);
    });
  }, [currentIndex, feedbackOpacity, feedbackState, feedbackTranslateY, resolvedLessonId, router]);

  const startRecording = React.useCallback(async () => {
    const granted = await ensureAudioPermission();
    if (!granted) {
      return;
    }

    await stopPlayback();
    await stopRecordingIfNeeded();

    try {
      setRecordingState('requesting');
      await setRecordingMode();
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      recordingRef.current = recording;
      recordingStartRef.current = Date.now();
      setRecordingState('recording');
    } catch {
      setRecordingState('idle');
      Alert.alert('Không thể ghi âm', 'Hệ thống chưa bắt đầu ghi âm được. Bạn thử lại giúp mình nhé.');
    }
  }, [ensureAudioPermission, stopPlayback, stopRecordingIfNeeded]);

  const stopRecordingAndEvaluate = React.useCallback(async () => {
    if (!recordingRef.current) {
      return;
    }

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      const durationMs = recordingStartRef.current ? Date.now() - recordingStartRef.current : 0;
      recordingRef.current = null;
      recordingStartRef.current = null;
      await setPlaybackMode();

      if (!uri) {
        setRecordingState('idle');
        Alert.alert('Không tìm thấy bản ghi', 'Đã dừng ghi âm nhưng chưa lấy được file audio.');
        return;
      }

      setRecordedUris((prev) => ({ ...prev, [currentItem.id]: uri }));
      setRecordedDurations((prev) => ({ ...prev, [currentItem.id]: durationMs }));
      setRecordingState('recorded');
    } catch {
      setRecordingState('idle');
      Alert.alert('Dừng ghi âm thất bại', 'Bạn thử nhận microphone lại một lần nữa nhé.');
    }
  }, [currentItem]);

  const handleEvaluatePress = React.useCallback(() => {
    const uri = recordedUris[currentItem.id];
    if (!uri) {
      Alert.alert('Chưa có bản ghi', 'Hãy thu âm câu này trước, sau đó bạn có thể nghe lại rồi bấm đánh giá.');
      return;
    }

    const recordingDurationMs = recordedDurations[currentItem.id] ?? 0;
    const isCorrect = mockEvaluateRecording(recordingDurationMs, currentItem);
    showFeedback(isCorrect ? 'success' : 'failure');
  }, [currentItem, recordedDurations, recordedUris, showFeedback]);

  const handleMicPress = React.useCallback(() => {
    const run = async () => {
      if (feedbackState !== 'hidden' || recordingState === 'requesting') {
        return;
      }
      if (recordingState === 'idle' || recordingState === 'recorded') {
        await startRecording();
        return;
      }
      if (recordingState === 'recording') {
        await stopRecordingAndEvaluate();
      }
    };

    void run();
  }, [feedbackState, recordingState, startRecording, stopRecordingAndEvaluate]);

  const handleReplayVoice = React.useCallback(() => {
    const uri = recordedUris[currentItem.id];
    if (!uri) {
      Alert.alert('Chưa có bản ghi', 'Hãy thu âm câu này trước de nghe lai giong cua ban.');
      return;
    }
    void playUserRecording(uri);
  }, [currentItem.id, playUserRecording, recordedUris]);

  const dismissIntroModal = React.useCallback(() => {
    setShowIntroModal(false);
  }, []);

  const retryCurrentItem = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(feedbackOpacity, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(feedbackTranslateY, { toValue: 40, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setFeedbackState('hidden');
      setRecordingState('idle');
    });
  }, [feedbackOpacity, feedbackTranslateY]);

  const currentRecordedUri = recordedUris[currentItem.id];

  const handleClose = React.useCallback(() => {
    const run = async () => {
      await stopPlayback();
      await stopRecordingIfNeeded();
      router.back();
    };
    void run();
  }, [router, stopPlayback, stopRecordingIfNeeded]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.sheet}>
          <View style={styles.sheetTop}>
            <Text style={styles.counter}>{currentIndex + 1}/{SPEAKING_ITEMS.length}</Text>
            <Pressable onPress={handleClose} hitSlop={10}>
              <XIcon size={22} color="#A1A1AA" weight="bold" />
            </Pressable>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Animated.View
              style={[
                styles.animatedContent,
                {
                  opacity: contentOpacity,
                  transform: [{ translateY: contentTranslateY }],
                },
              ]}
            >
              {currentItem.type === 'model-response' ? (
                <>
                  <SectionTitle title={currentItem.sampleTitle} />
                  <View style={styles.card}>
                    {currentItem.sampleLines.map((line) => (
                      <LineRow key={line.id} line={line} isPlaying={isPlayingSampleId === line.id} onPressSpeaker={speakSample} />
                    ))}
                  </View>

                  <SectionTitle title="Luyện tập (연습)" />
                  <View style={styles.card}>
                    <LineRow
                      line={currentItem.practicePrompt}
                      isPlaying={isPlayingSampleId === currentItem.practicePrompt.id}
                      onPressSpeaker={speakSample}
                    />

                    <Pressable
                      style={[
                        styles.answerPad,
                        recordingState === 'recording' && styles.answerPadRecording,
                        recordingState === 'requesting' && styles.answerPadPending,
                      ]}
                      onPress={handleMicPress}
                    >
                      <Waveform active={recordingState === 'recording'} tick={waveTick} />
                      <Text style={styles.answerPadText}>
                        {recordingState === 'requesting'
                          ? 'Đang bật microphone...'
                          : recordingState === 'recording'
                            ? 'Nhấn mic lần nữa để tạm dừng ghi âm'
                            : recordingState === 'recorded'
                              ? 'Bạn đã ghi âm xong. Có thể nghe lại, thử lại hoặc bấm đánh giá'
                              : 'Nhấn để trả lời'}
                      </Text>
                      <Text style={styles.hintText}>{currentItem.hint}</Text>
                    </Pressable>

                    <Pressable style={styles.replayButton} onPress={handleReplayVoice}>
                      <SpeakerHighIcon size={18} color={Color.cam} weight="fill" />
                      <Text style={styles.replayText}>{isPlayingUserAudio ? 'Đang phát bản ghi của bạn' : 'Nghe lại giọng mình'}</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.evaluateButton, !currentRecordedUri && styles.evaluateButtonDisabled]}
                      onPress={handleEvaluatePress}
                      disabled={!currentRecordedUri || recordingState === 'recording' || recordingState === 'requesting'}
                    >
                      <Text style={[styles.evaluateButtonText, !currentRecordedUri && styles.evaluateButtonTextDisabled]}>
                        Đánh giá bài nói
                      </Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <SectionTitle title="Luyện đọc hội thoại" />
                  <Text style={styles.dialoguePrompt}>{currentItem.prompt}</Text>

                  <View style={styles.dialogueWrap}>
                    {currentItem.dialogueLines.map((line) => (
                      <DialogueBubble key={line.id} line={line} isPlaying={isPlayingSampleId === line.id} onPressSpeaker={speakSample} />
                    ))}
                  </View>

                  <Animated.View style={{ opacity: shadowMicOpacity, transform: [{ translateY: shadowMicTranslateY }] }}>
                    <Pressable
                      style={[
                        styles.answerPad,
                        recordingState === 'recording' && styles.answerPadRecording,
                        recordingState === 'requesting' && styles.answerPadPending,
                      ]}
                      onPress={handleMicPress}
                    >
                      <Waveform active={recordingState === 'recording'} tick={waveTick} />
                      <Text style={styles.answerPadText}>
                        {recordingState === 'requesting'
                          ? 'Đang bật microphone...'
                          : recordingState === 'recording'
                            ? 'Nhấn mic lần nữa để tạm dừng ghi âm'
                            : recordingState === 'recorded'
                              ? 'Bạn đã ghi âm xong. Có thể nghe lại, thử lại hoặc bấm đánh giá'
                              : 'Nhấn để trả lời'}
                      </Text>
                      <Text style={styles.hintText}>{currentItem.prompt}</Text>
                    </Pressable>
                  </Animated.View>

                  <Pressable style={styles.replayButtonStandalone} onPress={handleReplayVoice}>
                    <SpeakerHighIcon size={18} color={Color.cam} weight="fill" />
                    <Text style={styles.replayText}>{isPlayingUserAudio ? 'Đang phát bản ghi của bạn' : 'Nghe lại giọng mình'}</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.evaluateButton, !currentRecordedUri && styles.evaluateButtonDisabled]}
                    onPress={handleEvaluatePress}
                    disabled={!currentRecordedUri || recordingState === 'recording' || recordingState === 'requesting'}
                  >
                    <Text style={[styles.evaluateButtonText, !currentRecordedUri && styles.evaluateButtonTextDisabled]}>
                      Đánh giá bài nói
                    </Text>
                  </Pressable>
                </>
              )}
            </Animated.View>
          </ScrollView>

          <View style={styles.bottomAction}>
            <Animated.View style={{ transform: [{ scale: micScale }] }}>
              <Pressable
                style={[
                  styles.micButtonOuter,
                  recordingState === 'recording' && styles.micButtonOuterActive,
                ]}
                onPress={handleMicPress}
              >
                <View style={styles.micButtonInner}>
                  <MicrophoneIcon size={30} color={Color.cam} weight="fill" />
                </View>
              </Pressable>
            </Animated.View>
          </View>
        </View>

      <IntroPopup
        visible={showIntroModal}
        onClose={dismissIntroModal}
        description="Ở phần này, bạn sẽ luyện tập kỹ năng nói tiếng Hàn bằng cách trả lời câu hỏi theo mẫu ngữ pháp trong ví dụ. Hãy sử dụng từ gợi ý để tạo câu trả lời hoàn chỉnh và luyện nói nhiều lần để quen với cách diễn đạt tự nhiên trong giao tiếp."
        buttonLabel="Bắt đầu ngay"
        mascotSources={introMascots}
        delayMs={220}
      />

      <FeedbackPopup
        visible={feedbackState !== 'hidden'}
        type={feedbackState === 'failure' ? 'failure' : 'success'}
        onNext={goNext}
        onOutsidePress={feedbackState === 'failure' ? retryCurrentItem : undefined}
        translateY={feedbackTranslateY}
        opacity={feedbackOpacity}
        imageSource={feedbackState === 'failure' ? feedbackImages.failure : feedbackImages.success}
      />
    </SafeAreaView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <BookOpenIcon size={18} color={Color.cam} weight="regular" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function LineRow({
  line,
  isPlaying,
  onPressSpeaker,
}: {
  line: DialogueLine;
  isPlaying?: boolean;
  onPressSpeaker: (line: DialogueLine) => void;
}) {
  return (
    <View style={styles.lineRow}>
      <Image source={avatarBySpeaker[line.speaker]} style={styles.avatar} contentFit="cover" />
      <View style={styles.lineContent}>
        <Text style={styles.lineKorean}>{line.korean}</Text>
        {line.vietnamese ? <Text style={styles.lineTranslation}>{line.vietnamese}</Text> : null}
      </View>
      <Pressable onPress={() => onPressSpeaker(line)} hitSlop={8}>
        <SpeakerHighIcon size={18} color={isPlaying ? '#FF8B2B' : Color.cam} weight="fill" />
      </Pressable>
    </View>
  );
}

function DialogueBubble({
  line,
  isPlaying,
  onPressSpeaker,
}: {
  line: DialogueLine;
  isPlaying?: boolean;
  onPressSpeaker: (line: DialogueLine) => void;
}) {
  const isWoman = line.speaker === 'woman';

  return (
    <View style={[styles.dialogueRow, isWoman ? styles.dialogueRowReverse : null]}>
      <Image source={avatarBySpeaker[line.speaker]} style={styles.avatarLarge} contentFit="cover" />
      <View style={[styles.dialogueBubble, isWoman ? styles.dialogueBubbleRight : styles.dialogueBubbleLeft]}>
        <Text style={styles.lineKorean}>{line.korean}</Text>
        {line.vietnamese ? <Text style={styles.lineTranslation}>{line.vietnamese}</Text> : null}
        <Pressable style={styles.dialogueSpeaker} onPress={() => onPressSpeaker(line)} hitSlop={8}>
          <SpeakerHighIcon size={18} color={isPlaying ? '#FF8B2B' : Color.cam} weight="fill" />
        </Pressable>
      </View>
    </View>
  );
}


function Waveform({ active, tick }: { active: boolean; tick: number }) {
  return (
    <View style={styles.waveformRow}>
      {waveformBars.map((baseHeight, index) => {
        const dynamic = active ? ((tick + index) % 5) * 4 : 0;
        const height = active ? Math.max(14, baseHeight + dynamic - 8) : 16;
        return <View key={`${index}-${tick}`} style={[styles.waveformBar, { height, opacity: active ? 1 : 0.45 }]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4A4A4A',
  },
  screen: {
    flex: 1,
    backgroundColor: '#4A4A4A',
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  headerTitle: {
    color: '#4AB1FF',
    fontSize: FontSize.fs_16,
    fontFamily: FontFamily.lexendDecaSemiBold,
  },
  sheet: {
    flex: 1,
    backgroundColor: Color.bg,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: 'hidden',
  },
  sheetTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  counter: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#7C7C7C',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Color.main,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 24,
  },
  animatedContent: {
    gap: Gap.gap_14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    gap: 8,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  avatarLarge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginTop: 8,
  },
  lineContent: {
    flex: 1,
    gap: 3,
  },
  lineKorean: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: Color.text,
    lineHeight: 21,
  },
  lineTranslation: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: '#A1A1AA',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  answerPad: {
    marginTop: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D7D7D7',
    borderRadius: 18,
    minHeight: 112,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: '#FFFDF8',
  },
  answerPadRecording: {
    borderColor: '#7DCF69',
    backgroundColor: '#F3FFF1',
  },
  answerPadPending: {
    borderColor: '#FFD9A8',
    backgroundColor: '#FFF8ED',
  },
  answerPadText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14,
    color: '#8D8D8D',
    textAlign: 'center',
  },
  hintText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: '#A3A3A3',
    textAlign: 'center',
    lineHeight: 18,
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 54,
  },
  waveformBar: {
    width: 4,
    borderRadius: 999,
    backgroundColor: '#67C76B',
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 2,
  },
  replayButtonStandalone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 12,
  },
  replayText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: Color.cam,
  },
  evaluateButton: {
    marginTop: 6,
    borderRadius: 999,
    backgroundColor: Color.cam,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  evaluateButtonDisabled: {
    backgroundColor: '#F1D4BA',
  },
  evaluateButtonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: '#FFFFFF',
  },
  evaluateButtonTextDisabled: {
    color: '#FFF7F0',
  },
  dialoguePrompt: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: '#7C7C7C',
    lineHeight: 20,
  },
  dialogueWrap: {
    gap: 14,
  },
  dialogueRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 10,
  },
  dialogueRowReverse: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
  },
  dialogueBubble: {
    maxWidth: '82%',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    gap: 8,
  },
  dialogueBubbleLeft: {
    backgroundColor: '#FFFFFF',
    marginRight: 'auto',
  },
  dialogueBubbleRight: {
    backgroundColor: '#FFF9F2',
    marginLeft: 'auto',
  },
  dialogueSpeaker: {
    alignSelf: 'flex-start',
  },
  shadowRecordButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0CC',
    borderWidth: 4,
    borderColor: '#FFF7D9',
    marginTop: 6,
  },
  shadowRecordButtonActive: {
    backgroundColor: '#FFE6D5',
    borderColor: '#FFF4EF',
  },
  bottomAction: {
    paddingBottom: 18,
    alignItems: 'center',
  },
  micButtonOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEAAE',
  },
  micButtonOuterActive: {
    backgroundColor: '#FFF2C7',
  },
  micButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7D7',
  },
});
