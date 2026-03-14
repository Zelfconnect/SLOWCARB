import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dashboard } from '@/components/Dashboard';
import type { Journey, MealEntry, WeightEntry } from '@/types';
import { shareText } from '@/lib/share';

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

vi.mock('@/components/FysiologieCard', () => ({
  FysiologieCard: () => <div>FysiologieCard</div>,
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

vi.mock('@/lib/share', () => ({
  shareText: vi.fn().mockResolvedValue('native'),
}));

let mockedDaysUntilCheatDay = 2;

vi.mock('@/hooks/useJourney', () => ({
  getDaysUntilCheatDay: () => mockedDaysUntilCheatDay,
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

function createCompletedEntries(count: number): MealEntry[] {
  return Array.from({ length: count }, (_, index) => ({
    date: `2026-01-${String(index + 1).padStart(2, '0')}`,
    breakfast: true,
    lunch: true,
    dinner: true,
  }));
}

function createProps(overrides: Partial<React.ComponentProps<typeof Dashboard>> = {}) {
  const onLogWeight = vi.fn();
  const defaultProps: React.ComponentProps<typeof Dashboard> = {
    userName: 'Test',
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
    onToggleMealForDate: vi.fn(),
    getMealsForDate: vi.fn().mockReturnValue(createMealEntry()),
    onChangeCheatDay: vi.fn(),
  };

  return {
    onLogWeight,
    props: { ...defaultProps, ...overrides },
  };
}

const shareTextMock = vi.mocked(shareText);

describe('Dashboard UI/UX', () => {
  beforeEach(() => {
    mockedDaysUntilCheatDay = 2;
    shareTextMock.mockResolvedValue('native');
    shareTextMock.mockClear();
  });

  it('renders meal tracker and countdown on non-cheatday', () => {
    mockedDaysUntilCheatDay = 2;
    const { props } = createProps({ isCheatDay: false });
    render(<Dashboard {...props} />);

    expect(screen.getByText('DailyMealTracker')).toBeInTheDocument();
    expect(screen.getByText('Nog 2 dagen tot je cheatday.')).toBeInTheDocument();
  });

  it('shows countdown on non-cheatday even when cheatday is more than 2 days away', () => {
    mockedDaysUntilCheatDay = 5;
    const { props } = createProps({ isCheatDay: false });
    render(<Dashboard {...props} />);

    expect(screen.getByText('Nog 5 dagen tot je cheatday.')).toBeInTheDocument();
  });

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

  it('renders cheatday banner and hides meal tracker on cheatday', () => {
    const { props } = createProps({ isCheatDay: true });
    render(<Dashboard {...props} />);

    expect(screen.getByText('🍕 Cheatday!')).toBeInTheDocument();
    expect(screen.getByText('Je eerste cheatday valt vroeg (dag 2). Zie dit vooral als ritme-opbouw: geniet bewust en pak morgen direct het protocol weer op.')).toBeInTheDocument();
    expect(screen.queryByText('DailyMealTracker')).not.toBeInTheDocument();
  });

  it('keeps regular cheatday context after day 4', () => {
    const { props } = createProps({
      isCheatDay: true,
      progress: { day: 5, week: 1, totalDays: 84, percentage: 6 },
    });
    render(<Dashboard {...props} />);

    expect(screen.getByText('Eet vandaag wat je wilt! Dit reset je hormonen en houdt je mentaal scherp. Geniet ervan en ga morgen weer terug naar het protocol.')).toBeInTheDocument();
  });

  it('shows week 6 resultaatkaart after enough complete daily check-ins', () => {
    const { props } = createProps({
      progress: { day: 38, week: 6, totalDays: 84, percentage: 45 },
      mealEntries: createCompletedEntries(30),
      weightLog: [
        { date: '2026-01-01', weight: 95 } satisfies WeightEntry,
        { date: '2026-02-07', weight: 91.2 } satisfies WeightEntry,
      ],
      onboardingStartWeight: 95,
    });
    render(<Dashboard {...props} />);

    expect(screen.getByText('Week 6 resultaatkaart')).toBeInTheDocument();
    expect(screen.getByText('Je zit in week 6 met 30 complete dagelijkse check-ins.')).toBeInTheDocument();
    expect(screen.getByText('3.8 kg lichter sinds de start van je challenge.')).toBeInTheDocument();
  });

  it('hides week 6 resultaatkaart when check-ins are below threshold', () => {
    const { props } = createProps({
      progress: { day: 38, week: 6, totalDays: 84, percentage: 45 },
      mealEntries: createCompletedEntries(29),
    });
    render(<Dashboard {...props} />);

    expect(screen.queryByText('Week 6 resultaatkaart')).not.toBeInTheDocument();
  });

  it('shares cheatday text from countdown row', async () => {
    const { props } = createProps({ isCheatDay: false });
    render(<Dashboard {...props} />);

    fireEvent.click(screen.getByRole('button', { name: 'Deel' }));

    expect(shareTextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Mijn cheatday',
        text: expect.stringContaining('Mijn cheatday is'),
      })
    );
  });

  it('shares week 6 result text', async () => {
    const { props } = createProps({
      progress: { day: 38, week: 6, totalDays: 84, percentage: 45 },
      mealEntries: createCompletedEntries(30),
      weightLog: [
        { date: '2026-01-01', weight: 95 } satisfies WeightEntry,
        { date: '2026-02-07', weight: 91.2 } satisfies WeightEntry,
      ],
      onboardingStartWeight: 95,
    });
    render(<Dashboard {...props} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Deel' })[0]);

    expect(shareTextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'SlowCarb week 6 resultaat',
        text: expect.stringContaining('kg kwijt'),
      })
    );
  });

  it('keeps compact dashboard section order', () => {
    const { props } = createProps({ isCheatDay: false });
    render(<Dashboard {...props} />);

    const streakHero = screen.getByText('StreakHeroCard');
    const mealTracker = screen.getByText('DailyMealTracker');
    const fysiologieCard = screen.getByText('FysiologieCard');
    const weekGrid = screen.getByText('WeeklyProgressGrid');
    const weightTrigger = screen.getByRole('button', { name: 'Open gewicht dialog' });

    expect(streakHero.compareDocumentPosition(mealTracker)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(mealTracker.compareDocumentPosition(fysiologieCard)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(fysiologieCard.compareDocumentPosition(weekGrid)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
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
