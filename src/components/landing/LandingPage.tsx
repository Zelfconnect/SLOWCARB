import { useEffect, useCallback, useRef } from 'react';
import { useDocumentScroll } from '@/hooks/useDocumentScroll';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { SEOHead } from '@/components/seo/SEOHead';
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

const STRIPE_URL = 'https://buy.stripe.com/5kQ4gBeAG19IfBNcWn5Rm01';

export default function LandingPage() {
  const openCheckout = useCallback((source: string) => {
    trackLanding('landing_cta_click', { source });
    const win = window.open(STRIPE_URL, '_blank');
    if (!win) {
      window.location.href = STRIPE_URL;
    }
  }, []);

  useDocumentScroll();
  const { ref: revealRef } = useRevealOnScroll<HTMLDivElement>({
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.18,
  });

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
    <>
      <SEOHead
        title="SlowCarb – Val 8-10 kg af in 6 weken"
        description="Het slow carb dieet van Tim Ferriss. 5 simpele regels, 50+ recepten, 84-dagen programma. Zonder calorieën tellen. Eenmalig €47."
        canonical="https://eatslowcarb.com/"
        ogType="website"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'SlowCarb',
            url: 'https://eatslowcarb.com',
            applicationCategory: 'HealthApplication',
            operatingSystem: 'Web',
            description: 'Slow carb dieet app met 50+ recepten, boodschappenlijst en 84-dagen programma.',
            offers: {
              '@type': 'Offer',
              price: '47.00',
              priceCurrency: 'EUR',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'Is dit een abonnement?', acceptedAnswer: { '@type': 'Answer', text: 'Nee. Je betaalt één keer €47 en hebt daarna voor altijd toegang. Geen maandelijkse kosten, geen verrassingen.' } },
              { '@type': 'Question', name: 'Moet ik naar de sportschool?', acceptedAnswer: { '@type': 'Answer', text: 'Nee. SlowCarb is puur voeding. Bewegen helpt altijd, maar het protocol werkt zonder gym. Jesper verloor 8 kilo zonder sportschool.' } },
              { '@type': 'Question', name: 'Werkt dit ook met ADHD of een druk leven?', acceptedAnswer: { '@type': 'Answer', text: 'Juist dan. De 5 regels zijn zo simpel dat ze geen cognitieve ruimte kosten. Geen bijhouden, geen tellen, geen dagelijkse keuzes. De app doet het denkwerk.' } },
              { '@type': 'Question', name: 'Wat als het niet werkt voor mij?', acceptedAnswer: { '@type': 'Answer', text: 'Dan krijg je je geld terug. 30 dagen, geen vragen. Maar het protocol van Tim Ferriss is bewezen bij duizenden mensen wereldwijd. De app maakt het alleen makkelijker om het vol te houden.' } },
              { '@type': 'Question', name: 'Is dit gewoon een kookboek-app?', acceptedAnswer: { '@type': 'Answer', text: 'Nee. Het is een complete tool: AmmoCheck checklist, dagtracker, 84-dagen educatie, recepten en boodschappenlijst. Alles om het protocol 6+ weken vol te houden.' } },
              { '@type': 'Question', name: 'Hoe snel zie ik resultaat?', acceptedAnswer: { '@type': 'Answer', text: 'De meeste mensen verliezen 1-2 kg in de eerste week. In 6 weken is 8-10 kg realistisch. Zonder honger en zonder extreme maatregelen.' } },
            ],
          },
        ]}
      />
    <div ref={revealRef} className="landing-page bg-surface-paper font-sans text-ink-body antialiased selection:bg-sage-200 selection:text-ink-strong w-full min-w-0 overflow-x-hidden">
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
    </>
  );
}
