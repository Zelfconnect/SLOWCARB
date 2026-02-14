import { Trophy } from 'lucide-react';
import { JourneyCard } from './JourneyCard';
import { DailyMealTracker } from './DailyMealTracker';
import { StreakHeroCard } from './StreakHeroCard';
import { WeeklyProgressGrid } from './WeeklyProgressGrid';
import { CheatDayCountdown } from './CheatDayCountdown';
import { WeightProgressCard } from './WeightProgressCard';
import { QuickActionFAB } from './QuickActionFAB';
import { getDaysUntilCheatDay, getWeekData } from '@/hooks/useJourney';
import type { Journey, MealEntry, WeightEntry } from '@/types';

interface DashboardProps {
  journey: Journey;
  progress: { day: number; week: number; totalDays: number; percentage: number };
  currentTip: { day: number; tip?: { title: string; tips: string[]; metabolicState: string }; weekTip?: { title: string; tips: string[]; warning?: string } } | null;
  isCheatDay: boolean;
  onStartJourney: (date: string, cheatDay: 'zaterdag' | 'zondag', targetWeight?: number) => void;
  onResetJourney: () => void;
  todayMeals: MealEntry;
  streak: number;
  onToggleMeal: (meal: 'breakfast' | 'lunch' | 'dinner') => void;
  mealEntries: MealEntry[];
  weightLog: WeightEntry[];
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
  mealEntries,
  weightLog,
}: DashboardProps) {
  if (!journey.startDate) {
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
        <QuickActionFAB />
      </div>
    );
  }

  const weekData = getWeekData(journey, mealEntries);
  const daysUntilCheatDay = getDaysUntilCheatDay(journey);
  const hasFutureDays = weekData.some(day => day.isFuture);
  const perfectWeek = !hasFutureDays && weekData.every(day => day.isCheatDay || day.completed);

  const sortedWeights = [...weightLog].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const startWeight = sortedWeights[0]?.weight;
  const latestWeight = sortedWeights[sortedWeights.length - 1]?.weight;

  return (
    <div className="space-y-4 pb-24">
      <StreakHeroCard
        streak={streak}
        currentWeek={progress.week}
        currentDay={progress.day}
        isCheatDay={isCheatDay}
      />

      <WeeklyProgressGrid weekData={weekData} />

      {perfectWeek && (
        <div className="bg-gradient-to-br from-sage-400 to-sage-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6" />
            <div>
              <p className="font-bold">Perfect week!</p>
              <p className="text-sm text-sage-100">6 dagen protocol + cheat day</p>
            </div>
          </div>
        </div>
      )}

      {isCheatDay ? (
        <div className="bg-clay-50 rounded-xl p-6 border border-clay-200">
          <h3 className="text-lg font-bold text-clay-900 mb-2">🍕 Cheat Day!</h3>
          <p className="text-clay-700">
            Eet vandaag wat je wilt! Dit reset je hormonen en houdt je mentaal scherp.
            Geniet ervan en ga morgen weer terug naar het protocol.
          </p>
        </div>
      ) : (
        <>
          <DailyMealTracker
            todayMeals={todayMeals}
            streak={streak}
            onToggleMeal={onToggleMeal}
            isCheatDay={isCheatDay}
          />

          <CheatDayCountdown daysUntilCheatDay={daysUntilCheatDay} />
        </>
      )}

      <WeightProgressCard
        weightLog={weightLog}
        startWeight={startWeight}
        currentWeight={latestWeight}
      />
      <QuickActionFAB />
    </div>
  );
}
