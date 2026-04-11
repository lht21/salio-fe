import { useRouter } from 'expo-router';
import { ArrowLeftIcon, FireIcon } from 'phosphor-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';

type SummaryCard = {
    id: string;
    value: string;
    label: string;
};

type DayState = 'inactive' | 'completed' | 'missed' | 'today';

type CalendarDay = {
    id: string;
    day: string;
    state: DayState;
    fire?: boolean;
};

type MonthSection = {
    id: string;
    title: string;
    month: number;
    year: number;
    days: CalendarDay[];
};

const MONTH_GRID_COLUMNS = 7;
const MONTH_GRID_CELLS = 35;

const SUMMARY_CARDS: SummaryCard[] = [
    { id: 'current', value: '2', label: 'Chuỗi 7' },
    { id: 'best-week', value: '5', label: 'Chuỗi 4' },
    { id: 'best', value: '15d', label: 'Dài nhất' },
];

const FEB_DAYS: CalendarDay[] = [
    { id: 'feb-1', day: '1', state: 'inactive' },
    { id: 'feb-2', day: '2', state: 'completed' },
    { id: 'feb-3', day: '3', state: 'completed' },
    { id: 'feb-4', day: '4', state: 'completed', fire: true },
    { id: 'feb-5', day: '5', state: 'completed', fire: true },
    { id: 'feb-6', day: '6', state: 'completed', fire: true },
    { id: 'feb-7', day: '7', state: 'completed', fire: true },
    { id: 'feb-8', day: '8', state: 'missed' },
    { id: 'feb-9', day: '9', state: 'missed' },
    { id: 'feb-10', day: '10', state: 'completed' },
    { id: 'feb-11', day: '11', state: 'completed' },
    { id: 'feb-12', day: '12', state: 'completed', fire: true },
    { id: 'feb-13', day: '13', state: 'completed', fire: true },
    { id: 'feb-14', day: '14', state: 'missed' },
    { id: 'feb-15', day: '15', state: 'completed' },
    { id: 'feb-16', day: '16', state: 'today' },
    { id: 'feb-17', day: '17', state: 'inactive' },
    { id: 'feb-18', day: '18', state: 'inactive' },
    { id: 'feb-19', day: '19', state: 'inactive' },
    { id: 'feb-20', day: '20', state: 'inactive' },
    { id: 'feb-21', day: '21', state: 'inactive' },
    { id: 'feb-22', day: '22', state: 'inactive' },
];

const MARCH_DAYS: CalendarDay[] = [
    { id: 'mar-1', day: '1', state: 'inactive' },
    { id: 'mar-2', day: '2', state: 'inactive' },
    { id: 'mar-3', day: '3', state: 'inactive' },
    { id: 'mar-4', day: '4', state: 'inactive' },
    { id: 'mar-5', day: '5', state: 'inactive' },
    { id: 'mar-6', day: '6', state: 'inactive' },
    { id: 'mar-7', day: '7', state: 'inactive' },
    { id: 'mar-8', day: '8', state: 'inactive' },
    { id: 'mar-9', day: '9', state: 'inactive' },
    { id: 'mar-10', day: '10', state: 'inactive' },
    { id: 'mar-11', day: '11', state: 'inactive' },
    { id: 'mar-12', day: '12', state: 'inactive' },
    { id: 'mar-13', day: '13', state: 'inactive' },
    { id: 'mar-14', day: '14', state: 'inactive' },
    { id: 'mar-15', day: '15', state: 'inactive' },
    { id: 'mar-16', day: '16', state: 'inactive' },
    { id: 'mar-17', day: '17', state: 'inactive' },
    { id: 'mar-18', day: '18', state: 'inactive' },
    { id: 'mar-19', day: '19', state: 'inactive' },
    { id: 'mar-20', day: '20', state: 'inactive' },
    { id: 'mar-21', day: '21', state: 'inactive' },
    { id: 'mar-22', day: '22', state: 'inactive' },
];

const APR_DAYS: CalendarDay[] = FEB_DAYS.map((day) => ({
    ...day,
    id: day.id.replace('feb-', 'apr-'),
}));

const ALL_MONTH_SECTIONS: MonthSection[] = [
    { id: 'feb-2026', title: 'Tháng 2 2026', month: 2, year: 2026, days: FEB_DAYS },
    { id: 'mar-2026', title: 'Tháng 3 2026', month: 3, year: 2026, days: MARCH_DAYS },
    { id: 'apr-2026', title: 'Tháng 4 2026', month: 4, year: 2026, days: APR_DAYS },
];

const DISPLAY_END_MONTH = 4;
const DISPLAY_END_YEAR = 2026;

const MONTH_SECTIONS: MonthSection[] = ALL_MONTH_SECTIONS.filter((section) => {
    if (section.year < DISPLAY_END_YEAR) {
        return true;
    }

    if (section.year > DISPLAY_END_YEAR) {
        return false;
    }

    return section.month <= DISPLAY_END_MONTH;
});

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

const DayDot = ({ item }: { item: CalendarDay }) => {
    let circleStyle = styles.circleInactive;
    let textStyle = styles.dayTextInactive;

    if (item.state === 'completed') {
        circleStyle = styles.circleCompleted;
        textStyle = styles.dayTextWhite;
    } else if (item.state === 'missed') {
        circleStyle = styles.circleMissed;
        textStyle = styles.dayTextWhite;
    } else if (item.state === 'today') {
        circleStyle = styles.circleToday;
        textStyle = styles.dayTextToday;
    }

    return (
        <View style={styles.dayCell}>
            <View style={[styles.dayCircle, circleStyle]}>
                <Text style={[styles.dayText, textStyle]}>{item.day}</Text>
            </View>
            {item.fire ? (
                <View style={styles.fireWrap}>
                    <FireIcon size={11} color="#EA580C" weight="fill" />
                </View>
            ) : null}
        </View>
    );
};

const PlaceholderDot = () => {
    return (
        <View style={styles.dayCell}>
            <View style={styles.placeholderDot} />
        </View>
    );
};

const MonthBlock = ({ section }: { section: MonthSection }) => {
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

const MonthConnector = () => {
    return (
        <View style={styles.connectorWrap}>
            <View style={styles.connectorDot} />
            <View style={styles.connectorLine} />
            <View style={styles.connectorDot} />
        </View>
    );
};

export default function StreakScreen() {
    const router = useRouter();
    const scrollRef = React.useRef<ScrollView>(null);
    const [monthOffsets, setMonthOffsets] = React.useState<Record<string, number>>({});
    const [viewportHeight, setViewportHeight] = React.useState(0);
    const [hasScrolledToCurrentMonth, setHasScrolledToCurrentMonth] = React.useState(false);

    const now = new Date();
    const currentMonthIndex = MONTH_SECTIONS.findIndex(
        (section) => section.month === now.getMonth() + 1 && section.year === now.getFullYear()
    );
    const fallbackIndex = MONTH_SECTIONS.length > 0 ? MONTH_SECTIONS.length - 1 : 0;
    const targetSectionIndex = currentMonthIndex >= 0 ? currentMonthIndex : fallbackIndex;
    const targetSectionId = MONTH_SECTIONS[targetSectionIndex]?.id;

    React.useEffect(() => {
        if (!targetSectionId || viewportHeight <= 0 || hasScrolledToCurrentMonth) {
            return;
        }

        const targetY = monthOffsets[targetSectionId];
        if (typeof targetY !== 'number') {
            return;
        }

        const centeredY = Math.max(0, targetY - viewportHeight * 0.32);
        scrollRef.current?.scrollTo({ y: centeredY, animated: false });
        setHasScrolledToCurrentMonth(true);
    }, [hasScrolledToCurrentMonth, monthOffsets, targetSectionId, viewportHeight]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/profile')}>
                    <ArrowLeftIcon size={24} color={Color.gray} weight="bold" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chuỗi học tập</Text>
            </View>

            <View style={styles.summaryRowWrap}>
                <View style={styles.summaryRow}>
                    {SUMMARY_CARDS.map((card) => (
                        <View key={card.id} style={styles.summaryCard}>
                            <Text style={styles.summaryValue}>{card.value}</Text>
                            <Text style={styles.summaryLabel}>{card.label}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <ScrollView
                ref={scrollRef}
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
            >
                {MONTH_SECTIONS.map((section, index) => (
                    <View
                        key={section.id}
                        onLayout={(event) => {
                            const y = event.nativeEvent.layout.y;
                            setMonthOffsets((prev) => {
                                if (prev[section.id] === y) {
                                    return prev;
                                }

                                return {
                                    ...prev,
                                    [section.id]: y,
                                };
                            });
                        }}
                    >
                        <MonthBlock section={section} />
                        {index < MONTH_SECTIONS.length - 1 ? <MonthConnector /> : null}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Color.bg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Padding.padding_15,
        paddingTop: Padding.padding_15,
        paddingBottom: 12,
    },
    backButton: {
        marginRight: Gap.gap_10,
    },
    headerTitle: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_24,
        color: Color.text,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Padding.padding_15,
        paddingTop: 6,
        paddingBottom: 24,
    },
    summaryRowWrap: {
        paddingHorizontal: Padding.padding_15,
        paddingTop: 14,
        paddingBottom: 12,
        backgroundColor: Color.bg,
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 14,
    },
    summaryCard: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#B9C2D1',
        borderRadius: 16,
        backgroundColor: Color.bg,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 74,
        paddingVertical: 10,
        paddingHorizontal: 6,
    },
    summaryValue: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_24,
        lineHeight: 30,
        color: Color.text,
    },
    summaryLabel: {
        marginTop: 2,
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_12,
        color: Color.gray,
    },
    monthBlock: {
        backgroundColor: Color.bg,
        borderWidth: 1.5,
        borderColor: 'rgba(80, 141, 78, 0.22)',
        borderRadius: 26,
        overflow: 'hidden',
    },
    monthHeader: {
        backgroundColor: Color.main2,
        paddingHorizontal: Padding.padding_20,
        paddingVertical: 14,
    },
    monthTitle: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_16,
        color: Color.bg,
    },
    daysWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: Padding.padding_15,
        paddingTop: Padding.padding_15,
        paddingBottom: Padding.padding_20,
        backgroundColor: Color.bg,
    },
    dayCell: {
        width: `${100 / MONTH_GRID_COLUMNS}%`,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: 2,
    },
    placeholderDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(80, 141, 78, 0.18)',
    },
    dayCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayText: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_12,
    },
    circleInactive: {
        backgroundColor: '#E2E8F0',
    },
    dayTextInactive: {
        color: '#64748B',
    },
    circleCompleted: {
        backgroundColor: Color.colorLimegreen,
    },
    dayTextWhite: {
        color: '#FFFFFF',
    },
    circleMissed: {
        backgroundColor: '#EA580C',
    },
    circleToday: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#4A9F00',
    },
    dayTextToday: {
        color: '#4A9F00',
    },
    fireWrap: {
        position: 'absolute',
        bottom: -1,
        right: 2,
        backgroundColor: Color.bg,
        borderRadius: 9,
        padding: 1,
    },
    connectorWrap: {
        alignItems: 'center',
        marginVertical: 10,
    },
    connectorLine: {
        height: 20,
        borderLeftWidth: 2,
        borderStyle: 'dashed',
        borderLeftColor: 'rgba(80, 141, 78, 0.3)',
    },
    connectorDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: 'rgba(80, 141, 78, 0.55)',
    },
});
