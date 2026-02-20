import { useState } from 'react';
import { Check, Flame, Trophy, Calendar, ChefHat, Salad, Utensils, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { MealEntry } from '@/types';

interface DailyMealTrackerProps {
  todayMeals: MealEntry;
  streak: number;
  onToggleMeal: (meal: 'breakfast' | 'lunch' | 'dinner') => void;
  isCheatDay: boolean;
}

interface MealCardProps {
  type: 'breakfast' | 'lunch' | 'dinner';
  isCompleted: boolean;
  onToggle: () => void;
  isCheatDay: boolean;
}

const mealFoodIcons = {
  chefhat: ChefHat,
  salad: Salad,
  utensils: Utensils,
} as const;

const dashboardBrandIconContainerClass =
  'border border-sage-300/70 bg-gradient-to-br from-sage-700 via-sage-700 to-sage-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_12px_rgba(47,94,63,0.28)]';
const dashboardBrandIconColorClass = 'text-cream';

const mealConfig: Record<MealCardProps['type'], {
  label: string;
  subtitle: string;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  foodIcon?: keyof typeof mealFoodIcons;
  foodIconLabel?: string;
}> = {
  breakfast: {
    label: 'Ontbijt',
    subtitle: '30g eiwit binnen 30 min',
    gradient: 'from-sage-400 to-sage-600',
    bgGradient: 'from-sage-50 to-sage-100',
    borderColor: 'border-sage-200',
    foodIcon: 'chefhat',
    foodIconLabel: 'Ontbijt',
  },
  lunch: {
    label: 'Lunch',
    subtitle: 'Eiwit + groente + bonen',
    gradient: 'from-sage-400 to-sage-600',
    bgGradient: 'from-sage-50 to-emerald-50',
    borderColor: 'border-sage-200',
    foodIcon: 'salad',
  },
  dinner: {
    label: 'Avondeten',
    subtitle: 'Eiwit + groente + bonen',
    gradient: 'from-clay-500 to-clay-600',
    bgGradient: 'from-clay-50 to-clay-100/50',
    borderColor: 'border-clay-200',
    foodIcon: 'utensils',
  },
};

function MealCard({ type, isCompleted, onToggle, isCheatDay }: MealCardProps) {
  const config = mealConfig[type];
  const [isPressed, setIsPressed] = useState(false);
  const FoodIcon = config.foodIcon ? mealFoodIcons[config.foodIcon] : null;

  return (
    <button
      onClick={onToggle}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={isCheatDay}
      aria-label={config.label}
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border p-5 text-left shadow-soft transition-all duration-300',
        isCompleted
          ? cn('border-opacity-100 bg-gradient-to-br', config.bgGradient, config.borderColor)
          : 'border-stone-100 bg-white hover:border-stone-200',
        isPressed && 'scale-[0.98]',
        isCheatDay && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div
        className={cn(
          'absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-[0.06] transition-all duration-500',
          isCompleted ? cn('bg-gradient-to-br', config.gradient) : 'bg-stone-300'
        )}
      />

      <div className="relative flex items-center gap-4">
        <div
          className={cn(
            'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300',
            isCompleted
            ? cn('bg-gradient-to-br', config.gradient, 'shadow-lg')
            : dashboardBrandIconContainerClass
          )}
        >
          {isCompleted ? (
            <Check className="h-5 w-5 text-white" strokeWidth={3} />
          ) : FoodIcon ? (
            <FoodIcon
              className={cn('h-5 w-5', dashboardBrandIconColorClass)}
              aria-label={config.foodIconLabel ?? config.label}
            />
          ) : null}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                'font-display font-semibold transition-colors',
                isCompleted ? 'text-stone-800' : 'text-stone-700'
              )}
            >
              {config.label}
            </h4>
            {isCompleted && (
              <span className="text-xs font-medium text-sage-700">Afgevinkt</span>
            )}
          </div>
          <p
            className={cn(
              'text-sm transition-colors',
              isCompleted ? 'text-stone-500' : 'text-stone-400'
            )}
          >
            {config.subtitle}
          </p>
        </div>
      </div>

      <div
        className={cn(
          'absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-500',
          isCompleted ? cn('w-full bg-gradient-to-r', config.gradient) : 'w-0'
        )}
      />
    </button>
  );
}

function getStatusMessage(completedCount: number) {
  if (completedCount === 0) return 'Start je dag met een goed ontbijt.';
  if (completedCount === 1) return 'Goed bezig! Nog 2 maaltijden te gaan.';
  if (completedCount === 2) return 'Bijna daar! Nog 1 maaltijd.';
  return 'Geweldig! Alle maaltijden compleet.';
}

export function DailyMealTracker({ todayMeals, streak, onToggleMeal, isCheatDay }: DailyMealTrackerProps) {
  const completedCount = [todayMeals.breakfast, todayMeals.lunch, todayMeals.dinner].filter(Boolean).length;
  const progress = (completedCount / 3) * 100;
  const allCompleted = completedCount === 3;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-stone-800">
            <Calendar className="w-5 h-5 text-sage-600" />
            Vandaag
          </h3>
          <p className="text-sm font-medium text-stone-700">{completedCount}/3 maaltijden afgerond</p>
          <p className="text-sm text-stone-500">
            {getStatusMessage(completedCount)}
          </p>
        </div>

        <Badge
          variant="secondary"
          className={cn(
            'gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 text-sm',
            streak > 0
              ? 'bg-sage-100 text-sage-700 border border-sage-200'
              : 'border border-stone-200 bg-stone-50 text-stone-700'
          )}
        >
          <Flame className={cn('w-4 h-4', streak > 0 && 'text-sage-600')} />
          {streak > 0 ? (
            <>
              <span className="font-display font-semibold">{streak}</span>
              <span className="text-xs">dag{streak === 1 ? '' : 'en'}</span>
            </>
          ) : (
            <span className="text-xs font-medium">Start streak</span>
          )}
        </Badge>
      </div>

      <div className="relative">
        <Progress
          value={progress}
          className={cn(
            'h-1.5 rounded-full bg-stone-200',
            allCompleted
              ? '[&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-emerald-400 [&>[data-slot=progress-indicator]]:via-sage-400 [&>[data-slot=progress-indicator]]:to-emerald-500'
              : '[&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-sage-400 [&>[data-slot=progress-indicator]]:to-sage-500'
          )}
        />
        {allCompleted && (
          <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
        )}
      </div>

      {/* Meal cards */}
      <div className="space-y-3">
        <MealCard 
          type="breakfast" 
          isCompleted={todayMeals.breakfast} 
          onToggle={() => onToggleMeal('breakfast')}
          isCheatDay={isCheatDay}
        />
        <MealCard 
          type="lunch" 
          isCompleted={todayMeals.lunch} 
          onToggle={() => onToggleMeal('lunch')}
          isCheatDay={isCheatDay}
        />
        <MealCard 
          type="dinner" 
          isCompleted={todayMeals.dinner} 
          onToggle={() => onToggleMeal('dinner')}
          isCheatDay={isCheatDay}
        />
      </div>

      {/* Celebration when all completed */}
      {allCompleted && (
        <Card className="animate-in slide-in-from-bottom-2 fade-in rounded-2xl border-emerald-200 bg-gradient-to-r from-emerald-50/70 to-sage-50/70 p-4 shadow-soft">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-sage-500 flex items-center justify-center shadow-sm">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-emerald-900">Perfecte dag!</h4>
                <p className="text-sm text-emerald-700">Je hebt alle maaltijden volgens het protocol gegeten.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isCheatDay && (
        <Card className="rounded-2xl border-clay-200 bg-gradient-to-r from-clay-50/80 to-clay-100/80 p-4 shadow-soft">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-clay-400 to-orange-500 flex items-center justify-center shadow-sm">
                <PartyPopper className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-clay-900">Cheat Day!</h4>
                <p className="text-sm text-clay-700">Geniet vandaag van alles wat je lekker vindt!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
