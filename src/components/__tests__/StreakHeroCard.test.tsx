import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StreakHeroCard } from '@/components/StreakHeroCard';

describe('StreakHeroCard', () => {
  it('shows singular day label for a streak of 1', () => {
    render(<StreakHeroCard streak={1} currentWeek={1} currentDay={1} isCheatDay={false} />);

    expect(screen.getByText('1 dag on protocol')).toBeInTheDocument();
  });

  it('shows plural day label for a streak above 1', () => {
    render(<StreakHeroCard streak={2} currentWeek={1} currentDay={2} isCheatDay={false} />);

    expect(screen.getByText('2 dagen on protocol')).toBeInTheDocument();
  });
});
