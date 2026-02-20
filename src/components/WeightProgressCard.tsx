import { Check, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import type { WeightEntry } from '@/types';
import { WeightSparkline } from './WeightSparkline';

interface WeightProgressCardProps {
  weightLog: WeightEntry[];
  startWeight?: number;
  currentWeight?: number;
  targetWeight?: number;
  onOpenLog?: () => void;
}

const CIRCLE_SIZE = 160;
const CIRCLE_STROKE_WIDTH = 12;
const CIRCLE_RADIUS = (CIRCLE_SIZE - CIRCLE_STROKE_WIDTH) / 2;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

function clampPercentage(value: number): number {
  return Math.min(100, Math.max(0, value));
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
        className="w-full rounded-2xl border border-stone-100 bg-white p-5 text-left shadow-soft transition-all hover:border-stone-200 hover:shadow-card-hover"
        type="button"
      >
        <p className="text-sm text-stone-700 mb-3">Log je startgewicht om voortgang te zien</p>
        <div className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-stone-100 text-stone-800 text-sm font-medium">
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
      ? 'text-sage-700 bg-sage-100 border-sage-200'
      : changeDirection === 'up'
        ? 'text-clay-700 bg-clay-100 border-clay-200'
        : 'text-stone-700 bg-stone-100 border-stone-200';
  const ChangeIcon = changeIcon;
  const hasGoal = typeof targetWeight === 'number' && targetWeight > 0;
  const goalLossKilograms = hasGoal ? targetWeight : null;
  const lostSoFarKilograms = Math.max(0, resolvedStart - resolvedCurrent);
  const remainingKilograms = goalLossKilograms == null
    ? null
    : Math.max(0, goalLossKilograms - lostSoFarKilograms);
  const progressPercentage = goalLossKilograms == null
    ? 0
    : clampPercentage((lostSoFarKilograms / goalLossKilograms) * 100);
  const progressOffset = CIRCLE_CIRCUMFERENCE - (progressPercentage / 100) * CIRCLE_CIRCUMFERENCE;
  const goalCompleted = remainingKilograms != null && remainingKilograms <= 0.05;

  if (goalLossKilograms != null) {
    return (
      <button
        onClick={onOpenLog}
        className="w-full rounded-2xl border border-stone-100 bg-white p-5 text-left shadow-soft transition-all hover:border-stone-200 hover:shadow-card-hover"
        type="button"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-stone-700">Doelprogressie</span>
            <span className="inline-flex items-center rounded-full border border-sage-200 bg-sage-50 px-2 py-0.5 text-[11px] font-medium text-sage-700">
              -{goalLossKilograms.toFixed(0)} kg
            </span>
          </div>
          <span className="text-xs font-medium text-stone-500">
            {Math.round(progressPercentage)}% voltooid
          </span>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="relative h-40 w-40 flex-shrink-0 rounded-full shadow-[0_16px_34px_rgba(47,94,63,0.16)]">
            <svg
              className="-rotate-90"
              height={CIRCLE_SIZE}
              width={CIRCLE_SIZE}
              viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="weightProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#729c72" />
                  <stop offset="100%" stopColor="#314f31" />
                </linearGradient>
              </defs>
              <circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={CIRCLE_RADIUS}
                stroke="currentColor"
                strokeWidth={CIRCLE_STROKE_WIDTH}
                className="text-stone-200"
                fill="none"
              />
              <circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={CIRCLE_RADIUS}
                stroke={goalCompleted ? '#22C55E' : 'url(#weightProgressGradient)'}
                strokeWidth={CIRCLE_STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={CIRCLE_CIRCUMFERENCE}
                strokeDashoffset={progressOffset}
                fill="none"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {goalCompleted ? (
                <Check className="mb-1 h-6 w-6 text-emerald-600" />
              ) : null}
              <div className="flex items-end gap-1">
                <span className="font-display text-2xl font-bold leading-none text-stone-900">
                  {resolvedCurrent.toFixed(1)}
                </span>
                <span className="mb-0.5 text-sm font-medium text-stone-500">kg</span>
              </div>
              <p className="mt-1 text-xs text-stone-500">
                Doel: {(resolvedStart - goalLossKilograms).toFixed(1)} kg
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-stone-100 bg-stone-50/70 px-3 py-2">
            <p className="text-[11px] text-stone-500">Start</p>
            <p className="text-sm font-semibold text-stone-800">{resolvedStart.toFixed(1)} kg</p>
          </div>
          <div className="rounded-xl border border-sage-100 bg-sage-50/60 px-3 py-2">
            <p className="text-[11px] text-stone-500">Resterend</p>
            <p className="text-sm font-semibold text-sage-800">
              {goalCompleted ? '0.0 kg' : `${(remainingKilograms ?? 0).toFixed(1)} kg`}
            </p>
          </div>
          <div className="rounded-xl border border-stone-100 bg-stone-50/70 px-3 py-2">
            <p className="text-[11px] text-stone-500">Veranderd</p>
            <p className="text-sm font-semibold text-stone-800">
              {percentChange > 0 ? '+' : ''}
              {percentChange.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${changeColorClass}`}>
            <ChangeIcon className="h-3 w-3" />
            {changeDirection === 'flat' ? 'Stabiel' : `${deltaKilograms < 0 ? '-' : '+'}${absoluteDeltaKilograms.toFixed(1)} kg`}
          </span>
          <span className="text-xs text-stone-500">
            {goalCompleted ? 'Doel bereikt' : `Nog ${(remainingKilograms ?? 0).toFixed(1)} kg te gaan`}
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onOpenLog}
      className="w-full rounded-2xl border border-stone-100 bg-white p-5 text-left shadow-soft transition-all hover:border-stone-200 hover:shadow-card-hover"
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
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${changeColorClass}`}>
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
