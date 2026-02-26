import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import LandingPageFinal from '@/components/LandingPageFinal';

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
});

describe('LandingPageFinal', () => {
  it('shows first two sections immediately and keeps later sections visible via fallback opacity', () => {
    window.IntersectionObserver = IntersectionObserverMock;
    const { container } = render(<LandingPageFinal />);

    const eyebrow = screen.getByText(/Herkenbaar\?/i);
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
    expect(screen.getByText(/Herkenbaar\?/i)).toBeInTheDocument();
  });

  it('shows the trust indicator below the main hero CTA', () => {
    window.IntersectionObserver = IntersectionObserverMock;
    render(<LandingPageFinal />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Verlies 8–10 kg in 6 weken zonder calorieën te tellen of honger te lijden',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Veilige betaling via Stripe • 30 dagen niet-goed-geld-terug • Direct toegang')
    ).toBeInTheDocument();
  });

  it('renders hero headline with editorial Fraunces styling', () => {
    window.IntersectionObserver = IntersectionObserverMock;
    render(<LandingPageFinal />);

    const headline = screen.getByTestId('landing-hero-headline');
    expect(headline.className).toContain("font-['Fraunces']");
    expect(headline.className).toContain('font-[900]');
  });

  it('renders the founder why editorial section with SF and ADHD context', () => {
    window.IntersectionObserver = IntersectionObserverMock;
    render(<LandingPageFinal />);

    expect(screen.getByTestId('founder-editorial-quote')).toHaveTextContent(
      'Ik wilde een slowcarb systeem dat werkt op mijn slechtste ADHD-dag, niet alleen op mijn beste.'
    );
    expect(
      screen.getByText(
        'Ik ben Jesper, ik woon in San Francisco en ik heb ADHD. Ik viel telkens terug omdat elke dieet-app meer keuzes en frictie toevoegde.'
      )
    ).toBeInTheDocument();
  });

  it('shows trust footer legal links including imprint', () => {
    window.IntersectionObserver = IntersectionObserverMock;
    render(<LandingPageFinal />);

    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: 'Voorwaarden' })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: 'Terugbetalingsbeleid' })).toHaveAttribute('href', '/refund-policy');
    expect(screen.getByRole('link', { name: 'Imprint' })).toHaveAttribute('href', '/imprint');
  });

  it('shows a placeholder proof section for user results', () => {
    window.IntersectionObserver = IntersectionObserverMock;
    render(<LandingPageFinal />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Resultaten van gebruikers' })
    ).toBeInTheDocument();
    expect(screen.getByText('Naam gebruiker 1')).toBeInTheDocument();
    expect(screen.getByText('Resultaat gebruiker 1')).toBeInTheDocument();
    expect(screen.getAllByText(/Naam gebruiker/)).toHaveLength(3);
  });

  it('shows the value stack in the pricing section', () => {
    window.IntersectionObserver = IntersectionObserverMock;
    render(<LandingPageFinal />);

    expect(screen.getByText('Value €197')).toBeInTheDocument();
    expect(screen.getByText('Pay €29')).toBeInTheDocument();
  });
});
