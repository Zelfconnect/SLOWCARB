import { describe, expect, it } from 'vitest';
import { scaleAmount } from '@/lib/scaleAmount';

describe('scaleAmount', () => {
  it.each([
    ['1/2', 2, '1'],
    ['1/2', 4, '2'],
    ['1/2', 3, '1 1/2'],
    ['1', 2, '2'],
    ['150', 2, '300'],
    ['1/4', 4, '1'],
  ])('scales "%s" with multiplier %d to "%s"', (amount, multiplier, expected) => {
    expect(scaleAmount(amount, multiplier)).toBe(expected);
  });
});
