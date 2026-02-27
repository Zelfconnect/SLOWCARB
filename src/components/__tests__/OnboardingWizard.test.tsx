import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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
  afterEach(() => {
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      writable: true,
      value: undefined,
    });
  });

  const setupVisualViewport = (height: number) => {
    const resizeHandlers = new Set<() => void>();
    const scrollHandlers = new Set<() => void>();

    const visualViewport = {
      get height() {
        return height;
      },
      set height(value: number) {
        height = value;
      },
      addEventListener: (type: string, handler: () => void) => {
        if (type === 'resize') resizeHandlers.add(handler);
        if (type === 'scroll') scrollHandlers.add(handler);
      },
      removeEventListener: (type: string, handler: () => void) => {
        if (type === 'resize') resizeHandlers.delete(handler);
        if (type === 'scroll') scrollHandlers.delete(handler);
      },
      triggerResize: () => {
        resizeHandlers.forEach((handler) => handler());
      },
      triggerScroll: () => {
        scrollHandlers.forEach((handler) => handler());
      },
    };

    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      writable: true,
      value: visualViewport,
    });

    return visualViewport;
  };

  const goToWeightStep = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Vertel me meer' }));
    fireEvent.change(screen.getByLabelText('Je naam'), { target: { value: 'Jesper' } });
    fireEvent.click(screen.getByRole('button', { name: 'Volgende' }));
    fireEvent.click(screen.getByRole('button', { name: 'Laat me de regels zien' }));
    fireEvent.click(screen.getByRole('button', { name: 'Wat doet mijn lichaam?' }));
    fireEvent.click(screen.getByRole('button', { name: 'Waarom werkt dit?' }));
    fireEvent.click(screen.getByRole('button', { name: 'Wat mag wel en niet?' }));
    fireEvent.click(screen.getByRole('button', { name: 'Nu mijn gegevens' }));
  };

  it('renders the onboarding dialog', () => {
    render(<OnboardingWizard onComplete={vi.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Introductie' })).toBeInTheDocument();
  });

  it('uses Safari-safe fullscreen viewport classes for dialog and step shell', () => {
    render(<OnboardingWizard onComplete={vi.fn()} />);
    const dialog = screen.getByRole('dialog', { name: 'Introductie' });
    expect(dialog.className).toContain('h-app-screen');

    const stepShell = document.body.querySelector('.app-screen');
    expect(stepShell).toBeInTheDocument();
    expect(stepShell?.className).toContain('h-full');

    const stepScrollContainer = stepShell?.querySelector('.overflow-y-auto');
    expect(stepScrollContainer).toHaveStyle({ paddingBottom: 'calc(120px + env(safe-area-inset-bottom, 0px))' });
  });

  it('keeps onboarding shell full-height after step changes so CTA stays bottom-anchored', async () => {
    render(<OnboardingWizard onComplete={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Vertel me meer' }));
    const nameInput = await screen.findByLabelText('Je naam');
    fireEvent.change(nameInput, { target: { value: 'Jesper' } });
    fireEvent.click(screen.getByRole('button', { name: 'Volgende' }));

    const stepShell = document.body.querySelector('.app-screen');
    expect(stepShell?.className).toContain('h-full');
  });

  it('hides footer CTA and adds keyboard inset to scroll padding on name step', () => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 900,
    });

    setupVisualViewport(900);
    render(<OnboardingWizard onComplete={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Vertel me meer' }));

    const input = screen.getByLabelText('Je naam');
    act(() => {
      fireEvent.focus(input);
      (window.visualViewport as { height: number; triggerResize: () => void }).height = 500;
      (window.visualViewport as { height: number; triggerResize: () => void }).triggerResize();
    });

    const stepShell = document.body.querySelector('.app-screen');
    const stepScrollContainer = stepShell?.querySelector('.overflow-y-auto');
    const ctaFooter = screen.getByRole('button', { name: 'Volgende', hidden: true }).parentElement;

    expect(stepScrollContainer?.getAttribute('style')).toContain('424px');
    expect(ctaFooter).toHaveAttribute('aria-hidden', 'true');
    expect(ctaFooter?.className).toContain('pointer-events-none');
  });

  it('adds keyboard inset to scroll padding on weight step', () => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 900,
    });

    setupVisualViewport(900);
    render(<OnboardingWizard onComplete={vi.fn()} />);

    goToWeightStep();

    const currentWeightInput = screen.getByLabelText('Huidig (kg)');
    act(() => {
      currentWeightInput.focus();
      fireEvent.focusIn(currentWeightInput);
      (window.visualViewport as { height: number; triggerResize: () => void }).height = 500;
      (window.visualViewport as { height: number; triggerResize: () => void }).triggerResize();
    });

    const stepShell = document.body.querySelector('.app-screen');
    const stepScrollContainer = stepShell?.querySelector('.overflow-y-auto');
    expect(stepScrollContainer?.getAttribute('style')).toContain('424px');
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

    goToWeightStep();

    fireEvent.change(screen.getByLabelText('Huidig (kg)'), { target: { value: '110' } });
    fireEvent.change(screen.getByLabelText('Streefgewicht (kg)'), { target: { value: '100' } });

    expect(screen.getByText('10 kg afvallen in ~6 weken')).toBeInTheDocument();
  });
});
