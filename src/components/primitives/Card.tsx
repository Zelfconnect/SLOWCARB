import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

type CardVariant = 'default' | 'rule' | 'concept' | 'reference' | 'success' | 'warning' | 'error';
type CardPadding = 'none' | '3' | '4' | '5' | '6';
type CardRadius = 'md' | 'lg' | 'xl' | '2xl';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;
  hasShadow?: boolean;
  hasBorder?: boolean;
  className?: string;
  onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
  // Default - white card
  default: 'bg-white text-stone-800',
  
  // Rule cards - Primary green gradient
  rule: 'bg-gradient-to-br from-sage-600 to-sage-700 text-white',
  
  // Concept cards - Neutral stone gradient
  concept: 'bg-gradient-to-br from-stone-600 to-stone-700 text-white',
  
  // Reference cards - Neutral
  reference: 'bg-white text-stone-800 border border-stone-200',
  
  // Status variants
  success: 'bg-sage-50 text-sage-900 border border-sage-200',
  warning: 'bg-stone-50 text-stone-800 border border-stone-200',
  error: 'bg-red-50 text-red-900 border border-red-200',
};

const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  '3': 'p-3',    // 12px - compact
  '4': 'p-4',    // 16px - default
  '5': 'p-5',    // 20px - medium
  '6': 'p-6',    // 24px - large
};

const radiusClasses: Record<CardRadius, string> = {
  md: 'rounded-md',    // 8px
  lg: 'rounded-lg',    // 12px - default
  xl: 'rounded-xl',    // 16px
  '2xl': 'rounded-2xl', // 20px
};

export function Card({
  children,
  variant = 'default',
  padding = '4',
  radius = 'lg',
  hasShadow = true,
  hasBorder = false,
  className,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        // Base
        'overflow-hidden transition-shadow duration-200',
        
        // Variant
        variantClasses[variant],
        
        // Padding
        paddingClasses[padding],
        
        // Radius
        radiusClasses[radius],
        
        // Shadow
        hasShadow && variant === 'default' && 'shadow-sm',
        hasShadow && variant === 'reference' && 'shadow-sm',
        
        // Border (alleen voor default/reference als expliciet gevraagd)
        hasBorder && (variant === 'default' || variant === 'reference') && 'border border-stone-200',
        
        // Clickable
        onClick && 'cursor-pointer hover:shadow-md',
        
        // Custom classes
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;
