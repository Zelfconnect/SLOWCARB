import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { trackLanding } from '@/components/landing/analytics';

interface SiteHeaderProps {
  /** When true, section links smooth-scroll to anchors. When false, they navigate to /#anchor */
  isLandingPage?: boolean;
  onCheckout?: () => void;
}

const pageLinks = [
  { to: '/gids', label: 'Gids' },
  { to: '/recepten', label: 'Recepten' },
];

const sectionLinks = [
  { anchor: '#method', label: 'De methode' },
  { anchor: '#premium-app-showcase', label: 'Hoe werkt de app' },
  { anchor: '#reviews', label: 'Bewijs' },
  { anchor: '#pricing', label: 'Prijs' },
  { anchor: '#faq', label: 'FAQ' },
];

export function SiteHeader({ isLandingPage = false, onCheckout }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const profile = useUserStore((s) => s.profile);
  const navigate = useNavigate();

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isLandingPage) {
      const el = document.querySelector(anchor);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      navigate('/' + anchor);
    }
  };

  const hasProfile = profile !== null;

  return (
    <>
      {/* Use relative positioning on landing (participates in flex flow),
          absolute on content pages (overlays the hero image) */}
      <header className={`${isLandingPage ? 'relative z-10' : 'absolute top-0 left-0 right-0 z-50'} w-full px-5 py-5 sm:px-6 md:px-10 md:py-8 flex justify-between items-center`}>
        <Link
          to="/"
          className="landing-hero-brand text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-inverse-strong font-sans truncate min-w-0"
        >
          SlowCarb
        </Link>

        {/* Mobile: show "Ga naar de app" button OR hamburger */}
        {hasProfile ? (
          <a
            href="/?app=1"
            className="landing-hero-nav rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-sage-700 shadow-lg ring-1 ring-sage-200 backdrop-blur hover:bg-white transition-colors md:hidden"
          >
            Ga naar de app
          </a>
        ) : (
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
        )}

        {/* Desktop: always show nav links + "Ga naar de app" when logged in */}
        <nav className="landing-hero-nav hidden md:flex items-center gap-8">
          {pageLinks.map(({ to, label }) => (
            <Link key={to} to={to} className="text-inverse-body hover:text-inverse-strong transition-colors text-sm font-medium">
              {label}
            </Link>
          ))}
          {sectionLinks.map(({ anchor, label }) => (
            <a key={anchor} href={isLandingPage ? anchor : `/${anchor}`} onClick={(e) => handleSectionClick(e, anchor)} className="text-inverse-body hover:text-inverse-strong transition-colors text-sm font-medium">
              {label}
            </a>
          ))}
          {hasProfile && (
            <a
              href="/?app=1"
              className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-sage-700 shadow-lg ring-1 ring-sage-200 backdrop-blur hover:bg-white transition-colors"
            >
              Ga naar de app
            </a>
          )}
        </nav>
      </header>

      {/* Mobile Menu — only for non-authenticated users */}
      {!hasProfile && (
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
              {/* Page links */}
              {pageLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold text-inverse-strong hover:text-white/70 transition-colors py-3 border-b border-white/10"
                >
                  {label}
                </Link>
              ))}
              {/* Divider */}
              <div className="my-2 border-b border-white/20" />
              {/* Section links */}
              {sectionLinks.map(({ anchor, label }) => (
                <a
                  key={anchor}
                  href={isLandingPage ? anchor : `/${anchor}`}
                  onClick={(e) => handleSectionClick(e, anchor)}
                  className="text-2xl font-bold text-inverse-strong hover:text-white/70 transition-colors py-3 border-b border-white/10"
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="mt-auto">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onCheckout?.();
                }}
                className="cta-accent-button w-full text-center text-base py-4"
              >
                Begin met de 5 regels
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
