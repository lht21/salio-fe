export type DayState = 'inactive' | 'completed' | 'missed' | 'today';

export type CalendarDay = {
    id: string;
    day: string;
    state: DayState;
    fire?: boolean;
};

export type MonthSection = {
    id: string;
    title: string;
    month: number;
    year: number;
    days: CalendarDay[];
};