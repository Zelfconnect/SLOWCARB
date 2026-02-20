// ============================================
// TEXT PRIMITIVE - Consistent typography
// Gebruik ALLEEN deze component voor alle text
// ============================================

import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

type TextVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'body' 
  | 'body-sm' 
  | 'body-lg' 
  | 'caption' 
  | 'label' 
  | 'button';

type TextColor = 
  | 'default' 
  | 'muted' 
  | 'inverse' 
  | 'primary' 
  | 'success' 
  | 'warning' 
  | 'error';

type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right';

interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  weight?: TextWeight;
  align?: TextAlign;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  truncate?: boolean;
  lineClamp?: number;
}

// Variant classes (size + line-height)
const variantClasses: Record<TextVariant, string> = {
  h1: 'text-3xl font-bold leading-tight tracking-tight',      // 30px
  h2: 'text-2xl font-bold leading-tight',                      // 24px
  h3: 'text-xl font-semibold leading-snug',                    // 20px
  h4: 'text-lg font-semibold leading-snug',                    // 18px
  body: 'text-base leading-normal',                            // 16px
  'body-lg': 'text-lg leading-relaxed',                        // 18px
  'body-sm': 'text-sm leading-normal',                         // 14px
  caption: 'text-xs leading-normal tracking-wide',             // 12px
  label: 'text-xs font-medium uppercase tracking-wider',       // 12px uppercase
  button: 'text-base font-medium',                             // 16px
};

// Color classes
const colorClasses: Record<TextColor, string> = {
  default: 'text-stone-800',
  muted: 'text-stone-500',
  inverse: 'text-white',
  primary: 'text-sage-700',
  success: 'text-sage-600',
  warning: 'text-clay-600',
  error: 'text-red-600',
};

// Weight classes (override variant)
const weightClasses: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

// Align classes
const alignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function Text({
  children,
  variant = 'body',
  color = 'default',
  weight,
  align,
  as: Component = 'span',
  className,
  truncate = false,
  lineClamp,
}: TextProps) {
  return (
    <Component
      className={cn(
        // Variant (size + default weight)
        variantClasses[variant],
        
        // Color
        colorClasses[color],
        
        // Weight override (if specified)
        weight && weightClasses[weight],
        
        // Align (if specified)
        align && alignClasses[align],
        
        // Truncate
        truncate && 'truncate',
        
        // Line clamp
        lineClamp && `line-clamp-${lineClamp}`,
        
        // Custom classes
        className
      )}
    >
      {children}
    </Component>
  );
}

// ============================================
// HEADING - Shortcut voor headings
// ============================================
interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4;
  color?: TextColor;
  align?: TextAlign;
  className?: string;
}

export function Heading({ children, level = 2, color, align, className }: HeadingProps) {
  const variantMap: Record<number, TextVariant> = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
  };
  
  const tagMap: Record<number, 'h1' | 'h2' | 'h3' | 'h4'> = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
  };
  
  return (
    <Text
      as={tagMap[level]}
      variant={variantMap[level]}
      color={color}
      align={align}
      className={className}
    >
      {children}
    </Text>
  );
}

// ============================================
// LABEL - Shortcut voor labels
// ============================================
interface LabelProps {
  children: ReactNode;
  color?: TextColor;
  className?: string;
}

export function Label({ children, color = 'muted', className }: LabelProps) {
  return (
    <Text
      variant="label"
      color={color}
      className={className}
    >
      {children}
    </Text>
  );
}

// ============================================
// CAPTION - Shortcut voor captions
// ============================================
interface CaptionProps {
  children: ReactNode;
  color?: TextColor;
  className?: string;
}

export function Caption({ children, color = 'muted', className }: CaptionProps) {
  return (
    <Text
      variant="caption"
      color={color}
      className={className}
    >
      {children}
    </Text>
  );
}

export default Text;
