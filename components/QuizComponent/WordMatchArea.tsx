import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Image } from 'react-native';
import { Color, FontFamily, FontSize, Border, Gap } from '../../constants/GlobalStyles';

export interface WordMatchQuestion {
  id: number;
  instruction: string;
  vietnamesePrompt?: string;
  words?: string[];
  correctOrder?: string[];
}

export interface WordMatchAreaProps {
  question: WordMatchQuestion;
  selectedWords: string[];
  setSelectedWords: React.Dispatch<React.SetStateAction<string[]>>;
  isError?: boolean;
}

const WordMatchArea = ({ question, selectedWords, setSelectedWords, isError }: WordMatchAreaProps) => {
  const allWords = question.words || [];
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const isFullySelected = allWords.length > 0 && selectedWords.length === allWords.length;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Hiệu ứng mờ dần (fade) khi người dùng ghép đủ từ
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isFullySelected ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isFullySelected, fadeAnim]);

  useEffect(() => {
    if (isError) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
    }
  }, [isError, shakeAnim]);

  // Xử lý khi bấm vào từ ở khay từ vựng (chọn từ)
  const handleSelectWord = (word: string, index: number) => {
    // Để phân biệt các từ giống nhau, ta lưu kèm index
    const uniqueWord = `${word}_${index}`;
    if (!selectedWords.includes(uniqueWord)) {
      setSelectedWords([...selectedWords, uniqueWord]);
    }
  };

  // Xử lý khi bấm vào từ đã chọn (bỏ chọn)
  const handleDeselectWord = (uniqueWord: string) => {
    setSelectedWords(selectedWords.filter(w => w !== uniqueWord));
  };

  return (
    <View style={styles.wordMatchContainer}>
      {/* Mascot Image */}
      <View style={styles.mascotContainer}>
        <Animated.Image 
          source={require('../../assets/images/horani/wm_1.png')}
          style={[
            styles.mascotImage, 
            { opacity: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
          ]}
          resizeMode="contain"
        />
        <Animated.Image 
          source={require('../../assets/images/horani/wm_2.png')}
          style={[
            styles.mascotImage, 
            styles.mascotImageAbsolute,
            { opacity: fadeAnim }
          ]}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.vietnamesePrompt}>{question.vietnamesePrompt}</Text>
      
      {/* Khay hiển thị từ đã chọn (Vùng điền đáp án) */}
      <Animated.View style={[styles.dropZone, { transform: [{ translateX: shakeAnim }] }]}>
        {selectedWords.length === 0 && (
          <View style={styles.emptyLine} /> // Đường kẻ placeholder nếu chưa chọn gì
        )}
        {selectedWords.map((uniqueWord) => {
          const actualWord = uniqueWord.split('_')[0]; // Cắt bỏ index để hiển thị
          return (
            <Pressable 
              key={uniqueWord} 
              style={[styles.wordChipSelected, isError && styles.wordChipError]}
              onPress={() => handleDeselectWord(uniqueWord)}
            >
              <Text style={[styles.wordTextSelected, isError && styles.wordTextError]}>{actualWord}</Text>
            </Pressable>
          );
        })}
      </Animated.View>

      {/* Đường phân cách */}
      <View style={styles.divider} />

      {/* Khay từ vựng (Word Bank) */}
      <View style={styles.wordBank}>
        {allWords.map((word, index) => {
          const uniqueWord = `${word}_${index}`;
          const isSelected = selectedWords.includes(uniqueWord);
          
          return (
            <Pressable 
              key={uniqueWord}
              style={[styles.wordChip, isSelected && styles.wordChipDisabled]}
              onPress={() => !isSelected && handleSelectWord(word, index)}
              disabled={isSelected}
            >
              <Text style={[styles.wordText, isSelected && styles.wordTextDisabled]}>
                {word}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wordMatchContainer: { width: '100%', alignItems: 'center', marginTop: Gap.gap_10 },
  mascotContainer: {
    width: 140,
    height: 140,
    marginBottom: Gap.gap_20,
    position: 'relative',
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  mascotImageAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  vietnamesePrompt: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_16, color: Color.text, marginBottom: 40, textAlign: 'center' },
  dropZone: { flexDirection: 'row', flexWrap: 'wrap', minHeight: 50, width: '100%', justifyContent: 'center', alignItems: 'center', gap: Gap.gap_10 },
  emptyLine: { width: '80%', height: 2, backgroundColor: Color.stroke, marginTop: 25 },
  divider: { width: '100%', height: 1, backgroundColor: Color.stroke, marginVertical: 40 },
  wordBank: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Gap.gap_15 },
  wordChip: {
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Color.bg,
    borderRadius: Border.br_15, borderWidth: 1.5, borderColor: Color.stroke,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  wordText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_16, color: Color.text },
  wordChipDisabled: {
    backgroundColor: '#F1F5F9', borderColor: '#E2E8F0', elevation: 0, shadowOpacity: 0,
  },
  wordTextDisabled: { color: '#CBD5E1' },
  wordChipSelected: {
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: Color.bg,
    borderRadius: Border.br_15, borderWidth: 2, borderColor: Color.main || '#1877F2',
  },
  wordTextSelected: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  wordChipError: {
    borderColor: Color.red || '#E53E3E',
  },
  wordTextError: {
    color: Color.red || '#E53E3E',
  },
});

export default WordMatchArea;