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
      className="w-full bg-clay-50 rounded-xl p-4 border-2 border-dashed border-clay-300 hover:border-clay-400 transition-colors"
      type="button"
    >
      <div className="flex items-center justify-between">
        <div className="text-left">
          <p className="font-medium text-clay-900">
            Nog {daysUntilCheatDay} {daysUntilCheatDay === 1 ? 'dag' : 'dagen'} tot je cheat day
          </p>
          <p className="text-sm text-clay-600">Waar heb je zin in?</p>
        </div>
        <Pizza className="w-8 h-8 text-clay-500" />
      </div>
    </button>
  );
}
