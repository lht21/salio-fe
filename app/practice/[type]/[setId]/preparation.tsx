import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { FontFamily, FontSize, Padding, Gap, Border } from '@/constants/GlobalStyles';
import ScreenHeader from '@/components/ScreenHeader';
import CategoryChip from '@/components/CategoryChip';
import PracticeService from '@/api/services/practice.service';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import ReviewModeCard from '@/components/ReviewModeCard';
import VocabularyCard from '@/components/VocabularyCard';
import { CaretLeftIcon, CardsIcon } from 'phosphor-react-native';

export default function ExamPreparationScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  const { type, setId, title } = useLocalSearchParams();
  
  const resolvedType = Array.isArray(type) ? type[0] : type;
  const resolvedSetId = Array.isArray(setId) ? setId[0] : setId;
  const resolvedTitle = Array.isArray(title) ? title[0] : (title as string) || 'Ôn tập từ vựng';

  const [activeTab, setActiveTab] = useState<'vocab' | 'grammar'>('vocab');
  const [materials, setMaterials] = useState<{ vocabularies: any[]; grammars: any[] }>({ vocabularies: [], grammars: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartExam = async () => {
    try {
      setIsStarting(true);
      const res = await PracticeService.startAttempt(resolvedType as any, resolvedSetId as string);
      if (res.success && res.data?.attemptId) {
        const attemptId = res.data.attemptId;
        
        if (resolvedType === 'listening' || resolvedType === 'full') {
          router.replace({
            pathname: `/practice/${resolvedType}/${resolvedSetId}/audio-check`,
            params: { attemptId }
          } as any);
        } else {
          router.replace({
            pathname: `/practice/${resolvedType}/${resolvedSetId}/${attemptId}/exam`,
          } as any);
        }
      } else {
        Alert.alert('Lỗi', res.message || 'Không thể bắt đầu bài làm.');
      }
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Có lỗi xảy ra khi bắt đầu làm bài.');
    } finally {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true);
        const res = await PracticeService.getPreparationMaterials(resolvedType as any, resolvedSetId as string);
        if (res.success && res.data) {
          setMaterials({
            vocabularies: res.data.vocabularies || [],
            grammars: res.data.grammars || [],
          });
        } else {
          Alert.alert('Lỗi', res.message || 'Không thể tải tài liệu ôn tập.');
        }
      } catch (err: any) {
        Alert.alert('Lỗi', err.message || 'Lỗi kết nối khi lấy tài liệu.');
      } finally {
        setIsLoading(false);
      }
    };
    if (resolvedType && resolvedSetId) fetchMaterials();
  }, [resolvedType, resolvedSetId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('@/assets/images/bg2.jpg')} 
        style={styles.headerBackground}
        imageStyle={styles.headerBackgroundImage}
      >
        <View style={styles.overlay} />
        <View style={styles.header}>
          <IconButton Icon={CaretLeftIcon} onPress={() => router.back()} />
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.examTitle}>{resolvedTitle}</Text>
          <Button 
            title={isStarting ? "Đang tải..." : "Thi ngay"} 
            variant="Outline" 
            onPress={handleStartExam} 
          />
        </View>
      </ImageBackground>
      
      <View style={styles.tabContainer}>
        <CategoryChip 
          label="Từ vựng" 
          isActive={activeTab === 'vocab'} 
          onPress={() => setActiveTab('vocab')} 
        />
        <CategoryChip 
          label="Ngữ pháp" 
          isActive={activeTab === 'grammar'} 
          onPress={() => setActiveTab('grammar')} 
        />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.main} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'vocab' && (
            <View style={styles.vocabTabContent}>
              <ReviewModeCard 
                icon={<CardsIcon size={32} color="#7A3900" weight="fill" />}
                label="ÔN TẬP"
                onPress={() => router.push(`/practice/${resolvedType}/${resolvedSetId}/review-vocab` as any)} 
              />
              <View style={styles.vocabListContainer}>
                {materials.vocabularies.length === 0 ? (
                  <Text style={styles.emptyText}>Chưa có từ vựng nào được thêm vào đề thi này.</Text>
                ) : (
                  materials.vocabularies.map((vocab, index) => (
                    <VocabularyCard 
                      key={vocab._id || index}
                      item={{
                        id: vocab._id || String(index),
                        word: vocab.word || 'Từ vựng',
                        meaning: vocab.meaning || '',
                        pos: vocab.pos || vocab.type || '',
                        phonetic: vocab.pronunciation || ''
                      }}
                    />
                  ))
                )}
              </View>
            </View>
          )}

          {activeTab === 'grammar' && (
            <View>
              {materials.grammars.length === 0 ? (
                <Text style={styles.emptyText}>Chưa có ngữ pháp nào được thêm vào đề thi này.</Text>
              ) : (
                materials.grammars.map((grammar, index) => (
                  <View key={grammar._id || index} style={styles.itemCard}>
                    <Text style={styles.itemTitle}>{grammar.structure || 'Ngữ pháp'}</Text>
                    {grammar.description || grammar.meaning ? (
                        <Text style={styles.itemDesc}>{grammar.meaning}</Text>
                    ) : null}
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerBackground: {
    borderBottomLeftRadius: Border.br_20,
    borderBottomRightRadius: Border.br_20,
    overflow: 'hidden',
    paddingBottom: Gap.gap_20,
    marginBottom: Gap.gap_20,
    minHeight: 220,
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  headerBackgroundImage: {
    opacity: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Padding.padding_20,
    paddingTop: Padding.padding_10,
    paddingBottom: Padding.padding_10,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Padding.padding_20,
    marginBottom: Gap.gap_15,
  },
  examTitle: {
    flex: 1,
    fontFamily: FontFamily.lexendDecaBold,
    fontSize: FontSize.fs_20,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginRight: Gap.gap_10,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: Gap.gap_10,
    paddingHorizontal: Padding.padding_20,
    paddingBottom: Padding.padding_15,
  },
  scrollContent: {
    paddingHorizontal: Padding.padding_20,
    paddingBottom: Padding.padding_15,
  },
  vocabTabContent: {
    gap: Gap.gap_20,
  },
  vocabListContainer: {
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: colors.text,
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
  itemCard: {
    backgroundColor: colors.brown40,
    padding: Padding.padding_15,
    borderRadius: Border.br_10,
    marginBottom: Gap.gap_10,
    borderWidth: 1,
    borderColor: colors.stroke || '#e0e0e0',
  },
  itemTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: colors.text,
    marginBottom: Gap.gap_5,
  },
  itemDesc: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_14,
    color: colors.text,
    marginBottom: Gap.gap_5,
  },
  itemMeta: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12,
    color: colors.cam || '#f59e0b',
  }
});
