import React, { useState, useEffect, useMemo, useCallback, forwardRef } from 'react';
import {
    Pressable,
    View,
    Text,
    StyleSheet,
    Platform,
    Keyboard,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { CheckIcon, PlusIcon } from 'phosphor-react-native';
import { AnimatePresence, MotiView } from 'moti';

import { Border, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import { CustomInput } from '../CustomInput';
import SearchBar from '../SearchBar';
import VocabularyCard from '../VocabularyCard';
import CloseButton from '../CloseButton';
import Button from '../Button';
import FlashcardService from '../../api/services/flashcard.service';
import VocabularyService from '../../api/services/vocabulary.service';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';

export interface VocabularyItem {
    id: string;
    word: string;
    pos: string;
    phonetic: string;
    meaning: string;
}

export interface NewFlashCardSetModalProps {
    onClose: () => void;
    onCreateSet?: (setName: string, selectedWords: VocabularyItem[]) => void;
}

const NewFlashCardSetModal = forwardRef<BottomSheetModal, NewFlashCardSetModalProps>(({
    onClose,
    onCreateSet,
}, ref) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [setName, setSetName] = useState('');
    const [searchText, setSearchText] = useState('');
    
    // Lưu trữ item hoàn chỉnh vào Map thay vì chỉ lưu ID
    const [selectedWordsMap, setSelectedWordsMap] = useState<Record<string, VocabularyItem>>({});
    
    // Data states
    const [favoriteWords, setFavoriteWords] = useState<VocabularyItem[]>([]);
    const [searchResults, setSearchResults] = useState<VocabularyItem[]>([]);
    
    // Loading states
    const [isLoadingFavs, setIsLoadingFavs] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const snapPoints = useMemo(() => ['90%'], []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
            />
        ),
        []
    );

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setSetName('');
            setSearchText('');
            setSelectedWordsMap({});
            setSearchResults([]);
            Keyboard.dismiss();
        } else if (index === 0) {
        const fetchFavorites = async () => {
            setIsLoadingFavs(true);
            try {
                const res = await FlashcardService.getSetById('favorite');
                if (res.success && res.data) {
                    const cards = res.data.cards || [];
                    const mapped: VocabularyItem[] = cards.map((c: any) => ({
                        id: c._id,
                        word: c.word,
                        pos: c.type || c.category || 'Từ vựng',
                        phonetic: c.pronunciationText || '',
                        meaning: c.meaning,
                    }));
                    setFavoriteWords(mapped);
                }
            } catch (error) {
                console.error('Lỗi khi lấy từ vựng đề thích:', error);
            } finally {
                setIsLoadingFavs(false);
            }
        };

        fetchFavorites();
        }
    }, []);

    // Logic tìm kiếm toàn cục với Debounce
    useEffect(() => {
        const keyword = searchText.trim().normalize('NFC'); // Chuẩn hóa Unicode tiếng Hàn
        if (!keyword) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const timeoutId = setTimeout(async () => {
            try {
                const res = await VocabularyService.getAll({ search: keyword, limit: 20 });
                
                if (res.success && res.data) {
                    const vocabularies = res.data.vocabularies || [];
                    const mapped: VocabularyItem[] = vocabularies.map((c: any) => ({
                        id: c._id,
                        word: c.word,
                        pos: c.type || c.category || 'Từ vựng',
                        phonetic: c.pronunciationText || '',
                        meaning: c.meaning,
                    }));
                    setSearchResults(mapped);
                }
            } catch (error) {
                console.error('Lỗi tìm kiếm từ vựng toàn cục:', error);
            } finally {
                setIsSearching(false);
            }
        }, 500); // 500ms Debounce

        return () => clearTimeout(timeoutId);
    }, [searchText]);

    const toggleWordSelection = (item: VocabularyItem) => {
        setSelectedWordsMap(prev => {
            const newMap = { ...prev };
            if (newMap[item.id]) {
                delete newMap[item.id];
            } else {
                newMap[item.id] = item;
            }
            return newMap;
        });
    };

    const handleClose = () => {
        Keyboard.dismiss();
        onClose();
    };

    const handleCreateSet = () => {
        const selectedArray = Object.values(selectedWordsMap);
        if (setName.trim() && selectedArray.length > 0) {
            Keyboard.dismiss();
            onCreateSet?.(setName.trim(), selectedArray);
            handleClose();
        }
    };

    const displayList = searchText.trim() ? searchResults : favoriteWords;
    const hasSelections = Object.keys(selectedWordsMap).length > 0;

    return (
        <BottomSheetModal
            ref={ref}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            backgroundStyle={{ backgroundColor: colors.bg, borderTopLeftRadius: Border.br_30, borderTopRightRadius: Border.br_30 }}
            handleIndicatorStyle={{ backgroundColor: colors.dragHandleBg || '#CBD5E1' }}
        >
            <BottomSheetView style={styles.sheetContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Bộ từ vựng mới</Text>
                        <CloseButton variant="Stroke" onPress={handleClose} />
                    </View>

                    <View style={styles.body}>
                        <CustomInput
                        placeholder={t('vocabulary.set_name_placeholder', 'Tên bộ từ vựng')}
                            value={setName}
                            onChangeText={setSetName}
                        />
                        <View style={{ marginTop: Gap.gap_8 }}>
                            <SearchBar
                                value={searchText}
                                onChangeText={setSearchText}
                            placeholder={t('vocabulary.search_placeholder', 'Tìm kiếm từ vựng')}
                            />
                        </View>

                        <Text style={styles.sectionTitle}>
                        {searchText.trim() ? t('vocabulary.search_results', 'Kết quả tìm kiếm') : t('vocabulary.liked_words', 'Những từ bạn đã thích')}
                        </Text>

                        <View style={styles.listWrapper}>
                            {isSearching || isLoadingFavs ? (
                            <ActivityIndicator size="small" color={colors.main} style={{ marginTop: 20 }} />
                            ) : displayList.length > 0 ? (
                                <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                                    {displayList.map((item) => {
                                        const isSelected = !!selectedWordsMap[item.id];
                                        return (
                                            <VocabularyCard
                                                key={item.id}
                                                item={item as any}
                                                isSelected={isSelected}
                                                onPress={() => toggleWordSelection(item)}
                                                rightAction={
                                                    <MotiView
                                                        style={styles.addButton}
                                                        animate={{
                                                        backgroundColor: isSelected ? colors.historySelectedBg : colors.bg,
                                                        borderColor: isSelected ? colors.main2 : colors.stroke,
                                                        }}
                                                        transition={{ type: 'timing', duration: 200 }}
                                                    >
                                                        <AnimatePresence exitBeforeEnter>
                                                            {isSelected ? (
                                                                <MotiView key="check" from={{ opacity: 0, scale: 0.5, rotate: '-90deg' }} animate={{ opacity: 1, scale: 1, rotate: '0deg' }} exit={{ opacity: 0, scale: 0.5, rotate: '90deg' }} transition={{ type: 'timing', duration: 150 }}>
                                                                <CheckIcon size={16} color={colors.main2} weight="bold" />
                                                                </MotiView>
                                                            ) : (
                                                                <MotiView key="plus" from={{ opacity: 0, scale: 0.5, rotate: '90deg' }} animate={{ opacity: 1, scale: 1, rotate: '0deg' }} exit={{ opacity: 0, scale: 0.5, rotate: '-90deg' }} transition={{ type: 'timing', duration: 150 }}>
                                                                <PlusIcon size={16} color={colors.text} weight="bold" />
                                                                </MotiView>
                                                            )}
                                                        </AnimatePresence>
                                                    </MotiView>
                                                }
                                            />
                                        );
                                    })}
                                </BottomSheetScrollView>
                            ) : (
                            <Text style={styles.emptyText}>{t('vocabulary.no_words_found', 'Không tìm thấy từ vựng')}</Text>
                            )}
                        </View>

                        <Button
                        title={t('vocabulary.create_set', 'Tạo bộ từ vựng')}
                            variant="Green"
                            onPress={handleCreateSet}
                            style={styles.confirmButton}
                            disabled={!setName.trim() || !hasSelections}
                        />
                    </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

export default NewFlashCardSetModal;

const createStyles = (colors: any) => StyleSheet.create({
    sheetContent: {
        flex: 1,
        paddingHorizontal: Padding.padding_20,
        paddingTop: Padding.padding_15,
        paddingBottom: 40,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
    headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.text },
    body: {
        flexShrink: 1, // Cho phép body co lại khi danh sách dài
        gap: 12,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_14,
        color: colors.gray,
        marginTop: 4,
        marginBottom: 2,
    },
    listWrapper: {
        flexShrink: 1, // Bắt buộc để ScrollView bên trong có thể cuộn được
        minHeight: 120, // Hiển thị ít nhất một khoảng trống
    },
    scrollContent: {
        paddingBottom: 20,
        gap: 12,
    },
    addButton: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: colors.stroke,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bg,
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
