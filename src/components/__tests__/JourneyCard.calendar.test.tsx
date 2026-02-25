import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { JourneyCard } from '@/components/JourneyCard';
import type { CheatDay, MealEntry } from '@/types';

function createProps(overrides: Partial<React.ComponentProps<typeof JourneyCard>> = {}) {
  const defaultProps: React.ComponentProps<typeof JourneyCard> = {
    journey: { startDate: null, cheatDay: 'zaterdag' },
    progress: { day: 0, week: 0, totalDays: 84, percentage: 0 },
    currentTip: null,
    isCheatDay: false,
    onStartJourney: vi.fn(),
    onResetJourney: vi.fn(),
    todayMeals: { date: '2026-02-25', breakfast: false, lunch: false, dinner: false } satisfies MealEntry,
    streak: 0,
    onToggleMeal: vi.fn(),
  };
  return { ...defaultProps, ...overrides };
}

describe('JourneyCard calendar (Start Journey modal)', () => {
  it('renders calendar with min-width wrapper and spaced day cells when date picker is open', () => {
    render(<JourneyCard {...createProps()} />);

    fireEvent.click(screen.getByRole('button', { name: /start nu/i }));
    expect(screen.getByRole('dialog', { name: /start je slow-carb journey/i })).toBeInTheDocument();

    const startDateButton = screen.getByRole('button', { name: /start datum/i });
    fireEvent.click(startDateButton);

    const calendarWrapper = screen.getByTestId('journey-calendar-wrapper');
    expect(calendarWrapper).toBeInTheDocument();
    expect(calendarWrapper.getAttribute('class')).toMatch(/min-w-\[17\.5rem\]/);

    const dayButtons = screen.getAllByRole('button', { name: /maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag/ });
    expect(dayButtons.length).toBeGreaterThanOrEqual(28);
  });
});
