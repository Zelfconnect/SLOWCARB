import { useMemo } from 'react';
import { CalendarCheck2 } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Calendar as DayCalendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CHEAT_DAY_TO_JS_DAY_INDEX } from '@/lib/cheatDay';
import { getLocalDateString } from '@/lib/localDate';
import type { CheatDay, MealEntry } from '@/types';

interface MealHistorySectionProps {
  journeyStartDate: string | null;
  cheatDay: CheatDay;
  mealEntries: MealEntry[];
  selectedDate: string;
  selectedMeals: MealEntry;
  onSelectDate: (date: string) => void;
  onToggleMealForDate: (date: string, meal: 'breakfast' | 'lunch' | 'dinner') => void;
  onMarkDayCompliant: (date: string) => void;
}

const parseLocalDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

const isCompliant = (entry?: MealEntry) => Boolean(entry?.breakfast && entry?.lunch && entry?.dinner);

export function MealHistorySection({
  journeyStartDate,
  cheatDay,
  mealEntries,
  selectedDate,
  selectedMeals,
  onSelectDate,
  onToggleMealForDate,
  onMarkDayCompliant,
}: MealHistorySectionProps) {
  const today = getLocalDateString();
  const selectedDateObj = parseLocalDate(selectedDate);
  const selectedDateLabel = format(selectedDateObj, 'EEEE d MMMM', { locale: nl });
  const startDateObj = journeyStartDate ? parseLocalDate(journeyStartDate) : null;
  const cheatDayIndex = CHEAT_DAY_TO_JS_DAY_INDEX[cheatDay];

  const entryMap = useMemo(
    () => new Map(mealEntries.map((entry) => [entry.date, entry])),
    [mealEntries]
  );

  const compliantDates = useMemo(
    () =>
      mealEntries
        .filter((entry) => isCompliant(entry))
        .map((entry) => parseLocalDate(entry.date)),
    [mealEntries]
  );

  const missedDates = useMemo(() => {
    if (!journeyStartDate) return [];

    const missed: Date[] = [];
    const cursor = parseLocalDate(journeyStartDate);
    const todayDate = parseLocalDate(today);

    while (cursor.getTime() < todayDate.getTime()) {
      const dateStr = getLocalDateString(cursor);
      const isCheat = cursor.getDay() === cheatDayIndex;
      const hasCompliantEntry = isCompliant(entryMap.get(dateStr));
      if (!isCheat && !hasCompliantEntry) {
        missed.push(new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    return missed;
  }, [journeyStartDate, today, cheatDayIndex, entryMap]);

  const isBeforeJourney = startDateObj ? selectedDateObj.getTime() < startDateObj.getTime() : false;
  const isFuture = selectedDateObj.getTime() > parseLocalDate(today).getTime();
  const isSelectedCheatDay = selectedDateObj.getDay() === cheatDayIndex;
  const isSelectedCompliant = isCompliant(selectedMeals);
  const selectedCanBeUpdated = !isBeforeJourney && !isFuture && !isSelectedCheatDay;

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-3 shadow-surface">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-1.5 font-display text-base font-semibold text-stone-900">
            <CalendarCheck2 className="h-4 w-4 text-emerald-600" />
            Geschiedenis
          </h3>
          <p className="text-[11px] text-stone-500">Kies een eerdere dag en herstel gemiste protocoldagen.</p>
        </div>
      </div>

      <div className="rounded-xl border border-stone-100 bg-stone-50/70 p-1.5">
        <DayCalendar
          mode="single"
          selected={selectedDateObj}
          onSelect={(date) => {
            if (!date) return;
            onSelectDate(getLocalDateString(date));
          }}
          disabled={(date) => {
            if (startDateObj && date < startDateObj) return true;
            return date > parseLocalDate(today);
          }}
          modifiers={{
            compliant: compliantDates,
            missed: missedDates,
            cheat: (date: Date) => date.getDay() === cheatDayIndex,
          }}
          modifiersClassNames={{
            compliant: 'bg-emerald-100 text-emerald-800 font-semibold',
            missed: 'bg-rose-100 text-rose-800 font-semibold',
            cheat: 'text-clay-700',
          }}
          className="w-full p-1"
        />
      </div>

      <div className="mt-2 space-y-2">
        <div>
          <p className="text-sm font-medium text-stone-900 capitalize">{selectedDateLabel}</p>
          {isBeforeJourney ? <p className="text-xs text-stone-500">Voor de startdatum van je traject.</p> : null}
          {isFuture ? <p className="text-xs text-stone-500">Toekomstige dagen kun je nog niet loggen.</p> : null}
          {isSelectedCheatDay ? <p className="text-xs text-clay-700">Cheat day: telt niet mee voor je streak.</p> : null}
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <Button
            type="button"
            size="sm"
            variant={selectedMeals.breakfast ? 'default' : 'outline'}
            disabled={!selectedCanBeUpdated}
            onClick={() => onToggleMealForDate(selectedDate, 'breakfast')}
          >
            Ontbijt
          </Button>
          <Button
            type="button"
            size="sm"
            variant={selectedMeals.lunch ? 'default' : 'outline'}
            disabled={!selectedCanBeUpdated}
            onClick={() => onToggleMealForDate(selectedDate, 'lunch')}
          >
            Lunch
          </Button>
          <Button
            type="button"
            size="sm"
            variant={selectedMeals.dinner ? 'default' : 'outline'}
            disabled={!selectedCanBeUpdated}
            onClick={() => onToggleMealForDate(selectedDate, 'dinner')}
          >
            Avond
          </Button>
        </div>

        <Button
          type="button"
          className={cn('w-full', isSelectedCompliant && 'bg-emerald-700 hover:bg-emerald-700')}
          disabled={!selectedCanBeUpdated}
          onClick={() => onMarkDayCompliant(selectedDate)}
        >
          {isSelectedCompliant ? 'Dag is compliant' : 'Markeer als compliant (3/3)'}
        </Button>
      </div>
    </section>
  );
}
