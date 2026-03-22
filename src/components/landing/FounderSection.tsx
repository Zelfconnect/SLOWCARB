import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const DEFAULT_SPLIT = 78;
const DISCOVERY_CUE_DURATION_MS = 1200;

function clampSplit(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function FounderSection() {
  const [split, setSplit] = useState(DEFAULT_SPLIT);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasShownDiscoveryCue, setHasShownDiscoveryCue] = useState(false);
  const [isDiscoveryCueActive, setIsDiscoveryCueActive] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const proofCardRef = useRef<HTMLDivElement | null>(null);
  const discoveryCueTimeoutRef = useRef<number | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const clearDiscoveryCueTimeout = useCallback(() => {
    if (discoveryCueTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(discoveryCueTimeoutRef.current);
    discoveryCueTimeoutRef.current = null;
  }, []);

  useEffect(() => () => clearDiscoveryCueTimeout(), [clearDiscoveryCueTimeout]);

  useEffect(() => {
    if (!prefersReducedMotion && !hasInteracted) {
      return;
    }

    clearDiscoveryCueTimeout();
    setIsDiscoveryCueActive(false);
  }, [clearDiscoveryCueTimeout, hasInteracted, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || hasInteracted || hasShownDiscoveryCue || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const proofCard = proofCardRef.current;
    if (!proofCard) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      setHasShownDiscoveryCue(true);
      setIsDiscoveryCueActive(true);
      clearDiscoveryCueTimeout();
      discoveryCueTimeoutRef.current = window.setTimeout(() => {
        setIsDiscoveryCueActive(false);
        discoveryCueTimeoutRef.current = null;
      }, DISCOVERY_CUE_DURATION_MS);
      observer.disconnect();
    }, { threshold: 0.55 });

    observer.observe(proofCard);
    return () => observer.disconnect();
  }, [clearDiscoveryCueTimeout, hasInteracted, hasShownDiscoveryCue, prefersReducedMotion]);

  const updateSplitFromClientX = useCallback((clientX: number) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const bounds = viewport.getBoundingClientRect();
    if (bounds.width <= 0) {
      return;
    }

    const nextSplit = clampSplit(((clientX - bounds.left) / bounds.width) * 100);
    setSplit(nextSplit);
  }, []);

  const markAsInteracted = useCallback(() => {
    setHasInteracted(true);
    setHasShownDiscoveryCue(true);
    setIsDiscoveryCueActive(false);
    clearDiscoveryCueTimeout();
  }, [clearDiscoveryCueTimeout]);

  const handleSliderPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    activePointerIdRef.current = event.pointerId;
    setIsDragging(true);
    markAsInteracted();
    event.preventDefault();
    event.currentTarget.focus();
    if ('setPointerCapture' in event.currentTarget) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }, [markAsInteracted]);

  const handleSliderPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    updateSplitFromClientX(event.clientX);
  }, [updateSplitFromClientX]);

  const releasePointer = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    if ('hasPointerCapture' in event.currentTarget && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    activePointerIdRef.current = null;
    setIsDragging(false);
  }, []);

  const handleLostPointerCapture = useCallback(() => {
    activePointerIdRef.current = null;
    setIsDragging(false);
  }, []);

  const handleSliderKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    let nextSplit = split;

    switch (event.key) {
      case 'ArrowLeft':
        nextSplit = clampSplit(split - 1);
        break;
      case 'ArrowRight':
        nextSplit = clampSplit(split + 1);
        break;
      case 'Home':
        nextSplit = 0;
        break;
      case 'End':
        nextSplit = 100;
        break;
      default:
        return;
    }

    event.preventDefault();
    markAsInteracted();
    setSplit(nextSplit);
  }, [markAsInteracted, split]);

  const discoveryCueState = prefersReducedMotion
    ? 'disabled'
    : isDiscoveryCueActive
      ? 'active'
      : hasInteracted || hasShownDiscoveryCue
        ? 'complete'
        : 'idle';

  const scrollToPricing = (event: MouseEvent) => {
    event.preventDefault();
    const element = document.querySelector('#pricing');
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <section id="founder" className="reviews-proof-section relative overflow-hidden bg-surface-paper py-24 md:py-32">
      <div id="reviews" className="pointer-events-none absolute inset-x-0 top-0 h-px -translate-y-24" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="pointer-events-none absolute top-16 left-[-4rem] h-64 w-64 rounded-full bg-sage-100 opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute right-[-5rem] bottom-10 h-72 w-72 rounded-full bg-sage-100 opacity-50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-8 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:gap-10">
          <div className="max-w-xl">
            <span className="motion-lift inline-flex items-center rounded-full bg-surface-paper/80 px-4 py-2 editorial-kicker text-ink-strong shadow-[0_12px_24px_rgba(28,25,23,0.05)] ring-1 ring-warm-200/80 backdrop-blur">
              Het verhaal achter SlowCarb
            </span>
            <h2 className="founder-story-heading mt-6 font-display text-4xl font-bold tracking-tight text-ink-strong md:text-5xl">
              Eerst werkte het bij mij.
            </h2>
            <div className="founder-story-card mt-6 rounded-[2rem] border border-warm-200/80 bg-white/88 p-6 shadow-[0_24px_48px_rgba(28,25,23,0.06)] backdrop-blur md:p-7">
              <div className="founder-story-copy space-y-4 editorial-body text-ink-body">
                <p>
                  98 kilo, vader van een drieling, ADHD, en een baan waarbij ik andere mensen in vorm moest houden terwijl ik zelf de controle kwijt was. Te weinig slaap, te veel ballen in de lucht, en een zak chips die steeds eerder op de bank lag. In een paar maanden: 111 kilo.
                </p>
                <p>
                  Elk dieet vroeg om het enige wat mijn brein niet kan: eindeloos bijhouden. Toen vond ik het Slow-Carb protocol. Vijf regels, geen calorie&#235;n tellen, &#233;&#233;n cheatday per week. Vier weken later: 8 kilo lichter.
                </p>
                <p>
                  Ik kon nog steeds uit eten, nog steeds genieten. Maar de zak chips werd een bewuste keuze op zaterdag in plaats van een automatisme op dinsdag. Meer energie, meer focus, en voor het eerst het gevoel dat ik niet aan het di&#235;ten was, maar gewoon zo at.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-4 border-t border-warm-200/80 pt-5">
                <div className="transform-proof-support-avatar transform-proof-support-avatar--photo">
                  <img
                    src="/images/landing/founder/jesper-smile-thumb.png"
                    alt=""
                    className="transform-proof-support-avatar__image"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div>
                  <p className="font-sans text-xl font-bold text-ink-strong">Jesper</p>
                  <p className="mt-1 editorial-kicker leading-relaxed text-ink-muted">
                    Oprichter SlowCarb &middot; Ex-militair &middot; Vader van drie
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div ref={proofCardRef} className="transform-proof-card motion-surface p-6 md:p-8">
            <div className="relative z-10 flex flex-col">
              <div className="max-w-[34rem]">
                <p className="editorial-kicker text-sage-700">Het bewijs</p>
                <h3 className="transform-proof-title mt-3 font-display text-3xl font-bold tracking-tight text-ink-strong md:text-4xl">
                  Mijn eigen voor en na
                </h3>
                <p className="transform-proof-summary mt-3 max-w-md support-copy text-ink-body">
                  Vier weken Slow-Carb. Geen calorieen tellen. Geen sportschool. Wel resultaat.
                </p>
              </div>

              <div className="transform-proof-stage mt-8" style={{ '--transform-split': `${split}%` } as CSSProperties}>
                <div ref={viewportRef} className="transform-proof-viewport">
                  <figure className="transform-proof-compare" role="img" aria-label="Vergelijking van Jesper voor en na 8 kilo gewichtsverlies">
                    <img src="/images/landing/founder-proof/after.webp" alt="Jesper na zijn gewichtsverlies" loading="eager" decoding="async" />
                    <div className="transform-proof-after" aria-hidden="true">
                      <img src="/images/landing/founder-proof/before.webp" alt="" loading="eager" decoding="async" />
                    </div>
                    <figcaption className="transform-proof-label transform-proof-label--left">Voor</figcaption>
                    <figcaption className="transform-proof-label transform-proof-label--right">Na</figcaption>
                  </figure>
                  <div className="transform-proof-handle-line" aria-hidden="true" />
                  <div
                    role="slider"
                    tabIndex={0}
                    aria-label="Schuif om Jesper voor en na te vergelijken"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(split)}
                    aria-valuetext={`${Math.round(split)}% van de voor-foto zichtbaar`}
                    aria-orientation="horizontal"
                    className="transform-proof-handle"
                    data-discovery-cue={discoveryCueState}
                    data-dragging={isDragging}
                    onKeyDown={handleSliderKeyDown}
                    onPointerDown={handleSliderPointerDown}
                    onPointerMove={handleSliderPointerMove}
                    onPointerUp={releasePointer}
                    onPointerCancel={releasePointer}
                    onLostPointerCapture={handleLostPointerCapture}
                  >
                    <span className="transform-proof-handle-visual" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="transform-proof-footer mt-6">
                <span className="transform-proof-result self-start">8 kg in 4 weken</span>
                <p className="transform-proof-footer-copy support-copy text-ink-body md:max-w-[16rem] md:text-right">
                  Van vastlopen op dieten naar een systeem dat ik elke week kon volhouden.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="transform-proof-support-card motion-surface flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6">
            <div className="flex items-start gap-4">
              <div className="transform-proof-support-icon text-xl">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="max-w-2xl">
                <p className="editorial-kicker text-sage-700">De methode</p>
                <p className="mt-2 support-copy text-ink-body">
                  Het protocol is ontwikkeld door Tim Ferriss en beschreven in <em>The 4-Hour Body</em>. SlowCarb Protocol vertaalt dat naar een praktische app die je elke dag kunt volgen.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:justify-end">
              <div className="transform-proof-support-avatar">T</div>
              <div>
                <p className="font-bold text-ink-strong">Tim Ferriss</p>
                <p className="support-copy text-ink-muted">Auteur, The 4-Hour Body</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center md:mt-8">
          <a href="#pricing" onClick={scrollToPricing} className="transform-proof-cta-link motion-press">
            <span>Word een van de eerste 200 gebruikers</span>
            <span className="transform-proof-cta-arrow" aria-hidden="true">
              <ArrowRight className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
