import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import type { DayStatus } from '@/types';

interface WeeklyProgressGridProps {
  weekData: DayStatus[];
}

export function WeeklyProgressGrid({ weekData }: WeeklyProgressGridProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-700">Huidige week</p>
        <p className="text-xs text-stone-400">6 protocoldagen + 1 cheat day</p>
      </div>

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
            {day.completed ? (
              <>
                <CheckIcon className="h-3.5 w-3.5" />
                <span className="text-[10px] leading-tight">{day.label}</span>
              </>
            ) : (
              <span>{day.label}</span>
            )}
            {day.isToday && <div className="w-1 h-1 bg-white rounded-full mt-1" />}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 text-[11px] text-stone-600">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sage-600" />
          <span>Protocol</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-clay-500" />
          <span>Cheat day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-stone-300" />
          <span>Gepland</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-red-400" />
          <span>Gemist</span>
        </div>
      </div>
    </div>
  );
}
