import { BookmarkSimpleIcon, SpeakerSimpleHighIcon } from 'phosphor-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { MotiView } from 'moti';
import { Border, Color, FontFamily, FontSize, Gap, Padding, Stroke } from '../constants/GlobalStyles';
import * as Speech from 'expo-speech';
import { useUser } from '../contexts/UserContext';

interface Props {
  item: {
    id: string;
    word: string;
    pos: string;
    phonetic: string;
    meaning: string;
    isFavorite?: boolean;
  };
  onToggleFavorite?: () => void;
  rightAction?: React.ReactNode;
  isSelected?: boolean;
  onPress?: () => void;
}

const VocabularyCard = ({ item, onToggleFavorite, rightAction, isSelected, onPress }: Props) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { user } = useUser();

  const translatePos = (pos: string) => {
    const lowerPos = pos.toLowerCase();
    if (lowerPos === 'noun') return 'Danh từ';
    if (lowerPos === 'verb') return 'Động từ';
    if (lowerPos === 'adjective') return 'Tính từ';
    if (lowerPos === 'adverb') return 'Phó từ';
    return pos;
  };

  const getBadgeColor = (pos: string) => {
    if (pos === 'Danh từ') return { bg: '#DCFCE7', text: '#15803D' };
    if (pos === 'Động từ') return { bg: '#F3E8FF', text: '#7E22CE' };
    return { bg: '#FFEDD5', text: '#C2410C' };
  };

  const handleSpeak = () => {
    const voiceGender = user?.preferences?.voiceGender || 'male';
    // Giảm độ cao giọng xuống 0.8 cho giọng Nam (trầm), tăng lên 1.1 cho giọng Nữ (thanh)
    const currentPitch = voiceGender === 'male' ? 0.8 : 1.1;

    Speech.stop(); // Dừng âm thanh đang phát trước đó (nếu có) để tránh bị đè tiếng
    Speech.speak(item.word, { 
      language: 'ko-KR', 
      rate: 0.8,
      pitch: currentPitch,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    }); // Phát âm tiếng Hàn với tốc độ hơi chậm lại một chút để dễ nghe
  };

  const displayPos = translatePos(item.pos);
  const badge = getBadgeColor(displayPos);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={!onPress}>
    <MotiView
      style={styles.card}
      animate={{
        backgroundColor: isSelected ? '#F0FDF4' : (Color.bg || '#FFFFFF'),
        borderColor: isSelected ? (Color.main2 || '#22C55E') : (Color.stroke || '#E2E8F0'),
      }}
      transition={{ type: 'timing', duration: 200 }}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.word}>{item.word}</Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{displayPos}</Text>
          </View>
        </View>
        <Text style={styles.phonetic}>{item.phonetic}</Text>
        <Text style={styles.meaning}>{item.meaning}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleSpeak} activeOpacity={0.7}>
          <SpeakerSimpleHighIcon 
            size={24} 
            color={isSpeaking ? (Color.main2 || Color.main || '#22C55E') : Color.text} 
            weight={isSpeaking ? "fill" : "regular"} 
          />
        </TouchableOpacity>
        {rightAction ?? (
          <TouchableOpacity
            onPress={onToggleFavorite}
            style={styles.favoriteButton}
            activeOpacity={0.85}
          >
            <BookmarkSimpleIcon
              size={24}
              color={item.isFavorite ? (Color.main2 || '#22C55E') : Color.text}
              weight={item.isFavorite ? 'fill' : 'regular'}
            />
          </TouchableOpacity>
        )}
      </View>
    </MotiView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Color.bg,
    borderWidth: Stroke.stroke,
    borderColor: Color.stroke,
    borderRadius: Border.br_20,
    padding: Padding.padding_15,
    marginBottom: Gap.gap_15,
    alignItems: 'center',
  },
  content: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  word: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16 || 16, color: Color.text },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Border.br_5 },
  badgeText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: 10 },
  phonetic: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: Color.gray, marginBottom: 2 },
  meaning: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.color },
  actions: { flexDirection: 'row', gap: Gap.gap_15 || 15 },
  favoriteButton: {
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VocabularyCard;