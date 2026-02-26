import { ruleCards } from '@/data/education';
import {
  Ban,
  RefreshCcw,
  GlassWater,
  Apple,
  PartyPopper,
} from 'lucide-react';
import type { ReactNode } from 'react';

const iconMap: Record<string, ReactNode> = {
  ban: <Ban className="h-5 w-5" />,
  'refresh-ccw': <RefreshCcw className="h-5 w-5" />,
  'cup-soda': <GlassWater className="h-5 w-5" />,
  apple: <Apple className="h-5 w-5" />,
  'party-popper': <PartyPopper className="h-5 w-5" />,
};

// Only show the 5 core rules (not the 30/30 rule)
const coreRules = ruleCards.filter((r) => r.ruleNumber != null && r.ruleNumber >= 1 && r.ruleNumber <= 5);

export function RulesOverview() {
  return (
    <section className="flex flex-1 flex-col">
      <div className="space-y-3 text-center">
        <h1 className="font-display text-3xl font-bold text-stone-900">
          De 5 regels
        </h1>
        <p className="text-base text-stone-600">Meer is het niet. Echt.</p>
      </div>

      <div className="mt-8 space-y-3">
        {coreRules.map((rule, i) => (
          <div
            key={rule.id}
            className="flex items-start gap-4 rounded-2xl border border-stone-200 bg-white/80 p-4"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-sage-700">
              {iconMap[rule.icon] ?? <span className="text-sm font-bold">{rule.ruleNumber}</span>}
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-stone-900">
                {rule.title}
              </p>
              <p className="mt-0.5 text-sm leading-snug text-stone-500">
                {rule.content.rule}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm font-medium text-sage-700">
        Dat is het. Geen kleine lettertjes.
      </p>
    </section>
  );
}
