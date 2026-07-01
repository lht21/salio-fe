import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { FontFamily, FontSize, Padding } from '../../constants/GlobalStyles';
import { DayDot } from './DayCell';
import { MonthSection, CalendarDay } from './types';

export const MonthBlock = ({ section }: { section: MonthSection }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const screenWidth = Dimensions.get('window').width;
        const pastDaysWidth = 5 * (44 + 12); // 5 ngày trước * (chiều rộng 44 + khoảng cách 12)
        const todayCellWidth = 56; // Ngày hiện tại có kích thước 56
        const paddingLeft = 15;

        // Tính toán offset để đưa ngày hiện tại vào giữa màn hình
        const centerOffset = pastDaysWidth + paddingLeft + (todayCellWidth / 2) - (screenWidth / 2);

        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ x: Math.max(0, centerOffset), animated: true });
        }, 300); // Thêm một chút delay để UI kịp render trước khi cuộn
    }, [section]);

    return (
        <View style={styles.monthBlock}>
            <View style={styles.monthHeader}>
                <Text style={styles.monthTitle}>{section.title}</Text>
            </View>

            <View style={styles.scrollWrapper}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daysWrap}
                >
                    {section.days.map((day) => (
                        <DayDot key={day.id} item={day} />
                    ))}
                </ScrollView>
                <LinearGradient
                    colors={[colors.background, colors.background + '00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.fadeLeft}
                    pointerEvents="none"
                />
                <LinearGradient
                    colors={[colors.background + '00', colors.background]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.fadeRight}
                    pointerEvents="none"
                />
            </View>
        </View>
    );
};

const createStyles = (colors: any) => StyleSheet.create({
    monthBlock: { backgroundColor: colors.background, borderWidth: 2, borderColor: colors.main900 || 'rgba(80, 141, 78, 0.22)', borderRadius: 26, overflow: 'hidden' },
    monthHeader: { backgroundColor: colors.primary, paddingHorizontal: Padding.padding_20, paddingVertical: 14, borderTopLeftRadius: 26, borderTopRightRadius: 26 },
    monthTitle: { fontFamily: FontFamily.lexendDecaSemiBold, fontSize: FontSize.fs_16, color: colors.background },
    scrollWrapper: { position: 'relative' },
    daysWrap: { flexDirection: 'row', gap: 12, paddingHorizontal: Padding.padding_15, paddingTop: Padding.padding_15, paddingBottom: Padding.padding_20, backgroundColor: colors.background },
    fadeLeft: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 32, zIndex: 1 },
    fadeRight: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 32, zIndex: 1 },
});