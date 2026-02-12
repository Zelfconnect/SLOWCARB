import { useLocalStorage } from './useLocalStorage';
import type { Journey, WeightEntry, MealEntry } from '@/types';
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

  const startJourney = (startDate: string, cheatDay: 'zaterdag' | 'zondag', targetWeight?: number) => {
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

  const getStreak = () => {
    if (mealLog.length === 0) return 0;
    const sorted = [...mealLog].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    for (let i = 0; i < sorted.length; i++) {
      const entry = sorted[i];
      const allCompleted = entry.breakfast && entry.lunch && entry.dinner;
      if (!allCompleted) break;
      
      if (i === 0 && entry.date === today) streak++;
      else if (i === 0 && entry.date === yesterday) streak++;
      else if (i > 0 && entry.date === sorted[i-1].date) continue;
      else if (i > 0) {
        const prevDate = new Date(sorted[i-1].date);
        const currDate = new Date(entry.date);
        const diffDays = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) streak++;
        else break;
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
    const cheatDayNum = journey.cheatDay === 'zaterdag' ? 6 : 0;
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
    getStreak,
  };
}
