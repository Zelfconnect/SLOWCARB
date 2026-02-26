import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { formatWeekEstimate } from '@/lib/formatWeekEstimate';

describe('formatWeekEstimate', () => {
  it('uses singular for one week', () => {
    expect(formatWeekEstimate(1)).toBe('1 week');
  });

  it('uses plural for multiple weeks', () => {
    expect(formatWeekEstimate(2)).toBe('2 weken');
  });
});

describe('OnboardingWizard', () => {
  it('renders the onboarding dialog', () => {
    render(<OnboardingWizard onComplete={vi.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Onboarding' })).toBeInTheDocument();
  });

  it('uses Safari-safe fullscreen viewport classes for dialog and step shell', () => {
    render(<OnboardingWizard onComplete={vi.fn()} />);
    const dialog = screen.getByRole('dialog', { name: 'Onboarding' });
    expect(dialog.className).toContain('h-app-screen');

    const stepShell = document.body.querySelector('.app-screen');
    expect(stepShell).toBeInTheDocument();

    const stepScrollContainer = stepShell?.querySelector('.overflow-y-auto');
    expect(stepScrollContainer?.className).toContain('pb-[calc(120px+env(safe-area-inset-bottom,0px))]');
  });

  it('renders CTA in bottom footer outside the scrollable step content', () => {
    render(<OnboardingWizard onComplete={vi.fn()} />);

    const stepShell = document.body.querySelector('.app-screen');
    const stepScrollContainer = stepShell?.querySelector('.overflow-y-auto');
    const ctaButton = screen.getByRole('button', { name: 'Vertel me meer' });
    const ctaFooter = ctaButton.parentElement;

    expect(stepScrollContainer).not.toContainElement(ctaButton);
    expect(stepScrollContainer?.nextElementSibling).toContainElement(ctaButton);
    expect(ctaFooter?.className).toContain('border-t');
    expect(ctaFooter?.className).toContain('pb-[calc(24px+env(safe-area-inset-bottom,0px))]');
  });

  it('shows the hero screen first with CTA', () => {
    render(<OnboardingWizard onComplete={vi.fn()} />);
    expect(screen.getByText(/8-10 kg lichter/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vertel me meer' })).toBeInTheDocument();
  });

  it('navigates to name input on step 2', () => {
    render(<OnboardingWizard onComplete={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Vertel me meer' }));
    expect(screen.getByLabelText('Je naam')).toBeInTheDocument();
  });

  it('keeps rules content clear of bottom actions and cards non-shrinking', () => {
    render(<OnboardingWizard onComplete={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Vertel me meer' }));
    fireEvent.change(screen.getByLabelText('Je naam'), { target: { value: 'Jesper' } });
    fireEvent.click(screen.getByRole('button', { name: 'Volgende' }));
    fireEvent.click(screen.getByRole('button', { name: 'Laat me de regels zien' }));

    const rulesHeading = screen.getByRole('heading', { name: 'De 5 regels' });
    const rulesSection = rulesHeading.closest('section');
    const rulesList = rulesSection?.querySelector('.mt-8');
    expect(rulesList).toHaveStyle({ paddingBottom: 'calc(120px + env(safe-area-inset-bottom, 0px))' });

    const firstRuleCard = rulesList?.firstElementChild as HTMLElement | null;
    expect(firstRuleCard?.className).toContain('shrink-0');
  });

  it('shows weight goal on weight step', () => {
    render(<OnboardingWizard onComplete={vi.fn()} />);

    // Step 1 → 2 (hero → name)
    fireEvent.click(screen.getByRole('button', { name: 'Vertel me meer' }));
    fireEvent.change(screen.getByLabelText('Je naam'), { target: { value: 'Jesper' } });
    fireEvent.click(screen.getByRole('button', { name: 'Volgende' }));

    // Step 3 → 4 → 5 → 6 → 7 (educational screens)
    fireEvent.click(screen.getByRole('button', { name: 'Laat me de regels zien' }));
    fireEvent.click(screen.getByRole('button', { name: 'Wat doet mijn lichaam?' }));
    fireEvent.click(screen.getByRole('button', { name: 'Waarom werkt dit?' }));
    fireEvent.click(screen.getByRole('button', { name: 'Wat mag wel en niet?' }));
    fireEvent.click(screen.getByRole('button', { name: 'Nu mijn gegevens' }));

    // Step 8: Weight + preferences
    fireEvent.change(screen.getByLabelText('Huidig (kg)'), { target: { value: '110' } });
    fireEvent.change(screen.getByLabelText('Streefgewicht (kg)'), { target: { value: '100' } });

    expect(screen.getByText('10 kg afvallen in ~6 weken')).toBeInTheDocument();
  });
});
