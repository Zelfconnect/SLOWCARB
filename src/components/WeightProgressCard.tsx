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

const ARC_WIDTH = 132;
const ARC_HEIGHT = 74;
const ARC_STROKE_WIDTH = 14;
const ARC_RADIUS = (ARC_WIDTH - ARC_STROKE_WIDTH) / 2;
const ARC_CENTER_X = ARC_WIDTH / 2;
const ARC_CENTER_Y = ARC_HEIGHT;
const ARC_START_X = ARC_CENTER_X - ARC_RADIUS;
const ARC_END_X = ARC_CENTER_X + ARC_RADIUS;
const GOAL_ARC_PATH = `M ${ARC_START_X} ${ARC_CENTER_Y} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${ARC_END_X} ${ARC_CENTER_Y}`;

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
  const hasGoal = typeof targetWeight === 'number' && targetWeight > 0;
  const goalLossKilograms = hasGoal ? targetWeight : null;
  const lostSoFarKilograms = Math.max(0, resolvedStart - resolvedCurrent);
  const remainingKilograms = goalLossKilograms == null
    ? null
    : Math.max(0, goalLossKilograms - lostSoFarKilograms);
  const progressPercentage = goalLossKilograms == null
    ? 0
    : clampPercentage((lostSoFarKilograms / goalLossKilograms) * 100);
  const progressStrokeOffset = 100 - progressPercentage;
  const goalCompleted = remainingKilograms != null && remainingKilograms <= 0.05;

  if (goalLossKilograms != null) {
    return (
      <button
        onClick={onOpenLog}
        className="w-full rounded-2xl bg-white p-3 text-left shadow-surface transition-all hover:shadow-card-hover"
        type="button"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-stone-700">Huidig gewicht</span>
          <span className="inline-flex items-center rounded-full bg-sage-50 px-2 py-0.5 text-[11px] font-medium text-sage-700">
            Doel -{goalLossKilograms.toFixed(0)} kg
          </span>
        </div>

        <div className="mt-2 rounded-2xl bg-stone-50/70 p-2.5 shadow-surface">
          <div
            className="relative mx-auto"
            style={{ width: ARC_WIDTH, height: ARC_HEIGHT + 2 }}
            data-testid="goal-progress-arc"
          >
            <svg
              width={ARC_WIDTH}
              height={ARC_HEIGHT}
              viewBox={`0 0 ${ARC_WIDTH} ${ARC_HEIGHT}`}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="weightProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <path
                d={GOAL_ARC_PATH}
                stroke="#78716c"
                strokeWidth={ARC_STROKE_WIDTH}
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={GOAL_ARC_PATH}
                stroke={goalCompleted ? '#22C55E' : 'url(#weightProgressGradient)'}
                strokeWidth={ARC_STROKE_WIDTH}
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={progressStrokeOffset}
                fill="none"
              />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1 text-center">
              {goalCompleted ? (
                <Check className="mb-0.5 h-3.5 w-3.5 text-emerald-600" />
              ) : null}
              <span className="font-display text-[32px] font-semibold leading-none text-stone-900">
                {resolvedCurrent.toFixed(1)}
              </span>
              <span className="mb-0.5 text-xs font-medium text-stone-500">kg</span>
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] text-stone-500">
            Start <span className="font-medium text-stone-700">{resolvedStart.toFixed(1)} kg</span>
            {' · '}
            {goalCompleted ? 'Doel bereikt' : `Resterend ${(remainingKilograms ?? 0).toFixed(1)} kg`}
          </p>
        </div>

        <div className="mt-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${changeColorClass}`}>
            <ChangeIcon className="h-3 w-3" />
            {changeDirection === 'flat' ? 'Stabiel' : `${deltaKilograms < 0 ? '-' : '+'}${absoluteDeltaKilograms.toFixed(1)} kg`}
          </span>
          <span className="ml-1.5 text-[11px] text-stone-500">
            {percentChange > 0 ? '+' : ''}
            {percentChange.toFixed(1)}%
          </span>
        </div>
      </button>
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
