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

    expect(screen.getAllByRole('button', { name: 'Ontbijt' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Lunch' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Avondeten' })).toHaveLength(1);
    expect(screen.getByText('Avondeten')).toBeInTheDocument();
    expect(screen.getByTestId('meal-photo-card-breakfast')).toBeInTheDocument();
    expect(screen.getByTestId('meal-photo-card-lunch')).toBeInTheDocument();
    expect(screen.getByTestId('meal-photo-card-dinner')).toBeInTheDocument();
  });

  it('renders the meal cards in a simple 3-column equal-width flex container', () => {
    render(
      <DailyMealTracker
        todayMeals={createMeals()}
        streak={0}
        onToggleMeal={vi.fn()}
        isCheatDay={false}
      />
    );

    const grid = screen.getByTestId('meal-cards-grid');
    expect(grid).toHaveClass('flex');
    expect(grid).toHaveClass('gap-1.5');

    const columns = screen.getAllByTestId('meal-card-column');
    expect(columns).toHaveLength(3);
    columns.forEach((column) => {
      expect(column).toHaveClass('flex-1');
      expect(column).toHaveClass('min-w-0');
    });
  });

  it('shows "ontbijt" on the breakfast meal chip instead of "breakfast"', () => {
    render(
      <DailyMealTracker
        todayMeals={createMeals()}
        streak={0}
        onToggleMeal={vi.fn()}
        isCheatDay={false}
      />
    );

    expect(screen.getByText('ontbijt')).toBeInTheDocument();
    expect(screen.queryByText('breakfast')).not.toBeInTheDocument();
  });

  it('shows "diner" on the dinner meal chip instead of "dinner"', () => {
    render(
      <DailyMealTracker
        todayMeals={createMeals()}
        streak={0}
        onToggleMeal={vi.fn()}
        isCheatDay={false}
      />
    );

    expect(screen.getByText('diner')).toBeInTheDocument();
    expect(screen.queryByText('dinner')).not.toBeInTheDocument();
  });

  it('keeps "LUNCH" unchanged on the lunch meal chip', () => {
    render(
      <DailyMealTracker
        todayMeals={createMeals()}
        streak={0}
        onToggleMeal={vi.fn()}
        isCheatDay={false}
      />
    );

    expect(screen.getByText('LUNCH')).toBeInTheDocument();
    expect(screen.queryByText('middageten')).not.toBeInTheDocument();
  });

  it('shows a single completion cue and no legacy afgevinkt badge text', () => {
    render(
      <DailyMealTracker
        todayMeals={createMeals({ breakfast: true })}
        streak={2}
        onToggleMeal={vi.fn()}
        isCheatDay={false}
      />
    );

    expect(screen.getAllByText('Klaar')).toHaveLength(1);
    expect(screen.queryByText('Afgevinkt')).not.toBeInTheDocument();
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

    expect(screen.getByText('0/3')).toBeInTheDocument();
    expect(screen.getByText('Start je dag met een goed ontbijt.')).toBeInTheDocument();

    rerender(
      <DailyMealTracker
        todayMeals={createMeals({ breakfast: true })}
        streak={0}
        onToggleMeal={onToggleMeal}
        isCheatDay={false}
      />
    );
    expect(screen.getByText('1/3')).toBeInTheDocument();
    expect(screen.getByText('Goed bezig! Nog 2 maaltijden te gaan.')).toBeInTheDocument();

    rerender(
      <DailyMealTracker
        todayMeals={createMeals({ breakfast: true, lunch: true })}
        streak={0}
        onToggleMeal={onToggleMeal}
        isCheatDay={false}
      />
    );
    expect(screen.getByText('2/3')).toBeInTheDocument();
    expect(screen.getByText('Bijna daar! Nog 1 maaltijd.')).toBeInTheDocument();

    rerender(
      <DailyMealTracker
        todayMeals={createMeals({ breakfast: true, lunch: true, dinner: true })}
        streak={0}
        onToggleMeal={onToggleMeal}
        isCheatDay={false}
      />
    );
    expect(screen.getByText('3/3')).toBeInTheDocument();
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

    const breakfastButtons = screen.getAllByRole('button', { name: 'Ontbijt' });
    expect(breakfastButtons.length).toBeGreaterThan(0);
    breakfastButtons.forEach((button) => expect(button).toBeDisabled());

    fireEvent.click(breakfastButtons[0]);
    expect(onToggleMeal).not.toHaveBeenCalled();
  });
});
