import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { captureLandingEmail } from '@/lib/emailCapture';
import { shareText } from '@/lib/share';
import LandingPageFinal from '@/components/LandingPageFinal';

vi.mock('@/lib/emailCapture', () => ({
  captureLandingEmail: vi.fn(),
}));

vi.mock('@/lib/share', () => ({
  shareText: vi.fn().mockResolvedValue('native'),
}));

const captureLandingEmailMock = vi.mocked(captureLandingEmail);
const shareTextMock = vi.mocked(shareText);
const OriginalIntersectionObserver = window.IntersectionObserver;

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '0px';
  readonly thresholds = [];

  disconnect() {}

  observe() {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve() {}
}

afterEach(() => {
  window.IntersectionObserver = OriginalIntersectionObserver;
  captureLandingEmailMock.mockReset();
  shareTextMock.mockReset();
  localStorage.removeItem('slowcarb_profile');
});

describe('LandingPageFinal', () => {
  it('shows first two sections immediately and keeps later sections visible via fallback opacity', () => {
    window.IntersectionObserver = IntersectionObserverMock;
    const { container } = render(<LandingPageFinal />);

    const eyebrow = screen.getAllByText(/Herken je dit\?/i)[0];
    expect(eyebrow).toHaveClass('text-sm', 'font-bold', 'tracking-wider', 'text-gray-600');

    const painHeader = container.querySelector('section[data-index="1"] > div');
    expect(painHeader).not.toBeNull();
    expect(painHeader?.className).toContain('opacity-100');
    expect(painHeader?.className).toContain('translate-y-0');

    const rulesHeader = container.querySelector('section[data-index="2"] > div > div');
    expect(rulesHeader).not.toBeNull();
    expect(rulesHeader?.className).toContain('opacity-100');
    expect(rulesHeader?.className).toContain('translate-y-6');
  });

  it('renders safely when IntersectionObserver is unavailable', () => {
    // Progressive enhancement guard: app should still render without observer support.
    // @ts-expect-error Testing runtime fallback when browser API is missing.
    window.IntersectionObserver = undefined;

    render(<LandingPageFinal />);
    expect(screen.getAllByText(/Herken je dit\?/i).length).toBeGreaterThan(0);
  });

  it('renders the secondary hero CTA that opens the quiz flow', () => {
    render(<LandingPageFinal />);

    const quizLink = screen.getByRole('link', { name: /Doe de quiz/i });
    expect(quizLink).toHaveAttribute('href', '/quiz');
  });

  it('shares the app preview link when returning-user quick action is clicked', async () => {
    localStorage.setItem('slowcarb_profile', JSON.stringify({ hasCompletedOnboarding: true }));
    render(<LandingPageFinal />);

    fireEvent.click(await screen.findByRole('button', { name: /Deel preview/i }));

    await waitFor(() => {
      expect(shareTextMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'SlowCarb preview',
          url: expect.stringMatching(/\/\?app=1$/),
        })
      );
    });
  });

  it('submits the capture form and shows success feedback', async () => {
    captureLandingEmailMock.mockResolvedValueOnce();
    render(<LandingPageFinal />);

    const emailInput = screen.getByLabelText(/Geen haast\? Laat je e-mailadres achter/i);
    fireEvent.change(emailInput, { target: { value: 'Test@Example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Houd me op de hoogte/i }));

    await waitFor(() => {
      expect(captureLandingEmailMock).toHaveBeenCalledWith('Test@Example.com');
    });

    expect(
      screen.getByText(/Top, je staat op de lijst. We houden je op de hoogte./i)
    ).toBeInTheDocument();
    const checkoutLink = screen.getByRole('link', { name: /Ga door naar aankoop/i });
    expect(checkoutLink).toHaveAttribute('href', 'https://buy.stripe.com/5kQ28t0JQ9Geaht9Kb5Rm00');
  });

  it('shows an error message when capture submit fails', async () => {
    captureLandingEmailMock.mockRejectedValueOnce(new Error('insert failed'));
    render(<LandingPageFinal />);

    const emailInput = screen.getByLabelText(/Geen haast\? Laat je e-mailadres achter/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Houd me op de hoogte/i }));

    expect(
      await screen.findByText(/Opslaan mislukt. Probeer het zo nog eens./i)
    ).toBeInTheDocument();
  });
});
