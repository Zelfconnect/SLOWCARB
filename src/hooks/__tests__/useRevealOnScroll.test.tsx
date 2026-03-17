import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';

function installMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function createIntersectionObserverMock() {
  let callback: IntersectionObserverCallback | null = null;
  let instance: {
    observe: ReturnType<typeof vi.fn>;
    unobserve: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  } | null = null;

  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = '0px';
    readonly thresholds = [];
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();

    constructor(observerCallback: IntersectionObserverCallback) {
      callback = observerCallback;
      instance = {
        observe: this.observe,
        unobserve: this.unobserve,
        disconnect: this.disconnect,
      };
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: MockIntersectionObserver,
  });

  return {
    getCallback: () => callback,
    getInstance: () => instance,
  };
}

function RevealHarness() {
  const { ref, canReveal } = useRevealOnScroll<HTMLDivElement>();

  return (
    <div ref={ref} data-testid="root" data-can-reveal={canReveal ? 'true' : 'false'}>
      <div data-testid="first" data-reveal="up" />
      <div data-testid="second" data-reveal="soft" data-stagger="3" />
    </div>
  );
}

afterEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: undefined,
  });
  Object.defineProperty(window, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: undefined,
  });
  vi.restoreAllMocks();
});

describe('useRevealOnScroll', () => {
  it('marks reveal targets visible when IntersectionObserver is unavailable', async () => {
    installMatchMedia(false);
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: undefined,
    });

    render(<RevealHarness />);

    expect(screen.getByTestId('root')).toHaveAttribute('data-can-reveal', 'false');

    await waitFor(() => {
      expect(screen.getByTestId('first')).toHaveAttribute('data-reveal-visible', 'true');
      expect(screen.getByTestId('second')).toHaveAttribute('data-reveal-visible', 'true');
    });
  });

  it('marks reveal targets visible when reduced motion is enabled', async () => {
    installMatchMedia(true);
    createIntersectionObserverMock();

    render(<RevealHarness />);

    expect(screen.getByTestId('root')).toHaveAttribute('data-can-reveal', 'false');

    await waitFor(() => {
      expect(screen.getByTestId('first')).toHaveAttribute('data-reveal-visible', 'true');
      expect(screen.getByTestId('second')).toHaveAttribute('data-reveal-visible', 'true');
    });
  });

  it('observes targets and sets stagger metadata when motion is allowed', async () => {
    installMatchMedia(false);
    const observerMock = createIntersectionObserverMock();

    render(<RevealHarness />);

    await waitFor(() => {
      expect(observerMock.getInstance()?.observe).toHaveBeenCalledTimes(2);
    });

    const instance = observerMock.getInstance();
    const callback = observerMock.getCallback();
    const firstTarget = screen.getByTestId('first');
    const secondTarget = screen.getByTestId('second');

    expect(screen.getByTestId('root')).toHaveAttribute('data-can-reveal', 'true');
    expect(secondTarget.style.getPropertyValue('--motion-stagger-index')).toBe('3');

    act(() => {
      callback?.(
        [{ target: firstTarget, isIntersecting: true } as IntersectionObserverEntry],
        instance as unknown as IntersectionObserver
      );
    });

    expect(firstTarget).toHaveAttribute('data-reveal-visible', 'true');
    expect(instance?.unobserve).toHaveBeenCalledWith(firstTarget);
  });
});
