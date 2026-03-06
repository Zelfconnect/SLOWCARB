import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { JourneyCard } from '@/components/JourneyCard';
import type { MealEntry } from '@/types';

function createProps(overrides: Partial<React.ComponentProps<typeof JourneyCard>> = {}) {
  const defaultProps: React.ComponentProps<typeof JourneyCard> = {
    journey: { startDate: '2026-02-01', cheatDay: 'zaterdag' },
    progress: { day: 5, week: 1, totalDays: 84, percentage: 6 },
    currentTip: {
      day: 5,
      tip: {
        title: 'Hydratatie eerst',
        tips: ['Begin je dag met 500 ml water', 'Voeg een snuf zout toe'],
        metabolicState: 'Je lichaam schakelt naar vetverbranding.',
      },
      weekTip: {
        title: 'Focus deze week',
        tips: ['Plan je maaltijden vooruit'],
        warning: 'Te weinig water kan zorgen voor hoofdpijn.',
      },
    },
    isCheatDay: false,
    onStartJourney: vi.fn(),
    onResetJourney: vi.fn(),
    todayMeals: { date: '2026-02-05', breakfast: false, lunch: false, dinner: false } satisfies MealEntry,
    streak: 0,
    onToggleMeal: vi.fn(),
  };

  return { ...defaultProps, ...overrides };
}

describe('JourneyCard tip dialog', () => {
  it('opens and closes the tip dialog with full tip content', async () => {
    render(<JourneyCard {...createProps()} />);

    fireEvent.click(screen.getByRole('button', { name: /hydratatie eerst/i }));

    const dialog = screen.getByRole('dialog', { name: /hydratatie eerst/i });
    const dialogContent = within(dialog);

    expect(dialogContent.getByText('Dag 5 — Hydratatie eerst')).toBeInTheDocument();
    expect(dialogContent.getByText('Tips voor vandaag')).toBeInTheDocument();
    expect(dialogContent.getByText('Begin je dag met 500 ml water')).toBeInTheDocument();
    expect(dialogContent.getByText('Let op')).toBeInTheDocument();
    expect(dialogContent.getByText('Te weinig water kan zorgen voor hoofdpijn.')).toBeInTheDocument();
    expect(dialogContent.getByText('Metabole staat')).toBeInTheDocument();
    expect(dialogContent.getByText('Je lichaam schakelt naar vetverbranding.')).toBeInTheDocument();

    fireEvent.click(dialogContent.getByRole('button', { name: /sluiten/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /hydratatie eerst/i })).not.toBeInTheDocument();
    });
  });
});
