import { addDays, format, isAfter, isBefore, isSameDay, startOfWeek } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useLocalStorage } from './useLocalStorage';
import { CHEAT_DAY_OPTIONS, CHEAT_DAY_TO_JS_DAY_INDEX } from '@/lib/cheatDay';
import { getLocalDateString } from '@/lib/localDate';
import type { DayStatus, Journey, WeightEntry, MealEntry, CheatDay } from '@/types';
import { getCurrentDayTip } from '@/data/journey';

const defaultJourney: Journey = {
  startDate: null,
  targetWeight: undefined,
  cheatDay: 'zaterdag',
};

const EMPTY_MEAL_FLAGS = { breakfast: false, lunch: false, dinner: false } as const;
type MealType = keyof typeof EMPTY_MEAL_FLAGS;

const parseLocalDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

const getMealEntryByDate = (mealLog: MealEntry[], date: string): MealEntry =>
  mealLog.find((entry) => entry.date === date) ?? { date, ...EMPTY_MEAL_FLAGS };

const isMealEntryCompliant = (entry?: MealEntry) =>
  Boolean(entry?.breakfast && entry.lunch && entry.dinner);

export function useJourney() {
  const [journey, setJourney] = useLocalStorage<Journey>('slowcarb-journey', defaultJourney);
  const [weightLog, setWeightLog] = useLocalStorage<WeightEntry[]>('slowcarb-weight-log', []);
  const [mealLog, setMealLog] = useLocalStorage<MealEntry[]>('slowcarb-meal-log', []);

  const startJourney = (startDate: string, cheatDay: CheatDay, targetWeight?: number) => {
    setJourney({ startDate, cheatDay, targetWeight });
  };

  const resetJourney = () => {
    setJourney(defaultJourney);
    setWeightLog([]);
    setMealLog([]);
  };

  const getMealsForDate = (date: string): MealEntry => getMealEntryByDate(mealLog, date);

  const getTodayMeals = (): MealEntry => {
    const today = getLocalDateString();
    return getMealsForDate(today);
  };

  const toggleMealForDate = (date: string, meal: MealType) => {
    setMealLog(prev => {
      const existing = prev.find(entry => entry.date === date);
      if (existing) {
        return prev.map(entry => 
          entry.date === date ? { ...entry, [meal]: !entry[meal] } : entry
        );
      }
      return [...prev, { date, ...EMPTY_MEAL_FLAGS, [meal]: true }];
    });
  };

  const toggleMeal = (meal: MealType) => {
    toggleMealForDate(getLocalDateString(), meal);
  };

  const markDayCompliant = (date: string) => {
    setMealLog(prev => {
      const existing = prev.find(entry => entry.date === date);
      if (existing) {
        return prev.map(entry =>
          entry.date === date ? { ...entry, breakfast: true, lunch: true, dinner: true } : entry
        );
      }

      return [...prev, { date, breakfast: true, lunch: true, dinner: true }];
    });
  };

  const logWeight = (weight: number, date?: string) => {
    const entryDate = date ?? getLocalDateString();

    setWeightLog(prev => {
      const withoutSameDay = prev.filter(entry => entry.date !== entryDate);
      return [...withoutSameDay, { date: entryDate, weight }].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });
  };

  const getStreak = () => {
    if (mealLog.length === 0) return 0;

    const today = getLocalDateString();
    const cheatDayNum = CHEAT_DAY_TO_JS_DAY_INDEX[journey.cheatDay];
    const startDate = parseLocalDate(journey.startDate ?? '1970-01-01');
    const mealLogMap = new Map(mealLog.map((entry) => [entry.date, entry]));
    let streak = 0;
    let skippedToday = false;
    let cursor = parseLocalDate(today);

    while (cursor.getTime() >= startDate.getTime()) {
      if (cursor.getDay() === cheatDayNum) {
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }

      const cursorDate = getLocalDateString(cursor);
      const allCompleted = isMealEntryCompliant(mealLogMap.get(cursorDate));
      if (allCompleted) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }

      // Missing/incomplete today should not kill an existing streak yet.
      if (!skippedToday && cursorDate === today) {
        skippedToday = true;
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }

      break;
    }

    return streak;
  };

  const getCurrentTip = () => getCurrentDayTip(journey.startDate);

  const getProgress = () => {
    if (!journey.startDate) return { day: 0, week: 0, totalDays: 84, percentage: 0 };
    
    const start = new Date(journey.startDate);
    const now = new Date();
    const diffTime = now.getTime() - start.getTime();
    const day = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const week = Math.ceil(day / 7);
    const totalDays = 84;
    const percentage = Math.min((day / totalDays) * 100, 100);
    
    return { day: Math.min(day, totalDays), week, totalDays, percentage };
  };

  const isCheatDay = () => {
    if (!journey.startDate) return false;
    const today = new Date().getDay();
    const cheatDayNum = CHEAT_DAY_TO_JS_DAY_INDEX[journey.cheatDay];
    return today === cheatDayNum;
  };

  return {
    journey,
    weightLog,
    mealLog,
    startJourney,
    resetJourney,
    getCurrentTip,
    getProgress,
    isCheatDay,
    getMealsForDate,
    getTodayMeals,
    toggleMealForDate,
    toggleMeal,
    markDayCompliant,
    logWeight,
    getStreak,
  };
}

export function getWeekData(journey: Journey, mealEntries: MealEntry[]): DayStatus[] {
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  const startDate = journey.startDate ? new Date(journey.startDate) : null;

  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekStart, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayLabel = format(date, 'EEEEEE', { locale: nl });

    const dayName = format(date, 'EEEE', { locale: nl }).toLowerCase();
    const isCheatDay = !startDate || !isBefore(date, startDate) ? dayName === journey.cheatDay : false;
    const isToday = isSameDay(date, today);
    const isFuture = isAfter(date, today) || (startDate ? isBefore(date, startDate) : false);
    const isPast = !isToday && isBefore(date, today) && !(startDate ? isBefore(date, startDate) : false);

    const mealEntry = mealEntries.find(entry => entry.date === dateStr);
    const loggedComplete = mealEntry ? mealEntry.breakfast && mealEntry.lunch && mealEntry.dinner : false;
    const completed = (isPast || isToday) && loggedComplete;

    return {
      label: dayLabel,
      date: dateStr,
      completed,
      isCheatDay,
      isToday,
      isFuture,
    };
  });
}

export function getDaysUntilCheatDay(journey: Journey): number {
  const today = new Date();
  const currentDay = format(today, 'EEEE', { locale: nl }).toLowerCase() as CheatDay;

  const daysOfWeek = CHEAT_DAY_OPTIONS;
  const currentIndex = daysOfWeek.indexOf(currentDay);
  const cheatIndex = daysOfWeek.indexOf(journey.cheatDay);

  let diff = cheatIndex - currentIndex;
  if (diff < 0) diff += 7;

  return diff;
}
