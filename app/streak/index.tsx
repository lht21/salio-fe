import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, FireIcon } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Border, Color, FontFamily, FontSize, Gap, Padding } from '../../constants/GlobalStyles';

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
  days: CalendarDay[];
};

const WEEKDAYS = ['t2', 't3', 't4', 't5', 't6', 't7', 'cn'];

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

const APR_DAYS: CalendarDay[] = [
  { id: 'apr-1', day: '1', state: 'inactive' },
  { id: 'apr-2', day: '2', state: 'inactive' },
  { id: 'apr-3', day: '3', state: 'inactive' },
  { id: 'apr-4', day: '4', state: 'inactive' },
  { id: 'apr-5', day: '5', state: 'inactive' },
  { id: 'apr-6', day: '6', state: 'inactive' },
  { id: 'apr-7', day: '7', state: 'inactive' },
  { id: 'apr-8', day: '8', state: 'inactive' },
  { id: 'apr-9', day: '9', state: 'inactive' },
  { id: 'apr-10', day: '10', state: 'inactive' },
  { id: 'apr-11', day: '11', state: 'inactive' },
  { id: 'apr-12', day: '12', state: 'inactive' },
  { id: 'apr-13', day: '13', state: 'inactive' },
  { id: 'apr-14', day: '14', state: 'inactive' },
  { id: 'apr-15', day: '15', state: 'inactive' },
  { id: 'apr-16', day: '16', state: 'inactive' },
  { id: 'apr-17', day: '17', state: 'inactive' },
  { id: 'apr-18', day: '18', state: 'inactive' },
  { id: 'apr-19', day: '19', state: 'inactive' },
  { id: 'apr-20', day: '20', state: 'inactive' },
  { id: 'apr-21', day: '21', state: 'inactive' },
  { id: 'apr-22', day: '22', state: 'inactive' },
];

const MONTH_SECTIONS: MonthSection[] = [
  { id: 'feb-2026', title: 'Tháng 2 2026', days: FEB_DAYS },
  { id: 'mar-2026', title: 'Tháng 3 2026', days: MARCH_DAYS },
  { id: 'apr-2026', title: 'Tháng 3 2026', days: APR_DAYS },
];

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

const MonthBlock = ({ section }: { section: MonthSection }) => {
  const fillerCells = [
    { id: section.id + '-empty-1' },
    { id: section.id + '-empty-2' },
    { id: section.id + '-empty-3' },
    { id: section.id + '-empty-4' },
    { id: section.id + '-empty-5' },
    { id: section.id + '-empty-6' },
  ];

  return (
    <View style={styles.monthBlock}>
      <Text style={styles.monthTitle}>{section.title}</Text>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((day) => (
          <View key={section.id + '-' + day} style={styles.dayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysWrap}>
        {fillerCells.map((item) => (
          <View key={item.id} style={styles.dayCell} />
        ))}
        {section.days.map((item) => (
          <DayDot key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
};

export default function StreakScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon size={24} color={Color.gray} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chuỗi học tập</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryRow}>
          {SUMMARY_CARDS.map((card) => (
            <View key={card.id} style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{card.value}</Text>
              <Text style={styles.summaryLabel}>{card.label}</Text>
            </View>
          ))}
        </View>

        {MONTH_SECTIONS.map((section) => (
          <MonthBlock key={section.id} section={section} />
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
    paddingTop: 14,
    paddingBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 22,
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
    marginBottom: 28,
  },
  monthTitle: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_16,
    color: Color.text,
    marginBottom: 12,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekdayText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12,
    color: Color.gray,
  },
  daysWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontFamily: FontFamily.lexendDecaSemiBold,
    fontSize: FontSize.fs_12,
  },
  circleInactive: {
    backgroundColor: '#CBD5E1',
  },
  dayTextInactive: {
    color: '#667085',
  },
  circleCompleted: {
    backgroundColor: '#4A9F00',
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
    right: 4,
    backgroundColor: Color.bg,
    borderRadius: 9,
    padding: 1,
  },
});
