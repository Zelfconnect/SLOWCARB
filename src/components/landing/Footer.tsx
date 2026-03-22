export function Footer() {
  return (
    <footer className="landing-footer bg-surface-dark py-20 text-inverse-muted">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-16">
          <div>
            <p className="font-display text-3xl font-bold tracking-tight text-inverse-strong">SlowCarb</p>
            <p className="landing-pretty support-copy mt-4 max-w-xl text-inverse-muted/90">
              Een rustig protocol voor mensen die niet nóg een dieet willen managen. Vijf regels, duidelijke tools en recepten die je direct kunt gebruiken.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="editorial-kicker text-inverse-strong">Publieke pagina&apos;s</p>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <a href="/gids" className="transition-colors hover:text-inverse-strong">Gids</a>
                <a href="/recepten" className="transition-colors hover:text-inverse-strong">Recepten</a>
              </div>
            </div>
            <div>
              <p className="editorial-kicker text-inverse-strong">Juridisch &amp; contact</p>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <a href="/terms-of-service" className="transition-colors hover:text-inverse-strong">Algemene Voorwaarden</a>
                <a href="/privacy-policy" className="transition-colors hover:text-inverse-strong">Privacy Policy</a>
                <a href="mailto:info@eatslowcarb.com" className="transition-colors hover:text-inverse-strong">Contact</a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 SlowCarb Protocol. Alle rechten voorbehouden.</p>
          <p className="landing-pretty max-w-2xl text-xs text-inverse-muted">
            SlowCarb Protocol is geen medisch advies. Raadpleeg een arts voordat je je eetpatroon wijzigt.
          </p>
        </div>
      </div>
    </footer>
  );
}
