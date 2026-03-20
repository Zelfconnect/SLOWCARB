import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { trackLanding } from './analytics';

interface LandingHeroProps {
  onCheckout: () => void;
}

const navLinks = [
  { href: '#method', label: 'De methode' },
  { href: '#premium-app-showcase', label: 'Hoe werkt de app' },
  { href: '#reviews', label: 'Bewijs' },
  { href: '#pricing', label: 'Prijs' },
  { href: '#faq', label: 'FAQ' },
];

export function LandingHero({ onCheckout }: LandingHeroProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

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

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  };

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

      {/* Header */}
      <header className="relative z-10 w-full min-w-0 px-5 py-5 sm:px-6 md:px-10 md:py-8 flex justify-between items-center">
        <div className="landing-hero-brand text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-inverse-strong font-sans truncate min-w-0">
          SlowCarb
        </div>
        <button
          onClick={() => {
            setMenuOpen(true);
            trackLanding('landing_menu_open');
          }}
          className="landing-hero-nav text-inverse-strong hover:text-inverse-muted transition-colors md:hidden"
          aria-label="Menu openen"
        >
          <Menu className="w-8 h-8" />
        </button>
        <nav className="landing-hero-nav hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} onClick={(e) => scrollTo(e, href)} className="text-inverse-body hover:text-inverse-strong transition-colors text-sm font-medium">
              {label}
            </a>
          ))}
        </nav>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] md:hidden ${menuOpen ? '' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
        <div
          className={`absolute inset-0 bg-surface-dark/80 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          className={`absolute top-0 right-0 w-full max-w-sm h-full bg-surface-dark/95 backdrop-blur-md transform transition-transform duration-300 flex flex-col pt-24 px-8 pb-8 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <button onClick={() => setMenuOpen(false)} className="absolute top-5 right-5 text-inverse-strong hover:text-inverse-muted transition-colors p-2" aria-label="Menu sluiten">
            <X className="w-8 h-8" />
          </button>
          <div className="flex flex-col gap-2">
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href} onClick={(e) => scrollTo(e, href)} className="text-2xl font-bold text-inverse-strong hover:text-white/70 transition-colors py-3 border-b border-white/10">
                {label}
              </a>
            ))}
          </div>
          <div className="mt-auto">
            <button
              onClick={() => {
                setMenuOpen(false);
                onCheckout();
              }}
              className="cta-accent-button w-full text-center text-base py-4"
            >
              Begin met de 5 regels
            </button>
          </div>
        </nav>
      </div>

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
