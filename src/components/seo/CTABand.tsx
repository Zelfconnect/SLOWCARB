const STRIPE_URL = 'https://buy.stripe.com/5kQ4gBeAG19IfBNcWn5Rm01';

export function CTABand() {
  return (
    <section className="bg-gradient-to-b from-stone-900 to-stone-800 px-4 py-12 text-center md:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="editorial-kicker mb-3 text-sage-400">Klaar om te beginnen?</p>
        <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
          5 regels. 6 weken. Geen excuses.
        </h2>
        <p className="mt-3 text-stone-400">
          50+ recepten, boodschappenlijst, 84-dagen educatie. Eenmalig €47.
        </p>
        <a
          href={STRIPE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-accent-button mt-6 inline-flex px-8 py-3.5 text-sm"
        >
          Begin vandaag &rarr;
        </a>
      </div>
    </section>
  );
}
