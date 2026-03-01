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

vi.mock('@/components/LoginPage', () => ({
  LoginPage: () => <div>LoginPage</div>,
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

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    session: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    signOut: vi.fn(),
  }),
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
    getMealsForDate: vi.fn((date: string) => ({ date, breakfast: false, lunch: false, dinner: false })),
    getTodayMeals: vi.fn(() => ({ date: '2026-02-20', breakfast: false, lunch: false, dinner: false })),
    toggleMealForDate: vi.fn(),
    toggleMeal: vi.fn(),
    markDayCompliant: vi.fn(),
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
    expect(appShell.className).toContain('h-full');
    expect(appShell.className).toContain('bg-cream');
    expect(appShell.className).toContain('overflow-hidden');

    const header = screen.getByText('SlowCarb').closest('header');
    expect(header).toBeInTheDocument();
    expect(header?.className).toContain('sticky');

    const main = screen.getByRole('main');
    expect(main.className).toContain('max-w-md');
    expect(main.className).toContain('pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]');
    expect(main.className).toContain('overflow-y-auto');

    const bottomNav = screen.getByRole('navigation');
    expect(bottomNav.className).toContain('fixed');
    expect(bottomNav.className).toContain('bottom-0');
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
