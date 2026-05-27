import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Image, 
  Pressable,
  TouchableOpacity
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  interpolate, 
  Extrapolation, 
  runOnJS
} from 'react-native-reanimated';
import { MotiView } from 'moti';
import { SpeakerHighIcon, CaretRightIcon } from 'phosphor-react-native';
import * as Speech from 'expo-speech';

import { Color, FontFamily, FontSize } from '../constants/GlobalStyles';
import ShieldBackground from '../components/BackgroundSVG/ShieldBackground'; 
import { useUser } from '../contexts/UserContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const CARD_HEIGHT = SCREEN_WIDTH * 1.15;

export interface FlashcardData {
  id: string | number;
  word: string;
  phonetic: string; 
  meaning: string;
  type: string;
  hanja: string[];
  example: string;
  highlight: string;
  image: string;
  sinoVietnamese?: string;
}

interface SwipableFlashcardProps {
  card: FlashcardData;
  onSwipedLeft: () => void;
  onSwipedRight: () => void;
}

export default function SwipableFlashcard({ card, onSwipedLeft, onSwipedRight }: SwipableFlashcardProps) {
  const { user } = useUser();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateY = useSharedValue(0); 

  const [isSpeakingWord, setIsSpeakingWord] = useState(false);
  const [isSpeakingSentence, setIsSpeakingSentence] = useState(false);

  const handleSpeakWord = () => {
    if (!card.word) return;
    
    const voiceGender = user?.preferences?.voiceGender || 'male';
    const currentPitch = voiceGender === 'male' ? 0.8 : 1.1;

    Speech.stop();
    Speech.speak(card.word, {
      language: 'ko-KR',
      rate: 0.8,
      pitch: currentPitch,
      onStart: () => setIsSpeakingWord(true),
      onDone: () => setIsSpeakingWord(false),
      onStopped: () => setIsSpeakingWord(false),
      onError: () => setIsSpeakingWord(false),
    });
  };

  const handleSpeakSentence = () => {
    if (!card.example) return;

    const voiceGender = user?.preferences?.voiceGender || 'male';
    const currentPitch = voiceGender === 'male' ? 0.8 : 1.1;

    Speech.stop();
    Speech.speak(card.example, {
      language: 'ko-KR',
      rate: 0.8,
      pitch: currentPitch,
      onStart: () => setIsSpeakingSentence(true),
      onDone: () => setIsSpeakingSentence(false),
      onStopped: () => setIsSpeakingSentence(false),
      onError: () => setIsSpeakingSentence(false),
    });
  };

  // --- LOGIC LẬT THẺ (FLIP) ---
  const handleSpeak = (text: string) => {
    const voiceGender = user?.preferences?.voiceGender || 'male';
    const currentPitch = voiceGender === 'male' ? 0.8 : 1.1;

    Speech.stop();
    Speech.speak(text, {
      language: 'ko-KR',
      rate: 0.8,
      pitch: currentPitch,
    });
  };

  const handleTap = () => {
    if (step === 1) {
      rotateY.value = withTiming(180, { duration: 400 });
      setStep(2);
    } else if (step === 2) {
      setStep(3); 
    } else {
      rotateY.value = withTiming(0, { duration: 400 });
      setStep(1);
    }
  };

  // --- LOGIC VUỐT THẺ (SWIPE) ---
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.2; 
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH);
        runOnJS(onSwipedRight)();
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH);
        runOnJS(onSwipedLeft)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  // --- ANIMATED STYLES ---
  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(translateX.value, [-SCREEN_WIDTH, SCREEN_WIDTH], [-15, 15], Extrapolation.CLAMP);
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ: `${rotateZ}deg` }
      ]
    };
  });

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateVal = interpolate(rotateY.value, [0, 180], [0, 180], Extrapolation.CLAMP);
    return {
      transform: [{ rotateY: `${rotateVal}deg` }],
      backfaceVisibility: 'hidden',
      zIndex: rotateY.value < 90 ? 2 : 0, 
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateVal = interpolate(rotateY.value, [0, 180], [180, 360], Extrapolation.CLAMP);
    return {
      transform: [{ rotateY: `${rotateVal}deg` }],
      backfaceVisibility: 'hidden',
      zIndex: rotateY.value >= 90 ? 2 : 0, 
    };
  });

  const renderHighlightedExample = (sentence: string, targetWord: string) => {
    const parts = sentence.split(targetWord);
    return (
      <Text style={styles.exampleText}>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <Text style={styles.highlightText}>{targetWord}</Text>
            )}
          </React.Fragment>
        ))}
      </Text>
    );
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
        
        <Pressable onPress={handleTap} style={styles.pressableArea}>
          
          {/* ======================================= */}
          {/* MẶT TRƯỚC (FRONT)                       */}
          {/* ======================================= */}
          <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
            
            {/* Lớp 1: Khuôn Shield SVG làm nền */}
            <View style={StyleSheet.absoluteFillObject}>
                <ShieldBackground 
                    width={CARD_WIDTH} 
                    height={CARD_HEIGHT} 
                    fillColor='#7BDB28' // Đường dẫn tới ảnh vân camo của bạn
                />
            </View>

            {/* Lớp 2: Nội dung lọt lòng bên trong */}
            <View style={[StyleSheet.absoluteFillObject, styles.contentMask]}>
              <View style={styles.cardContentWrapper}>
                <Text style={styles.koreanWord}>{card.word}</Text>
                
                <View style={styles.phoneticPill}>
                  <Text style={styles.phoneticText}>{card.phonetic}</Text>
                </View>

                <View style={styles.frontBottomActions}>
                  <TouchableOpacity 
                    style={styles.audioBtn}
                    onPress={(e) => {
                      e.stopPropagation(); // Ngăn việc lật thẻ khi bấm loa
                      handleSpeak(card.word);
                    }}
                  >
                    <SpeakerHighIcon size={28} color={Color.bg} weight="fill" />
                  </TouchableOpacity>
                  {/* Đã xóa ArrowsClockwiseIcon ở đây */}
                </View>
              </View>
            </View>
          </Animated.View>

          {/* ======================================= */}
          {/* MẶT SAU (BACK)                          */}
          {/* ======================================= */}
          <Animated.View style={[styles.cardFace, backAnimatedStyle]}>
            
            {/* Lớp 1: SVG Shield */}
            <View style={StyleSheet.absoluteFillObject}>
               <ShieldBackground width={CARD_WIDTH} height={CARD_HEIGHT} fillColor='#F5F5DC' />
            </View>

            {/* Lớp 2: Nội dung */}
            <View style={[StyleSheet.absoluteFillObject, styles.contentMask]}>
              <View style={styles.cardContentWrapper}>
                
                {/* Ý NGHĨA & HÁN TỰ */}
                {step === 2 && (
                  <View style={styles.stepContainer}>
                    <Text style={styles.vietnameseMeaning}>{card.meaning}</Text>
                    <View style={styles.wordTypePill}>
                      <Text style={styles.wordTypeText}>{card.type}</Text>
                    </View>

                    <View style={styles.hanjaSection}>
                      <Text style={styles.hanjaLabel}>Âm Hán Việt tương ứng</Text>
                      <View style={styles.hanjaRow}>
                        {card.hanja.map((h, i) => (
                          <TouchableOpacity key={i} style={styles.hanjaBtn}>
                            <Text style={styles.hanjaBtnText}>{h}</Text>
                            <CaretRightIcon size={16} color={Color.text} />
                          </TouchableOpacity>
                        ))}
                      </View>
                      {card.sinoVietnamese && (
                        <View style={styles.sinoVietnameseSection}>
                          <Text style={styles.sinoVietnameseLabel}>Sino-Vietnamese:</Text>
                          <Text style={styles.sinoVietnameseText}>{card.sinoVietnamese}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* VÍ DỤ & HÌNH ẢNH */}
                {step === 3 && (
                  <View style={styles.stepContainer}>
                    <Image source={{ uri: card.image }} style={styles.exampleImage} />
                    <TouchableOpacity onPress={() => handleSpeak(card.example)}>
                      <SpeakerHighIcon size={24} color={Color.main2} weight="fill" style={{ marginTop: 20 }} />
                    </TouchableOpacity>
                    {renderHighlightedExample(card.example, card.highlight)}
                  </View>
                )}
                {/* Đã xóa ArrowsClockwiseIcon ở đây */}
              </View>
            </View>
          </Animated.View>

        </Pressable>

        <View style={styles.tapInstruction}>
          <Text style={styles.stepIndicator}>Mặt {step}</Text>
          <Text style={styles.tapText}>Tap để xoay thẻ</Text>
        </View>

      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  pressableArea: {
    width: '100%',
    height: '100%',
  },
  cardFace: {
    position: 'absolute', 
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%',
    height: '100%',
  },
  
  contentMask: {
    margin: 4, 
    borderRadius: 26, 
    overflow: 'hidden',
  },
  
  // --- CARD CONTENT ---
  cardContentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  koreanWord: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 50,
    color: Color.text,
    marginBottom: 15,
  },
  phoneticPill: {
    backgroundColor: Color.main2 || '#166534', 
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  phoneticText: { color: Color.bg, fontSize: FontSize.fs_16, fontFamily: FontFamily.lexendDecaRegular },
  frontBottomActions: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    width: '100%', 
  },
  audioBtn: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Color.main2,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#166534'
  },
  wordSpeakerRipple: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Color.cam || '#F97316',
  },
  
  // --- MẶT SAU ---
  stepContainer: {
    alignItems: 'center',
    width: '100%'
  },
  vietnameseMeaning: {
    fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 40, color: Color.text, marginBottom: 15,
  },
  wordTypePill: {
    backgroundColor: '#3F6212', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginBottom: 40,
  },
  wordTypeText: { color: '#FFF', fontFamily: FontFamily.lexendDecaMedium },
  hanjaSection: { alignItems: 'center', width: '100%' },
  hanjaLabel: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 12, color: Color.gray, marginBottom: 10 },
  hanjaRow: { flexDirection: 'row', gap: 10 },
  hanjaBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFB800',
    paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, gap: 5,
    borderWidth: 2, borderColor: '#B45309'
  },
  hanjaBtnText: { fontFamily: FontFamily.lexendDecaRegular, color: Color.text },
  sinoVietnameseSection: { marginTop: 15, alignItems: 'center' },
  sinoVietnameseLabel: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 12, color: Color.gray, marginBottom: 5 },
  sinoVietnameseText: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 16, color: Color.main2 },
  exampleImage: {
    width: '100%', height: 180, borderRadius: 15, borderWidth: 1, borderColor: '#CBD5E1',
  },
  exampleText: {
    fontFamily: FontFamily.lexendDecaSemiBold, fontSize: 22, color: Color.text, marginTop: 15, textAlign: 'center'
  },
  sentenceAudioBtn: {
    marginTop: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sentenceSpeakerRipple: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Color.cam || '#F97316',
  },
  highlightText: {
    color: '#166534', 
    textDecorationLine: 'underline',
  },

  // --- TAP INSTRUCTIONS ---
  tapInstruction: {
    position: 'absolute',
    bottom: -60,
    alignItems: 'center',
    width: '100%',
  },
  stepIndicator: { fontFamily: FontFamily.lexendDecaRegular, fontSize: 12, color: Color.stroke, marginBottom: 2 },
  tapText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 16, color: '#94A3B8' },
});