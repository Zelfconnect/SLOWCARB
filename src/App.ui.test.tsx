import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '@/App';

vi.mock('@/components/LandingPageFinal', () => ({
  default: () => <div>LandingPage</div>,
}));

vi.mock('@/components/WelcomePage', () => ({
  default: () => <div>WelcomePage</div>,
}));

vi.mock('@/components/Dashboard', () => ({
  Dashboard: () => <div>DashboardContent</div>,
}));

vi.mock('@/components/RecipesList', () => ({
  RecipesList: () => <div>RecipesContent</div>,
}));

vi.mock('@/components/LearnSection', () => ({
  LearnSection: () => <div>LearnContent</div>,
}));

vi.mock('@/components/SettingsTab', () => ({
  SettingsTab: () => <div>SettingsContent</div>,
}));

vi.mock('@/components/OnboardingWizard', () => ({
  OnboardingWizard: () => <div>OnboardingWizard</div>,
}));

vi.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => ({
    favorites: [],
    toggleFavorite: vi.fn(),
  }),
}));

vi.mock('@/hooks/useJourney', () => ({
  useJourney: () => ({
    journey: { startDate: '2026-02-20', cheatDay: 'zaterdag', targetWeight: 80 },
    weightLog: [],
    mealLog: [],
    startJourney: vi.fn(),
    resetJourney: vi.fn(),
    getCurrentTip: vi.fn(() => null),
    getProgress: vi.fn(() => ({ day: 1, week: 1, totalDays: 84, percentage: 1 })),
    isCheatDay: vi.fn(() => false),
    getTodayMeals: vi.fn(() => ({ date: '2026-02-20', breakfast: false, lunch: false, dinner: false })),
    toggleMeal: vi.fn(),
    logWeight: vi.fn(),
    getStreak: vi.fn(() => 0),
  }),
}));

vi.mock('@/store/useUserStore', () => ({
  useUserStore: () => ({
    profile: { hasCompletedOnboarding: true, name: 'Test' },
    isLoaded: true,
    loadProfile: vi.fn(),
    updateProfile: vi.fn(),
  }),
}));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

beforeEach(() => {
  localStorage.setItem('slowcarb_access', 'test-token');
  window.history.replaceState({}, '', '/?app=1');
});

afterAll(() => {
  localStorage.removeItem('slowcarb_access');
  vi.unstubAllGlobals();
});

describe('App UI/UX', () => {
  it('keeps global shell layout contract', () => {
    const { container } = render(<App />);
    const appShell = container.firstElementChild as HTMLElement;
    expect(appShell.className).toContain('h-[100dvh]');
    expect(appShell.className).toContain('bg-cream');

    const header = screen.getByText('SlowCarb').closest('header');
    expect(header).toBeInTheDocument();
    expect(header?.className).toContain('sticky');

    const main = screen.getByRole('main');
    expect(main.className).toContain('max-w-md');
    expect(main.className).toContain('pb-[calc(5rem+env(safe-area-inset-bottom,0px))]');
  });

  it('switches tabs and renders matching section content', () => {
    render(<App />);

    expect(screen.getByText('DashboardContent')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Recepten' }));
    expect(screen.getByText('RecipesContent')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Leren' }));
    expect(screen.getByText('LearnContent')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'AmmoCheck' }));
    expect(screen.getByText('AmmoCheck')).toBeInTheDocument();
  });

  it('opens settings sheet from header action button', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Open instellingen' }));
    expect(screen.getByText('Instellingen')).toBeInTheDocument();
  });
});
