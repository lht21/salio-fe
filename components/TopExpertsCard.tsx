import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ChartBarIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding } from '../constants/GlobalStyles';

const TopExpertsCard = () => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ChartBarIcon size={24} color={Color.cam} weight="fill" />
          <Text style={styles.title}>Top chuyên gia</Text>
        </View>
        <Text style={styles.linkText}>Bảng xếp hạng</Text>
      </View>

      {/* Body: Avatars */}
      <View style={styles.body}>
        {/* Top 1 Avatar */}
        <View style={styles.mainAvatarWrapper}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
            style={styles.mainAvatar} 
          />
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#25</Text>
          </View>
        </View>

        {/* Overlapping Avatars Group */}
        <View style={styles.avatarGroup}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={[styles.smallAvatar, { zIndex: 3 }]} />
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=13' }} style={[styles.smallAvatar, { marginLeft: -12, zIndex: 2 }]} />
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=14' }} style={[styles.smallAvatar, { marginLeft: -12, zIndex: 1 }]} />
          <View style={[styles.moreAvatarBadge, { marginLeft: -12, zIndex: 0 }]}>
            <Text style={styles.moreAvatarText}>+42</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Color.bg,
    borderRadius: Border.br_20 || 20,
    padding: Padding.padding_15 || 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: Color.text,
  },
  linkText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: Color.gray,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainAvatarWrapper: {
    position: 'relative',
    borderWidth: 3,
    borderColor: '#FBBF24', // Vàng cam
    borderRadius: 40,
    padding: 2,
  },
  mainAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    backgroundColor: '#FDE047',
    paddingHorizontal: 8,
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
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Color.bg,
  },
  moreAvatarBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: Color.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreAvatarText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 12,
    color: '#475569',
  },
});

export default TopExpertsCard;