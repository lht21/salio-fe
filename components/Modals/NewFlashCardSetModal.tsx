import { PlusIcon } from 'phosphor-react-native';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import { CustomInput } from '../CustomInput';
import SearchBar from '../SearchBar';
import VocabularySheetModal from './VocabularySheetModal';

interface VocabularyItem {
    id: string;
    word: string;
    pos: string; // Danh từ, Động từ, Tính từ...
    phonetic: string;
    meaning: string;
}

interface NewFlashCardSetModalProps {
    isVisible: boolean;
    onClose: () => void;
    onCreateSet?: (setName: string, selectedWords: VocabularyItem[]) => void;
}

// Mock data - thay thế bằng dữ liệu thực từ API
const VOCABULARY_SUGGESTIONS: VocabularyItem[] = [
    {
        id: '1',
        word: 'Đáp án',
        pos: 'Danh từ',
        phonetic: '/ˈdɑːp æn/',
        meaning: 'Câu trả lời cho một câu hỏi',
    },
    {
        id: '2',
        word: 'Đáp án',
        pos: 'Danh từ',
        phonetic: '/ˈdɑːp æn/',
        meaning: 'Câu trả lời cho một câu hỏi',
    },
    {
        id: '3',
        word: 'Đáp án',
        pos: 'Danh từ',
        phonetic: '/ˈdɑːp æn/',
        meaning: 'Câu trả lời cho một câu hỏi',
    },
    {
        id: '4',
        word: 'Đáp án',
        pos: 'Danh từ',
        phonetic: '/ˈdɑːp æn/',
        meaning: 'Câu trả lời cho một câu hỏi',
    },
    {
        id: '5',
        word: 'Đáp án',
        pos: 'Danh từ',
        phonetic: '/ˈdɑːp æn/',
        meaning: 'Câu trả lời cho một câu hỏi',
    },
];

export default function NewFlashCardSetModal({
    isVisible,
    onClose,
    onCreateSet,
}: NewFlashCardSetModalProps) {
    const [setName, setSetName] = useState('');
    const [searchText, setSearchText] = useState('');
    const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());

    // Filter vocabulary based on search
    const filteredVocabulary = VOCABULARY_SUGGESTIONS.filter((item) =>
        item.word.toLowerCase().includes(searchText.toLowerCase())
    );

    const toggleWordSelection = (id: string) => {
        const newSelected = new Set(selectedWords);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedWords(newSelected);
    };

    const handleCreateSet = () => {
        if (setName.trim() && selectedWords.size > 0) {
            const selected = VOCABULARY_SUGGESTIONS.filter((item) =>
                selectedWords.has(item.id)
            );
            onCreateSet?.(setName, selected);
            // Reset form
            setSetName('');
            setSearchText('');
            setSelectedWords(new Set());
            onClose();
        }
    };

    const getBadgeColor = (pos: string) => {
        if (pos === 'Danh từ') return { bg: '#DCFCE7', text: '#15803D' };
        if (pos === 'Động từ') return { bg: '#F3E8FF', text: '#7E22CE' };
        return { bg: '#FFEDD5', text: '#C2410C' };
    };

    return (
        <VocabularySheetModal
            visible={isVisible}
            title="Bộ từ vựng mới"
            onClose={onClose}
            maxHeight="90%"
            edgeToBottom={true}
            showCloseButton={true}
            keyboardAware={true}
            headerHorizontalInset={20}
            contentScrollable={true}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                scrollEnabled={true}
            >
                {/* Name Input */}
                <View style={styles.section}>
                    <CustomInput
                        placeholder="Tên bộ từ vựng"
                        value={setName}
                        onChangeText={setSetName}
                        placeholderTextColor={Color.gray}
                    />
                </View>

                {/* Search Input */}
                <View style={styles.section}>
                    <SearchBar
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholder="Tìm kiếm từ vựng"
                    />
                </View>

                {/* Section Title */}
                <Text style={styles.sectionTitle}>Những từ đề thích</Text>

                {/* Vocabulary List */}
                <View style={styles.section}>
                    {filteredVocabulary.length > 0 ? (
                        filteredVocabulary.map((item) => {
                            const badge = getBadgeColor(item.pos);
                            const isSelected = selectedWords.has(item.id);

                            return (
                                <View key={item.id} style={styles.vocabularyItem}>
                                    <View style={styles.vocabularyContent}>
                                        <View style={styles.vocabularyHeader}>
                                            <Text style={styles.word}>{item.word}</Text>
                                            <View
                                                style={[
                                                    styles.badge,
                                                    { backgroundColor: badge.bg },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.badgeText,
                                                        { color: badge.text },
                                                    ]}
                                                >
                                                    {item.pos}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.phonetic}>{item.phonetic}</Text>
                                        <Text style={styles.meaning}>{item.meaning}</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={[
                                            styles.addButton,
                                            isSelected && styles.addButtonSelected,
                                        ]}
                                        onPress={() => toggleWordSelection(item.id)}
                                    >
                                        <PlusIcon
                                            size={16}
                                            color={isSelected ? Color.colorLimegreen : Color.text}
                                            weight="bold"
                                        />
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    ) : (
                        <Text style={styles.emptyText}>Không tìm thấy từ vựng</Text>
                    )}
                </View>

                {/* Button Group */}
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={[
                            styles.createButton,
                            !setName.trim() || selectedWords.size === 0
                                ? styles.createButtonDisabled
                                : null,
                        ]}
                        onPress={handleCreateSet}
                        disabled={!setName.trim() || selectedWords.size === 0}
                    >
                        <Text style={styles.createButtonText}>Tạo bộ từ vựng</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </VocabularySheetModal>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: Padding.padding_20,
        paddingBottom: Padding.padding_20,
    },
    section: {
        marginBottom: Gap.gap_20 || 20,
    },
    sectionTitle: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_14,
        color: Color.colorDarkgray,
        marginBottom: Gap.gap_12 || 12,
    },
    vocabularyItem: {
        flexDirection: 'row',
        backgroundColor: Color.bg,
        borderWidth: 1,
        borderColor: Color.stroke,
        borderRadius: Border.br_20,
        padding: Padding.padding_15,
        marginBottom: Gap.gap_12 || 12,
        alignItems: 'center',
    },
    vocabularyContent: {
        flex: 1,
        marginRight: Gap.gap_12 || 12,
    },
    vocabularyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Gap.gap_10 || 10,
        marginBottom: 4,
    },
    word: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_16 || 16,
        color: Color.text,
    },
    badge: {
        paddingHorizontal: Padding.padding_8 || 8,
        paddingVertical: Padding.padding_2 || 2,
        borderRadius: Border.br_5,
    },
    badgeText: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: 10,
    },
    phonetic: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_12,
        color: Color.colorDarkgray,
        marginBottom: 2,
    },
    meaning: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_14,
        color: Color.color,
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
    addButtonSelected: {
        backgroundColor: '#F0FDF4',
        borderColor: Color.colorLimegreen,
    },
    emptyText: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_14,
        color: Color.colorDarkgray,
        textAlign: 'center',
        paddingVertical: Padding.padding_20,
    },
    buttonGroup: {
        marginTop: Gap.gap_20 || 20,
        gap: Gap.gap_12 || 12,
    },
    createButton: {
        backgroundColor: Color.colorLimegreen || '#22C55E',
        borderRadius: Border.br_15,
        paddingVertical: Padding.padding_15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButtonDisabled: {
        backgroundColor: Color.stroke,
        opacity: 0.5,
    },
    createButtonText: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_16 || 16,
        color: '#FFFFFF',
    },
});
