import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Padding } from '../constants/GlobalStyles';
import SectionHeader from './SectionHeader';
import { MonthBlock } from './StreakComponent/MonthBlock';
import { CalendarDay, MonthSection, DayState } from './StreakComponent/types';

// Mock data tháng 2/2026 theo ảnh
const CALENDAR_DATA = [
  { id: 'e1', day: '', status: 'empty' },
  { id: 'e2', day: '', status: 'empty' },
  { id: 'e3', day: '', status: 'empty' },
  { id: 'e4', day: '', status: 'empty' },
  { id: 'e5', day: '', status: 'empty' },
  { id: 'e6', day: '', status: 'empty' },
  { id: '1', day: '1', status: 'inactive' },

  { id: '2', day: '2', status: 'completed' },
  { id: '3', day: '3', status: 'completed' },
  { id: '4', day: '4', status: 'completed', fire: true },
  { id: '5', day: '5', status: 'completed', fire: true },
  { id: '6', day: '6', status: 'completed', fire: true },
  { id: '7', day: '7', status: 'completed', fire: true },
  { id: '8', day: '8', status: 'missed' },

  { id: '9', day: '9', status: 'missed' },
  { id: '10', day: '10', status: 'completed' },
  { id: '11', day: '11', status: 'completed' },
  { id: '12', day: '12', status: 'completed', fire: true },
  { id: '13', day: '13', status: 'completed', fire: true },
  { id: '14', day: '14', status: 'missed' },
  { id: '15', day: '15', status: 'completed' },

  { id: '16', day: '16', status: 'today' },
  { id: '17', day: '17', status: 'inactive' },
  { id: '18', day: '18', status: 'inactive' },
  { id: '19', day: '19', status: 'inactive' },
  { id: '20', day: '20', status: 'inactive' },
  { id: '21', day: '21', status: 'inactive' },
  { id: '22', day: '22', status: 'inactive' },
];

type StreakCalendarProps = {
  onHeaderPress?: () => void;
};

// Chuyển đổi dữ liệu cũ sang cấu trúc chuẩn của MonthBlock
const mockDays: CalendarDay[] = CALENDAR_DATA
  .filter(item => item.status !== 'empty')
  .map(item => ({
    id: item.id,
    day: item.day,
    state: item.status as DayState,
    fire: item.fire
  }));

const mockSection: MonthSection = {
  id: 'feb-2026',
  title: 'Tháng 2 2026',
  month: 2,
  year: 2026,
  days: mockDays,
};

const StreakCalendar = ({ onHeaderPress }: StreakCalendarProps) => {
  return (
    <View style={styles.wrapper}>
      <SectionHeader title="Chuỗi của bạn" />
      <TouchableOpacity activeOpacity={0.85} onPress={onHeaderPress} disabled={!onHeaderPress}>
        <MonthBlock section={mockSection} />
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