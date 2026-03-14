import { useEffect, useCallback } from 'react';
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
import '@/styles/landing.css';

export default function LandingPage() {
  const openCheckout = useCallback(() => {
    window.open('https://buy.stripe.com/5kQ28t0JQ9Geaht9Kb5Rm00', '_blank');
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Immediately show all elements
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

  const hasProfile = Boolean(localStorage.getItem('slowcarb_profile'));

  return (
    <div className="landing-page bg-surface-paper font-sans text-ink-body antialiased selection:bg-sage-200 selection:text-ink-strong w-full min-w-0 overflow-x-hidden">
      <StickyCTA onCheckout={openCheckout} />
      <LandingHero onCheckout={openCheckout} />
      <RecognitionSection />
      <SolutionSection />
      <AppShowcase />
      <RulesSection />
      <FounderSection />
      <PricingSection onCheckout={openCheckout} />
      <FAQSection />
      <FinalCTA onCheckout={openCheckout} />
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
