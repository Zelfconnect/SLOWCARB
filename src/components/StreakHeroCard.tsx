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
    if (streak > 0) return `${streak} ${streak === 1 ? 'dag' : 'dagen'} on protocol`;
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
    <section className="rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-700 px-4 py-3 text-white shadow-surface">
      <div className="mb-1.5 flex items-center gap-2">
        {getIcon()}
        <span className="font-display text-lg font-semibold leading-tight">
          {getTitle()}
        </span>
      </div>
      <p className="text-sm text-emerald-50/95">{getSubtitle()}</p>
    </section>
  );
}
