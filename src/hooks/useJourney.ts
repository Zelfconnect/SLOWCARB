import { addDays, format, isAfter, isBefore, isSameDay, startOfWeek } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useLocalStorage } from './useLocalStorage';
import { CHEAT_DAY_OPTIONS, CHEAT_DAY_TO_JS_DAY_INDEX } from '@/lib/cheatDay';
import type { DayStatus, Journey, WeightEntry, MealEntry, CheatDay } from '@/types';
import { getCurrentDayTip } from '@/data/journey';

const defaultJourney: Journey = {
  startDate: null,
  targetWeight: undefined,
  cheatDay: 'zaterdag',
};

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

  const getTodayMeals = (): MealEntry => {
    const today = new Date().toISOString().split('T')[0];
    return mealLog.find(entry => entry.date === today) || { date: today, breakfast: false, lunch: false, dinner: false };
  };

  const toggleMeal = (meal: 'breakfast' | 'lunch' | 'dinner') => {
    const today = new Date().toISOString().split('T')[0];
    setMealLog(prev => {
      const existing = prev.find(entry => entry.date === today);
      if (existing) {
        return prev.map(entry => 
          entry.date === today ? { ...entry, [meal]: !entry[meal] } : entry
        );
      }
      return [...prev, { date: today, breakfast: false, lunch: false, dinner: false, [meal]: true }];
    });
  };

  const logWeight = (weight: number, date?: string) => {
    const entryDate = date ?? new Date().toISOString().split('T')[0];

    setWeightLog(prev => {
      const withoutSameDay = prev.filter(entry => entry.date !== entryDate);
      return [...withoutSameDay, { date: entryDate, weight }].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });
  };

  const getStreak = () => {
    if (mealLog.length === 0) return 0;
    const sorted = [...mealLog].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const cheatDayNum = CHEAT_DAY_TO_JS_DAY_INDEX[journey.cheatDay];

    for (let i = 0; i < sorted.length; i++) {
      const entry = sorted[i];
      const allCompleted = entry.breakfast && entry.lunch && entry.dinner;
      if (!allCompleted) break;

      if (i === 0 && entry.date === today) streak++;
      else if (i === 0 && entry.date === yesterday) streak++;
      else if (i > 0 && entry.date === sorted[i - 1].date) continue;
      else if (i > 0) {
        const prevDate = new Date(sorted[i - 1].date);
        const currDate = new Date(entry.date);
        const diffDays = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          streak++;
        } else if (diffDays === 2) {
          const midDate = new Date(prevDate);
          midDate.setDate(midDate.getDate() - 1);
          if (midDate.getDay() === cheatDayNum) streak++;
          else break;
        } else {
          break;
        }
      }
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
    getTodayMeals,
    toggleMeal,
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
    const completed = isPast && loggedComplete;

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
