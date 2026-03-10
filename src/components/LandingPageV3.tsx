import { useState, useEffect, useRef } from "react";
import {
  Shield,
  Check,
  RefreshCw,
  Globe,
  Zap,
  XCircle,
  ChevronDown,
  ChevronUp,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════ */

const TRUST = [
  { icon: Shield, label: "Veilig afrekenen" },
  { icon: RefreshCw, label: "30 dagen geld-terug" },
  { icon: Globe, label: "EU-privacyproof" },
  { icon: Zap, label: "Direct toegang" },
] as const;

const PAIN_ITEMS = [
  "Je hebt al 3 diëten geprobeerd dit jaar. Niets bleef plakken.",
  "Je bent het tellen, wegen en bijhouden zat.",
  "Je wilt gewoon weten: wat mag ik eten? En wat niet?",
] as const;

const VALUE_BLOCKS = [
  {
    num: "01",
    label: "Verzadiging",
    title: "Eet tot je vol zit",
    body: "Geen honger, geen kleine porties. SlowCarb draait om de juiste ingrediënten, niet om minder eten. Eiwit + peulvruchten = vol gevoel, hele dag.",
    photo: "Bord vol met eiwit, groenten en peulvruchten",
  },
  {
    num: "02",
    label: "Eenvoud",
    title: "Nul calorieën tellen",
    body: "Geen app die je afstraft als je 50 kcal over bent. Geen weegschaaltje voor je eten. Gewoon: mag dit? Ja of nee. Klaar.",
    photo: "Simpele maaltijdvoorbereiding in de keuken",
  },
  {
    num: "03",
    label: "Het systeem",
    title: "Eén cheatdag per week",
    body: "Elke zaterdag: eet wat je wilt. Pizza, pannenkoeken, chocola. Geen schuldgevoel — het hoort bij het protocol. De metabole reset voorkomt spaarstand.",
    photo: "Cheatday met pizza en snacks",
  },
] as const;

const STEPS = [
  {
    num: "1",
    title: "Kies een recept",
    body: "Open de app en kies uit 40+ bewezen SlowCarb recepten. Alles staat klaar — boodschappenlijst incluis.",
  },
  {
    num: "2",
    title: "Kook & eet tot je vol zit",
    body: "Volg het recept, eet tot je verzadigd bent. Geen grammen tellen, geen schuldgevoel.",
  },
  {
    num: "3",
    title: "Volg je voortgang",
    body: "Log je maaltijden en gewicht. De app houdt je streak bij en motiveert je door de eerste 6 weken.",
  },
] as const;

const RULES = [
  {
    title: "Geen witte koolhydraten",
    desc: "Geen brood, pasta, rijst of aardappelen. Vervang ze door peulvruchten en groenten.",
    quote: "Als het wit is, eet het niet.",
  },
  {
    title: "Eet dezelfde maaltijden",
    desc: "Kies 3-4 maaltijden die je lekker vindt en herhaal ze. Simpel, effectief, geen beslismoeheid.",
    quote: "De meest succesvolle diëters variëren weinig.",
  },
  {
    title: "Drink geen calorieën",
    desc: "Water, thee, koffie (zwart). Geen sap, geen smoothies, geen fris. Alcohol minimaal.",
    quote: "Vloeibare calorieën tellen niet voor je gevoel.",
  },
  {
    title: "Geen fruit (tijdelijk)",
    desc: "Fructose remt vetverbranding. Parkeer fruit tijdens de afvalfase — daarna mag het terug.",
    quote: "Fruit is natuur's snoep. Parkeer het even.",
  },
  {
    title: "Eén vrije dag per week",
    desc: "Zaterdag = cheatdag. Eet álles. Dit reset je metabolisme en voorkomt dat je lichaam in spaarstand gaat.",
    quote: "De cheatdag is geen beloning, het is het systeem.",
  },
] as const;

const COMPARISON_ROWS = [
  { feature: "Calorieën tellen", slowcarb: "Nooit", other: "Elke dag", highlight: false },
  { feature: "Hongergevoel", slowcarb: "Nee — eet tot je vol zit", other: "Ja — kleine porties", highlight: false },
  { feature: "Cheatdag", slowcarb: "Ja, elke week", other: "Verboden", highlight: false },
  { feature: "Willskracht nodig", slowcarb: "Minimaal", other: "Heel veel", highlight: false },
  { feature: "Regels", slowcarb: "5 simpele regels", other: "Complex puntensysteem", highlight: false },
  { feature: "Resultaat na 6 weken", slowcarb: "4–8 kg kwijt", other: "1–2 kg + jojo", highlight: true },
] as const;

const PRICING_FEATURES = [
  "40+ bewezen SlowCarb recepten",
  "Automatische boodschappenlijst",
  "84-dagen voortgangstracker",
  "Cheatdag-kalender",
  "Voorraadplanner met supermarktformaten",
  "Alle toekomstige updates gratis",
] as const;

const TESTIMONIALS = [
  {
    quote: "Na twee weken voelde ik me al lichter. Geen honger, gewoon lekker eten. Dit is het eerste 'dieet' dat ik langer dan een maand volhoud.",
    name: "Lisa",
    result: "6 kg in 5 weken",
  },
  {
    quote: "De cheatdag is geniaal. Ik kijk er elke week naar uit en het werkt echt — mijn gewicht blijft dalen.",
    name: "Mark",
    result: "8 kg in 6 weken",
  },
  {
    quote: "Eindelijk een aanpak zonder al dat gedoe met calorieën en macro's. Gewoon eten wat mag, vol raken, klaar.",
    name: "Sophie",
    result: "5 kg in 4 weken",
  },
] as const;

const FAQ_ITEMS = [
  {
    q: "Is dit weer zo'n crashdieet?",
    a: "Nee. SlowCarb is geen caloriebeperking. Je eet tot je vol zit — alleen de juiste dingen. Het protocol komt uit The 4-Hour Body van Tim Ferriss en is gebaseerd op jarenlang zelfonderzoek en wetenschappelijke principes.",
  },
  {
    q: "Mag ik echt alles eten op de cheatdag?",
    a: "Ja. Alles. Pizza, ijs, bier, chocolade. De cheatdag is geen 'beloning' — het is een essentieel onderdeel van het protocol. Het reset je metabolisme (leptine-niveaus) en voorkomt dat je lichaam in spaarstand gaat.",
  },
  {
    q: "Wat als ik geen tijd heb om te koken?",
    a: "De meeste recepten in de app zijn in 20-30 minuten klaar. En omdat je dezelfde maaltijden herhaalt, kun je makkelijk meal-preppen voor meerdere dagen.",
  },
  {
    q: "Is dit geschikt voor vegetariërs?",
    a: "Het protocol is makkelijker met dierlijke eiwitten, maar we hebben ook vegetarische recepten. Peulvruchten, eieren en zuivel zijn goede eiwitbronnen binnen SlowCarb.",
  },
  {
    q: "Hoe snel zie ik resultaat?",
    a: "De meeste mensen verliezen 2-4 kg in de eerste week (deels vocht). Daarna gemiddeld 0.5-1 kg per week. Na 6 weken is 4-8 kg realistisch als je de 5 regels volgt.",
  },
  {
    q: "Wat als het niet werkt voor mij?",
    a: "Je hebt 30 dagen om het te proberen. Niet tevreden? Stuur een mail en je krijgt je geld terug. Geen vragen, geen voorwaarden.",
  },
] as const;

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════ */

function Photo({ desc, className }: { desc: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-100 border-2 border-dashed border-stone-300 flex items-center justify-center",
        className
      )}
    >
      <p className="text-stone-400 text-sm text-center px-6">
        [FOTO: {desc}]
      </p>
    </div>
  );
}

function useReveal(count: number) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [vis, setVis] = useState<boolean[]>(Array(count).fill(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number(
            (entry.target as HTMLElement).dataset.revealIdx
          );
          if (Number.isNaN(idx)) return;
          setVis((prev) => {
            if (prev[idx]) return prev;
            const next = [...prev];
            next[idx] = true;
            return next;
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    refs.current.forEach((n) => n && observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const ref =
    (i: number) => (el: HTMLElement | null) => {
      refs.current[i] = el;
    };

  return { vis, ref };
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

export default function LandingPageV3() {
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const heroCtaRef = useRef<HTMLDivElement | null>(null);
  const { vis, ref } = useReveal(12);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show sticky bar after scrolling past hero CTA
  useEffect(() => {
    const el = heroCtaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setShowStickyBar(
          !entry.isIntersecting && entry.boundingClientRect.top < 0
        );
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const openCheckout = () =>
    window.open("https://buy.stripe.com/5kQ28t0JQ9Geaht9Kb5Rm00", "_blank");

  const heroAnim = () =>
    cn(
      "transition-all duration-700",
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    );

  const sectionAnim = (isVis: boolean) =>
    cn(
      "transition-all duration-700",
      isVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    );

  return (
    <div className="min-h-screen bg-white">
      {/* ─── 1. STICKY MOBILE BAR ──────────────────────────────────── */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-stone-900 md:hidden transition-transform duration-300",
          showStickyBar ? "translate-y-0" : "translate-y-full"
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <span className="text-sm text-stone-400 line-through">€79</span>
            <span className="ml-2 text-lg font-bold text-white">Nu €47</span>
          </div>
          <Button
            onClick={openCheckout}
            className="h-10 rounded-xl bg-white px-6 text-sm font-bold text-stone-900 hover:bg-stone-100"
          >
            Start nu
          </Button>
        </div>
      </div>

      {/* ─── 2. HERO ───────────────────────────────────────────────── */}
      <section className="bg-white min-h-[90vh] flex items-center">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24 w-full">
          <div className="grid md:grid-cols-[3fr_2fr] gap-16 items-center">
            {/* Left content */}
            <div>
              <div
                className={heroAnim()}
                style={{ transitionDelay: "0ms" }}
              >
                <span className="inline-block bg-sage-100 text-sage-700 rounded-full text-sm font-medium px-4 py-1.5">
                  Gebaseerd op het 4-Hour Body protocol
                </span>
              </div>

              <h1
                className={cn(
                  "text-6xl md:text-8xl font-display font-black text-stone-900 leading-[1.05] mt-6",
                  heroAnim()
                )}
                style={{ transitionDelay: "100ms" }}
              >
                4 tot 8 kilo
                <br />
                in 6 weken.
              </h1>

              <p
                className={cn(
                  "text-xl text-stone-600 mt-6 max-w-lg",
                  heroAnim()
                )}
                style={{ transitionDelay: "200ms" }}
              >
                Zonder calorieën te tellen, zonder honger en zonder jezelf te
                dwingen.
              </p>

              <p
                className={cn(
                  "text-stone-500 mt-3 max-w-md",
                  heroAnim()
                )}
                style={{ transitionDelay: "200ms" }}
              >
                Eet gewoon tot je vol zit. Volg 5 simpele regels. Inclusief
                cheatdag.
              </p>

              <div
                ref={heroCtaRef}
                className={heroAnim()}
                style={{ transitionDelay: "300ms" }}
              >
                <Button
                  onClick={openCheckout}
                  className="mt-10 h-14 px-10 text-lg font-bold rounded-xl bg-sage-600 hover:bg-sage-700 text-white"
                >
                  Start nu – Direct toegang →
                </Button>
                <p className="text-sm text-stone-400 mt-4">
                  <span className="line-through">€79</span> · Vandaag €47
                  (eerste 200) · Eenmalig, lifetime
                </p>
              </div>

              <div
                className={cn(
                  "mt-8 flex flex-wrap gap-x-6 gap-y-3",
                  heroAnim()
                )}
                style={{ transitionDelay: "400ms" }}
              >
                {TRUST.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-sm text-stone-500"
                  >
                    <Icon className="w-4 h-4" strokeWidth={2} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right image */}
            <div
              className={cn("hidden md:block", heroAnim())}
              style={{ transitionDelay: "300ms" }}
            >
              <Photo desc="Uitnodigend bord met SlowCarb maaltijd — kleurrijk, vol, smakelijk" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. HERKENBAAR? ────────────────────────────────────────── */}
      <section
        ref={ref(0)}
        data-reveal-idx={0}
        className="bg-stone-50 py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-display font-extrabold text-stone-900 text-center",
              sectionAnim(vis[0])
            )}
          >
            Herkenbaar?
          </h2>

          <div
            className={cn(
              "max-w-xl mx-auto space-y-5 mt-12",
              sectionAnim(vis[0])
            )}
            style={{ transitionDelay: "150ms" }}
          >
            {PAIN_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <XCircle className="text-rose-400 w-6 h-6 flex-shrink-0 mt-0.5" />
                <p className="text-lg text-stone-700">{item}</p>
              </div>
            ))}
          </div>

          <p
            className={cn(
              "mt-14 text-center text-xl font-bold text-stone-900",
              sectionAnim(vis[0])
            )}
            style={{ transitionDelay: "300ms" }}
          >
            SlowCarb is geen dieet. Het is een systeem met 5 regels.
          </p>
        </div>
      </section>

      {/* ─── 4. WAT ALS AFVALLEN SIMPEL WAS? ──────────────────────── */}
      <section
        ref={ref(1)}
        data-reveal-idx={1}
        className="bg-white py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-display font-extrabold text-stone-900 text-center mb-20",
              sectionAnim(vis[1])
            )}
          >
            Wat als afvallen simpel was?
          </h2>

          {VALUE_BLOCKS.map((block, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={block.num}
                className={cn(
                  "py-16 border-stone-100",
                  idx < VALUE_BLOCKS.length - 1 && "border-b",
                  sectionAnim(vis[1])
                )}
                style={{ transitionDelay: `${(idx + 1) * 150}ms` }}
              >
                <div
                  className={cn(
                    "grid md:grid-cols-2 gap-16 items-center",
                    isEven && "direction-rtl"
                  )}
                >
                  <div className={cn(isEven && "md:order-2")}>
                    <p className="text-sm font-bold tracking-widest text-sage-600 uppercase">
                      {block.num} — {block.label}
                    </p>
                    <h3 className="text-3xl font-display font-black text-stone-900 mt-4">
                      {block.title}
                    </h3>
                    <p className="text-lg text-stone-600 mt-6 leading-relaxed">
                      {block.body}
                    </p>
                  </div>
                  <div className={cn(isEven && "md:order-1")}>
                    <Photo desc={block.photo} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 5. ZO WERKT DE APP ────────────────────────────────────── */}
      <section
        ref={ref(2)}
        data-reveal-idx={2}
        className="bg-stone-50 py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-display font-extrabold text-stone-900 text-center",
              sectionAnim(vis[2])
            )}
          >
            Zo werkt de app
          </h2>
          <p
            className={cn(
              "text-xl text-stone-600 mt-4 mb-20 text-center",
              sectionAnim(vis[2])
            )}
          >
            Van &quot;ik weet niet wat ik moet eten&quot; naar resultaat in 3
            stappen.
          </p>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {STEPS.map((step, idx) => (
              <div
                key={step.num}
                className={cn("relative", sectionAnim(vis[2]))}
                style={{ transitionDelay: `${(idx + 1) * 150}ms` }}
              >
                <span className="text-7xl font-display font-black text-stone-200 leading-none block">
                  {step.num}
                </span>
                <h3 className="text-2xl font-display font-bold text-stone-900 mt-4">
                  {step.title}
                </h3>
                <p className="text-stone-600 mt-3 leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div
            className={cn("mt-20", sectionAnim(vis[2]))}
            style={{ transitionDelay: "600ms" }}
          >
            <Photo
              desc="App screenshot — receptoverzicht met boodschappenlijst"
              className="max-w-2xl mx-auto aspect-[16/10]"
            />
          </div>
        </div>
      </section>

      {/* ─── 6. DE 5 REGELS ────────────────────────────────────────── */}
      <section
        ref={ref(3)}
        data-reveal-idx={3}
        className="bg-white py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-display font-extrabold text-stone-900 text-center",
              sectionAnim(vis[3])
            )}
          >
            De 5 regels
          </h2>
          <p
            className={cn(
              "text-xl text-stone-600 mt-4 mb-16 text-center max-w-2xl mx-auto",
              sectionAnim(vis[3])
            )}
          >
            Geen ingewikkeld puntensysteem. Geen calorieën tellen. Volg deze 5
            regels en je bent klaar.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RULES.map((rule, idx) => (
              <article
                key={rule.title}
                className={cn(
                  "rounded-2xl border border-stone-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-200",
                  sectionAnim(vis[3])
                )}
                style={{ transitionDelay: `${(idx + 1) * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center font-display text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-display font-bold text-stone-900">
                    {rule.title}
                  </h3>
                </div>
                <p className="text-sm italic text-stone-500 mt-1">
                  &ldquo;{rule.quote}&rdquo;
                </p>
                <p className="text-sm text-stone-600 leading-relaxed mt-3">
                  {rule.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. FOUNDER ────────────────────────────────────────────── */}
      <section
        ref={ref(4)}
        data-reveal-idx={4}
        className="bg-stone-50 py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-[2fr_3fr] gap-16 items-center">
            <div className={sectionAnim(vis[4])}>
              <Photo desc="Portretfoto van de maker" className="aspect-[3/4]" />
            </div>

            <div
              className={sectionAnim(vis[4])}
              style={{ transitionDelay: "150ms" }}
            >
              <p className="text-sm font-bold tracking-widest text-sage-600 uppercase">
                Waarom ik dit bouwde
              </p>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-stone-900 mt-4">
                Ik was het ook zat.
              </h2>
              <div className="space-y-5 mt-8 text-lg text-stone-600 leading-relaxed">
                <p>
                  Na jaren van calorieën tellen, apps bijhouden en mezelf
                  uitputten op de sportschool, ontdekte ik het SlowCarb-protocol
                  in The 4-Hour Body.
                </p>
                <p>
                  Het resultaat? 9 kilo kwijt in 8 weken. Zonder honger, zonder
                  complex gedoe. Gewoon 5 regels volgen en op zaterdag alles
                  eten wat ik wilde.
                </p>
                <p className="font-semibold text-stone-900">
                  Ik bouwde deze app om het voor iedereen net zo simpel te maken
                  als het voor mij was.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. VERGELIJKING ───────────────────────────────────────── */}
      <section
        ref={ref(5)}
        data-reveal-idx={5}
        className="bg-white py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-display font-extrabold text-stone-900 text-center mb-16",
              sectionAnim(vis[5])
            )}
          >
            SlowCarb vs. typisch dieet
          </h2>

          <div
            className={cn(
              "max-w-3xl mx-auto rounded-2xl border border-stone-200 overflow-hidden",
              sectionAnim(vis[5])
            )}
            style={{ transitionDelay: "150ms" }}
          >
            {/* Header row */}
            <div className="grid grid-cols-3 text-sm font-bold">
              <div className="p-4 bg-stone-50 text-stone-500" />
              <div className="p-4 bg-stone-50 text-stone-900 text-center">
                SlowCarb
              </div>
              <div className="p-4 bg-stone-50 text-stone-500 text-center">
                Typisch dieet
              </div>
            </div>

            {/* Data rows */}
            {COMPARISON_ROWS.map((row, idx) => (
              <div
                key={row.feature}
                className={cn(
                  "grid grid-cols-3 text-sm",
                  row.highlight
                    ? "bg-stone-900 text-white font-bold"
                    : idx % 2 === 0
                      ? "bg-white"
                      : "bg-stone-50"
                )}
              >
                <div
                  className={cn(
                    "p-4",
                    row.highlight ? "text-white" : "text-stone-700 font-medium"
                  )}
                >
                  {row.feature}
                </div>
                <div
                  className={cn(
                    "p-4 text-center",
                    row.highlight ? "text-white" : "text-stone-900 font-semibold"
                  )}
                >
                  {row.slowcarb}
                </div>
                <div
                  className={cn(
                    "p-4 text-center",
                    row.highlight ? "text-stone-300" : "text-stone-500"
                  )}
                >
                  {row.other}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. PRICING ────────────────────────────────────────────── */}
      <section
        ref={ref(6)}
        data-reveal-idx={6}
        className="bg-stone-50 py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-display font-extrabold text-stone-900 text-center",
              sectionAnim(vis[6])
            )}
          >
            Eén prijs. Alles inbegrepen.
          </h2>
          <p
            className={cn(
              "text-xl text-stone-600 mt-4 mb-16 text-center",
              sectionAnim(vis[6])
            )}
          >
            Geen abonnement. Eenmalig betalen, lifetime toegang.
          </p>

          <div
            className={cn(
              "max-w-md mx-auto rounded-2xl border border-stone-200 bg-white p-10 shadow-sm",
              sectionAnim(vis[6])
            )}
            style={{ transitionDelay: "150ms" }}
          >
            <div className="text-center mb-8">
              <span className="inline-block bg-sage-100 text-sage-700 rounded-full text-sm font-medium px-4 py-1.5 mb-6">
                Early Bird — eerste 200 plekken
              </span>
              <div className="flex items-end justify-center gap-3">
                <span className="text-2xl font-display font-semibold text-stone-400 line-through">
                  €79
                </span>
                <span className="text-5xl font-display font-black text-stone-900">
                  €47
                </span>
              </div>
              <p className="text-sm text-stone-500 mt-2">
                Eenmalig · Lifetime toegang · Inclusief updates
              </p>
            </div>

            <ul className="space-y-4 mb-10">
              {PRICING_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-100">
                    <Check
                      className="h-3 w-3 text-sage-600"
                      strokeWidth={3}
                    />
                  </div>
                  <span className="text-stone-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={openCheckout}
              className="w-full h-14 text-lg font-bold rounded-xl bg-sage-600 hover:bg-sage-700 text-white"
            >
              Start nu — €47 →
            </Button>

            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-stone-400">
              <div className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Veilig betalen</span>
              </div>
              <div className="flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>30 dagen geld-terug</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 10. GARANTIE ──────────────────────────────────────────── */}
      <section
        ref={ref(7)}
        data-reveal-idx={7}
        className="bg-sage-50 py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div
            className={cn(
              "max-w-3xl mx-auto text-center",
              sectionAnim(vis[7])
            )}
          >
            <Shield className="w-12 h-12 text-sage-600 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-stone-900">
              30 dagen geld-terug garantie
            </h2>
            <p className="text-lg text-stone-600 mt-6 max-w-xl mx-auto leading-relaxed">
              Probeer SlowCarb 30 dagen. Niet tevreden? Stuur een mail en je
              krijgt je volledige aankoopbedrag terug. Geen vragen, geen
              voorwaarden, geen klein-gedrukte.
            </p>
            <p className="text-stone-900 font-semibold mt-6">
              Het risico ligt bij ons, niet bij jou.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 11. SOCIAL PROOF ──────────────────────────────────────── */}
      <section
        ref={ref(8)}
        data-reveal-idx={8}
        className="bg-white py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-display font-extrabold text-stone-900 text-center mb-16",
              sectionAnim(vis[8])
            )}
          >
            Wat anderen zeggen
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <article
                key={t.name}
                className={cn(
                  "rounded-2xl border border-stone-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-200",
                  sectionAnim(vis[8])
                )}
                style={{ transitionDelay: `${(idx + 1) * 100}ms` }}
              >
                <Quote className="w-8 h-8 text-stone-200 mb-4" />
                <p className="text-stone-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 pt-4 border-t border-stone-100">
                  <p className="font-display font-bold text-stone-900">
                    {t.name}
                  </p>
                  <p className="text-sm text-sage-600 font-medium">
                    {t.result}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 12. FAQ ───────────────────────────────────────────────── */}
      <section
        ref={ref(9)}
        data-reveal-idx={9}
        className="bg-stone-50 py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-display font-extrabold text-stone-900 text-center mb-16",
              sectionAnim(vis[9])
            )}
          >
            Veelgestelde vragen
          </h2>

          <div
            className={cn(
              "max-w-2xl mx-auto divide-y divide-stone-200",
              sectionAnim(vis[9])
            )}
            style={{ transitionDelay: "150ms" }}
          >
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-6">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex items-center justify-between w-full text-left gap-4"
                  >
                    <span className="text-lg font-semibold text-stone-900">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-stone-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400 flex-shrink-0" />
                    )}
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                    )}
                  >
                    <p className="text-stone-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 13. FINAL CTA ─────────────────────────────────────────── */}
      <section
        ref={ref(10)}
        data-reveal-idx={10}
        className="bg-stone-900 py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8 text-center">
          <h2
            className={cn(
              "text-4xl md:text-5xl font-display font-extrabold text-white",
              sectionAnim(vis[10])
            )}
          >
            Klaar om te beginnen?
          </h2>
          <p
            className={cn(
              "text-xl text-stone-400 mt-6 max-w-xl mx-auto",
              sectionAnim(vis[10])
            )}
            style={{ transitionDelay: "100ms" }}
          >
            Start vandaag. Over 6 weken kijk je terug en vraag je je af waarom
            je zo lang hebt gewacht.
          </p>

          <div
            className={sectionAnim(vis[10])}
            style={{ transitionDelay: "200ms" }}
          >
            <Button
              onClick={openCheckout}
              className="mt-10 h-14 px-10 text-lg font-bold rounded-xl bg-sage-600 hover:bg-sage-700 text-white"
            >
              Start nu – €47 →
            </Button>
            <p className="text-sm text-stone-500 mt-4">
              <span className="line-through">€79</span> · Eenmalig · Lifetime
              toegang · 30 dagen geld-terug
            </p>
          </div>

          <div
            className={cn(
              "mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500",
              sectionAnim(vis[10])
            )}
            style={{ transitionDelay: "300ms" }}
          >
            {TRUST.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 14. FOOTER ────────────────────────────────────────────── */}
      <footer
        ref={ref(11)}
        data-reveal-idx={11}
        className="bg-stone-900 border-t border-stone-800 py-8 pb-28 md:pb-8"
      >
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div
            className={cn(
              "flex flex-col md:flex-row items-center justify-between gap-4",
              sectionAnim(vis[11])
            )}
          >
            <p className="text-sm text-stone-500">
              © {new Date().getFullYear()} SlowCarb App. Alle rechten
              voorbehouden.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Voorwaarden
              </a>
              <a
                href="mailto:hallo@slowcarb.app"
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
