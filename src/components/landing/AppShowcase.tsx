import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { trackLanding } from './analytics';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const steps = [
  { kicker: 'Stap 1', title: 'Open je dashboard', body: 'Drie maaltijden. Vijf regels. E\u00e9n scherm dat laat zien of je op koers ligt. Geen getallen, geen grafieken, geen stress.', image: '/images/landing/phonescreens/phonescreen1.webp' },
  { kicker: 'Stap 2', title: 'Kies een recept', body: 'Alles wat je ziet mag. Filter op tijd of airfryer, tik op een recept, en je boodschappenlijst is klaar. Vanavond al op tafel.', image: '/images/landing/phonescreens/phonescreen2.webp' },
  { kicker: 'Stap 3', title: 'Snap wat er in je lijf gebeurt', body: 'Elke dag een korte uitleg: waarom je lichaam nu vet verbrandt, wat de cheatday doet, en waarom je je op dag 4 even beroerd voelt. Snappen = volhouden.', image: '/images/landing/phonescreens/phonescreen3.webp' },
  { kicker: 'Stap 4', title: 'AmmoCheck: altijd voorbereid', body: 'Een checklist van wat er in je koelkast en voorraadkast moet liggen. Als het in huis is, hoef je niet na te denken. Geen nadenken = geen foute keuzes.', image: '/images/landing/phonescreens/phonescreen4.webp' },
] as const;

function useTrackObserver(
  trackRef: RefObject<HTMLDivElement | null>,
  onActiveChange: (index: number) => void,
) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIndex = 0;
        let bestRatio = 0;
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIndex = index;
          }
        });
        if (bestRatio > 0.5) onActiveChange(bestIndex);
      },
      { root: track, threshold: [0.25, 0.5, 0.75, 0.95] }
    );

    track.querySelectorAll('[data-slide]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [trackRef, onActiveChange]);
}

export function AppShowcase() {
  const [active, setActive] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const desktopTrackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleActiveChange = useCallback((index: number) => {
    setActive(index);
    trackLanding('landing_showcase_swipe', { step: index + 1 });
  }, []);

  useTrackObserver(mobileTrackRef, handleActiveChange);
  useTrackObserver(desktopTrackRef, handleActiveChange);

  const scrollToSlide = useCallback((index: number) => {
    setActive(index);
    [mobileTrackRef.current, desktopTrackRef.current].forEach((track) => {
      if (!track || track.offsetParent === null) return;
      const slide = track.querySelectorAll('[data-slide]')[index] as HTMLElement | undefined;
      slide?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    });
  }, [prefersReducedMotion]);

  return (
    <section id="premium-app-showcase" className="relative overflow-hidden bg-surface-paper py-6 text-ink-strong sm:py-10 md:py-14 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[14%] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-sage-200/50 blur-[90px] md:h-[30rem] md:w-[30rem]" />
        <div className="absolute right-[-12%] top-[38%] h-48 w-48 rounded-full bg-clay-100/50 blur-[80px] md:h-72 md:w-72" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white/55 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-6xl items-start px-4 sm:px-6 lg:items-center lg:px-8">
        <div className="grid w-full items-center gap-6 md:gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-12">
          <div className="relative z-10 min-w-0">
            <p data-reveal="up" className="editorial-kicker mb-3 text-ink-strong">De app in 4 stappen</p>
            <h2 data-reveal="up" data-stagger="1" className="max-w-lg font-display text-[2.35rem] font-medium leading-[0.95] tracking-tight text-ink-strong sm:text-[2.9rem] md:text-[3.5rem]">
              Zo werkt de app
            </h2>
            <p data-reveal="soft" data-stagger="2" className="card-body mt-4 max-w-xl text-ink-body">
              Van &quot;ik weet niet wat ik mag eten&quot; naar maaltijd op tafel in 15 minuten.
            </p>

            <div className="mt-8 hidden gap-3 lg:grid">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  className="app-showcase-step-button motion-press p-5 text-left"
                  data-active={active === index ? 'true' : 'false'}
                  data-reveal="soft"
                  data-stagger={index + 3}
                  onClick={() => scrollToSlide(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className="app-showcase-step-index flex items-center justify-center text-sm font-bold tracking-[0.18em]">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <p className="editorial-kicker text-ink-strong">{step.kicker}</p>
                      <h3 className="mt-2 font-sans text-2xl font-bold tracking-tight text-ink-strong">{step.title}</h3>
                      <p className="card-body mt-2 text-ink-body">{step.body}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative z-10 min-w-0" data-reveal="soft" data-stagger="3">
            <div className="lg:hidden">
              <div className="app-showcase-mobile-track" ref={mobileTrackRef} tabIndex={0} aria-label="App schermen">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="app-showcase-mobile-slide"
                    data-active={active === index ? 'true' : 'false'}
                    data-slide
                    data-index={index}
                  >
                    <div className="app-showcase-mobile-stage">
                      <div className="app-showcase-mobile-device">
                        <img src={step.image} alt={step.title} className="app-showcase-screen-image" loading="lazy" decoding="async" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="app-showcase-stage px-3 pt-3 sm:px-4 sm:pt-4">
                <div className="app-showcase-track h-full" ref={desktopTrackRef} tabIndex={0} aria-label="App schermen">
                  {steps.map((step, index) => (
                    <div
                      key={step.title}
                      className="app-showcase-slide"
                      data-active={active === index ? 'true' : 'false'}
                      data-slide
                      data-index={index}
                    >
                      <figure className="app-showcase-slide-shell">
                        <div className="app-showcase-device-window">
                          <img src={step.image} alt={step.title} className="app-showcase-screen-image" loading="lazy" decoding="async" />
                        </div>
                      </figure>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 lg:hidden">
              <div className="app-showcase-mobile-card p-4 sm:p-5" aria-live="polite">
                <div key={steps[active].title} className="app-showcase-mobile-copy">
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex rounded-full bg-sage-100 px-3 py-1 editorial-kicker text-ink-strong">{steps[active].kicker}</span>
                    <span className="meta-copy text-ink-muted">{String(active + 1).padStart(2, '0')}/04</span>
                  </div>
                  <h3 className="mt-4 font-sans text-[1.8rem] font-bold leading-none tracking-tight text-ink-strong">{steps[active].title}</h3>
                  <p className="support-copy mt-3 text-ink-body">{steps[active].body}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="app-showcase-pagination" aria-label="App showcase pagination">
                  {steps.map((step, index) => (
                    <button
                      key={step.title}
                      type="button"
                      className="app-showcase-pagination-button motion-press"
                      data-active={active === index ? 'true' : 'false'}
                      onClick={() => scrollToSlide(index)}
                      aria-label={`Ga naar stap ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="meta-copy hidden items-center gap-3 text-ink-muted lg:flex">
                  <span>{String(active + 1).padStart(2, '0')}</span>
                  <span className="h-px w-10 bg-warm-300" />
                  <span>04</span>
                </div>
              </div>
              <p className="meta-copy text-ink-muted lg:hidden">Veeg door de schermen</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
