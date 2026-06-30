import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import {
  StarIcon,
  HeartIcon,
  CursorClickIcon,
  SparkleIcon,
} from 'phosphor-react-native';
import PosBadge from '../PracticeComponent/PosBadge';
import Animated from 'react-native-reanimated';
import { Border, FontFamily } from '@/constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

// ─── TYPES ───────────────────────────────────────────────────────────────────
export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  tags: string[];            // e.g. ['Sơ cấp', 'Ngữ pháp', 'Văn hoá Hàn Quốc']
  level: string;
  timeAgo: string;           // e.g. '7 ngày trước'
  imageUrl: string;
  views: string;             // e.g. '12k'
  likes: number;
  matchPercent?: number;     // e.g. 90 → hiện "Phù hợp với bạn 90%"
  isSaved: boolean;
}

interface ArticleCardProps {
  article: ArticleItem;
  onPress?: () => void;
  onSave?: () => void;
}

// ─── COLOUR PALETTE FOR TAGS (cycles through) ────────────────────────────────
const TAG_COLORS = [
  { bg: '#E8F5E9', text: '#2E7D32' },
  { bg: '#E3F2FD', text: '#1565C0' },
  { bg: '#F3E5F5', text: '#6A1B9A' },
  { bg: '#FFF3E0', text: '#E65100' },
  { bg: '#FCE4EC', text: '#880E4F' },
  { bg: '#E0F7FA', text: '#00695C' },
];

const getTagColor = (index: number) => TAG_COLORS[index % TAG_COLORS.length];

const AnimatedImage = Animated.createAnimatedComponent(
  Image as React.ComponentType<React.ComponentProps<typeof Image> & { sharedTransitionTag?: string }>
);

// ─── VARIANT 1 : ĐỌC NHIỀU / NỔI BẬT (horizontal, giống hình mẫu) ──────────
export const ArticleCardFeatured: React.FC<ArticleCardProps> = ({
  article,
  onPress,
  onSave,
}) => {
    const { colors } = useTheme();

  return (
    <View style={featured.cardOuter}>
      <TouchableOpacity
        style={featured.cardInner}
        activeOpacity={0.85}
        onPress={onPress}
      >
        <View style={featured.mainContent}>
          {/* ── Image ── */}
          <AnimatedImage
            sharedTransitionTag={`article-image-${article.id}`}
            source={{ uri: article.imageUrl }}
            style={featured.image}
            contentFit="cover"
          />

          {/* ── Content ── */}
          <View style={featured.content}>
            {/* Time */}

            {/* Title */}
            <Text style={featured.title} numberOfLines={2}>
              {article.title}
            </Text>

            {/* Tags */}
            <View style={featured.tagRow}>
              <Text style={featured.timeAgo}>{article.timeAgo}</Text>
              {article.tags.map((tag, i) => {
                const col = getTagColor(i);
                return (
                  <PosBadge key={tag} text={`# ${tag}`} bgColor={col.bg} textColor={col.text} />
                );
              })}
            </View>

            {/* Match row */}
            {article.matchPercent !== undefined && (
              <View style={[featured.matchRow, { backgroundColor: colors.greenLight }]}>
                <SparkleIcon size={13} color="#4CAF50" weight="fill" />
                <Text style={[featured.matchText, { color: colors.main2 }]}>
                  Phù hợp với bạn {article.matchPercent}%
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Footer: lượt đọc + thích + bookmark ── */}
        <View style={[featured.footer, { backgroundColor: colors.bg2 }]}>
          <View style={featured.statsRow}>
            <CursorClickIcon size={20} color={colors.gray} weight="fill" />
            <Text style={featured.statsText}>{article.views} lượt</Text>
            <HeartIcon size={20} color={colors.gray} weight="fill" style={{ marginLeft: 8 }} />
            <Text style={featured.statsText}>{article.likes}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// ─── VARIANT 2 : DANH SÁCH ĐƠN THUẦN (vertical: ảnh → title → tags → stats) ─
export const ArticleCardList: React.FC<ArticleCardProps> = ({
  article,
  onPress,
  onSave,
}) => {
  return (
    <TouchableOpacity
      style={list.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {/* ── Ảnh full-width ── */}
      <AnimatedImage
        sharedTransitionTag={`article-image-${article.id}`}
        source={{ uri: article.imageUrl }}
        style={list.image}
        contentFit="cover"
      />

      {/* ── Nội dung bên dưới ── */}
      <View style={list.body}>
        {/* Title */}
        <Text style={list.title} numberOfLines={2}>
          {article.title}
        </Text>

        {/* Time + Tags */}
        <View style={list.metaRow}>
          <Text style={list.timeAgo}>{article.timeAgo}</Text>
          {article.tags.slice(0, 1).map((tag, i) => { // Chỉ hiện 1 tag nổi bật nhất để tránh chật
            const col = getTagColor(i);
            return (
              <PosBadge key={tag} text={`#${tag}`} bgColor={col.bg} textColor={col.text} />
            );
          })}
        </View>

        {/* Match row */}
        {article.matchPercent !== undefined && (
          <View style={list.matchRow}>
            <SparkleIcon size={12} color="#4CAF50" weight="fill" />
            <Text style={list.matchText}>
              Phù hợp với bạn {article.matchPercent}%
            </Text>
          </View>
        )}

        {/* Divider */}
        <View style={list.divider} />

        {/* Stats + Bookmark */}
        <View style={list.footer}>
          <View style={list.statsRow}>
            <CursorClickIcon size={13} color="#9E9E9E" weight="fill" />
            <Text style={list.statsText}>{article.views}</Text>
            <HeartIcon size={13} color="#E57373" weight="fill" style={{ marginLeft: 8 }} />
            <Text style={list.statsText}>{article.likes}</Text>
          </View>
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={onSave}
            activeOpacity={0.6}
          >
            <StarIcon
              size={18}
              color={article.isSaved ? '#F59E0B' : '#BDBDBD'}
              weight={article.isSaved ? 'fill' : 'regular'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── STYLES: FEATURED ────────────────────────────────────────────────────────
const featured = StyleSheet.create({
  cardOuter: {
    backgroundColor: '#FFFFFF',
    borderRadius: Border.br_30 || 30,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    padding: 2,
    // shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    // shadow Android
    elevation: 2,
  },
  cardInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#E8ECF0',
    overflow: 'hidden',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 14,
    gap: 12,
  },
  image: {
    width: 100,
    height: '100%',
    minHeight: 100,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  timeAgo: {
    fontSize: 11,
    color: '#9E9E9E',
    fontFamily: 'LexendDeca_400Regular',
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontFamily: FontFamily.lexendDecaSemiBold,
    color: '#1A1A1A',
    lineHeight: 22,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 4,
  },
  matchText: {
    fontSize: 12,
    fontFamily: FontFamily.lexendDecaMedium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    margin: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 14,
    color: '#9E9E9E',
    fontFamily: FontFamily.lexendDecaMedium,
  },
});

// ─── STYLES: LIST ─────────────────────────────────────────────────────────────
const list = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECF0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  image: {
    width: '100%',
    height: 120, // Giảm chiều cao ảnh để cân đối với khung 2 cột
  },
  body: {
    padding: 12,
  },
  title: {
    fontSize: 14, // Thu nhỏ chữ một chút để tránh rớt quá nhiều dòng
    fontFamily: 'LexendDeca_600SemiBold',
    color: '#1A1A1A',
    lineHeight: 20,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  timeAgo: {
    fontSize: 11,
    color: '#9E9E9E',
    fontFamily: 'LexendDeca_400Regular',
    marginRight: 2,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1FBF2',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  matchText: {
    fontSize: 11,
    fontFamily: 'LexendDeca_500Medium',
    color: '#2E7D32',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 12,
    color: '#9E9E9E',
    fontFamily: 'LexendDeca_400Regular',
  },
});