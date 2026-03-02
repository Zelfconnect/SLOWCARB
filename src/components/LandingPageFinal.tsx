import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Apple,
  Bean,
  Check,
  ChevronRight,
  Egg,
  GlassWater,
  PartyPopper,
  ShieldCheck,
  Smartphone,
  WheatOff,
  XCircle,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import { STORAGE_KEYS } from '@/lib/storageKeys';

type Rule = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
};

type Feature = {
  title: string;
  description: string;
};

type Testimonial = {
  quote: string;
  name: string;
  result: string;
};

const SYSTEM_FONT_STACK = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const styles = {
  colors: {
    white: '#FFFFFF',
    sectionAlt: '#F8FAFC',
    lightGreenBg: '#F0FAF5',
    primaryGreen: '#1A9A5B',
    accentGreen: '#00C2A0',
    textPrimary: '#1F2937',
    textSecondary: '#4B5563',
    textLight: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    danger: '#DC2626',
    footer: '#1F2937',
  },
  shadows: {
    soft: '0 10px 30px -10px rgba(0,0,0,0.08)',
    mockup: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    button: '0 4px 14px 0 rgba(26,154,91,0.3)',
  },
} as const;

const ruleIcons = [WheatOff, Egg, GlassWater, Apple, Bean] as const;
const painIcons = [AlertCircle, XCircle, Zap] as const;

function useSectionReveal(sectionCount: number) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<boolean[]>(
    Array.from({ length: sectionCount }, (_, index) => index <= 1)
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (Number.isNaN(index)) return;

          setVisibleSections((prev) => {
            if (prev[index]) return prev;
            const next = [...prev];
            next[index] = true;
            return next;
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );

    refs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (index: number) => (node: HTMLElement | null) => {
    refs.current[index] = node;
  };

  return { visibleSections, setRef };
}

function revealClass(isVisible: boolean) {
  return isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-6';
}

function PrimaryButton({ text, onClick, className = '' }: { text: string; onClick: () => void; className?: string }) {
  return (
    <Button
      onClick={onClick}
      className={`h-[58px] w-full rounded-[12px] border-0 text-[18px] font-semibold tracking-[0.01em] text-white hover:opacity-95 ${className}`}
      style={{
        backgroundColor: styles.colors.primaryGreen,
        boxShadow: styles.shadows.button,
        fontFamily: SYSTEM_FONT_STACK,
      }}
    >
      {text}
    </Button>
  );
}

function RepeatedCTA({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <div className="pt-8">
      <PrimaryButton text={text} onClick={onClick} />
    </div>
  );
}

function RuleCard({ number, icon: Icon, title, description }: { number: number; icon: React.ElementType; title: string; description: string }) {
  return (
    <article
      className="rounded-2xl p-6"
      style={{
        backgroundColor: styles.colors.white,
        border: '1px solid #F1F3F5',
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: styles.colors.primaryGreen, fontFamily: SYSTEM_FONT_STACK }}
        >
          {number}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0" style={{ color: styles.colors.primaryGreen }} strokeWidth={3} />
            <Icon className="h-4 w-4 shrink-0" style={{ color: styles.colors.primaryGreen }} strokeWidth={2} />
            <h3 className="text-[17px] font-semibold leading-[1.35]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
              {title}
            </h3>
          </div>
          {description ? (
            <p className="text-[15px] leading-[1.5]" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function FloatingMobileCTA({
  visible,
  onClick,
  spotsLeftText,
  buttonText,
}: {
  visible: boolean;
  onClick: () => void;
  spotsLeftText: string;
  buttonText: string;
}) {
  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t p-3 md:hidden"
      style={{
        backgroundColor: styles.colors.white,
        borderColor: styles.colors.border,
        paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="mx-auto w-full max-w-[428px]">
        <div className="mb-2 text-center text-xs font-medium" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
          {spotsLeftText}
        </div>
        <PrimaryButton text={buttonText} onClick={onClick} className="h-[52px] text-[16px]" />
      </div>
    </div>
  );
}

export default function LandingPageFinal() {
  const { t } = useTranslation();
  const { visibleSections, setRef } = useSectionReveal(11);
  const [showAppButton, setShowAppButton] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const painSectionRef = useRef<HTMLElement | null>(null);

  const stripeUrl = 'https://buy.stripe.com/5kQ28t0JQ9Geaht9Kb5Rm00';
  const heroImageSrc = '/images/landing/HERO.webp';

  const rules: Rule[] = ruleIcons.map((icon, index) => ({
    icon,
    title: String(t(`landing.rules.${index}.title`)),
    description: String(t(`landing.rules.${index}.description`)),
  }));

  const features: Feature[] = [0, 1, 2, 3, 4].map((index) => ({
    title: String(t(`landing.features.${index}.title`)),
    description: String(t(`landing.features.${index}.description`)),
  }));

  const painItems = t('landing.painPoints') as string[];
  const pricingFeatures = t('landing.pricingFeatures') as string[];
  const testimonials: Testimonial[] = [0, 1, 2].map((index) => ({
    quote: String(t(`landing.testimonials.${index}.quote`)),
    name: String(t(`landing.testimonials.${index}.name`)),
    result: String(t(`landing.testimonials.${index}.result`)),
  }));

  const footerBadges = t('landing.footerBadges') as string[];
  const footerLinks = t('landing.footerLinks') as Array<{ label: string; href: string }>;

  useEffect(() => {
    const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!storedProfile) return;

    try {
      const parsedProfile = JSON.parse(storedProfile) as { hasCompletedOnboarding?: boolean };
      if (parsedProfile.hasCompletedOnboarding) {
        setShowAppButton(true);
      }
    } catch {
      setShowAppButton(false);
    }
  }, []);

  useEffect(() => {
    const el = painSectionRef.current;
    if (!el) return;
    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setShowFloatingCTA(scrolledPast);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const existingPreload = document.querySelector(`link[rel="preload"][href="${heroImageSrc}"]`);
    if (existingPreload) return;

    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = heroImageSrc;
    preloadLink.type = 'image/webp';
    preloadLink.setAttribute('fetchpriority', 'high');
    preloadLink.setAttribute('data-landing-hero-preload', 'true');
    document.head.appendChild(preloadLink);

    return () => {
      if (preloadLink.parentNode) preloadLink.parentNode.removeChild(preloadLink);
    };
  }, [heroImageSrc]);

  const openCheckout = () => {
    window.open(stripeUrl, '_blank');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: styles.colors.white, fontFamily: SYSTEM_FONT_STACK }}>
      {showAppButton ? (
        <a
          href="/?app=1"
          className="fixed right-4 top-4 z-50 rounded-full px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: styles.colors.primaryGreen, boxShadow: styles.shadows.soft, fontFamily: SYSTEM_FONT_STACK }}
        >
          {String(t('landing.openApp'))}
        </a>
      ) : null}

      <main className="mx-auto w-full max-w-[428px]">
        <section
          ref={setRef(0)}
          data-index={0}
          className="flex min-h-[75vh] flex-col px-5 pb-[60px] pt-10"
          style={{ backgroundColor: styles.colors.white }}
        >
          <div className={`transition-all duration-700 ${revealClass(visibleSections[0])}`}>
            <p className="text-sm font-semibold" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.badge'))}
            </p>
            <h1
              className="mt-4 text-[34px] font-bold leading-[1.15] tracking-[-0.02em]"
              style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}
            >
              {String(t('landing.heroTitle'))}
            </h1>
            <p className="mt-5 text-[21px] font-medium leading-[1.35]" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.heroSubtitle'))}
            </p>
            <div className="mt-8">
              <PrimaryButton text={String(t('landing.ctaPrimary'))} onClick={openCheckout} />
            </div>
            <p className="mt-4 text-[15px] leading-[1.5]" style={{ color: styles.colors.textLight, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.ctaSubtext'))}
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border" style={{ borderColor: styles.colors.border, boxShadow: styles.shadows.soft }}>
            <img
              src={heroImageSrc}
              alt={String(t('landing.lifestyleImageAlt'))}
              fetchPriority="high"
              decoding="async"
              className="h-[280px] w-full object-cover"
            />
          </div>
        </section>

        <section
          ref={(node) => {
            setRef(1)(node);
            painSectionRef.current = node;
          }}
          data-index={1}
          className="px-5 py-[60px]"
          style={{ backgroundColor: styles.colors.sectionAlt }}
        >
          <div className={`transition-all duration-700 ${revealClass(visibleSections[1])}`}>
            <span className="text-sm font-bold tracking-wider text-gray-600">{String(t('landing.painPointsLabel'))}</span>
            <h2 className="mt-2 text-[26px] font-bold leading-[1.25]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.painPointsTitle'))}
            </h2>
          </div>

          <div className={`mt-8 space-y-6 transition-all duration-700 ${revealClass(visibleSections[1])}`}>
            {painItems.map((item, index) => {
              const Icon = painIcons[index % painIcons.length];
              return (
                <div key={item} className="flex items-start gap-4">
                  <Icon className="mt-1 h-12 w-12 shrink-0" style={{ color: styles.colors.textLight }} strokeWidth={1.7} />
                  <p className="text-[17px] leading-[1.65]" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
                    {item}
                  </p>
                </div>
              );
            })}
          </div>

          <RepeatedCTA text={String(t('landing.ctaPrimary'))} onClick={openCheckout} />
        </section>

        <section ref={setRef(2)} data-index={2} className="px-5 py-[60px]" style={{ backgroundColor: styles.colors.white }}>
          <div className={`transition-all duration-700 ${revealClass(visibleSections[2])}`}>
            <p className="text-sm font-semibold" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.rulesLabel'))}
            </p>
            <h2 className="mt-2 text-[26px] font-bold leading-[1.25]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.rulesTitle'))}
            </h2>
          </div>

          <div className={`mt-8 space-y-6 transition-all duration-700 ${revealClass(visibleSections[2])}`}>
            {rules.map((rule, index) => (
              <RuleCard
                key={rule.title}
                number={index + 1}
                icon={rule.icon}
                title={rule.title}
                description={rule.description}
              />
            ))}

            <article
              className="rounded-2xl border p-6"
              style={{
                backgroundColor: '#F8FFFC',
                borderColor: styles.colors.primaryGreen,
              }}
            >
              <div className="flex items-start gap-3">
                <PartyPopper className="mt-1 h-5 w-5 shrink-0" style={{ color: styles.colors.primaryGreen }} />
                <div>
                  <h3 className="text-[17px] font-semibold" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
                    {String(t('landing.cheatdayTitle'))}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.5]" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
                    {String(t('landing.cheatdayText'))}
                  </p>
                </div>
              </div>
            </article>
          </div>

          <RepeatedCTA text={String(t('landing.ctaPrimary'))} onClick={openCheckout} />
        </section>

        <section ref={setRef(3)} data-index={3} className="px-5 py-[60px]" style={{ backgroundColor: styles.colors.sectionAlt }}>
          <div className={`transition-all duration-700 ${revealClass(visibleSections[3])}`}>
            <p className="text-sm font-semibold" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.featuresLabel'))}
            </p>
            <h2 className="mt-2 text-[26px] font-bold leading-[1.25]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.featuresTitle'))}
            </h2>
          </div>

          <div className={`mt-8 transition-all duration-700 ${revealClass(visibleSections[3])}`}>
            <div className="relative mx-auto h-[520px] w-[270px]">
              {[
                { label: 'Dashboard', top: 0, left: 24 },
                { label: 'Recepten', top: 74, left: 0 },
                { label: 'Boodschappenlijst', top: 150, left: 34 },
                { label: 'Voortgang', top: 226, left: 8 },
                { label: 'Onboarding', top: 302, left: 44 },
              ].map((phone, index) => (
                <div
                  key={phone.label}
                  className="absolute h-[190px] w-[116px] rounded-[24px] border-4 border-[#111827] bg-white p-2"
                  style={{
                    top: `${phone.top}px`,
                    left: `${phone.left}px`,
                    boxShadow: styles.shadows.mockup,
                    zIndex: 10 + index,
                  }}
                >
                  <div className="mb-2 mx-auto h-1.5 w-10 rounded-full bg-[#D1D5DB]" />
                  <div className="flex h-full flex-col items-center justify-center rounded-[16px] border border-dashed border-[#D1D5DB] bg-[#F3F4F6] text-center">
                    <Smartphone className="mb-2 h-5 w-5 text-[#6B7280]" strokeWidth={2} />
                    <p className="px-2 text-[12px] font-medium leading-tight text-[#6B7280]" style={{ fontFamily: SYSTEM_FONT_STACK }}>
                      {phone.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border bg-white p-5"
                style={{ borderColor: styles.colors.border, boxShadow: styles.shadows.soft }}
              >
                <h3 className="text-[17px] font-semibold leading-[1.35]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
                  {feature.title}
                </h3>
                {feature.description ? (
                  <p className="mt-2 text-[15px] leading-[1.5]" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
                    {feature.description}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section ref={setRef(4)} data-index={4} className="px-5 py-[60px]" style={{ backgroundColor: styles.colors.lightGreenBg }}>
          <div className={`text-center transition-all duration-700 ${revealClass(visibleSections[4])}`}>
            <p className="text-sm font-semibold" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.kissLabel'))}
            </p>
            <h2 className="mt-2 text-[26px] font-bold leading-[1.25]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.kissTitle'))}
            </h2>
            <p className="mx-auto mt-6 text-[21px] font-medium leading-[1.35]" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.kissTextTop'))}
            </p>
            <p className="mt-4 text-[17px] leading-[1.65]" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.kissTextMiddle'))}
            </p>
            <p className="mt-4 text-[17px] font-semibold leading-[1.65]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.kissTextBottom'))}
            </p>

            <div className="mx-auto mt-8 flex max-w-[320px] items-center justify-between gap-4">
              {[String(t('landing.breakfastImageAlt')), String(t('landing.mealPrepImageAlt')), String(t('landing.lifestyleImageAlt'))].map((label) => (
                <div key={label} className="flex w-24 flex-col items-center gap-2">
                  <div
                    className="h-12 w-12 rounded-full"
                    style={{
                      background: `linear-gradient(145deg, ${styles.colors.primaryGreen}, ${styles.colors.accentGreen})`,
                    }}
                  />
                  <p className="text-center text-[12px] leading-tight" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <RepeatedCTA text={String(t('landing.ctaPrimary'))} onClick={openCheckout} />
        </section>

        <section ref={setRef(5)} data-index={5} className="px-5 py-[60px]" style={{ backgroundColor: styles.colors.white }}>
          <div className={`transition-all duration-700 ${revealClass(visibleSections[5])}`}>
            <p className="text-sm font-semibold" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.storyLabel'))}
            </p>
            <h2 className="mt-2 text-[26px] font-bold leading-[1.25]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.storyTitle'))}
            </h2>
          </div>

          <div className={`mt-8 grid grid-cols-2 gap-4 transition-all duration-700 ${revealClass(visibleSections[5])}`}>
            <div className="aspect-[4/3] rounded-2xl border-2 border-dashed p-4" style={{ borderColor: styles.colors.border, backgroundColor: '#F3F4F6' }}>
              <p className="text-sm font-medium" style={{ color: styles.colors.textLight, fontFamily: SYSTEM_FONT_STACK }}>
                Foto komt hier
              </p>
            </div>
            <div className="aspect-[4/3] rounded-2xl border-2 border-dashed p-4" style={{ borderColor: styles.colors.border, backgroundColor: '#F3F4F6' }}>
              <p className="text-sm font-medium" style={{ color: styles.colors.textLight, fontFamily: SYSTEM_FONT_STACK }}>
                {String(t('landing.storyPlaceholder'))}
              </p>
            </div>
          </div>

          <blockquote
            className="mt-8 rounded-2xl p-6"
            style={{
              borderLeft: `4px solid ${styles.colors.primaryGreen}`,
              backgroundColor: styles.colors.sectionAlt,
            }}
          >
            <p className="text-[17px] italic leading-[1.65]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.storyQuote'))}
            </p>
          </blockquote>
        </section>

        <section ref={setRef(6)} data-index={6} className="px-5 py-[60px]" style={{ backgroundColor: styles.colors.sectionAlt }}>
          <div className={`transition-all duration-700 ${revealClass(visibleSections[6])}`}>
            <p className="inline-block rounded-full px-3 py-1 text-sm font-semibold" style={{ backgroundColor: '#FEE2E2', color: styles.colors.danger, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.spotsLeft'))}
            </p>
            <h2 className="mt-4 text-[26px] font-bold leading-[1.25]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.pricingTitle'))}
            </h2>
            <p className="mt-2 text-[17px] leading-[1.65]" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.pricingSubtitle'))}
            </p>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-[26px] font-semibold leading-none line-through" style={{ color: styles.colors.textLight, fontFamily: SYSTEM_FONT_STACK }}>
                €247
              </span>
              <span className="text-[26px] font-semibold leading-none" style={{ color: styles.colors.textLight, fontFamily: SYSTEM_FONT_STACK }}>
                €79
              </span>
              <span className="text-[52px] font-bold leading-none" style={{ color: styles.colors.primaryGreen, fontFamily: SYSTEM_FONT_STACK }}>
                €47
              </span>
            </div>

            <p className="mt-4 text-[15px] leading-[1.5]" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.pricingNote'))}
            </p>
          </div>

          <ul className={`mt-8 space-y-4 transition-all duration-700 ${revealClass(visibleSections[6])}`}>
            {pricingFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0" style={{ color: styles.colors.success }} strokeWidth={3} />
                <span className="text-[17px] leading-[1.65]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <PrimaryButton text={String(t('landing.pricingCta'))} onClick={openCheckout} />
          </div>
          <p className="mt-3 text-center text-[15px]" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
            {String(t('landing.pricingGuarantee'))}
          </p>

          <RepeatedCTA text={String(t('landing.ctaPrimary'))} onClick={openCheckout} />
        </section>

        <section ref={setRef(7)} data-index={7} className="px-5 py-[60px]" style={{ backgroundColor: styles.colors.white }}>
          <div className={`transition-all duration-700 ${revealClass(visibleSections[7])}`}>
            <p className="text-sm font-semibold" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.testimonialsLabel'))}
            </p>
            <h2 className="mt-2 text-[26px] font-bold leading-[1.25]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.testimonialsTitle'))}
            </h2>
          </div>

          <div className="mt-8 space-y-5">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-2xl border p-6"
                style={{ borderColor: styles.colors.border, backgroundColor: styles.colors.white, boxShadow: styles.shadows.soft }}
              >
                <p className="text-[17px] italic leading-[1.65]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
                  "{testimonial.quote}"
                </p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-[17px] font-semibold" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
                    {testimonial.name}
                  </p>
                  <p className="text-[15px] font-medium" style={{ color: styles.colors.primaryGreen, fontFamily: SYSTEM_FONT_STACK }}>
                    {testimonial.result}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section ref={setRef(8)} data-index={8} className="px-5 py-[60px]" style={{ backgroundColor: styles.colors.lightGreenBg }}>
          <div className={`rounded-2xl border p-8 text-center transition-all duration-700 ${revealClass(visibleSections[8])}`} style={{ borderColor: '#D1FAE5', backgroundColor: '#ECFDF5' }}>
            <ShieldCheck className="mx-auto h-14 w-14" style={{ color: styles.colors.primaryGreen }} strokeWidth={1.8} />
            <p className="mt-4 text-sm font-semibold" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.guaranteeLabel'))}
            </p>
            <h2 className="mt-2 text-[26px] font-bold leading-[1.25]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.guaranteeTitle'))}
            </h2>
            <p className="mt-4 text-[17px] leading-[1.65]" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.guaranteeText'))}
            </p>
          </div>
        </section>

        <section ref={setRef(9)} data-index={9} className="px-5 py-[60px]" style={{ backgroundColor: styles.colors.white }}>
          <div className={`transition-all duration-700 ${revealClass(visibleSections[9])}`}>
            <h2 className="text-[34px] font-bold leading-[1.15] tracking-[-0.02em]" style={{ color: styles.colors.textPrimary, fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.finalCtaTitle'))}
            </h2>
            {String(t('landing.finalCtaText')) ? (
              <p className="mt-4 text-[17px] leading-[1.65]" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
                {String(t('landing.finalCtaText'))}
              </p>
            ) : null}

            <div className="mt-8">
              <PrimaryButton text={String(t('landing.finalCtaButton'))} onClick={openCheckout} />
            </div>

            <div className="mt-6 space-y-2">
              {footerBadges.map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <Check className="h-4 w-4" style={{ color: styles.colors.success }} strokeWidth={3} />
                  <span className="text-[15px]" style={{ color: styles.colors.textSecondary, fontFamily: SYSTEM_FONT_STACK }}>
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer ref={setRef(10)} data-index={10} className="px-5 pb-24 pt-10 md:pb-10" style={{ backgroundColor: styles.colors.footer }}>
          <div className={`transition-all duration-700 ${revealClass(visibleSections[10])}`}>
            <p className="text-sm" style={{ color: '#D1D5DB', fontFamily: SYSTEM_FONT_STACK }}>
              {String(t('landing.footerCopy'))}
            </p>

            <div className="mt-6 space-y-3">
              <a
                href="/?app=1"
                className="flex items-center gap-1 text-sm font-medium"
                style={{ color: '#ECFDF5', fontFamily: SYSTEM_FONT_STACK }}
              >
                {String(t('landing.openApp'))}
                <ChevronRight className="h-4 w-4" />
              </a>

              {footerLinks.map(({ href, label }) => (
                <a key={href} href={href} className="block text-sm" style={{ color: '#E5E7EB', fontFamily: SYSTEM_FONT_STACK }}>
                  {label}
                </a>
              ))}

              <a
                href={`mailto:${String(t('landing.footerContactEmail'))}`}
                className="block text-sm"
                style={{ color: '#E5E7EB', fontFamily: SYSTEM_FONT_STACK }}
              >
                {String(t('landing.footerContactLabel'))}: {String(t('landing.footerContactEmail'))}
              </a>
            </div>
          </div>
        </footer>
      </main>

      <FloatingMobileCTA
        visible={showFloatingCTA}
        onClick={openCheckout}
        spotsLeftText={String(t('landing.spotsLeft'))}
        buttonText={String(t('landing.ctaPrimary'))}
      />
    </div>
  );
}
