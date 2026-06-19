import { BookmarkSimpleIcon, SpeakerSimpleHighIcon } from 'phosphor-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useMemo } from 'react';
import { MotiView } from 'moti';
import { Border, FontFamily, FontSize, Gap, Padding, Stroke } from '../constants/GlobalStyles';
import * as Speech from 'expo-speech';
import { useUser } from '../contexts/UserContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import PosBadge from './PracticeComponent/PosBadge';

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
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const getPosKey = (pos: string) => {
    const lowerPos = pos.toLowerCase();
    if (lowerPos === 'noun' || lowerPos === 'danh từ') return 'noun';
    if (lowerPos === 'verb' || lowerPos === 'động từ') return 'verb';
    if (lowerPos === 'adjective' || lowerPos === 'tính từ') return 'adjective';
    if (lowerPos === 'adverb' || lowerPos === 'phó từ') return 'adverb';
    return 'other';
  };

  const translatePos = (posKey: string, original: string) => {
    if (posKey === 'noun') return t('vocabulary.pos_noun', 'Danh từ');
    if (posKey === 'verb') return t('vocabulary.pos_verb', 'Động từ');
    if (posKey === 'adjective') return t('vocabulary.pos_adjective', 'Tính từ');
    if (posKey === 'adverb') return t('vocabulary.pos_adverb', 'Phó từ');
    return original;
  };

  const getBadgeColor = (posKey: string) => {
    if (posKey === 'noun') return { bg: colors.picVocabBg, text: colors.picVocabText };
    if (posKey === 'verb') return { bg: colors.badgePurpleBg, text: colors.badgePurpleText };
    return { bg: colors.orangePastel, text: colors.cam };
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

  const posKey = getPosKey(item.pos);
  const displayPos = translatePos(posKey, item.pos);
  const badge = getBadgeColor(posKey);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={!onPress}>
    <MotiView
      style={styles.card}
      animate={{
        backgroundColor: isSelected ? colors.historySelectedBg : colors.bg,
        borderColor: isSelected ? colors.main2 : colors.stroke,
      }}
      transition={{ type: 'timing', duration: 200 }}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.word}>{item.word}</Text>
          <PosBadge text={displayPos} bgColor={badge.bg} textColor={badge.text} />
        </View>
        <Text style={styles.phonetic}>{item.phonetic}</Text>
        <Text style={styles.meaning}>{item.meaning}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleSpeak} activeOpacity={0.7}>
          <SpeakerSimpleHighIcon 
            size={30} 
            color={isSpeaking ? colors.main2 : colors.text} 
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
              size={30}
              color={item.isFavorite ? colors.main : colors.text}
              weight={item.isFavorite ? 'fill' : 'regular'}
            />
          </TouchableOpacity>
        )}
      </View>
    </MotiView>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    borderWidth: Stroke.stroke,
    borderColor: colors.stroke,
    borderRadius: Border.br_30,
    padding: Padding.padding_20 || 20,
    marginBottom: Gap.gap_15,
    alignItems: 'center',
  },
  content: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  word: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_20 || 16, color: colors.text },
  phonetic: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_12, color: colors.gray, marginBottom: 2 },
  meaning: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.color },
  actions: { flexDirection: 'row', gap: Gap.gap_20 || 20 },
  favoriteButton: {
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VocabularyCard;