import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import Button, { ButtonVariant } from './Button';
import IconButton from './IconButton';
import { XIcon } from 'phosphor-react-native';
import { ConfirmModal } from './ModalResult/ConfirmModal';
import { Border, FontFamily, FontSize, Gap, Padding } from '../constants/GlobalStyles';
import { useTheme } from "@/contexts/ThemeContext";

type LessonIntroTemplateProps = {
  imageSource: any;
  heading: string;
  description: string;
  accentText?: string;
  buttonVariant?: ButtonVariant;
  leftMetaText?: string;
  rightMetaText?: string;
  nextPath: (lessonId: string) => string;
};

const LessonIntroTemplate = ({
  imageSource,
  heading,
  description,
  accentText,
  buttonVariant = 'Green',
  leftMetaText,
  rightMetaText,
  nextPath,
}: LessonIntroTemplateProps) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const resolvedLessonId = lessonId ?? '1';

  const [showExitModal, setShowExitModal] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* 1. HEADER: Chỉ có nút X ở góc phải */}
      <View style={styles.header}>
        <IconButton Icon={XIcon} variant="Stroke" onPress={() => setShowExitModal(true)} />
      </View>

      {/* 2. NỘI DUNG CHÍNH */}
      <View style={styles.content}>
        
        {/* Phần 1: Hình ảnh minh họa */}
        <Image
          source={imageSource}
          style={styles.illustration}
          resizeMode="cover"
        />

        {/* Phần 2: Tiêu đề Vòng học */}
        <View style={styles.titleRow}>
          <Text style={styles.roundText}>{leftMetaText ?? heading}</Text>
          <Text style={styles.titleText}>{rightMetaText ?? accentText}</Text>
        </View>

        {/* Phần 3: Khung mô tả */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>
            {description}
          </Text>
        </View>
        
      </View>

      {/* 3. FOOTER: Nút Bắt đầu */}
      <View style={styles.footer}>
        <Button 
          title="Bắt đầu" 
          variant={buttonVariant} 
          onPress={() => router.push(nextPath(resolvedLessonId) as any)} 
        />
      </View>

      {/* MODAL XÁC NHẬN THOÁT HỌC GIỮA CHỪNG */}
      <ConfirmModal 
        isVisible={showExitModal}
        title="Đang học dở mà"
        subtitle="Bạn sắp hoàn thành rồi, cố thêm chút nữa nhé!"
        cancelText="Vẫn rời đi"
        confirmText="Học tiếp"
        onCancel={() => {
          setShowExitModal(false);
          router.back();
        }}
        onConfirm={() => setShowExitModal(false)}
      />

    </SafeAreaView>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: colors.bg,
      },
      
      header: {
        alignItems: 'flex-end',
        paddingHorizontal: Padding.padding_15,
        paddingTop: Padding.padding_10,
      },

      content: {
        flex: 1,
        paddingHorizontal: Padding.padding_20,
        justifyContent: 'center',
        alignItems: 'center',
      },

      illustration: {
        width: 250,
        height: 270,
        borderRadius: 40,
        marginBottom: 40,
      },

      titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: Gap.gap_20,
      },
      
      roundText: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: FontSize.fs_20,
        color: colors.text,
      },
      
      titleText: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: FontSize.fs_20,
        color: colors.cam,
      },

      descriptionBox: {
        width: '100%',
        backgroundColor: colors.greenLight,
        paddingVertical: Padding.padding_20,
        paddingHorizontal: 20,
        borderRadius: Border.br_20,
        borderWidth: 1.5,
        borderColor: colors.main,
        borderStyle: 'dashed',
        alignItems: 'center',
      },
      
      descriptionText: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_14,
        color: colors.text,
        textAlign: 'center',
        lineHeight: 24,
      },

      footer: {
        paddingHorizontal: Padding.padding_15,
        paddingBottom: Padding.padding_30,
        paddingTop: Padding.padding_10,
      },
    });

export default LessonIntroTemplate;
