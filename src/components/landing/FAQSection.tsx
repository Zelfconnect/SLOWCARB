import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { trackLanding } from './analytics';

const faqs = [
  { q: 'Is dit een abonnement?', a: 'Nee. Je betaalt één keer €47 en hebt daarna voor altijd toegang. Geen maandelijkse kosten, geen verrassingen.' },
  { q: 'Moet ik naar de sportschool?', a: 'Nee. SlowCarb is puur voeding. Bewegen helpt altijd, maar het protocol werkt zonder gym. Jesper verloor 8 kilo zonder sportschool.' },
  { q: 'Werkt dit ook met ADHD of een druk leven?', a: 'Juist dan. De 5 regels zijn zo simpel dat ze geen cognitieve ruimte kosten. Geen bijhouden, geen tellen, geen dagelijkse keuzes. De app doet het denkwerk.' },
  { q: 'Wat als het niet werkt voor mij?', a: 'Dan krijg je je geld terug. 30 dagen, geen vragen. Maar het protocol van Tim Ferriss is bewezen bij duizenden mensen wereldwijd. De app maakt het alleen makkelijker om het vol te houden.' },
  { q: 'Is dit gewoon een kookboek-app?', a: 'Nee. Het is een complete tool: AmmoCheck checklist, dagtracker, 84-dagen educatie, recepten en boodschappenlijst. Alles om het protocol 6+ weken vol te houden.' },
  { q: 'Hoe snel zie ik resultaat?', a: 'De meeste mensen verliezen 1-2 kg in de eerste week. In 6 weken is 8-10 kg realistisch. Zonder honger en zonder extreme maatregelen.' },
] as const;

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    const isOpening = openIndex !== i;
    setOpenIndex(isOpening ? i : null);
    if (isOpening) {
      trackLanding('landing_faq_open', { question: faqs[i].q });
    }
  };

  return (
    <section id="faq" className="faq-release-section relative overflow-hidden bg-surface-paper py-28 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-sage-100/70 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="editorial-kicker text-sage-700">
            Veelgestelde vragen
          </p>
          <h2 className="landing-balance mt-4 text-4xl font-display font-bold tracking-tight text-ink-strong md:text-5xl">
            Veelgestelde Vragen
          </h2>
          <p className="landing-pretty card-body mt-4 text-ink-body">
            Geen kleine lettertjes of verborgen abonnementen. Dit is wat mensen meestal willen weten voordat ze starten.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <article key={faq.q} className="faq-item motion-surface overflow-hidden rounded-[1.7rem] border border-warm-200/75 bg-white/82 shadow-[0_18px_38px_rgba(28,25,23,0.05)] backdrop-blur">
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left md:px-8 md:py-6"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span className="landing-balance text-lg font-bold text-ink-strong">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-sage-500 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === i && (
                <div className="faq-answer px-6 pb-6 md:px-8">
                  <p className="landing-pretty card-body text-ink-body">{faq.a}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
