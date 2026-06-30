import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import Animated from 'react-native-reanimated';

import { FontFamily, FontSize, Padding, Gap } from '../../constants/GlobalStyles';
import SearchVocaModal from '../../components/Modals/SearchVocaModal';
import ScreenHeader from '../../components/ScreenHeader';
import { useTheme } from "@/contexts/ThemeContext";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function ArticleDetailScreen() {
    const { colors } = useTheme();
    const styles = getStyles(colors);

  const { articleId, imageUrl } = useLocalSearchParams();
  const router = useRouter();
  const searchVocaSheetRef = useRef<BottomSheetModal>(null);
  
  // State lưu trữ từ khóa đã được bóc tách để gửi vào Modal
  const [selectedWord, setSelectedWord] = useState('');

  // MOCK NỘI DUNG
  const articleContent = "한국의 전통 문화는 매우 흥미롭습니다. 특히 한복은 아름답고 우아합니다.";

  // Hàm Text Parser cơ bản: Cắt câu thành các từ để có thể ấn vào
  const renderParsedTest = (text: string) => {
    const words = text.split(' ');
    return (
      <View style={styles.paragraphContainer}>
        {words.map((word, index) => (
          <TouchableOpacity 
            key={index} 
            activeOpacity={0.6}
            onPress={() => {
              // Dùng regex loại bỏ các dấu câu thông dụng ở đầu/cuối để lấy từ sạch (clean word)
              const cleanWord = word.replace(/[.,?!“”‘’(){}[\]]/g, '');
              setSelectedWord(cleanWord);
              searchVocaSheetRef.current?.present();
            }}
            style={styles.wordTouchable}
          >
            <Text style={styles.wordText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <ScreenHeader title={`Chi tiết bài viết #${articleId}`} style={styles.header} />

      <ScrollView contentContainerStyle={styles.content}>
        {imageUrl && (
          <AnimatedImage
            sharedTransitionTag={`article-image-${articleId}`}
            source={{ uri: imageUrl as string }}
            style={styles.heroImage}
            contentFit="cover"
          />
        )}
        <Text style={styles.title}>Tại sao người Hàn Quốc lại ăn canh rong biển vào sinh nhật?</Text>
        
        {/* Nơi hiển thị nội dung đọc báo có thể chạm để dịch */}
        {renderParsedTest(articleContent)}
      </ScrollView>

      {/* Modal Tra từ vựng */}
      <SearchVocaModal 
        ref={searchVocaSheetRef}
        initialSearchText={selectedWord}
        onClose={() => searchVocaSheetRef.current?.dismiss()}
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
      container: { flex: 1, backgroundColor: colors.bg },
      header: { 
        borderBottomWidth: 1,
        borderBottomColor: colors.stroke
      },
      content: { padding: Padding.padding_20 },
      heroImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 20 },
      title: { fontFamily: FontFamily.lexendDecaBold, fontSize: FontSize.fs_20, color: colors.text, marginBottom: 20 },
      
      // Styles cho Text Parser
      paragraphContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
      },
      wordTouchable: { marginRight: 4, marginBottom: 6, paddingVertical: 2 },
      wordText: { fontFamily: FontFamily.lexendDecaRegular, fontSize: FontSize.fs_16, color: '#334155', lineHeight: 28 },
    });