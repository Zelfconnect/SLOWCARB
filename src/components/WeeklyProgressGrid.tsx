import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CHEAT_DAY_OPTIONS, CHEAT_DAY_LABELS } from '@/lib/cheatDay';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CheatDay, DayStatus } from '@/types';

interface WeeklyProgressGridProps {
  weekData: DayStatus[];
  onDayClick?: (date: string) => void;
  cheatDay?: CheatDay;
  onChangeCheatDay?: (day: CheatDay) => void;
}

export function WeeklyProgressGrid({ weekData, onDayClick, cheatDay, onChangeCheatDay }: WeeklyProgressGridProps) {
  const [editingCheatDay, setEditingCheatDay] = useState(false);

  return (
    <section className="rounded-2xl bg-white p-3 shadow-surface">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-stone-800">Huidige week</p>
          {onChangeCheatDay && !editingCheatDay && (
            <button
              type="button"
              onClick={() => setEditingCheatDay(true)}
              className="text-[11px] font-medium text-sage-600 hover:text-sage-800"
            >
              Wijzig
            </button>
          )}
        </div>
        {editingCheatDay && cheatDay && onChangeCheatDay ? (
          <Select
            value={cheatDay}
            onValueChange={(value) => {
              onChangeCheatDay(value as CheatDay);
              setEditingCheatDay(false);
            }}
          >
            <SelectTrigger className="h-7 w-auto min-w-[120px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHEAT_DAY_OPTIONS.map(day => (
                <SelectItem key={day} value={day} className="text-xs">
                  {CHEAT_DAY_LABELS[day]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-[12px] text-stone-500">7 dagen</p>
        )}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {weekData.map(day => {
          const isClickable = onDayClick && !day.isFuture;

          return isClickable ? (
            <button
              key={day.date}
              type="button"
              data-testid={`week-pill-${day.label}`}
              onClick={() => onDayClick(day.date)}
              className={cn(
                'relative flex h-9 items-center justify-center rounded-full text-xs font-semibold transition-transform active:scale-95',
                day.isToday
                  ? day.completed
                    ? 'bg-emerald-500 text-white ring-1 ring-emerald-700 ring-offset-1'
                    : 'bg-white text-stone-700 ring-1 ring-emerald-500'
                  : day.isCheatDay
                    ? 'bg-clay-200 text-clay-700'
                    : day.completed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-stone-200 text-stone-600'
              )}
            >
              <span>{day.label}</span>
              {day.isToday ? (
                <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              ) : null}
            </button>
          ) : (
            <div
              key={day.date}
              data-testid={`week-pill-${day.label}`}
              className={cn(
                'relative flex h-9 items-center justify-center rounded-full text-xs font-semibold',
                day.isToday
                  ? day.completed
                    ? 'bg-emerald-500 text-white ring-1 ring-emerald-700 ring-offset-1'
                    : 'bg-white text-stone-700 ring-1 ring-emerald-500'
                  : day.isFuture
                    ? 'bg-stone-100 text-stone-600'
                    : day.isCheatDay
                      ? 'bg-clay-200 text-clay-700'
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
          );
        })}
      </div>
    </section>
  );
}
