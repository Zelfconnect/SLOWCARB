import { useMemo, useRef, useState } from 'react';
import { Trophy } from 'lucide-react';
import { JourneyCard } from './JourneyCard';
import { DailyMealTracker } from './DailyMealTracker';
import { StreakHeroCard } from './StreakHeroCard';
import { WeeklyProgressGrid } from './WeeklyProgressGrid';
import { CheatDayCountdown } from './CheatDayCountdown';
import { WeightProgressCard } from './WeightProgressCard';
import { QuickActionFAB } from './QuickActionFAB';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
  onLogWeight: (weight: number, date?: string) => void;
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
  onLogWeight,
}: DashboardProps) {
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const mealTrackerRef = useRef<HTMLDivElement | null>(null);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayLabel = useMemo(
    () => new Date(today).toLocaleDateString('nl-NL'),
    [today]
  );

  const sortedWeights = [...weightLog].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const startWeight = sortedWeights[0]?.weight;
  const latestWeight = sortedWeights[sortedWeights.length - 1]?.weight;

  const openWeightDialog = () => {
    const prefilledWeight = latestWeight ?? journey.targetWeight;
    setWeightInput(prefilledWeight ? prefilledWeight.toFixed(1) : '');
    setWeightDialogOpen(true);
  };

  const handleMealAction = () => {
    mealTrackerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSaveWeight = () => {
    const parsed = Number.parseFloat(weightInput);
    if (!Number.isFinite(parsed) || parsed < 40 || parsed > 200) {
      return;
    }

    onLogWeight(Math.round(parsed * 10) / 10, today);
    setWeightDialogOpen(false);
  };

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
        <QuickActionFAB onLogWeight={openWeightDialog} />

        <Dialog open={weightDialogOpen} onOpenChange={setWeightDialogOpen}>
          <DialogContent className="max-w-sm rounded-2xl p-0">
            <div className="p-6 space-y-4">
              <DialogHeader className="space-y-1 text-left">
                <DialogTitle>Log je gewicht</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700" htmlFor="weight-input-start">
                  Gewicht (kg)
                </label>
                <Input
                  id="weight-input-start"
                  type="number"
                  min={40}
                  max={200}
                  step={0.1}
                  value={weightInput}
                  onChange={(event) => setWeightInput(event.target.value)}
                  placeholder="Bijv. 82.5"
                />
              </div>
              <p className="text-sm text-stone-600">Datum: {todayLabel}</p>
              <Button type="button" className="w-full" onClick={handleSaveWeight}>
                Opslaan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const weekData = getWeekData(journey, mealEntries);
  const daysUntilCheatDay = getDaysUntilCheatDay(journey);
  const hasFutureDays = weekData.some(day => day.isFuture);
  const perfectWeek = !hasFutureDays && weekData.every(day => day.isCheatDay || day.completed);

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
          <div ref={mealTrackerRef}>
            <DailyMealTracker
              todayMeals={todayMeals}
              streak={streak}
              onToggleMeal={onToggleMeal}
              isCheatDay={isCheatDay}
            />
          </div>

          <CheatDayCountdown daysUntilCheatDay={daysUntilCheatDay} />
        </>
      )}

      <WeightProgressCard
        weightLog={weightLog}
        startWeight={startWeight}
        currentWeight={latestWeight}
        onOpenLog={openWeightDialog}
      />
      <QuickActionFAB onLogWeight={openWeightDialog} onLogMeal={handleMealAction} />

      <Dialog open={weightDialogOpen} onOpenChange={setWeightDialogOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-0">
          <div className="p-6 space-y-4">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle>Log je gewicht</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700" htmlFor="weight-input">
                Gewicht (kg)
              </label>
              <Input
                id="weight-input"
                type="number"
                min={40}
                max={200}
                step={0.1}
                value={weightInput}
                onChange={(event) => setWeightInput(event.target.value)}
                placeholder="Bijv. 82.5"
              />
            </div>
            <p className="text-sm text-stone-600">Datum: {todayLabel}</p>
            <Button type="button" className="w-full" onClick={handleSaveWeight}>
              Opslaan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
