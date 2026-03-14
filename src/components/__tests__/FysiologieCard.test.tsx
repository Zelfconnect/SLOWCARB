import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FysiologieCard } from '@/components/FysiologieCard';

function createProps(overrides: Partial<React.ComponentProps<typeof FysiologieCard>> = {}) {
  const defaultProps: React.ComponentProps<typeof FysiologieCard> = {
    progress: { day: 2, week: 1, totalDays: 84, percentage: 2 },
    currentTip: {
      day: 2,
      tip: {
        title: 'De Suikerdip',
        tips: ['Drink extra water'],
        metabolicState: 'Glycogeen begint te dalen. Lever start gluconeogenese.',
      },
      weekTip: {
        title: 'Week 1: De Aanpassing',
        tips: ['Dag 3 is het moeilijkst'],
      },
    },
    isCheatDay: false,
  };

  return { ...defaultProps, ...overrides };
}

describe('FysiologieCard', () => {
  it('does not render on cheat day', () => {
    render(<FysiologieCard {...createProps({ isCheatDay: true })} />);
    expect(screen.queryByTestId('fysiologie-card')).not.toBeInTheDocument();
  });

  it('does not render when current day tip is missing', () => {
    render(<FysiologieCard {...createProps({ currentTip: { day: 2 } })} />);
    expect(screen.queryByTestId('fysiologie-card')).not.toBeInTheDocument();
  });

  it('shows phase/day badge and first metabolic sentence', () => {
    render(<FysiologieCard {...createProps()} />);

    expect(screen.getByText(/Fase 2 — De Suikerdip/)).toBeInTheDocument();
    expect(screen.getByText('Dag 2')).toBeInTheDocument();
    expect(screen.getByText('Glycogeen begint te dalen.')).toBeInTheDocument();
    expect(screen.queryByText('Lever start gluconeogenese.')).not.toBeInTheDocument();
    expect(screen.getByText('Glycogeen begint te dalen.').className).toContain('line-clamp-2');
  });

  it('opens tip dialog when clicking "Ontdek je fysiologie"', () => {
    render(<FysiologieCard {...createProps()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ontdek je fysiologie' }));

    expect(screen.getByRole('dialog', { name: 'De Suikerdip' })).toBeInTheDocument();
  });
});
