import React from 'react';
import { render, screen, within } from '@testing-library/react';
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

  it('renders the trust bar under the hero section', () => {
    window.IntersectionObserver = IntersectionObserverMock;
    const { container } = render(<LandingPageFinal />);

    const trustBar = screen.getByRole('region', { name: /vertrouwen en zekerheid/i });
    expect(trustBar).toBeInTheDocument();
    const trustBarScope = within(trustBar);
    expect(trustBarScope.getByText('Veilig afrekenen')).toBeInTheDocument();
    expect(trustBarScope.getByText('30 dagen geld-terug')).toBeInTheDocument();
    expect(trustBarScope.getByText('EU-conform')).toBeInTheDocument();
    expect(trustBarScope.getByText('Direct toegang')).toBeInTheDocument();

    const heroSection = container.querySelector('section[data-index="0"]');
    const painSection = container.querySelector('section[data-index="1"]');
    const trustSection = screen.getByTestId('landing-trust-bar');
    expect(heroSection).not.toBeNull();
    expect(painSection).not.toBeNull();
    expect(trustSection.compareDocumentPosition(heroSection as Node)).toBe(
      Node.DOCUMENT_POSITION_PRECEDING
    );
    expect(trustSection.compareDocumentPosition(painSection as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  it('renders footer links to legal pages and contact email', () => {
    window.IntersectionObserver = IntersectionObserverMock;
    render(<LandingPageFinal />);

    expect(screen.getByRole('link', { name: 'Privacybeleid' })).toHaveAttribute('href', '/privacy-policy');
    expect(screen.getByRole('link', { name: 'Algemene voorwaarden' })).toHaveAttribute('href', '/terms-of-service');
    expect(screen.getByRole('link', { name: 'Refundbeleid' })).toHaveAttribute('href', '/refund-policy');
    expect(screen.getByRole('link', { name: 'Contact opnemen' })).toHaveAttribute(
      'href',
      'mailto:hello@slowcarb.nl'
    );
  });
});
