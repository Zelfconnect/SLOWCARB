import { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
  ArrowRight,
  RotateCcw,
  Calculator,
  Clock,
  WheatOff,
  Apple,
  Quote,
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

type FAQ = {
  question: string;
  answer: string;
};

const painPoints = [
  { icon: RotateCcw },
  { icon: Calculator },
  { icon: Clock },
] as const;

const ruleIcons = [WheatOff, Egg, GlassWater, Apple, Bean] as const;

const featureIcons = [ChefHat, Smartphone, ShoppingCart, BookOpen, PartyPopper, TrendingUp] as const;


function useSectionReveal(sectionCount: number) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<boolean[]>(
    Array.from({ length: sectionCount }, (_, index) => index === 0)
  );

  useEffect(() => {
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
    : 'opacity-0 translate-y-6';
  const delayStyle = delay > 0 ? ` transition-delay-${delay}` : '';
  return baseClasses + delayStyle;
}

function PainPointCard({
  icon: Icon,
  text,
  delay = 0,
  isVisible,
}: {
  icon: React.ElementType;
  text: string;
  delay?: number;
  isVisible: boolean;
}) {
  return (
    <article
      className={`flex items-center gap-4 rounded-xl bg-stone-50 p-4 border border-stone-100 transition-all duration-700 ${revealClass(
        isVisible,
        delay
      )}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-soft">
        <Icon className="h-5 w-5 text-clay-600" strokeWidth={2} />
      </div>
      <p className="text-sm font-medium text-stone-700">{text}</p>
    </article>
  );
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
          <p className="text-sm leading-relaxed text-stone-600">{description}</p>
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
      <p className="text-sm leading-relaxed text-stone-600">{description}</p>
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
            €29 <span className="ml-1 text-xs font-normal text-sage-100 line-through opacity-90">€47</span>
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
  const { visibleSections, setRef } = useSectionReveal(9);
  const [showAppButton, setShowAppButton] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const painSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = painSectionRef.current;
    if (!el) return;
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
  const faqs: FAQ[] = [0, 1, 2, 3, 4].map((index) => ({
    question: String(t(`landing.faqs.${index}.question`)),
    answer: String(t(`landing.faqs.${index}.answer`)),
  }));
  const pricingFeatures = t('landing.pricingFeatures') as string[];
  const footerBadges = t('landing.footerBadges') as string[];
  const footerLinks = t('landing.footerLinks') as string[];

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
          backgroundImage: 'url(/images/landing/HERO.webp)',
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
            <h1 className="font-display text-4xl font-bold leading-tight text-white text-shadow md:text-5xl lg:text-6xl">
              {String(t('landing.heroTitle')).split('\n').map((line, index, arr) => (
                <span key={line}>
                  {line}
                  {index < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className="mx-auto mb-10 mt-6 max-w-xl text-xl leading-relaxed text-sage-100 md:text-2xl">
              {String(t('landing.heroSubtitle'))}
            </p>

            <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                onClick={openCheckout}
                size="lg"
                className="h-14 rounded-xl bg-white px-8 text-lg font-semibold text-sage-700 shadow-elevated hover:bg-stone-50"
              >
                {String(t('landing.ctaPrimary'))}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <p className="text-sm font-medium text-sage-200">
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
          <span className="text-sm font-medium uppercase tracking-wider text-clay-600">
            {String(t('landing.painPointsLabel'))}
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-stone-800 md:text-4xl">
            {String(t('landing.painPointsTitle'))}
          </h2>
        </div>

        <div className="mb-16 grid gap-4 md:grid-cols-3">
          {painPoints.map((point, idx) => (
            <PainPointCard
              key={idx}
              icon={point.icon}
              text={String(t(`landing.painPoints.${idx}`))}
              delay={idx * 100}
              isVisible={visibleSections[1]}
            />
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div
            className={`rounded-3xl border border-sage-100 bg-gradient-to-br from-sage-50 to-stone-50 p-8 md:p-12 transition-all duration-700 ${revealClass(
              visibleSections[1]
            )}`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-600">
                <Check className="h-5 w-5 text-white" strokeWidth={3} />
              </div>
              <h3 className="font-display text-2xl font-bold text-stone-800">
                {String(t('landing.solutionTitle'))}
              </h3>
            </div>
            <p className="max-w-3xl text-lg leading-relaxed text-stone-600">
              {String(t('landing.solutionText'))}
            </p>
          </div>

          {/* lifestyle image removed */}
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
            <p className="mx-auto mt-4 max-w-2xl text-stone-600">
              {String(t('landing.rulesSubtitle'))}
            </p>
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
          <p className="mx-auto mt-4 max-w-2xl text-stone-600">
            {String(t('landing.featuresSubtitle'))}
          </p>
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
              src="/images/landing/MEALPREP.webp"
              alt={String(t('landing.mealPrepImageAlt'))}
              loading="lazy"
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

      {/* Testimonials Section */}
      <section ref={setRef(4)} data-index={4} className="bg-stone-50 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div
            className={`mb-12 text-center transition-all duration-700 ${revealClass(
              visibleSections[4]
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
                isVisible={visibleSections[4]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        ref={setRef(5)}
        data-index={5}
        className="py-20"
      >
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-3xl border border-stone-200 bg-white p-8 shadow-elevated transition-all duration-700 ${revealClass(
              visibleSections[5]
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

            <div className="mb-8 flex items-baseline justify-center gap-3">
              <span className="font-display text-3xl font-semibold text-stone-400 line-through">
                €47
              </span>
              <span className="font-display text-5xl font-bold text-stone-800">€29</span>
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

            <p className="mt-4 text-center text-sm text-stone-500">
              {String(t('landing.pricingGuarantee'))}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={setRef(6)} data-index={6} className="bg-white py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div
            className={`mb-12 text-center transition-all duration-700 ${revealClass(
              visibleSections[6]
            )}`}
          >
            <span className="text-sm font-medium uppercase tracking-wider text-sage-600">
              {String(t('landing.faqLabel'))}
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-stone-800 md:text-4xl">
              {String(t('landing.faqTitle'))}
            </h2>
          </div>

          <div
            className={`rounded-2xl border border-stone-100 bg-stone-50 p-6 md:p-8 transition-all duration-700 ${revealClass(
              visibleSections[6]
            )}`}
          >
            <Accordion type="single" collapsible defaultValue={faqs[0].question}>
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.question}
                  value={faq.question}
                  className="border-stone-200"
                >
                  <AccordionTrigger className="text-left text-sm font-medium text-stone-700 hover:no-underline py-3">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-stone-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section ref={setRef(7)} data-index={7} className="relative overflow-hidden">
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
              visibleSections[7]
            )}`}
          >
            <h2 className="mb-6 font-display text-3xl font-bold text-white text-shadow md:text-5xl">
              {String(t('landing.finalCtaTitle'))}
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-xl text-sage-200">
              {String(t('landing.finalCtaText'))}
            </p>

            <Button
              onClick={openCheckout}
              size="lg"
              className="h-14 rounded-xl bg-white px-10 text-lg font-semibold text-sage-700 shadow-elevated hover:bg-stone-50"
            >
              {String(t('landing.ctaPrimary'))}
              <ArrowRight className="ml-2 h-5 w-5" />
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
      <footer ref={setRef(8)} data-index={8} className="bg-stone-900 py-8 text-stone-400">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-col items-center justify-between gap-4 md:flex-row transition-all duration-700 ${revealClass(
              visibleSections[8]
            )}`}
          >
            <p className="text-sm">{String(t('landing.footerCopy'))}</p>
            <div className="flex items-center gap-6 text-sm">
              {footerLinks.map((label) => (
                <a key={label} href="#" className="transition-colors hover:text-white">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Mobile CTA – only after user scrolls past pain section */}
      <FloatingMobileCTA
        visible={showFloatingCTA}
        onClick={openCheckout}
        spotsLeftText={String(t('landing.spotsLeft'))}
        buttonText={String(t('landing.pricingCta'))}
      />
    </div>
  );
}
