import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { BookOpen, ChevronDown, ChevronLeft, ChevronRight, Lock, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ShowcaseStep = {
  step: string;
  title: string;
  body: string;
  image: string;
  alt: string;
};

type RuleItem = {
  kicker: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

const NAV_LINKS = [
  { href: '#method', label: 'De methode' },
  { href: '#premium-app-showcase', label: 'Hoe werkt de app' },
  { href: '#reviews', label: 'Bewijs' },
  { href: '#pricing', label: 'Prijs' },
  { href: '#faq', label: 'FAQ' },
] as const;

const SOLUTION_ITEMS = [
  {
    title: '5 regels. Meer niet.',
    body: 'Geen calorieën tellen. Geen punten. Geen app die je corrigeert omdat je net iets te veel at. Vijf regels die je na dag één begrijpt.',
  },
  {
    title: 'Doordeweeks op automatische piloot.',
    body: 'Je weet wat je eet en waarom. Minder keuzes, minder twijfel, meer rust. Zo houd je dit veel langer vol.',
  },
  {
    title: 'Eén cheatday. Zonder schuldgevoel.',
    body: 'Eén dag per week mag alles. Echt alles. Niet als zwaktebod, maar als onderdeel van het systeem.',
  },
] as const;

const SHOWCASE_STEPS: ShowcaseStep[] = [
  {
    step: 'Stap 1',
    title: 'Open je dashboard',
    body: "Zie in een oogopslag of je de regels volgt. Geen calorieen. Geen macro's. Gewoon duidelijk per maaltijd.",
    image: '/images/landing/HERO.webp',
    alt: 'Dashboard in de SlowCarb app',
  },
  {
    step: 'Stap 2',
    title: 'Kies een recept',
    body: '50+ recepten die aan alle regels voldoen. Filter op bereidingstijd, airfryer, of ingrediënt.',
    image: '/images/landing/MEALPREP.webp',
    alt: 'Receptenoverzicht in de SlowCarb app',
  },
  {
    step: 'Stap 3',
    title: 'Leer waarom het werkt',
    body: 'Elke dag een science card: wat er in je lichaam gebeurt en waarom. Kennis = volhouden.',
    image: '/images/landing/HEROBREAKFAST.webp',
    alt: 'Leren scherm in de SlowCarb app',
  },
  {
    step: 'Stap 4',
    title: 'Hou AmmoCheck bij',
    body: 'Een simpele checklist voor wat in je koelkast, voorraadkast en lades moet liggen. Minder nadenken, makkelijker volhouden.',
    image: '/images/landing/LIFESTYLE.webp',
    alt: 'AmmoCheck checklist in de SlowCarb app',
  },
];

const RULES: RuleItem[] = [
  {
    kicker: 'Regel 1 · De basis van vetverbranding',
    title: 'Vermijd "witte" koolhydraten',
    body: 'Geen brood, pasta, rijst, aardappelen of gebak. Klinkt heftig, maar als je ontdekt wat er wél mag, mis je het niet.',
    image: '/images/landing/HEROBREAKFAST.webp',
    imageAlt: 'SlowCarb maaltijd zonder witte koolhydraten',
  },
  {
    kicker: 'Regel 2 · Herhaling verslaat variatie',
    title: 'Eet steeds dezelfde maaltijden',
    body: 'Kies 3-4 maaltijden die je lekker vindt en eet ze op repeat. Het neemt beslissingsstress weg.',
    image: '/images/landing/MEALPREP.webp',
    imageAlt: 'Meal prep voor herhaalbare maaltijden',
  },
  {
    kicker: 'Regel 3 · Vloeibare suiker is onzichtbaar',
    title: 'Drink geen calorieën',
    body: 'Water, koffie (zwart), thee. Geen sap, geen frisdrank, geen havermelk-latte. Eén glas rode wijn per dag mag.',
    image: '/images/landing/HERO.webp',
    imageAlt: 'Drankkeuzes zonder suiker',
  },
  {
    kicker: 'Regel 4 · Fructose is suiker in vermomming',
    title: 'Eet geen fruit',
    body: 'Ja, ook bananen en druiven. Avocado en tomaat mogen wél, die bevatten nauwelijks fructose.',
    image: '/images/landing/LIFESTYLE.webp',
    imageAlt: 'SlowCarb ingrediënten zonder fruit',
  },
  {
    kicker: 'Regel 5 · De dag die het dieet laat werken',
    title: 'Eén cheatday per week',
    body: 'Elke week één dag alles eten. Dit is een metabole reset en helpt het systeem vol te houden.',
    image: '/images/landing/CHEATDAY.webp',
    imageAlt: 'Cheatday maaltijd',
  },
];

const COMPARE_ROWS = [
  { name: 'Diëtist', note: 'Meestal meerdere sessies nodig', price: '€80-120', period: 'per sessie' },
  { name: 'Noom', note: 'Doorlopend abonnement', price: '€199', period: 'per jaar' },
  { name: 'WeightWatchers', note: 'Maandbedrag dat blijft doorlopen', price: '€23 p/m', period: '€276 per jaar' },
  { name: 'Personal trainer', note: 'Vaak exclusief voedingsbegeleiding', price: '€50-80', period: 'per sessie' },
] as const;

const OFFER_ITEMS = [
  {
    title: '84-dagen protocol',
    body: 'Elke dag een korte uitleg: wat er in je lichaam gebeurt en waarom het protocol werkt.',
    meta: '84 dagen · dagelijks',
  },
  {
    title: 'AmmoCheck',
    body: 'De checklist voor wat in je koelkast, voorraadkast en lades moet liggen. Minder keuzes in huis.',
    meta: 'Minder nadenken',
  },
  {
    title: '50+ recepten',
    body: 'Maaltijden die aan alle 5 regels voldoen, met boodschappenlijst en snelle filters.',
    meta: 'Klaar in 15 minuten',
  },
  {
    title: 'Startweek',
    body: 'Concrete maaltijden voor week 1, zodat je niet hoeft te gokken waar je begint.',
    meta: 'Nul nadenken in week 1',
  },
  {
    title: 'Altijd toegang',
    body: 'Nieuwe recepten en verbeteringen, zonder abonnement of maandelijkse verrassing.',
    meta: 'Eenmalig betalen',
  },
] as const;

const FAQS: FaqItem[] = [
  {
    question: 'Is dit een abonnement?',
    answer: 'Nee. Je betaalt één keer €47 en hebt daarna voor altijd toegang. Geen maandelijkse kosten, geen verrassingen.',
  },
  {
    question: 'Moet ik naar de sportschool?',
    answer: 'Nee. SlowCarb is puur voeding. Bewegen helpt altijd, maar het protocol werkt zonder gym.',
  },
  {
    question: 'Werkt dit ook met ADHD of een druk leven?',
    answer: 'Juist dan. De 5 regels zijn zo simpel dat ze geen cognitieve ruimte kosten. De app doet het denkwerk.',
  },
  {
    question: 'Wat als het niet werkt voor mij?',
    answer: 'Dan krijg je je geld terug. 30 dagen, geen vragen.',
  },
  {
    question: 'Is dit gewoon een kookboek-app?',
    answer: 'Nee. Het is een complete tool: AmmoCheck checklist, dagtracker, 84-dagen educatie, recepten en boodschappenlijst.',
  },
  {
    question: 'Hoe snel zie ik resultaat?',
    answer: 'De meeste mensen verliezen 1-2 kg in de eerste week. In 6 weken is 8-10 kg realistisch.',
  },
];

const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/5kQ28t0JQ9Geaht9Kb5Rm00';
const SHOWCASE_AUTOPLAY_MS = 4000;

function smoothScrollToHash(event: MouseEvent<HTMLAnchorElement>, closeMenu?: () => void) {
  const href = event.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('#')) return;

  const target = document.querySelector(href);
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  closeMenu?.();
}

export default function LandingPageFinal() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeShowcaseStep, setActiveShowcaseStep] = useState(0);
  const [compareSplit, setCompareSplit] = useState(75);
  const [openFaqIndexes, setOpenFaqIndexes] = useState<number[]>([]);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const offerHeadlineRef = useRef<HTMLDivElement | null>(null);

  const activeStep = SHOWCASE_STEPS[activeShowcaseStep];
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      return;
    }

    const node = offerHeadlineRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const hasScrolledPast = entry.boundingClientRect.top < 0 && !entry.isIntersecting;
        setShowStickyCta(hasScrolledPast);
      },
      { threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveShowcaseStep((prev) => (prev + 1) % SHOWCASE_STEPS.length);
    }, SHOWCASE_AUTOPLAY_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const compareClipStyle = useMemo(
    () => ({ clipPath: `inset(0 ${100 - compareSplit}% 0 0)` }),
    [compareSplit]
  );

  const goPrevStep = () => {
    setActiveShowcaseStep((prev) => (prev - 1 + SHOWCASE_STEPS.length) % SHOWCASE_STEPS.length);
  };

  const goNextStep = () => {
    setActiveShowcaseStep((prev) => (prev + 1) % SHOWCASE_STEPS.length);
  };

  const handleShowcaseTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleShowcaseTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      if (deltaX < 0) {
        goNextStep();
      } else {
        goPrevStep();
      }
    }
  };

  const openStripeCheckout = () => {
    window.open(STRIPE_CHECKOUT_URL, '_blank');
  };

  return (
    <div className="min-h-screen bg-cream text-stone-800">
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 border-t border-sage-200 bg-cream/95 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md transition-transform duration-300 md:hidden ${
          showStickyCta ? 'translate-y-0' : 'translate-y-full'
        }`}
        data-testid="sticky-cta"
      >
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 line-through">€79</span>
            <span className="text-2xl font-extrabold leading-none text-stone-900">Nu €47</span>
          </div>
          <Button data-testid="stripe-cta" onClick={openStripeCheckout} className="rounded-full bg-sage-700 px-6 text-xs font-bold uppercase tracking-wider hover:bg-sage-800">
            Begin voor €47
          </Button>
        </div>
      </div>

      <section className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden bg-stone-900 text-stone-100">
        <div className="absolute inset-0">
          <img src="/images/landing/HERO.webp" alt="SlowCarb maaltijd" className="h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/25 to-stone-900/75" />
        </div>

        <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-6 md:px-10 md:py-8">
          <div className="text-lg font-bold tracking-tight md:text-2xl">SlowCarb</div>
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Menu openen"
            className="text-stone-100 md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-8 w-8" />
          </button>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => smoothScrollToHash(event)}
                className="text-sm font-medium text-stone-200 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </header>

        <div
          id="mobile-menu"
          className={`fixed inset-0 z-[60] md:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
          aria-hidden={!isMobileMenuOpen}
        >
          <button
            type="button"
            aria-label="Menu sluiten"
            className={`absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav
            className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-stone-950/95 px-8 pb-8 pt-24 transition-transform duration-300 ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <button
              type="button"
              className="absolute right-5 top-5 p-2 text-stone-100"
              aria-label="Menu sluiten"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-8 w-8" />
            </button>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={`mobile-${link.href}`}
                  href={link.href}
                  onClick={(event) => smoothScrollToHash(event, () => setIsMobileMenuOpen(false))}
                  className="border-b border-white/10 py-3 text-2xl font-bold text-stone-100"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <Button
              data-testid="stripe-cta"
              className="mt-auto h-12 rounded-full bg-sage-700 text-sm font-bold uppercase tracking-wider hover:bg-sage-800"
              onClick={openStripeCheckout}
            >
              Begin met de 5 regels
            </Button>
          </nav>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center sm:px-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.1em] text-stone-200 md:mb-12">SlowCarb Methode</p>
          <h1 className="mb-4 font-display text-6xl font-bold uppercase leading-[0.85] tracking-[-0.03em] text-white drop-shadow-2xl sm:text-7xl md:mb-12 md:text-8xl lg:text-9xl">
            8 tot 10
            <br />
            kilo in
            <br />
            6 weken.
          </h1>
          <p className="max-w-md text-lg italic text-stone-100 md:mb-16 md:text-2xl">
            De methode die écht werkt.
            <br />
            Zonder hongergevoel.
          </p>
        </div>

        <div className="relative z-10 px-5 pb-10 text-center sm:px-6 md:pb-8">
          <Button
            data-testid="stripe-cta"
            onClick={openStripeCheckout}
            className="h-14 rounded-full bg-sage-700 px-12 text-sm font-bold uppercase tracking-wider hover:bg-sage-800 md:h-16 md:px-16 md:text-base"
          >
            Begin met de 5 regels
          </Button>
          <p className="mt-4 hidden text-xs text-white/50 md:block">
            *Resultaten variëren per persoon. Gebaseerd op The 4-Hour Body.
          </p>
        </div>
      </section>

      <section className="bg-cream py-20 sm:py-28 md:py-40">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-6 md:px-12">
          <h2 className="mb-12 font-display text-5xl font-semibold leading-[1.1] tracking-tight text-stone-900 md:text-7xl">Herkenbaar?</h2>
          <div className="max-w-3xl space-y-7 text-lg leading-relaxed text-stone-700 md:space-y-8 md:text-2xl">
            <p>Je hebt dit jaar al drie diëten geprobeerd. Elke keer liep je weer vast op tellen, wegen en nadenken.</p>
            <p>Je wilt geen leven op sla of shakes. Je wilt gewoon weten wat werkt en wat je zonder gedoe op je bord legt.</p>
            <p className="mt-8 border-t border-stone-300 pt-8 text-stone-900">SlowCarb is geen dieet. Het is een simpel systeem met 5 regels.</p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-sage-900 py-24 text-stone-100 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.18),_transparent_40%)]" />
        <div className="relative mx-auto max-w-4xl px-6">
          <h2 className="mx-auto mb-10 max-w-[12ch] text-left font-display text-5xl font-medium leading-[0.98] tracking-tight md:text-center md:text-7xl">
            Wat als afvallen simpeler was?
          </h2>
          <p className="mx-auto mb-16 max-w-[35rem] text-left text-lg leading-relaxed text-stone-200 md:mb-20 md:text-center md:text-2xl">
            Afvallen mislukt zelden op motivatie. Het loopt vast op te veel regels, te veel keuzes en te veel denkwerk. SlowCarb haalt dat eruit.
          </p>
          <div className="mx-auto max-w-[28rem] space-y-12 text-left">
            {SOLUTION_ITEMS.map((item) => (
              <div key={item.title}>
                <h3 className="mb-4 text-base font-bold uppercase tracking-widest text-stone-100">{item.title}</h3>
                <p className="text-base leading-relaxed text-stone-200">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="premium-app-showcase"
        className="relative overflow-hidden bg-cream py-10 md:py-20"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={handleShowcaseTouchStart}
        onTouchEnd={handleShowcaseTouchEnd}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[14%] h-80 w-80 -translate-x-1/2 rounded-full bg-sage-200/50 blur-[90px]" />
          <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-white/55 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-stone-800">De app in 4 stappen</p>
              <h2 className="max-w-lg font-display text-5xl font-medium leading-[0.95] tracking-tight text-stone-900 md:text-6xl">Zo werkt de app</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-700">Van "ik weet niet wat ik mag eten" naar maaltijd op tafel in 15 minuten.</p>
              <div className="mt-8 hidden gap-3 lg:grid">
                {SHOWCASE_STEPS.map((step, index) => (
                  <button
                    key={step.title}
                    type="button"
                    className={`rounded-2xl border p-5 text-left transition ${
                      activeShowcaseStep === index
                        ? 'border-sage-300 bg-sage-50 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-sage-200'
                    }`}
                    onClick={() => setActiveShowcaseStep(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-sm font-bold tracking-widest text-stone-700">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-stone-700">{step.step}</p>
                        <h3 className="mt-2 text-2xl font-bold tracking-tight text-stone-900">{step.title}</h3>
                        <p className="mt-2 text-base text-stone-700">{step.body}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
                <img src={activeStep.image} alt={activeStep.alt} className="h-[420px] w-full rounded-2xl object-cover" loading="lazy" decoding="async" />
              </div>

              <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 lg:hidden" aria-live="polite">
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex rounded-full bg-sage-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-stone-900">{activeStep.step}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-500">{String(activeShowcaseStep + 1).padStart(2, '0')}/04</span>
                </div>
                <h3 className="mt-4 text-3xl font-bold leading-none tracking-tight text-stone-900">{activeStep.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-stone-700">{activeStep.body}</p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {SHOWCASE_STEPS.map((step, index) => (
                    <button
                      key={`dot-${step.title}`}
                      type="button"
                      className={`h-2.5 w-2.5 rounded-full ${activeShowcaseStep === index ? 'bg-sage-700' : 'bg-stone-300'}`}
                      aria-label={`Ga naar ${step.step}`}
                      onClick={() => setActiveShowcaseStep(index)}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" size="icon" variant="outline" className="h-9 w-9 rounded-full" onClick={goPrevStep} aria-label="Vorige stap">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="outline" className="h-9 w-9 rounded-full" onClick={goNextStep} aria-label="Volgende stap">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="method" className="overflow-hidden bg-cream py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-20 text-center">
            <h2 className="mb-6 font-display text-4xl font-bold tracking-tight text-stone-900 md:text-5xl">De 5 regels. Dat is alles.</h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-stone-700 md:text-2xl">Geen schema's, geen fases, geen uitzonderingen doordeweeks. Vijf regels volgen, één dag per week vrij.</p>
          </div>

          {RULES.map((rule, index) => (
            <article
              key={rule.title}
              className={`mb-20 grid items-center gap-8 md:mb-28 md:gap-16 ${index % 2 === 0 ? 'md:grid-cols-2' : 'md:grid-cols-2'}`}
            >
              <div className={index % 2 === 0 ? 'md:order-2' : 'md:order-1'}>
                <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-stone-700">{rule.kicker}</span>
                <h3 className="mb-6 font-display text-4xl font-bold leading-tight text-stone-900 md:text-5xl">{rule.title}</h3>
                <p className="text-lg leading-relaxed text-stone-700">{rule.body}</p>
              </div>
              <div className={index % 2 === 0 ? 'md:order-1' : 'md:order-2'}>
                <img src={rule.image} alt={rule.imageAlt} className="h-[300px] w-full rounded-3xl object-cover shadow-lg" loading="lazy" decoding="async" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="founder" className="relative overflow-hidden bg-cream py-24 md:py-32">
        <div id="reviews" className="pointer-events-none absolute -top-24 h-px w-full" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[-4rem] top-16 h-64 w-64 rounded-full bg-sage-100/80 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-[-5rem] h-72 w-72 rounded-full bg-sage-100/70 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] md:gap-16">
            <div className="order-2 md:order-1">
              <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
                <img src="/images/landing/LIFESTYLE.webp" alt="Jesper, oprichter van SlowCarb" className="h-[480px] w-full rounded-2xl object-cover" loading="lazy" decoding="async" />
              </div>
              <div className="mt-5 flex justify-center md:justify-start">
                <span className="inline-flex rounded-full border border-sage-200 bg-sage-50 px-4 py-2 text-sm font-bold text-sage-800">8 kg in 4 weken</span>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="inline-flex items-center rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-800">Het verhaal achter SlowCarb</span>
              <h2 className="mt-6 font-display text-4xl font-bold tracking-tight text-stone-900 md:text-5xl">Waarom een militair een dieet-app bouwde.</h2>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-stone-700">
                <p>111 kilo. Vader van een drieling. ADHD. Elk dieet vroeg om iets wat mijn brein niet kan: eindeloos bijhouden.</p>
                <p>Vijf regels. Geen calorieën tellen. Eén cheatday per week. Na vier weken: 8 kilo lichter. Zonder honger, zonder sportschool, zonder schuldgevoel.</p>
              </div>
              <div className="mt-8 max-w-sm rounded-2xl border border-stone-200 bg-white p-5">
                <p className="text-2xl font-bold text-stone-900">Jesper</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-stone-500">Oprichter SlowCarb · Ex-militair · Vader van drie</p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid items-start gap-6 md:mt-20 md:grid-cols-[minmax(0,1.12fr)_minmax(18rem,0.88fr)] md:gap-8">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-sage-700">Het bewijs</p>
              <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-stone-700">Voordat het een app werd, werkte het eerst bij mij.</p>

              <div className="mt-8">
                <figure className="relative overflow-hidden rounded-2xl border border-stone-200" role="img" aria-label="Vergelijking van Jesper voor en na">
                  <img src="/images/landing/LIFESTYLE.webp" alt="Jesper na zijn gewichtsverlies" className="h-[360px] w-full object-cover" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 overflow-hidden" style={compareClipStyle} aria-hidden="true">
                    <img src="/images/landing/HERO.webp" alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                  </div>
                  <figcaption className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">Voor</figcaption>
                  <figcaption className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">Na</figcaption>
                </figure>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={compareSplit}
                  onChange={(event) => setCompareSplit(Number(event.target.value))}
                  className="mt-4 w-full"
                  aria-label="Schuif om Jesper voor en na te vergelijken"
                />
              </div>

              <div className="mt-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <span className="inline-flex self-start rounded-full bg-sage-50 px-3 py-1 text-sm font-bold text-sage-800">8 kg in 4 weken</span>
                <p className="text-sm font-medium text-stone-700">Zonder calorieën tellen. Zonder sportschool. Zonder schuldgevoel.</p>
              </div>
            </div>

            <aside className="flex h-full flex-col rounded-3xl border border-stone-200 bg-white p-6 md:p-7">
              <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-800">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-sage-700">De methode</p>
              <p className="flex-grow text-lg leading-relaxed text-stone-700">Het Slow-Carb protocol is ontwikkeld door Tim Ferriss en beschreven in <em>The 4-Hour Body</em>, een #1 New York Times bestseller.</p>
              <div className="mt-6 flex items-center gap-4 border-t border-stone-200 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white">T</div>
                <div>
                  <p className="font-bold text-stone-900">Tim Ferriss</p>
                  <p className="text-sm text-stone-500">Auteur, The 4-Hour Body</p>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-8 text-center md:mt-10">
            <Button data-testid="stripe-cta" variant="link" className="text-base font-semibold text-sage-800 hover:text-sage-900" onClick={openStripeCheckout}>
              Word een van de eerste 200 gebruikers
            </Button>
          </div>
        </div>
      </section>

      <section id="pricing" className="relative overflow-hidden bg-cream pb-24">
        <div className="border-b border-sage-100/70 bg-gradient-to-b from-sage-50/80 to-transparent py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full border border-sage-200 bg-sage-50/90 px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-800">Eenmalig. Geen abonnement.</span>
              <h2 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-stone-900 md:text-6xl">Alles wat je nodig hebt om de 5 regels vol te houden.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone-700">Rustige, duidelijke tools om snel te starten. Voor minder dan wat de meeste mensen kwijt zijn aan een paar sessies of een jaarabonnement.</p>
            </div>
          </div>
        </div>

        <div className="py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
              <div className="px-5 pb-4 pt-6 md:px-8 md:pb-5 md:pt-8">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-800">Wat mensen normaal betalen</p>
                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <h3 className="text-3xl font-bold leading-tight tracking-tight text-stone-900 md:text-4xl">Wat kost afvallen normaal?</h3>
                  <p className="max-w-md text-sm font-medium text-stone-700">SlowCarb Protocol houdt het simpel: één betaling, altijd toegang, geen maandelijkse verrassing.</p>
                </div>
              </div>

              {COMPARE_ROWS.map((row) => (
                <div key={row.name} className="flex flex-col gap-2 border-t border-stone-200 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
                  <div>
                    <p className="text-lg font-medium text-stone-900">{row.name}</p>
                    <p className="mt-1 text-sm text-stone-500">{row.note}</p>
                  </div>
                  <div className="text-right text-2xl font-bold tracking-tight text-stone-900">
                    {row.price}
                    <span className="ml-2 block text-sm font-medium text-stone-500 md:inline">{row.period}</span>
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-4 border-t border-sage-200 bg-sage-50/70 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-sage-700">SlowCarb Protocol</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-stone-900">Eén betaling. Daarna gewoon gebruiken.</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Vandaag</p>
                  <p className="mt-2 text-5xl font-bold tracking-tight text-stone-900">€47</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div ref={offerHeadlineRef} className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]" id="offer-headline">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sage-700">Wat je krijgt</p>
              <h3 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-stone-900 md:text-4xl">Alles wat je nodig hebt om te starten.</h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-700">AmmoCheck, recepten, 84 dagen uitleg en een rustige startweek. Zodat je niet opnieuw hoeft uit te zoeken waar je begint.</p>

              <div className="mt-6 space-y-3 md:mt-8">
                {OFFER_ITEMS.map((item, index) => (
                  <article key={item.title} className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-stone-200 bg-white p-4 md:p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-xs font-bold tracking-widest text-stone-700">{String(index + 1).padStart(2, '0')}</div>
                    <div>
                      <h4 className="text-xl font-bold tracking-tight text-stone-900">{item.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-stone-700">{item.body}</p>
                      <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-widest text-sage-700">{item.meta}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="h-fit rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-sage-700">Altijd toegang</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-stone-500">Alles inbegrepen</p>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-6xl font-bold leading-none tracking-tight text-stone-900">€47</span>
                <span className="pb-3 text-sm text-stone-500">eenmalig</span>
              </div>
              <p className="mt-4 text-base leading-relaxed text-stone-700">Voor de eerste 200 klanten. Daarna stijgt de prijs naar €79.</p>
              <ul className="mt-5 space-y-2 text-sm text-stone-700">
                <li>Geen abonnement of automatische verlenging</li>
                <li>30 dagen proberen. Past het niet? Geld terug.</li>
                <li>Veilig betalen via iDEAL en creditcard</li>
              </ul>
              <Button data-testid="stripe-cta" onClick={openStripeCheckout} className="mt-6 h-14 w-full rounded-full bg-sage-700 text-sm font-bold uppercase tracking-wider hover:bg-sage-800">
                Start het protocol · €47
              </Button>
              <p className="mt-4 text-sm text-stone-700">Je krijgt direct toegang tot het volledige protocol. Past het niet, dan krijg je binnen 30 dagen je geld terug.</p>
            </aside>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-16 text-center font-display text-4xl font-bold tracking-tight text-stone-900 md:text-5xl">Veelgestelde Vragen</h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndexes.includes(index);
              return (
                <div key={faq.question} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left md:px-8 md:py-6"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenFaqIndexes((prev) =>
                        prev.includes(index) ? prev.filter((faqIndex) => faqIndex !== index) : [...prev, index]
                      )
                    }
                  >
                    <span className="text-lg font-bold text-stone-900">{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-sage-700 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 md:px-8">
                      <p className="text-base leading-relaxed text-stone-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-stone-900 py-24 text-center text-stone-100 md:py-40">
        <div className="absolute inset-0 opacity-35">
          <img src="/images/landing/HERO.webp" alt="Premium SlowCarb food" className="h-full w-full object-cover" loading="lazy" decoding="async" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/90 via-stone-900/70 to-stone-900/95" />
        <div className="relative mx-auto max-w-3xl px-6">
          <h2 className="mb-10 font-display text-5xl font-bold uppercase leading-[1.05] tracking-tighter text-white md:text-7xl">5 regels. 6 weken. €47.</h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-stone-200 md:text-2xl">Dit is alles wat je nodig hebt om te beginnen. De regels ken je al. De app doet de rest.</p>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-300">€47 · eenmalig · altijd toegang</p>
          <Button data-testid="stripe-cta" onClick={openStripeCheckout} className="h-16 w-full max-w-[380px] rounded-full bg-sage-700 text-lg font-bold uppercase tracking-wider hover:bg-sage-800 md:text-xl">
            Begin met de 5 regels
          </Button>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 text-xs font-medium text-stone-300 md:flex-row md:gap-4 md:text-sm">
            <span>Eenmalig betalen. Daarna gewoon gebruiken.</span>
            <span className="hidden md:inline">•</span>
            <span className="inline-flex items-center gap-1">Veilig betalen via iDEAL <Lock className="h-3 w-3" /></span>
          </div>
        </div>
      </section>

      <footer className="bg-stone-900 py-16 text-center text-stone-300">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-8 text-2xl font-bold tracking-tight text-stone-100">SlowCarb</div>
          <div className="mb-8 flex flex-wrap justify-center gap-8 text-sm">
            <a href="/terms-of-service" className="transition-colors hover:text-white">Algemene Voorwaarden</a>
            <a href="/privacy-policy" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="mailto:hello@slowcarb.nl" className="transition-colors hover:text-white">Contact</a>
          </div>
          <p className="text-sm">© 2026 SlowCarb Protocol. Alle rechten voorbehouden.</p>
          <p className="mx-auto mt-4 max-w-2xl text-xs text-stone-400">SlowCarb Protocol is geen medisch advies. Raadpleeg een arts voordat je je eetpatroon wijzigt.</p>
        </div>
      </footer>
    </div>
  );
}
