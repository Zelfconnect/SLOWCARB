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

describe('Landing hero copy', () => {
  it('shows the updated hero subtitle', () => {
    window.IntersectionObserver = IntersectionObserverMock;
    render(<LandingPageFinal />);

    expect(
      screen.getByText(
        'Voor drukke ADHD-hoofden: 5 simpele regels, 50+ no-brainer recepten en een boodschappenflow die je elke week op rails houdt.'
      )
    ).toBeInTheDocument();
  });
});
