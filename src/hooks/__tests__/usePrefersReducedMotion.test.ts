import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

function installMatchMedia(initialMatches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mediaQueryList = {
    matches: initialMatches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addListener: vi.fn((listener: (event: MediaQueryListEvent) => void) => listeners.add(listener)),
    removeListener: vi.fn((listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener)),
    addEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener)),
    removeEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener)),
    dispatchEvent: vi.fn(),
    trigger(nextMatches: boolean) {
      mediaQueryList.matches = nextMatches;
      const event = { matches: nextMatches, media: mediaQueryList.media } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockReturnValue(mediaQueryList),
  });

  return mediaQueryList;
}

afterEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: undefined,
  });
  vi.restoreAllMocks();
});

describe('usePrefersReducedMotion', () => {
  it('reads the current media query state on first render', () => {
    installMatchMedia(true);

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(true);
  });

  it('updates when the media query preference changes', () => {
    const mediaQueryList = installMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);

    act(() => {
      mediaQueryList.trigger(true);
    });

    expect(result.current).toBe(true);
  });
});
