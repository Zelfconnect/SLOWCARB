import { useState } from 'react';
import { Shield, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPageNoomBottom() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const openCheckout = () => window.open('https://buy.stripe.com/5kQ28t0JQ9Geaht9Kb5Rm00', '_blank');

  const faqs = [
    {
      question: "Is dit een abonnement?",
      answer: "Nee. Je betaalt één keer €47 en hebt daarna voor altijd toegang. Geen maandelijkse kosten, geen verrassingen."
    },
    {
      question: "Moet ik naar de sportschool?",
      answer: "Nee. SlowCarb is puur voeding. Bewegen helpt altijd, maar het protocol werkt zonder gym. Jesper verloor 8 kilo zonder sportschool."
    },
    {
      question: "Werkt dit ook met ADHD of een druk leven?",
      answer: "Juist dan. De 5 regels zijn zo simpel dat ze geen cognitieve ruimte kosten. Geen bijhouden, geen tellen, geen dagelijkse keuzes. De app doet het denkwerk."
    },
    {
      question: "Wat als het niet werkt voor mij?",
      answer: "Dan krijg je je geld terug. 30 dagen, geen vragen. Het protocol van Tim Ferriss is bewezen bij duizenden mensen wereldwijd."
    },
    {
      question: "Is dit gewoon een kookboek-app?",
      answer: "Nee. Het is een complete tool: voedingsscanner, meal tracker, 84-dagen educatie, recepten én boodschappenlijst. Alles om het protocol 6+ weken vol te houden."
    },
    {
      question: "Hoe snel zie ik resultaat?",
      answer: "De meeste mensen verliezen 1-2 kg in de eerste week. In 6 weken is 4-8 kg realistisch. Zonder honger en zonder extreme maatregelen."
    }
  ];

  return (
    <>
      {/* SECTION 1: FOUNDER */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="md:grid md:grid-cols-2 gap-16 items-center">
            {/* Image LEFT */}
            <div className="flex items-center justify-center rounded-2xl bg-stone-100 border-2 border-dashed border-stone-300 aspect-[4/3] w-full">
              <span className="text-sm text-stone-400 text-center px-4">FOTO: Echte foto van Jesper. Casual maar sterk.</span>
            </div>

            {/* Text RIGHT */}
            <div>
              <h2 className="font-display text-4xl font-bold text-stone-900">
                Waarom een militair een dieet-app bouwde.
              </h2>
              <p className="text-stone-600 text-lg mt-6">
                111 kilo. Vader van een drieling. ADHD. En een baan waarbij ik andere mensen in vorm moest houden terwijl ik zelf de controle kwijt was. Elk dieet vroeg om iets wat mijn brein niet kan: eindeloos bijhouden.
              </p>
              <p className="text-stone-600 text-lg mt-4">
                Vijf regels. Geen calorieën tellen. Eén cheatdag per week. Na zes weken: 8 kilo lichter. Zonder honger, zonder sportschool, zonder schuldgevoel. Voor het eerst voelde afvallen als een systeem in plaats van straf.
              </p>
              <p className="text-stone-600 text-lg mt-4">
                Ik bouwde SlowCarb Companion omdat ik wilde dat iemand dit voor mij had gedaan. Geen boek van 400 pagina's. Gewoon een tool die het denkwerk doet zodat jij je kunt focussen op leven.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-stone-200" />
                <div>
                  <p className="font-semibold">Jesper</p>
                  <p className="text-stone-500 text-sm">Oprichter SlowCarb · Ex-militair · Vader van drie</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: VERGELIJKING */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-4xl font-display font-bold text-stone-900 text-center">
            Wat kost afvallen normaal?
          </h2>

          <div className="max-w-2xl mx-auto mt-12 rounded-2xl border border-stone-200 overflow-hidden">
            <div className="bg-white p-4 flex justify-between">
              <span>Diëtist</span>
              <span className="text-stone-600">€80-120 per sessie</span>
            </div>
            <div className="bg-stone-50 p-4 flex justify-between">
              <span>Noom</span>
              <span className="text-stone-600">€199 per jaar</span>
            </div>
            <div className="bg-white p-4 flex justify-between">
              <span>WeightWatchers</span>
              <span className="text-stone-600">€23/maand (€276/jaar)</span>
            </div>
            <div className="bg-stone-50 p-4 flex justify-between">
              <span>Personal trainer</span>
              <span className="text-stone-600">€50-80 per sessie</span>
            </div>
            <div className="bg-sage-800 text-white p-5 flex justify-between items-center font-bold text-lg">
              <span>SlowCarb Companion</span>
              <span className="flex items-center gap-2">
                €47. Eenmalig. Voor altijd.
                <Check className="w-5 h-5" />
              </span>
            </div>
          </div>

          <p className="text-center mt-6 text-stone-500 italic">
            En je hoeft niet eens naar de sportschool.
          </p>
        </div>
      </section>

      {/* SECTION 3: PRICING */}
      <section id="pricing" className="bg-stone-50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-4xl font-display font-bold text-stone-900 text-center">
            Alles wat je nodig hebt — voor minder dan één diëtistbezoek
          </h2>
          <p className="text-xl text-stone-600 text-center mt-4">
            Eenmalige investering. Geen abonnement. Geen verborgen kosten.
          </p>

          <div className="max-w-lg mx-auto mt-12 rounded-3xl border border-stone-200 bg-white p-8 shadow-elevated">
            <span className="inline-block bg-sage-100 text-sage-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
              Early Bird
            </span>

            <div className="space-y-0">
              <div className="flex justify-between items-start py-3 border-b border-stone-100">
                <div>
                  <p className="font-semibold text-stone-800">De 84-dagen SlowCarb Journey</p>
                  <p className="text-sm text-stone-500 mt-1">Dagelijkse science cards: wat er in je lichaam gebeurt en waarom je afvalt.</p>
                </div>
                <span className="text-stone-400 line-through">€97</span>
              </div>

              <div className="flex justify-between items-start py-3 border-b border-stone-100">
                <div>
                  <p className="font-semibold text-stone-800">AmmoCheck Voedingsscanner</p>
                  <p className="text-sm text-stone-500 mt-1">Scan elk product. Direct antwoord: mag dit of niet.</p>
                </div>
                <span className="text-stone-400 line-through">€47</span>
              </div>

              <div className="flex justify-between items-start py-3 border-b border-stone-100">
                <div>
                  <p className="font-semibold text-stone-800">50+ SlowCarb Recepten</p>
                  <p className="text-sm text-stone-500 mt-1">Inclusief boodschappenlijst. Binnen 15 min klaar.</p>
                </div>
                <span className="text-stone-400 line-through">€37</span>
              </div>

              <div className="flex justify-between items-start py-3 border-b border-stone-100">
                <div>
                  <p className="font-semibold text-stone-800">Week 1 Kickstart Mealplan</p>
                  <p className="text-sm text-stone-500 mt-1">Exact wat je eet in week 1. Geen nadenken, gewoon volgen.</p>
                </div>
                <span className="text-stone-400 line-through">€27</span>
              </div>

              <div className="flex justify-between items-start py-3 border-b border-stone-100">
                <div>
                  <p className="font-semibold text-stone-800">Lifetime toegang + updates</p>
                  <p className="text-sm text-stone-500 mt-1">Eenmalig betalen, altijd profiteren.</p>
                </div>
                <span className="text-stone-400 line-through">€39</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between font-semibold text-stone-800">
              <span>TOTALE WAARDE</span>
              <span className="line-through text-stone-400">€247</span>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-stone-500 uppercase tracking-wider">Eerste 200 klanten</p>
              <p className="font-display text-6xl font-bold text-stone-900">€47</p>
              <p className="text-stone-400 text-sm mt-1">Daarna €79</p>
            </div>

            <Button
              onClick={openCheckout}
              className="mt-8 w-full h-14 bg-sage-600 text-white text-lg font-bold rounded-xl hover:bg-sage-700"
            >
              START NU VOOR €47
            </Button>

            <p className="text-center mt-4 text-sm text-stone-500">
              Lifetime toegang • Eenmalige betaling • Geen abonnement
            </p>
            <p className="text-center mt-2 text-xs text-stone-400">
              Veilig via iDEAL & creditcard · 30 dagen geld-terug
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: GARANTIE */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <Shield className="h-16 w-16 mx-auto text-sage-600 mb-8" />
          <h2 className="font-display text-4xl font-bold text-stone-900">
            30 dagen geld-terug. Geen vragen.
          </h2>
          <p className="text-xl text-stone-600 mt-6 leading-relaxed">
            Probeer SlowCarb Companion 30 dagen. Als je niet tevreden bent — om welke reden dan ook — krijg je je geld terug. Geen formulieren, geen uitleg nodig.
          </p>
          <div className="mt-8 bg-sage-50 rounded-2xl p-6 border-l-4 border-sage-400 text-left">
            <p className="italic text-stone-700">
              "Waarom? Omdat ik weet dat het werkt. En geld mag nooit de reden zijn om het niet te proberen."
            </p>
            <p className="mt-2 font-semibold text-stone-800">— Jesper</p>
          </div>
        </div>
      </section>

      {/* SECTION 5: SOCIAL PROOF */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-4xl font-display font-bold text-stone-900 text-center">
            Resultaten van echte gebruikers
          </h2>

          <div className="max-w-2xl mx-auto mt-12 bg-white rounded-3xl p-8 shadow-card">
            <span className="font-display text-6xl text-sage-200">"</span>
            <p className="text-xl text-stone-700 leading-relaxed">
              111 kg → 103 kg in 8 weken. Zonder sportschool, zonder honger. Het enige dieet dat bleef plakken.
            </p>
            <p className="mt-4 font-semibold text-stone-900">— Jesper, oprichter</p>
          </div>

          <div className="max-w-2xl mx-auto mt-8 text-center p-6 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-600">
              Het Slow-Carb protocol is ontwikkeld door Tim Ferriss en beschreven in{' '}
              <span className="italic font-bold">The 4-Hour Body</span>
              {' '}— een #1 New York Times bestseller.
            </p>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={openCheckout}
              className="text-sage-600 font-semibold hover:text-sage-700 cursor-pointer"
            >
              Word een van de eerste 200 gebruikers →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-4xl font-display font-bold text-stone-900 text-center mb-12">
            Veelgestelde vragen
          </h2>

          <div className="max-w-2xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-stone-200 py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex justify-between items-center w-full py-2"
                >
                  <span className="font-semibold text-stone-800 text-lg">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-sage-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-sage-600 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <p className="mt-3 text-stone-600 leading-relaxed">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CTA */}
      <section className="bg-sage-800 py-24">
        <div className="mx-auto max-w-6xl px-5 text-center text-white">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            Je hebt twee opties.
          </h2>

          <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-stone-100 rounded-2xl p-6 text-stone-800">
              Optie 1: Je gaat morgen weer op zoek naar het volgende dieet. Over 3 maanden sta je op dezelfde plek.
            </div>
            <div className="bg-sage-600 rounded-2xl p-6 text-white font-medium">
              Optie 2: Je begint vandaag met 5 simpele regels. Over 6 weken ben je 4-8 kilo lichter.
            </div>
          </div>

          <p className="mt-10 text-sage-200 text-center">
            €47 — eenmalig, lifetime, 30 dagen geld-terug
          </p>

          <Button
            onClick={openCheckout}
            className="mt-6 h-14 px-12 bg-white text-sage-800 font-bold text-lg rounded-xl hover:bg-stone-100"
          >
            START NU VOOR €47
          </Button>

          <p className="mt-4 text-sage-300 text-sm">
            Veilig via iDEAL & creditcard · Direct toegang na betaling
          </p>
        </div>
      </section>

      {/* SECTION 8: FOOTER */}
      <footer className="bg-stone-900 py-8 pb-24 md:pb-8">
        <div className="mx-auto max-w-6xl px-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white font-display font-bold text-xl">
            SlowCarb
          </div>

          <div className="flex flex-wrap gap-6">
            <a href="/terms-of-service" className="text-stone-400 hover:text-white text-sm">
              Algemene Voorwaarden
            </a>
            <a href="/privacy-policy" className="text-stone-400 hover:text-white text-sm">
              Privacy Policy
            </a>
            <a href="mailto:hello@slowcarb.nl" className="text-stone-400 hover:text-white text-sm">
              Contact
            </a>
          </div>

          <div className="text-stone-500 text-xs text-center md:text-right">
            <p>© 2026 SlowCarb Companion. Alle rechten voorbehouden.</p>
            <p>SlowCarb Companion is geen medisch advies. Raadpleeg een arts voordat je je eetpatroon wijzigt.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
