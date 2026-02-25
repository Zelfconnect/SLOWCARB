import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StreakHeroCard } from '@/components/StreakHeroCard';

describe('StreakHeroCard', () => {
  it('shows singular day label for a streak of 1', () => {
    render(<StreakHeroCard streak={1} currentWeek={1} currentDay={2} isCheatDay={false} />);

    expect(screen.getByText('1 dag protocol-streak')).toBeInTheDocument();
    expect(screen.getByText('Week 1 • Kalenderdag 2/84')).toBeInTheDocument();
  });

  it('shows plural day label for a streak above 1', () => {
    render(<StreakHeroCard streak={2} currentWeek={1} currentDay={2} isCheatDay={false} />);

    expect(screen.getByText('2 dagen protocol-streak')).toBeInTheDocument();
  });

  it('explains calendar day when there is no streak yet', () => {
    render(<StreakHeroCard streak={0} currentWeek={1} currentDay={6} isCheatDay={false} />);

    expect(screen.getByText('Kalenderdag 6/84 • Log je maaltijden voor je streak')).toBeInTheDocument();
  });
});
