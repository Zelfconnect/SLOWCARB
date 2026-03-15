import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LandingPageFinal from '@/components/LandingPageFinal';
import * as LandingPageModule from '@/components/LandingPageFinal';

const OriginalIntersectionObserver = window.IntersectionObserver;

type ObserverInstance = {
  callback: IntersectionObserverCallback;
  observed: Set<Element>;
};

const observerInstances: ObserverInstance[] = [];

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '0px';
  readonly thresholds = [];
  private readonly instance: ObserverInstance;

  constructor(callback: IntersectionObserverCallback) {
    this.instance = { callback, observed: new Set() };
    observerInstances.push(this.instance);
  }

  disconnect() {
    this.instance.observed.clear();
  }

  observe(target: Element) {
    this.instance.observed.add(target);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve(target: Element) {
    this.instance.observed.delete(target);
  }
}

afterEach(() => {
  window.IntersectionObserver = OriginalIntersectionObserver;
  observerInstances.length = 0;
});

describe('LandingPageFinal', () => {
  it('exports a default component interface with no named exports', () => {
    expect(typeof LandingPageModule.default).toBe('function');
    expect(Object.keys(LandingPageModule)).toEqual(['default']);
  });

  it('renders all major sections from the landing page', () => {
    render(<LandingPageFinal />);

    expect(screen.getByRole('heading', { name: /8 tot 10/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Herkenbaar?' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Wat als afvallen simpeler was?' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Zo werkt de app' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'De 5 regels. Dat is alles.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Waarom een militair een dieet-app bouwde.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Veelgestelde Vragen' })).toBeInTheDocument();
  });

  it('toggles the mobile menu visibility state', () => {
    render(<LandingPageFinal />);

    const menu = document.getElementById('mobile-menu');
    expect(menu).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Menu openen' }));
    expect(menu).toHaveAttribute('aria-hidden', 'false');

    fireEvent.click(screen.getAllByRole('button', { name: 'Menu sluiten' })[0]);
    expect(menu).toHaveAttribute('aria-hidden', 'true');
  });

  it('toggles FAQ answers open and closed per section', () => {
    render(<LandingPageFinal />);

    const subscriptionQuestion = screen.getByRole('button', { name: /Is dit een abonnement\?/i });
    const gymQuestion = screen.getByRole('button', { name: /Moet ik naar de sportschool\?/i });

    fireEvent.click(subscriptionQuestion);
    fireEvent.click(gymQuestion);
    expect(screen.getByText(/Je betaalt één keer €47/i)).toBeInTheDocument();
    expect(screen.getByText(/SlowCarb is puur voeding/i)).toBeInTheDocument();

    fireEvent.click(subscriptionQuestion);
    expect(screen.queryByText(/Je betaalt één keer €47/i)).not.toBeInTheDocument();
    expect(screen.getByText(/SlowCarb is puur voeding/i)).toBeInTheDocument();
  });

  it('shows sticky CTA after scrolling past offer headline', () => {
    window.IntersectionObserver = IntersectionObserverMock;
    const { getByTestId } = render(<LandingPageFinal />);

    const stickyCta = getByTestId('sticky-cta');
    expect(stickyCta.className).toContain('translate-y-full');

    const observedTarget = document.getElementById('offer-headline');
    expect(observedTarget).not.toBeNull();

    const observer = observerInstances[0];
    expect(observer).toBeDefined();

    act(() => {
      observer.callback(
        [
          {
            target: observedTarget as Element,
            isIntersecting: false,
            boundingClientRect: {
              x: 0,
              y: -8,
              top: -8,
              bottom: -1,
              left: 0,
              right: 0,
              width: 0,
              height: 0,
              toJSON: () => ({}),
            },
            intersectionRect: {
              x: 0,
              y: 0,
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              width: 0,
              height: 0,
              toJSON: () => ({}),
            },
            intersectionRatio: 0,
            rootBounds: null,
            time: 0,
          },
        ],
        {} as IntersectionObserver
      );
    });

    expect(stickyCta.className).toContain('translate-y-0');
  });

  it('opens Stripe checkout from each CTA button', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<LandingPageFinal />);

    const ctaButtons = screen.getAllByTestId('stripe-cta');
    expect(ctaButtons).toHaveLength(6);

    for (const button of ctaButtons) {
      fireEvent.click(button);
    }

    expect(openSpy).toHaveBeenCalledTimes(ctaButtons.length);
    expect(openSpy).toHaveBeenCalledWith('https://buy.stripe.com/5kQ28t0JQ9Geaht9Kb5Rm00', '_blank');
    openSpy.mockRestore();
  });

  it('automatically cycles showcase screenshots', () => {
    vi.useFakeTimers();
    try {
      render(<LandingPageFinal />);

      expect(screen.getByAltText('Dashboard in de SlowCarb app')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(screen.getByAltText('Receptenoverzicht in de SlowCarb app')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(4000 * 3);
      });
      expect(screen.getByAltText('Dashboard in de SlowCarb app')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
