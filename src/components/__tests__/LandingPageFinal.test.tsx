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
});
