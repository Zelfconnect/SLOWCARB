import { Lock } from 'lucide-react';

interface FinalCTAProps {
  onCheckout: () => void;
}

export function FinalCTA({ onCheckout }: FinalCTAProps) {
  return (
    <section className="final-cta-section relative overflow-hidden bg-surface-dark py-28 text-center md:py-40">
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src="/images/landing/final-cta-bg.webp"
          alt=""
          className="landing-final-cta-media h-full w-full object-cover object-center saturate-[0.75] brightness-75"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-surface-dark/90 via-surface-dark/70 to-surface-dark/95" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <div className="final-cta-panel rounded-[2rem] border border-white/10 bg-white/8 px-6 py-10 shadow-[0_30px_60px_rgba(10,10,10,0.28)] backdrop-blur md:px-10 md:py-12">
          <p data-reveal="up" className="editorial-kicker text-sage-200">
            Voor de eerste 200 klanten
          </p>
          <h2
            data-reveal="up"
            data-stagger="1"
            className="mt-6 text-5xl font-heading font-bold uppercase leading-[1.05] tracking-tighter text-inverse-strong md:text-[60px]"
          >
            5 regels. 6 weken. &euro;47.
          </h2>
          <div className="mx-auto mb-10 mt-8 max-w-2xl space-y-6">
            <p data-reveal="soft" data-stagger="2" className="editorial-body text-inverse-body">
              Dit is alles wat je nodig hebt om te beginnen. De regels ken je al. De app doet de rest.
            </p>
          </div>
          <div data-reveal="soft" data-stagger="3" className="mb-6 flex flex-wrap items-center justify-center gap-3 text-inverse-muted">
            <span className="inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 editorial-kicker text-inverse-muted">
              &euro;47 &middot; eenmalig &middot; altijd toegang
            </span>
          </div>
          <button
            onClick={onCheckout}
            data-reveal="scale"
            data-stagger="4"
            className="cta-accent-button h-[64px] w-full max-w-[380px] text-lg leading-[64px] md:text-xl"
          >
            Begin met de 5 regels
          </button>
          <div
            data-reveal="soft"
            data-stagger="5"
            className="mt-6 flex flex-col items-center justify-center gap-2 text-xs font-medium text-inverse-muted md:flex-row md:gap-4 md:text-sm"
          >
            <span>Eenmalig betalen. Daarna gewoon gebruiken.</span>
            <span className="hidden md:inline">&bull;</span>
            <div className="flex items-center gap-1">
              <span>Veilig betalen via iDEAL</span>
              <Lock className="h-[10px] w-[10px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
