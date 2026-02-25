import { describe, it, expect, vi, afterEach } from 'vitest';
import { getCurrentDayTip, getDayTip, getWeekTip } from '../journey';

describe('getDayTip', () => {
  it('returns a tip for days 1 through 7', () => {
    for (let day = 1; day <= 7; day++) {
      expect(getDayTip(day)).toBeDefined();
      expect(getDayTip(day)?.day).toBe(day);
    }
  });

  it('returns undefined for days beyond 7', () => {
    expect(getDayTip(8)).toBeUndefined();
    expect(getDayTip(42)).toBeUndefined();
    expect(getDayTip(84)).toBeUndefined();
  });
});

describe('getWeekTip', () => {
  it('returns tips for weeks 1-3', () => {
    expect(getWeekTip(1)).toBeDefined();
    expect(getWeekTip(2)).toBeDefined();
    expect(getWeekTip(3)).toBeDefined();
  });

  it('returns undefined for weeks beyond 3', () => {
    expect(getWeekTip(4)).toBeUndefined();
    expect(getWeekTip(12)).toBeUndefined();
  });
});

describe('getCurrentDayTip', () => {
  afterEach(() => vi.useRealTimers());

  it('returns day 0 with undefined tips when no start date', () => {
    const result = getCurrentDayTip(null);
    expect(result.day).toBe(0);
    expect(result.tip).toBeUndefined();
    expect(result.weekTip).toBeUndefined();
  });

  it('returns undefined tip for day 8+ (no misleading cheat-day fallback)', () => {
    vi.setSystemTime(new Date('2024-01-09T12:00:00.000Z'));
    const result = getCurrentDayTip('2024-01-01');
    expect(result.day).toBe(9);
    expect(result.tip).toBeUndefined();
  });

  it('returns correct day tip for day 3', () => {
    vi.setSystemTime(new Date('2024-01-03T12:00:00.000Z'));
    const result = getCurrentDayTip('2024-01-01');
    expect(result.day).toBe(3);
    expect(result.tip?.title).toBe('De Moeilijkste Dag');
  });
});
