export function RecognitionSection() {
  return (
    <section className="recognition-section relative overflow-hidden bg-surface-paper py-20 text-ink-strong sm:py-32 md:py-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sage-50/75 to-transparent" />
      <div className="pointer-events-none absolute left-[-8rem] top-20 h-56 w-56 rounded-full bg-sage-100/80 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-6rem] h-64 w-64 rounded-full bg-clay-100/45 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 md:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)] lg:gap-16">
          <div className="min-w-0">
            <p data-reveal="up" className="editorial-kicker text-sage-700">
              Voor iedereen die al te veel heeft geprobeerd
            </p>
            <h2
              data-reveal="up"
              data-stagger="1"
              className="mt-4 text-5xl font-display font-medium leading-[1.02] tracking-tight text-ink-strong md:text-7xl lg:text-[5.5rem]"
            >
              Herkenbaar?
            </h2>
            <div className="mt-10 max-w-3xl space-y-7 md:space-y-8">
              <p data-reveal="soft" data-stagger="2" className="editorial-body text-ink-body">
                Je hebt dit jaar al drie diëten geprobeerd. Waarschijnlijk zijn ze alle drie op maandag begonnen. En elke keer liep je weer vast op tellen, wegen en nadenken.
              </p>
              <p data-reveal="soft" data-stagger="3" className="editorial-body text-ink-body">
                Je wilt geen leven op sla, shakes of regels die niemand volhoudt. Je wilt gewoon weten wat je eet, wat werkt en wat je morgen weer zonder gedoe op je bord legt.
              </p>
              <p data-reveal="soft" data-stagger="4" className="editorial-body border-t border-warm-300 pt-8 text-ink-strong">
                SlowCarb is geen dieet. Het is een simpel systeem met 5 regels.
              </p>
            </div>
          </div>

          <aside
            data-reveal="soft"
            data-stagger="3"
            className="recognition-note-card motion-surface rounded-[2rem] border border-warm-200/80 bg-white/88 p-6 shadow-[0_24px_44px_rgba(28,25,23,0.08)] backdrop-blur md:p-7"
          >
            <p className="editorial-kicker text-sage-700">Waarom het steeds vastloopt</p>
            <div className="mt-6 space-y-4">
              <div className="recognition-note-item">
                <span className="recognition-note-index">01</span>
                <div>
                  <p className="font-sans text-lg font-bold tracking-tight text-ink-strong">Te veel regels</p>
                  <p className="support-copy mt-1 text-ink-body">Hoe meer uitzonderingen, hoe sneller je afhaakt.</p>
                </div>
              </div>
              <div className="recognition-note-item">
                <span className="recognition-note-index">02</span>
                <div>
                  <p className="font-sans text-lg font-bold tracking-tight text-ink-strong">Te veel keuzes</p>
                  <p className="support-copy mt-1 text-ink-body">Iedere maaltijd wordt een onderhandeling met jezelf.</p>
                </div>
              </div>
              <div className="recognition-note-item">
                <span className="recognition-note-index">03</span>
                <div>
                  <p className="font-sans text-lg font-bold tracking-tight text-ink-strong">Te veel denkwerk</p>
                  <p className="support-copy mt-1 text-ink-body">Wilskracht raakt op. Structuur niet.</p>
                </div>
              </div>
            </div>
            <p className="support-copy mt-6 border-t border-warm-200/80 pt-5 text-ink-muted">
              SlowCarb vervangt al dat denken door één helder systeem dat je deze week nog kunt volgen.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
