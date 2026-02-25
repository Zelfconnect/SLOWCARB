import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { formatWeekEstimate } from '@/lib/formatWeekEstimate';

describe('formatWeekEstimate', () => {
  it('uses singular for one week', () => {
    expect(formatWeekEstimate(1)).toBe('1 week');
  });

  it('uses plural for multiple weeks', () => {
    expect(formatWeekEstimate(2)).toBe('2 weken');
  });
});

describe('OnboardingWizard weight step', () => {
  it('shows calculated weight goal when valid weights are entered', () => {
    render(<OnboardingWizard onComplete={vi.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Onboarding wizard' })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Je naam'), { target: { value: 'Jesper' } });
    fireEvent.click(screen.getByRole('button', { name: 'Volgende' }));

    fireEvent.change(screen.getByLabelText('Huidig gewicht (kg)'), { target: { value: '110' } });
    fireEvent.change(screen.getByLabelText('Streefgewicht (kg)'), { target: { value: '100' } });

    expect(screen.getByText('10 kg afvallen in ~6 weken')).toBeInTheDocument();
  });
});
