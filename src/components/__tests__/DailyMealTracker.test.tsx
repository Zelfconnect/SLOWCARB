import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DailyMealTracker } from '@/components/DailyMealTracker';
import type { MealEntry } from '@/types';

vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

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
