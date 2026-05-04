import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { FontFamily, FontSize, Padding } from '../../constants/GlobalStyles';
import { DayDot, PlaceholderDot } from './DayCell';
import { MonthSection, CalendarDay } from './types';

const MONTH_GRID_CELLS = 35;

type MonthCell = {
    id: string;
    type: 'placeholder' | 'day';
    day?: CalendarDay;
};

const buildMonthCells = (section: MonthSection): MonthCell[] => {
    const leadingPlaceholders = Array.from({ length: 6 }, (_, index) => ({
        id: section.id + '-lead-' + index,
        type: 'placeholder' as const,
    }));

    const dayCells = section.days.map((day) => ({
        id: day.id,
        type: 'day' as const,
        day,
    }));

    const remaining = Math.max(0, MONTH_GRID_CELLS - leadingPlaceholders.length - dayCells.length);
    const trailingPlaceholders = Array.from({ length: remaining }, (_, index) => ({
        id: section.id + '-trail-' + index,
        type: 'placeholder' as const,
    }));

    return [...leadingPlaceholders, ...dayCells, ...trailingPlaceholders];
};

export const MonthBlock = ({ section }: { section: MonthSection }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const monthCells = buildMonthCells(section);

    return (
        <View style={styles.monthBlock}>
            <View style={styles.monthHeader}>
                <Text style={styles.monthTitle}>{section.title}</Text>
            </View>

            <View style={styles.daysWrap}>
                {monthCells.map((cell) => {
                    if (cell.type === 'placeholder') {
                        return <PlaceholderDot key={cell.id} />;
                    }

                    return cell.day ? <DayDot key={cell.id} item={cell.day} /> : null;
                })}
            </View>
        </View>
    );
};

const createStyles = (colors: any) => StyleSheet.create({
    monthBlock: { backgroundColor: colors.bg, borderWidth: 2, borderColor: colors.monthBlockBorder || 'rgba(80, 141, 78, 0.22)', borderRadius: 26, overflow: 'hidden' },
    monthHeader: { backgroundColor: colors.main2, paddingHorizontal: Padding.padding_20, paddingVertical: 14, borderTopLeftRadius: 26, borderTopRightRadius: 26 },
    monthTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.bg },
    daysWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_15, paddingBottom: Padding.padding_20, backgroundColor: colors.bg },
});