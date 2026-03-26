import { useEffect, useState } from 'react';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';

interface RuleItem {
  number: number;
  kicker: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  imageHeight: number;
  imageClass: string;
  imageWidth: number;
  maxW: string;
  mediaLeft: boolean;
  mobileImageFirst?: boolean;
  extraImageWrapper?: string;
  isLast?: boolean;
}

const rules: readonly RuleItem[] = [
  {
    number: 1,
    kicker: 'Regel 1 · De basis van vetverbranding',
    title: 'Vermijd "witte" koolhydraten',
    body: 'Geen brood, pasta, rijst, aardappelen of gebak. Klinkt heftig, maar als je ontdekt wat er wél mag, mis je het niet.',
    image: '/images/landing/regels/regel1-cutout-shadow.webp',
    imageAlt: 'White Carbs',
    imageHeight: 3750,
    imageClass: 'scale-125 md:scale-150',
    imageWidth: 3750,
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
    imageHeight: 4219,
    imageClass: 'scale-95 md:scale-105',
    imageWidth: 3375,
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
    imageHeight: 3750,
    imageClass: 'scale-[1.65] md:scale-[1.9]',
    imageWidth: 3750,
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
    imageHeight: 3750,
    imageClass: 'scale-125 md:scale-150',
    imageWidth: 3750,
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
    imageHeight: 3750,
    imageClass: 'scale-150 md:scale-[1.8]',
    imageWidth: 3750,
    maxW: 'max-w-[600px] md:max-w-[900px]',
    mediaLeft: true,
    isLast: true,
  },
];

const MOBILE_BREAKPOINT = '(max-width: 767px)';

function getMediaQueryMatch(query: string) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia(query).matches;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => getMediaQueryMatch(query));

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [query]);

  return matches;
}

export function RulesSection() {
  const { ref: revealRef, prefersReducedMotion } = useRevealOnScroll<HTMLElement>({
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.18,
  });
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT);
  const isGuidedRailEnabled = isMobile && !prefersReducedMotion;

  return (
    <section
      ref={revealRef}
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

        <div
          data-rules-rail="rules"
          data-guided-scroll={isGuidedRailEnabled ? 'true' : 'false'}
          className="rules-rail"
        >
          {rules.map((rule, index) => {
            const mediaReveal = rule.mediaLeft ? 'left' : 'right';
            const copyReveal = rule.mediaLeft ? 'right' : 'left';
            const mediaOrderClass = rule.mobileImageFirst ? 'order-1 md:order-1' : 'order-2 md:order-1';
            const copyOrderClass = rule.mobileImageFirst ? 'order-2 md:order-2' : 'order-1 md:order-2';
            const pairStagger = index + 2;
            const desktopSpacingClass = rule.isLast ? 'mb-0 md:mb-24' : 'mb-0 md:mb-48';

            return (
              <div
                key={rule.number}
                data-rule-panel={rule.number}
                data-reveal-group="rules-pair"
                data-stagger={pairStagger}
                className={`rules-stage grid items-center gap-16 md:grid-cols-2 md:gap-32 ${desktopSpacingClass}`}
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
                      width={rule.imageWidth}
                      height={rule.imageHeight}
                      className={`rules-cutout-image h-auto w-full object-contain drop-shadow-2xl ${rule.maxW} ${rule.imageClass}`}
                      loading="lazy"
                    />
                  </div>
                </div>
                <div
                  data-reveal-part="rules-pair"
                  data-reveal={copyReveal}
                  data-rule-anchor={rule.number}
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
      </div>
    </section>
  );
}
