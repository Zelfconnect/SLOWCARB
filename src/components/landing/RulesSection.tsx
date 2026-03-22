import { useEffect, useRef } from 'react';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';

interface RuleItem {
  number: number;
  kicker: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  imageClass: string;
  maxW: string;
  mediaLeft: boolean;
  mobileImageFirst?: boolean;
  extraImageWrapper?: string;
  isLast?: boolean;
}

const rules = [
  {
    number: 1,
    kicker: 'Regel 1 · De basis van vetverbranding',
    title: 'Vermijd "witte" koolhydraten',
    body: 'Geen brood, pasta, rijst, aardappelen of gebak. Klinkt heftig, maar als je ontdekt wat er wél mag, mis je het niet.',
    image: '/images/landing/regels/regel1-cutout-shadow.webp',
    imageAlt: 'White Carbs',
    imageClass: 'scale-125 md:scale-150',
    maxW: 'max-w-[500px] md:max-w-[800px]',
    mediaLeft: true,
  },
  {
    number: 2,
    kicker: 'Regel 2 · Herhaling verslaat variatie',
    title: 'Eet steeds dezelfde maaltijden',
    body: 'Kies 3-4 maaltijden die je lekker vindt en eet ze op repeat. Klinkt saai, is het niet. Het neemt álle beslissingsstress weg. Variatie voeg je later toe.',
    image: '/images/landing/regels/regel2-cutout-shadow.webp',
    imageAlt: 'Chili con carne',
    imageClass: 'scale-95 md:scale-105',
    maxW: 'max-w-[350px] md:max-w-[550px]',
    mediaLeft: false,
  },
  {
    number: 3,
    kicker: 'Regel 3 · Vloeibare suiker is onzichtbaar',
    title: 'Drink geen calorieën',
    body: 'Water, koffie (zwart), thee. Geen sap, geen frisdrank, geen havermelk-latte. Eén glas rode wijn per dag mag. De rest niet.',
    image: '/images/landing/regels/regel3-cutout-shadow.webp',
    imageAlt: 'Cola glass',
    imageClass: 'scale-[1.65] md:scale-[1.9]',
    maxW: 'max-w-[500px] md:max-w-[750px]',
    mediaLeft: true,
    extraImageWrapper: 'mt-16 md:mt-24',
  },
  {
    number: 4,
    kicker: 'Regel 4 · Fructose is suiker in vermomming',
    title: 'Eet geen fruit',
    body: 'Ja, ook bananen en druiven. Fruit bevat fructose en dat remt vetverbranding. Avocado en tomaat mogen wél, die bevatten nauwelijks fructose.',
    image: '/images/landing/regels/regel4-cutout-shadow.webp',
    imageAlt: 'Fruit',
    imageClass: 'scale-125 md:scale-150',
    maxW: 'max-w-[500px] md:max-w-[800px]',
    mediaLeft: false,
  },
  {
    number: 5,
    kicker: 'Regel 5 · De dag die het dieet laat werken',
    title: 'Eén cheatday per week',
    body: 'Elke week één dag alles eten. Alles. Dit is geen beloning maar een metabole reset. De leptin-spike voorkomt dat je lichaam in de spaarstand gaat. Tim Ferriss at 4.000+ kcal op zijn cheatdays en viel toch af.',
    image: '/images/landing/regels/regel5-cutout-shadow.webp',
    imageAlt: 'Cheatday Junkfood',
    imageClass: 'scale-150 md:scale-[1.8]',
    maxW: 'max-w-[600px] md:max-w-[900px]',
    mediaLeft: true,
    mobileImageFirst: true,
    isLast: true,
  },
] satisfies readonly RuleItem[];

const MOBILE_BREAKPOINT = '(max-width: 767px)';
const SNAP_TARGET_OFFSET = 16;
const SNAP_ALIGN_TOLERANCE = 24;
const SNAP_STAGE_ABOVE_TOLERANCE = 96;
const SNAP_STAGE_BELOW_TOLERANCE = 120;
const SCROLL_SETTLE_DELAY_MS = 140;
const PROGRAMMATIC_SCROLL_RELEASE_MS = 420;

function useMobileRulesScrollSettle(
  sectionRef: { current: HTMLElement | null },
  prefersReducedMotion: boolean,
) {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const section = sectionRef.current;
    if (!section) {
      return undefined;
    }

    const mobileQuery = window.matchMedia(MOBILE_BREAKPOINT);
    if (!mobileQuery.matches) {
      return undefined;
    }

    let settleTimer: ReturnType<typeof window.setTimeout> | null = null;
    let releaseTimer: ReturnType<typeof window.setTimeout> | null = null;
    let isProgrammaticScroll = false;
    let lastScrollY = window.scrollY;
    let lastDirection: 'down' | 'up' = 'down';

    const clearTimer = (timer: ReturnType<typeof window.setTimeout> | null) => {
      if (timer !== null) {
        window.clearTimeout(timer);
      }
    };

    const releaseProgrammaticScroll = () => {
      clearTimer(releaseTimer);
      releaseTimer = window.setTimeout(() => {
        isProgrammaticScroll = false;
      }, prefersReducedMotion ? 0 : PROGRAMMATIC_SCROLL_RELEASE_MS);
    };

    const maybeSettleToRule = () => {
      if (!mobileQuery.matches || isProgrammaticScroll) {
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (sectionRect.bottom < viewportHeight * 0.12 || sectionRect.top > viewportHeight * 0.88) {
        return;
      }

      const stagePositions = Array.from(section.querySelectorAll<HTMLElement>('.rules-stage'))
        .map((stage) => ({
          stage,
          top: stage.getBoundingClientRect().top,
        }));

      if (stagePositions.length === 0) {
        return;
      }

      const targetStage = lastDirection === 'down'
        ? stagePositions.find(({ top }) => top >= SNAP_TARGET_OFFSET - SNAP_STAGE_ABOVE_TOLERANCE) ?? stagePositions[stagePositions.length - 1]
        : [...stagePositions].reverse().find(({ top }) => top <= SNAP_TARGET_OFFSET + SNAP_STAGE_BELOW_TOLERANCE) ?? stagePositions[0];

      const delta = targetStage.top - SNAP_TARGET_OFFSET;
      if (Math.abs(delta) <= SNAP_ALIGN_TOLERANCE) {
        return;
      }

      isProgrammaticScroll = true;
      window.scrollTo({
        top: window.scrollY + delta,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
      releaseProgrammaticScroll();
    };

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      if (!isProgrammaticScroll) {
        lastDirection = nextScrollY >= lastScrollY ? 'down' : 'up';
      }
      lastScrollY = nextScrollY;

      clearTimer(settleTimer);
      settleTimer = window.setTimeout(maybeSettleToRule, SCROLL_SETTLE_DELAY_MS);
    };

    const handleQueryChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        clearTimer(settleTimer);
        clearTimer(releaseTimer);
        isProgrammaticScroll = false;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', handleQueryChange);
    } else if (typeof mobileQuery.addListener === 'function') {
      mobileQuery.addListener(handleQueryChange);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimer(settleTimer);
      clearTimer(releaseTimer);

      if (typeof mobileQuery.removeEventListener === 'function') {
        mobileQuery.removeEventListener('change', handleQueryChange);
      } else if (typeof mobileQuery.removeListener === 'function') {
        mobileQuery.removeListener(handleQueryChange);
      }
    };
  }, [prefersReducedMotion, sectionRef]);
}

export function RulesSection() {
  const { ref: revealRef, prefersReducedMotion } = useRevealOnScroll<HTMLElement>({
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.18,
  });
  const sectionRef = useRef<HTMLElement | null>(null);

  useMobileRulesScrollSettle(sectionRef, prefersReducedMotion);

  return (
    <section
      ref={(node) => {
        sectionRef.current = node;
        revealRef.current = node;
      }}
      id="method"
      className="overflow-hidden bg-surface-paper py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-20 text-center">
          <h2 data-reveal="up" className="landing-balance mb-6 font-display text-4xl font-bold tracking-tight text-ink-strong md:text-5xl">
            De 5 regels. Dat is alles.
          </h2>
          <p data-reveal="soft" data-stagger="1" className="landing-pretty editorial-body mx-auto max-w-2xl text-ink-body">
            Geen schema&apos;s, geen fases, geen uitzonderingen doordeweeks. Vijf regels volgen, één dag per week vrij.
          </p>
        </div>

        {rules.map((rule, index) => {
          const mediaReveal = rule.mediaLeft ? 'left' : 'right';
          const copyReveal = rule.mediaLeft ? 'right' : 'left';
          const mediaOrderClass = rule.mobileImageFirst ? 'order-1 md:order-1' : 'order-2 md:order-1';
          const copyOrderClass = rule.mobileImageFirst ? 'order-2 md:order-2' : 'order-1 md:order-2';
          const pairStagger = index + 2;

          return (
            <div
              key={rule.number}
              data-reveal-group="rules-pair"
              data-stagger={pairStagger}
              className={`rules-stage grid items-center gap-16 md:grid-cols-2 md:gap-32 ${rule.isLast ? 'mb-16 md:mb-24' : 'mb-32 md:mb-48'}`}
            >
              <div
                data-reveal-part="rules-pair"
                data-reveal={mediaReveal}
                className={`${mediaOrderClass} rules-media-layer relative ${rule.extraImageWrapper ?? ''}`}
              >
                <div className="rules-media-glow" aria-hidden="true" />
                <div className="rules-media-parallax">
                  <img
                    src={rule.image}
                    alt={rule.imageAlt}
                    className={`rules-cutout-image h-auto w-full object-contain drop-shadow-2xl ${rule.maxW} ${rule.imageClass}`}
                    loading="lazy"
                  />
                </div>
              </div>
              <div
                data-reveal-part="rules-pair"
                data-reveal={copyReveal}
                className={`${copyOrderClass} z-10 text-center md:text-left`}
              >
                <div className="rules-copy-stack">
                  <span className="editorial-kicker mb-3 block text-ink-strong">{rule.kicker}</span>
                  <h3 className="landing-balance mb-6 font-display text-4xl font-bold leading-tight text-ink-strong md:text-5xl">{rule.title}</h3>
                  <p className="landing-pretty editorial-body text-ink-body">{rule.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
