import { useEffect, useRef, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

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

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function RulesSection() {
  const mediaRefs = useRef<Array<HTMLDivElement | null>>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const mediaElements = mediaRefs.current.filter((element): element is HTMLDivElement => element !== null);
    if (mediaElements.length === 0) return undefined;

    if (prefersReducedMotion) {
      mediaElements.forEach((element) => {
        element.style.setProperty('--rule-media-parallax', '0px');
      });
      return undefined;
    }

    let frame = 0;

    const updateParallax = () => {
      const viewportMidpoint = window.innerHeight * 0.5;
      mediaElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const delta = viewportMidpoint - (rect.top + rect.height / 2);
        const normalized = clamp(delta / (window.innerHeight * 0.9), -1, 1);
        element.style.setProperty('--rule-media-parallax', `${(normalized * 18).toFixed(2)}px`);
      });
      frame = 0;
    };

    const requestUpdate = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(updateParallax);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [prefersReducedMotion]);

  return (
    <section id="method" className="overflow-hidden bg-surface-paper py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-20 text-center">
          <h2 data-reveal="up" className="mb-6 font-display text-4xl font-bold tracking-tight text-ink-strong md:text-5xl">
            De 5 regels. Dat is alles.
          </h2>
          <p data-reveal="soft" data-stagger="1" className="editorial-body mx-auto max-w-2xl text-ink-body">
            Geen schema&apos;s, geen fases, geen uitzonderingen doordeweeks. Vijf regels volgen, één dag per week vrij.
          </p>
        </div>

        {rules.map((rule, index) => {
          const mediaReveal = rule.mediaLeft ? 'left' : 'right';
          const copyReveal = rule.mediaLeft ? 'right' : 'left';
          const mediaOrderClass = rule.mobileImageFirst ? 'order-1 md:order-1' : 'order-2 md:order-1';
          const copyOrderClass = rule.mobileImageFirst ? 'order-2 md:order-2' : 'order-1 md:order-2';

          return (
            <div
              key={rule.number}
              className={`rules-stage grid items-center gap-16 md:grid-cols-2 md:gap-32 ${rule.isLast ? 'mb-16 md:mb-24' : 'mb-32 md:mb-48'}`}
            >
              <div
                ref={(element) => {
                  mediaRefs.current[index] = element;
                }}
                data-reveal={mediaReveal}
                data-stagger={index * 2}
                className={`${mediaOrderClass} rules-media-layer relative ${rule.extraImageWrapper ?? ''}`}
                style={{ '--rule-media-parallax': '0px' } as CSSProperties}
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
                data-reveal={copyReveal}
                data-stagger={index * 2 + 1}
                className={`${copyOrderClass} z-10 text-center md:text-left`}
              >
                <div className="rules-copy-stack">
                  <span className="editorial-kicker mb-3 block text-ink-strong">{rule.kicker}</span>
                  <h3 className="mb-6 font-display text-4xl font-bold leading-tight text-ink-strong md:text-5xl">{rule.title}</h3>
                  <p className="editorial-body text-ink-body">{rule.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
