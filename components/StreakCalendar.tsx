import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { Padding } from '../constants/GlobalStyles';
import SectionHeader from './SectionHeader';
import { MonthBlock } from './StreakComponent/MonthBlock';
import { CalendarDay, MonthSection, DayState } from './StreakComponent/types';
import { useUser } from '../contexts/UserContext';

// Hàm tiện ích format ngày thành YYYY-MM-DD theo giờ local
const formatDate = (y: number, m: number, d: number) => {
    return `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
};

const generateCurrentMonth = (activeDates: string[], createdAtStr?: string): MonthSection => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const currentDate = today.getDate();
    const daysInMonth = new Date(year, month, 0).getDate();

    let createdAtDate: Date | null = null;
    if (createdAtStr) {
        createdAtDate = new Date(createdAtStr);
        createdAtDate.setHours(0, 0, 0, 0);
    }

    // Hàm tính chính xác số streak tại một ngày cụ thể (bằng cách đếm ngược về quá khứ)
    const getStreakAtDay = (dateStr: string) => {
        if (!activeDates.includes(dateStr)) return 0;
        let streak = 1;
        const d = new Date(dateStr);
        while (true) {
            d.setDate(d.getDate() - 1);
            const prevStr = formatDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
            if (activeDates.includes(prevStr)) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    const days: CalendarDay[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
        let state: DayState = 'inactive';
        let fire = false;

        const isToday = d === currentDate;
        const isFuture = d > currentDate; // Vì đang tạo cho tháng hiện tại
        
        const currentIterDate = new Date(year, month - 1, d);
        const isBeforeCreation = createdAtDate ? currentIterDate < createdAtDate : false;
        const isPast = !isToday && !isFuture && !isBeforeCreation;

        const dateStr = formatDate(year, month, d);

        if (isFuture || isBeforeCreation) {
            state = 'inactive';
        } else if (isToday) {
            state = activeDates.includes(dateStr) ? 'completed' : 'today';
        } else if (isPast) {
            state = activeDates.includes(dateStr) ? 'completed' : 'missed';
        }

        if (state === 'completed') {
            const streakAtDay = getStreakAtDay(dateStr);
            if (streakAtDay > 0 && streakAtDay % 7 === 0) {
                fire = true;
            }
        }

        days.push({ id: dateStr, day: d.toString(), state, fire });
    }

    return { id: `${month}-${year}`, title: `Tháng ${month} ${year}`, month, year, days };
};

type StreakCalendarProps = {
  onHeaderPress?: () => void;
};

const StreakCalendar = ({ onHeaderPress }: StreakCalendarProps) => {
  const { stats, user } = useUser();
  
  const activeDates = stats?.gamification?.activeDates || [];
  
  const currentMonthSection = useMemo(
    () => generateCurrentMonth(activeDates, user?.createdAt), 
    [activeDates, user?.createdAt]
  );

  return (
    <View style={styles.wrapper}>
      <SectionHeader title="Chuỗi của bạn" />
      <TouchableOpacity activeOpacity={0.85} onPress={onHeaderPress} disabled={!onHeaderPress}>
        <MonthBlock section={currentMonthSection} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Padding.padding_15 || 15,
    marginBottom: 24,
  },
});

export default StreakCalendar;