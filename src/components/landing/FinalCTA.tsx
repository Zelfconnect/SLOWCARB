import { Lock } from 'lucide-react';

interface FinalCTAProps {
  onCheckout: () => void;
}

export function FinalCTA({ onCheckout }: FinalCTAProps) {
  return (
    <section className="relative py-32 md:py-48 bg-surface-dark text-center overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src="/images/landing/final-cta-bg.webp"
          alt=""
          className="w-full h-full object-cover object-center saturate-[0.75] brightness-75"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-surface-dark/90 via-surface-dark/70 to-surface-dark/95 z-0" />

      <div className="max-w-3xl mx-auto px-6 relative z-10 scroll-animate">
        <h2 className="text-5xl md:text-[60px] font-bold font-heading uppercase text-inverse-strong leading-[1.05] tracking-tighter mb-10">
          5 regels. 6 weken. &euro;47.
        </h2>
        <div className="max-w-2xl mx-auto space-y-6 mb-12">
          <p className="editorial-body text-inverse-body">
            Dit is alles wat je nodig hebt om te beginnen. De regels ken je al. De app doet de rest.
          </p>
        </div>
        <p className="editorial-kicker text-inverse-muted mb-4">
          &euro;47 &middot; eenmalig &middot; altijd toegang
        </p>
        <button onClick={onCheckout} className="cta-accent-button w-full max-w-[380px] text-lg md:text-xl h-[64px] leading-[64px] mb-6">
          Begin met de 5 regels
        </button>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-inverse-muted text-xs md:text-sm font-medium">
          <span>Eenmalig betalen. Daarna gewoon gebruiken.</span>
          <span className="hidden md:inline">&bull;</span>
          <div className="flex items-center gap-1">
            <span>Veilig betalen via iDEAL</span>
            <Lock className="w-[10px] h-[10px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
