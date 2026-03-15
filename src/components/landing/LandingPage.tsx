import { useEffect, useCallback, useRef } from 'react';
import { LandingHero } from './LandingHero';
import { RecognitionSection } from './RecognitionSection';
import { SolutionSection } from './SolutionSection';
import { AppShowcase } from './AppShowcase';
import { RulesSection } from './RulesSection';
import { FounderSection } from './FounderSection';
import { PricingSection } from './PricingSection';
import { FAQSection } from './FAQSection';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';
import { StickyCTA } from './StickyCTA';
import { trackLanding } from './analytics';
import '@/styles/landing.css';

const STRIPE_URL = 'https://buy.stripe.com/5kQ28t0JQ9Geaht9Kb5Rm00';

export default function LandingPage() {
  const openCheckout = useCallback((source: string) => {
    trackLanding('landing_cta_click', { source });
    const win = window.open(STRIPE_URL, '_blank');
    if (!win) {
      window.location.href = STRIPE_URL;
    }
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.landing-page .scroll-animate').forEach((el) => {
        el.classList.add('show');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.landing-page .scroll-animate').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Section visibility tracking (fires once per section per page load)
  const trackedSections = useRef(new Set<string>());
  useEffect(() => {
    const sectionIds = ['premium-app-showcase', 'method', 'founder', 'pricing', 'faq'];
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting && !trackedSections.current.has(id)) {
            trackedSections.current.add(id);
            trackLanding('landing_section_view', { section: id });
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  let hasProfile = false;
  try {
    hasProfile = Boolean(localStorage.getItem('slowcarb_profile'));
  } catch {
    // localStorage unavailable (Safari private browsing, storage full)
  }

  return (
    <div className="landing-page bg-surface-paper font-sans text-ink-body antialiased selection:bg-sage-200 selection:text-ink-strong w-full min-w-0 overflow-x-hidden">
      <StickyCTA onCheckout={() => openCheckout('sticky_cta')} />
      <LandingHero onCheckout={() => openCheckout('hero')} />
      <RecognitionSection />
      <SolutionSection />
      <AppShowcase />
      <RulesSection />
      <FounderSection />
      <PricingSection onCheckout={() => openCheckout('pricing_card')} />
      <FAQSection />
      <FinalCTA onCheckout={() => openCheckout('final_cta')} />
      <Footer />

      {hasProfile && (
        <a
          href="/?app=1"
          className="fixed top-4 right-4 z-[70] rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-sage-700 shadow-lg ring-1 ring-sage-200 backdrop-blur hover:bg-white transition-colors"
        >
          Ga naar de app
        </a>
      )}
    </div>
  );
}
