import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Color, Padding, Gap } from '../../constants/GlobalStyles';
import ScreenHeader from '../../components/ScreenHeader';
import CategoryChip from '../../components/CategoryChip';
import TopRankCard from '../../components/CommunityComponent/TopRankCard';
import RankCard from '../../components/CommunityComponent/RankCard';

// --- MOCK DATA ---
const MOCK_LEADERBOARD = [
  { id: '1', rank: 1, name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?img=11', score: '2,500' },
  { id: '2', rank: 2, name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?img=5', score: '2,350' },
  { id: '3', rank: 3, name: 'Lê Hoàng C', avatar: 'https://i.pravatar.cc/150?img=8', score: '2,200' },
  { id: '4', rank: 4, name: 'Phạm Minh D', avatar: 'https://i.pravatar.cc/150?img=12', score: '1,950' },
  { id: '5', rank: 5, name: 'Hoàng Tú', avatar: 'https://i.pravatar.cc/150?img=14', score: '1,800' },
  { id: '6', rank: 6, name: 'Bùi Thảo', avatar: 'https://i.pravatar.cc/150?img=20', score: '1,750' },
  { id: '7', rank: 7, name: 'Khánh Linh', avatar: 'https://i.pravatar.cc/150?img=23', score: '1,600' },
  { id: '8', rank: 8, name: 'Gia Bảo', avatar: 'https://i.pravatar.cc/150?img=33', score: '1,550' },
];

const CURRENT_USER = { id: 'u1', rank: 42, name: 'Bạn', avatar: 'https://i.pravatar.cc/150?img=47', score: '450' };

// --- MAIN SCREEN ---

export default function LeaderboardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Điểm TOPIK');

  const top3 = MOCK_LEADERBOARD.slice(0, 3);
  // Sắp xếp lại thứ tự hiển thị: Top 2 - Top 1 - Top 3
  const top3Display = [top3[1], top3[0], top3[2]];
  const others = MOCK_LEADERBOARD.slice(3);

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Chips Filter */}
      <View style={styles.chipRow}>
        {['Điểm TOPIK', 'Chuỗi', 'Đám mây'].map(tab => (
          <CategoryChip
            key={tab}
            label={tab}
            isActive={activeTab === tab}
            onPress={() => setActiveTab(tab)}
          />
        ))}
      </View>

      {/* Top 3 Bục vinh quang */}
      <View style={styles.top3Container}>
        {top3Display.map((item, index) => {
          if (!item) return <View key={index} style={{ flex: 1 }} />;
          return <TopRankCard key={item.id} item={item} rank={item.rank} />;
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader 
        title="Bảng xếp hạng" 
        showBackButton={true} 
        onBackPress={() => router.back()} 
      />
      
      <FlatList
        data={others}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <RankCard item={item} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Thanh thứ hạng cá nhân neo dưới cùng */}
      <View style={styles.fixedBottom}>
        <RankCard item={CURRENT_USER} isCurrentUser={true} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  listContent: {
    paddingHorizontal: Padding.padding_15,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: Color.bg2
  },
  listHeader: {
    marginBottom: Gap.gap_20,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Gap.gap_10,
    marginBottom: 30,
  },
  
  // --- TOP 3 RANK CARDS ---
  top3Container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: Gap.gap_12,
    paddingHorizontal: Gap.gap_10,
    paddingTop: 10,
    marginBottom: 20,
  },
  // Cố định bottom
  fixedBottom: {
    paddingHorizontal: Padding.padding_15,
    paddingTop: Padding.padding_10,
    paddingBottom: 10,
    backgroundColor: Color.bg,
    borderTopWidth: 1,
    borderTopColor: Color.stroke,
  },
});