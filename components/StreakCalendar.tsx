import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CaretLeftIcon, CaretRightIcon, FireIcon } from 'phosphor-react-native';
import { Color, FontFamily, Border, Padding, FontSize, Gap } from '../constants/GlobalStyles';

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

const WEEKDAYS = ['t2', 't3', 't4', 't5', 't6', 't7', 'cn'];

const StreakCalendar = () => {
  const renderDay = (item: any) => {
    if (item.status === 'empty') return <View key={item.id} style={styles.dayCell} />;

    let circleStyle: any = styles.circleInactive;
    let textStyle: any = styles.textInactive;

    if (item.status === 'completed') {
      circleStyle = styles.circleCompleted;
      textStyle = styles.textWhite;
    } else if (item.status === 'missed') {
      circleStyle = styles.circleMissed;
      textStyle = styles.textWhite;
    } else if (item.status === 'today') {
      circleStyle = styles.circleToday;
      textStyle = styles.textToday;
    }

    return (
      <View key={item.id} style={styles.dayCell}>
        <View style={[styles.dayCircle, circleStyle]}>
          <Text style={[styles.dayText, textStyle]}>{item.day}</Text>
        </View>
        {item.fire && (
          <View style={styles.fireIcon}>
            <FireIcon size={12} color="#EA580C" weight="fill" />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Chuỗi của bạn</Text>
      <View style={styles.container}>
        
        {/* Header Calendar */}
        <View style={styles.header}>
          <CaretLeftIcon size={24} color={Color.bg} weight="bold" />
          <Text style={styles.headerText}>Tháng 2 2026</Text>
          <CaretRightIcon size={24} color={Color.bg} weight="bold" />
        </View>

        {/* Lưới ngày */}
        <View style={styles.grid}>
          {/* Weekdays */}
          <View style={styles.row}>
            {WEEKDAYS.map(day => (
              <View key={day} style={styles.dayCell}>
                <Text style={styles.weekdayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Days */}
          <View style={styles.daysWrap}>
            {CALENDAR_DATA.map(renderDay)}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Padding.padding_15 || 15,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FontFamily.lexendDecaRegular,
    fontSize: FontSize.fs_12 || 12,
    color: Color.gray,
    marginBottom: Gap.gap_10 || 10,
  },
  container: {
    borderWidth: 2,
    borderColor: Color.color || '#0C5F35',
    borderRadius: Border.br_20 || 20,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: Color.color || '#0C5F35',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_14 || 14,
    color: Color.bg,
  },
  grid: {
    backgroundColor: Color.bg,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: Gap.gap_10 || 10,
  },
  daysWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  weekdayText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 12,
    color: Color.gray,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: 12,
  },
  circleInactive: { backgroundColor: '#E2E8F0' },
  textInactive: { color: '#64748B' },
  circleCompleted: { backgroundColor: '#4A9F00' }, // Green
  textWhite: { color: '#FFFFFF' },
  circleMissed: { backgroundColor: '#EA580C' }, // Red/Orange
  circleToday: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#4A9F00' },
  textToday: { color: '#4A9F00' },
  fireIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 1,
  }
});

export default StreakCalendar;