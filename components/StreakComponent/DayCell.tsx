import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FireIcon } from 'phosphor-react-native';
import { Color, FontFamily, FontSize } from '../../constants/GlobalStyles';
import { CalendarDay } from '../StreakComponent/types';

export const PlaceholderDot = () => {
    return (
        <View style={styles.dayCell}>
            <View style={styles.placeholderDot} />
        </View>
    );
};

export const DayDot = ({ item }: { item: CalendarDay }) => {
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

const MONTH_GRID_COLUMNS = 7;

const styles = StyleSheet.create({
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
    circleInactive: { backgroundColor: '#E2E8F0' },
    dayTextInactive: { color: '#64748B' },
    circleCompleted: { backgroundColor: Color.main2 },
    dayTextWhite: { color: '#FFFFFF' },
    circleMissed: { backgroundColor: '#EA580C' },
    circleToday: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#4A9F00' },
    dayTextToday: { color: '#4A9F00' },
    fireWrap: { position: 'absolute', bottom: -1, right: 2, backgroundColor: Color.bg, borderRadius: 9, padding: 1 },
});