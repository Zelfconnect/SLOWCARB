import { TrendingDown } from 'lucide-react';
import type { WeightEntry } from '@/types';
import { WeightSparkline } from './WeightSparkline';

interface WeightProgressCardProps {
  weightLog: WeightEntry[];
  startWeight?: number;
  currentWeight?: number;
  onOpenLog?: () => void;
}

export function WeightProgressCard({ weightLog, startWeight, currentWeight, onOpenLog }: WeightProgressCardProps) {
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
        className="w-full bg-white rounded-xl p-4 border border-warm-200 hover:border-warm-300 transition-colors text-left"
        type="button"
      >
        <p className="text-sm text-warm-700 mb-3">Log je startgewicht om voortgang te zien</p>
        <div className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-warm-100 text-warm-800 text-sm font-medium">
          + Log gewicht
        </div>
      </button>
    );
  }

  const percentChange = ((resolvedCurrent - resolvedStart) / resolvedStart) * 100;

  return (
    <button
      onClick={onOpenLog}
      className="w-full bg-white rounded-xl p-4 border border-warm-200 hover:border-warm-300 transition-colors text-left"
      type="button"
    >
      <div className="flex justify-between items-end mb-3">
        <span className="text-2xl font-bold text-warm-900">
          {resolvedStart.toFixed(1)} → {resolvedCurrent.toFixed(1)}
        </span>
        <span className="text-sm text-warm-500">30d</span>
      </div>

      <WeightSparkline data={last30Days} className="h-12 mb-2" />

      <p className="text-xs text-warm-500 flex items-center gap-1">
        <TrendingDown className="w-3 h-3" />
        {percentChange.toFixed(1)}% deze maand
      </p>
    </button>
  );
}
