// ============================================
// SLOW-CARB COMPANION - DESIGN TOKENS
// 8pt Grid Design System
// ============================================

// KLEUREN - Strict palette, geen willekeurige kleuren meer
export const colors = {
  // Primary (Slow-Carb Green - Sage)
  primary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Main brand color
    600: '#16A34A', // Buttons, active states
    700: '#15803D', // Headers
    800: '#166534', // Dark text on light bg
    900: '#14532D', // Dark headers
  },

  // Accent (legacy amber, avoid in UI)
  accent: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Main accent
    600: '#D97706',
    700: '#B45309',
  },

  // Status colors (Semantisch)
  status: {
    success: {
      DEFAULT: '#22C55E',
      light: '#DCFCE7',
      dark: '#166534',
    },
    error: {
      DEFAULT: '#EF4444',
      light: '#FEE2E2',
      dark: '#991B1B',
    },
    warning: {
      DEFAULT: '#F59E0B',
      light: '#FEF3C7',
      dark: '#92400E',
    },
    info: {
      DEFAULT: '#3B82F6',
      light: '#DBEAFE',
      dark: '#1E40AF',
    },
  },

  // Neutrals (Warm gray voor beige tint)
  gray: {
    50: '#FAFAF9',  // Warm background
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
  },

  // Backgrounds
  background: {
    primary: '#FAFAF9',    // Warm beige
    secondary: '#FFFFFF',  // White
    tertiary: '#F5F5F4',   // Light gray
  },
} as const;

// SPACING - 8pt Grid System
// ALLEEN deze waarden gebruiken in de hele app
export const spacing = {
  0: '0',
  0.5: '2px',   // 0.125rem
  1: '4px',     // 0.25rem - icon gaps
  1.5: '6px',   // 0.375rem
  2: '8px',     // 0.5rem - tight
  2.5: '10px',  // 0.625rem
  3: '12px',    // 0.75rem - compact
  3.5: '14px',  // 0.875rem
  4: '16px',    // 1rem - default
  5: '20px',    // 1.25rem - medium
  6: '24px',    // 1.5rem - large
  7: '28px',    // 1.75rem
  8: '32px',    // 2rem - x-large
  9: '36px',    // 2.25rem
  10: '40px',   // 2.5rem - section
  11: '44px',   // 2.75rem
  12: '48px',   // 3rem - major section
  14: '56px',   // 3.5rem
  16: '64px',   // 4rem - break
  20: '80px',   // 5rem - bottom nav height
  24: '96px',   // 6rem - safe bottom
} as const;

// TYPOGRAFIE - Strict scale
export const typography = {
  // Font families
  fontFamily: {
    sans: ['SF Pro Text', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    display: ['SF Pro Display', 'SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Inter', 'system-ui', 'sans-serif'],
  },

  // Sizes (8pt scale)
  size: {
    xs: '12px',     // 0.75rem - Captions, labels
    sm: '14px',     // 0.875rem - Secondary text
    base: '16px',   // 1rem - Body
    lg: '18px',     // 1.125rem - Lead
    xl: '20px',     // 1.25rem - H3
    '2xl': '24px',  // 1.5rem - H2
    '3xl': '30px',  // 1.875rem - H1
  },

  // Weights
  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line heights
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
  },

  // Letter spacing
  tracking: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',    // Labels
    widest: '0.1em',
  },
} as const;

// BORDER RADIUS - Consistent
export const radius = {
  none: '0',
  sm: '4px',      // 0.25rem - small elements
  md: '12px',     // 0.75rem - compact controls
  lg: '16px',     // 1rem - default interactive surfaces
  xl: '16px',     // 1rem - large cards
  '2xl': '20px',  // 1.25rem - modals
  '3xl': '24px',  // 1.5rem - hero cards
  full: '9999px', // pills, avatars
} as const;

// SHADOWS - 3 niveaus max
export const shadow = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
  surface: '0 4px 20px rgba(0, 0, 0, 0.06)',
} as const;

// LAYOUT - Fixed dimensions
export const layout = {
  header: {
    height: '64px', // 4rem
  },
  bottomNav: {
    height: '80px', // 5rem
  },
  safeBottom: '96px', // 6rem - pb for scrollable content
  maxWidth: '448px',  // max-w-md (28rem)
} as const;

// Z-INDEX Scale
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const;

// TRANSITIONS
export const transition = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================
// CARD VARIANTS - Education cards
// ============================================
export const cardVariants = {
  // Rule cards - Primary green
  rule: {
    background: 'bg-gradient-to-br from-primary-600 to-primary-700',
    text: 'text-white',
    icon: 'text-white',
    accent: 'bg-white/10',
  },

  // Concept cards - Neutral stone accent
  concept: {
    background: 'bg-gradient-to-br from-stone-600 to-stone-700',
    text: 'text-white',
    icon: 'text-white',
    accent: 'bg-stone-100',
  },

  // Reference cards - Neutral
  reference: {
    background: 'bg-white',
    text: 'text-gray-900',
    icon: 'text-primary-600',
    accent: 'bg-gray-100',
    border: 'border border-gray-200',
  },

  // Default card
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-gray-200',
    shadow: 'shadow-sm',
  },
} as const;

// ============================================
// BUTTON VARIANTS
// ============================================
export const buttonVariants = {
  primary: {
    base: 'bg-primary-600 text-white',
    hover: 'hover:bg-primary-700',
    active: 'active:bg-primary-800',
  },
  secondary: {
    base: 'bg-primary-50 text-primary-700',
    hover: 'hover:bg-primary-100',
    active: 'active:bg-primary-200',
  },
  ghost: {
    base: 'bg-transparent text-gray-700',
    hover: 'hover:bg-gray-100',
    active: 'active:bg-gray-200',
  },
  danger: {
    base: 'bg-red-600 text-white',
    hover: 'hover:bg-red-700',
    active: 'active:bg-red-800',
  },
} as const;

// ============================================
// HELPER FUNCTIES
// ============================================

// Combineer classes voor card variant
export function getCardClasses(variant: keyof typeof cardVariants): string {
  const v = cardVariants[variant];
  const classes: string[] = [v.background, v.text];
  if ('border' in v && v.border) classes.push(v.border);
  if ('shadow' in v && v.shadow) classes.push(v.shadow);
  return classes.join(' ');
}

// Combineer classes voor button variant
export function getButtonClasses(variant: keyof typeof buttonVariants): string {
  const v = buttonVariants[variant];
  return `${v.base} ${v.hover} ${v.active}`;
}

// Export alle tokens als één object
export const tokens = {
  colors,
  spacing,
  typography,
  radius,
  shadow,
  layout,
  zIndex,
  transition,
  cardVariants,
  buttonVariants,
} as const;

export default tokens;
