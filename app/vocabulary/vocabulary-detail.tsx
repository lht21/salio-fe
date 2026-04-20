import React, { useState } from 'react';
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
  CaretLeft,
  SpeakerHigh,
  BookmarkSimple,
  MagicWand,
  CheckCircle,
  Warning,
} from 'phosphor-react-native';

import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../constants/GlobalStyles';

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
            <MagicWand size={20} color="#FFFFFF" weight="fill" />
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
            <CheckCircle size={20} color="#16A34A" weight="fill" />
          ) : (
            <Warning size={20} color="#DC2626" weight="fill" />
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

  // Mock Data
  const MOCK_VOCAB = {
    word: '학생',
    phonetic: '/hak-saeng/',
    type: 'Danh từ',
    hanViet: 'Học sinh - 學生',
    meaning: 'Học sinh, sinh viên (Người đang đi học tại các cơ sở giáo dục).',
    examples: [
      { kr: '저는 대학교 학생입니다.', vi: 'Tôi là sinh viên đại học.' },
      { kr: '학생들이 교실에서 공부하고 있습니다.', vi: 'Các học sinh đang học trong phòng học.' }
    ]
  };

  // State AI Practice
  const [sentence, setSentence] = useState('');
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Hàm giả lập gọi AI Check
  const handleAICheck = () => {
    if (!sentence.trim()) return;
    setIsLoading(true);
    
    // Mô phỏng delay mạng 1.5s
    setTimeout(() => {
      if (sentence.includes(MOCK_VOCAB.word)) {
        setAiResult({
          isCorrect: true,
          feedback: 'Câu của bạn rất tự nhiên! Ngữ pháp và từ vựng đều được sử dụng hoàn toàn chính xác.',
        });
      } else {
        setAiResult({
          isCorrect: false,
          feedback: `Bạn chưa sử dụng từ "${MOCK_VOCAB.word}" trong câu. Hãy thử viết lại nhé!`,
        });
      }
      setIsLoading(false);
    }, 1500);
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
            <CaretLeft size={24} color={Color.text || '#1E1E1E'} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết từ vựng</Text>
          <View style={{ width: 40 }} /> {/* Spacer để căn giữa title */}
        </View>

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
              <TouchableOpacity style={styles.actionBtn}>
                <SpeakerHigh size={24} color={Color.color || '#0C5F35'} weight="fill" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setIsBookmarked(!isBookmarked)}>
                <BookmarkSimple 
                  size={24} 
                  color={Color.color || '#0C5F35'} 
                  weight={isBookmarked ? "fill" : "regular"} 
                />
              </TouchableOpacity>
            </View>

            {/* Từ vựng siêu to */}
            <Text style={styles.bigWord}>{MOCK_VOCAB.word}</Text>
            <Text style={styles.phoneticText}>{MOCK_VOCAB.phonetic}</Text>

            {/* Badges Phân loại & Âm Hán */}
            <View style={styles.badgesRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{MOCK_VOCAB.type}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: '#FDE68A' }]}>
                <Text style={[styles.badgeText, { color: '#92400E' }]}>{MOCK_VOCAB.hanViet}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* PHẦN 2: Ý NGHĨA & VÍ DỤ (BODY) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nghĩa tiếng Việt</Text>
            <Text style={styles.meaningText}>{MOCK_VOCAB.meaning}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ví dụ mẫu</Text>
            
            <View style={styles.exampleContainer}>
              {/* Mascot Image */}
              <Image 
                source={require('../../assets/images/horani/sc1_b2.png')} 
                style={styles.mascotImage} 
                resizeMode="contain"
              />
              <View style={styles.exampleList}>
                {MOCK_VOCAB.examples.map((ex, index) => (
                  <View key={index} style={styles.exampleItem}>
                    <Text style={styles.exKr}>{ex.kr}</Text>
                    <Text style={styles.exVi}>{ex.vi}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* PHẦN 3: FIXED FOOTER - LUYỆN TẬP ĐẶT CCâu AI */}
        <AIPracticeFooter 
          word={MOCK_VOCAB.word}
          sentence={sentence}
          setSentence={setSentence}
          onCheck={handleAICheck}
          isLoading={isLoading}
          aiResult={aiResult}
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg || '#FFFFFF',
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
    backgroundColor: Color.bg,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_18 || 18,
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: Color.text,
    marginBottom: 10,
  },
  meaningText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_16 || 16,
    color: Color.gray,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: Color.stroke || '#E2E8F0',
    marginVertical: 16,
  },
  exampleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: Border.br_20 || 20,
    padding: 16,
    alignItems: 'center',
  },
  mascotImage: {
    width: 60,
    height: 80,
    marginRight: 16,
  },
  exampleList: {
    flex: 1,
    gap: 16,
  },
  exampleItem: {
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
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed', // Khung vẽ tay nét đứt
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