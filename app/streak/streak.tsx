import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import ScreenHeader from '../../components/ScreenHeader';
import { CalendarDay, MonthSection, DayState } from '../../components/StreakComponent/types';
import { MonthBlock } from '../../components/StreakComponent/MonthBlock';
import { MonthConnector } from '../../components/StreakComponent/MonthConnector';
import StreakRewardsModal from '../../components/Modals/StreakRewardsModal';
import Button from '../../components/Button';

type SummaryCard = {
    id: string;
    value: string;
    label: string;
};

const SUMMARY_CARDS: SummaryCard[] = [
    { id: 'current', value: '2', label: 'Chuỗi 7' },
    { id: 'best-week', value: '5', label: 'Chuỗi 4' },
    { id: 'best', value: '15d', label: 'Dài nhất' },
];

const generateMockMonths = (numMonths: number): MonthSection[] => {
    const sections: MonthSection[] = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDate = today.getDate();
    
    let currentStreak = 0; // Biến theo dõi chuỗi học liên tiếp

    // Lấy `numMonths` tháng gần nhất (bao gồm tháng hiện tại)
    for (let i = numMonths - 1; i >= 0; i--) {
        const date = new Date(currentYear, today.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const daysInMonth = new Date(year, month, 0).getDate();

        const days: CalendarDay[] = [];
        for (let d = 1; d <= daysInMonth; d++) {
            let state: DayState = 'inactive';
            let fire = false;

            const isToday = year === currentYear && month === currentMonth && d === currentDate;
            const isFuture = year > currentYear || (year === currentYear && month > currentMonth) || (year === currentYear && month === currentMonth && d > currentDate);
            const isPast = !isToday && !isFuture;

            if (isFuture) {
                state = 'inactive'; // Ngày trong tương lai (chưa tới) -> Xám
            } else if (isToday) {
                state = 'today';
            } else if (isPast) {
                // Ngày trong quá khứ chỉ có thể là Đã học (completed) hoặc Bỏ lỡ (missed)
                const rand = (d * 7 + month * 13) % 10;
                if (rand < 7) {
                    state = 'completed';
                    currentStreak++;
                    if (currentStreak > 0 && currentStreak % 4 === 0) {
                        fire = true; // Cứ đạt 4 ngày liên tiếp thì hiện lửa
                    }
                } else {
                    state = 'missed';
                    currentStreak = 0; // Đứt chuỗi, đếm lại từ đầu
                }
            }

            days.push({
                id: `${year}-${month}-${d}`,
                day: d.toString(),
                state,
                fire
            });
        }

        sections.push({
            id: `${month}-${year}`,
            title: `Tháng ${month} ${year}`,
            month,
            year,
            days
        });
    }
    return sections;
};

// Sinh ra 3 tháng liên tiếp tính đến tháng hiện tại
const MONTH_SECTIONS: MonthSection[] = generateMockMonths(3);

export default function StreakScreen() {
    const router = useRouter();
    const scrollRef = React.useRef<ScrollView>(null);
    const [hasScrolledToEnd, setHasScrolledToEnd] = React.useState(false);
    const [isRewardsModalVisible, setIsRewardsModalVisible] = React.useState(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScreenHeader 
                title="Chuỗi học tập" 
                onBackPress={() => router.replace('/(tabs)/profile')} 
            />

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
                onContentSizeChange={() => {
                    // Khi nội dung đã render xong, cuộn thẳng xuống dưới cùng
                    if (!hasScrolledToEnd) {
                        scrollRef.current?.scrollToEnd({ animated: true });
                        setHasScrolledToEnd(true);
                    }
                }}
            >
                {MONTH_SECTIONS.map((section, index) => (
                    <View key={section.id}>
                        <MonthBlock section={section} />
                        {index < MONTH_SECTIONS.length - 1 ? <MonthConnector /> : null}
                    </View>
                ))}
                
                <View style={styles.encouragementCard}>
                    <View style={styles.encouragementIconWrap}>
                        <Image source={require('../../assets/images/streak/lv1.png')} style={{ width: 36, height: 36 }} resizeMode="contain" />
                    </View>
                    <View style={styles.encouragementTextWrap}>
                        <Text style={styles.encouragementTitle}>15 ngày</Text>
                        <Text style={styles.encouragementDesc}>
                            Tuyệt vời! Chỉ còn 5 ngày nữa là bạn đạt mốc 20 ngày. Giữ vững phong độ nhé!
                        </Text>
                    </View>
                    <Button 
                        title="Xem phần thưởng chuỗi" 
                        variant="Orange" 
                        onPress={() => setIsRewardsModalVisible(true)} 
                        style={{ marginTop: 4 }} 
                    />
                </View>
            </ScrollView>

            <StreakRewardsModal 
                isVisible={isRewardsModalVisible} 
                onClose={() => setIsRewardsModalVisible(false)} 
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Color.bg,
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
    encouragementCard: {
        marginTop: 10,
        backgroundColor: '#FFF7ED',
        borderWidth: 3,
        borderColor: '#FFEDD5',
        borderRadius: Border.br_30,
        padding: 16,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
    },
    encouragementIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFEDD5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    encouragementTextWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    encouragementTitle: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_16,
        color: '#EA580C',
        marginBottom: 4,
        textAlign: 'center',
    },
    encouragementDesc: {
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_12,
        color: '#9A3412',
        lineHeight: 18,
        textAlign: 'center',
    },
});
