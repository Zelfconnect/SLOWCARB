import { useMemo, useState, useRef, useEffect } from 'react';
import { JourneyCard } from './JourneyCard';
import { DailyMealTracker } from './DailyMealTracker';
import { StreakHeroCard } from './StreakHeroCard';
import { WeeklyProgressGrid } from './WeeklyProgressGrid';
import { WeightProgressCard } from './WeightProgressCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getDaysUntilCheatDay, getWeekData } from '@/hooks/useJourney';
import type { Journey, MealEntry, WeightEntry } from '@/types';
import { useTranslation } from '@/i18n';

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
  const { t, locale } = useTranslation();
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayLabel = useMemo(
    () => new Date(today).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US'),
    [today, locale]
  );

  const sortedWeights = [...weightLog].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const startWeight = sortedWeights[0]?.weight;
  const latestWeight = sortedWeights[sortedWeights.length - 1]?.weight;

  const openWeightDialog = () => {
    setWeightInput('');
    setWeightDialogOpen(true);
  };

  const handleWeightDialogOpenChange = (open: boolean) => {
    if (open) {
      setWeightInput('');
    }
    setWeightDialogOpen(open);
  };

  const handleSaveWeight = () => {
    const parsed = Number.parseFloat(weightInput);
    if (!Number.isFinite(parsed) || parsed < 40 || parsed > 200) {
      return;
    }

    onLogWeight(Math.round(parsed * 10) / 10, today);
    setWeightInput('');
    setWeightDialogOpen(false);
  };

  if (!journey.startDate) {
    return (
      <div className="space-y-6 overflow-hidden">
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

        <Dialog open={weightDialogOpen} onOpenChange={handleWeightDialogOpenChange}>
          <DialogContent className="max-w-sm rounded-2xl border border-stone-200 p-0 shadow-elevated">
            <div className="p-6 space-y-4">
              <DialogHeader className="space-y-1 text-left">
                <DialogTitle className="font-display">Log je gewicht</DialogTitle>
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
                  placeholder={String(t('app.weightPlaceholder'))}
                  className="input-premium"
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

  const contentWrapperRef = useRef<HTMLDivElement | null>(null);
  // #region agent log
  useEffect(() => {
    const el = contentWrapperRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const nav = document.querySelector('nav.fixed.bottom-0');
      const navTop = nav?.getBoundingClientRect().top ?? viewportHeight;
      const payload = {
        sessionId: '3bc562',
        hypothesisId: 'H2',
        location: 'Dashboard.tsx:contentWrapper',
        message: 'Dashboard content wrapper overflow and card position',
        data: {
          wrapperClientHeight: el.clientHeight,
          wrapperScrollHeight: el.scrollHeight,
          wrapperRectBottom: rect.bottom,
          viewportHeight,
          navTop,
          contentOverflows: el.scrollHeight > el.clientHeight,
          bottomHidden: rect.bottom > navTop,
        },
        timestamp: Date.now(),
      };
      fetch('http://127.0.0.1:7463/ingest/a0558390-360f-4072-93db-bed8e45837de', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '3bc562' }, body: JSON.stringify(payload) }).catch(() => {});
    });
    return () => cancelAnimationFrame(raf);
  }, [weekData, isCheatDay, perfectWeek, daysUntilCheatDay]);
  // #endregion

  return (
    <div ref={contentWrapperRef} className="h-full space-y-1.5 overflow-hidden pb-0">
      <StreakHeroCard
        streak={streak}
        currentWeek={progress.week}
        currentDay={progress.day}
        isCheatDay={isCheatDay}
      />

      {isCheatDay ? (
        <div className="rounded-2xl border border-clay-200 bg-gradient-to-r from-clay-50/90 to-clay-100/80 px-3 py-2.5 shadow-soft">
          <h3 className="mb-1 font-display text-base font-semibold text-clay-900">🍕 Cheat Day!</h3>
          <p className="text-sm text-clay-700">
            Eet vandaag wat je wilt! Dit reset je hormonen en houdt je mentaal scherp.
            Geniet ervan en ga morgen weer terug naar het protocol.
          </p>
        </div>
      ) : (
        <DailyMealTracker
          todayMeals={todayMeals}
          streak={streak}
          onToggleMeal={onToggleMeal}
          isCheatDay={isCheatDay}
        />
      )}

      {perfectWeek && (
        <div className="rounded-xl bg-sage-100 border border-sage-300 px-2.5 py-1.5 text-sage-800 text-[11px] font-medium">
          🎉 Perfecte week! 6/6 protocoldagen voltooid.
        </div>
      )}

      <WeeklyProgressGrid weekData={weekData} />
      {!isCheatDay && daysUntilCheatDay > 0 && daysUntilCheatDay <= 2 ? (
        <p className="px-0.5 text-[10px] text-clay-700">
          Nog {daysUntilCheatDay} {daysUntilCheatDay === 1 ? 'dag' : 'dagen'} tot je cheat day.
        </p>
      ) : null}

      <WeightProgressCard
        weightLog={weightLog}
        startWeight={startWeight}
        currentWeight={latestWeight}
        targetWeight={journey.targetWeight}
        onOpenLog={openWeightDialog}
      />

      <Dialog open={weightDialogOpen} onOpenChange={handleWeightDialogOpenChange}>
        <DialogContent className="max-w-sm rounded-2xl border border-stone-200 p-0 shadow-elevated">
          <div className="p-6 space-y-4">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="font-display">Log je gewicht</DialogTitle>
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
                placeholder={String(t('app.weightPlaceholder'))}
                className="input-premium"
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
