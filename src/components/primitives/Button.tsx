// ============================================
// BUTTON PRIMITIVE - Consistent button component
// Gebruik ALLEEN deze component voor alle buttons
// ============================================

import { cn } from '@/lib/utils';
import { type ReactNode, type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  // Primary - Main CTA
  primary: `
    bg-primary-600 text-white
    hover:bg-primary-700
    active:bg-primary-800
    focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  `,
  
  // Secondary - Subtle CTA
  secondary: `
    bg-primary-50 text-primary-700
    hover:bg-primary-100
    active:bg-primary-200
    focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  `,
  
  // Ghost - Low emphasis
  ghost: `
    bg-transparent text-warm-700
    hover:bg-warm-100
    active:bg-warm-200
    focus:ring-2 focus:ring-warm-400 focus:ring-offset-2
  `,
  
  // Danger - Destructive actions
  danger: `
    bg-red-600 text-white
    hover:bg-red-700
    active:bg-red-800
    focus:ring-2 focus:ring-red-500 focus:ring-offset-2
  `,
  
  // Success - Positive actions
  success: `
    bg-primary-600 text-white
    hover:bg-primary-700
    active:bg-primary-800
    focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  `,
  
  // Outline - Bordered
  outline: `
    bg-white text-warm-700
    border border-warm-300
    hover:bg-warm-50
    active:bg-warm-100
    focus:ring-2 focus:ring-warm-400 focus:ring-offset-2
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm gap-1.5',      // 12px 16px
  md: 'px-4 py-3 text-base gap-2',      // 16px 24px - default
  lg: 'px-6 py-4 text-lg gap-2.5',      // 24px 32px
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center',
        'font-medium rounded-md',
        'transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none',
        
        // Variant
        variantClasses[variant],
        
        // Size
        sizeClasses[size],
        
        // Width
        fullWidth && 'w-full',
        
        // Custom classes
        className
      )}
      {...props}
    >
      {isLoading && (
        <svg 
          className="animate-spin h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" cy="12" r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}

// ============================================
// ICON BUTTON - Voor icon-only buttons
// ============================================
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'w-8 h-8 p-1.5',
  md: 'w-10 h-10 p-2',
  lg: 'w-12 h-12 p-2.5',
};

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        // Base
        'inline-flex items-center justify-center',
        'rounded-full transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        
        // Size
        iconSizeClasses[size],
        
        // Variant
        variant === 'primary' && 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
        variant === 'secondary' && 'bg-primary-50 text-primary-700 hover:bg-primary-100 focus:ring-primary-500',
        variant === 'ghost' && 'bg-transparent text-warm-600 hover:bg-warm-100 focus:ring-warm-400',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        
        // Custom
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon}
    </button>
  );
}

export default Button;
