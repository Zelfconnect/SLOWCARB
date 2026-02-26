import { conceptCards, ruleCards } from '@/data/education';
import { Flame, Bean, PartyPopper } from 'lucide-react';
import type { ReactNode } from 'react';

interface ScienceCard {
  icon: ReactNode;
  title: string;
  text: string;
}

const cards: ScienceCard[] = [
  {
    icon: <Flame className="h-5 w-5" />,
    title: 'Insuline laag houden',
    text: conceptCards[0].content.summary,
  },
  {
    icon: <Bean className="h-5 w-5" />,
    title: 'Bonen houden je vol',
    text: conceptCards[2].content.summary,
  },
  {
    icon: <PartyPopper className="h-5 w-5" />,
    title: 'Cheat day = reset',
    text: ruleCards[4].content.science,
  },
];

export function WhyItWorks() {
  return (
    <section className="flex flex-1 flex-col">
      <div className="space-y-3 text-center">
        <h1 className="font-display text-3xl font-bold text-stone-900">
          Waarom het werkt
        </h1>
        <p className="text-base text-stone-500">
          De wetenschap in 30 seconden
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {cards.map((card, i) => (
          <div
            key={card.title}
            className="rounded-2xl border border-stone-200 bg-white/80 p-4"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-sage-700">
                {card.icon}
              </div>
              <p className="font-display text-sm font-semibold text-stone-800">
                {card.title}
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              {card.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
