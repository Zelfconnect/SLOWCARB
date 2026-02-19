import { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Ban,
  Bean,
  Clock3,
  Egg,
  Flame,
  GlassWater,
  ListChecks,
  Phone,
  Users,
} from 'lucide-react';

type Rule = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

type Feature = {
  emoji: string;
  text: string;
};

const painPoints = [
  { icon: '🔄', text: 'Elke maandag opnieuw beginnen met een dieet' },
  { icon: '📊', text: 'Calorie-apps die het erger maken dan het probleem' },
  { icon: '⏱️', text: 'Geen tijd om elke dag te bedenken wat je eet' },
] as const;

const rules: Rule[] = [
  {
    icon: Ban,
    title: 'Geen witte koolhydraten',
    description: 'Skip brood, pasta, rijst en aardappels om insulinepieken laag te houden.',
  },
  {
    icon: Egg,
    title: '30g eiwit binnen 30 min na opstaan',
    description: 'Start je dag met eiwitten voor stabiele energie en minder cravings.',
  },
  {
    icon: GlassWater,
    title: 'Geen vloeibare calorieën',
    description: 'Drink water, koffie of thee zonder suiker om vetverlies te versnellen.',
  },
  {
    icon: Flame,
    title: 'Geen fruit (avocado & tomaat OK)',
    description: 'Beperk fructose; avocado en tomaat passen wel binnen het protocol.',
  },
  {
    icon: Bean,
    title: 'Peulvruchten bij elke maaltijd',
    description: 'Bonen en linzen geven vezels, eiwit en langdurige verzadiging.',
  },
];

const features: Feature[] = [
  { emoji: '🍳', text: '35+ recepten (ontbijt, lunch, diner)' },
  { emoji: '📱', text: 'PWA — werkt als app op je telefoon' },
  { emoji: '🛒', text: 'Slimme boodschappenlijst' },
  { emoji: '📚', text: 'Weekelijkse educatie over de wetenschap' },
  { emoji: '🎉', text: 'Cheatday protocol' },
  { emoji: '📈', text: 'Gewicht & voortgang tracking' },
];

const testimonials = [
  {
    quote:
      'Placeholder testimonial: dit gaf me eindelijk structuur zonder dat ik mijn hele leven hoefde om te gooien.',
    name: 'Mark',
    result: '-9 kg in 5 weken',
  },
  {
    quote:
      'Placeholder testimonial: de recepten en lijstjes besparen me elke week tijd en mentale ruimte.',
    name: 'Sanne',
    result: '-6 kg in 6 weken',
  },
  {
    quote:
      'Placeholder testimonial: simpel protocol, duidelijke regels, en ik kon het direct volhouden.',
    name: 'Rachid',
    result: '-10 kg in 6 weken',
  },
] as const;

const faqs = [
  {
    question: 'Is dit veilig?',
    answer:
      'Voor gezonde volwassenen is het protocol doorgaans goed vol te houden. Bij medische aandoeningen of medicatie: stem het af met je arts.',
  },
  {
    question: 'Wat mag ik op een cheatday?',
    answer:
      'Een cheatday is 1 dag per week waarop je vrij eet. De dag erna pak je direct weer het standaard protocol op.',
  },
  {
    question: 'Moet ik calorieën tellen? (Nee!)',
    answer: 'Nee! Je volgt de regels en maaltijdstructuur, zonder calorieën te tracken.',
  },
  {
    question: 'Hoe lang heb ik toegang?',
    answer: 'Lifetime toegang. Eenmalig betalen, daarna onbeperkt gebruiken.',
  },
  {
    question: 'Wat als het niet werkt?',
    answer:
      'Je krijgt 30 dagen geld-terug garantie. Geen risico, wel een duidelijke aanpak.',
  },
] as const;

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

function revealClass(isVisible: boolean) {
  return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';
}

export default function LandingPage() {
  const { visibleSections, setRef } = useSectionReveal(8);

  return (
    <main className="bg-cream text-stone-800 font-sans">
      <section
        ref={setRef(0)}
        data-index={0}
        className={`bg-gradient-to-b from-sage-600 to-sage-700 px-5 py-16 md:py-24 transition-all duration-700 ${revealClass(
          visibleSections[0]
        )}`}
      >
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <h1 className="text-shadow font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
              8-10 kg kwijt in 6 weken
            </h1>
            <p className="mt-4 max-w-xl text-base text-sage-100 md:text-lg">
              Geen calorie-tellen. Geen bullshit. Gewoon eten wat werkt.
            </p>
            <a
              href="#pricing"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-sage-700 shadow-md transition hover:bg-sage-50"
            >
              Start nu — €49 lifetime
            </a>
            <p className="mt-3 text-sm text-sage-100">
              Eenmalige betaling • Geen abonnement • Direct toegang
            </p>
          </div>
        </div>
      </section>

      <section
        ref={setRef(1)}
        data-index={1}
        className={`px-5 py-14 md:py-20 transition-all duration-700 ${revealClass(
          visibleSections[1]
        )}`}
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-bold text-stone-900">Herkenbaar?</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {painPoints.map((point) => (
              <article
                key={point.text}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card"
              >
                <p className="text-2xl" aria-hidden="true">
                  {point.icon}
                </p>
                <p className="mt-3 text-base text-stone-700">{point.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-3xl border border-sage-200 bg-sage-50 p-6">
            <h3 className="font-display text-2xl font-bold text-sage-800">SlowCarb is anders.</h3>
            <p className="mt-2 text-base text-stone-600">
              Je volgt 5 simpele regels die besluitmoeheid wegnemen. Geen ingewikkelde schema&apos;s,
              wel duidelijke kaders die je dagelijks kunt volhouden.
            </p>
          </div>
        </div>
      </section>

      <section
        ref={setRef(2)}
        data-index={2}
        className={`px-5 py-14 md:py-20 transition-all duration-700 ${revealClass(
          visibleSections[2]
        )}`}
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-bold text-stone-900">De 5 regels</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {rules.map((rule, idx) => {
              const Icon = rule.icon;
              return (
                <article
                  key={rule.title}
                  className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-sage-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-sage-700">
                        Regel {idx + 1}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-semibold text-stone-900">
                        {rule.title}
                      </h3>
                      <p className="mt-2 text-base text-stone-600">{rule.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        ref={setRef(3)}
        data-index={3}
        className={`px-5 py-14 md:py-20 transition-all duration-700 ${revealClass(
          visibleSections[3]
        )}`}
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-bold text-stone-900">Wat je krijgt</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.text}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card"
              >
                <p className="text-2xl" aria-hidden="true">
                  {feature.emoji}
                </p>
                <p className="mt-3 text-base text-stone-700">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={setRef(4)}
        data-index={4}
        className={`px-5 py-14 md:py-20 transition-all duration-700 ${revealClass(
          visibleSections[4]
        )}`}
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-bold text-stone-900">Wat gebruikers zeggen</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-card"
              >
                <p className="text-base italic text-stone-700">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-4 border-t border-stone-100 pt-4">
                  <p className="font-semibold text-stone-900">{testimonial.name}</p>
                  <p className="text-sm text-sage-700">{testimonial.result}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        ref={setRef(5)}
        data-index={5}
        className={`scroll-mt-10 px-5 py-14 md:py-20 transition-all duration-700 ${revealClass(
          visibleSections[5]
        )}`}
      >
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-xl rounded-3xl border border-sage-200 bg-white p-6 shadow-elevated md:p-8">
            <h2 className="font-display text-3xl font-bold text-stone-900">SlowCarb Lifetime Access</h2>
            <div className="mt-4 flex items-end gap-3">
              <p className="text-4xl font-bold text-stone-900">€49</p>
              <p className="pb-1 text-lg text-stone-400 line-through">€79</p>
            </div>

            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3 text-stone-700">
                <ListChecks className="h-5 w-5 text-sage-600" />
                Alle huidige en toekomstige updates
              </li>
              <li className="flex items-center gap-3 text-stone-700">
                <ListChecks className="h-5 w-5 text-sage-600" />
                Volledige receptendatabase en planning
              </li>
              <li className="flex items-center gap-3 text-stone-700">
                <ListChecks className="h-5 w-5 text-sage-600" />
                Slimme boodschappenlijst en tracking
              </li>
              <li className="flex items-center gap-3 text-stone-700">
                <ListChecks className="h-5 w-5 text-sage-600" />
                Cheatday protocol + educatie modules
              </li>
            </ul>

            <a
              href="#pricing"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-sage-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-sage-800"
            >
              Direct toegang →
            </a>
            <p className="mt-3 text-center text-sm text-stone-500">30 dagen geld-terug garantie</p>
          </div>
        </div>
      </section>

      <section
        ref={setRef(6)}
        data-index={6}
        className={`px-5 py-14 md:py-20 transition-all duration-700 ${revealClass(
          visibleSections[6]
        )}`}
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-stone-900">FAQ</h2>
          <div className="mt-6 rounded-2xl border border-stone-200 bg-white px-5 py-2 shadow-card">
            <Accordion type="single" collapsible>
              {faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="border-stone-200">
                  <AccordionTrigger className="text-base font-semibold text-stone-800 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-stone-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section
        ref={setRef(7)}
        data-index={7}
        className={`bg-sage-800 px-5 py-16 md:py-20 transition-all duration-700 ${revealClass(
          visibleSections[7]
        )}`}
      >
        <div className="mx-auto max-w-5xl rounded-3xl border border-sage-600 bg-sage-700/40 p-6 md:p-8">
          <h2 className="font-display text-3xl font-bold text-white">Klaar om te beginnen?</h2>
          <a
            href="#pricing"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-sage-700 transition hover:bg-sage-50"
          >
            Start nu — €49 lifetime
          </a>

          <div className="mt-6 grid gap-3 text-sm text-sage-100 sm:grid-cols-3">
            <p className="flex items-center gap-2">
              <Users className="h-4 w-4" /> 500+ recepten bekeken
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> Direct toegang
            </p>
            <p className="flex items-center gap-2">
              <Clock3 className="h-4 w-4" /> Geen abonnement
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
