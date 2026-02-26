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
  it('renders all 8 core landing sections after the hero', () => {
    const { container } = render(<LandingPageFinal />);

    const sections = container.querySelectorAll('section');
    expect(sections).toHaveLength(9);

    expect(screen.getByRole('heading', { name: /Ken je dit\?/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /De 5 Regels/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Alles wat je nodig hebt/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Wat gebruikers zeggen/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Waarom ik SlowCarb heb gebouwd/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /SlowCarb Lifetime Access/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /FAQ/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Klaar om te beginnen\?/i })).toBeInTheDocument();
  });

  it('renders founder section as editorial content with quote and signature', () => {
    render(<LandingPageFinal />);

    expect(screen.getByText(/Founder Note/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Je hebt geen motivatieprobleem\. Je hebt een systeemprobleem\./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Jesper Horst, oprichter van SlowCarb/i)).toBeInTheDocument();
  });

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
});
