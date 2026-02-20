// ============================================
// BADGE PRIMITIVE - Status/label badges
// ============================================

import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'
  | 'outline';

type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-stone-100 text-stone-700',
  primary: 'bg-sage-100 text-sage-700',
  success: 'bg-sage-50 text-sage-700',
  warning: 'bg-clay-50 text-clay-700',
  error: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
  outline: 'bg-white text-stone-700 border border-stone-200',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        // Base
        'inline-flex items-center justify-center',
        'font-medium rounded-full',
        'transition-colors',
        
        // Variant
        variantClasses[variant],
        
        // Size
        sizeClasses[size],
        
        // Custom
        className
      )}
    >
      {children}
    </span>
  );
}

// ============================================
// STATUS BADGE - Met icon
// ============================================
interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info' | 'pending';
  text: string;
  size?: BadgeSize;
}

const statusConfig = {
  success: { variant: 'success' as const, dot: 'bg-sage-500' },
  error: { variant: 'error' as const, dot: 'bg-red-500' },
  warning: { variant: 'warning' as const, dot: 'bg-clay-500' },
  info: { variant: 'info' as const, dot: 'bg-blue-500' },
  pending: { variant: 'default' as const, dot: 'bg-stone-400' },
};

export function StatusBadge({ status, text, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} size={size} className="gap-1.5">
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {text}
    </Badge>
  );
}

// ============================================
// DAY BADGE - Specifiek voor dag counter
// ============================================
interface DayBadgeProps {
  day: number;
  className?: string;
}

export function DayBadge({ day, className }: DayBadgeProps) {
  return (
    <div
      className={cn(
        'rounded-full bg-stone-100 px-3 py-1.5',
        className
      )}
    >
      <span className="text-sm font-medium text-stone-700">
        Dag {day}
      </span>
    </div>
  );
}

export default Badge;
