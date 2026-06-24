import { useState, useCallback } from 'react';
import FlashcardService from '../services/flashcard.service';
import { VocabularyItem } from './useVocabularySearch';

export const useFavoriteVocabulary = () => {
    const [favoriteWords, setFavoriteWords] = useState<VocabularyItem[]>([]);
    const [isLoadingFavs, setIsLoadingFavs] = useState(false);

    const fetchFavorites = useCallback(async () => {
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
    }, []);

    return {
        favoriteWords,
        isLoadingFavs,
        fetchFavorites,
    };
};
