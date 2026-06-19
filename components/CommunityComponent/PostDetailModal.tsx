import React, { useState, useEffect } from 'react';
import { 
  Modal, View, Text, StyleSheet, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView, TextInput 
} from 'react-native';
import { Image } from 'expo-image';
import { PaperPlaneRightIcon, ChatCircleIcon, HeartIcon } from 'phosphor-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';

import IconButton from '../IconButton';
import { XIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize, Border, Padding, Gap } from '../../constants/GlobalStyles';
import { PostItem } from './PostCard';

// --- MOCK DATA ---
const MOCK_COMMENTS = [
  { 
    id: 'c1', 
    user: { name: 'Jenny Wilson', avatar: 'https://i.pravatar.cc/150?img=12' }, 
    content: 'Bài viết rất hữu ích, cảm ơn bạn!', 
    time: '1 giờ trước', 
    isCurrentUser: false 
  },
  { 
    id: 'c2', 
    user: { name: 'Bạn', avatar: 'https://i.pravatar.cc/150?img=47' }, 
    content: 'Mình cũng đang thắc mắc phần này giống bạn.', 
    time: '30 phút trước', 
    isCurrentUser: true 
  },
];

export type PostDetailModalProps = {
  isVisible: boolean;
  post: PostItem | null;
  onClose: () => void;
};

export default function PostDetailModal({ isVisible, post, onClose }: PostDetailModalProps) {
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const scale = useSharedValue(1);

  useEffect(() => {
    if (post) {
      setLikesCount(post.likes);
      setIsLiked(false);
    }
  }, [post]);

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

  if (!post) return null;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView 
        style={styles.overlay} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheetContent}>
          <View style={styles.dragHandle} />
          
          {/* Header */}
          <View style={styles.header}>
            <IconButton Icon={XIcon} onPress={onClose} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Nội dung bài viết (Thiết kế giống hệt PostCard) */}
            <View style={styles.postContainer}>
              <View style={styles.part1}>
                <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
                <Text style={styles.userName}>{post.user.name}</Text>
              </View>
              <View style={styles.part2}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.content}>{post.content}</Text>
              </View>
              <View style={styles.part3}>
                <View style={styles.actionBtn}>
                  <ChatCircleIcon size={20} color={Color.gray} weight="fill" />
                  <Text style={styles.actionText}>{post.replies}</Text>
                </View>
                <TouchableOpacity style={styles.actionBtn} onPress={handleLike} activeOpacity={0.7}>
                  <Animated.View style={heartStyle}>
                    <HeartIcon size={20} color={isLiked ? '#EF4444' : Color.gray} weight="fill" />
                  </Animated.View>
                  <Text style={[styles.actionText, isLiked && { color: '#EF4444' }]}>{likesCount}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.part4}>
                <Text style={styles.metaText}>{post.time}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>#{post.tag}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Danh sách bình luận */}
            <Text style={styles.commentSectionTitle}>Bình luận ({MOCK_COMMENTS.length})</Text>
            {MOCK_COMMENTS.map(comment => (
              <View key={comment.id} style={styles.commentWrapper}>
                {/* Component bình luận (Bao gồm Avatar, Tên, Nội dung chung 1 khối nền bg) */}
                <View style={styles.commentCard}>
                  <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
                  <View style={styles.commentBody}>
                    <Text style={styles.commentName}>{comment.user.name}</Text>
                    <Text style={styles.commentText}>{comment.content}</Text>
                  </View>
                </View>
                {/* Thời gian và Action xoá nằm ngoài khối nền */}
                <View style={styles.commentFooter}>
                  <Text style={styles.commentTime}>{comment.time}</Text>
                  {comment.isCurrentUser && (
                    <TouchableOpacity activeOpacity={0.6}>
                      <Text style={styles.deleteText}>Xóa</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Section Nhập bình luận cố định dưới cùng */}
          <View style={styles.inputSection}>
            <TextInput
              style={styles.textInput}
              placeholder="Viết bình luận..."
              placeholderTextColor={Color.gray}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} disabled={!commentText.trim()}>
              <PaperPlaneRightIcon size={24} color={commentText.trim() ? Color.main2 : Color.gray} weight="fill" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  sheetContent: { backgroundColor: Color.bg, borderTopLeftRadius: Border.br_30, borderTopRightRadius: Border.br_30, height: '90%', paddingTop: Padding.padding_15 },
  dragHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: Gap.gap_15 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: Padding.padding_20, marginBottom: Gap.gap_10 },
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text },
  scrollContent: { paddingHorizontal: Padding.padding_20, paddingBottom: 40, },
  
  // --- ORIGINAL POST LAYOUT ---
  postContainer: { marginBottom: Gap.gap_20 },
  part1: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  userName: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14, color: Color.text },
  part2: { marginBottom: 12 },
  title: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text, marginBottom: 8 },
  content: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.text, lineHeight: 22 },
  part3: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 24, marginBottom: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: Color.gray },
  part4: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: '#94A3B8' },
  metaDot: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: '#94A3B8', marginHorizontal: 6 },
  
  divider: { height: 1, backgroundColor: Color.stroke, marginBottom: Gap.gap_20 },
  
  // --- COMMENTS SECTION ---
  commentSectionTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text, marginBottom: Gap.gap_15 },
  commentWrapper: { marginBottom: Gap.gap_15 },
  commentCard: {
    flexDirection: 'row', backgroundColor: Color.bg, borderWidth: 1, borderColor: Color.stroke,
    borderRadius: Border.br_20, padding: 12, marginBottom: 6,
  },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: Gap.gap_10 },
  commentBody: { flex: 1, justifyContent: 'center' },
  commentName: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_14, color: Color.text, marginBottom: 2 },
  commentText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.text, lineHeight: 20 },
  
  // Padding left = avatar width (32) + marginRight (10) + padding inside card (12) = 54
  commentFooter: { flexDirection: 'row', alignItems: 'center', marginLeft: 54 }, 
  commentTime: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_12, color: Color.gray, marginRight: Gap.gap_15 },
  deleteText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_12, color: '#EF4444' }, 
  
  // --- BOTTOM INPUT SECTION ---
  inputSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Padding.padding_20, paddingVertical: 12, borderTopWidth: 1, borderTopColor: Color.stroke, backgroundColor: Color.bg },
  textInput: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_14, color: Color.text, maxHeight: 100 },
  sendButton: { marginLeft: Gap.gap_10, padding: 8 }
});