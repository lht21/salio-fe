import { useState, useEffect } from 'react';
import VocabularyService from '../services/vocabulary.service';

export interface VocabularyItem {
    id: string;
    word: string;
    pos: string;
    phonetic: string;
    meaning: string;
}

export const useVocabularySearch = () => {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<VocabularyItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const keyword = searchText.trim().normalize('NFC');
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
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText]);

    return {
        searchText,
        setSearchText,
        searchResults,
        isSearching,
    };
};
