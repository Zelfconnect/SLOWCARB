import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface UseRevealOnScrollOptions {
  once?: boolean;
  rootMargin?: string;
  selector?: string;
  threshold?: number | number[];
}

function supportsIntersectionObserver() {
  return typeof window !== 'undefined' && typeof window.IntersectionObserver === 'function';
}

export function useRevealOnScroll<T extends HTMLElement>({
  once = true,
  rootMargin = '0px 0px -12% 0px',
  selector = '[data-reveal]:not([data-reveal-part]), [data-reveal-group]',
  threshold = 0.18,
}: UseRevealOnScrollOptions = {}) {
  const ref = useRef<T | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const canReveal = supportsIntersectionObserver() && !prefersReducedMotion;

  useEffect(() => {
    const container = ref.current;
    if (!container) return undefined;

    const targets = Array.from(container.querySelectorAll<HTMLElement>(selector));
    if (targets.length === 0) return undefined;

    const transitionEndHandlers = new WeakMap<HTMLElement, EventListener>();

    const clearWillChange = (target: HTMLElement) => {
      const handler = transitionEndHandlers.get(target);
      if (handler) {
        target.removeEventListener('transitionend', handler);
        transitionEndHandlers.delete(target);
      }
      target.style.removeProperty('will-change');
    };

    const markVisible = (target: HTMLElement) => {
      // Clear any prior handler before re-applying will-change
      const priorHandler = transitionEndHandlers.get(target);
      if (priorHandler) {
        target.removeEventListener('transitionend', priorHandler);
        transitionEndHandlers.delete(target);
      }
      target.style.willChange = 'opacity, transform';
      target.dataset.revealVisible = 'true';
      const onTransitionEnd: EventListener = (event) => {
        const transitionEvent = event as TransitionEvent;
        if (transitionEvent.propertyName !== 'opacity' && transitionEvent.propertyName !== 'transform') {
          return;
        }
        clearWillChange(target);
      };
      transitionEndHandlers.set(target, onTransitionEnd);
      target.addEventListener('transitionend', onTransitionEnd);
    };

    if (!canReveal) {
      targets.forEach(markVisible);
      return undefined;
    }

    targets.forEach((target) => {
      if (target.dataset.stagger && !target.style.getPropertyValue('--motion-stagger-index')) {
        target.style.setProperty('--motion-stagger-index', target.dataset.stagger);
      }
      clearWillChange(target);
      delete target.dataset.revealVisible;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            markVisible(target);
            if (once) observer.unobserve(target);
            return;
          }

          if (!once) {
            clearWillChange(target);
            delete target.dataset.revealVisible;
          }
        });
      },
      { rootMargin, threshold }
    );

    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      targets.forEach((target) => clearWillChange(target));
    };
  }, [canReveal, once, rootMargin, selector, threshold]);

  return { ref, canReveal, prefersReducedMotion };
}
