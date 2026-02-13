import { useState, useEffect } from 'react';
import { BookOpen, Calendar, ChevronRight, FlaskConical, Info, Lightbulb, PartyPopper, Rocket, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DailyMealTracker } from './DailyMealTracker';
import { Card } from '@/components/primitives/Card';
import type { MealEntry } from '@/types';

interface JourneyCardProps {
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

export function JourneyCard({ journey, progress, currentTip, isCheatDay, onStartJourney, onResetJourney, todayMeals, streak, onToggleMeal }: JourneyCardProps) {
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [cheatDay, setCheatDay] = useState<'zaterdag' | 'zondag'>('zaterdag');
  const [targetWeight, setTargetWeight] = useState('');

  // Body scroll lock voor tip dialog
  useEffect(() => {
    if (showTipDialog) {
      document.body.classList.add('card-expanded');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('card-expanded');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('card-expanded');
      document.body.style.overflow = '';
    };
  }, [showTipDialog]);

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
            className="w-full bg-white text-primary-700 hover:bg-primary-50 h-12 rounded-lg font-medium"
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
          <DialogContent className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm max-h-[90vh] overflow-y-auto dark:border-gray-800 dark:bg-gray-900 leading-relaxed">
            <DialogHeader className="text-left gap-3">
              <DialogTitle className="text-2xl font-['Geist'] font-bold tracking-tight text-gray-950 dark:text-gray-100">
                Start je Slow-Carb Journey
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-1 text-base text-gray-600 dark:text-gray-400">
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3">
                <div>
                  <Label htmlFor="start-date" className="text-sm font-medium text-gray-500 uppercase tracking-wide">Start datum</Label>
                  <div className="relative mt-2">
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-11 rounded-xl border border-gray-200 bg-white px-4 pr-10 text-base text-gray-600 placeholder:text-gray-400 appearance-none focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                    />
                    <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cheat-day" className="text-sm font-medium text-gray-500 uppercase tracking-wide">Cheat day</Label>
                  <Select value={cheatDay} onValueChange={(v) => setCheatDay(v as 'zaterdag' | 'zondag')}>
                    <SelectTrigger className="mt-2 h-11 rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-600 focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                      <SelectItem value="zaterdag" className="rounded-lg text-gray-700 focus:bg-gray-100 dark:text-gray-100 dark:focus:bg-gray-800">Zaterdag</SelectItem>
                      <SelectItem value="zondag" className="rounded-lg text-gray-700 focus:bg-gray-100 dark:text-gray-100 dark:focus:bg-gray-800">Zondag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="opacity-90">
                <Label htmlFor="target-weight" className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Streefgewicht <span className="normal-case font-normal text-gray-400">(optioneel)</span>
                </Label>
                <Input
                  id="target-weight"
                  type="number"
                  placeholder="85"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  className="mt-2 h-11 rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-transparent dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                />
              </div>
              <Button
                onClick={handleStart}
                className="w-full h-11 rounded-xl bg-gray-900 text-white hover:bg-gray-800 active:scale-95 transition-all dark:bg-white dark:text-gray-950 dark:hover:bg-gray-100"
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
              <h3 className="font-semibold text-xl text-white">
                {isCheatDay ? 'Cheat Day!' : `Dag ${progress.day} van 84`}
              </h3>
              <p className="text-sm text-white/80">
                {isCheatDay ? 'Geniet ervan!' : `Week ${progress.week} van 12`}
              </p>
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
            className="w-full bg-white/10 rounded-xl p-4 text-left hover:bg-white/20 transition-all group"
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

      {/* Tip Dialog */}
      {showTipDialog && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setShowTipDialog(false)}
          />
          
          {/* Modal Container */}
          <div 
            className="fixed inset-x-4 top-16 bottom-24 z-50"
            style={{ maxHeight: 'calc(100vh - 160px)' }}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col">
              {/* Header */}
              <div className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-4xl">
                      <Lightbulb className="w-8 h-8 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-white leading-tight">
                        {currentTip?.tip?.title}
                      </h2>
                      <p className="text-sm text-white/80 mt-1">
                        Dag {currentTip?.day} van je journey
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTipDialog(false)}
                    className="w-11 h-11 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-all flex items-center justify-center flex-shrink-0"
                    aria-label="Sluiten"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Tips voor vandaag */}
                <div>
                  <h3 className="font-semibold text-warm-800 text-lg mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                    Tips voor vandaag
                  </h3>
                  <ul className="space-y-3">
                    {currentTip?.tip?.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-warm-700">
                        <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Warning */}
                {currentTip?.weekTip?.warning && (
                  <div className="bg-accent-50 rounded-xl p-5 border border-accent-100">
                    <h3 className="font-semibold text-accent-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Let op
                    </h3>
                    <p className="text-accent-800 text-sm leading-relaxed">
                      {currentTip.weekTip.warning}
                    </p>
                  </div>
                )}
                
                {/* Metabole staat */}
                <div className="bg-primary-50 rounded-xl p-5 border border-primary-100">
                  <h3 className="font-semibold text-primary-900 mb-3 flex items-center gap-2">
                    <FlaskConical className="w-5 h-5" />
                    Metabole staat
                  </h3>
                  <p className="text-primary-800 text-sm leading-relaxed">
                    {currentTip?.tip?.metabolicState}
                  </p>
                </div>

                {/* Week tips */}
                {currentTip?.weekTip && (
                  <div>
                    <h3 className="font-semibold text-warm-800 text-lg mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                      {currentTip.weekTip.title}
                    </h3>
                    <ul className="space-y-3">
                      {currentTip.weekTip.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-warm-700 text-sm">
                          <span className="w-2 h-2 rounded-full bg-primary-400 mt-2 flex-shrink-0" />
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="h-4" />
              </div>

              {/* Scroll indicator gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-2xl" />
            </div>
          </div>
        </>
      )}
    </>
  );
}
