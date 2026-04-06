import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlusIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Padding, Gap } from '../../constants/GlobalStyles';

// Sub-components
import SearchBar from '../../components/SearchBar';
import CategoryChip from '../../components/CategoryChip';
import TopExpertsCard from '../../components/TopExpertsCard';
import PostCard, { PostItem } from '../../components/PostCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const CHIPS = ['Tất cả', 'Ngữ pháp', 'Từ vựng'];

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
  const [searchText, setSearchText] = useState('');

  // Header chứa các phần tĩnh bên trên danh sách
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Title Bar */}
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Cộng đồng trao đổi</Text>
        <TouchableOpacity>
          <PlusIcon size={24} color={Color.text} weight="bold" />
        </TouchableOpacity>
      </View>

      {/* Search & Filter */}
      <SearchBar 
        placeholder="Tìm kiếm"
        value={searchText}
        onChangeText={setSearchText}
      />

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

      {/* Top Experts */}
      <TopExpertsCard />
    </View>
  );

  return (
    <View style={styles.safeArea}>
      {/* Absolute Background Gradient ở phía trên */}
      <LinearGradient
        colors={[Color.main || '#98F291', '#D4F5C9', Color.bg]}
        style={styles.backgroundGradient}
      />

      <FlatList
        data={MOCK_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard item={item} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320, // Chiếm khoảng 25% màn hình và mờ dần xuống màu trắng
    zIndex: 0,
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
  chipRow: {
    marginBottom: 24,
  },
  chipScroll: {
    gap: 10,
  },
});