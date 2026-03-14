export function Footer() {
  return (
    <footer className="bg-surface-dark text-inverse-muted py-16 text-center">
      <div className="max-w-5xl mx-auto px-6">
        <div className="font-bold font-display text-2xl text-inverse-strong mb-8 tracking-tight">SlowCarb</div>
        <div className="flex justify-center gap-8 mb-8 text-sm">
          <a href="/terms-of-service" className="hover:text-inverse-strong transition-colors">Algemene Voorwaarden</a>
          <a href="/privacy-policy" className="hover:text-inverse-strong transition-colors">Privacy Policy</a>
          <a href="mailto:info@eatslowcarb.com" className="hover:text-inverse-strong transition-colors">Contact</a>
        </div>
        <p className="text-sm">&copy; 2026 SlowCarb Protocol. Alle rechten voorbehouden.</p>
        <p className="text-xs mt-4 text-inverse-muted max-w-2xl mx-auto">SlowCarb Protocol is geen medisch advies. Raadpleeg een arts voordat je je eetpatroon wijzigt.</p>
      </div>
    </footer>
  );
}
