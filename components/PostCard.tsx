import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ChatCircleIcon, HeartIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding } from '../constants/GlobalStyles';

export interface PostItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  time: string;
  tag: string;
  title: string;
  content: string;
  replies: number;
  likes: number;
}

const PostCard = ({ item }: { item: PostItem }) => {
  // Đổi màu badge dựa trên Tag
  const getBadgeColor = (tag: string) => {
    if (tag === 'Ngữ pháp') return { bg: '#DCFCE7', text: '#15803D' };
    if (tag === 'Từ vựng') return { bg: '#F3E8FF', text: '#7E22CE' };
    return { bg: '#F1F5F9', text: '#64748B' };
  };

  const badge = getBadgeColor(item.tag);

  return (
    <View style={styles.card}>
      {/* Header: User Info */}
      <View style={styles.header}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <View style={styles.timeRow}>
            <Text style={styles.time}>{item.time}</Text>
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, { color: badge.text }]}>{item.tag}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content} numberOfLines={3}>
        {item.content}
      </Text>

      {/* Interactions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionBtn}>
          <ChatCircleIcon size={20} color={Color.stroke} weight="fill" />
          <Text style={styles.actionText}>{item.replies} câu trả lời</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn}>
          <HeartIcon size={20} color={Color.stroke} weight="fill" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Color.bg,
    borderWidth: 1,
    borderColor: Color.stroke || '#E2E8F0',
    borderRadius: Border.br_15 || 15,
    padding: Padding.padding_15 || 15,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12 || 12,
    color: Color.text,
    marginBottom: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_10 || 10,
    color: Color.gray,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: 9,
  },
  title: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16 || 16,
    color: Color.text,
    marginBottom: 8,
  },
  content: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14 || 14,
    color: Color.gray,
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12 || 12,
    color: Color.gray,
  }
});

export default PostCard;