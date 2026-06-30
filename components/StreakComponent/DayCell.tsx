import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FireIcon } from 'phosphor-react-native';
import { FontFamily, FontSize } from '../../constants/GlobalStyles';
import { CalendarDay } from '../StreakComponent/types';
import { useTheme } from "@/contexts/ThemeContext";

export const PlaceholderDot = () => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    return (
        <View style={styles.dayCell}>
            <View style={styles.placeholderDot} />
        </View>
    );
};

const getTodayStr = () => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
};

export const DayDot = ({ item }: { item: CalendarDay }) => {
    const { colors } = useTheme();
    const styles = getStyles(colors);

    const isToday = item.id === getTodayStr();

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
        <View style={[styles.dayCell, isToday && styles.dayCellIsToday]}>
            <View style={[styles.dayCircle, circleStyle, isToday && styles.circleIsToday]}>
                <Text style={[styles.dayText, textStyle, isToday && styles.textIsToday]}>{item.day}</Text>
            </View>
            {item.fire ? (
                <View style={styles.fireWrap}>
                    <FireIcon size={11} color="#EA580C" weight="fill" />
                </View>
            ) : null}
        </View>
    );
};

const getStyles = (colors: any) => StyleSheet.create({
        dayCell: {
            width: 44, // Kích thước cố định cho hiển thị dạng thanh trượt
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: 2,
        },
        dayCellIsToday: {
            width: 56,
            height: 56,
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
        circleIsToday: {
            width: 42,
            height: 42,
            borderRadius: 21,
        },
        dayText: {
            fontFamily: FontFamily.lexendDecaSemiBold,
            fontSize: FontSize.fs_12,
        },
        textIsToday: {
            fontSize: FontSize.fs_16,
        },
        circleInactive: { backgroundColor: '#E2E8F0' },
        dayTextInactive: { color: '#64748B' },
        circleCompleted: { backgroundColor: colors.main2 },
        dayTextWhite: { color: '#FFFFFF' },
        circleMissed: { backgroundColor: '#EA580C' },
        circleToday: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#4A9F00' },
        dayTextToday: { color: '#4A9F00' },
        fireWrap: { position: 'absolute', bottom: -1, right: 2, backgroundColor: colors.bg, borderRadius: 9, padding: 1 },
    });