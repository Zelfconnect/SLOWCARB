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
            'aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium',
            day.isCheatDay
              ? 'bg-gradient-to-br from-clay-400 to-orange-500 text-white'
              : day.completed
                ? 'bg-sage-500 text-white'
                : day.isFuture
                  ? 'bg-warm-200 border-2 border-dashed border-warm-300 text-warm-500'
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
