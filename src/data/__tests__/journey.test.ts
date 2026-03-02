import { describe, it, expect, vi, afterEach } from 'vitest';
import { getCurrentDayTip, getCurrentPhase, getDayTip, getWeekTip } from '../journey';

describe('getCurrentPhase', () => {
  it('returns a valid phase for every day from 1 through 84', () => {
    for (let day = 1; day <= 84; day++) {
      expect(getCurrentPhase(day)).toBeDefined();
    }
  });

  it('repeats the weekly phase cycle correctly', () => {
    expect(getCurrentPhase(1)?.title).toBe('De Laatste Maaltijd');
    expect(getCurrentPhase(7)?.title).toBe('Cheat Day!');
    expect(getCurrentPhase(8)?.title).toBe('De Laatste Maaltijd');
    expect(getCurrentPhase(84)?.title).toBe('Cheat Day!');
  });

  it('returns undefined for invalid day values', () => {
    expect(getCurrentPhase(0)).toBeUndefined();
    expect(getCurrentPhase(-1)).toBeUndefined();
    expect(getCurrentPhase(85)).toBeUndefined();
    expect(getCurrentPhase(1.5)).toBeUndefined();
  });
});

describe('getDayTip', () => {
  it('returns a tip for days 1 through 84', () => {
    for (let day = 1; day <= 84; day++) {
      expect(getDayTip(day)).toBeDefined();
      expect(getDayTip(day)?.day).toBe(day);
    }
  });

  it('returns undefined for days beyond 84', () => {
    expect(getDayTip(85)).toBeUndefined();
    expect(getDayTip(120)).toBeUndefined();
  });
});

describe('getWeekTip', () => {
  it('returns tips for weeks 1-12', () => {
    for (let week = 1; week <= 12; week++) {
      expect(getWeekTip(week)).toBeDefined();
    }
  });

  it('returns undefined for weeks beyond 12', () => {
    expect(getWeekTip(13)).toBeUndefined();
    expect(getWeekTip(20)).toBeUndefined();
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

  it('returns a defined tip for day 8+', () => {
    vi.setSystemTime(new Date('2024-01-09T12:00:00.000Z'));
    const result = getCurrentDayTip('2024-01-01');
    expect(result.day).toBe(9);
    expect(result.tip).toBeDefined();
    expect(result.tip?.title).toBe('De Overschakeling Begint');
  });

  it('returns correct day tip for day 3', () => {
    vi.setSystemTime(new Date('2024-01-03T12:00:00.000Z'));
    const result = getCurrentDayTip('2024-01-01');
    expect(result.day).toBe(3);
    expect(result.tip?.title).toBe('De Moeilijkste Dag');
  });
});
