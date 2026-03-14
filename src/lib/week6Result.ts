import type { MealEntry } from '@/types';

export const WEEK_6_MIN_WEEK = 6;
export const WEEK_6_MIN_CHECKINS = 30;

export function countCompletedDailyCheckins(mealEntries: MealEntry[]): number {
  return mealEntries.filter((entry) => entry.breakfast && entry.lunch && entry.dinner).length;
}

export function shouldShowWeek6ResultCard(week: number, completedCheckins: number): boolean {
  return week >= WEEK_6_MIN_WEEK && completedCheckins >= WEEK_6_MIN_CHECKINS;
}
