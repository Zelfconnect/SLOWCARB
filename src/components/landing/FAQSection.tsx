import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Is dit een abonnement?', a: 'Nee. Je betaalt één keer €47 en hebt daarna voor altijd toegang. Geen maandelijkse kosten, geen verrassingen.' },
  { q: 'Moet ik naar de sportschool?', a: 'Nee. SlowCarb is puur voeding. Bewegen helpt altijd, maar het protocol werkt zonder gym. Jesper verloor 8 kilo zonder sportschool.' },
  { q: 'Werkt dit ook met ADHD of een druk leven?', a: 'Juist dan. De 5 regels zijn zo simpel dat ze geen cognitieve ruimte kosten. Geen bijhouden, geen tellen, geen dagelijkse keuzes. De app doet het denkwerk.' },
  { q: 'Wat als het niet werkt voor mij?', a: 'Dan krijg je je geld terug. 30 dagen, geen vragen. Maar het protocol van Tim Ferriss is bewezen bij duizenden mensen wereldwijd. De app maakt het alleen makkelijker om het vol te houden.' },
  { q: 'Is dit gewoon een kookboek-app?', a: 'Nee. Het is een complete tool: AmmoCheck checklist, dagtracker, 84-dagen educatie, recepten en boodschappenlijst. Alles om het protocol 6+ weken vol te houden.' },
  { q: 'Hoe snel zie ik resultaat?', a: 'De meeste mensen verliezen 1-2 kg in de eerste week. In 6 weken is 8-10 kg realistisch. Zonder honger en zonder extreme maatregelen.' },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="faq-release-section py-32 bg-surface-paper">
      <div className="max-w-3xl mx-auto px-6 scroll-animate">
        <h2 className="text-4xl md:text-5xl font-bold font-display text-center text-ink-strong mb-16 tracking-tight">Veelgestelde Vragen</h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white/[.72] ring-1 ring-warm-200/70 rounded-2xl shadow-[0_16px_34px_rgba(28,25,23,0.04)] overflow-hidden">
              <button
                className="w-full text-left px-8 py-6 flex justify-between items-center gap-4"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span className="text-lg font-bold text-ink-strong">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-sage-500 transition-transform duration-300 flex-shrink-0 ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-8 pb-6">
                  <p className="card-body text-ink-body">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
