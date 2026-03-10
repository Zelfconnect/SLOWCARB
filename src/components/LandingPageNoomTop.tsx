import { Shield, RefreshCw, Globe, Zap, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPageNoomTop() {
  const openCheckout = () => window.open('https://buy.stripe.com/5kQ28t0JQ9Geaht9Kb5Rm00', '_blank');

  return (
    <>
      {/* SECTION 1: STICKY MOBILE CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-sage-800 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="text-white/60 line-through text-lg">€79</span>
            <span className="text-white font-bold text-xl">Nu €47</span>
          </div>
          <Button
            onClick={openCheckout}
            className="bg-white text-sage-800 hover:bg-stone-100 font-semibold"
          >
            Start nu
          </Button>
        </div>
      </div>

      {/* SECTION 2: HERO */}
      <section className="bg-cream min-h-[85vh] flex items-center">
        <div className="mx-auto max-w-6xl px-5 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <span className="inline-block px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-6">
                Gebaseerd op het 4-Hour Body protocol
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-bold text-stone-900 leading-tight">
                4 tot 8 kilo
                <br />
                in 6 weken.
              </h1>
              <p className="text-xl text-stone-600 mt-4">
                Zonder calorieën te tellen, zonder honger en zonder jezelf te dwingen.
              </p>
              <p className="text-stone-600 mt-3">
                Eet gewoon tot je vol zit. Volg 5 simpele regels. Inclusief cheatdag. Resultaat dat blijft.
              </p>
              <Button
                onClick={openCheckout}
                className="mt-8 h-14 bg-sage-600 hover:bg-sage-700 rounded-xl text-lg font-semibold text-white"
              >
                Start nu – Direct toegang →
              </Button>
              <p className="text-sm text-stone-500 mt-3">
                <span className="line-through">€79</span> · Vandaag €47 (eerste 200) · Eenmalig, lifetime
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Shield className="w-4 h-4" />
                  <span>Veilig afrekenen</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <RefreshCw className="w-4 h-4" />
                  <span>30 dagen geld-terug</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Globe className="w-4 h-4" />
                  <span>EU-conform</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Zap className="w-4 h-4" />
                  <span>Direct toegang</span>
                </div>
              </div>
            </div>

            {/* Right: Image Placeholder */}
            <div className="flex items-center justify-center rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 aspect-[4/3] w-full">
              <span className="text-sm text-stone-400 text-center px-4">FOTO: Phone mockup van de app</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: "HERKENBAAR?" */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="font-display text-4xl font-bold text-stone-900 text-center mb-12">
            Herkenbaar?
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-start gap-4">
              <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-stone-700 text-lg">Je hebt al 3 diëten geprobeerd dit jaar. Niets bleef plakken.</p>
            </div>
            <div className="flex items-start gap-4">
              <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-stone-700 text-lg">Je bent het tellen, wegen en bijhouden zat.</p>
            </div>
            <div className="flex items-start gap-4">
              <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-stone-700 text-lg">Je wilt gewoon weten: wat mag ik eten? En wat niet?</p>
            </div>
          </div>
          <p className="mt-10 text-center text-xl font-semibold text-stone-800">
            SlowCarb is geen dieet. Het is een systeem met 5 regels.
          </p>
        </div>
      </section>

      {/* SECTION 4: "WAT ALS AFVALLEN SIMPEL WAS?" */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-4xl font-display font-bold text-stone-900 text-center mb-16">
            Wat als afvallen simpel was?
          </h2>

          {/* Block 1: Text Left, Image Right */}
          <div className="py-16 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-display font-bold text-stone-900 mb-4">
                Eet tot je vol zit
              </h3>
              <p className="text-stone-600 text-lg">
                Geen honger, geen kleine porties. SlowCarb draait om de juiste ingrediënten, niet om minder eten. Eiwit + peulvruchten = vol gevoel, hele dag.
              </p>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 aspect-[4/3] w-full">
              <span className="text-sm text-stone-400 text-center px-4">FOTO: Person eating a full plate of slow-carb food, satisfied</span>
            </div>
          </div>

          {/* Block 2: Image Left, Text Right */}
          <div className="py-16 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-last md:order-first flex items-center justify-center rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 aspect-[4/3] w-full">
              <span className="text-sm text-stone-400 text-center px-4">FOTO: Phone mockup van AmmoCheck scanner</span>
            </div>
            <div>
              <h3 className="text-3xl font-display font-bold text-stone-900 mb-4">
                Nul calorieën tellen
              </h3>
              <p className="text-stone-600 text-lg">
                Geen app die je afstraft als je 50 kcal over bent. Geen weegschaaltje voor je eten. Gewoon: mag dit? Ja of nee. Klaar.
              </p>
            </div>
          </div>

          {/* Block 3: Text Left, Image Right */}
          <div className="py-16 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-display font-bold text-stone-900 mb-4">
                Eén cheatdag per week
              </h3>
              <p className="text-stone-600 text-lg">
                Elke zaterdag: eet wat je wilt. Pizza, pannenkoeken, chocola. Geen schuldgevoel — het hoort bij het protocol. De metabole reset voorkomt spaarstand.
              </p>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 aspect-[4/3] w-full">
              <span className="text-sm text-stone-400 text-center px-4">FOTO: Person enjoying pizza on cheat day, smiling</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: "ZO WERKT DE APP" */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-4xl font-display font-bold text-stone-900 text-center">
            Zo werkt de app
          </h2>
          <p className="text-xl text-stone-600 text-center mt-4 mb-16">
            Van 'ik weet niet wat ik mag eten' naar maaltijd op tafel in 15 minuten.
          </p>

          {/* Step 1 */}
          <div className="py-12 grid md:grid-cols-2 gap-8 items-center border-b border-stone-100">
            <div>
              <span className="text-6xl font-display font-bold text-sage-200">01</span>
              <h3 className="text-2xl font-display font-bold text-stone-900 mt-2 mb-3">
                Check: mag dit?
              </h3>
              <p className="text-stone-600">
                Scan elk product. Direct antwoord: toegestaan of niet. Geen etiket lezen, geen twijfel.
              </p>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 aspect-[4/3] w-full">
              <span className="text-sm text-stone-400 text-center px-4">FOTO: Phone AmmoCheck scanner</span>
            </div>
          </div>

          {/* Step 2 - Image Left */}
          <div className="py-12 grid md:grid-cols-2 gap-8 items-center border-b border-stone-100">
            <div className="order-last md:order-first flex items-center justify-center rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 aspect-[4/3] w-full">
              <span className="text-sm text-stone-400 text-center px-4">FOTO: Phone recepten</span>
            </div>
            <div>
              <span className="text-6xl font-display font-bold text-sage-200">02</span>
              <h3 className="text-2xl font-display font-bold text-stone-900 mt-2 mb-3">
                Kies een recept
              </h3>
              <p className="text-stone-600">
                50+ recepten die aan alle regels voldoen. Filter op bereidingstijd, airfryer, of ingrediënt.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="py-12 grid md:grid-cols-2 gap-8 items-center border-b border-stone-100">
            <div>
              <span className="text-6xl font-display font-bold text-sage-200">03</span>
              <h3 className="text-2xl font-display font-bold text-stone-900 mt-2 mb-3">
                Track je dag
              </h3>
              <p className="text-stone-600">
                Simpele check: heb ik de regels gevolgd? Geen calorieën. Gewoon ja of nee per maaltijd.
              </p>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 aspect-[4/3] w-full">
              <span className="text-sm text-stone-400 text-center px-4">FOTO: Phone dagtracker</span>
            </div>
          </div>

          {/* Step 4 - Image Left */}
          <div className="py-12 grid md:grid-cols-2 gap-8 items-center">
            <div className="order-last md:order-first flex items-center justify-center rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 aspect-[4/3] w-full">
              <span className="text-sm text-stone-400 text-center px-4">FOTO: Phone fysiologie</span>
            </div>
            <div>
              <span className="text-6xl font-display font-bold text-sage-200">04</span>
              <h3 className="text-2xl font-display font-bold text-stone-900 mt-2 mb-3">
                Leer waarom het werkt
              </h3>
              <p className="text-stone-600">
                Elke dag een science card: wat er in je lichaam gebeurt en waarom. Kennis = volhouden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: "DE 5 REGELS" */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-4xl font-display font-bold text-stone-900 text-center">
            De 5 regels. Dat is alles.
          </h2>
          <p className="text-xl text-stone-600 text-center mt-4 mb-12">
            Geen schema's, geen fases, geen uitzonderingen doordeweeks. Vijf regels volgen, één dag per week vrij.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Rule 1 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
              <div className="bg-sage-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-xl font-display font-semibold text-stone-900 mt-4">
                Vermijd 'witte' koolhydraten
              </h3>
              <p className="italic text-sage-600 text-sm mt-1">"De basis van vetverbranding."</p>
              <p className="text-stone-600 text-sm mt-3">
                Geen brood, pasta, rijst, aardappelen of gebak. Klinkt heftig — maar als je ontdekt wat er wél mag, mis je het niet.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
              <div className="bg-sage-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-xl font-display font-semibold text-stone-900 mt-4">
                Eet steeds dezelfde maaltijden
              </h3>
              <p className="italic text-sage-600 text-sm mt-1">"Herhaling verslaat variatie."</p>
              <p className="text-stone-600 text-sm mt-3">
                Kies 3-4 maaltijden en eet ze op repeat. Het neemt álle beslissingsstress weg. Variatie voeg je later toe.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
              <div className="bg-sage-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-xl font-display font-semibold text-stone-900 mt-4">
                Drink geen calorieën
              </h3>
              <p className="italic text-sage-600 text-sm mt-1">"Vloeibare suiker is onzichtbaar."</p>
              <p className="text-stone-600 text-sm mt-3">
                Water, koffie (zwart), thee. Geen sap, geen frisdrank, geen havermelk-latte. Eén glas rode wijn per dag mag.
              </p>
            </div>

            {/* Rule 4 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
              <div className="bg-sage-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-xl font-display font-semibold text-stone-900 mt-4">
                Eet geen fruit
              </h3>
              <p className="italic text-sage-600 text-sm mt-1">"Fructose is suiker in vermomming."</p>
              <p className="text-stone-600 text-sm mt-3">
                Ja, ook bananen en druiven. Avocado en tomaat mogen wél — die zijn technisch geen fruit.
              </p>
            </div>

            {/* Rule 5 */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-card">
              <div className="bg-sage-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                5
              </div>
              <h3 className="text-xl font-display font-semibold text-stone-900 mt-4">
                Eén cheatdag per week
              </h3>
              <p className="italic text-sage-600 text-sm mt-1">"De dag die het dieet laat werken."</p>
              <p className="text-stone-600 text-sm mt-3">
                Elke week één dag alles eten. De leptin-spike voorkomt spaarstand. Tim Ferriss at 4.000+ kcal op zijn cheatdays en viel toch af.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
