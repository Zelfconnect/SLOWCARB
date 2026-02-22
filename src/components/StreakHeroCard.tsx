import { Flame, Zap } from 'lucide-react';

interface StreakHeroCardProps {
  streak: number;
  currentWeek: number;
  currentDay: number;
  isCheatDay: boolean;
}

export function StreakHeroCard({ streak, currentWeek, currentDay, isCheatDay }: StreakHeroCardProps) {
  const isNewStart = currentDay <= 0;

  const getTitle = () => {
    if (isCheatDay) return '🍕 Cheat Day!';
    if (streak > 0) return `${streak} dagen on protocol`;
    if (isNewStart) return 'Klaar voor dag 1?';
    return `Week ${currentWeek} gestart`;
  };

  const getSubtitle = () => {
    if (isCheatDay) return `Week ${currentWeek} • Geniet ervan, morgen weer protocol`;
    if (isNewStart) return 'Net gestart! • Dag 1/84';
    if (currentDay > 0 && currentDay % 7 === 1) {
      return `Week ${currentWeek} gestart • Nieuwe week, nieuw begin`;
    }
    if (streak === 0) return `Dag ${currentDay}/84 • Log je maaltijden voor je streak`;
    return `Week ${currentWeek} • Dag ${currentDay}/84`;
  };

  const getIcon = () => {
    if (isCheatDay) return null;
    if (streak >= 7) return <Flame className="w-8 h-8" />;
    return <Zap className="w-7 h-7 opacity-80" />;
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-gradient-to-br from-sage-600 to-sage-700 p-6 text-white shadow-card">
      <div className="flex items-start gap-3 mb-2">
        {getIcon()}
        <span className="font-display text-2xl font-bold leading-tight sm:text-3xl">
          {getTitle()}
        </span>
      </div>
      <p className="text-sage-100">{getSubtitle()}</p>
    </div>
  );
}
