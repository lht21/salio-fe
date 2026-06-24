import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { CheckIcon, PlusIcon } from 'phosphor-react-native';
import VocabularyCard from '../VocabularyCard';
import { VocabularyItem } from '../../api/hooks/useVocabularySearch';
import { useTheme } from '../../contexts/ThemeContext';

interface SelectableVocabularyCardProps {
    item: VocabularyItem;
    isSelected: boolean;
    onToggle: (item: VocabularyItem) => void;
}

const SelectableVocabularyCard = ({ item, isSelected, onToggle }: SelectableVocabularyCardProps) => {
    const { colors } = useTheme();

    return (
        <VocabularyCard
            item={item as any}
            isSelected={isSelected}
            onPress={() => onToggle(item)}
            rightAction={
                <MotiView
                    style={[styles.addButton, { backgroundColor: colors.bg, borderColor: colors.stroke }]}
                    animate={{
                        backgroundColor: isSelected ? colors.historySelectedBg : colors.bg,
                        borderColor: isSelected ? colors.main2 : colors.stroke,
                    }}
                    transition={{ type: 'timing', duration: 200 } as any}
                >
                    <AnimatePresence exitBeforeEnter>
                        {isSelected ? (
                            <MotiView 
                                key="check" 
                                from={{ opacity: 0, scale: 0.5, rotate: '-90deg' }} 
                                animate={{ opacity: 1, scale: 1, rotate: '0deg' }} 
                                exit={{ opacity: 0, scale: 0.5, rotate: '90deg' }} 
                                transition={{ type: 'timing', duration: 150 } as any}
                            >
                                <CheckIcon size={16} color={colors.main2} weight="bold" />
                            </MotiView>
                        ) : (
                            <MotiView 
                                key="plus" 
                                from={{ opacity: 0, scale: 0.5, rotate: '90deg' }} 
                                animate={{ opacity: 1, scale: 1, rotate: '0deg' }} 
                                exit={{ opacity: 0, scale: 0.5, rotate: '-90deg' }} 
                                transition={{ type: 'timing', duration: 150 } as any}
                            >
                                <PlusIcon size={16} color={colors.text} weight="bold" />
                            </MotiView>
                        )}
                    </AnimatePresence>
                </MotiView>
            }
        />
    );
};

const styles = StyleSheet.create({
    addButton: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default memo(SelectableVocabularyCard);
