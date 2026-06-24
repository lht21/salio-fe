import { useState, useCallback } from 'react';
import { VocabularyItem } from './useVocabularySearch';

export const useWordSelection = () => {
    const [selectedWordsMap, setSelectedWordsMap] = useState<Record<string, VocabularyItem>>({});

    const toggleWordSelection = useCallback((item: VocabularyItem) => {
        setSelectedWordsMap(prev => {
            const newMap = { ...prev };
            if (newMap[item.id]) {
                delete newMap[item.id];
            } else {
                newMap[item.id] = item;
            }
            return newMap;
        });
    }, []);

    const clearSelections = useCallback(() => {
        setSelectedWordsMap({});
    }, []);

    const getSelectedArray = useCallback(() => {
        return Object.values(selectedWordsMap);
    }, [selectedWordsMap]);

    const hasSelections = Object.keys(selectedWordsMap).length > 0;

    return {
        selectedWordsMap,
        toggleWordSelection,
        clearSelections,
        getSelectedArray,
        hasSelections,
    };
};
