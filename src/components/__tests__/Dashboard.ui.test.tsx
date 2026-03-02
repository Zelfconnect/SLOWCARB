import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Dashboard } from '@/components/Dashboard';
import type { Journey, MealEntry, WeightEntry } from '@/types';

vi.mock('@/components/JourneyCard', () => ({
  JourneyCard: () => <div>JourneyCard</div>,
}));

vi.mock('@/components/DailyMealTracker', () => ({
  DailyMealTracker: () => <div>DailyMealTracker</div>,
}));

vi.mock('@/components/StreakHeroCard', () => ({
  StreakHeroCard: () => <div>StreakHeroCard</div>,
}));

vi.mock('@/components/WeeklyProgressGrid', () => ({
  WeeklyProgressGrid: () => <div>WeeklyProgressGrid</div>,
}));

vi.mock('@/components/CheatDayCountdown', () => ({
  CheatDayCountdown: () => <div>CheatDayCountdown</div>,
}));

vi.mock('@/components/WeightProgressCard', () => ({
  WeightProgressCard: ({ onOpenLog }: { onOpenLog?: () => void }) => (
    <button onClick={onOpenLog} type="button">
      Open gewicht dialog
    </button>
  ),
}));

vi.mock('@/hooks/useJourney', () => ({
  getDaysUntilCheatDay: () => 2,
  getWeekData: () => [{ isFuture: false, isCheatDay: false, completed: true }],
}));

function createJourney(overrides: Partial<Journey> = {}): Journey {
  return {
    startDate: '2026-02-10',
    cheatDay: 'zaterdag',
    targetWeight: 80,
    ...overrides,
  };
}

function createMealEntry(overrides: Partial<MealEntry> = {}): MealEntry {
  return {
    date: '2026-02-20',
    breakfast: false,
    lunch: false,
    dinner: false,
    ...overrides,
  };
}

function createProps(overrides: Partial<React.ComponentProps<typeof Dashboard>> = {}) {
  const onLogWeight = vi.fn();
  const defaultProps: React.ComponentProps<typeof Dashboard> = {
    journey: createJourney(),
    progress: { day: 2, week: 1, totalDays: 84, percentage: 2 },
    currentTip: null,
    isCheatDay: false,
    onStartJourney: vi.fn(),
    onResetJourney: vi.fn(),
    todayMeals: createMealEntry(),
    streak: 1,
    onToggleMeal: vi.fn(),
    mealEntries: [createMealEntry()],
    weightLog: [{ date: '2026-02-19', weight: 83 } satisfies WeightEntry],
    onLogWeight,
  };

  return {
    onLogWeight,
    props: { ...defaultProps, ...overrides },
  };
}

describe('Dashboard UI/UX', () => {
  it('shows journey start layout when journey has no startDate', () => {
    const { props } = createProps({
      journey: createJourney({ startDate: null }),
    });
    render(<Dashboard {...props} />);

    expect(screen.getByText('JourneyCard')).toBeInTheDocument();
  });

  it('opens weight dialog and blocks invalid values while saving valid value', () => {
    const { props, onLogWeight } = createProps();
    render(<Dashboard {...props} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open gewicht dialog' }));
    const weightInput = screen.getByLabelText('Gewicht (kg)');
    const saveButton = screen.getByRole('button', { name: 'Opslaan' });

    fireEvent.change(weightInput, { target: { value: '30' } });
    fireEvent.click(saveButton);
    expect(onLogWeight).not.toHaveBeenCalled();

    fireEvent.change(weightInput, { target: { value: '82.5' } });
    fireEvent.click(saveButton);
    expect(onLogWeight).toHaveBeenCalledWith(82.5, expect.any(String));
  });

  it('renders cheat day banner and hides meal tracker on cheat day', () => {
    const { props } = createProps({ isCheatDay: true });
    render(<Dashboard {...props} />);

    expect(screen.getByText('🍕 Cheat Day!')).toBeInTheDocument();
    expect(screen.getByText('Je eerste cheat day valt vroeg (dag 2). Zie dit vooral als ritme-opbouw: geniet bewust en pak morgen direct het protocol weer op.')).toBeInTheDocument();
    expect(screen.queryByText('DailyMealTracker')).not.toBeInTheDocument();
  });

  it('keeps regular cheat day context after day 4', () => {
    const { props } = createProps({
      isCheatDay: true,
      progress: { day: 5, week: 1, totalDays: 84, percentage: 6 },
    });
    render(<Dashboard {...props} />);

    expect(screen.getByText('Eet vandaag wat je wilt! Dit reset je hormonen en houdt je mentaal scherp. Geniet ervan en ga morgen weer terug naar het protocol.')).toBeInTheDocument();
  });

  it('renders meal tracker and countdown on non-cheat day', () => {
    const { props } = createProps({ isCheatDay: false });
    render(<Dashboard {...props} />);

    expect(screen.getByText('DailyMealTracker')).toBeInTheDocument();
    expect(screen.getByText('Nog 2 dagen tot je cheat day.')).toBeInTheDocument();
  });

  it('keeps compact dashboard section order', () => {
    const { props } = createProps({ isCheatDay: false });
    render(<Dashboard {...props} />);

    const streakHero = screen.getByText('StreakHeroCard');
    const mealTracker = screen.getByText('DailyMealTracker');
    const weekGrid = screen.getByText('WeeklyProgressGrid');
    const weightTrigger = screen.getByRole('button', { name: 'Open gewicht dialog' });

    expect(streakHero.compareDocumentPosition(mealTracker)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(mealTracker.compareDocumentPosition(weekGrid)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(weekGrid.compareDocumentPosition(weightTrigger)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('relies on main layout scroll and keeps dashboard wrapper unclipped', () => {
    const { props } = createProps({ isCheatDay: false });
    render(<Dashboard {...props} />);

    const contentWrapper = screen.getByTestId('dashboard-content');
    expect(contentWrapper).toBeInTheDocument();
    expect(contentWrapper.className).not.toContain('h-full');
    expect(contentWrapper.className).not.toContain('overflow-hidden');
    expect(contentWrapper.className).not.toContain('overflow-y-auto');
  });

  it('keeps weight dialog design contract classes', () => {
    const { props } = createProps();
    render(<Dashboard {...props} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open gewicht dialog' }));
    const dialogContent = document.querySelector('[data-slot="dialog-content"]');
    expect(dialogContent).toBeInTheDocument();
    expect(dialogContent?.className).toContain('rounded-2xl');
    expect(dialogContent?.className).toContain('border-stone-200');
    expect(dialogContent?.className).toContain('shadow-elevated');
  });
});
