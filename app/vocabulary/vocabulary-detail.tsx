import React, { useState, useEffect, useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

import { FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';
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
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerTitle}>{t('vocabulary.practice_sentence_title', 'Luyện tập đặt câu với từ này')}</Text>
      
      {/* Ô nhập liệu dạng khung vẽ tay */}
      <TextInput
        style={styles.handDrawnInput}
        placeholder={t('vocabulary.practice_sentence_placeholder', { word, defaultValue: `Hãy thử đặt một câu với từ "${word}"...` })}
        placeholderTextColor={colors.gray}
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
          <ActivityIndicator color={colors.whiteText} size="small" />
        ) : (
          <>
            <MagicWandIcon size={20} color={colors.whiteText} weight="fill" />
            <Text style={styles.aiButtonText}>{t('vocabulary.ai_grade', 'AI Chấm điểm')}</Text>
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
            <CheckCircleIcon size={20} color={colors.picVocabText} weight="fill" />
          ) : (
            <WarningIcon size={20} color={colors.safetyIcon} weight="fill" />
          )}
          <Text style={[
            styles.feedbackText,
            aiResult.isCorrect ? { color: colors.textGreenSuccess } : { color: colors.textRedError }
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
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
          feedback: t('vocabulary.ai_feedback_correct', 'Câu của bạn rất tự nhiên! Ngữ pháp và từ vựng đều được sử dụng hoàn toàn chính xác.'),
        });
      } else {
        setAiResult({
          isCorrect: false,
          feedback: t('vocabulary.ai_feedback_incorrect', { word: vocabData?.word, defaultValue: `Bạn chưa sử dụng từ "${vocabData?.word}" trong câu. Hãy thử viết lại nhé!` }),
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
    if (lowerType === 'noun') return t('vocabulary.pos_noun', 'Danh từ');
    if (lowerType === 'verb') return t('vocabulary.pos_verb', 'Động từ');
    if (lowerType === 'adjective') return t('vocabulary.pos_adjective', 'Tính từ');
    if (lowerType === 'adverb') return t('vocabulary.pos_adverb', 'Phó từ');
    return type;
  };

  const getGradientColors = (type?: string) => {
    if (!type) return [colors.cardGreenBg, colors.main];
    const lowerType = type.toLowerCase();
    
    if (lowerType === 'noun' || lowerType === 'danh từ') return [colors.picVocabBg || colors.cardGreenBg, colors.main];
    if (lowerType === 'verb' || lowerType === 'động từ') return [colors.badgePurpleBg || '#F3E8FF', colors.badgePurpleText || '#A855F7'];
    if (lowerType === 'adjective' || lowerType === 'tính từ') return [colors.orangePastel || '#FFEDD5', colors.cam || '#F97316'];
    if (lowerType === 'adverb' || lowerType === 'phó từ') return [colors.bluePastel || '#DBEAFE', colors.blue || '#3B82F6'];
    
    // Mặc định
    return [colors.cardGreenBg, colors.main];
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
            <CaretLeftIcon size={24} color={colors.text} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('vocabulary.detail_title', 'Chi tiết từ vựng')}</Text>
          {/* Spacer để căn giữa title */}
          <View style={{ width: 40 }} />
        </View>

        {isScreenLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.main} />
          </View>
        ) : !vocabData ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: FontFamily.lexendDecaMedium, color: colors.gray }}>{t('vocabulary.not_found', 'Không tìm thấy dữ liệu từ vựng')}</Text>
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
                colors={getGradientColors(vocabData.type)}
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
                      color={isSpeaking ? colors.addBtnBg : colors.color} 
                      weight="fill" 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={handleToggleBookmark}>
                    <BookmarkSimpleIcon
                      size={24} 
                      color={colors.color} 
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
                    <View style={[styles.badge, { backgroundColor: colors.badgeYellowBg }]}>
                      <Text style={[styles.badgeText, { color: colors.badgeYellowText }]}>{vocabData.sinoVietnamese}</Text>
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
                <Text style={styles.sectionTitle}>{t('vocabulary.vietnamese_meaning', 'Nghĩa tiếng Việt')}</Text>
                <Text style={styles.meaningText}>{vocabData.meaning}</Text>
              </View>

              {vocabData.examples && vocabData.examples.length > 0 && (
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>{t('vocabulary.example', 'Ví dụ mẫu')}</Text>
                  
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
                            <SpeakerHighIcon size={18} color={colors.addBtnBg} weight="fill" style={{ marginTop: 2 }} />
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

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg2,
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
    backgroundColor: colors.bgLightBlue,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: colors.text,
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
    shadowColor: colors.main,
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
    backgroundColor: colors.bg + '99', // 0.6 opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakerRipple: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.addBtnBg,
  },
  bigWord: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 40, // Font siêu to
    color: colors.color,
    marginTop: 20,
  },
  phoneticText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16 || 16,
    color: colors.textDarkGreen,
    opacity: 0.8,
    marginTop: 4,
    marginBottom: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    backgroundColor: colors.bg + 'CC', // 0.8 opacity
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12 || 12,
    color: colors.textDarkGreen,
  },
  // --- SECTIONS ---
  imageWrapper: {
    width: '100%',
    height: 200,
    borderRadius: Border.br_20 || 20,
    marginBottom: Gap.gap_20 || 20,
    overflow: 'hidden',
    backgroundColor: colors.bgLightBlue,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  vocabImage: {
    width: '100%',
    height: '100%',
  },
  sectionCard: {
    backgroundColor: colors.bg,
    borderRadius: Border.br_20 || 20,
    padding: Padding.padding_20 || 20,
    marginBottom: Gap.gap_10 || 20,
    borderWidth: 1,
    borderColor: colors.greenLight,
  },
  sectionTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: colors.main2,
    marginBottom: 10,
  },
  meaningText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16 || 16,
    color: colors.text,
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
    backgroundColor: colors.bgLightBlue,
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  exKr: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14 || 14,
    color: colors.text,
  },
  exVi: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14 || 14,
    color: colors.gray,
  },
  // --- FOOTER AI PRACTICE ---
  footerContainer: {
    backgroundColor: colors.bg,
    paddingHorizontal: Padding.padding_15 || 15,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10, // Shadow nhẹ đè lên ScrollView
  },
  footerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14 || 14,
    color: colors.text,
    marginBottom: 12,
  },
  handDrawnInput: {
    minHeight: 80,
    maxHeight: 120,
    backgroundColor: colors.bgLightBlue,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 16,
    padding: 16,
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14 || 14,
    color: colors.text,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  aiButton: {
    flexDirection: 'row',
    backgroundColor: colors.aiButtonBg,
    height: 48,
    borderRadius: 24, // Bo góc mạnh
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  aiButtonDisabled: {
    backgroundColor: colors.aiButtonDisabledBg, // Tím nhạt khi disable
  },
  aiButtonText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14 || 14,
    color: colors.whiteText,
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
    backgroundColor: colors.historySelectedBg, // Xanh nhạt
    borderWidth: 1,
    borderColor: colors.feedbackCorrectBorder,
  },
  feedbackIncorrect: {
    backgroundColor: colors.historyRedBg, // Đỏ nhạt
    borderWidth: 1,
    borderColor: colors.feedbackIncorrectBorder,
  },
  feedbackText: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaRegular,
    fontStyle: 'italic', // Văn bản giải thích in nghiêng
    fontSize: FontSize.fs_14 || 14,
    lineHeight: 20,
  },
});