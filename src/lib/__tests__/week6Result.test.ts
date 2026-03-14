import { describe, expect, it } from 'vitest';
import { countCompletedDailyCheckins, shouldShowWeek6ResultCard } from '@/lib/week6Result';
import type { MealEntry } from '@/types';

function meal(overrides: Partial<MealEntry> = {}): MealEntry {
  return {
    date: '2026-01-01',
    breakfast: false,
    lunch: false,
    dinner: false,
    ...overrides,
  };
}

describe('week6Result', () => {
  it('counts only fully completed daily check-ins', () => {
    const entries = [
      meal({ breakfast: true, lunch: true, dinner: true }),
      meal({ date: '2026-01-02', breakfast: true, lunch: true, dinner: false }),
      meal({ date: '2026-01-03', breakfast: true, lunch: true, dinner: true }),
    ];

    expect(countCompletedDailyCheckins(entries)).toBe(2);
  });

  it('requires week 6 and enough completed check-ins', () => {
    expect(shouldShowWeek6ResultCard(5, 30)).toBe(false);
    expect(shouldShowWeek6ResultCard(6, 29)).toBe(false);
    expect(shouldShowWeek6ResultCard(6, 30)).toBe(true);
    expect(shouldShowWeek6ResultCard(7, 40)).toBe(true);
  });
});
