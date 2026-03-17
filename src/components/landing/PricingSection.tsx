interface PricingSectionProps {
  onCheckout: () => void;
}

const competitors = [
  { name: 'Diëtist', note: 'Meestal meerdere sessies nodig', price: '€80-120', period: 'per sessie' },
  { name: 'Noom', note: 'Doorlopend abonnement', price: '€199', period: 'per jaar' },
  { name: 'WeightWatchers', note: 'Maandbedrag dat blijft doorlopen', price: '€23 p/m', period: '€276 per jaar' },
  { name: 'Personal trainer', note: 'Vaak exclusief voedingsbegeleiding', price: '€50-80', period: 'per sessie' },
];

const includes = [
  { title: '84-dagen protocol', body: 'Elke dag een korte uitleg: wat er in je lichaam gebeurt en waarom het protocol werkt.', meta: '84 dagen · dagelijks' },
  { title: 'AmmoCheck', body: 'De checklist voor wat in je koelkast, voorraadkast en lades moet liggen. Minder keuzes in huis.', meta: 'Minder nadenken' },
  { title: '50+ recepten', body: 'Maaltijden die aan alle 5 regels voldoen, met boodschappenlijst en snelle filters.', meta: 'Klaar in 15 minuten' },
  { title: 'Startweek', body: 'Concrete maaltijden voor week 1, zodat je niet hoeft te gokken waar je begint.', meta: 'Nul nadenken in week 1' },
  { title: 'Updates inbegrepen', body: 'Nieuwe recepten en verbeteringen verschijnen vanzelf in je account.', meta: 'Blijft groeien' },
];

export function PricingSection({ onCheckout }: PricingSectionProps) {
  return (
    <section id="pricing" className="pricing-story-section relative overflow-hidden">
      <div className="pricing-intro-shell">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 relative z-10">
          <div data-testid="pricing-intro" className="max-w-3xl mx-auto text-center">
            <span
              data-reveal="up"
              className="inline-flex items-center rounded-full bg-sage-50/[.92] px-4 py-2 editorial-kicker text-ink-strong shadow-[0_12px_24px_rgba(26,54,54,0.08)] ring-1 ring-sage-200/90 backdrop-blur motion-lift"
            >
              Rustige tools. Duidelijke structuur.
            </span>
            <h2
              data-reveal="up"
              data-stagger="1"
              className="mt-6 text-[2.35rem] leading-[1.02] sm:text-5xl md:text-[3.35rem] font-bold font-display text-ink-strong tracking-tight"
            >
              Alles wat je nodig hebt om te starten en vol te houden.
            </h2>
            <p data-reveal="soft" data-stagger="2" className="card-body mt-4 text-ink-body max-w-2xl mx-auto">
              Geen losse adviezen of maandelijkse ruis. Je krijgt een duidelijk protocol, praktische hulpmiddelen en recepten die de 5 regels uitvoerbaar maken.
            </p>
          </div>
        </div>
      </div>

      <div className="pricing-compare-band">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 relative z-10">
          <div data-testid="pricing-compare" data-reveal="up" data-stagger="3" className="pricing-compare-shell">
            <div className="px-5 pt-6 pb-4 md:px-8 md:pt-8 md:pb-5">
              <p className="editorial-kicker text-ink-strong">Wat mensen normaal betalen</p>
              <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <h3 className="font-sans text-[1.95rem] font-bold leading-[1.05] tracking-tight text-ink-strong md:text-[2.25rem]">
                  Wat kost afvallen normaal?
                </h3>
                <p className="max-w-md support-copy text-ink-body">
                  De meeste oplossingen vragen meerdere sessies of een abonnement. SlowCarb bundelt het in één systeem dat je direct kunt gebruiken.
                </p>
              </div>
            </div>

            {competitors.map((competitor) => (
              <div key={competitor.name} className="pricing-compare-row">
                <div>
                  <p className="text-lg font-medium text-ink-strong">{competitor.name}</p>
                  <p className="mt-1 support-copy text-ink-muted">{competitor.note}</p>
                </div>
                <div className="pricing-compare-price">
                  {competitor.price}
                  <span>{competitor.period}</span>
                </div>
              </div>
            ))}

            <div className="pricing-compare-highlight">
              <div className="pricing-compare-highlight__copy">
                <p className="editorial-kicker text-sage-700">SlowCarb Protocol</p>
                <p className="pricing-compare-highlight__headline">Het volledige startpakket voor minder dan een intake of jaarabonnement.</p>
              </div>
              <div className="pricing-compare-highlight__price-group">
                <p className="pricing-compare-highlight__price">&euro;47</p>
                <p className="pricing-compare-highlight__note">volledig protocol</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pricing-offer-shell">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 relative z-10">
          <div className="pricing-offer-flow" id="offer-headline">
            <div data-testid="pricing-includes-block" className="pricing-offer-copy">
              <p data-reveal="up" className="editorial-kicker text-sage-700">Wat je krijgt</p>
              <h3
                data-reveal="up"
                data-stagger="1"
                className="mt-4 font-sans text-[1.95rem] font-bold leading-[1.05] tracking-tight text-ink-strong md:text-[2.35rem]"
              >
                Dit zit er allemaal in.
              </h3>
              <p data-reveal="soft" data-stagger="2" className="mt-4 card-body text-ink-body max-w-2xl">
                Geen zoektocht naar waar je begint. Je krijgt de uitleg, de maaltijden en de structuur om direct rustig te starten.
              </p>

              <div className="pricing-includes mt-6 md:mt-8">
                {includes.map((item, index) => (
                  <article key={item.title} data-reveal="soft" data-stagger={index + 3} className="pricing-include-item">
                    <div className="pricing-include-index">{String(index + 1).padStart(2, '0')}</div>
                    <div className="pricing-include-copy">
                      <h4 className="text-lg md:text-xl font-sans font-bold tracking-tight text-ink-strong">{item.title}</h4>
                      <p className="mt-2 support-copy text-ink-body">{item.body}</p>
                      <span className="pricing-include-meta">{item.meta}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div data-reveal="scale" data-stagger="4" className="pricing-buy-stage">
              <aside data-testid="pricing-buy-card" className="pricing-card pricing-buy-card motion-surface">
                <p className="editorial-kicker text-sage-700">Eenmalig. Geen abonnement.</p>
                <p className="mt-4 editorial-kicker text-ink-muted">Alles inbegrepen</p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-[4rem] leading-none font-bold font-sans tracking-tight text-ink-strong md:text-[4.7rem]">&euro;47</span>
                  <span className="pb-3 support-copy text-ink-muted">eenmalig</span>
                </div>
                <p className="mt-4 card-body text-ink-body">Voor de eerste 200 klanten. Daarna stijgt de prijs naar &euro;79.</p>

                <ul className="pricing-card-points">
                  <li>Geen abonnement of automatische verlenging</li>
                  <li>30 dagen proberen. Past het niet? Geld terug.</li>
                  <li>Veilig betalen via iDEAL en creditcard</li>
                </ul>

                <button type="button" className="pricing-cta-button motion-press" onClick={onCheckout}>
                  <span className="flex flex-col min-w-0">
                    <span className="pricing-cta-button__eyebrow">Direct toegang</span>
                    <span className="pricing-cta-button__text">Start het protocol</span>
                  </span>
                  <span className="pricing-cta-button__price">&euro;47</span>
                </button>

                <p className="mt-4 support-copy text-ink-body">
                  Je krijgt direct toegang tot het volledige protocol. Past het niet, dan krijg je binnen 30 dagen je geld terug.
                </p>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
