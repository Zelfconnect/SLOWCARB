export function SolutionSection() {
  return (
    <section className="editorial-dark-section py-24 md:py-32 bg-surface-deep text-inverse-body overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 scroll-animate relative z-10">
        <h2 className="max-w-[12ch] text-[3.15rem] sm:text-[3.35rem] md:text-6xl lg:text-7xl font-display font-medium leading-[0.98] tracking-tight mb-10 text-left md:text-center text-inverse-strong md:mx-auto">
          Wat als afvallen simpeler was?
        </h2>
        <p className="editorial-body text-inverse-body text-left md:text-center max-w-[23rem] md:max-w-[35rem] md:mx-auto mb-16 md:mb-20">
          Afvallen mislukt zelden op motivatie. Het loopt vast op te veel regels, te veel keuzes en te veel denkwerk. SlowCarb haalt dat eruit.
        </p>

        <div className="max-w-[23rem] md:max-w-[28rem] md:mx-auto space-y-14 md:space-y-16 text-left">
          <div>
            <h3 className="editorial-kicker text-[1.06rem] md:text-[1.12rem] leading-[1.08] text-inverse-strong mb-5">5 regels. Meer niet.</h3>
            <p className="text-[0.98rem] md:text-[1.05rem] leading-[1.7] text-inverse-body max-w-[22rem]">
              Geen calorieën tellen. Geen punten. Geen app die je corrigeert omdat je net iets te veel at. Vijf regels die je na dag één begrijpt.
            </p>
          </div>
          <div>
            <h3 className="editorial-kicker text-[1.06rem] md:text-[1.12rem] leading-[1.08] text-inverse-strong mb-5">Doordeweeks op automatische piloot.</h3>
            <p className="text-[0.98rem] md:text-[1.05rem] leading-[1.7] text-inverse-body max-w-[22rem]">
              Je weet wat je eet en waarom. Minder keuzes, minder twijfel, meer rust. Zo houd je dit veel langer vol.
            </p>
          </div>
          <div>
            <h3 className="editorial-kicker text-[1.06rem] md:text-[1.12rem] leading-[1.08] text-inverse-strong mb-5">Eén cheatday. Zonder schuldgevoel.</h3>
            <p className="text-[0.98rem] md:text-[1.05rem] leading-[1.7] text-inverse-body max-w-[22rem]">
              Eén dag per week mag alles. Echt alles. Niet als zwaktebod, maar als onderdeel van het systeem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
