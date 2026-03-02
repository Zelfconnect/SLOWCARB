import { useState } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { CalendarIcon, ChevronRight, Info, PartyPopper, Rocket, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DailyMealTracker } from './DailyMealTracker';
import { TipDialog } from './TipDialog';
import { Card } from '@/components/primitives/Card';
import { CHEAT_DAY_LABELS, CHEAT_DAY_OPTIONS } from '@/lib/cheatDay';
import { getLocalDateString } from '@/lib/localDate';
import { getCurrentPhase } from '@/data/journey';
import type { CheatDay, MealEntry } from '@/types';

interface JourneyCardProps {
  journey: { startDate: string | null; targetWeight?: number; cheatDay: CheatDay };
  progress: { day: number; week: number; totalDays: number; percentage: number };
  currentTip: { day: number; tip?: { title: string; tips: string[]; metabolicState: string }; weekTip?: { title: string; tips: string[]; warning?: string } } | null;
  isCheatDay: boolean;
  onStartJourney: (date: string, cheatDay: CheatDay, targetWeight?: number) => void;
  onResetJourney: () => void;
  todayMeals: MealEntry;
  streak: number;
  onToggleMeal: (meal: 'breakfast' | 'lunch' | 'dinner') => void;
}

export function JourneyCard({ journey, progress, currentTip, isCheatDay, onStartJourney, onResetJourney, todayMeals, streak, onToggleMeal }: JourneyCardProps) {
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [startDate, setStartDate] = useState(getLocalDateString);
  const [cheatDay, setCheatDay] = useState<CheatDay>('zaterdag');
  const [targetWeight, setTargetWeight] = useState('');
  const startDateLabel = new Date(`${startDate}T12:00:00`).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const journeyStartDateLabel = journey.startDate
    ? new Date(`${journey.startDate}T12:00:00`).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    : null;
  const currentPhase = getCurrentPhase(progress.day);

  const handleStart = () => {
    onStartJourney(startDate, cheatDay, targetWeight ? parseFloat(targetWeight) : undefined);
    setShowStartDialog(false);
  };

  if (!journey.startDate) {
    return (
      <>
        {/* Start Journey Card - NEW DESIGN SYSTEM */}
        <Card variant="rule" padding="6" radius="2xl" hasShadow>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <Rocket className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-semibold text-xl text-white">Start je Journey</h3>
              <p className="text-sm text-white/80">Track je 12-weekse transformatie</p>
            </div>
          </div>
          <Button 
            onClick={() => setShowStartDialog(true)} 
            className="h-12 w-full rounded-xl border border-stone-200 bg-white font-medium text-sage-700 hover:bg-stone-50"
          >
            Start Nu
          </Button>
        </Card>

        <Dialog open={showStartDialog} onOpenChange={(open) => {
          setShowStartDialog(open);
          if (open) {
            document.body.style.overflow = 'hidden';
          } else {
            document.body.style.overflow = '';
          }
        }}>
          <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-2xl border border-stone-100 bg-white p-6 leading-relaxed shadow-soft">
            <DialogHeader className="text-left gap-3">
              <DialogTitle className="font-display text-2xl font-bold tracking-tight text-stone-800">
                Start je Slow-Carb Journey
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-1 text-base text-stone-600">
              <div className="space-y-3 rounded-xl border border-stone-200 p-4">
                <div>
                  <Label htmlFor="start-date" className="text-sm font-medium uppercase tracking-wide text-stone-500">Start datum</Label>
                  <Button
                    id="start-date"
                    type="button"
                    variant="outline"
                    onClick={() => setShowStartDateCalendar((v) => !v)}
                    className="mt-2 h-11 w-full justify-between rounded-xl border-stone-200 bg-white px-4 text-left text-base font-normal text-stone-600 hover:bg-white"
                  >
                    <span>{startDateLabel}</span>
                    <CalendarIcon className={`h-4 w-4 text-stone-400 transition-transform ${showStartDateCalendar ? 'rotate-180' : ''}`} />
                  </Button>
                  {showStartDateCalendar && (
                    <div data-testid="journey-calendar-wrapper" className="mt-3 min-w-[17.5rem] w-fit rounded-xl border border-stone-200 bg-stone-50/80 p-3 [--cell-size:2.5rem]">
                      <Calendar
                        mode="single"
                        locale={nl}
                        classNames={{
                          day: 'min-w-[var(--cell-size)] shrink-0',
                          weekday: 'min-w-[var(--cell-size)] shrink-0',
                        }}
                        selected={new Date(`${startDate}T12:00:00`)}
                        defaultMonth={(() => {
                          const d = new Date(`${startDate}T12:00:00`);
                          const today = new Date();
                          return d > today ? today : d;
                        })()}
                        onSelect={(selectedDate) => {
                          if (!selectedDate) return;
                          setStartDate(format(selectedDate, 'yyyy-MM-dd'));
                          setShowStartDateCalendar(false);
                        }}
                        disabled={{ after: new Date() }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="cheat-day" className="text-sm font-medium uppercase tracking-wide text-stone-500">Cheat day</Label>
                  <Select value={cheatDay} onValueChange={(value) => setCheatDay(value as CheatDay)}>
                    <SelectTrigger className="mt-2 h-11 rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-600 focus:border-transparent focus:ring-2 focus:ring-sage-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-stone-200 bg-white shadow-soft">
                      {CHEAT_DAY_OPTIONS.map((day) => (
                        <SelectItem key={day} value={day} className="rounded-lg text-stone-700 focus:bg-stone-100">
                          {CHEAT_DAY_LABELS[day]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="opacity-90">
                <Label htmlFor="target-weight" className="text-sm font-medium uppercase tracking-wide text-stone-500">
                  Streefgewicht <span className="normal-case font-normal text-stone-400">(optioneel)</span>
                </Label>
                <Input
                  id="target-weight"
                  type="number"
                  placeholder="85"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="mt-2 h-11 rounded-xl border border-stone-200 bg-white px-4 text-base text-stone-600 placeholder:text-stone-400 focus:border-transparent focus:ring-2 focus:ring-sage-300"
                />
              </div>
              <Button
                onClick={handleStart}
                className="h-11 w-full rounded-xl bg-sage-600 text-white transition-all hover:bg-sage-700 active:scale-95"
              >
                Start Journey
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      {/* Main Journey Card - NEW DESIGN SYSTEM */}
      <Card
        variant={isCheatDay ? 'concept' : 'rule'} 
        padding="6" 
        radius="2xl" 
        hasShadow
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              {isCheatDay ? <PartyPopper className="w-7 h-7" /> : <Rocket className="w-7 h-7" />}
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-white">
                {isCheatDay ? 'Cheat Day!' : `Kalenderdag ${progress.day}`}
              </h3>
              <p className="text-sm text-white/80">
                {isCheatDay ? 'Geniet ervan!' : `Week ${progress.week} van 12`}
              </p>
              {currentPhase?.title ? (
                <span
                  data-testid="journey-phase-badge"
                  className="mt-1 inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white"
                >
                  Fase: {currentPhase.title}
                </span>
              ) : null}
              {journeyStartDateLabel ? (
                <p className="mt-0.5 text-xs text-white/70">Gestart op {journeyStartDateLabel}</p>
              ) : null}
            </div>
          </div>
          <button 
            onClick={() => onResetJourney()} 
            className="p-2.5 rounded-lg hover:bg-white/20 transition-colors" 
            title="Reset journey"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {!isCheatDay && (
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs text-white/70 mb-2">
              <span>12-weekse transformatie</span>
              <span>{progress.percentage.toFixed(0)}% compleet</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${progress.percentage}%` }} 
              />
            </div>
          </div>
        )}

        {currentTip?.tip && !isCheatDay && (
          <button 
            onClick={() => setShowTipDialog(true)} 
            className="group w-full rounded-xl bg-white/10 p-4 text-left transition-all hover:bg-white/20"
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{currentTip.tip.title}</p>
                <p className="text-sm text-white/80 line-clamp-2 mt-1">{currentTip.tip.tips[0]}</p>
              </div>
              <ChevronRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        )}

        {isCheatDay && (
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm leading-relaxed">
              Eet vandaag wat je wilt! Dit reset je hormonen en houdt je mentaal scherp. 
              Geniet ervan en ga morgen weer terug naar het protocol.
            </p>
          </div>
        )}
      </Card>

      {/* Daily Meal Tracker */}
      {journey.startDate && (
        <Card padding="6" radius="lg" hasShadow>
          <DailyMealTracker 
            todayMeals={todayMeals}
            streak={streak}
            onToggleMeal={onToggleMeal}
            isCheatDay={isCheatDay}
          />
        </Card>
      )}

      <TipDialog
        open={showTipDialog}
        onOpenChange={setShowTipDialog}
        currentTip={currentTip}
        progress={progress}
      />
    </>
  );
}
