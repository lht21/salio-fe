import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { CaretRightIcon, FireIcon, CloudIcon, TrophyIcon } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { Color, FontFamily, FontSize, Border, Padding } from '../constants/GlobalStyles';

interface RankItemProps {
  type: 'streak' | 'cloud' | 'score';
  rank: number;
  avatarUrl: string;
}

const RankItem = ({ type, rank, avatarUrl }: RankItemProps) => {
  const renderBgIcon = () => {
    switch (type) {
      case 'streak': return <FireIcon size={100} color="#EA580C" weight="fill" opacity={0.15} />;
      case 'cloud': return <CloudIcon size={100} color="#3B82F6" weight="fill" opacity={0.15} />;
      case 'score': return <TrophyIcon size={100} color="#FBBF24" weight="fill" opacity={0.15} />;
    }
  };

  return (
    <View style={styles.rankItem}>
      <View style={styles.bgIcon}>
        {renderBgIcon()}
      </View>
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{rank}</Text>
        </View>
      </View>
    </View>
  );
};

const TopExpertsCard = () => {
  const router = useRouter();
  // Mock avatar cho user hiện tại (có thể thay bằng avatarUrl từ context sau)
  const userAvatar = 'https://i.pravatar.cc/150?img=11';

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => router.push('/community/leaderboard')}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bảng xếp hạng</Text>
        <CaretRightIcon size={16} color={Color.gray} weight="bold" />
      </View>

      {/* Body: 3 Rank Items */}
      <View style={styles.body}>
        <RankItem type="streak" rank={12} avatarUrl={userAvatar} />
        <RankItem type="cloud" rank={5} avatarUrl={userAvatar} />
        <RankItem type="score" rank={108} avatarUrl={userAvatar} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Color.bg,
    borderRadius: Border.br_20 || 20,
    padding: Padding.padding_20 || 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12 || 16,
    color: Color.text,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  rankItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
  },
  bgIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    transform: [{ rotate: '-20deg' }],
  },
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: Border.br_30 || 15,
    borderWidth: 2,
    borderColor: Color.bg,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    backgroundColor: Color.cam,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Color.bg,
  },
  rankText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 10,
    color: '#B45309',
  },
});

export default TopExpertsCard;