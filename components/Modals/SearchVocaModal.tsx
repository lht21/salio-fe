import { XIcon } from 'phosphor-react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import Button from '../Button';
import SearchBar from '../SearchBar';
import VocabularyCard from '../VocabularyCard';
import VocabularySheetModal from './VocabularySheetModal';

type SearchVocaModalProps = {
    isVisible: boolean;
    onClose: () => void;
};

const RECENT_KEYWORDS = ['식당', '학교'];

type SearchVocaItem = {
    id: string;
    word: string;
    pos: string;
    phonetic: string;
    meaning: string;
    isFavorite?: boolean;
};

const SEARCH_SOURCE: SearchVocaItem[] = [
    {
        id: 'kr-1',
        word: '한국',
        pos: 'Danh từ',
        phonetic: '/han kung/',
        meaning: 'Hàn Quốc',
        isFavorite: false,
    },
    {
        id: 'kr-2',
        word: '학교',
        pos: 'Danh từ',
        phonetic: '/hak kyo/',
        meaning: 'Trường học',
        isFavorite: false,
    },
    {
        id: 'kr-3',
        word: '식당',
        pos: 'Danh từ',
        phonetic: '/sik dang/',
        meaning: 'Nhà hàng',
        isFavorite: false,
    },
];

export default function SearchVocaModal({ isVisible, onClose }: SearchVocaModalProps) {
    const [searchText, setSearchText] = useState('');
    const [keywords, setKeywords] = useState<string[]>(RECENT_KEYWORDS);
    const [searchResults, setSearchResults] = useState<SearchVocaItem[]>(SEARCH_SOURCE);

    const visibleKeywords = useMemo(
        () => keywords.filter((keyword) => keyword.toLowerCase().includes(searchText.toLowerCase())),
        [keywords, searchText]
    );

    const filteredResults = useMemo(() => {
        const keyword = searchText.trim().toLowerCase();

        if (!keyword) {
            return [];
        }

        return searchResults.filter((item) => {
            return (
                item.word.toLowerCase().includes(keyword)
                || item.meaning.toLowerCase().includes(keyword)
                || item.phonetic.toLowerCase().includes(keyword)
            );
        });
    }, [searchText, searchResults]);

    const removeKeyword = (keyword: string) => {
        setKeywords((prev) => prev.filter((item) => item !== keyword));
    };

    const handleToggleFavorite = (id: string) => {
        setSearchResults((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, isFavorite: !item.isFavorite }
                    : item
            )
        );
    };

    return (
        <VocabularySheetModal
            visible={isVisible}
            title=""
            onClose={onClose}
            maxHeight="90%"
            edgeToBottom
            showCloseButton={false}
            keyboardAware
            contentScrollable={false}
        >
            <View style={styles.content}>
                <View>
                    <View style={styles.searchWrap}>
                        <SearchBar
                            value={searchText}
                            onChangeText={setSearchText}
                            placeholder="Tìm kiếm từ vựng"
                        />
                    </View>

                    {searchText.trim().length > 0 ? (
                        <View style={styles.resultWrap}>
                            {filteredResults.length > 0 ? (
                                filteredResults.map((item) => (
                                    <VocabularyCard
                                        key={item.id}
                                        item={item}
                                        onToggleFavorite={() => handleToggleFavorite(item.id)}
                                    />
                                ))
                            ) : (
                                <Text style={styles.emptyText}>Không tìm thấy từ vựng</Text>
                            )}
                        </View>
                    ) : (
                        <View style={styles.keywordWrap}>
                            {visibleKeywords.map((keyword) => (
                                <View key={keyword} style={styles.keywordChip}>
                                    <Text style={styles.keywordText}>{keyword}</Text>
                                    <TouchableOpacity
                                        onPress={() => removeKeyword(keyword)}
                                        style={styles.removeButton}
                                        hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
                                    >
                                        <XIcon size={12} color={Color.gray} weight="bold" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <Button
                    title="Đóng"
                    variant="Green"
                    onPress={onClose}
                    style={styles.closeButton}
                    textStyle={styles.closeButtonText}
                />
            </View>
        </VocabularySheetModal>
    );
}

const styles = StyleSheet.create({
    content: {
        height: '100%',
        paddingHorizontal: Padding.padding_2,
        justifyContent: 'space-between',
    },
    searchWrap: {
        paddingHorizontal: Padding.padding_10,
    },
    keywordWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Gap.gap_8,
        marginTop: Gap.gap_8,
    },
    resultWrap: {
        marginTop: Gap.gap_20,
        paddingHorizontal: Padding.padding_10,
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
    },
    emptyText: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_14,
        color: Color.colorDarkgray,
        textAlign: 'center',
    },
    closeButton: {
        width: 160,
        alignSelf: 'center',
        marginBottom: Gap.gap_8,
    },
    closeButtonText: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_16,
        color: Color.color,
    },
});
