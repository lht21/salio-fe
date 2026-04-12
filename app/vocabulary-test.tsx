import { useRouter } from 'expo-router';
import { CaretRightIcon } from 'phosphor-react-native';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import NewFlashCardSetModal from '../components/Modals/NewFlashCardSetModal';
import SearchVocaModal from '../components/Modals/SearchVocaModal';
import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../constants/GlobalStyles';
import {
    ALL_NOTEBOOKS,
    VOCABULARY_STATISTICS,
    VocabularyNotebook
} from '../constants/mockVocabularyNotebook';

export default function VocabularyTestScreen() {
    const router = useRouter();
    const [isNewSetModalVisible, setIsNewSetModalVisible] = useState(false);
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [createdSets, setCreatedSets] = useState<
        Array<{ setName: string; wordCount: number }>
    >([]);

    const handleCreateSet = (setName: string, selectedWords: any[]) => {
        setCreatedSets([...createdSets, { setName, wordCount: selectedWords.length }]);
        setIsNewSetModalVisible(false);
        alert(`✅ Đã tạo bộ từ vựng: "${setName}" với ${selectedWords.length} từ`);
    };

    const renderNotebookItem = (notebook: VocabularyNotebook) => {
        const masteryPercent = Math.round((notebook.masteredWords / notebook.totalWords) * 100);
        const learnPercent = Math.round((notebook.learnedWords / notebook.totalWords) * 100);

        return (
            <TouchableOpacity
                key={notebook.id}
                style={[styles.notebookCard, { borderLeftColor: notebook.color }]}
            >
                <View style={styles.notebookHeader}>
                    <Text style={styles.notebookTitle}>{notebook.name}</Text>
                    <Text style={styles.wordCount}>{notebook.totalWords} từ</Text>
                </View>

                <Text style={styles.description}>{notebook.description}</Text>

                {/* Progress bars */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Thành thạo</Text>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${masteryPercent}%`,
                                        backgroundColor: '#22C55E',
                                    },
                                ]}
                            />
                        </View>
                        <Text style={styles.statValue}>
                            {notebook.masteredWords}/{notebook.totalWords}
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Đã học</Text>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${learnPercent}%`,
                                        backgroundColor: '#3B82F6',
                                    },
                                ]}
                            />
                        </View>
                        <Text style={styles.statValue}>
                            {notebook.learnedWords}/{notebook.totalWords}
                        </Text>
                    </View>
                </View>

                <View style={styles.footerAction}>
                    <Text style={styles.lastUpdated}>Cập nhật: {notebook.lastUpdated}</Text>
                    <CaretRightIcon size={20} color={Color.gray} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>📚 Test Sổ tay từ vựng</Text>
                    <Text style={styles.subtitle}>Mock Data v1.0</Text>
                </View>

                {/* Statistics */}
                <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>📊 Thống kê</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <Text style={styles.statBoxNumber}>{VOCABULARY_STATISTICS.totalNotebooks}</Text>
                            <Text style={styles.statBoxLabel}>Bộ từ vựng</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statBoxNumber}>{VOCABULARY_STATISTICS.totalWords}</Text>
                            <Text style={styles.statBoxLabel}>Tổng từ</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statBoxNumber}>{VOCABULARY_STATISTICS.totalLearned}</Text>
                            <Text style={styles.statBoxLabel}>Đã học</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statBoxNumber}>{VOCABULARY_STATISTICS.totalMastered}</Text>
                            <Text style={styles.statBoxLabel}>Thành thạo</Text>
                        </View>
                    </View>
                </View>

                {/* Test Features */}
                <View style={styles.featuresSection}>
                    <Text style={styles.sectionTitle}>🧪 Test Tính năng</Text>

                    <TouchableOpacity
                        style={styles.featureButton}
                        onPress={() => setIsNewSetModalVisible(true)}
                    >
                        <Text style={styles.featureButtonText}>✏️ Tạo Flashcard Set</Text>
                        <CaretRightIcon size={20} color={Color.bg} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.featureButton}
                        onPress={() => setIsSearchModalVisible(true)}
                    >
                        <Text style={styles.featureButtonText}>🔍 Search Từ vựng</Text>
                        <CaretRightIcon size={20} color={Color.bg} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.featureButton}
                        onPress={() => router.push(`/lessons/test-lesson/vocabulary/flashcard`)}
                    >
                        <Text style={styles.featureButtonText}>🎴 Học Flashcard</Text>
                        <CaretRightIcon size={20} color={Color.bg} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.featureButton}
                        onPress={() => router.push(`/lessons/test-lesson/vocabulary/quiz`)}
                    >
                        <Text style={styles.featureButtonText}>❓ Trắc nghiệm</Text>
                        <CaretRightIcon size={20} color={Color.bg} />
                    </TouchableOpacity>
                </View>

                {/* Created Sets */}
                {createdSets.length > 0 && (
                    <View style={styles.createdSetsSection}>
                        <Text style={styles.sectionTitle}>📝 Bộ từ vựng đã tạo</Text>
                        {createdSets.map((set, index) => (
                            <View key={index} style={styles.createdSetItem}>
                                <View>
                                    <Text style={styles.setName}>{set.setName}</Text>
                                    <Text style={styles.setDescription}>{set.wordCount} từ được chọn</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Notebooks List */}
                <View style={styles.notebooksSection}>
                    <Text style={styles.sectionTitle}>📖 Danh sách Bộ từ vựng</Text>
                    {ALL_NOTEBOOKS.map((notebook) => renderNotebookItem(notebook))}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>✨ All data is mock for testing</Text>
                </View>
            </ScrollView>

            {/* Modals */}
            <NewFlashCardSetModal
                isVisible={isNewSetModalVisible}
                onClose={() => setIsNewSetModalVisible(false)}
                onCreateSet={handleCreateSet}
            />

            <SearchVocaModal
                isVisible={isSearchModalVisible}
                onClose={() => setIsSearchModalVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.bg,
    },
    header: {
        paddingHorizontal: Padding.padding_20,
        paddingTop: Padding.padding_20,
        paddingBottom: Padding.padding_10,
    },
    title: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: FontSize.fs_24,
        color: Color.text,
        marginBottom: Gap.gap_5,
    },
    subtitle: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_12,
        color: Color.gray,
    },
    sectionTitle: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_20,
        color: Color.text,
        marginBottom: Gap.gap_15,
    },
    statsSection: {
        paddingHorizontal: Padding.padding_20,
        marginBottom: Gap.gap_20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Gap.gap_10,
    },
    statBox: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#F0FDF4',
        borderRadius: Border.br_15,
        paddingVertical: Padding.padding_15,
        paddingHorizontal: Padding.padding_10,
        alignItems: 'center',
    },
    statBoxNumber: {
        fontFamily: FontFamily.lexendDecaBold,
        fontSize: FontSize.fs_24,
        color: '#22C55E',
        marginBottom: Gap.gap_5,
    },
    statBoxLabel: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_12,
        color: Color.text,
        textAlign: 'center',
    },
    featuresSection: {
        paddingHorizontal: Padding.padding_20,
        marginBottom: Gap.gap_20,
    },
    featureButton: {
        flexDirection: 'row',
        backgroundColor: Color.main,
        borderRadius: Border.br_15,
        paddingHorizontal: Padding.padding_15,
        paddingVertical: Padding.padding_15,
        marginBottom: Gap.gap_10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    featureButtonText: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_14,
        color: Color.bg,
    },
    createdSetsSection: {
        paddingHorizontal: Padding.padding_20,
        marginBottom: Gap.gap_20,
    },
    createdSetItem: {
        flexDirection: 'row',
        backgroundColor: '#FEF08A',
        borderRadius: Border.br_15,
        padding: Padding.padding_15,
        marginBottom: Gap.gap_10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    setName: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_14,
        color: Color.text,
        marginBottom: Gap.gap_5,
    },
    setDescription: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_12,
        color: Color.gray,
    },
    notebooksSection: {
        paddingHorizontal: Padding.padding_20,
        marginBottom: Gap.gap_20,
    },
    notebookCard: {
        backgroundColor: Color.bg,
        borderLeftWidth: 4,
        borderRadius: Border.br_15,
        padding: Padding.padding_15,
        marginBottom: Gap.gap_15,
        borderWidth: 1,
        borderColor: Color.stroke,
    },
    notebookHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Gap.gap_8,
    },
    notebookTitle: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_16,
        color: Color.text,
    },
    wordCount: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_12,
        color: Color.gray,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: Padding.padding_8,
        paddingVertical: Padding.padding_3,
        borderRadius: Border.br_5,
    },
    description: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_12,
        color: Color.gray,
        marginBottom: Gap.gap_12,
    },
    statsContainer: {
        marginBottom: Gap.gap_12,
    },
    statItem: {
        marginBottom: Gap.gap_10,
    },
    statLabel: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_12,
        color: Color.gray,
        marginBottom: Gap.gap_5,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: Border.br_5,
        overflow: 'hidden',
        marginBottom: Gap.gap_5,
    },
    progressFill: {
        height: '100%',
        borderRadius: Border.br_5,
    },
    statValue: {
        fontFamily: FontFamily.lexendDecaMedium,
        fontSize: FontSize.fs_10,
        color: Color.gray,
    },
    footerAction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Gap.gap_8,
        borderTopWidth: 1,
        borderTopColor: Color.stroke,
    },
    lastUpdated: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_12,
        color: Color.gray,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: Padding.padding_20,
    },
    footerText: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_12,
        color: Color.gray,
    },
});
