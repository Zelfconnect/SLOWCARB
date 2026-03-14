import { useState, useCallback } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

export function FounderSection() {
  const [split, setSplit] = useState(75);

  const handleRangeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSplit(Number(e.target.value));
  }, []);

  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector('#pricing');
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="founder" className="reviews-proof-section relative py-24 md:py-32 bg-surface-paper overflow-hidden">
      <div id="reviews" className="absolute inset-x-0 top-0 h-px -translate-y-24 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />
      <div className="absolute left-[-4rem] top-16 h-64 w-64 rounded-full bg-sage-100 blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute right-[-5rem] bottom-10 h-72 w-72 rounded-full bg-sage-100 blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 scroll-animate">
        <div className="grid md:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] gap-12 md:gap-16 items-center">
          {/* Photo */}
          <div className="order-2 md:order-1">
            <div className="founder-stage">
              <div className="founder-photo-card">
                <img src="/images/landing/founder/Jesper-smile-1.jpg" alt="Jesper, oprichter van SlowCarb" className="founder-photo" loading="lazy" decoding="async" />
              </div>
              <div className="mt-5 flex justify-center md:justify-start">
                <span className="founder-proof-chip">8 kg in 4 weken</span>
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="order-1 md:order-2">
            <span className="inline-flex items-center rounded-full bg-surface-paper/80 px-4 py-2 editorial-kicker text-ink-strong shadow-[0_12px_24px_rgba(28,25,23,0.05)] ring-1 ring-warm-200/80 backdrop-blur">Het verhaal achter SlowCarb</span>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold font-display text-ink-strong tracking-tight">Waarom een militair een dieet-app bouwde.</h2>
            <div className="mt-6 space-y-5 editorial-body text-ink-body">
              <p>111 kilo. Vader van een drieling. ADHD. En een baan waarbij ik andere mensen in vorm moest houden terwijl ik zelf de controle kwijt was. Elk dieet vroeg om iets wat mijn brein niet kan: eindeloos bijhouden.</p>
              <p>Vijf regels. Geen calorieën tellen. Eén cheatday per week. Na vier weken: 8 kilo lichter. Zonder honger, zonder sportschool, zonder schuldgevoel. Dat voelde voor het eerst als een systeem in plaats van straf, dus bouwde ik SlowCarb Protocol: geen boek van 400 pagina&apos;s, maar een tool die het denkwerk doet zodat jij je kunt focussen op leven.</p>
            </div>
            <div className="mt-8 max-w-sm">
              <div className="founder-meta-card p-5 md:p-6">
                <p className="font-sans font-bold text-2xl text-ink-strong">Jesper</p>
                <p className="mt-2 editorial-kicker text-ink-muted leading-relaxed">Oprichter SlowCarb &middot; Ex-militair &middot; Vader van drie</p>
              </div>
            </div>
          </div>
        </div>

        {/* Before/After + Support card */}
        <div className="mt-16 md:mt-20 grid items-start md:grid-cols-[minmax(0,1.12fr)_minmax(18rem,0.88fr)] gap-6 md:gap-8">
          {/* Before/after slider */}
          <div className="transform-proof-card p-6 md:p-8">
            <div className="relative z-10 flex flex-col">
              <div className="max-w-[34rem]">
                <p className="editorial-kicker text-sage-700">Het bewijs</p>
                <p className="mt-3 max-w-md support-copy text-ink-body">Voordat het een app werd, werkte het eerst bij mij. Daarom staat mijn eigen voor en na hier gewoon vol in beeld.</p>
              </div>

              <div className="transform-proof-stage mt-8" style={{ '--transform-split': `${split}%` } as React.CSSProperties}>
                <figure className="transform-proof-compare" role="img" aria-label="Vergelijking van Jesper voor en na 8 kilo gewichtsverlies">
                  <img src="/images/landing/founder-proof/after.jpg" alt="Jesper na zijn gewichtsverlies" loading="eager" decoding="async" />
                  <div className="transform-proof-after" aria-hidden="true">
                    <img src="/images/landing/founder-proof/before.jpg" alt="" loading="eager" decoding="async" />
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
                <p className="support-copy md:max-w-[15rem] md:text-right text-ink-body">Zonder calorieën tellen. Zonder sportschool. Zonder schuldgevoel.</p>
              </div>
            </div>
          </div>

          {/* Support card */}
          <div className="transform-proof-support-card p-6 md:p-7 flex flex-col">
            <div className="transform-proof-support-icon mb-6 text-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <p className="editorial-kicker text-sage-700 mb-3">De methode</p>
            <p className="editorial-body text-ink-body flex-grow">
              Het Slow-Carb protocol is ontwikkeld door Tim Ferriss en beschreven in <em>The 4-Hour Body</em>, een #1 New York Times bestseller.
            </p>
            <div className="flex items-center gap-4 mt-auto pt-4">
              <div className="transform-proof-support-avatar">T</div>
              <div>
                <p className="font-bold text-ink-strong">Tim Ferriss</p>
                <p className="support-copy text-ink-muted">Auteur, The 4-Hour Body</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA link */}
        <div className="mt-8 md:mt-10 text-center">
          <a href="#pricing" onClick={scrollToPricing} className="transform-proof-cta-link">
            <span>Word een van de eerste 200 gebruikers</span>
            <span className="transform-proof-cta-arrow" aria-hidden="true">
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
