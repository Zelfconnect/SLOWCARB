import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useJourney, getDaysUntilCheatDay, getWeekData } from '../useJourney';
import type { Journey } from '@/types';

// Fixed "today" used across date-sensitive tests: 2024-01-15 (Monday)
const FIXED_TODAY = new Date('2024-01-15T12:00:00.000Z');
const TODAY_STR = '2024-01-15';
const YESTERDAY_STR = '2024-01-14';
const TWO_DAYS_AGO_STR = '2024-01-13';

const completeDay = (date: string) => ({
  date,
  breakfast: true,
  lunch: true,
  dinner: true,
});

const partialDay = (date: string) => ({
  date,
  breakfast: true,
  lunch: false,
  dinner: false,
});

// ─── getDaysUntilCheatDay ─────────────────────────────────────────────────────

describe('getDaysUntilCheatDay', () => {
  afterEach(() => vi.useRealTimers());

  const makeJourney = (cheatDay: 'zaterdag' | 'zondag'): Journey => ({
    startDate: '2024-01-01',
    cheatDay,
    targetWeight: undefined,
  });

  it('returns 5 when today is Monday and cheat day is Saturday', () => {
    // 2024-01-08 is a Monday
    vi.setSystemTime(new Date('2024-01-08T12:00:00.000Z'));
    expect(getDaysUntilCheatDay(makeJourney('zaterdag'))).toBe(5);
  });

  it('returns 1 when today is Friday and cheat day is Saturday', () => {
    // 2024-01-12 is a Friday
    vi.setSystemTime(new Date('2024-01-12T12:00:00.000Z'));
    expect(getDaysUntilCheatDay(makeJourney('zaterdag'))).toBe(1);
  });

  it('returns 6 when today is Monday and cheat day is Sunday', () => {
    vi.setSystemTime(new Date('2024-01-08T12:00:00.000Z'));
    expect(getDaysUntilCheatDay(makeJourney('zondag'))).toBe(6);
  });

  it('returns 1 when today is Saturday and cheat day is Sunday', () => {
    vi.setSystemTime(new Date('2024-01-13T12:00:00.000Z'));
    expect(getDaysUntilCheatDay(makeJourney('zondag'))).toBe(1);
  });

  it('returns 0 when today is Saturday and cheat day is Saturday', () => {
    vi.setSystemTime(new Date('2024-01-13T12:00:00.000Z'));
    expect(getDaysUntilCheatDay(makeJourney('zaterdag'))).toBe(0);
  });
});

// ─── getWeekData ──────────────────────────────────────────────────────────────

describe('getWeekData', () => {
  // FIXED_TODAY = 2024-01-15 (Monday).
  // With weekStartsOn: 1 (Monday), the current week spans 2024-01-15 → 2024-01-21.
  //   Saturday in this week: 2024-01-20
  //   A "past" day in this week (day before today is not in this week since today is Monday):
  //     use Tuesday 2024-01-16 for meal-log tests that need a within-week past date.
  const WEEK_SAT_STR = '2024-01-20';
  const WEEK_TUE_STR = '2024-01-16'; // a within-week day we can seed meal entries for

  beforeEach(() => vi.setSystemTime(FIXED_TODAY));
  afterEach(() => vi.useRealTimers());

  const baseJourney: Journey = {
    startDate: '2024-01-01',
    cheatDay: 'zaterdag',
    targetWeight: undefined,
  };

  it('returns exactly 7 DayStatus entries', () => {
    const data = getWeekData(baseJourney, []);
    expect(data).toHaveLength(7);
  });

  it('marks exactly one day as isToday', () => {
    const data = getWeekData(baseJourney, []);
    const todayEntries = data.filter((d) => d.isToday);
    expect(todayEntries).toHaveLength(1);
    expect(todayEntries[0].date).toBe(TODAY_STR);
  });

  it('marks Saturday as cheat day when cheatDay = zaterdag', () => {
    const data = getWeekData(baseJourney, []);
    // Saturday in the week of 2024-01-15 is 2024-01-20
    const saturday = data.find((d) => d.date === WEEK_SAT_STR);
    expect(saturday?.isCheatDay).toBe(true);
  });

  it('does not mark non-Saturday days as cheat days', () => {
    const data = getWeekData(baseJourney, []);
    const nonSaturdays = data.filter((d) => d.date !== WEEK_SAT_STR);
    for (const day of nonSaturdays) {
      expect(day.isCheatDay).toBe(false);
    }
  });

  it('marks future days as isFuture', () => {
    const data = getWeekData(baseJourney, []);
    // Days after today (Jan 15 = Monday) within the week should be isFuture
    const futureDays = data.filter((d) => d.date > TODAY_STR);
    for (const day of futureDays) {
      expect(day.isFuture).toBe(true);
    }
  });

  it('does not mark past days as isFuture', () => {
    const data = getWeekData(baseJourney, []);
    // Since today is Monday, there are no past days in the current week.
    // All non-today days in the week are future — verify no past day exists.
    const pastDays = data.filter((d) => d.date < TODAY_STR);
    expect(pastDays).toHaveLength(0);
  });

  it('marks a within-week day as completed when all three meals are logged', () => {
    // Use Tuesday (2024-01-16), which is in the current week
    const mealEntries = [completeDay(WEEK_TUE_STR)];
    const data = getWeekData(baseJourney, mealEntries);
    const tuesday = data.find((d) => d.date === WEEK_TUE_STR);
    expect(tuesday?.completed).toBe(true);
  });

  it('does not mark a within-week day as completed when meals are partial', () => {
    const mealEntries = [partialDay(WEEK_TUE_STR)];
    const data = getWeekData(baseJourney, mealEntries);
    const tuesday = data.find((d) => d.date === WEEK_TUE_STR);
    expect(tuesday?.completed).toBe(false);
  });

  it('all entries have a label string', () => {
    const data = getWeekData(baseJourney, []);
    for (const entry of data) {
      expect(typeof entry.label).toBe('string');
      expect(entry.label.length).toBeGreaterThan(0);
    }
  });
});

// ─── getStreak ────────────────────────────────────────────────────────────────

describe('getStreak', () => {
  beforeEach(() => {
    vi.setSystemTime(FIXED_TODAY);
  });
  afterEach(() => vi.useRealTimers());

  const seedMealLog = (entries: object[]) => {
    window.localStorage.setItem('slowcarb-meal-log', JSON.stringify(entries));
  };

  it('returns 0 when the meal log is empty', () => {
    const { result } = renderHook(() => useJourney());
    expect(result.current.getStreak()).toBe(0);
  });

  it('returns 1 when only today is fully completed', () => {
    seedMealLog([completeDay(TODAY_STR)]);
    const { result } = renderHook(() => useJourney());
    expect(result.current.getStreak()).toBe(1);
  });

  it('returns 1 when only yesterday is fully completed', () => {
    seedMealLog([completeDay(YESTERDAY_STR)]);
    const { result } = renderHook(() => useJourney());
    expect(result.current.getStreak()).toBe(1);
  });

  it('returns 2 when both today and yesterday are fully completed', () => {
    seedMealLog([completeDay(TODAY_STR), completeDay(YESTERDAY_STR)]);
    const { result } = renderHook(() => useJourney());
    expect(result.current.getStreak()).toBe(2);
  });

  it('returns 3 for three consecutive days ending today', () => {
    seedMealLog([
      completeDay(TODAY_STR),
      completeDay(YESTERDAY_STR),
      completeDay(TWO_DAYS_AGO_STR),
    ]);
    const { result } = renderHook(() => useJourney());
    expect(result.current.getStreak()).toBe(3);
  });

  it('breaks streak when there is a gap', () => {
    // today + two days ago, but NOT yesterday → gap breaks at yesterday
    seedMealLog([completeDay(TODAY_STR), completeDay(TWO_DAYS_AGO_STR)]);
    const { result } = renderHook(() => useJourney());
    expect(result.current.getStreak()).toBe(1);
  });

  it('returns 0 when today is only partially completed', () => {
    seedMealLog([partialDay(TODAY_STR)]);
    const { result } = renderHook(() => useJourney());
    expect(result.current.getStreak()).toBe(0);
  });

  it('returns 0 when the most recent completed entry is older than yesterday', () => {
    seedMealLog([completeDay(TWO_DAYS_AGO_STR)]);
    const { result } = renderHook(() => useJourney());
    expect(result.current.getStreak()).toBe(0);
  });
});

// ─── getProgress ──────────────────────────────────────────────────────────────

describe('getProgress', () => {
  afterEach(() => vi.useRealTimers());

  const seedJourney = (startDate: string) => {
    window.localStorage.setItem(
      'slowcarb-journey',
      JSON.stringify({ startDate, cheatDay: 'zaterdag', targetWeight: undefined }),
    );
  };

  it('returns zero progress when no journey is started', () => {
    const { result } = renderHook(() => useJourney());
    const progress = result.current.getProgress();
    expect(progress.day).toBe(0);
    expect(progress.percentage).toBe(0);
  });

  it('returns day 1 on the start date', () => {
    vi.setSystemTime(new Date('2024-01-01T12:00:00.000Z'));
    seedJourney('2024-01-01');
    const { result } = renderHook(() => useJourney());
    expect(result.current.getProgress().day).toBe(1);
  });

  it('returns day 42 at the halfway point of the 84-day journey', () => {
    vi.setSystemTime(new Date('2024-02-11T12:00:00.000Z')); // 41 days after Jan 1
    seedJourney('2024-01-01');
    const { result } = renderHook(() => useJourney());
    expect(result.current.getProgress().day).toBe(42);
  });

  it('caps day at 84 when the journey is complete', () => {
    vi.setSystemTime(new Date('2024-04-01T12:00:00.000Z')); // well past 84 days
    seedJourney('2024-01-01');
    const { result } = renderHook(() => useJourney());
    const { day, percentage } = result.current.getProgress();
    expect(day).toBe(84);
    expect(percentage).toBe(100);
  });

  it('sets totalDays to 84', () => {
    vi.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
    seedJourney('2024-01-01');
    const { result } = renderHook(() => useJourney());
    expect(result.current.getProgress().totalDays).toBe(84);
  });
});

// ─── toggleMeal + getTodayMeals ───────────────────────────────────────────────

describe('toggleMeal', () => {
  beforeEach(() => vi.setSystemTime(FIXED_TODAY));
  afterEach(() => vi.useRealTimers());

  it('adds a breakfast entry for today when none exists', () => {
    const { result } = renderHook(() => useJourney());

    act(() => {
      result.current.toggleMeal('breakfast');
    });

    expect(result.current.getTodayMeals().breakfast).toBe(true);
    expect(result.current.getTodayMeals().lunch).toBe(false);
    expect(result.current.getTodayMeals().dinner).toBe(false);
  });

  it('toggles a meal back to false on a second call', () => {
    const { result } = renderHook(() => useJourney());

    act(() => result.current.toggleMeal('lunch'));
    expect(result.current.getTodayMeals().lunch).toBe(true);

    act(() => result.current.toggleMeal('lunch'));
    expect(result.current.getTodayMeals().lunch).toBe(false);
  });
});
