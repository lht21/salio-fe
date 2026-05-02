import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CaretLeftIcon,
  SpeakerHighIcon,
  BookmarkSimpleIcon,
  MagicWandIcon,
  CheckCircleIcon,
  WarningIcon,
} from 'phosphor-react-native';
import { MotiView } from 'moti';
import * as Speech from 'expo-speech';

import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
import VocabularyService from '../../api/services/vocabulary.service';
import { Vocabulary } from '../../api/types/vocabulary.types';
import { useUser } from '../../contexts/UserContext';
import FlashcardService from '../../api/services/flashcard.service';

// --- TYPES ---
interface AIResult {
  isCorrect: boolean;
  feedback: string;
}

interface AIPracticeFooterProps {
  word: string;
  sentence: string;
  setSentence: (text: string) => void;
  onCheck: () => void;
  isLoading: boolean;
  aiResult: AIResult | null;
}

// --- COMPONENTS ---

/**
 * Component Fixed Footer: Luyện tập đặt câu với AI
 */
const AIPracticeFooter: React.FC<AIPracticeFooterProps> = ({
  word,
  sentence,
  setSentence,
  onCheck,
  isLoading,
  aiResult,
}) => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerTitle}>Luyện tập đặt câu với từ này</Text>
      
      {/* Ô nhập liệu dạng khung vẽ tay */}
      <TextInput
        style={styles.handDrawnInput}
        placeholder={`Hãy thử đặt một câu với từ "${word}"...`}
        placeholderTextColor={Color.gray || '#94A3B8'}
        value={sentence}
        onChangeText={setSentence}
        multiline
        maxLength={150}
      />

      {/* Nút hành động AI */}
      <TouchableOpacity
        style={[styles.aiButton, !sentence.trim() && styles.aiButtonDisabled]}
        activeOpacity={0.8}
        onPress={onCheck}
        disabled={!sentence.trim() || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <MagicWandIcon size={20} color="#FFFFFF" weight="fill" />
            <Text style={styles.aiButtonText}>AI Chấm điểm</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Vùng phản hồi AI */}
      {aiResult && !isLoading && (
        <View style={[
          styles.feedbackContainer,
          aiResult.isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
        ]}>
          {aiResult.isCorrect ? (
            <CheckCircleIcon size={20} color="#16A34A" weight="fill" />
          ) : (
            <WarningIcon size={20} color="#DC2626" weight="fill" />
          )}
          <Text style={[
            styles.feedbackText,
            aiResult.isCorrect ? { color: '#15803D' } : { color: '#B91C1C' }
          ]}>
            {aiResult.feedback}
          </Text>
        </View>
      )}
    </View>
  );
};

/**
 * MAIN SCREEN: Vocabulary Detail
 */
export default function VocabularyDetailScreen() {
  const router = useRouter();
  // Mock Params (Thực tế sẽ lấy từ params truyền qua Router)
  const { wordId } = useLocalSearchParams();
  const { user } = useUser();

  // State AI Practice
  const [sentence, setSentence] = useState('');
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [vocabData, setVocabData] = useState<Vocabulary | null>(null);
  const [isScreenLoading, setIsScreenLoading] = useState(true);

  useEffect(() => {
    const fetchVocabDetail = async () => {
      if (!wordId) return;
      try {
        setIsScreenLoading(true);
        
        // Lấy chi tiết từ vựng và kiểm tra danh sách yêu thích cùng lúc
        const [res, favRes] = await Promise.all([
          VocabularyService.getById(wordId as string),
          FlashcardService.getSetById('favorite').catch(() => null)
        ]);
        
        if (res.success && res.data) {
          setVocabData(res.data);
        }
        if (favRes && favRes.success && favRes.data) {
          const isFav = favRes.data.cards.some((c: any) => (c._id || c) === wordId);
          setIsBookmarked(isFav);
        }
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết từ vựng:', error);
      } finally {
        setIsScreenLoading(false);
      }
    };
    fetchVocabDetail();
  }, [wordId]);

  // Hàm giả lập gọi AI Check
  const handleAICheck = () => {
    if (!sentence.trim()) return;
    setIsLoading(true);
    
    // Mô phỏng delay mạng 1.5s
    setTimeout(() => {
      if (vocabData && sentence.includes(vocabData.word)) {
        setAiResult({
          isCorrect: true,
          feedback: 'Câu của bạn rất tự nhiên! Ngữ pháp và từ vựng đều được sử dụng hoàn toàn chính xác.',
        });
      } else {
        setAiResult({
          isCorrect: false,
          feedback: `Bạn chưa sử dụng từ "${vocabData?.word}" trong câu. Hãy thử viết lại nhé!`,
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleToggleBookmark = async () => {
    if (!wordId) return;
    const currentStatus = isBookmarked;
    
    // Optimistic Update (Cập nhật UI ngay lập tức để tăng trải nghiệm)
    setIsBookmarked(!currentStatus);
    
    try {
      if (currentStatus) {
        await FlashcardService.removeCardFromSet('favorite', wordId as string);
      } else {
        await FlashcardService.addCardsToSet('favorite', { vocabIds: [wordId as string] });
      }
    } catch (error) {
      // Rollback nếu gọi API bị lỗi
      setIsBookmarked(currentStatus);
      console.error('Lỗi khi cập nhật yêu thích:', error);
    }
  };

  const handleSpeak = () => {
    if (!vocabData) return;
    
    const voiceGender = user?.preferences?.voiceGender || 'male';
    const currentPitch = voiceGender === 'male' ? 0.8 : 1.1;

    Speech.stop();
    Speech.speak(vocabData.word, {
      language: 'ko-KR',
      rate: 0.8,
      pitch: currentPitch,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleSpeakSentence = (text: string) => {
    const voiceGender = user?.preferences?.voiceGender || 'male';
    const currentPitch = voiceGender === 'male' ? 0.8 : 1.1;

    Speech.stop();
    Speech.speak(text, {
      language: 'ko-KR',
      rate: 0.8,
      pitch: currentPitch,
    });
  };

  const translateType = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType === 'noun') return 'Danh từ';
    if (lowerType === 'verb') return 'Động từ';
    if (lowerType === 'adjective') return 'Tính từ';
    if (lowerType === 'adverb') return 'Phó từ';
    return type;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* --- HEADER SECTION --- */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <CaretLeftIcon size={24} color={Color.main2 || '#1E1E1E'} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết từ vựng</Text>
          {/* Spacer để căn giữa title */}
          <View style={{ width: 40 }} />
        </View>

        {isScreenLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={Color.main || '#98F291'} />
          </View>
        ) : !vocabData ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: FontFamily.lexendDecaMedium, color: Color.gray }}>Không tìm thấy dữ liệu từ vựng</Text>
          </View>
        ) : (
          <>
            {/* --- SCROLL CONTENT --- */}
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* PHẦN 1: THÔNG TIN TỪ VỰNG CHÍNH (TOP CARD) */}
              <LinearGradient
                colors={['#CEF9B4', Color.main || '#98F291']}
                style={styles.topCard}
              >
                {/* Nút thao tác góc phải */}
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={handleSpeak} activeOpacity={0.7}>
                    {isSpeaking && (
                      <MotiView
                        from={{ opacity: 0.5, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.8 }}
                        transition={{
                          type: 'timing',
                          duration: 1000,
                          loop: true,
                          repeatReverse: false,
                        }}
                        style={styles.speakerRipple}
                      />
                    )}
                    <SpeakerHighIcon 
                      size={24} 
                      color={isSpeaking ? (Color.main2 || '#22C55E') : (Color.color || '#0C5F35')} 
                      weight="fill" 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={handleToggleBookmark}>
                    <BookmarkSimpleIcon
                      size={24} 
                      color={Color.color || '#0C5F35'} 
                      weight={isBookmarked ? "fill" : "regular"} 
                    />
                  </TouchableOpacity>
                </View>

                {/* Từ vựng siêu to */}
                <Text style={styles.bigWord}>{vocabData.word}</Text>
                <Text style={styles.phoneticText}>{vocabData.pronunciationText}</Text>

                {/* Badges Phân loại & Âm Hán */}
                <View style={styles.badgesRow}>
                  {vocabData.type && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{translateType(vocabData.type)}</Text>
                    </View>
                  )}
                  {vocabData.sinoVietnamese && (
                    <View style={[styles.badge, { backgroundColor: '#FDE68A' }]}>
                      <Text style={[styles.badgeText, { color: '#92400E' }]}>{vocabData.sinoVietnamese}</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>

              {/* HÌNH ẢNH MINH HỌA */}
              {vocabData.imageUrl && /^(http|https):\/\/[^ "]+$/.test(vocabData.imageUrl) && (
                <View style={styles.imageWrapper}>
                  <Image 
                    source={{ uri: vocabData.imageUrl }} 
                    style={styles.vocabImage} 
                    resizeMode="cover" 
                  />
                </View>
              )}

              {/* PHẦN 2: Ý NGHĨA & VÍ DỤ (BODY) */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Nghĩa tiếng Việt</Text>
                <Text style={styles.meaningText}>{vocabData.meaning}</Text>
              </View>

              {vocabData.examples && vocabData.examples.length > 0 && (
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Ví dụ mẫu</Text>
                  
                  <View style={styles.exampleContainer}>
                    {/* Mascot Image */}
                    <Image 
                      source={require('../../assets/images/horani/sc1_b2.png')} 
                      style={styles.mascotImage} 
                      resizeMode="contain"
                    />
                    <View style={styles.exampleList}>
                      {vocabData.examples.map((ex, index) => (
                        <View key={index} style={styles.exampleItem}>
                          <TouchableOpacity 
                            style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}
                            onPress={() => handleSpeakSentence(ex.korean)}
                            activeOpacity={0.7}
                          >
                            <SpeakerHighIcon size={18} color={Color.main2 || '#22C55E'} weight="fill" style={{ marginTop: 2 }} />
                            <Text style={[styles.exKr, { flex: 1 }]}>{ex.korean}</Text>
                          </TouchableOpacity>
                          <Text style={styles.exVi}>{ex.vietnamese}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* PHẦN 3: FIXED FOOTER - LUYỆN TẬP ĐẶT CCâu AI */}
            <AIPracticeFooter 
              word={vocabData.word}
              sentence={sentence}
              setSentence={setSentence}
              onCheck={handleAICheck}
              isLoading={isLoading}
              aiResult={aiResult}
            />
          </>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg2,
  },
  keyboardAvoid: {
    flex: 1,
  },
  // --- HEADER ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.padding_15,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: Color.text,
  },
  // --- BODY SCROLL ---
  scrollContent: {
    paddingHorizontal: Padding.padding_15,
    paddingBottom: 40,
  },
  // --- TOP CARD ---
  topCard: {
    borderRadius: 30, // Bo góc lớn 30dp
    padding: 24,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
    position: 'relative',
    shadowColor: Color.main || '#98F291',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  cardActions: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakerRipple: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Color.main2 || '#22C55E',
  },
  bigWord: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 40, // Font siêu to
    color: Color.color || '#0C5F35',
    marginTop: 20,
  },
  phoneticText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16 || 16,
    color: '#064E3B',
    opacity: 0.8,
    marginTop: 4,
    marginBottom: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12 || 12,
    color: '#064E3B',
  },
  // --- SECTIONS ---
  imageWrapper: {
    width: '100%',
    height: 200,
    borderRadius: Border.br_20 || 20,
    marginBottom: Gap.gap_20 || 20,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Color.stroke || '#E2E8F0',
  },
  vocabImage: {
    width: '100%',
    height: '100%',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Border.br_20 || 20,
    padding: Padding.padding_20 || 20,
    marginBottom: Gap.gap_10 || 20,
    borderWidth: 1,
    borderColor: Color.greenLight || '#E2E8F0',
  },
  sectionTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: Color.main2 || '#22C55E',
    marginBottom: 10,
  },
  meaningText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16 || 16,
    color: Color.text,
    lineHeight: 24,
  },
  exampleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mascotImage: {
    width: 70,
    height: 90,
    marginRight: 16,
  },
  exampleList: {
    flex: 1,
    gap: 16,
  },
  exampleItem: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  exKr: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14 || 14,
    color: Color.text,
  },
  exVi: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14 || 14,
    color: Color.gray,
  },
  // --- FOOTER AI PRACTICE ---
  footerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Padding.padding_15 || 15,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: Color.stroke || '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10, // Shadow nhẹ đè lên ScrollView
  },
  footerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14 || 14,
    color: Color.text,
    marginBottom: 12,
  },
  handDrawnInput: {
    minHeight: 80,
    maxHeight: 120,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14 || 14,
    color: Color.text,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  aiButton: {
    flexDirection: 'row',
    backgroundColor: '#A855F7', // Color.purpleLight (Màu tím AI đặc trưng)
    height: 48,
    borderRadius: 24, // Bo góc mạnh
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  aiButtonDisabled: {
    backgroundColor: '#D8B4FE', // Tím nhạt khi disable
  },
  aiButtonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14 || 14,
    color: '#FFFFFF',
  },
  feedbackContainer: {
    flexDirection: 'row',
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    gap: 8,
    alignItems: 'flex-start',
  },
  feedbackCorrect: {
    backgroundColor: '#F0FDF4', // Xanh nhạt
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  feedbackIncorrect: {
    backgroundColor: '#FEF2F2', // Đỏ nhạt
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  feedbackText: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaRegular,
    fontStyle: 'italic', // Văn bản giải thích in nghiêng
    fontSize: FontSize.fs_14 || 14,
    lineHeight: 20,
  },
});