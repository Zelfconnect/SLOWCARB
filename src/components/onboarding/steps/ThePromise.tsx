import { UtensilsCrossed, ListChecks, CalendarHeart } from 'lucide-react';
import type { ReactNode } from 'react';

interface ThePromiseProps {
  name: string;
}

const stats: { value: string; label: string; icon: ReactNode }[] = [
  {
    value: '3',
    label: 'maaltijden per dag',
    icon: <UtensilsCrossed className="h-6 w-6" />,
  },
  {
    value: '5',
    label: 'simpele regels',
    icon: <ListChecks className="h-6 w-6" />,
  },
  {
    value: '1',
    label: 'cheat day per week',
    icon: <CalendarHeart className="h-6 w-6" />,
  },
];

export function ThePromise({ name }: ThePromiseProps) {
  return (
    <section className="flex flex-1 flex-col items-center">
      <div className="mt-4 space-y-3 text-center">
        <h1 className="font-display text-3xl font-bold text-stone-900">
          {name}, dit gaat werken.
        </h1>
        <p className="text-base text-stone-500">
          Het Slow-Carb protocol is simpeler dan je denkt
        </p>
      </div>

      <div className="mt-10 grid w-full grid-cols-1 gap-3 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-2xl border border-stone-200 bg-white/80 p-4 text-center"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-100 text-sage-700">
              {stat.icon}
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-sage-700">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium leading-tight text-stone-500">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
