import { cn } from '@/lib/utils';
import type { DayStatus } from '@/types';

interface WeeklyProgressGridProps {
  weekData: DayStatus[];
}

export function WeeklyProgressGrid({ weekData }: WeeklyProgressGridProps) {
  return (
    <section className="rounded-2xl bg-white p-3 shadow-surface">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-stone-800">Huidige week</p>
        <p className="text-[12px] text-stone-500">7 dagen</p>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {weekData.map(day => (
          <div
            key={day.date}
            data-testid={`week-pill-${day.label}`}
            className={cn(
              'relative flex h-9 items-center justify-center rounded-full text-xs font-semibold',
              day.isToday
                ? 'bg-white text-stone-700 ring-1 ring-emerald-500'
                : day.isFuture
                  ? 'bg-stone-100 text-stone-600'
                  : day.completed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-stone-200 text-stone-600'
            )}
          >
            <span>{day.label}</span>
            {day.isToday ? (
              <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
