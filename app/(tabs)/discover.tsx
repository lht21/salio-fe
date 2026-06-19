import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MagnifyingGlassIcon, UsersThreeIcon, CaretRightIcon, BookmarkSimpleIcon } from 'phosphor-react-native';
import { Image } from 'expo-image';
import { Color, FontFamily, FontSize, Padding, Border, Gap } from '../../constants/GlobalStyles';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import CategoryChip from '../../components/CategoryChip';
import { ArticleCardList, ArticleCardFeatured } from '../../components/Discover/Articlecard';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import CreateSetButton from '../../components/CreateSetButton';
import MainTab from '../../components/MainTab';
import DiscoverGroupIcon from '../../components/icons/DiscoverGroupIcon';
import Award04Icon from '../../components/icons/Award04Icon';

// MOCK DATA CHO MÀN HÌNH KHÁM PHÁ MỚI
const ARTICLE_TAGS = ['Tất cả', 'Văn hoá Hàn Quốc', 'Tin tức TOPIK', 'K-Pop & Đời sống', 'Luyện dịch'];
const MOCK_ARTICLES = [
  {
    id: '1',
    title: 'Tại sao người Hàn Quốc lại ăn canh rong biển vào sinh nhật?',
    category: 'Văn hoá Hàn Quốc',
    level: 'Sơ cấp',
    tags: ['Văn hoá', 'Sơ cấp'],
    timeAgo: '2 giờ trước',
    imageUrl: 'https://images.unsplash.com/photo-1583032410884-2f22e84865bd?auto=format&fit=crop&q=80&w=600',
    views: '1.2k',
    likes: 342,
    isSaved: true,
    matchPercent: 95,
  },
  {
    id: '2',
    title: 'Cập nhật cấu trúc đề thi TOPIK II năm 2024 có gì mới?',
    category: 'Tin tức TOPIK',
    level: 'Trung cấp',
    tags: ['TOPIK', 'Trung cấp'],
    timeAgo: '1 ngày trước',
    imageUrl: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?auto=format&fit=crop&q=80&w=600',
    views: '3.4k',
    likes: 128,
    isSaved: false,
    matchPercent: 80,
  },
  {
    id: '3',
    title: 'Giải mã những từ lóng giới trẻ Hàn Quốc hay dùng trên KakaoTalk',
    category: 'K-Pop & Đời sống',
    level: 'Sơ cấp',
    tags: ['Từ lóng', 'K-Pop'],
    timeAgo: '3 ngày trước',
    imageUrl: 'https://images.unsplash.com/photo-1579724185791-7661b17d09ac?auto=format&fit=crop&q=80&w=600',
    views: '5k',
    likes: 892,
    isSaved: false,
    matchPercent: 65,
  }
];

const MOCK_LEADERBOARD = [
  { id: '1', groupName: 'Gia Tộc Hổ Trắng 🐯', points: '12,450', rank: 1, isMyGroup: false },
  { id: '2', groupName: 'Cày TOPIK 5 🚀', points: '11,200', rank: 2, isMyGroup: false },
  { id: '3', groupName: 'Người đá chéo sân ⚽', points: '10,950', rank: 3, isMyGroup: true },
  { id: '4', groupName: 'Hội yêu K-Drama 📺', points: '9,800', rank: 4, isMyGroup: false },
];

// --- COMPONENT HIỆU ỨNG FADE IN (HIỆN DẦN) ---
const FadeInView = ({ children, index }: { children: React.ReactNode, index: number }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(index * 100, withTiming(0, { duration: 500 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[animatedStyle, { width: '100%' }]}>{children}</Animated.View>;
};

export default function DiscoverScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  // Tab Switcher State: 'social' (Nhóm & Xếp hạng) | 'content' (Báo chí)
  const [activeTab, setActiveTab] = useState<'social' | 'content'>('content');
  const [activeArticleTag, setActiveArticleTag] = useState('Tất cả');

  // Render Custom Top Tabs
  const renderTopTabs = () => (
    <View style={styles.tabContainer}>
      <MainTab 
        label="Tin tức & Văn hoá"
        isActive={activeTab === 'content'}
        onPress={() => setActiveTab('content')}
        icon={<DiscoverGroupIcon width={40} height={40} />}
        style={{ flex: 1 }}
        activeTextColor={colors.main}
      />

      <MainTab 
        label="Xếp hạng"
        isActive={activeTab === 'social'}
        onPress={() => setActiveTab('social')}
        icon={<Award04Icon width={40} height={40} />}
        style={{ flex: 1 }}
        activeTextColor={colors.main}
      />
    </View>
  );

  // --- TAB 1: BÁO CHÍ & VĂN HOÁ ---
  const renderContentTab = () => (
    <View style={styles.tabSection}>
      {/* Chips Phân loại */}
      <View style={styles.chipRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {ARTICLE_TAGS.map(tag => (
            <CategoryChip
              key={tag}
              label={tag}
              isActive={activeArticleTag === tag}
              onPress={() => setActiveArticleTag(tag)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Danh sách Báo chí */}
      <View style={styles.articlesList}>
        {/* Bài viết nổi bật (Featured) */}
        {MOCK_ARTICLES.length > 0 && (
          <FadeInView index={0}>
            <ArticleCardFeatured
              article={MOCK_ARTICLES[0]}
              onPress={() => router.push({ pathname: `/article/${MOCK_ARTICLES[0].id}`, params: { imageUrl: MOCK_ARTICLES[0].imageUrl } } as any)}
            />
          </FadeInView>
        )}
        
        {/* Các bài viết khác (List) */}
        <View style={styles.articleGrid}>
          {MOCK_ARTICLES.slice(1).map((article, index) => (
            <View key={article.id} style={styles.gridItem}>
              <FadeInView index={index + 1}>
                <ArticleCardList
                  article={article}
                  onPress={() => router.push({ pathname: `/article/${article.id}`, params: { imageUrl: article.imageUrl } } as any)}
                />
              </FadeInView>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  // --- TAB 2: HỌC NHÓM & XẾP HẠNG ---
  const renderSocialTab = () => (
    <View style={styles.tabSection}>
      {/* Card Gia Tộc Của Tôi */}
      <TouchableOpacity 
        style={styles.myGroupCard} 
        activeOpacity={0.9}
        onPress={() => router.push(`/group/my-group-id` as any)}
      >
        <View style={styles.myGroupHeader}>
          <View>
            <Text style={styles.myGroupSub}>Gia tộc của bạn</Text>
            <Text style={styles.myGroupTitle}>Người đá chéo sân ⚽</Text>
          </View>
          <View style={styles.myGroupRank}>
            <Text style={styles.myGroupRankText}>Hạng 3</Text>
          </View>
        </View>
        
        <Text style={styles.progressLabel}>Mục tiêu tuần: 10,950 / 15,000 Mây</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '73%' }]} />
        </View>
      </TouchableOpacity>

      {/* Bảng Xếp Hạng Các Gia Tộc */}
      <View style={styles.leaderboardSection}>
        <View style={styles.leaderboardHeader}>
          <Text style={styles.sectionTitle}>Giải đấu tuần này</Text>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
            <CaretRightIcon size={14} color={colors.main2} weight="bold" />
          </TouchableOpacity>
        </View>

        <View style={styles.leaderboardList}>
          {MOCK_LEADERBOARD.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.leaderboardItem, item.isMyGroup && styles.leaderboardItemActive]}
              activeOpacity={0.7}
              onPress={() => router.push(`/discover/group/${item.id}` as any)}
            >
              <View style={styles.rankBox}>
                <Text style={styles.rankText}>{item.rank}</Text>
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{item.groupName}</Text>
                <Text style={styles.groupPoints}>{item.points} Mây</Text>
              </View>
              <UsersThreeIcon size={20} color={colors.gray} weight="fill" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Khám phá</Text>
        <CreateSetButton 
          title="Tìm nội dung bạn thích!"
          icon={<MagnifyingGlassIcon size={15} color="#FFFFFF" weight="bold" />}
          onPress={() => { /* TODO: Điều hướng sang màn tìm kiếm */ }}
        />
      </View>

      {renderTopTabs()}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'content' ? renderContentTab() : renderSocialTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Padding.padding_20,
    marginBottom: Gap.gap_15,
  },
  pageTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold, 
    fontSize: FontSize.fs_24, 
    color: Color.text 
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: Padding.padding_20,
    gap: 10,
    marginBottom: Gap.gap_20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  tabSection: {
    flex: 1,
  },
  
  // --- STYLES BÁO CHÍ ---
  chipRow: {
    marginBottom: 16,
  },
  chipScroll: {
    paddingHorizontal: Padding.padding_20,
    gap: 10,
  },
  articlesList: {
    paddingHorizontal: Padding.padding_20,
    gap: 16,
  },
  articleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8, // Bù trừ cho padding của gridItem
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: Color.bg,
    borderRadius: Border.br_15,
    borderWidth: 1,
    borderColor: Color.stroke,
    padding: 12,
    gap: 12,
  },
  articleImage: {
    width: 80,
    height: 80,
    borderRadius: Border.br_10,
  },
  articleInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleCategory: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 11,
    color: Color.main2,
  },
  levelBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 10,
    color: Color.gray,
  },
  articleTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
    lineHeight: 20,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  articleStats: {
    flexDirection: 'row',
  },
  articleViews: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: 11,
    color: Color.gray,
  },

  // --- STYLES SOCIAL ---
  myGroupCard: {
    marginHorizontal: Padding.padding_20,
    backgroundColor: '#9BF08A', // Màu xanh lá chủ đạo
    borderRadius: Border.br_20,
    padding: 20,
    marginBottom: Gap.gap_20,
  },
  myGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  myGroupSub: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: '#2F7A4D', // Xanh đậm
    marginBottom: 4,
  },
  myGroupTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  myGroupRank: {
    backgroundColor: Color.bg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Border.br_10,
  },
  myGroupRankText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  progressLabel: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 11,
    color: '#2F7A4D',
    marginBottom: 6,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Color.text,
  },
  leaderboardSection: {
    paddingHorizontal: Padding.padding_20,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: Color.main2,
  },
  leaderboardList: {
    gap: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.bg,
    borderWidth: 1,
    borderColor: Color.stroke,
    padding: 12,
    borderRadius: Border.br_15,
  },
  leaderboardItemActive: {
    borderColor: Color.main,
    backgroundColor: '#F8FFF7',
  },
  rankBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14,
    color: Color.text,
    marginBottom: 2,
  },
  groupPoints: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: Color.gray,
  },
});