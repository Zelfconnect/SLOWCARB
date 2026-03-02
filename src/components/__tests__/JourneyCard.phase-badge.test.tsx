import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { JourneyCard } from '@/components/JourneyCard';
import type { MealEntry } from '@/types';

function createProps(overrides: Partial<React.ComponentProps<typeof JourneyCard>> = {}) {
  const defaultProps: React.ComponentProps<typeof JourneyCard> = {
    journey: { startDate: '2026-02-01', cheatDay: 'zaterdag' },
    progress: { day: 2, week: 1, totalDays: 84, percentage: 2.4 },
    currentTip: null,
    isCheatDay: false,
    onStartJourney: vi.fn(),
    onResetJourney: vi.fn(),
    todayMeals: { date: '2026-02-02', breakfast: false, lunch: false, dinner: false } satisfies MealEntry,
    streak: 0,
    onToggleMeal: vi.fn(),
  };

  return { ...defaultProps, ...overrides };
}

describe('JourneyCard phase badge', () => {
  it('shows the current phase badge on an active journey', () => {
    render(<JourneyCard {...createProps()} />);

    expect(screen.getByTestId('journey-phase-badge')).toHaveTextContent('Fase: De Overschakeling Begint');
  });

  it('does not show a phase badge before journey start', () => {
    render(<JourneyCard {...createProps({ journey: { startDate: null, cheatDay: 'zaterdag' } })} />);

    expect(screen.queryByTestId('journey-phase-badge')).not.toBeInTheDocument();
  });
});
