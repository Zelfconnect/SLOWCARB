const solutionPrinciples = [
  {
    title: 'Binnen een dag snappen.',
    body: 'Geen fases, geen opbouw, geen ingewikkeld schema. Je leest de vijf regels, begrijpt ze, en begint. Morgen al.',
  },
  {
    title: 'Geen app die je afrekent.',
    body: 'Geen streepjes, geen rode waarschuwingen als je 50 gram te veel at. SlowCarb werkt binair: past het binnen de regels of niet.',
  },
  {
    title: 'Zaterdag pizza. Zondag weer door.',
    body: 'De cheatday is geen troostprijs maar onderdeel van het systeem. Eén dag alles eten maakt de rest van de week mentaal lichter.',
  },
] as const;

export function SolutionSection() {
  return (
    <section className="solution-section editorial-dark-section relative overflow-hidden bg-surface-deep py-24 text-inverse-body md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(148,163,184,0.12),_transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(82,126,82,0.22),_transparent_36%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
          <div className="max-w-xl">
            <p className="editorial-kicker text-sage-200">
              Waarom dit wel vol te houden is
            </p>
            <h2 className="landing-balance mt-4 max-w-[12ch] text-[3.15rem] font-display font-medium leading-[0.98] tracking-tight text-inverse-strong sm:text-[3.35rem] md:text-6xl lg:text-7xl">
              Eén systeem. Nul denkwerk.
            </h2>
            <p className="landing-pretty editorial-body mt-8 max-w-[35rem] text-left text-inverse-body/90">
              De meeste diëten mislukken niet op motivatie. Ze lopen vast op keuzes. Wat mag ik eten? Hoeveel calorieën heb ik nog? Mag dit wel na 18:00? SlowCarb vervangt al die vragen door vijf regels.
            </p>
          </div>

          <div className="solution-card-grid grid gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-1">
            {solutionPrinciples.map((principle, index) => (
              <article key={principle.title} className="solution-principle motion-surface rounded-[1.9rem] border border-white/10 bg-white/8 p-6 shadow-[0_24px_48px_rgba(12,18,18,0.22)] backdrop-blur md:p-7">
                <div className="solution-principle-index">{String(index + 1).padStart(2, '0')}</div>
                <h3 className="landing-balance mt-5 font-sans text-[1.35rem] font-bold tracking-tight text-inverse-strong md:text-[1.45rem]">
                  {principle.title}
                </h3>
                <p className="landing-pretty mt-3 text-[0.98rem] leading-[1.72] text-inverse-body/88 md:text-[1.02rem]">
                  {principle.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
