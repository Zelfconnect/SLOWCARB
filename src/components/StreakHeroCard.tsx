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
    <div className="bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl p-6 text-white">
      <div className="flex items-center gap-3 mb-2">
        {!isCheatDay && <Flame className="w-8 h-8" />}
        <span className="text-3xl font-bold">
          {isCheatDay ? '🍕 Cheat Day!' : `${streak} dagen on protocol`}
        </span>
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
