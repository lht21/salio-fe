import { AnimatePresence, MotiView } from 'moti';
import { CheckIcon, PlusIcon } from 'phosphor-react-native';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import { ALL_NOTEBOOKS } from '../../constants/mockVocabularyNotebook';
import { CustomInput } from '../CustomInput';
import VocabularyCard from '../VocabularyCard';
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

// Mock data - Flatten all words from all notebooks
const VOCABULARY_SUGGESTIONS: VocabularyItem[] = ALL_NOTEBOOKS.flatMap((notebook) =>
    notebook.words.map((word) => ({
        id: word.id,
        word: word.word,
        pos: word.pos,
        phonetic: word.phonetic,
        meaning: word.meaning,
    }))
);

const OLD_VOCABULARY_SUGGESTIONS: VocabularyItem[] = [
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

    return (
        <VocabularySheetModal
            visible={isVisible}
            title="Bộ từ vựng mới"
            onClose={onClose}
            maxHeight="95%"
            edgeToBottom
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
                            const isSelected = selectedWords.has(item.id);

                            return (
                                <VocabularyCard
                                    key={item.id}
                                    item={item}
                                    isSelected={isSelected}
                                    rightAction={
                                        <TouchableOpacity
                                            onPress={() => toggleWordSelection(item.id)}
                                        >
                                            <MotiView
                                                style={styles.addButton}
                                                animate={{
                                                    backgroundColor: isSelected ? '#F0FDF4' : (Color.bg || '#FFFFFF'),
                                                    borderColor: isSelected ? (Color.colorLimegreen || '#22C55E') : (Color.stroke || '#E2E8F0'),
                                                }}
                                                transition={{ type: 'timing', duration: 200 }}
                                            >
                                                <AnimatePresence exitBeforeEnter>
                                                    {isSelected ? (
                                                        <MotiView key="check" from={{ opacity: 0, scale: 0.5, rotate: '-90deg' }} animate={{ opacity: 1, scale: 1, rotate: '0deg' }} exit={{ opacity: 0, scale: 0.5, rotate: '90deg' }} transition={{ type: 'timing', duration: 150 }}>
                                                            <CheckIcon size={16} color={Color.colorLimegreen} weight="bold" />
                                                        </MotiView>
                                                    ) : (
                                                        <MotiView key="plus" from={{ opacity: 0, scale: 0.5, rotate: '90deg' }} animate={{ opacity: 1, scale: 1, rotate: '0deg' }} exit={{ opacity: 0, scale: 0.5, rotate: '-90deg' }} transition={{ type: 'timing', duration: 150 }}>
                                                            <PlusIcon size={16} color={Color.text} weight="bold" />
                                                        </MotiView>
                                                    )}
                                                </AnimatePresence>
                                            </MotiView>
                                        </TouchableOpacity>
                                    }
                                />
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
