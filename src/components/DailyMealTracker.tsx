import { useState } from 'react';
import { Coffee, Sun, Moon, Check, Flame, Trophy, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
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

const mealConfig = {
  breakfast: {
    icon: Coffee,
    label: 'Ontbijt',
    subtitle: '30g eiwit binnen 30 min',
    gradient: 'from-amber-400 to-orange-500',
    bgGradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    checkColor: 'bg-amber-500',
    emoji: '🍳',
  },
  lunch: {
    icon: Sun,
    label: 'Lunch',
    subtitle: 'Eiwit + groente + bonen',
    gradient: 'from-sage-400 to-sage-600',
    bgGradient: 'from-sage-50 to-emerald-50',
    borderColor: 'border-sage-200',
    checkColor: 'bg-sage-500',
    emoji: '🥗',
  },
  dinner: {
    icon: Moon,
    label: 'Avondeten',
    subtitle: 'Eiwit + groente + bonen',
    gradient: 'from-indigo-400 to-purple-500',
    bgGradient: 'from-indigo-50 to-purple-50',
    borderColor: 'border-indigo-200',
    checkColor: 'bg-indigo-500',
    emoji: '🍽️',
  },
};

function MealCard({ type, isCompleted, onToggle, isCheatDay }: MealCardProps) {
  const config = mealConfig[type];
  const Icon = config.icon;
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onToggle}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={isCheatDay}
      className={cn(
        'relative w-full rounded-2xl p-4 transition-all duration-300 overflow-hidden',
        'border-2 text-left',
        isCompleted 
          ? cn('bg-gradient-to-br', config.bgGradient, config.borderColor, 'border-opacity-100')
          : 'bg-white border-stone-200 hover:border-stone-300',
        isPressed && 'scale-[0.98]',
        isCheatDay && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Background decoration */}
      <div className={cn(
        'absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-all duration-500',
        isCompleted ? cn('bg-gradient-to-br', config.gradient) : 'bg-stone-200'
      )} />

      <div className="relative flex items-center gap-4">
        {/* Checkbox */}
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0',
          isCompleted 
            ? cn('bg-gradient-to-br', config.gradient, 'shadow-lg')
            : 'bg-stone-100 border-2 border-stone-200'
        )}>
          {isCompleted ? (
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          ) : (
            <span className="text-2xl">{config.emoji}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={cn(
              'font-display font-semibold transition-colors',
              isCompleted ? 'text-stone-800' : 'text-stone-700'
            )}>
              {config.label}
            </h4>
            {isCompleted && (
              <span className="text-xs font-medium text-white bg-gradient-to-r from-emerald-400 to-emerald-500 px-2 py-0.5 rounded-full">
                ✓ Klaar
              </span>
            )}
          </div>
          <p className={cn(
            'text-sm transition-colors',
            isCompleted ? 'text-stone-500' : 'text-stone-400'
          )}>
            {config.subtitle}
          </p>
        </div>

        {/* Icon */}
        <Icon className={cn(
          'w-5 h-5 transition-colors flex-shrink-0',
          isCompleted ? 'text-stone-400' : 'text-stone-300'
        )} />
      </div>

      {/* Progress bar for visual feedback */}
      <div className={cn(
        'absolute bottom-0 left-0 h-1 rounded-full transition-all duration-500',
        isCompleted ? cn('w-full bg-gradient-to-r', config.gradient) : 'w-0'
      )} />
    </button>
  );
}

export function DailyMealTracker({ todayMeals, streak, onToggleMeal, isCheatDay }: DailyMealTrackerProps) {
  const completedCount = [todayMeals.breakfast, todayMeals.lunch, todayMeals.dinner].filter(Boolean).length;
  const progress = (completedCount / 3) * 100;
  const allCompleted = completedCount === 3;

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-stone-800 text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sage-600" />
            Vandaag
          </h3>
          <p className="text-sm text-stone-500">
            {completedCount === 0 && 'Start je dag met een goed ontbijt!'}
            {completedCount === 1 && 'Goed bezig! Nog 2 maaltijden te gaan.'}
            {completedCount === 2 && 'Bijna daar! Nog 1 maaltijd.'}
            {completedCount === 3 && 'Geweldig! Alle maaltijden compleet.'}
          </p>
        </div>
        
        {/* Streak badge */}
        <div className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300',
          streak > 0 
            ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700'
            : 'bg-stone-100 text-stone-500'
        )}>
          <Flame className={cn('w-5 h-5', streak > 0 && 'text-orange-500')} />
          {streak > 0 ? (
            <>
              <span className="font-display font-semibold">{streak}</span>
              <span className="text-xs">dagen</span>
            </>
          ) : (
            <span className="text-xs font-medium">Start streak</span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-stone-100 rounded-full overflow-hidden">
        <div 
          className={cn(
            'absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out',
            allCompleted 
              ? 'bg-gradient-to-r from-emerald-400 via-sage-400 to-emerald-500'
              : 'bg-gradient-to-r from-sage-400 to-sage-500'
          )}
          style={{ width: `${progress}%` }}
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
        <div className="bg-gradient-to-r from-emerald-50 to-sage-50 rounded-2xl p-4 border border-emerald-200 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-sage-500 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-emerald-900">Perfecte dag!</h4>
              <p className="text-sm text-emerald-700">Je hebt alle maaltijden volgens het protocol gegeten.</p>
            </div>
          </div>
        </div>
      )}

      {/* Cheat day message */}
      {isCheatDay && (
        <div className="bg-gradient-to-r from-clay-50 to-orange-50 rounded-2xl p-4 border border-clay-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-clay-400 to-orange-500 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎉</span>
            </div>
            <div>
              <h4 className="font-display font-semibold text-clay-900">Cheat Day!</h4>
              <p className="text-sm text-clay-700">Geniet vandaag van alles wat je lekker vindt!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
