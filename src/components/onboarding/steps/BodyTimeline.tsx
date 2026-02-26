import { dayTips } from '@/data/journey';

interface TimelineEntry {
  days: string;
  title: string;
  description: string;
  severity: 'easy' | 'tough' | 'turning' | 'reward';
}

const severityStyles: Record<TimelineEntry['severity'], { bg: string; text: string; dot: string }> = {
  easy: { bg: 'bg-sage-50', text: 'text-sage-700', dot: 'bg-sage-500' },
  tough: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  turning: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  reward: { bg: 'bg-sage-50', text: 'text-sage-700', dot: 'bg-sage-500' },
};

// Condense 7 day tips into 4 key moments
const timelineEntries: TimelineEntry[] = [
  {
    days: 'Dag 1-2',
    title: dayTips[0].title,
    description: 'Motivatie is hoog, je lichaam merkt nog weinig verschil.',
    severity: 'easy',
  },
  {
    days: 'Dag 3',
    title: dayTips[2].title,
    description: dayTips[2].metabolicState,
    severity: 'tough',
  },
  {
    days: 'Dag 4-6',
    title: dayTips[3].title,
    description: 'Energie stabiliseert, honger neemt af, cravings verdwijnen.',
    severity: 'turning',
  },
  {
    days: 'Dag 7',
    title: dayTips[6].title,
    description: 'Alles mag. Leptine reset. Je hebt het verdiend.',
    severity: 'reward',
  },
];

export function BodyTimeline() {
  return (
    <section className="flex flex-1 flex-col">
      <div className="space-y-3 text-center">
        <h1 className="font-display text-3xl font-bold text-stone-900">
          Wat je lichaam doet
        </h1>
        <p className="text-base text-stone-600">
          De eerste week, dag voor dag
        </p>
      </div>

      <div className="relative mt-8 space-y-0">
        {/* Vertical timeline line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-stone-200" />

        {timelineEntries.map((entry, i) => {
          const style = severityStyles[entry.severity];
          return (
            <div
              key={entry.days}
              className="relative flex gap-4 pb-5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Timeline dot */}
              <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center">
                <div className={`h-3.5 w-3.5 rounded-full ${style.dot} ring-4 ring-cream`} />
              </div>

              {/* Content card */}
              <div className={`flex-1 rounded-2xl ${style.bg} p-4`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-wide ${style.text}`}>
                    {entry.days}
                  </span>
                </div>
                <p className="mt-1 font-display text-sm font-semibold text-stone-900">
                  {entry.title}
                </p>
                <p className="mt-0.5 text-sm leading-snug text-stone-600">
                  {entry.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
