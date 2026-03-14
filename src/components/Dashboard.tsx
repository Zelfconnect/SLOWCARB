import { useState } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { JourneyCard } from './JourneyCard';
import { DailyMealTracker } from './DailyMealTracker';
import { FysiologieCard } from './FysiologieCard';
import { StreakHeroCard } from './StreakHeroCard';
import { WeeklyProgressGrid } from './WeeklyProgressGrid';
import { WeightProgressCard } from './WeightProgressCard';
import { WelcomeBanner } from './WelcomeBanner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getDaysUntilCheatDay, getWeekData } from '@/hooks/useJourney';
import { getLocalDateString } from '@/lib/localDate';
import { shareText } from '@/lib/share';
import { countCompletedDailyCheckins, shouldShowWeek6ResultCard } from '@/lib/week6Result';
import type { CheatDay, Journey, MealEntry, WeightEntry } from '@/types';
import { useTranslation } from '@/i18n';
import { toast } from 'sonner';

interface DashboardProps {
  userName: string;
  journey: Journey;
  onboardingStartWeight?: number;
  progress: { day: number; week: number; totalDays: number; percentage: number };
  currentTip: { day: number; tip?: { title: string; tips: string[]; metabolicState: string }; weekTip?: { title: string; tips: string[]; warning?: string } } | null;
  isCheatDay: boolean;
  onStartJourney: (date: string, cheatDay: CheatDay, targetWeight?: number) => void;
  onResetJourney: () => void;
  todayMeals: MealEntry;
  streak: number;
  onToggleMeal: (meal: 'breakfast' | 'lunch' | 'dinner') => void;
  mealEntries: MealEntry[];
  weightLog: WeightEntry[];
  onLogWeight: (weight: number, date?: string) => void;
  onToggleMealForDate: (date: string, meal: 'breakfast' | 'lunch' | 'dinner') => void;
  getMealsForDate: (date: string) => MealEntry;
  onChangeCheatDay: (day: CheatDay) => void;
}

export function Dashboard({
  userName,
  journey,
  onboardingStartWeight,
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
  onToggleMealForDate,
  getMealsForDate,
  onChangeCheatDay,
}: DashboardProps) {
  const { t, locale } = useTranslation();
  const today = getLocalDateString();
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [backlogDate, setBacklogDate] = useState<string | null>(null);
  const todayLabel = new Date(`${today}T12:00:00`).toLocaleDateString(
    locale === 'nl' ? 'nl-NL' : 'en-US'
  );

  const sortedWeights = [...weightLog].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const mealCount = mealEntries.reduce((count, entry) => {
    return count + Number(entry.breakfast) + Number(entry.lunch) + Number(entry.dinner);
  }, 0);
  const startWeight = onboardingStartWeight ?? sortedWeights[0]?.weight;
  const latestWeight = sortedWeights[sortedWeights.length - 1]?.weight;
  const completedDailyCheckins = countCompletedDailyCheckins(mealEntries);
  const showWeek6ResultCard = shouldShowWeek6ResultCard(progress.week, completedDailyCheckins);
  const weightDelta = startWeight != null && latestWeight != null
    ? Math.round((startWeight - latestWeight) * 10) / 10
    : null;

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
      <div className="space-y-6">
        <WelcomeBanner
          userName={userName}
          mealCount={mealCount}
          journeyStartDate={journey.startDate ?? ''}
        />

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
  const isEarlyCheatDay = isCheatDay && progress.day >= 1 && progress.day <= 4;
  const appUrl = `${window.location.origin}?app=1`;

  const handleShareCheatday = async () => {
    const nextDate = new Date(`${today}T12:00:00`);
    nextDate.setDate(nextDate.getDate() + Math.max(daysUntilCheatDay, 0));
    const nextCheatDayLabel = nextDate.toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    const outcome = await shareText({
      title: 'Mijn cheatday',
      text: `Mijn cheatday is ${nextCheatDayLabel} 🍕`,
      url: appUrl,
    });

    if (outcome === 'native') return;
    if (outcome === 'clipboard') {
      toast.success('Cheatday tekst gekopieerd');
      return;
    }
    if (outcome === 'unavailable') {
      toast.error('Delen lukt niet op dit apparaat');
    }
  };

  const handleShareWeek6Result = async () => {
    const resultLine = weightDelta == null
      ? `Ik zit in week ${progress.week} met ${completedDailyCheckins} complete check-ins.`
      : weightDelta > 0
        ? `Ik ben ${weightDelta.toFixed(1)} kg kwijt in mijn challenge.`
        : weightDelta < 0
          ? `Mijn gewicht veranderde met +${Math.abs(weightDelta).toFixed(1)} kg tijdens mijn challenge.`
          : 'Mijn gewicht bleef stabiel tijdens mijn challenge.';

    const outcome = await shareText({
      title: 'SlowCarb week 6 resultaat',
      text: `${resultLine} #SlowCarb`,
      url: appUrl,
    });

    if (outcome === 'native') return;
    if (outcome === 'clipboard') {
      toast.success('Resultaattekst gekopieerd');
      return;
    }
    if (outcome === 'unavailable') {
      toast.error('Delen lukt niet op dit apparaat');
    }
  };

  return (
    <div data-testid="dashboard-content" className="space-y-1">
      <WelcomeBanner
        userName={userName}
        mealCount={mealCount}
        journeyStartDate={journey.startDate ?? ''}
      />

      <StreakHeroCard
        streak={streak}
        currentWeek={progress.week}
        currentDay={progress.day}
        isCheatDay={isCheatDay}
      />

      {showWeek6ResultCard ? (
        <section className="mx-2.5 rounded-2xl border border-sage-200 bg-sage-50/70 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-sm font-semibold text-sage-900">Week 6 resultaatkaart</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShareWeek6Result}
              className="h-7 rounded-full border-sage-300 px-2.5 text-[11px] text-sage-800"
            >
              Deel
            </Button>
          </div>
          <p className="mt-1 text-xs text-sage-800">
            Je zit in week {progress.week} met {completedDailyCheckins} complete dagelijkse check-ins.
          </p>
          <p className="mt-1 text-xs text-sage-700">
            {weightDelta == null
              ? 'Log je gewicht om je resultaat sinds start direct te zien.'
              : weightDelta > 0
                ? `${weightDelta.toFixed(1)} kg lichter sinds de start van je challenge.`
                : weightDelta < 0
                  ? `${Math.abs(weightDelta).toFixed(1)} kg zwaarder sinds de start. Blijf je ritme vasthouden.`
                  : 'Je gewicht is stabiel sinds start. Consistentie eerst, resultaat volgt.'}
          </p>
        </section>
      ) : null}

      {isCheatDay ? (
        <div className="mx-2.5 rounded-2xl border border-clay-200 bg-gradient-to-r from-clay-50/90 to-clay-100/80 px-3 py-2.5 shadow-soft">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h3 className="font-display text-base font-semibold text-clay-900">🍕 Cheatday!</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShareCheatday}
              className="h-7 rounded-full border-clay-300 px-2.5 text-[11px] text-clay-800"
            >
              Deel
            </Button>
          </div>
          <p className="text-sm font-medium text-clay-800">Vandaag is je cheatday.</p>
          <p className="mt-1 text-sm text-clay-700">
            {isEarlyCheatDay
              ? `Je eerste cheatday valt vroeg (dag ${progress.day}). Zie dit vooral als ritme-opbouw: geniet bewust en pak morgen direct het protocol weer op.`
              : 'Eet vandaag wat je wilt! Dit reset je hormonen en houdt je mentaal scherp. Geniet ervan en ga morgen weer terug naar het protocol.'}
          </p>
        </div>
      ) : (
        <div className="px-2.5">
          <DailyMealTracker
            todayMeals={todayMeals}
            streak={streak}
            onToggleMeal={onToggleMeal}
            isCheatDay={isCheatDay}
          />
        </div>
      )}

      {perfectWeek && (
        <div className="mx-2.5 rounded-xl bg-sage-100 border border-sage-300 px-2.5 py-1.5 text-sage-800 text-[11px] font-medium">
          🎉 Perfecte week! 6/6 protocoldagen voltooid.
        </div>
      )}

      <div className="px-2.5">
        <FysiologieCard currentTip={currentTip} progress={progress} isCheatDay={isCheatDay} />
      </div>

      <div className="px-2.5">
        <WeeklyProgressGrid
          weekData={weekData}
          onDayClick={(date) => setBacklogDate(date)}
          cheatDay={journey.cheatDay}
          onChangeCheatDay={onChangeCheatDay}
        />
      </div>

      {!isCheatDay && daysUntilCheatDay > 0 ? (
        <div className="flex items-center justify-between gap-3 px-3">
          <p className="text-[10px] text-clay-700">
            Nog {daysUntilCheatDay} {daysUntilCheatDay === 1 ? 'dag' : 'dagen'} tot je cheatday.
          </p>
          <button
            type="button"
            onClick={handleShareCheatday}
            className="text-[10px] font-medium text-clay-700 underline underline-offset-2"
          >
            Deel
          </button>
        </div>
      ) : null}

      <div className="px-2.5">
        <WeightProgressCard
          weightLog={weightLog}
          startWeight={startWeight}
          currentWeight={latestWeight}
          targetWeight={journey.targetWeight}
          onOpenLog={openWeightDialog}
        />
      </div>

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

      <BacklogLogDialog
        date={backlogDate}
        onClose={() => setBacklogDate(null)}
        getMealsForDate={getMealsForDate}
        onToggleMealForDate={onToggleMealForDate}
      />
    </div>
  );
}

function BacklogLogDialog({
  date,
  onClose,
  getMealsForDate,
  onToggleMealForDate,
}: {
  date: string | null;
  onClose: () => void;
  getMealsForDate: (date: string) => MealEntry;
  onToggleMealForDate: (date: string, meal: 'breakfast' | 'lunch' | 'dinner') => void;
}) {
  if (!date) return null;

  const meals = getMealsForDate(date);
  const dateObj = new Date(`${date}T12:00:00`);
  const dateLabel = format(dateObj, 'EEEE d MMMM', { locale: nl });
  const allChecked = meals.breakfast && meals.lunch && meals.dinner;

  const handleMarkAll = () => {
    if (!meals.breakfast) onToggleMealForDate(date, 'breakfast');
    if (!meals.lunch) onToggleMealForDate(date, 'lunch');
    if (!meals.dinner) onToggleMealForDate(date, 'dinner');
  };

  const mealItems: { key: 'breakfast' | 'lunch' | 'dinner'; label: string }[] = [
    { key: 'breakfast', label: 'Ontbijt' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Diner' },
  ];

  return (
    <Dialog open={!!date} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-sm rounded-2xl border border-stone-200 p-6 shadow-elevated [&>[data-slot=dialog-close]]:right-5 [&>[data-slot=dialog-close]]:top-5">
        <div className="space-y-4">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="font-display tracking-tight capitalize">{dateLabel}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {mealItems.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => onToggleMealForDate(date, key)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium text-stone-800 transition-colors ${
                  meals[key]
                    ? 'border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50/70'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span>{label}</span>
                <span className={meals[key] ? 'text-emerald-500' : 'text-stone-300'}>
                  {meals[key] ? '✓' : '○'}
                </span>
              </button>
            ))}
          </div>
          {!allChecked && (
            <Button type="button" className="mt-6 w-full" onClick={handleMarkAll}>
              Protocol Voltooid
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
