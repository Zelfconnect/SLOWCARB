import { cn } from '@/lib/utils';
import type { DayStatus } from '@/types';

interface WeeklyProgressGridProps {
  weekData: DayStatus[];
}

export function WeeklyProgressGrid({ weekData }: WeeklyProgressGridProps) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {weekData.map(day => (
        <div
          key={day.date}
          className={cn(
            'flex aspect-square flex-col items-center justify-center rounded-xl border border-transparent text-xs font-medium shadow-soft',
            day.isCheatDay
              ? 'border-clay-300 bg-gradient-to-br from-clay-500 to-clay-600 text-white'
              : day.completed
                ? 'border-sage-300 bg-sage-600 text-white'
                : day.isFuture
                  ? 'border-2 border-dashed border-stone-300 bg-stone-200 text-stone-500'
                  : 'bg-red-100 border-2 border-red-300 text-red-600'
          )}
        >
          <span>{day.label}</span>
          {day.isToday && <div className="w-1 h-1 bg-white rounded-full mt-1" />}
        </div>
      ))}
    </div>
  );
}
