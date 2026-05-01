import React, { useState, useEffect } from 'react';
import {
    Modal,
    KeyboardAvoidingView,
    Pressable,
    View,
    Text,
    StyleSheet,
    Platform,
    Keyboard,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { CheckIcon, PlusIcon } from 'phosphor-react-native';
import { AnimatePresence, MotiView } from 'moti';

import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import { CustomInput } from '../CustomInput';
import SearchBar from '../SearchBar';
import VocabularyCard from '../VocabularyCard';
import CloseButton from '../CloseButton';
import Button from '../Button';
import FlashcardService from '../../api/services/flashcard.service';
import VocabularyService from '../../api/services/vocabulary.service';

export interface VocabularyItem {
    id: string;
    word: string;
    pos: string;
    phonetic: string;
    meaning: string;
}

export interface NewFlashCardSetModalProps {
    isVisible: boolean;
    onClose: () => void;
    onCreateSet?: (setName: string, selectedWords: VocabularyItem[]) => void;
}

export default function NewFlashCardSetModal({
    isVisible,
    onClose,
    onCreateSet,
}: NewFlashCardSetModalProps) {
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

    // Reset state & Load Favorites khi Modal mở/đóng
    useEffect(() => {
        if (!isVisible) {
            setSetName('');
            setSearchText('');
            setSelectedWordsMap({});
            setSearchResults([]);
            return;
        }

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
    }, [isVisible]);

    // Logic tìm kiếm toàn cục với Debounce
    useEffect(() => {
        if (!isVisible) return;

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
    }, [searchText, isVisible]);

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

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Bộ từ vựng mới</Text>
                        <CloseButton variant="Stroke" onPress={handleClose} />
                    </View>

                    <View style={styles.body}>
                        <CustomInput
                            placeholder="Tên bộ từ vựng"
                            value={setName}
                            onChangeText={setSetName}
                        />
                        <View style={{ marginTop: Gap.gap_8 }}>
                            <SearchBar
                                value={searchText}
                                onChangeText={setSearchText}
                                placeholder="Tìm kiếm từ vựng"
                            />
                        </View>

                        <Text style={styles.sectionTitle}>
                            {searchText.trim() ? 'Kết quả tìm kiếm' : 'Những từ bạn đã thích'}
                        </Text>

                        <View style={styles.listWrapper}>
                            {isSearching || isLoadingFavs ? (
                                <ActivityIndicator size="small" color={Color.main} style={{ marginTop: 20 }} />
                            ) : displayList.length > 0 ? (
                                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
                                                            backgroundColor: isSelected ? '#F0FDF4' : Color.bg,
                                                            borderColor: isSelected ? '#22C55E' : Color.stroke,
                                                        }}
                                                        transition={{ type: 'timing', duration: 200 }}
                                                    >
                                                        <AnimatePresence exitBeforeEnter>
                                                            {isSelected ? (
                                                                <MotiView key="check" from={{ opacity: 0, scale: 0.5, rotate: '-90deg' }} animate={{ opacity: 1, scale: 1, rotate: '0deg' }} exit={{ opacity: 0, scale: 0.5, rotate: '90deg' }} transition={{ type: 'timing', duration: 150 }}>
                                                                    <CheckIcon size={16} color="#22C55E" weight="bold" />
                                                                </MotiView>
                                                            ) : (
                                                                <MotiView key="plus" from={{ opacity: 0, scale: 0.5, rotate: '90deg' }} animate={{ opacity: 1, scale: 1, rotate: '0deg' }} exit={{ opacity: 0, scale: 0.5, rotate: '-90deg' }} transition={{ type: 'timing', duration: 150 }}>
                                                                    <PlusIcon size={16} color={Color.text} weight="bold" />
                                                                </MotiView>
                                                            )}
                                                        </AnimatePresence>
                                                    </MotiView>
                                                }
                                            />
                                        );
                                    })}
                                </ScrollView>
                            ) : (
                                <Text style={styles.emptyText}>Không tìm thấy từ vựng</Text>
                            )}
                        </View>

                        <Button
                            title="Tạo bộ từ vựng"
                            variant="Green"
                            onPress={handleCreateSet}
                            style={styles.confirmButton}
                            disabled={!setName.trim() || !hasSelections}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' },
    backgroundTouchable: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
    sheetContent: {
        backgroundColor: Color.bg,
        borderTopLeftRadius: Border.br_30,
        borderTopRightRadius: Border.br_30,
        paddingHorizontal: Padding.padding_20,
        paddingTop: Padding.padding_15,
        paddingBottom: 40,
        maxHeight: '90%', // Giới hạn chiều cao để không bị tràn khi bàn phím mở
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#CBD5E1',
        alignSelf: 'center',
        marginBottom: Gap.gap_15,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Gap.gap_20 },
    headerTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: Color.text },
    body: {
        flexShrink: 1, // Cho phép body co lại khi danh sách dài
        gap: 12,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_14,
        color: Color.gray,
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
        borderColor: Color.stroke,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.bg,
    },
    emptyText: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_14,
        color: Color.gray,
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
