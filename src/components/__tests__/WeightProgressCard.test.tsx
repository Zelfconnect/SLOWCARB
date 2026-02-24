import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WeightProgressCard } from '@/components/WeightProgressCard';
import type { WeightEntry } from '@/types';

function createWeightLog(weights: Array<{ date: string; weight: number }>): WeightEntry[] {
  return weights.map((entry) => ({
    date: entry.date,
    weight: entry.weight,
  }));
}

describe('WeightProgressCard', () => {
  it('shows stable state when there is no meaningful weight change', () => {
    const weightLog = createWeightLog([
      { date: '2026-02-01', weight: 100.0 },
      { date: '2026-02-15', weight: 100.0 },
    ]);

    render(<WeightProgressCard weightLog={weightLog} startWeight={100.0} currentWeight={100.0} />);

    expect(screen.getByText('Stabiel')).toBeInTheDocument();
    expect(screen.getByText('0.0% deze maand')).toBeInTheDocument();
  });

  it('shows negative delta chip when current weight is lower than start weight', () => {
    const weightLog = createWeightLog([
      { date: '2026-02-01', weight: 100.0 },
      { date: '2026-02-15', weight: 98.8 },
    ]);

    render(<WeightProgressCard weightLog={weightLog} startWeight={100.0} currentWeight={98.8} />);

    expect(screen.getByText('-1.2 kg')).toBeInTheDocument();
    expect(screen.getByText('-1.2% deze maand')).toBeInTheDocument();
  });

  it('renders the single-point sparkline fallback without errors', () => {
    const weightLog = createWeightLog([{ date: '2026-02-15', weight: 100.0 }]);

    render(<WeightProgressCard weightLog={weightLog} startWeight={100.0} currentWeight={100.0} />);

    expect(screen.getByLabelText('Gewichtsontwikkeling')).toBeInTheDocument();
  });

  it('renders current weight as hero in goal mode', () => {
    const weightLog = createWeightLog([
      { date: '2026-02-01', weight: 100.0 },
      { date: '2026-02-20', weight: 96.5 },
    ]);

    render(
      <WeightProgressCard
        weightLog={weightLog}
        startWeight={100.0}
        currentWeight={96.5}
        targetWeight={10}
      />
    );

    expect(screen.getByText('Huidig gewicht')).toBeInTheDocument();
    expect(screen.getByText('Doel -10 kg')).toBeInTheDocument();
    expect(screen.getByText('100.0 kg')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Resterend 6.5 kg'))).toBeInTheDocument();
    expect(screen.queryByText('Nu')).not.toBeInTheDocument();
    expect(screen.queryByText('Veranderd')).not.toBeInTheDocument();
  });

  it('renders exactly one progress indicator for goal mode', () => {
    const weightLog = createWeightLog([
      { date: '2026-02-01', weight: 100.0 },
      { date: '2026-02-20', weight: 98.0 },
    ]);

    render(
      <WeightProgressCard
        weightLog={weightLog}
        startWeight={100.0}
        currentWeight={98.0}
        targetWeight={10}
      />
    );

    expect(screen.getAllByTestId('goal-progress-arc')).toHaveLength(1);
  });
});
