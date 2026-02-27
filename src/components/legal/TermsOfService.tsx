export function TermsOfService() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl bg-cream px-5 py-10 text-stone-800">
      <div className="space-y-8">
        <a className="inline-flex text-sm font-medium text-sage-800 underline underline-offset-2" href="/">
          ← Terug naar home
        </a>

        <header className="space-y-3">
          <h1 className="font-display text-3xl font-semibold">Algemene voorwaarden</h1>
          <p className="text-sm text-stone-600">
            Door SlowCarb te gebruiken ga je akkoord met deze voorwaarden.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-sage-800">Wat is SlowCarb?</h2>
          <p className="text-sm leading-relaxed text-stone-700">
            SlowCarb is een PWA web-app met praktische begeleiding voor het volgen van de Slow Carb-methode. Na
            aankoop krijg je lifetime access tot de app voor persoonlijk gebruik.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-sage-800">Eenmalige betaling</h2>
          <p className="text-sm leading-relaxed text-stone-700">
            Toegang tot SlowCarb wordt aangeboden via een eenmalige betaling. Er is geen maandabonnement of
            automatische verlenging.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-sage-800">Intellectueel eigendom</h2>
          <p className="text-sm leading-relaxed text-stone-700">
            Alle inhoud, teksten, schema&apos;s en onderdelen van de app blijven eigendom van SlowCarb. Je mag de
            inhoud niet kopieren, verspreiden of commercieel hergebruiken zonder schriftelijke toestemming.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-sage-800">Aansprakelijkheid</h2>
          <p className="text-sm leading-relaxed text-stone-700">
            SlowCarb biedt algemene informatie over voeding en leefstijl en is geen medisch advies. Raadpleeg bij
            klachten, twijfel of medische aandoeningen altijd een arts of andere gekwalificeerde zorgverlener.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-sage-800">Beeindiging</h2>
          <p className="text-sm leading-relaxed text-stone-700">
            Bij misbruik, fraude of schending van deze voorwaarden kan toegang tot de app worden beeindigd.
          </p>
        </section>
      </div>
    </main>
  );
}
