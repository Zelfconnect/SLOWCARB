import { Pizza } from 'lucide-react';

interface CheatDayCountdownProps {
  daysUntilCheatDay: number;
  onPlanMeal?: () => void;
}

export function CheatDayCountdown({ daysUntilCheatDay, onPlanMeal }: CheatDayCountdownProps) {
  if (daysUntilCheatDay > 3 || daysUntilCheatDay <= 0) return null;

  return (
    <button
      onClick={onPlanMeal}
      className="w-full overflow-hidden rounded-2xl border border-dashed border-clay-300 bg-gradient-to-r from-clay-50 to-clay-100/40 p-5 shadow-soft transition-colors hover:border-clay-500"
      type="button"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 text-left">
          <p className="font-semibold text-clay-900 break-words">
            Nog {daysUntilCheatDay} {daysUntilCheatDay === 1 ? 'dag' : 'dagen'} tot je cheat day
          </p>
          <p className="text-sm text-clay-700 break-words">Waar heb je zin in?</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-clay-100 border border-clay-200 flex items-center justify-center flex-shrink-0">
          <Pizza className="w-5 h-5 text-clay-600" />
        </div>
      </div>
    </button>
  );
}
