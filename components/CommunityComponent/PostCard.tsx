import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ChatCircleIcon, HeartIcon } from 'phosphor-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withSpring } from 'react-native-reanimated';
import { Color, FontFamily, FontSize, Border, Padding } from '../../constants/GlobalStyles';

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

const PostCard = ({ item, onCommentPress }: { item: PostItem; onCommentPress?: () => void }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes);

  const scale = useSharedValue(1);

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
      // Hiệu ứng tim nảy lên
      scale.value = withSequence(
        withSpring(1.5),
        withSpring(1)
      );
    }
  };

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.card}>
      {/* Phần 1: User Info (Avatar + Tên) */}
      <View style={styles.part1}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{item.user.name}</Text>
      </View>

      {/* Phần 2: Title & Content */}
      <View style={styles.part2}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content} numberOfLines={3}>
          {item.content}
        </Text>
      </View>

      {/* Phần 3: Interactions (Bình luận & Tim) */}
      <View style={styles.part3}>
        <TouchableOpacity style={styles.actionBtn} onPress={onCommentPress} activeOpacity={0.7}>
          <ChatCircleIcon size={20} color={Color.gray} weight="fill" />
          <Text style={styles.actionText}>{item.replies}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike} activeOpacity={0.7}>
          <Animated.View style={heartStyle}>
            <HeartIcon size={20} color={isLiked ? '#EF4444' : Color.gray} weight="fill" />
          </Animated.View>
          <Text style={[styles.actionText, isLiked && { color: '#EF4444' }]}>{likesCount}</Text>
        </TouchableOpacity>
      </View>

      {/* Phần 4: Time & Tags (Không nổi bật) */}
      <View style={styles.part4}>
        <Text style={styles.metaText}>{item.time}</Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.metaText}>#{item.tag}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Color.bg,
    borderWidth: 1,
    borderColor: Color.stroke || '#E2E8F0',
    borderRadius: Border.br_30 || 15,
    padding: Padding.padding_20 || 15,
    marginBottom: 16,
  },
  part1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  userName: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14 || 14,
    color: Color.text,
  },
  part2: {
    marginBottom: 12,
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
  },
  part3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 24,
    marginBottom: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_14 || 14,
    color: Color.gray,
  },
  part4: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12 || 12,
    color: '#94A3B8', // Màu xám nhạt, làm chìm nội dung
  },
  metaDot: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12 || 12,
    color: '#94A3B8',
    marginHorizontal: 6,
  }
});

export default PostCard;