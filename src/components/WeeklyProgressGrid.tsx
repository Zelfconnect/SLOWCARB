import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CHEAT_DAY_OPTIONS, CHEAT_DAY_LABELS } from '@/lib/cheatDay';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { CheatDay, DayStatus } from '@/types';

interface WeeklyProgressGridProps {
  weekData: DayStatus[];
  onDayClick?: (date: string) => void;
  cheatDay?: CheatDay;
  onChangeCheatDay?: (day: CheatDay) => void;
}

export function WeeklyProgressGrid({ weekData, onDayClick, cheatDay, onChangeCheatDay }: WeeklyProgressGridProps) {
  const [isCheatDayDialogOpen, setIsCheatDayDialogOpen] = useState(false);

  const shortCheatDayLabel = cheatDay ? cheatDay.slice(0, 2) : null;

  return (
    <section className="rounded-2xl bg-white p-3 shadow-surface">
      <div className="mb-2 flex items-center gap-2">
        <p className="text-sm font-semibold text-stone-800">Huidige week</p>
        {shortCheatDayLabel ? <p className="ml-auto text-[12px] text-stone-500">Cheatdag: {shortCheatDayLabel}</p> : null}
        {cheatDay && onChangeCheatDay ? (
          <button
            type="button"
            aria-label="Cheatdag wijzigen"
            onClick={() => setIsCheatDayDialogOpen(true)}
            className="rounded-md p-1 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
      {cheatDay && onChangeCheatDay ? (
        <Dialog open={isCheatDayDialogOpen} onOpenChange={setIsCheatDayDialogOpen}>
          <DialogContent className="max-w-sm p-4 sm:p-5">
            <DialogHeader>
              <DialogTitle>Kies je cheatdag</DialogTitle>
            </DialogHeader>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {CHEAT_DAY_OPTIONS.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    onChangeCheatDay(day);
                    setIsCheatDayDialogOpen(false);
                  }}
                  className={cn(
                    'rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700 transition-colors',
                    cheatDay === day
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'hover:border-stone-300 hover:bg-stone-50'
                  )}
                >
                  {CHEAT_DAY_LABELS[day]}
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
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
                      : 'bg-stone-200 text-stone-700'
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
                    ? 'bg-stone-100 text-stone-700'
                    : day.isCheatDay
                      ? 'bg-clay-200 text-clay-700'
                      : day.completed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-200 text-stone-700'
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
