import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WeeklyProgressGrid } from '@/components/WeeklyProgressGrid';
import type { DayStatus } from '@/types';

function makeDay(overrides: Partial<DayStatus>): DayStatus {
  return {
    label: 'ma',
    date: '2024-01-15',
    completed: false,
    isCheatDay: false,
    isToday: false,
    isFuture: false,
    ...overrides,
  };
}

describe('WeeklyProgressGrid', () => {
  it('renders completed past days as green', () => {
    render(<WeeklyProgressGrid weekData={[makeDay({ completed: true })]} />);
    expect(screen.getByTestId('week-pill-ma').className).toContain('bg-emerald-500');
  });

  it('renders future days as gray', () => {
    render(<WeeklyProgressGrid weekData={[makeDay({ label: 'di', isFuture: true })]} />);
    expect(screen.getByTestId('week-pill-di').className).toContain('bg-stone-100');
  });

  it('renders today with a dedicated indicator', () => {
    render(<WeeklyProgressGrid weekData={[makeDay({ label: 'wo', isToday: true })]} />);
    const pill = screen.getByTestId('week-pill-wo');
    expect(pill.className).toContain('ring-emerald-500');
    expect(pill.querySelector('span.absolute')).toBeInTheDocument();
  });
});
