import { Check, Minus, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import type { WeightEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { WeightSparkline } from './WeightSparkline';

interface WeightProgressCardProps {
  weightLog: WeightEntry[];
  startWeight?: number;
  currentWeight?: number;
  targetWeight?: number;
  onOpenLog?: () => void;
}

const MIN_HEALTHY_GOAL_WEIGHT = 40;
const MIN_VISIBLE_PROGRESS_PERCENT = 2;

function clampPercentage(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function resolveGoalWeight(targetWeight: number | undefined, startWeight: number): number | null {
  if (!Number.isFinite(targetWeight) || targetWeight == null || targetWeight <= 0) {
    return null;
  }

  // Backward compatibility: older onboarding stored kg-to-lose (3-20) instead of absolute goal kg.
  if (targetWeight < MIN_HEALTHY_GOAL_WEIGHT) {
    return Math.max(MIN_HEALTHY_GOAL_WEIGHT, startWeight - targetWeight);
  }

  return targetWeight;
}

export function WeightProgressCard({
  weightLog,
  startWeight,
  currentWeight,
  targetWeight,
  onOpenLog,
}: WeightProgressCardProps) {
  const sorted = [...weightLog].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const now = new Date();
  const cutoff = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
  const last30Days = sorted.filter(entry => new Date(entry.date) >= cutoff);

  const resolvedStart = startWeight ?? sorted[0]?.weight;
  const resolvedCurrent = currentWeight ?? sorted[sorted.length - 1]?.weight;

  if (!resolvedStart || !resolvedCurrent || weightLog.length === 0) {
    return (
      <button
        onClick={onOpenLog}
        className="w-full rounded-2xl bg-white p-4 text-left shadow-surface transition-all hover:shadow-card-hover"
        type="button"
      >
        <p className="text-sm text-stone-700 mb-3">Log je startgewicht om voortgang te zien</p>
        <div className="inline-flex items-center justify-center rounded-2xl bg-stone-100 px-3 py-2 text-sm font-medium text-stone-800 shadow-surface">
          + Log gewicht
        </div>
      </button>
    );
  }

  const percentChange = ((resolvedCurrent - resolvedStart) / resolvedStart) * 100;
  const deltaKilograms = resolvedCurrent - resolvedStart;
  const absoluteDeltaKilograms = Math.abs(deltaKilograms);
  const changeDirection = deltaKilograms < -0.05 ? 'down' : deltaKilograms > 0.05 ? 'up' : 'flat';
  const changeIcon =
    changeDirection === 'down' ? TrendingDown : changeDirection === 'up' ? TrendingUp : Minus;
  const changeColorClass =
    changeDirection === 'down'
      ? 'text-sage-700 bg-sage-100'
      : changeDirection === 'up'
        ? 'text-clay-700 bg-clay-100'
        : 'text-stone-700 bg-stone-100';
  const ChangeIcon = changeIcon;
  const goalWeight = resolveGoalWeight(targetWeight, resolvedStart);
  const remainingKilograms = goalWeight == null
    ? null
    : Math.max(0, resolvedCurrent - goalWeight);
  const totalToLoseKilograms = goalWeight == null
    ? null
    : Math.max(0, resolvedStart - goalWeight);
  const goalCompleted = remainingKilograms != null && remainingKilograms <= 0.05;
  const lostSoFarKilograms = goalWeight == null
    ? 0
    : Math.max(0, resolvedStart - resolvedCurrent);
  const progressPercentage = goalWeight == null
    ? 0
    : totalToLoseKilograms != null && totalToLoseKilograms > 0
      ? clampPercentage((lostSoFarKilograms / totalToLoseKilograms) * 100)
      : goalCompleted
        ? 100
        : 0;
  const visibleProgressPercentage = goalWeight == null
    ? 0
    : goalCompleted
      ? 100
      : Math.max(progressPercentage, MIN_VISIBLE_PROGRESS_PERCENT);

  if (goalWeight != null) {
    const showMiddlePercentage = progressPercentage > 0 && progressPercentage < 100;

    return (
      <div className="w-full rounded-2xl bg-white p-2.5 text-left shadow-surface">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-stone-700">Huidig gewicht</span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-sage-50 px-2 py-0.5 text-[11px] font-medium text-sage-700">
              Doel {goalWeight.toFixed(0)} kg
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onOpenLog}
              aria-label="Log gewicht"
              className="h-auto rounded-full px-2.5 py-1.5 text-[11px] text-stone-600 hover:bg-sage-50 hover:text-sage-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Log
            </Button>
          </div>
        </div>

        <div className="mt-1.5 rounded-2xl bg-stone-50/70 p-2 shadow-surface">
          <div className="mx-auto flex max-w-[220px] flex-col items-center" data-testid="goal-progress-linear">
            <div className="mt-0.5 flex items-end justify-center gap-1 text-center">
              {goalCompleted ? (
                <Check className="mb-0.5 h-3.5 w-3.5 text-emerald-600" />
              ) : null}
              <span className="font-display text-[32px] font-semibold leading-none text-stone-900">
                {resolvedCurrent.toFixed(1)}
              </span>
              <span className="mb-0.5 text-xs font-medium text-stone-500">kg</span>
            </div>
            <div className="mt-2 w-full">
              <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-stone-500">
                <span>0%</span>
                {showMiddlePercentage ? (
                  <span className="text-stone-700">{progressPercentage.toFixed(0)}%</span>
                ) : (
                  <span aria-hidden="true" />
                )}
                <span>100%</span>
              </div>
              <Progress
                value={visibleProgressPercentage}
                aria-label="Voortgang naar doelgewicht"
                className="h-2 rounded-full bg-sage-100"
              />
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] text-stone-500">
            Start <span className="font-medium text-stone-700">{resolvedStart.toFixed(1)} kg</span>
            {' · '}
            {goalCompleted ? 'Doel bereikt' : `Resterend ${(remainingKilograms ?? 0).toFixed(1)} kg`}
          </p>
        </div>

        <div className="mt-1.5">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${changeColorClass}`}>
            <ChangeIcon className="h-3 w-3" />
            {changeDirection === 'flat' ? 'Stabiel' : `${deltaKilograms < 0 ? '-' : '+'}${absoluteDeltaKilograms.toFixed(1)} kg`}
          </span>
          <span className="ml-1.5 text-[11px] text-stone-500">
            {percentChange > 0 ? '+' : ''}
            {percentChange.toFixed(1)}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onOpenLog}
      className="w-full rounded-2xl bg-white p-4 text-left shadow-surface transition-all hover:shadow-card-hover"
      type="button"
    >
      <div className="flex justify-between items-center gap-3">
        <span className="text-2xl font-bold text-stone-900">
          {resolvedStart.toFixed(1)} → {resolvedCurrent.toFixed(1)}
        </span>
        <span className="text-sm text-stone-500">30d</span>
      </div>

      <WeightSparkline data={last30Days} className="h-8 mt-2" />

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${changeColorClass}`}>
          <ChangeIcon className="h-3 w-3" />
          {changeDirection === 'flat' ? 'Stabiel' : `${deltaKilograms < 0 ? '-' : '+'}${absoluteDeltaKilograms.toFixed(1)} kg`}
        </span>
        <span className="text-xs text-stone-500">
          {percentChange > 0 ? '+' : ''}
          {percentChange.toFixed(1)}% deze maand
        </span>
      </div>
    </button>
  );
}
