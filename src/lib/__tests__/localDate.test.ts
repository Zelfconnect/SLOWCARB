import { describe, it, expect, vi, afterEach } from 'vitest';
import { getLocalDateString, getYesterdayDateString } from '../localDate';

describe('getLocalDateString', () => {
  afterEach(() => vi.useRealTimers());

  it('returns date in yyyy-MM-dd format', () => {
    const result = getLocalDateString(new Date(2024, 0, 15, 12, 0, 0));
    expect(result).toBe('2024-01-15');
  });

  it('pads single-digit months and days', () => {
    const result = getLocalDateString(new Date(2024, 2, 5, 10, 0, 0));
    expect(result).toBe('2024-03-05');
  });

  it('always returns the local calendar date of the given Date object', () => {
    const date = new Date(2024, 0, 16, 0, 30, 0);
    const result = getLocalDateString(date);
    expect(result).toBe('2024-01-16');
    expect(date.getDate()).toBe(16);
  });

  it('returns current date when no argument provided', () => {
    vi.setSystemTime(new Date(2024, 5, 20, 15, 30, 0));
    expect(getLocalDateString()).toBe('2024-06-20');
  });
});

describe('getYesterdayDateString', () => {
  afterEach(() => vi.useRealTimers());

  it('returns the day before today', () => {
    vi.setSystemTime(new Date(2024, 0, 15, 12, 0, 0));
    expect(getYesterdayDateString()).toBe('2024-01-14');
  });

  it('handles month boundary correctly', () => {
    vi.setSystemTime(new Date(2024, 1, 1, 12, 0, 0));
    expect(getYesterdayDateString()).toBe('2024-01-31');
  });

  it('handles year boundary correctly', () => {
    vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0));
    expect(getYesterdayDateString()).toBe('2023-12-31');
  });
});
