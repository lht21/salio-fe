import React, { useState, useMemo } from 'react';
import { Keyboard, StyleSheet, View, Modal, Pressable, Text, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { CheckIcon, PaperPlaneRightIcon, PlusCircleIcon } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../contexts/ThemeContext';
import IconButton from '../IconButton';
import { XIcon } from 'phosphor-react-native';
import { CustomInput } from '../CustomInput';
import { FontFamily, FontSize, Border, Padding, Gap, Color } from '../../constants/GlobalStyles';

const TAGS = ['Ngữ pháp', 'Từ vựng', 'Luyện nói', 'Luyện viết', 'TOPIK', 'EPS'];

export type CreatePostModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSubmit?: (data: { title: string; content: string; tags: string[] }) => void;
};

const CreatePostModal = ({ isVisible, onClose, onSubmit }: CreatePostModalProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSelectedTags([]);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handlePost = () => {
    if (title.trim() && content.trim() && selectedTags.length > 0) {
      if (onSubmit) {
        onSubmit({ title: title.trim(), content: content.trim(), tags: selectedTags });
      }
      handleClose();
      resetForm();
    }
  };

  // Kiểm tra điều kiện để hiện nút Đăng
  const isFormValid = Boolean(title.trim() && content.trim() && selectedTags.length > 0);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backgroundTouchable} onPress={handleClose} />
        <View style={styles.sheetContent}>
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('community.createPost', 'Tạo bài viết')}</Text>
            <View style={styles.headerRight}>
              {/* Nút Đăng chỉ hiện khi điền đủ thông tin */}
              {isFormValid && (
                <TouchableOpacity style={styles.postBtn} onPress={handlePost} activeOpacity={0.8}>
                  <Text style={styles.postBtnText}>{t('community.post', 'Đăng')}</Text>
                  <PaperPlaneRightIcon size={16} color="#FFFFFF" weight="fill" />
                </TouchableOpacity>
              )}
              <IconButton Icon={XIcon} onPress={handleClose} />
            </View>
          </View>

          {/* Body Content */}
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
          >
            {/* Input Tiêu đề (Phá cách, chữ to, không viền) */}
            <TextInput
              style={styles.titleInput}
              placeholder={t('community.titlePlaceholder', 'Tiêu đề')}
              placeholderTextColor={colors.stroke}
              value={title}
              onChangeText={setTitle}
              multiline
            />

            {/* Input Nội dung (Sử dụng CustomInput) */}
            <CustomInput
              placeholder={t('community.contentPlaceholder', 'Bạn muốn thảo luận về điều gì? (Tối đa 500 chữ)')}
              value={content}
              onChangeText={setContent}
              multiline
              maxLength={500}
              style={styles.contentInput}
              textAlignVertical="top"
            />

            {/* Phần chọn Tag */}
            <Text style={styles.tagSectionTitle}>{t('community.chooseTag', 'Gắn thẻ chủ đề')}</Text>
            <View style={styles.tagsContainer}>
              {TAGS.map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[styles.tagPill, isActive && styles.tagPillActive]}
                    onPress={() => {
                      if (isActive) {
                        // Bỏ chọn tag
                        setSelectedTags(prev => prev.filter(t => t !== tag));
                      } else {
                        // Chọn tag
                        setSelectedTags(prev => [...prev, tag]);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    {isActive ? (
                      <CheckIcon size={16} color="#FFFFFF" weight="bold" />
                    ) : (
                      <PlusCircleIcon size={16} color={colors.gray} weight="fill" />
                    )}
                    <Text style={[styles.tagText, isActive && styles.tagTextActive]}>{tag}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.modalOverlayBg || 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
  backgroundTouchable: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  sheetContent: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: Border.br_30,
    borderTopRightRadius: Border.br_30,
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_15,
    paddingBottom: 40,
    maxHeight: '90%', // Đảm bảo modal không bị lấp đầy toàn bộ màn hình
  },
  dragHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: colors.dragHandleBg || '#CBD5E1', alignSelf: 'center', marginBottom: Gap.gap_15 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
  headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.text },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Gap.gap_10 },
  
  postBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Color.main2, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 6 },
  postBtnText: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_14, color: '#FFFFFF' },

  body: { paddingBottom: 20 },
  
  titleInput: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: 32, // Cỡ chữ quá cỡ phá cách
    color: colors.text,
    padding: 0,
    marginBottom: Gap.gap_15,
  },
  contentInput: { minHeight: 180 }, // Giãn nội dung theo nhu cầu người dùng

  tagSectionTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.text, marginTop: Gap.gap_20, marginBottom: Gap.gap_15 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Gap.gap_10 },
  tagPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.stroke, gap: 6 },
  tagPillActive: { backgroundColor: Color.main2, borderColor: Color.main2 },
  tagText: { fontFamily: FontFamily.lexendDecaMedium, fontSize: FontSize.fs_14, color: colors.text },
  tagTextActive: { color: '#FFFFFF' },
});

export default CreatePostModal;