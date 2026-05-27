import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { PlusIcon, MagnifyingGlassIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Padding, Gap } from '../../constants/GlobalStyles';

// Sub-components
import CategoryChip from '../../components/CategoryChip';
import TopExpertsCard from '../../components/TopExpertsCard';
import PostCard, { PostItem } from '../../components/CommunityComponent/PostCard';
import CreatePostModal from '../../components/CommunityComponent/CreatePostModal';
import PostDetailModal from '../../components/CommunityComponent/PostDetailModal';


const CHIPS = ['Tất cả', 'Của tôi', 'Đã thích'];

const MOCK_POSTS: PostItem[] = [
  {
    id: '1',
    user: { name: 'Kathryn Murphy', avatar: 'https://i.pravatar.cc/150?img=5' },
    time: '2 giờ trước',
    tag: 'Ngữ pháp',
    title: 'Word of the day: 호랑이 (Tiger) 🐯',
    content: 'I’m really confused about when to use the topic marker vs the subject marker. Can someone explain it simply? 🤯',
    replies: 12,
    likes: 45,
  },
  {
    id: '2',
    user: { name: 'Ralph Edwards', avatar: 'https://i.pravatar.cc/150?img=11' },
    time: '2 giờ trước',
    tag: 'Ngữ pháp',
    title: 'FPT Edu Biz Talent 2020 tổ chức livestream công bố Top...',
    content: 'Alcohol based exposures through inadvertently consuming hand sanitizer have been observed increasing...',
    replies: 5,
    likes: 21,
  },
  {
    id: '3',
    user: { name: 'Eleanor Pena', avatar: 'https://i.pravatar.cc/150?img=9' },
    time: '5 giờ trước',
    tag: 'Từ vựng',
    title: 'Cách ghi nhớ từ vựng hiệu quả?',
    content: 'Mọi người có phương pháp nào học từ vựng nhớ lâu không ạ? Em học trước quên sau buồn quá 😭',
    replies: 34,
    likes: 102,
  },
];

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [isCreatePostModalVisible, setCreatePostModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  // Header chứa các phần tĩnh bên trên danh sách
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Title Bar */}
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Cộng đồng trao đổi</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity activeOpacity={0.7}>
            <MagnifyingGlassIcon size={24} color={Color.text} weight="bold" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setCreatePostModalVisible(true)}>
            <PlusIcon size={24} color={Color.text} weight="bold" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Experts */}
      <TopExpertsCard />

      <View style={styles.chipRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {CHIPS.map(cat => (
            <CategoryChip
              key={cat}
              label={cat}
              isActive={activeTab === cat}
              onPress={() => setActiveTab(cat)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <FlatList
        data={MOCK_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard item={item} onCommentPress={() => setSelectedPost(item)} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal Tạo bài viết */}
      <CreatePostModal 
        isVisible={isCreatePostModalVisible} 
        onClose={() => setCreatePostModalVisible(false)} 
      />

      {/* Modal Chi tiết bài viết & Bình luận */}
      <PostDetailModal
        isVisible={!!selectedPost}
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg,
    paddingTop: 50,
  },
  listContent: {
    paddingHorizontal: Padding.padding_15 || 15,
    paddingTop: 20,
    paddingBottom: 40,
    zIndex: 1,
  },
  headerContainer: {
    marginBottom: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Gap.gap_20 || 20,
  },
  pageTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold, 
    fontSize: FontSize.fs_20 || 20, 
    color: Color.text || '#1E1E1E' 
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Gap.gap_15 || 15,
  },
  chipRow: {
    marginBottom: 24,
  },
  chipScroll: {
    gap: 10,
  },
});