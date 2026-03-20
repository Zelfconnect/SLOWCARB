export function SolutionSection() {
  return (
    <section className="editorial-dark-section py-24 md:py-32 bg-surface-deep text-inverse-body overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 scroll-animate relative z-10">
        <h2 className="max-w-[12ch] text-[3.15rem] sm:text-[3.35rem] md:text-6xl lg:text-7xl font-display font-medium leading-[0.98] tracking-tight mb-10 text-left md:text-center text-inverse-strong md:mx-auto">
          E&#233;n systeem. Nul denkwerk.
        </h2>
        <p className="editorial-body text-inverse-body text-left md:text-center max-w-[23rem] md:max-w-[35rem] md:mx-auto mb-16 md:mb-20">
          De meeste di&#235;ten mislukken niet op motivatie. Ze lopen vast op keuzes. Wat mag ik eten? Hoeveel calorie&#235;n heb ik nog? Mag dit wel na 18:00? SlowCarb vervangt al die vragen door vijf regels.
        </p>

        <div className="max-w-[23rem] md:max-w-[28rem] md:mx-auto space-y-14 md:space-y-16 text-left">
          <div>
            <h3 className="editorial-kicker text-[1.06rem] md:text-[1.12rem] leading-[1.08] text-inverse-strong mb-5">Binnen een dag snappen.</h3>
            <p className="text-[0.98rem] md:text-[1.05rem] leading-[1.7] text-inverse-body max-w-[22rem]">
              Geen fases, geen opbouw, geen ingewikkeld schema. Je leest de vijf regels, begrijpt ze, en begint. Morgen al.
            </p>
          </div>
          <div>
            <h3 className="editorial-kicker text-[1.06rem] md:text-[1.12rem] leading-[1.08] text-inverse-strong mb-5">Geen app die je afrekent.</h3>
            <p className="text-[0.98rem] md:text-[1.05rem] leading-[1.7] text-inverse-body max-w-[22rem]">
              Geen streepjes, geen rode waarschuwingen als je 50 gram te veel at. SlowCarb werkt binair: past het binnen de regels of niet. Dat is alles.
            </p>
          </div>
          <div>
            <h3 className="editorial-kicker text-[1.06rem] md:text-[1.12rem] leading-[1.08] text-inverse-strong mb-5">Zaterdag pizza. Zondag weer door.</h3>
            <p className="text-[0.98rem] md:text-[1.05rem] leading-[1.7] text-inverse-body max-w-[22rem]">
              De cheatday is niet je beloning. Het is het mechanisme dat voorkomt dat je lichaam in de spaarstand gaat. E&#233;n dag per week alles eten maakt de rest makkelijker.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
