import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { XIcon } from 'phosphor-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';
import { useTheme } from '../../contexts/ThemeContext';
import FlashcardService from '../../api/services/flashcard.service';

// Import Custom Hooks and Components
import { useVocabularySearch, VocabularyItem } from '../../api/hooks/useVocabularySearch';
import { useFavoriteVocabulary } from '../../api/hooks/useFavoriteVocabulary';
import { useWordSelection } from '../../api/hooks/useWordSelection';
import SelectableVocabularyCard from '../../components/Modals/SelectableVocabularyCard';
import ScreenHeader from '../../components/ScreenHeader';

export default function AddWordsToSetScreen() {
    const router = useRouter();
    const { setId } = useLocalSearchParams();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const [isAdding, setIsAdding] = useState(false);

    // Use Custom Hooks
    const { searchText, setSearchText, searchResults, isSearching } = useVocabularySearch();
    const { favoriteWords, isLoadingFavs, fetchFavorites } = useFavoriteVocabulary();
    const { selectedWordsMap, toggleWordSelection, getSelectedArray, hasSelections } = useWordSelection();

    useEffect(() => {
        // Lấy danh sách từ vựng yêu thích làm gợi ý mặc định
        fetchFavorites();
    }, [fetchFavorites]);

    const handleAddWords = async () => {
        const selectedArray = getSelectedArray();
        const targetSetId = Array.isArray(setId) ? setId[0] : setId;
        
        if (targetSetId && selectedArray.length > 0) {
            Keyboard.dismiss();
            setIsAdding(true);
            try {
                const vocabIds = selectedArray.map(word => word.id);
                await FlashcardService.addCardsToSet(targetSetId, { vocabIds });
                // Quay trở lại màn hình chi tiết sau khi thêm thành công
                router.back();
            } catch (error) {
                console.error('Lỗi khi thêm từ vựng vào bộ:', error);
            } finally {
                setIsAdding(false);
            }
        }
    };

    const displayList = searchText.trim() ? searchResults : favoriteWords;

    const renderItem = useCallback(({ item }: { item: VocabularyItem }) => {
        const isSelected = !!selectedWordsMap[item.id];
        return (
            <SelectableVocabularyCard
                item={item}
                isSelected={isSelected}
                onToggle={toggleWordSelection}
            />
        );
    }, [selectedWordsMap, toggleWordSelection]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <KeyboardAvoidingView 
                style={styles.container} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScreenHeader title={t('vocabulary.add_words', 'Thêm từ vựng')} />

                <View style={styles.body}>
                    <View style={styles.searchContainer}>
                        <SearchBar
                            value={searchText}
                            onChangeText={setSearchText}
                            placeholder={t('vocabulary.search_placeholder', 'Tìm kiếm từ vựng')}
                        />
                    </View>

                    {hasSelections && (
                        <View style={styles.selectedWordsContainer}>
                            <Text style={styles.selectedWordsTitle}>
                                {t('vocabulary.selected_words', 'Từ vựng đã chọn')} ({getSelectedArray().length})
                            </Text>
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.selectedWordsList}
                            >
                                {getSelectedArray().map((item) => (
                                    <View key={item.id} style={styles.chip}>
                                        <Text style={styles.chipText}>{item.word}</Text>
                                        <TouchableOpacity 
                                            onPress={() => toggleWordSelection(item)}
                                            style={styles.chipRemoveBtn}
                                        >
                                            <XIcon size={12} color={colors.text} weight="bold" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <Text style={styles.sectionTitle}>
                        {searchText.trim() ? t('vocabulary.search_results', 'Kết quả tìm kiếm') : t('vocabulary.liked_words', 'Những từ bạn đã thích')}
                    </Text>

                    <View style={styles.listWrapper}>
                        {isSearching || isLoadingFavs ? (
                            <ActivityIndicator size="small" color={colors.main} style={{ marginTop: 20 }} />
                        ) : displayList.length > 0 ? (
                            <FlatList
                                data={displayList}
                                keyExtractor={(item) => item.id}
                                renderItem={renderItem}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                                keyboardShouldPersistTaps="handled"
                                initialNumToRender={10}
                                windowSize={5}
                            />
                        ) : (
                            <Text style={styles.emptyText}>{t('vocabulary.no_words_found', 'Không tìm thấy từ vựng')}</Text>
                        )}
                    </View>

                    <Button
                        title={t('vocabulary.add_x_words', { count: getSelectedArray().length, defaultValue: `Thêm ${getSelectedArray().length} từ vựng` })}
                        variant="Green"
                        onPress={handleAddWords}
                        style={styles.confirmButton}
                        disabled={!hasSelections || isAdding}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    container: {
        flex: 1,
    },
    body: {
        flex: 1,
        paddingHorizontal: Padding.padding_20,
        paddingTop: Padding.padding_15,
        paddingBottom: Padding.padding_15,
        gap: 12,
    },
    searchContainer: {
        marginTop: Gap.gap_8,
    },
    sectionTitle: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_14,
        color: colors.gray,
        marginTop: 4,
        marginBottom: 2,
    },
    selectedWordsContainer: {
        marginTop: Gap.gap_8,
    },
    selectedWordsTitle: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_12,
        color: colors.gray,
        marginBottom: 8,
    },
    selectedWordsList: {
        gap: 8,
        paddingBottom: 4,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.historySelectedBg || '#E6F4EA',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.main2 || '#4CAF50',
    },
    chipText: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_12,
        color: colors.text,
        marginRight: 6,
    },
    chipRemoveBtn: {
        padding: 2,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 10,
    },
    listWrapper: {
        flex: 1,
        minHeight: 120,
    },
    scrollContent: {
        paddingBottom: 20,
        gap: 12,
    },
    emptyText: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_14,
        color: colors.gray,
        textAlign: 'center',
        paddingVertical: Padding.padding_20,
    },
    confirmButton: {
        height: 48,
        borderRadius: 37,
        marginVertical: 0,
        marginTop: 8,
    },
});
