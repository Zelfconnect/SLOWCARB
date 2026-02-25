import { useMemo } from 'react';
import { Calendar, Check, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { RECIPES } from '@/data/recipeLoader';
import type { MealEntry } from '@/types';

interface DailyMealTrackerProps {
  todayMeals: MealEntry;
  streak: number;
  onToggleMeal: (meal: 'breakfast' | 'lunch' | 'dinner') => void;
  isCheatDay: boolean;
}

interface MealCarouselCardProps {
  type: 'breakfast' | 'lunch' | 'dinner';
  image?: string;
  title: string;
  subtitle: string;
  fallbackGradient: string;
  isCompleted: boolean;
  onToggle: () => void;
  isCheatDay: boolean;
}

const mealMetadata = {
  breakfast: {
    label: 'Ontbijt',
    subtitle: '30g eiwit binnen 30 min',
    tag: 'ontbijt',
    fallbackGradient: 'from-amber-200 via-orange-200 to-orange-300',
  },
  lunch: {
    label: 'Lunch',
    subtitle: 'Eiwit + groente + bonen',
    tag: 'lunch',
    fallbackGradient: 'from-emerald-200 via-green-200 to-emerald-300',
  },
  dinner: {
    label: 'Avondeten',
    subtitle: 'Protocol diner',
    tag: 'avondeten',
    fallbackGradient: 'from-teal-200 via-cyan-200 to-teal-300',
  },
} as const;

const MEAL_CHIP_LABELS = {
  breakfast: 'ontbijt',
  lunch: 'LUNCH',
  dinner: 'diner',
} as const;

function MealCarouselCard({
  type,
  image,
  title,
  subtitle,
  fallbackGradient,
  isCompleted,
  onToggle,
  isCheatDay,
}: MealCarouselCardProps) {
  return (
    <button
      onClick={onToggle}
      disabled={isCheatDay}
      aria-label={title}
      data-testid={`meal-photo-card-${type}`}
      className={cn(
        'group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-surface transition-all duration-200',
        isCompleted ? 'ring-2 ring-emerald-500/40' : 'active:scale-[0.99]',
        isCheatDay && 'cursor-not-allowed opacity-55'
      )}
    >
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-t-2xl">
        <div className={cn('absolute inset-0 bg-gradient-to-br', fallbackGradient)} />
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        <div className="absolute left-2 top-2 inline-flex rounded-full bg-black/45 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/90">
          {MEAL_CHIP_LABELS[type]}
        </div>
        <div className="absolute right-2 top-2">
          {isCompleted ? (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-semibold text-white">
              <Check className="h-2.5 w-2.5" />
              Klaar
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex min-h-[52px] flex-1 flex-col justify-center px-2 py-1.5">
        <p className="truncate font-display text-[15px] font-semibold text-stone-900">{title}</p>
        <p className="line-clamp-2 text-[11px] leading-tight text-stone-600">{subtitle}</p>
      </div>
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
  const progressPercent = Math.round((completedCount / 3) * 100);
  const ringSize = 128;
  const ringStroke = 10;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (progressPercent / 100) * ringCircumference;

  const mealCards = useMemo(
    () =>
      (Object.keys(mealMetadata) as Array<keyof typeof mealMetadata>).map((mealType) => {
        const meta = mealMetadata[mealType];
        const image = RECIPES.find((recipe) => recipe.tags.includes(meta.tag) && recipe.image)?.image;
        return {
          type: mealType,
          title: meta.label,
          subtitle: meta.subtitle,
          image,
          fallbackGradient: meta.fallbackGradient,
        };
      }),
    []
  );

  return (
    <section className="rounded-2xl bg-white p-2.5 shadow-surface">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-1.5 font-display text-base font-semibold text-stone-900">
            <Calendar className="h-4 w-4 text-emerald-600" />
            Vandaag
          </h3>
          <p className="text-[11px] text-stone-500">{getStatusMessage(completedCount)}</p>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            'gap-1 px-2 py-1 rounded-lg text-[11px]',
            streak > 0
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-stone-50 text-stone-600'
          )}
        >
          <Flame className={cn('h-3.5 w-3.5', streak > 0 && 'text-emerald-600')} />
          <span>{streak > 0 ? `${streak} dag${streak === 1 ? '' : 'en'}` : 'Start streak'}</span>
        </Badge>
      </div>

      <div className="mt-1.5 flex flex-col items-center justify-center">
        <div
          className="relative"
          style={{
            width: `${ringSize}px`,
            height: `${ringSize}px`,
          }}
        >
          <svg
            className="-rotate-90"
            width={ringSize}
            height={ringSize}
            viewBox={`0 0 ${ringSize} ${ringSize}`}
            aria-hidden="true"
          >
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={ringRadius}
              strokeWidth={ringStroke}
              className="text-stone-200"
              stroke="currentColor"
              fill="none"
            />
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={ringRadius}
              strokeWidth={ringStroke}
              strokeLinecap="round"
              stroke="#10b981"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringOffset}
              fill="none"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-display text-[40px] font-semibold leading-none text-stone-900">
              {completedCount}/3
            </p>
            <p className="mt-0.5 text-xs font-semibold text-emerald-600">Vandaag</p>
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1.5 items-stretch" data-testid="meal-cards-grid">
        {mealCards.map((meal) => (
          <div
            key={meal.type}
            className="min-w-0 flex"
            data-testid="meal-card-column"
          >
            <MealCarouselCard
              type={meal.type}
              title={meal.title}
              subtitle={meal.subtitle}
              image={meal.image}
              fallbackGradient={meal.fallbackGradient}
              isCompleted={todayMeals[meal.type]}
              onToggle={() => onToggleMeal(meal.type)}
              isCheatDay={isCheatDay}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
