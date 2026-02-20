import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DailyMealTracker } from '@/components/DailyMealTracker';
import type { MealEntry } from '@/types';

function createMeals(overrides: Partial<MealEntry> = {}): MealEntry {
  return {
    date: '2026-02-19',
    breakfast: false,
    lunch: false,
    dinner: false,
    ...overrides,
  };
}

describe('DailyMealTracker', () => {
  it('renders exactly three meal cards', () => {
    render(
      <DailyMealTracker
        todayMeals={createMeals()}
        streak={0}
        onToggleMeal={vi.fn()}
        isCheatDay={false}
      />
    );

    expect(screen.getByRole('button', { name: 'Ontbijt' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lunch' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avondeten' })).toBeInTheDocument();
  });

  it('shows a single completion cue and no legacy klaar badge text', () => {
    render(
      <DailyMealTracker
        todayMeals={createMeals({ breakfast: true })}
        streak={2}
        onToggleMeal={vi.fn()}
        isCheatDay={false}
      />
    );

    expect(screen.getAllByText('Afgevinkt')).toHaveLength(1);
    expect(screen.queryByText('Klaar')).not.toBeInTheDocument();
  });

  it('updates day status copy for 0, 1, 2 and 3 completed meals', () => {
    const onToggleMeal = vi.fn();
    const { rerender } = render(
      <DailyMealTracker
        todayMeals={createMeals()}
        streak={0}
        onToggleMeal={onToggleMeal}
        isCheatDay={false}
      />
    );

    expect(screen.getByText('0/3 maaltijden afgerond')).toBeInTheDocument();
    expect(screen.getByText('Start je dag met een goed ontbijt.')).toBeInTheDocument();

    rerender(
      <DailyMealTracker
        todayMeals={createMeals({ breakfast: true })}
        streak={0}
        onToggleMeal={onToggleMeal}
        isCheatDay={false}
      />
    );
    expect(screen.getByText('1/3 maaltijden afgerond')).toBeInTheDocument();
    expect(screen.getByText('Goed bezig! Nog 2 maaltijden te gaan.')).toBeInTheDocument();

    rerender(
      <DailyMealTracker
        todayMeals={createMeals({ breakfast: true, lunch: true })}
        streak={0}
        onToggleMeal={onToggleMeal}
        isCheatDay={false}
      />
    );
    expect(screen.getByText('2/3 maaltijden afgerond')).toBeInTheDocument();
    expect(screen.getByText('Bijna daar! Nog 1 maaltijd.')).toBeInTheDocument();

    rerender(
      <DailyMealTracker
        todayMeals={createMeals({ breakfast: true, lunch: true, dinner: true })}
        streak={0}
        onToggleMeal={onToggleMeal}
        isCheatDay={false}
      />
    );
    expect(screen.getByText('3/3 maaltijden afgerond')).toBeInTheDocument();
    expect(screen.getByText('Geweldig! Alle maaltijden compleet.')).toBeInTheDocument();
  });

  it('disables meal interaction on cheat day', () => {
    const onToggleMeal = vi.fn();
    render(
      <DailyMealTracker
        todayMeals={createMeals()}
        streak={3}
        onToggleMeal={onToggleMeal}
        isCheatDay
      />
    );

    const breakfastButton = screen.getByRole('button', { name: 'Ontbijt' });
    expect(breakfastButton).toBeDisabled();

    fireEvent.click(breakfastButton);
    expect(onToggleMeal).not.toHaveBeenCalled();
  });
});
