import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { formatWeekEstimate } from '@/lib/formatWeekEstimate';

vi.mock('@/components/ui/slider', () => ({
  Slider: ({ value }: { value: number[] }) => <div data-testid="weight-goal-slider">{value[0]}</div>,
}));

describe('formatWeekEstimate', () => {
  it('uses singular for one week', () => {
    expect(formatWeekEstimate(1)).toBe('1 week');
  });

  it('uses plural for multiple weeks', () => {
    expect(formatWeekEstimate(2)).toBe('2 weken');
  });
});

describe('OnboardingWizard week estimate copy', () => {
  it('shows pluralized week label on the weight-goal step', () => {
    render(<OnboardingWizard onComplete={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Je naam'), { target: { value: 'Jesper' } });
    fireEvent.click(screen.getByRole('button', { name: 'Volgende' }));

    expect(screen.getByText('10 kg in ~6 weken')).toBeInTheDocument();
  });
});
