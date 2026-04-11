import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SpeakerHighIcon, BookmarkSimpleIcon } from 'phosphor-react-native';

import { Color, FontFamily, FontSize, Padding, Gap, Border } from '../../../../constants/GlobalStyles';
import CloseButton from '../../../../components/CloseButton';
import Button from '../../../../components/Button';
import SaveToFolderModal from '../../../../components/ModalOption/SaveToFolderModal';
import { ConfirmModal } from '../../../../components/ModalResult/ConfirmModal'; 


// --- MOCK DATA ---
const RESULTS = [
  { id: '1', word: '학생', isCorrect: true, phonetic: 'hak sen', meaning: 'Học sinh', type: 'Danh từ' },
  { id: '2', word: '학교', isCorrect: false, phonetic: 'hak kyo', meaning: 'Trường học', type: 'Danh từ' },
  { id: '3', word: '선생님', isCorrect: true, phonetic: 'seon-saeng-nim', meaning: 'Giáo viên', type: 'Danh từ' },
];

export default function VocabularyResultScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams();
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState<any>(null);
  // STATE HIỂN THỊ MODAL THOÁT
  const [showExitModal, setShowExitModal] = useState(false);

  const handleBookmark = (item: any) => {
    setSelectedWord(item);
    setShowSaveModal(true);
  };

  const handleNext = () => {
    // Điều hướng sang phần tiếp theo (Ngữ pháp)
    router.push(`/lessons/${lessonId}/grammar/intro`);
  };

  const handleRetry = () => {
    // Cho phép học lại vòng trắc nghiệm
    router.replace(`/lessons/${lessonId}/vocabulary/quiz`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* 1. HEADER */}
      <View style={styles.header}>
        <CloseButton variant="Stroke" onPress={() => setShowExitModal(true)} />
      </View>

      <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* 2. CELEBRATION */}
        <View style={styles.celebrationSection}>
          <Image 
            source={require('../../../../assets/images/tubo/result-levelup.png')} 
            style={styles.illustration} 
            resizeMode="contain" 
          />
          {/* Dùng Color.xanh (BlueFb) theo yêu cầu GlobalStyles.colors.bluePrimary */}
          <Text style={styles.titleText}>Hoàn thành!</Text>
        </View>

        {/* 3. SCORE BANNER */}
        <View style={styles.scoreBanner}>
          <Text style={styles.scoreText}>Đúng 13/15</Text>
          <Text style={styles.scoreText}>87 điểm</Text>
        </View>

        {/* 4. RESULT LIST */}
        <View style={styles.listSection}>
          {RESULTS.map((item) => (
            <View 
              key={item.id} 
              style={[
                styles.card, 
                item.isCorrect ? styles.cardCorrect : styles.cardIncorrect
              ]}
            >
              {/* Header của thẻ chứa Badge */}
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Đáp án</Text>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
              </View>

              {/* Nội dung chính của thẻ */}
              <View style={styles.cardBody}>
                <View style={styles.wordInfo}>
                  <Text style={styles.wordText}>{item.word}</Text>
                  <Text style={styles.phoneticText}>[{item.phonetic}]</Text>
                  <Text style={styles.meaningText}>{item.meaning}</Text>
                </View>
                
                {/* Khu vực Icon (Loa và Lưu) */}
                <View style={styles.actionGroup}>
                  <TouchableOpacity style={styles.iconBtn}>
                    <SpeakerHighIcon size={24} color={Color.text} weight="fill" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn} onPress={() => handleBookmark(item)}>
                    <BookmarkSimpleIcon size={24} color={Color.text} weight="bold" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* 5. ACTION BUTTONS */}
      <View style={styles.footer}>
        <Button 
          title="Tiếp tục học Ngữ pháp" 
          variant="Green" 
          onPress={handleNext} 
        />
        <Button 
          title="Học lại Từ vựng" 
          variant="Outline" 
          onPress={handleRetry} 
          style={{ marginTop: Gap.gap_10 }}
        />
      </View>

      {/* MODAL LƯU TỪ VỰNG */}
      <SaveToFolderModal 
        isVisible={showSaveModal} 
        onClose={() => setShowSaveModal(false)}
        wordData={selectedWord}
      />

      <ConfirmModal 
        isVisible={showExitModal}
        title="Đang học dở mà"
        subtitle="Bạn sắp hoàn thành rồi, cố thêm chút nữa nhé!"
        cancelText="Vẫn rời đi"
        confirmText="Học tiếp"
        onCancel={() => {
          setShowExitModal(false);
          router.push('/(tabs)'); // Ở màn hình Result thì thoát là về thẳng Home
        }}
        onConfirm={() => setShowExitModal(false)}
      />

    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.bg,
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_10,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Padding.padding_20,
    paddingBottom: 40,
  },
  
  celebrationSection: {
    alignItems: 'center',
    marginBottom: Gap.gap_20,
  },
  illustration: {
    width: 160,
    height: 160,
    marginBottom: Gap.gap_10,
  },
  titleText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_24,
    color: Color.xanh, // Blue Primary
  },

  scoreBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Color.greenLight,
    padding: Padding.padding_15,
    borderRadius: Border.br_15,
    marginBottom: Gap.gap_20,
  },
  scoreText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_16,
    color: Color.main2, // Xanh lá đậm
  },
  
  listSection: {
    width: '100%',
  },

  // --- STYLES CHO CARD (ResultVocabCard) ---
  card: {
    backgroundColor: Color.bg,
    borderRadius: Border.br_15,
    borderWidth: 2,
    padding: Padding.padding_15,
    marginBottom: 12, // marginVertical: 8 xấp xỉ
  },
  cardCorrect: {
    borderColor: Color.main, // Xanh lá
  },
  cardIncorrect: {
    borderColor: Color.red, // Đỏ
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Gap.gap_10,
  },
  cardTitle: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_14,
    color: Color.gray,
    marginRight: Gap.gap_10,
  },
  typeBadge: {
    backgroundColor: Color.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_12,
    color: Color.main2, 
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Đẩy icon lên ngang hàng với từ vựng
  },
  wordInfo: {
    flex: 1,
  },
  wordText: {
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_20,
    color: Color.text,
    marginBottom: 4,
  },
  phoneticText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: Color.gray,
    marginBottom: 4,
  },
  meaningText: {
    fontFamily: FontFamily.lexendDecaMedium,
    fontSize: FontSize.fs_16,
    color: Color.text,
  },
  actionGroup: {
    flexDirection: 'row',
    gap: Gap.gap_10,
  },
  iconBtn: {
    padding: 4,
  },

  footer: {
    paddingHorizontal: Padding.padding_20,
    paddingVertical: Padding.padding_20,
    backgroundColor: Color.bg,
    borderTopWidth: 1,
    borderTopColor: Color.stroke,
  }
});