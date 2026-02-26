import { conceptCards, ruleCards } from '@/data/education';
import { Flame, Bean, PartyPopper } from 'lucide-react';
import type { ReactNode } from 'react';

interface ScienceCard {
  icon: ReactNode;
  title: string;
  text: string;
  accent: string;
  iconBg: string;
}

const cards: ScienceCard[] = [
  {
    icon: <Flame className="h-5 w-5" />,
    title: 'Insuline laag houden',
    text: conceptCards[0].content.summary,
    accent: 'text-amber-700',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    icon: <Bean className="h-5 w-5" />,
    title: 'Bonen houden je vol',
    text: conceptCards[2].content.summary,
    accent: 'text-sage-700',
    iconBg: 'bg-sage-100 text-sage-600',
  },
  {
    icon: <PartyPopper className="h-5 w-5" />,
    title: 'Cheat day = reset',
    text: ruleCards[4].content.science,
    accent: 'text-stone-700',
    iconBg: 'bg-stone-100 text-stone-600',
  },
];

export function WhyItWorks() {
  return (
    <section className="flex flex-1 flex-col">
      <div className="space-y-3 text-center">
        <h1 className="font-display text-3xl font-bold text-stone-900">
          Waarom het werkt
        </h1>
        <p className="text-base text-stone-600">
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
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                {card.icon}
              </div>
              <p className={`font-display text-sm font-semibold ${card.accent}`}>
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
