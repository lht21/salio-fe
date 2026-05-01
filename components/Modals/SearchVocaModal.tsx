import { XIcon, CheckIcon, PlusIcon } from 'phosphor-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';

import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import SearchBar from '../SearchBar';
import VocabularyCard from '../VocabularyCard';
import CloseButton from '../CloseButton';
import VocabularyService from '../../api/services/vocabulary.service';
import FlashcardService from '../../api/services/flashcard.service';

type SearchVocaModalProps = {
    isVisible: boolean;
    onClose: () => void;
    setId?: string; // Hỗ trợ truyền ID bộ từ vựng cụ thể (Mặc định: 'favorite')
};

export type SearchVocaItem = {
    id: string;
    word: string;
    pos: string;
    phonetic: string;
    meaning: string;
    isFavorite?: boolean;
};

const RECENT_KEYWORDS = ['호텔', '선생님', '학교'];

export default function SearchVocaModal({ isVisible, onClose, setId }: SearchVocaModalProps) {
    const targetSetId = setId || 'favorite';
    const isFavoriteMode = targetSetId === 'favorite';

    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [keywords, setKeywords] = useState<string[]>(RECENT_KEYWORDS);
    
    // State kết quả & loading API
    const [searchResults, setSearchResults] = useState<SearchVocaItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    
    // State lưu danh sách ID từ vựng yêu thích (để hiển thị đúng trạng thái tim)
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

    // Reset data & fetch favorite list khi mở Modal
    useEffect(() => {
        if (!isVisible) {
            setSearchText('');
            setSearchResults([]);
            return;
        }

        const fetchFavorites = async () => {
            try {
                const res = await FlashcardService.getSetById(targetSetId);
                if (res.success && res.data) {
                    const ids = res.data.cards.map((c: any) => c._id || c);
                    setFavoriteIds(new Set(ids));
                }
            } catch (error) {
                console.error('Lỗi khi tải danh sách từ vựng của bộ:', error);
            }
        };
        fetchFavorites();
    }, [isVisible, targetSetId]);

    // Debounce Tìm kiếm qua API
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
                    const mapped: SearchVocaItem[] = res.data.vocabularies.map((c: any) => ({
                        id: c._id,
                        word: c.word,
                        pos: c.type || c.category || 'Từ vựng',
                        phonetic: c.pronunciationText || '',
                        meaning: c.meaning,
                        isFavorite: favoriteIds.has(c._id), // Gán trạng thái yêu thích
                    }));
                    setSearchResults(mapped);
                }
            } catch (error) {
                console.error('Lỗi tìm kiếm từ vựng:', error);
            } finally {
                setIsSearching(false);
            }
        }, 500); // Debounce 500ms

        return () => clearTimeout(timeoutId);
    }, [searchText, isVisible, favoriteIds]);

    const visibleKeywords = useMemo(
        () => keywords.filter((keyword) => keyword.toLowerCase().includes(searchText.toLowerCase())),
        [keywords, searchText]
    );

    const removeKeyword = (keyword: string) => {
        setKeywords((prev) => prev.filter((item) => item !== keyword));
    };

    const handleToggleFavorite = async (id: string) => {
        const isCurrentlyFavorite = favoriteIds.has(id);

        // 1. Optimistic Update: Cập nhật UI ngay lập tức
        setFavoriteIds(prev => {
            const newSet = new Set(prev);
            isCurrentlyFavorite ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });

        setSearchResults((prev) =>
            prev.map((item) => item.id === id ? { ...item, isFavorite: !isCurrentlyFavorite } : item)
        );

        try {
            // 2. Gọi API thực tế
            if (isCurrentlyFavorite) {
                await FlashcardService.removeCardFromSet(targetSetId, id);
            } else {
                await FlashcardService.addCardsToSet(targetSetId, { vocabIds: [id] });
            }
        } catch (error) {
            // 3. Rollback nếu API lỗi
            setFavoriteIds(prev => {
                const newSet = new Set(prev);
                isCurrentlyFavorite ? newSet.add(id) : newSet.delete(id);
                return newSet;
            });
            setSearchResults((prev) =>
                prev.map((item) => item.id === id ? { ...item, isFavorite: isCurrentlyFavorite } : item)
            );
            console.error('Lỗi khi cập nhật từ vựng vào bộ:', error);
        }
    };

    const handleClose = () => {
        Keyboard.dismiss();
        onClose();
    };

    const navigateToDetail = (wordId: string) => {
        handleClose();
        router.push({ pathname: '/vocabulary/vocabulary-detail', params: { wordId } });
    };

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
                        <Text style={styles.headerTitle}>Tìm kiếm từ vựng</Text>
                        <CloseButton variant="Stroke" onPress={handleClose} />
                    </View>

                    <View style={styles.body}>
                        <View style={styles.searchWrap}>
                            <SearchBar
                                value={searchText}
                                onChangeText={setSearchText}
                                placeholder="Nhập từ khóa..."
                            />
                        </View>

                        <Text style={styles.sectionTitle}>
                            {searchText.trim() ? 'Kết quả tìm kiếm' : 'Tìm kiếm gần đây'}
                        </Text>

                        <View style={styles.listWrapper}>
                            {isSearching ? (
                                <ActivityIndicator size="small" color={Color.main} style={{ marginTop: 20 }} />
                            ) : searchText.trim().length > 0 ? (
                                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                                    {searchResults.length > 0 ? (
                                        searchResults.map((item) => (
                                            <VocabularyCard
                                                key={item.id}
                                                item={item as any}
                                                onToggleFavorite={isFavoriteMode ? () => handleToggleFavorite(item.id) : undefined}
                                                rightAction={!isFavoriteMode ? (
                                                    <TouchableOpacity onPress={() => handleToggleFavorite(item.id)}>
                                                        <MotiView
                                                            style={styles.addButton}
                                                            animate={{
                                                                backgroundColor: item.isFavorite ? '#F0FDF4' : Color.bg,
                                                                borderColor: item.isFavorite ? '#22C55E' : Color.stroke,
                                                            }}
                                                            transition={{ type: 'timing', duration: 200 }}
                                                        >
                                                            <AnimatePresence exitBeforeEnter>
                                                                {item.isFavorite ? (
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
                                                    </TouchableOpacity>
                                                ) : undefined}
                                                onPress={() => navigateToDetail(item.id)}
                                            />
                                        ))
                                    ) : (
                                        <Text style={styles.emptyText}>Không tìm thấy từ vựng</Text>
                                    )}
                                </ScrollView>
                            ) : (
                                <View style={styles.keywordWrap}>
                                    {visibleKeywords.map((keyword) => (
                                        <TouchableOpacity 
                                            key={keyword} 
                                            style={styles.keywordChip}
                                            activeOpacity={0.7}
                                            onPress={() => setSearchText(keyword)}
                                        >
                                            <Text style={styles.keywordText}>{keyword}</Text>
                                            <TouchableOpacity
                                                onPress={() => removeKeyword(keyword)}
                                                style={styles.removeButton}
                                                hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
                                            >
                                                <XIcon size={12} color={Color.gray} weight="bold" />
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
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
        maxHeight: '90%', // Giới hạn chiều cao
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
        flexShrink: 1,
        gap: 12,
        paddingBottom: 8,
    },
    searchWrap: {
        marginBottom: Gap.gap_8,
    },
    sectionTitle: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_14,
        color: Color.gray,
        marginTop: 4,
        marginBottom: 2,
    },
    listWrapper: {
        flexShrink: 1,
        minHeight: 120,
    },
    scrollContent: {
        paddingBottom: 20,
        gap: 12,
    },
    keywordWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Gap.gap_8,
    },
    keywordChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Gap.gap_5,
        paddingHorizontal: Padding.padding_8,
        paddingVertical: Padding.padding_3,
        backgroundColor: '#D5DCE6',
        borderRadius: Border.br_5,
    },
    keywordText: {
        fontSize: FontSize.fs_14,
        color: Color.gray,
    },
    removeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    emptyText: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_14,
        color: Color.gray,
        textAlign: 'center',
        paddingVertical: Padding.padding_20,
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
});
