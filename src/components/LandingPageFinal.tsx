import { useEffect, useRef, useState } from 'react';
import {
  Bean,
  Egg,
  GlassWater,
  ChefHat,
  Smartphone,
  ShoppingCart,
  BookOpen,
  PartyPopper,
  TrendingUp,
  Check,
  WheatOff,
  Apple,
  Quote,
  Shield,
  RefreshCw,
  AlertCircle,
  XCircle,
  Globe,
  Zap,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { useTranslation } from '@/i18n';

type Rule = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
};

type Feature = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
};

type Testimonial = {
  quote: string;
  name: string;
  result: string;
};

const ruleIcons = [WheatOff, Egg, GlassWater, Apple, Bean] as const;

const featureIcons = [ChefHat, Smartphone, ShoppingCart, BookOpen, TrendingUp] as const;

const trustItems = [
  { icon: Shield, text: 'Veilig afrekenen' },
  { icon: RefreshCw, text: '30 dagen geld-terug' },
  { icon: Globe, text: 'EU-conform' },
  { icon: Zap, text: 'Direct toegang' },
] as const;

const painIcons = [AlertCircle, XCircle, RefreshCw] as const;


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

function revealClass(isVisible: boolean, delay = 0) {
  const baseClasses = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-100 translate-y-6';
  const delayStyle = delay > 0 ? ` transition-delay-${delay}` : '';
  return baseClasses + delayStyle;
}

/**
 * Rule card: number = sequence anchor (primary), icon = topic reinforcement (secondary).
 * Good practice: one clear left anchor for order; icon grouped with title so it supports
 * meaning, not competing with the number.
 */
function RuleCard({
  number,
  icon: Icon,
  title,
  description,
  delay = 0,
  isVisible,
}: {
  number: number;
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
  isVisible: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-card transition-all duration-700 hover:shadow-card-hover ${revealClass(
        isVisible,
        delay
      )}`}
      style={{ transitionDelay: `${delay}ms` }}
      aria-label={`Regel ${number}: ${title}`}
    >
      <div className="flex items-start gap-4">
        {/* Single ordinal anchor — number only, no competing icon */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-600 font-display text-sm font-bold text-white"
          aria-hidden
        >
          {number}
        </div>
        <div className="flex-1 min-w-0">
          {/* Icon + title as one semantic unit (topic, not order) */}
          <div className="mb-2 flex items-center gap-2">
            <Icon
              className="h-4 w-4 shrink-0 text-sage-600"
              strokeWidth={2}
              aria-hidden
            />
            <h3 className="font-display font-semibold text-stone-800">{title}</h3>
          </div>
          {description && (
            <p className="text-sm leading-relaxed text-stone-600">{description}</p>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Cheatday card: same structure as RuleCard so it fits the design system;
 * stands out via clay accent (left border + clay badge) instead of a different layout.
 */
function CheatdayCard({
  title,
  description,
  delay = 0,
  isVisible,
}: {
  title: string;
  description: string;
  delay?: number;
  isVisible: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border border-stone-200 border-l-4 border-l-clay-500 bg-white p-5 shadow-card transition-all duration-700 hover:shadow-card-hover ${revealClass(
        isVisible,
        delay
      )}`}
      style={{ transitionDelay: `${delay}ms` }}
      aria-label={title}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-clay-500 font-display text-lg font-bold text-white"
          aria-hidden
        >
          +
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <PartyPopper
              className="h-4 w-4 shrink-0 text-clay-600"
              strokeWidth={2}
              aria-hidden
            />
            <h3 className="font-display font-semibold text-stone-800">{title}</h3>
          </div>
          <p className="text-sm leading-relaxed text-stone-600">{description}</p>
        </div>
      </div>
    </article>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
  isVisible,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
  isVisible: boolean;
}) {
  return (
    <article
      className={`group h-full rounded-2xl border border-stone-200 bg-white p-5 shadow-card transition-all duration-700 hover:shadow-card-hover ${revealClass(
        isVisible,
        delay
      )}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sage-100 to-sage-50 transition-transform duration-300 group-hover:scale-105">
        <Icon className="h-6 w-6 text-sage-700" strokeWidth={2} />
      </div>
      <h3 className="font-display text-lg font-semibold text-stone-800 mb-2">{title}</h3>
      {description && <p className="text-sm leading-relaxed text-stone-600">{description}</p>}
    </article>
  );
}

function TestimonialCard({
  quote,
  name,
  result,
  delay = 0,
  isVisible,
}: {
  quote: string;
  name: string;
  result: string;
  delay?: number;
  isVisible: boolean;
}) {
  return (
    <article
      className={`h-full rounded-2xl border border-stone-200 bg-white p-6 shadow-card transition-all duration-700 ${revealClass(
        isVisible,
        delay
      )}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Quote className="mb-4 h-8 w-8 text-sage-200" strokeWidth={2} />
      <p className="mb-6 italic leading-relaxed text-stone-700">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display font-semibold text-stone-800">{name}</p>
          <p className="text-sm font-medium text-sage-600">{result}</p>
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
      className="fixed bottom-0 left-0 right-0 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-3 mb-3 flex flex-col items-center gap-2 rounded-xl border border-sage-600 bg-sage-800 px-4 py-2.5 shadow-lg">
        <div className="flex flex-col items-center gap-0.5 text-center">
          <p className="text-sm font-bold tracking-tight text-white antialiased">
            €47 <span className="ml-1 text-xs font-normal text-sage-100 line-through opacity-90">€79</span>
          </p>
          <p className="text-xs leading-snug text-sage-100">{spotsLeftText}</p>
        </div>
        <Button
          onClick={onClick}
          size="sm"
          className="h-9 w-full max-w-[200px] rounded-lg border-0 bg-white px-4 text-sm font-semibold text-sage-800 shadow-sm hover:bg-stone-100 active:scale-[0.98]"
        >
          {buttonText}
        </Button>
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
  const heroImageSrc = '/images/landing/HERO.webp';

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
      { threshold: 0, rootMargin: '0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const rules: Rule[] = ruleIcons.map((icon, index) => ({
    icon,
    title: String(t(`landing.rules.${index}.title`)),
    description: String(t(`landing.rules.${index}.description`)),
  }));
  const features: Feature[] = featureIcons.map((icon, index) => ({
    icon,
    title: String(t(`landing.features.${index}.title`)),
    description: String(t(`landing.features.${index}.description`)),
  }));
  const testimonials: Testimonial[] = [0, 1, 2].map((index) => ({
    quote: String(t(`landing.testimonials.${index}.quote`)),
    name: String(t(`landing.testimonials.${index}.name`)),
    result: String(t(`landing.testimonials.${index}.result`)),
  }));
  const painItems = t('landing.painPoints') as string[];
  const pricingFeatures = t('landing.pricingFeatures') as string[];
  const footerBadges = t('landing.footerBadges') as string[];
  const footerLinks = t('landing.footerLinks') as Array<{ label: string; href: string }>;
  const footerContactLabel = String(t('landing.footerContactLabel'));
  const footerContactEmail = String(t('landing.footerContactEmail'));

  const stripeUrl = 'https://buy.stripe.com/5kQ28t0JQ9Geaht9Kb5Rm00';

  useEffect(() => {
    const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!storedProfile) return;

    try {
      const parsedProfile = JSON.parse(storedProfile) as { hasCompletedOnboarding?: boolean };
      if (parsedProfile.hasCompletedOnboarding === true) {
        setShowAppButton(true);
      }
    } catch {
      setShowAppButton(false);
    }
  }, []);

  useEffect(() => {
    const existingPreload = document.querySelector(
      `link[rel="preload"][href="${heroImageSrc}"]`
    );
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
      if (preloadLink.parentNode) {
        preloadLink.parentNode.removeChild(preloadLink);
      }
    };
  }, [heroImageSrc]);

  const openCheckout = () => {
    window.open(stripeUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-cream">
      {showAppButton && (
        <a
          href="/?app=1"
          className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-sage-600 px-4 py-2 text-sm text-white shadow-md transition-colors hover:bg-sage-700 sm:left-auto sm:right-4 sm:translate-x-0"
        >
          {String(t('landing.openApp'))}
        </a>
      )}

      {/* Hero Section */}
      <section
        ref={setRef(0)}
        data-index={0}
        className="relative flex min-h-[70vh] items-center overflow-hidden md:min-h-[80vh]"
        style={{
          backgroundImage: `url(${heroImageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-sage-900/60" />

        <div className="relative z-10 mx-auto w-full max-w-3xl px-5 pb-24 pt-20 text-center md:pb-40 md:pt-32">
          <div
            className={`transition-all duration-700 ${revealClass(
              visibleSections[0]
            )}`}
          >
            <span className="mb-6 inline-block rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              {String(t('landing.badge'))}
            </span>
            <h1 className="font-display text-3xl font-bold leading-tight text-white text-shadow md:text-5xl lg:text-6xl">
              {String(t('landing.heroTitle')).split('\n').map((line, index, arr) => {
                const numberHighlight = '8 tot 10 kilo';
                const hasHighlight = line.includes(numberHighlight);
                const [before, ...after] = line.split(numberHighlight);

                return (
                  <span key={`${line}-${index}`}>
                    {hasHighlight ? (
                      <>
                        {before}
                        <span className="text-sage-200">{numberHighlight}</span>
                        {after.join(numberHighlight)}
                      </>
                    ) : (
                      line
                    )}
                    {index < arr.length - 1 && <br />}
                  </span>
                );
              })}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-xl leading-relaxed text-sage-100 md:text-2xl">
              {String(t('landing.heroSubtitle'))}
            </p>

            <div className="mb-6 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                onClick={openCheckout}
                size="lg"
                className="h-14 rounded-xl bg-sage-600 px-8 text-lg font-semibold text-white shadow-elevated hover:bg-sage-700"
              >
                {String(t('landing.ctaPrimary'))}
              </Button>
            </div>

            <p className="inline-block rounded-full bg-black/20 px-4 py-1.5 text-sm font-medium text-sage-200 backdrop-blur-sm">
              {String(t('landing.ctaSubtext'))}
            </p>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-full"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#FAFAF9"
            />
          </svg>
        </div>
      </section>

      <section
        data-testid="landing-trust-bar"
        className="border-y border-sage-100/80 bg-sage-50 py-4"
        aria-label="Vertrouwen en zekerheid"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-stone-700">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.text} className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-sage-700" strokeWidth={2.1} aria-hidden />
                  <span className="font-medium">{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Problem/Solution Section (pain) – CTA shows only after scrolling past this */}
      <section
        ref={(el) => {
          setRef(1)(el);
          painSectionRef.current = el;
        }}
        data-index={1}
        className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div
          className={`mb-12 text-center transition-all duration-700 ${revealClass(
            visibleSections[1]
          )}`}
        >
          <span className="text-sm font-bold tracking-wider text-gray-600">
            {String(t('landing.painPointsLabel'))}
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-stone-800 md:text-4xl">
            {String(t('landing.painPointsTitle'))}
          </h2>
        </div>

        <div
          className={`mx-auto max-w-3xl rounded-3xl border border-stone-200 bg-stone-50 p-8 transition-all duration-700 md:p-10 ${revealClass(
            visibleSections[1]
          )}`}
          style={{ transitionDelay: '150ms' }}
        >
          <div className="space-y-4 text-base leading-relaxed text-stone-700 md:text-lg">
            {painItems.map((item, idx) => {
              const PainIcon = painIcons[idx % painIcons.length];
              return (
                <p key={idx} className="flex items-start gap-3">
                  <PainIcon
                    className="mt-0.5 h-5 w-5 shrink-0 text-clay-600"
                    strokeWidth={2.2}
                    aria-hidden
                  />
                  <span>{item}</span>
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* The 5 Rules Section — py-20 = 80px (8pt grid), sufficient spacing after cheatday card */}
      <section ref={setRef(2)} data-index={2} className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div
            className={`mb-12 text-center transition-all duration-700 ${revealClass(
              visibleSections[2]
            )}`}
          >
            <span className="text-sm font-medium uppercase tracking-wider text-sage-600">
              {String(t('landing.rulesLabel'))}
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-stone-800 md:text-4xl">
              {String(t('landing.rulesTitle'))}
            </h2>
          </div>

          {/* Breakfast Image */}
          <div
            className={`mb-10 transition-all duration-700 ${revealClass(
              visibleSections[2]
            )}`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className='relative overflow-hidden rounded-3xl shadow-lg'>
              <img
                src="/images/landing/HEROBREAKFAST.webp"
                alt={String(t('landing.breakfastImageAlt'))}
                loading="lazy"
                decoding="async"
                className='h-48 w-full object-cover saturate-[0.85] brightness-105 contrast-105 md:h-64'
              />
              <div className='absolute inset-0 bg-sage-700/10 mix-blend-overlay pointer-events-none' />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rules.map((rule, idx) => (
              <RuleCard
                key={rule.title}
                number={idx + 1}
                icon={rule.icon}
                title={rule.title}
                description={rule.description}
                delay={idx * 100}
                isVisible={visibleSections[2]}
              />
            ))}
            <CheatdayCard
              title={String(t('landing.cheatdayTitle'))}
              description={String(t('landing.cheatdayText'))}
              delay={500}
              isVisible={visibleSections[2]}
            />
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section
        ref={setRef(3)}
        data-index={3}
        className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div
          className={`mb-12 text-center transition-all duration-700 ${revealClass(
            visibleSections[3]
          )}`}
        >
          <span className="text-sm font-medium uppercase tracking-wider text-sage-600">
            {String(t('landing.featuresLabel'))}
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-stone-800 md:text-4xl">
            {String(t('landing.featuresTitle'))}
          </h2>
        </div>

        {/* Meal Prep Image */}
        <div
          className={`mb-10 transition-all duration-700 ${revealClass(
            visibleSections[3]
          )}`}
          style={{ transitionDelay: '100ms' }}
        >
          <div className='relative overflow-hidden rounded-3xl shadow-lg'>
            <img
              src="/images/landing/MEALPREP.jpg"
              alt={String(t('landing.mealPrepImageAlt'))}
              loading="lazy"
              decoding="async"
              className='h-56 w-full object-cover saturate-[0.85] brightness-105 contrast-105 md:h-72'
            />
            <div className='absolute inset-0 bg-sage-700/10 mix-blend-overlay pointer-events-none' />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={idx * 100}
              isVisible={visibleSections[3]}
            />
          ))}
        </div>
      </section>

      {/* KISS Section */}
      <section ref={setRef(4)} data-index={4} className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-3xl border border-sage-100 bg-gradient-to-br from-sage-50 to-stone-50 p-8 text-center transition-all duration-700 md:p-12 ${revealClass(
              visibleSections[4]
            )}`}
          >
            <span className="text-sm font-medium uppercase tracking-wider text-sage-700">
              {String(t('landing.kissLabel'))}
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-800 md:text-4xl">
              {String(t('landing.kissTitle'))}
            </h2>
            <div className="mx-auto mt-8 max-w-2xl space-y-4 text-lg leading-relaxed text-stone-700">
              <p>{String(t('landing.kissTextTop'))}</p>
              <p>{String(t('landing.kissTextMiddle'))}</p>
              <p className="font-semibold text-stone-800">{String(t('landing.kissTextBottom'))}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Story Section */}
      <section
        ref={setRef(5)}
        data-index={5}
        className="bg-stone-50 py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-3xl border border-sage-100 bg-sage-50 p-8 transition-all duration-700 md:p-12 ${revealClass(
              visibleSections[5]
            )}`}
          >
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-sage-700">
                <Heart className="h-4 w-4" strokeWidth={2.2} />
                {String(t('landing.storyLabel'))}
              </span>
            </div>

            <h2 className="max-w-3xl font-display text-3xl font-bold text-stone-800 md:text-4xl">
              {String(t('landing.storyTitle'))}
            </h2>

            <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
              <div className="space-y-5">
                <blockquote className="rounded-2xl border border-white/70 bg-white p-6 text-xl leading-relaxed text-stone-700 md:p-8">
                  <p className="font-display text-4xl leading-none text-sage-300">&ldquo;</p>
                  <p className="-mt-2">{String(t('landing.storyQuote'))}</p>
                </blockquote>
                <Button
                  onClick={openCheckout}
                  size="lg"
                  className="h-14 rounded-xl bg-sage-600 px-8 text-lg font-semibold text-white shadow-elevated hover:bg-sage-700"
                >
                  {String(t('landing.ctaPrimary'))}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[4/5] rounded-2xl border-2 border-dashed border-sage-200 bg-white/70 p-4 text-sm text-stone-500">
                  {String(t('landing.storyPlaceholder'))}
                </div>
                <div className="aspect-[4/5] rounded-2xl border-2 border-dashed border-sage-200 bg-white/70 p-4 text-sm text-stone-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" ref={setRef(6)} data-index={6} className="py-20">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-3xl border border-stone-200 bg-white p-8 shadow-elevated transition-all duration-700 ${revealClass(
              visibleSections[6]
            )}`}
          >
            <div className="mb-8 text-center">
              <span className="mb-4 inline-block rounded-full bg-sage-100 px-3 py-1 text-sm font-medium text-sage-700">
                {String(t('landing.pricingLabel'))}
              </span>
              <h3 className="mb-2 font-display text-2xl font-bold text-stone-800">
                {String(t('landing.pricingTitle'))}
              </h3>
              <p className="text-sm text-stone-600">{String(t('landing.pricingSubtitle'))}</p>
            </div>

            <div className="mb-8 flex flex-wrap items-end justify-center gap-x-3 gap-y-1">
              <span className="font-display text-2xl font-semibold text-stone-400 line-through">
                €247
              </span>
              <span className="font-display text-3xl font-semibold text-stone-500">€79</span>
              <span className="font-display text-5xl font-bold text-stone-800">€47</span>
            </div>

            <p className="mb-6 text-center text-sm text-clay-600">
              {String(t('landing.pricingNote'))}
            </p>

            <ul className="mb-8 space-y-4">
              {pricingFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-100">
                    <Check className="h-3 w-3 text-sage-600" strokeWidth={3} />
                  </div>
                  <span className="text-stone-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={openCheckout}
              size="lg"
              className="h-14 w-full rounded-xl bg-sage-600 text-lg font-semibold text-white shadow-soft hover:bg-sage-700"
            >
              {String(t('landing.pricingCta'))}
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={setRef(7)} data-index={7} className="bg-stone-50 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div
            className={`mb-12 text-center transition-all duration-700 ${revealClass(
              visibleSections[7]
            )}`}
          >
            <span className="text-sm font-medium uppercase tracking-wider text-sage-600">
              {String(t('landing.testimonialsLabel'))}
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-stone-800 md:text-4xl">
              {String(t('landing.testimonialsTitle'))}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <TestimonialCard
                key={testimonial.name}
                quote={testimonial.quote}
                name={testimonial.name}
                result={testimonial.result}
                delay={idx * 100}
                isVisible={visibleSections[7]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section ref={setRef(8)} data-index={8} className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-3xl border border-sage-100 bg-sage-50 p-8 text-center transition-all duration-700 md:p-12 ${revealClass(
              visibleSections[8]
            )}`}
          >
            <span className="text-sm font-medium uppercase tracking-wider text-sage-700">
              {String(t('landing.guaranteeLabel'))}
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-stone-800 md:text-4xl">
              {String(t('landing.guaranteeTitle'))}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-stone-700">
              {String(t('landing.guaranteeText'))}
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section ref={setRef(9)} data-index={9} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-700 to-sage-800" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28 lg:px-8 text-center">
          <div
            className={`transition-all duration-700 ${revealClass(
              visibleSections[9]
            )}`}
          >
            <h2 className="mb-6 font-display text-3xl font-bold text-white text-shadow md:text-5xl">
              {String(t('landing.finalCtaTitle'))}
            </h2>

            <Button
              onClick={openCheckout}
              size="lg"
              className="h-14 rounded-xl bg-sage-600 px-10 text-lg font-semibold text-white shadow-elevated hover:bg-sage-700"
            >
              {String(t('landing.finalCtaButton'))}
            </Button>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-sage-300">
              {footerBadges.map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={setRef(10)} data-index={10} className="bg-stone-900 py-8 pb-24 md:pb-8 text-stone-400">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-col items-center justify-between gap-4 md:flex-row transition-all duration-700 ${revealClass(
              visibleSections[10]
            )}`}
          >
            <p className="text-sm">{String(t('landing.footerCopy'))}</p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <a href="/?app=1" className="text-sage-300 transition-colors hover:text-sage-200">
                {String(t('landing.openApp'))}
              </a>
              {footerLinks.map(({ label, href }) => (
                <a key={href} href={href} className="transition-colors hover:text-white">
                  {label}
                </a>
              ))}
              <a
                href={`mailto:${footerContactEmail}`}
                className="transition-colors hover:text-white"
              >
                {footerContactLabel}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Mobile CTA – only after user scrolls past pain section */}
      <FloatingMobileCTA
        visible={showFloatingCTA}
        onClick={openCheckout}
        spotsLeftText={String(t('landing.spotsLeft'))}
        buttonText={String(t('landing.ctaPrimary'))}
      />
    </div>
  );
}
