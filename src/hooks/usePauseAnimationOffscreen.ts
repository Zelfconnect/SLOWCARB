import { useEffect, type RefObject } from 'react';

interface UsePauseAnimationOffscreenOptions {
  selector: string;
  rootMargin?: string;
  threshold?: number | number[];
}

export function usePauseAnimationOffscreen(
  containerRef: RefObject<HTMLElement | null>,
  { selector, rootMargin = '0px', threshold = 0.05 }: UsePauseAnimationOffscreenOptions
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      return undefined;
    }

    const targets = Array.from(container.querySelectorAll<HTMLElement>(selector));
    if (targets.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        });
      },
      { root: null, rootMargin, threshold }
    );

    targets.forEach((target) => {
      target.style.animationPlayState = 'paused';
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
      targets.forEach((target) => target.style.removeProperty('animation-play-state'));
    };
  }, [containerRef, rootMargin, selector, threshold]);
}
