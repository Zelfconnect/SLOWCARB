import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/seo/SiteHeader';

interface LandingHeroProps {
  onCheckout: () => void;
}

export function LandingHero({ onCheckout }: LandingHeroProps) {
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    let introFrame = 0;
    let readyFrame = 0;

    introFrame = window.requestAnimationFrame(() => {
      readyFrame = window.requestAnimationFrame(() => setHeroReady(true));
    });

    return () => {
      window.cancelAnimationFrame(introFrame);
      window.cancelAnimationFrame(readyFrame);
    };
  }, []);

  return (
    <section
      className="landing-hero-shell relative w-full min-w-0 max-w-none h-[100dvh] min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-surface-dark m-0 p-0"
      data-hero-ready={heroReady ? 'true' : 'false'}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(min-width: 768px)" srcSet="/images/landing/hero-bg-desktop.webp" type="image/webp" />
          <img
            src="/images/landing/hero-bg-mobile.webp"
            alt="SlowCarb maaltijd"
            className="landing-hero-media w-full h-full object-cover object-center"
            loading="eager"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-surface-dark/50 via-surface-dark/20 to-surface-dark/70" />
      </div>

      {/* Header — relative positioning preserved for flex flow */}
      <SiteHeader isLandingPage onCheckout={onCheckout} />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-full px-4 sm:px-6 text-center">
        <p className="landing-hero-kicker editorial-kicker text-inverse-muted mb-4 md:mb-12">SlowCarb Methode</p>
        <h1 className="w-full max-w-full font-heading font-bold uppercase text-inverse-strong drop-shadow-2xl text-[5.5rem] leading-[0.85] tracking-[-0.03em] mb-4 sm:text-[5.5rem] md:text-[8rem] md:leading-[0.85] md:mb-12 lg:text-[10rem] xl:text-[12rem]">
          <span className="landing-hero-heading-line block">8 tot 10{' '}</span>
          <span className="landing-hero-heading-line block">kilo in{' '}</span>
          <span className="landing-hero-heading-line block">6 weken.</span>
        </h1>
        <p className="landing-hero-copy editorial-body italic text-inverse-body max-w-md drop-shadow-md md:mb-16">
          Geen calorie&#235;n tellen. Geen wilskracht nodig.<br />E&#233;n systeem dat werkt.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 w-full px-5 sm:px-6 pb-10 md:pb-8 text-center">
        <button onClick={onCheckout} className="landing-hero-cta cta-accent-button text-sm md:text-base px-12 py-4 md:px-16 md:py-5">
          Begin met de 5 regels
        </button>
        <p className="landing-hero-footnote hidden md:block mt-4 text-xs text-white/40">
          *Resultaten variëren per persoon. Gebaseerd op het protocol uit The 4-Hour Body.
        </p>
      </div>
    </section>
  );
}
