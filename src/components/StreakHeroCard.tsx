import { Flame } from 'lucide-react';

interface StreakHeroCardProps {
  streak: number;
  currentWeek: number;
  currentDay: number;
  isCheatDay: boolean;
}

export function StreakHeroCard({ streak, currentWeek, currentDay, isCheatDay }: StreakHeroCardProps) {
  const isNewStart = currentDay <= 0;

  return (
    <div className="rounded-2xl border border-stone-200 bg-gradient-to-br from-sage-600 to-sage-700 p-6 text-white shadow-card">
      <div className="flex items-start gap-3 mb-2">
        {!isCheatDay && <Flame className="w-8 h-8" />}
        {isCheatDay ? (
          <span className="font-display text-3xl leading-tight font-bold">🍕 Cheat Day!</span>
        ) : (
          <span className="font-display text-2xl font-bold leading-tight sm:text-3xl">
            {streak} dagen <span className="block sm:inline">on protocol</span>
          </span>
        )}
      </div>
      {isCheatDay ? (
        <p className="text-sage-100">Week {currentWeek} • Geniet ervan — morgen weer protocol</p>
      ) : (
        <p className="text-sage-100">
          {isNewStart ? 'Net gestart! • Dag 1/84' : `Week ${currentWeek} • Dag ${currentDay}/84`}
        </p>
      )}
    </div>
  );
}
