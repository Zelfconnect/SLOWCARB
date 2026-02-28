export function PrivacyPolicy() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl bg-cream px-5 py-10 text-stone-800">
      <div className="space-y-8">
        <a className="inline-flex text-sm font-medium text-sage-800 underline underline-offset-2" href="/">
          ← Terug naar home
        </a>

        <header className="space-y-3">
          <h1 className="font-display text-3xl font-semibold">Privacybeleid</h1>
          <p className="text-sm text-stone-600">
            We gaan zorgvuldig om met je gegevens. Hieronder lees je welke data we verwerken en waarom.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-sage-800">Welke data verzamelen we?</h2>
          <p className="text-sm leading-relaxed text-stone-700">
            Tijdens onboarding vragen we alleen de gegevens die nodig zijn voor het gebruik van de app:
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-stone-700">
            <li>Naam</li>
            <li>E-mailadres</li>
            <li>Gewicht</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-sage-800">Betalingen via Stripe</h2>
          <p className="text-sm leading-relaxed text-stone-700">
            Voor betalingen gebruiken we Stripe. Betalingsgegevens worden verwerkt door Stripe volgens hun
            privacybeleid.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-sage-800">Wat we niet doen</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-stone-700">
            <li>Geen trackingcookies voor marketing of advertenties</li>
            <li>Geen verkoop van jouw persoonsgegevens aan derden</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-sage-800">Contact</h2>
          <p className="text-sm leading-relaxed text-stone-700">
            Vragen over privacy? Mail ons via{' '}
            <a className="font-medium text-sage-800 underline underline-offset-2" href="mailto:hello@slowcarb.nl">
              hello@slowcarb.nl
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
