import { useState, useRef, useCallback, useEffect } from 'react';
import { trackLanding } from './analytics';

const steps = [
  { kicker: 'Stap 1', title: 'Open je dashboard', body: 'Zie in een oogopslag of je de regels volgt. Geen calorieen. Geen macro\'s. Gewoon duidelijk per maaltijd.', image: '/images/landing/phonescreens/phonescreen1.webp' },
  { kicker: 'Stap 2', title: 'Kies een recept', body: '50+ recepten die aan alle regels voldoen. Filter op bereidingstijd, airfryer, of ingrediënt.', image: '/images/landing/phonescreens/phonescreen2.webp' },
  { kicker: 'Stap 3', title: 'Leer waarom het werkt', body: 'Elke dag een science card: wat er in je lichaam gebeurt en waarom. Kennis = volhouden.', image: '/images/landing/phonescreens/phonescreen3.webp' },
  { kicker: 'Stap 4', title: 'Hou AmmoCheck bij', body: 'Een simpele checklist voor wat in je koelkast, voorraadkast en lades moet liggen. Minder nadenken, makkelijker volhouden.', image: '/images/landing/phonescreens/phonescreen4.webp' },
];

function useTrackObserver(
  trackRef: React.RefObject<HTMLDivElement | null>,
  onActiveChange: (index: number) => void,
) {
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIdx = 0;
        let bestRatio = 0;
        entries.forEach(entry => {
          const idx = Number(entry.target.getAttribute('data-index'));
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIdx = idx;
          }
        });
        if (bestRatio > 0.5) onActiveChange(bestIdx);
      },
      { root: track, threshold: [0.25, 0.5, 0.75, 0.95] }
    );

    track.querySelectorAll('[data-slide]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [trackRef, onActiveChange]);
}

export function AppShowcase() {
  const [active, setActive] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const desktopTrackRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef(0);
  const touchDeltaYRef = useRef(0);
  const swipeThreshold = 40;

  const handleActiveChange = useCallback((index: number) => {
    setActive(index);
    trackLanding('landing_showcase_swipe', { step: index + 1 });
  }, []);

  useTrackObserver(mobileTrackRef, handleActiveChange);
  useTrackObserver(desktopTrackRef, handleActiveChange);

  const scrollToSlide = useCallback((index: number) => {
    setActive(index);
    [mobileTrackRef.current, desktopTrackRef.current].forEach(track => {
      if (!track || track.offsetParent === null) return;
      const slide = track.querySelectorAll('[data-slide]')[index] as HTMLElement | undefined;
      slide?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  }, []);

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    touchDeltaXRef.current = 0;
    touchDeltaYRef.current = 0;
  }, []);

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touch = event.touches[0];
    touchDeltaXRef.current = touch.clientX - touchStartXRef.current;
    touchDeltaYRef.current = touch.clientY - touchStartYRef.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const deltaX = touchDeltaXRef.current;
    const deltaY = touchDeltaYRef.current;
    const isHorizontalSwipe =
      Math.abs(deltaX) >= swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontalSwipe) {
      const direction = deltaX < 0 ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(steps.length - 1, active + direction));
      if (nextIndex !== active) scrollToSlide(nextIndex);
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchDeltaXRef.current = 0;
    touchDeltaYRef.current = 0;
  }, [active, scrollToSlide]);

  return (
    <section id="premium-app-showcase" className="relative overflow-hidden bg-surface-paper text-ink-strong py-6 sm:py-10 md:py-14 lg:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[14%] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-sage-200/50 blur-[90px] md:h-[30rem] md:w-[30rem]" />
        <div className="absolute right-[-12%] top-[38%] h-48 w-48 rounded-full bg-clay-100/50 blur-[80px] md:h-72 md:w-72" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white/55 to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-6xl items-start px-4 sm:px-6 lg:items-center lg:px-8">
        <div className="grid w-full items-center gap-6 md:gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-12">

          {/* Left: text + step buttons */}
          <div className="relative z-10 min-w-0">
            <p className="editorial-kicker mb-3 text-ink-strong">De app in 4 stappen</p>
            <h2 className="max-w-lg font-display text-[2.35rem] font-medium leading-[0.95] tracking-tight text-ink-strong sm:text-[2.9rem] md:text-[3.5rem]">
              Zo werkt de app
            </h2>
            <p className="card-body mt-4 max-w-xl text-ink-body">
              Van &quot;ik weet niet wat ik mag eten&quot; naar maaltijd op tafel in 15 minuten.
            </p>

            {/* Desktop step buttons */}
            <div className="mt-8 hidden gap-3 lg:grid">
              {steps.map((step, i) => (
                <button
                  key={i}
                  type="button"
                  className="app-showcase-step-button p-5 text-left"
                  data-active={active === i ? 'true' : 'false'}
                  onClick={() => scrollToSlide(i)}
                >
                  <div className="flex items-start gap-4">
                    <div className="app-showcase-step-index flex items-center justify-center text-sm font-bold tracking-[0.18em]">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <p className="editorial-kicker text-ink-strong">{step.kicker}</p>
                      <h3 className="mt-2 text-2xl font-sans font-bold tracking-tight text-ink-strong">{step.title}</h3>
                      <p className="card-body mt-2 text-ink-body">{step.body}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: phone screens */}
          <div className="relative z-10 min-w-0">
            {/* Mobile carousel */}
            <div className="lg:hidden">
              <div
                className="app-showcase-mobile-track"
                ref={mobileTrackRef}
                tabIndex={0}
                aria-label="App schermen"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {steps.map((step, i) => (
                  <div key={i} className="app-showcase-mobile-slide" data-slide data-index={i}>
                    <div className="app-showcase-mobile-stage">
                      <div className="app-showcase-mobile-device">
                        <img src={step.image} alt={step.title} className="app-showcase-screen-image" loading="lazy" decoding="async" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop carousel */}
            <div className="hidden lg:block">
              <div className="app-showcase-stage px-3 pt-3 sm:px-4 sm:pt-4">
                <div className="app-showcase-track h-full" ref={desktopTrackRef} tabIndex={0} aria-label="App schermen">
                  {steps.map((step, i) => (
                    <div key={i} className="app-showcase-slide" data-slide data-index={i}>
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

            {/* Mobile info card */}
            <div className="mt-4 lg:hidden">
              <div className="app-showcase-mobile-card p-4 sm:p-5" aria-live="polite">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex rounded-full bg-sage-100 px-3 py-1 editorial-kicker text-ink-strong">{steps[active].kicker}</span>
                  <span className="meta-copy text-ink-muted">{String(active + 1).padStart(2, '0')}/04</span>
                </div>
                <h3 className="mt-4 text-[1.8rem] font-sans font-bold leading-none tracking-tight text-ink-strong">{steps[active].title}</h3>
                <p className="support-copy mt-3 text-ink-body">{steps[active].body}</p>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="app-showcase-pagination" aria-label="App showcase pagination">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className="app-showcase-pagination-button"
                      data-active={active === i ? 'true' : 'false'}
                      onClick={() => scrollToSlide(i)}
                      aria-label={`Ga naar stap ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="hidden items-center gap-3 meta-copy text-ink-muted lg:flex">
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
