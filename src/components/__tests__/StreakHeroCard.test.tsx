import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StreakHeroCard } from '@/components/StreakHeroCard';

describe('StreakHeroCard', () => {
  it('shows singular day label for a streak of 1', () => {
    render(<StreakHeroCard streak={1} currentWeek={1} currentDay={2} isCheatDay={false} />);

    expect(screen.getByText('1 dag op rij')).toBeInTheDocument();
    expect(screen.getByText('Dag 2')).toBeInTheDocument();
  });

  it('shows plural day label for a streak above 1', () => {
    render(<StreakHeroCard streak={2} currentWeek={1} currentDay={2} isCheatDay={false} />);

    expect(screen.getByText('2 dagen op rij')).toBeInTheDocument();
  });

  it('explains calendar day when there is no streak yet', () => {
    render(<StreakHeroCard streak={0} currentWeek={1} currentDay={6} isCheatDay={false} />);

    expect(screen.getByText('Dag 6 • Log je maaltijden om je streak te starten')).toBeInTheDocument();
  });
});
