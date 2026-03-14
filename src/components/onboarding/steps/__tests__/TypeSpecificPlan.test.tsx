import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TypeSpecificPlan, getPersonalizedType } from '@/components/onboarding/steps/TypeSpecificPlan';
import type { OnboardingData } from '@/components/onboarding/OnboardingWizard';

const baseData: OnboardingData = {
  name: 'Jesper',
  currentWeight: 100,
  targetWeight: 90,
  vegetarian: false,
  hasAirfryer: false,
  sportsRegularly: false,
  cheatDay: 'zaterdag',
};

describe('getPersonalizedType', () => {
  it('returns active profile when user sports regularly', () => {
    const result = getPersonalizedType({ ...baseData, sportsRegularly: true, vegetarian: true });
    expect(result.title).toContain('Actieve Versneller');
  });

  it('returns vegetarian profile when not sporty but vegetarian', () => {
    const result = getPersonalizedType({ ...baseData, vegetarian: true });
    expect(result.title).toContain('Plantaardige Planner');
  });

  it('returns stronger reset profile for larger goal', () => {
    const result = getPersonalizedType({ ...baseData, currentWeight: 120, targetWeight: 95 });
    expect(result.title).toContain('Sterke Reset');
  });

  it('falls back to stable starter', () => {
    const result = getPersonalizedType(baseData);
    expect(result.title).toContain('Stabiele Starter');
  });
});

describe('TypeSpecificPlan', () => {
  it('renders explanation and personalized how-it-works block', () => {
    render(<TypeSpecificPlan data={baseData} />);
    expect(screen.getByText('Uitleg')).toBeInTheDocument();
    expect(screen.getByText('Hoe SlowCarb voor jou werkt')).toBeInTheDocument();
  });

  it('shows airfryer bonus line when enabled', () => {
    render(<TypeSpecificPlan data={{ ...baseData, hasAirfryer: true }} />);
    expect(screen.getByText(/airfryer-opties/)).toBeInTheDocument();
  });
});
