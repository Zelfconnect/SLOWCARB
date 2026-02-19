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

// ============================================
// TYPES
// ============================================
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

// ============================================
// DATA
// ============================================
const painPoints = [
  { icon: RotateCcw, text: 'Elke maandag "opnieuw beginnen" en vrijdag weer stoppen' },
  { icon: Calculator, text: 'Calorieën tellen tot je gek wordt — en dan toch niet afvallen' },
  { icon: Clock, text: 'Geen idee wat je moet eten, elke dag opnieuw dezelfde strijd' },
] as const;

const rules: Rule[] = [
  {
    icon: WheatOff,
    title: 'Geen witte koolhydraten',
    description: 'Geen brood, pasta, rijst, aardappelen of suiker. Geen uitzonderingen tijdens de week.',
  },
  {
    icon: Egg,
    title: '30g eiwit binnen 30 min',
    description: 'Eet binnen 30 minuten na opstaan minimaal 30 gram eiwit voor een kickstart van je metabolisme.',
  },
  {
    icon: GlassWater,
    title: 'Geen vloeibare calorieën',
    description: 'Drink water, koffie en thee. Geen frisdrank, vruchtensap, melk of alcohol (behalve op cheatday).',
  },
  {
    icon: Apple,
    title: 'Geen fruit',
    description: 'Fructose remt vetverbranding. Avocado en tomaat zijn wel toegestaan in beperkte hoeveelheden.',
  },
  {
    icon: Bean,
    title: 'Peulvruchten bij elke maaltijd',
    description: 'Bonen, linzen en kikkererwten geven langdurige energie en houden je verzadigd.',
  },
];

const features: Feature[] = [
  {
    icon: ChefHat,
    title: '35+ recepten',
    description: 'Ontbijt, lunch en diner. Allemaal getest, allemaal lekker, allemaal binnen 20 minuten op tafel.',
  },
  {
    icon: Smartphone,
    title: 'Werkt als een app',
    description: 'Voeg SlowCarb toe aan je homescreen. Geen download uit de app store nodig.',
  },
  {
    icon: ShoppingCart,
    title: 'Slimme boodschappenlijst',
    description: 'Genereer automatisch je boodschappenlijst voor de week. Gegroepeerd per winkelafdeling.',
  },
  {
    icon: BookOpen,
    title: 'Wekelijkse inzichten',
    description: 'Korte uitleg waarom het protocol werkt. Geen droge theorie — praktische kennis die je gemotiveerd houdt.',
  },
  {
    icon: PartyPopper,
    title: 'Cheatday handleiding',
    description: 'Eén dag per week eet je wat je wilt. Pizza, ijs, alles mag. Dit is geen beloning — het is onderdeel van het protocol.',
  },
  {
    icon: TrendingUp,
    title: 'Voortgang bijhouden',
    description: 'Log je gewicht en zie de trend. Niks motiveert zo hard als een dalende lijn.',
  },
];

const testimonials: Testimonial[] = [
  {
    quote: 'Vijf jaar lang elk dieet geprobeerd. Dit is het eerste waar ik niet over na hoef te denken. Regels volgen, eten, klaar.',
    name: 'Mark',
    result: '-9 kg in 5 weken',
  },
  {
    quote: 'Ik eet me drie keer per dag vol en val af. De cheatday op zaterdag zorgt dat ik het de rest van de week makkelijk volhoud.',
    name: 'Lisa',
    result: '-11 kg in 8 weken',
  },
  {
    quote: 'Geen apps, geen weegschaaltjes voor eten, geen gedoe. Binnen een week had ik mijn ritme. Dat had ik niet verwacht.',
    name: 'Thomas',
    result: '-7 kg in 6 weken',
  },
];

const faqs: FAQ[] = [
  {
    question: 'Is dit veilig?',
    answer:
      'Ja, absoluut. Het slow-carb dieet is gebaseerd op volwaardige voeding zoals eieren, groenten, peulvruchten en mager vlees. Het is geen crashdieet — je eet gewoon voedzame maaltijden die je langer verzadigen.',
  },
  {
    question: 'Wat mag ik op een cheatday?',
    answer:
      'Alles! De cheatday is essentieel voor het protocol. Op zaterdag (of jouw gekozen dag) eet je wat je wilt — pizza, ijs, chips. Dit reset je stofwisseling en maakt het dieet mentaal haalbaar.',
  },
  {
    question: 'Moet ik calorieën tellen?',
    answer:
      'Nee. Dat is precies het punt van SlowCarb. Je volgt de 5 simpele regels en eet tot je verzadigd bent. Geen apps, geen weegschalen, geen gestres over cijfers.',
  },
  {
    question: 'Hoe lang heb ik toegang?',
    answer:
      'Levenslang. Je betaalt één keer en krijgt voor altijd toegang tot alle recepten, de boodschappenlijst, en toekomstige updates. Geen verborgen kosten.',
  },
  {
    question: 'Wat als het niet werkt?',
    answer:
      'We bieden een 30-dagen-geld-terug-garantie. Als je niet tevreden bent, stuur ons een mailtje en je krijgt het volledige bedrag terug. Geen vragen gesteld.',
  },
];

// ============================================
// HOOKS
// ============================================
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

// ============================================
// UTILITY FUNCTIONS
// ============================================
function revealClass(isVisible: boolean, delay = 0) {
  const baseClasses = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-6';
  const delayStyle = delay > 0 ? ` transition-delay-${delay}` : '';
  return baseClasses + delayStyle;
}

// ============================================
// SUB-COMPONENTS
// ============================================
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
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-600 font-display text-sm font-bold text-white">
          {number}
        </div>
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Icon className="h-5 w-5 text-sage-600" strokeWidth={2} />
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

function FloatingMobileCTA({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="mx-3 mb-3 flex items-center justify-between rounded-2xl bg-sage-700/95 backdrop-blur-md px-4 py-3 shadow-lg">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white">€29 <span className="text-xs font-normal text-sage-300 line-through">€47</span></span>
          <span className="text-[11px] text-sage-300">Nog 100 plekken</span>
        </div>
        <button
          onClick={onClick}
          className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-sage-700 shadow-sm active:scale-95 transition-transform"
        >
          Start nu →
        </button>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function LandingPageFinal() {
  const { visibleSections, setRef } = useSectionReveal(9);

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cream">
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
              Gebaseerd op het 4-Hour Body protocol
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight text-white text-shadow md:text-5xl lg:text-6xl">
              8-10 kg kwijt
              <br />
              in 6 weken
            </h1>
            <p className="mx-auto mb-10 mt-6 max-w-xl text-xl leading-relaxed text-sage-100 md:text-2xl">
              Geen calorie-tellen. Geen bullshit. Gewoon eten wat werkt.
            </p>

            <div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                onClick={scrollToPricing}
                size="lg"
                className="h-14 rounded-xl bg-white px-8 text-lg font-semibold text-sage-700 shadow-elevated hover:bg-stone-50"
              >
                Start nu — €29 early bird
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <p className="text-sm font-medium text-sage-200">
              Eenmalige betaling • Geen abonnement • Direct toegang
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

      {/* Problem/Solution Section */}
      <section
        ref={setRef(1)}
        data-index={1}
        className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div
          className={`mb-12 text-center transition-all duration-700 ${revealClass(
            visibleSections[1]
          )}`}
        >
          <span className="text-sm font-medium uppercase tracking-wider text-clay-600">
            Herkenbaar?
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-stone-800 md:text-4xl">
            Ken je dit?
          </h2>
        </div>

        <div className="mb-16 grid gap-4 md:grid-cols-3">
          {painPoints.map((point, idx) => (
            <PainPointCard
              key={point.text}
              icon={point.icon}
              text={point.text}
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
                Waarom dit wél werkt.
              </h3>
            </div>
            <p className="max-w-3xl text-lg leading-relaxed text-stone-600">
              Diëten falen omdat ze op willskracht leunen. SlowCarb werkt omdat het willskracht vervangt door simpele regels. Geen calorieën tellen, geen honger lijden, geen verwarring. Gewoon 5 regels volgen en eten tot je vol zit. Het resultaat: 8-10 kg in 6 weken — zonder de sportschool.
            </p>
          </div>

          <div
            className={`transition-all duration-700 ${revealClass(
              visibleSections[1]
            )}`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className='relative overflow-hidden rounded-3xl shadow-lg'>
              <img
                src="/images/landing/LIFESTYLE.webp"
                alt="Gezonde levensstijl en transformatie"
                loading="lazy"
                className='h-64 w-full object-cover saturate-[0.85] brightness-105 contrast-105 md:h-80'
              />
              <div className='absolute inset-0 bg-sage-700/10 mix-blend-overlay pointer-events-none' />
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Rules Section */}
      <section ref={setRef(2)} data-index={2} className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div
            className={`mb-12 text-center transition-all duration-700 ${revealClass(
              visibleSections[2]
            )}`}
          >
            <span className="text-sm font-medium uppercase tracking-wider text-sage-600">
              De Methode
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-stone-800 md:text-4xl">
              De 5 Regels
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-stone-600">
              Geen berekeningen. Geen supplementen. Gewoon deze regels volgen en eten tot je vol zit.
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
                alt="Gezond ontbijt met eiwitten en groenten"
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
            <div
              className={`flex h-full flex-col justify-center rounded-2xl bg-gradient-to-br from-clay-500 to-clay-600 p-6 text-white transition-all duration-700 ${revealClass(
                visibleSections[2]
              )}`}
              style={{ transitionDelay: '500ms' }}
            >
              <PartyPopper className="mb-4 h-8 w-8 opacity-80" />
              <h3 className="mb-2 font-display text-xl font-bold">+ De Cheatday</h3>
              <p className="text-sm leading-relaxed text-clay-100">
                Één dag per week eet je wat je wilt. Dit is niet optioneel — het reset je
                hormonen en houdt het volhoudbaar.
              </p>
            </div>
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
            Wat je krijgt
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-stone-800 md:text-4xl">
            Alles wat je nodig hebt
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-stone-600">
            Alles om vandaag te starten en vol te houden. Geen losse eindjes.
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
              alt="Meal prep containers met gezonde maaltijden"
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
              Resultaten
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-stone-800 md:text-4xl">
              Wat gebruikers zeggen
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
                Early Bird Aanbieding
              </span>
              <h3 className="mb-2 font-display text-2xl font-bold text-stone-800">
                SlowCarb Lifetime Access
              </h3>
              <p className="text-sm text-stone-600">Eenmalige betaling, levenslange toegang</p>
            </div>

            <div className="mb-8 flex items-baseline justify-center gap-3">
              <span className="font-display text-3xl font-semibold text-stone-400 line-through">
                €47
              </span>
              <span className="font-display text-5xl font-bold text-stone-800">€29</span>
            </div>

            <p className="mb-6 text-center text-sm text-clay-600">
              Alleen voor de eerste 100 mensen — daarna €47
            </p>

            <ul className="mb-8 space-y-4">
              {[
                '35+ slow-carb recepten',
                'Slimme boodschappenlijst',
                'Voortgang tracking',
                'Wekelijkse educatie',
                'Cheatday protocol',
                'Toekomstige updates',
                '30 dagen geld-terug garantie',
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-100">
                    <Check className="h-3 w-3 text-sage-600" strokeWidth={3} />
                  </div>
                  <span className="text-stone-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={scrollToPricing}
              size="lg"
              className="h-14 w-full rounded-xl bg-sage-600 text-lg font-semibold text-white shadow-soft hover:bg-sage-700"
            >
              Direct toegang →
            </Button>

            <p className="mt-4 text-center text-sm text-stone-500">
              30 dagen geld-terug garantie
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
              Veelgestelde vragen
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-stone-800 md:text-4xl">
              FAQ
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
                  <AccordionTrigger className="text-left text-base font-semibold text-stone-800 hover:no-underline">
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
              Klaar om te beginnen?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-xl text-sage-200">
              Over 6 weken kun je 8-10 kg lichter zijn. Zonder honger, zonder twijfel, zonder gedoe.
            </p>

            <Button
              onClick={scrollToPricing}
              size="lg"
              className="h-14 rounded-xl bg-white px-10 text-lg font-semibold text-sage-700 shadow-elevated hover:bg-stone-50"
            >
              Start nu — €29 early bird
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-sage-300">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Direct toegang</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Geen abonnement</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>30 dagen geld-terug</span>
              </div>
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
            <p className="text-sm">© 2026 SlowCarb. Alle rechten voorbehouden.</p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="transition-colors hover:text-white">
                Privacy
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Voorwaarden
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Mobile CTA */}
      <FloatingMobileCTA onClick={scrollToPricing} />
    </div>
  );
}
