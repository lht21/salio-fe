import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FireIcon, TrophyIcon, CalendarBlankIcon } from 'phosphor-react-native';

import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';
import ScreenHeader from '../../components/ScreenHeader';
import { CalendarDay, MonthSection, DayState } from '../../components/StreakComponent/types';
import { MonthBlock } from '../../components/StreakComponent/MonthBlock';
import { MonthConnector } from '../../components/StreakComponent/MonthConnector';
import StreakRewardsModal from '../../components/Modals/StreakRewardsModal';
import Button from '../../components/Button';
import { useUser } from '../../contexts/UserContext';

const generateStreakMonths = (activeDates: string[], numMonths: number, createdAtStr?: string): MonthSection[] => {
    const sections: MonthSection[] = [];
    
    // Hàm tiện ích format ngày thành YYYY-MM-DD theo giờ local
    const formatDate = (y: number, m: number, d: number) => {
        return `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    };

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDate = today.getDate();

    let createdAtDate: Date | null = null;
    if (createdAtStr) {
        createdAtDate = new Date(createdAtStr);
        createdAtDate.setHours(0, 0, 0, 0); // Đưa về 00:00:00 để so sánh chính xác theo ngày
    }
    
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
            
            const currentIterDate = new Date(year, month - 1, d);
            const isBeforeCreation = createdAtDate ? currentIterDate < createdAtDate : false;
            const isPast = !isToday && !isFuture && !isBeforeCreation;

            if (isFuture || isBeforeCreation) {
                state = 'inactive'; // Ngày trong tương lai hoặc trước khi tạo tài khoản -> Xám
            } else if (isToday) {
                const todayStr = formatDate(year, month, d);
                state = activeDates.includes(todayStr) ? 'completed' : 'today';
                if (state === 'completed') currentStreak++;
            } else if (isPast) {
                const dateStr = formatDate(year, month, d);
                const isCompleted = activeDates.includes(dateStr);
                
                if (isCompleted) {
                    state = 'completed';
                    currentStreak++;
                    // Hiện biểu tượng lửa cho các mốc chuỗi chia hết cho 7 (ví dụ)
                    if (currentStreak > 0 && currentStreak % 7 === 0) {
                        fire = true; 
                    }
                } else {
                    state = 'missed';
                    currentStreak = 0; // Đứt chuỗi, đếm lại từ đầu
                }
            }

            days.push({
                id: formatDate(year, month, d),
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

const getStreakImage = (streak: number) => {
    if (streak > 60) return require('../../assets/images/streak/lv6.png');
    if (streak >= 31) return require('../../assets/images/streak/lv5.png');
    if (streak >= 15) return require('../../assets/images/streak/lv4.png');
    if (streak >= 7) return require('../../assets/images/streak/lv3.png');
    if (streak >= 4) return require('../../assets/images/streak/lv2.png');
    return require('../../assets/images/streak/lv1.png');
};

export default function StreakScreen() {
    const router = useRouter();
    const { stats, user } = useUser();
    const scrollRef = React.useRef<ScrollView>(null);
    const [hasScrolledToEnd, setHasScrolledToEnd] = React.useState(false);
    const [isRewardsModalVisible, setIsRewardsModalVisible] = React.useState(false);

    // Lấy dữ liệu thật từ stats
    const activeDates = stats?.gamification?.activeDates || [];
    const currentStreak = stats?.gamification?.currentStreak || 0;
    const highestStreak = stats?.gamification?.highestStreak || 0;

    // Render 3 tháng liên tiếp tính đến tháng hiện tại dựa trên activeDates
    const MONTH_SECTIONS = React.useMemo(() => generateStreakMonths(activeDates, 3, user?.createdAt), [activeDates, user?.createdAt]);
    const currentStreakImage = getStreakImage(currentStreak);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScreenHeader 
                title="Chuỗi học tập" 
                onBackPress={() => router.back()} 
            />

            <View style={styles.summaryRowWrap}>
                <View style={styles.summaryRow}>
                    <LinearGradient 
                        colors={['#1E293B', '#0F172A']} 
                        start={{x:0, y:0}} 
                        end={{x:1, y:1}} 
                        style={styles.summaryCard}
                    >
                        <View style={styles.summaryWatermark}>
                            <FireIcon size={64} color="#EA580C" weight="fill" opacity={0.15} />
                        </View>
                        <Text style={styles.summaryValue}>{currentStreak}</Text>
                        <Text style={styles.summaryLabel}>Chuỗi hiện tại</Text>
                    </LinearGradient>
                    <LinearGradient 
                        colors={['#1E293B', '#0F172A']} 
                        start={{x:0, y:0}} 
                        end={{x:1, y:1}} 
                        style={styles.summaryCard}
                    >
                        <View style={styles.summaryWatermark}>
                            <TrophyIcon size={64} color="#FBBF24" weight="fill" opacity={0.15} />
                        </View>
                        <Text style={styles.summaryValue}>{highestStreak}</Text>
                        <Text style={styles.summaryLabel}>Dài nhất</Text>
                    </LinearGradient>
                    <LinearGradient 
                        colors={['#1E293B', '#0F172A']} 
                        start={{x:0, y:0}} 
                        end={{x:1, y:1}} 
                        style={styles.summaryCard}
                    >
                        <View style={styles.summaryWatermark}>
                            <CalendarBlankIcon size={64} color="#3B82F6" weight="fill" opacity={0.15} />
                        </View>
                        <Text style={styles.summaryValue}>{activeDates.length}</Text>
                        <Text style={styles.summaryLabel}>Tổng ngày học</Text>
                    </LinearGradient>
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
                        <Image source={currentStreakImage} style={{ width: 36, height: 36 }} resizeMode="contain" />
                    </View>
                    <View style={styles.encouragementTextWrap}>
                        <Text style={styles.encouragementTitle}>{currentStreak} ngày</Text>
                        <Text style={styles.encouragementDesc}>
                            Tuyệt vời! Bạn đang có chuỗi học rất tốt. Hãy tiếp tục giữ vững phong độ nhé!
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
        backgroundColor: Color.bg2,
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
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 74,
        paddingVertical: 10,
        paddingHorizontal: 6,
        position: 'relative',
        overflow: 'hidden',
    },
    summaryWatermark: {
        position: 'absolute',
        right: -15,
        bottom: -15,
        transform: [{ rotate: '-15deg' }],
    },
    summaryValue: {
        fontFamily: FontFamily.lexendDecaSemiBold,
        fontSize: FontSize.fs_24,
        lineHeight: 30,
        color: Color.main || '#98F291',
    },
    summaryLabel: {
        marginTop: 2,
        fontFamily: FontFamily.lexendDecaRegular,
        fontSize: FontSize.fs_12,
        color: '#CBD5E1',
        textAlign: 'center',
    },
    encouragementCard: {
        marginTop: 10,
        backgroundColor: '#FFF7ED',
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
