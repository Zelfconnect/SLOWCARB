import { dayTips } from '@/data/journey';

interface TimelineEntry {
  days: string;
  title: string;
  description: string;
  intensity: 'low' | 'high' | 'medium' | 'reward';
}

const intensityStyles: Record<TimelineEntry['intensity'], { bg: string; label: string; dot: string }> = {
  low: { bg: 'bg-sage-50/80', label: 'text-sage-700', dot: 'bg-sage-500' },
  high: { bg: 'bg-stone-100', label: 'text-stone-800', dot: 'bg-stone-700' },
  medium: { bg: 'bg-warm-100/80', label: 'text-stone-700', dot: 'bg-warm-400' },
  reward: { bg: 'bg-sage-50/80', label: 'text-sage-700', dot: 'bg-sage-500' },
};

const timelineEntries: TimelineEntry[] = [
  {
    days: 'Dag 1-2',
    title: dayTips[0].title,
    description: 'Motivatie is hoog, je lichaam merkt nog weinig verschil.',
    intensity: 'low',
  },
  {
    days: 'Dag 3',
    title: dayTips[2].title,
    description: dayTips[2].metabolicState,
    intensity: 'high',
  },
  {
    days: 'Dag 4-6',
    title: dayTips[3].title,
    description: 'Energie stabiliseert, honger neemt af, cravings verdwijnen.',
    intensity: 'medium',
  },
  {
    days: 'Dag 7',
    title: dayTips[6].title,
    description: 'Alles mag. Leptine reset. Je hebt het verdiend.',
    intensity: 'reward',
  },
];

export function BodyTimeline() {
  return (
    <section className="flex flex-1 flex-col">
      <div className="space-y-3 text-center">
        <h1 className="font-display text-3xl font-bold text-stone-900">
          Wat je lichaam doet
        </h1>
        <p className="text-base text-stone-500">
          De eerste week, dag voor dag
        </p>
      </div>

      <div className="relative mt-8 space-y-0">
        {/* Vertical timeline line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-stone-200" />

        {timelineEntries.map((entry, i) => {
          const style = intensityStyles[entry.intensity];
          return (
            <div
              key={entry.days}
              className="relative flex gap-4 pb-5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Timeline dot */}
              <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center">
                <div className={`h-3 w-3 rounded-full ${style.dot} ring-4 ring-cream`} />
              </div>

              {/* Content card */}
              <div className={`flex-1 rounded-2xl ${style.bg} p-4`}>
                <span className={`text-[11px] font-bold uppercase tracking-wide ${style.label}`}>
                  {entry.days}
                </span>
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
