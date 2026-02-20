import { cn } from '@/lib/utils';
import type { WeightEntry } from '@/types';

interface WeightSparklineProps {
  data: WeightEntry[];
  className?: string;
}

export function WeightSparkline({ data, className }: WeightSparklineProps) {
  if (data.length === 0) return null;

  const values = data.map(entry => entry.weight);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const width = 120;
  const height = 24;
  const midY = height / 2;

  if (data.length === 1) {
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={cn('w-full text-stone-500', className)}
        role="img"
        aria-label="Gewichtsontwikkeling"
      >
        <line x1="0" y1={midY} x2={width} y2={midY} stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
        <circle cx={width / 2} cy={midY} r="3" fill="currentColor" />
      </svg>
    );
  }

  const points = data.map((entry, index) => {
    const x = data.length === 1 ? width / 2 : (index / (data.length - 1)) * width;
    const y = height - ((entry.weight - min) / range) * height;
    return { x, y };
  });

  const path = points.reduce((acc, point, index) => {
    const cmd = index === 0 ? 'M' : 'L';
    return `${acc} ${cmd}${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }, '');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('w-full text-stone-600', className)}
      role="img"
      aria-label="Gewichtsontwikkeling"
    >
      <line x1="0" y1={midY} x2={width} y2={midY} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2.5" fill="currentColor" />
    </svg>
  );
}
