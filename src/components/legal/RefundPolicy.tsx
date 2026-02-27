export function RefundPolicy() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl bg-cream px-5 py-10 text-stone-800">
      <div className="space-y-8">
        <a className="inline-flex text-sm font-medium text-sage-800 underline underline-offset-2" href="/">
          ← Terug naar home
        </a>

        <header className="space-y-3">
          <h1 className="font-display text-3xl font-semibold">Refundbeleid</h1>
          <p className="text-sm text-stone-600">
            We bieden een 30 dagen geld-terug garantie. Geen vragen, geen gedoe.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-sage-800">30 dagen geld-terug garantie</h2>
          <p className="text-sm leading-relaxed text-stone-700">
            Je kunt binnen 30 dagen na aankoop een volledige terugbetaling aanvragen.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-sage-800">Geen vragen</h2>
          <p className="text-sm leading-relaxed text-stone-700">
            We geloven in een laagdrempelig proces: je hoeft geen reden op te geven.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-sage-800">Hoe vraag je een refund aan?</h2>
          <p className="text-sm leading-relaxed text-stone-700">
            Stuur een e-mail naar{' '}
            <a className="font-medium text-sage-800 underline underline-offset-2" href="mailto:hello@slowcarb.nl">
              hello@slowcarb.nl
            </a>{' '}
            met het e-mailadres waarmee je hebt gekocht.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-sage-800">Verwerkingstijd</h2>
          <p className="text-sm leading-relaxed text-stone-700">
            Na je aanvraag verwerken we de refund binnen 5-7 werkdagen.
          </p>
        </section>
      </div>
    </main>
  );
}
