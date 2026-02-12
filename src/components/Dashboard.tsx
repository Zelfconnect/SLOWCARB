import { JourneyCard } from './JourneyCard';
import type { MealEntry } from '@/types';

interface DashboardProps {
  journey: { startDate: string | null; targetWeight?: number; cheatDay: 'zaterdag' | 'zondag' };
  progress: { day: number; week: number; totalDays: number; percentage: number };
  currentTip: { day: number; tip?: { title: string; tips: string[]; metabolicState: string }; weekTip?: { title: string; tips: string[]; warning?: string } } | null;
  isCheatDay: boolean;
  onStartJourney: (date: string, cheatDay: 'zaterdag' | 'zondag', targetWeight?: number) => void;
  onResetJourney: () => void;
  todayMeals: MealEntry;
  streak: number;
  onToggleMeal: (meal: 'breakfast' | 'lunch' | 'dinner') => void;
}

export function Dashboard({
  journey,
  progress,
  currentTip,
  isCheatDay,
  onStartJourney,
  onResetJourney,
  todayMeals,
  streak,
  onToggleMeal,
}: DashboardProps) {
  return (
    <div className="space-y-6 pb-24">
      <JourneyCard
        journey={journey}
        progress={progress}
        currentTip={currentTip}
        isCheatDay={isCheatDay}
        onStartJourney={onStartJourney}
        onResetJourney={onResetJourney}
        todayMeals={todayMeals}
        streak={streak}
        onToggleMeal={onToggleMeal}
      />
    </div>
  );
}
