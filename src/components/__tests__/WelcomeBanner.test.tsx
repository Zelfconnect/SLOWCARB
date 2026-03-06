import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WelcomeBanner } from '@/components/WelcomeBanner';

describe('WelcomeBanner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-06T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows when meal count is zero and journey started within 24 hours', () => {
    render(
      <WelcomeBanner
        userName="Jesper"
        mealCount={0}
        journeyStartDate="2026-03-06"
      />
    );

    expect(
      screen.getByText('Welkom Jesper! Je plan staat klaar. Log je eerste ontbijt om je streak te starten.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log ontbijt' })).toBeInTheDocument();
  });

  it('hides permanently after dismiss', () => {
    const { rerender } = render(
      <WelcomeBanner
        userName="Jesper"
        mealCount={0}
        journeyStartDate="2026-03-06"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sluit welkomstbanner' }));

    expect(
      screen.queryByText('Welkom Jesper! Je plan staat klaar. Log je eerste ontbijt om je streak te starten.')
    ).not.toBeInTheDocument();
    expect(window.localStorage.getItem('slowcarb-welcome-dismissed')).toBe('true');

    rerender(
      <WelcomeBanner
        userName="Jesper"
        mealCount={0}
        journeyStartDate="2026-03-06"
      />
    );
    expect(
      screen.queryByText('Welkom Jesper! Je plan staat klaar. Log je eerste ontbijt om je streak te starten.')
    ).not.toBeInTheDocument();
  });

  it('hides when at least one meal is logged', () => {
    render(
      <WelcomeBanner
        userName="Jesper"
        mealCount={1}
        journeyStartDate="2026-03-06"
      />
    );

    expect(
      screen.queryByText('Welkom Jesper! Je plan staat klaar. Log je eerste ontbijt om je streak te starten.')
    ).not.toBeInTheDocument();
  });
});
