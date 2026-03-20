import { useCallback, useState, type ChangeEvent, type CSSProperties, type MouseEvent } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

export function FounderSection() {
  const [split, setSplit] = useState(58);

  const handleRangeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSplit(Number(event.target.value));
  }, []);

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
          <div data-reveal="left" className="max-w-xl">
            <span className="motion-lift inline-flex items-center rounded-full bg-surface-paper/80 px-4 py-2 editorial-kicker text-ink-strong shadow-[0_12px_24px_rgba(28,25,23,0.05)] ring-1 ring-warm-200/80 backdrop-blur">
              Het verhaal achter SlowCarb
            </span>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-tight text-ink-strong md:text-5xl">
              Eerst werkte het bij mij.
            </h2>
            <div className="mt-6 rounded-[2rem] border border-warm-200/80 bg-white/88 p-6 shadow-[0_24px_48px_rgba(28,25,23,0.06)] backdrop-blur md:p-7">
              <div className="space-y-4 editorial-body text-ink-body">
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

          <div data-reveal="right" data-stagger="1" className="transform-proof-card motion-surface p-6 md:p-8">
            <div className="relative z-10 flex flex-col">
              <div className="max-w-[34rem]">
                <p className="editorial-kicker text-sage-700">Het bewijs</p>
                <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-strong md:text-4xl">
                  Mijn eigen voor en na
                </h3>
                <p className="mt-3 max-w-md support-copy text-ink-body">
                  Vier weken Slow-Carb. Geen calorieen tellen. Geen sportschool. Wel resultaat.
                </p>
              </div>

              <div className="transform-proof-stage mt-8" style={{ '--transform-split': `${split}%` } as CSSProperties}>
                <figure className="transform-proof-compare" role="img" aria-label="Vergelijking van Jesper voor en na 8 kilo gewichtsverlies">
                  <img src="/images/landing/founder-proof/after.webp" alt="Jesper na zijn gewichtsverlies" loading="eager" decoding="async" />
                  <div className="transform-proof-after" aria-hidden="true">
                    <img src="/images/landing/founder-proof/before.webp" alt="" loading="eager" decoding="async" />
                  </div>
                  <figcaption className="transform-proof-label transform-proof-label--left">Voor</figcaption>
                  <figcaption className="transform-proof-label transform-proof-label--right">Na</figcaption>
                </figure>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={split}
                  onChange={handleRangeInput}
                  className="transform-proof-range"
                  aria-label="Schuif om Jesper voor en na te vergelijken"
                />
                <div className="transform-proof-handle-line" />
                <div className="transform-proof-handle" aria-hidden="true" />
              </div>

              <div className="transform-proof-footer mt-6">
                <span className="transform-proof-result self-start">8 kg in 4 weken</span>
                <p className="support-copy text-ink-body md:max-w-[16rem] md:text-right">
                  Van vastlopen op dieten naar een systeem dat ik elke week kon volhouden.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div data-reveal="up" data-stagger="2" className="mt-6">
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

        <div data-reveal="soft" data-stagger="3" className="mt-6 text-center md:mt-8">
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
