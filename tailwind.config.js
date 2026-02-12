/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ============================================
      // TYPOGRAFIE
      // ============================================
      fontFamily: {
        display: ['Inter', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },

      // ============================================
      // KLEUREN - Design System Tokens
      // ============================================
      colors: {
        // Legacy (backwards compatibility)
        cream: '#FAFAF9',
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c5d8c5',
          300: '#9bbd9b',
          400: '#729c72',
          500: '#527e52',
          600: '#3d623d',
          700: '#314f31',
          800: '#293f29',
          900: '#223422',
        },
        clay: {
          50: '#fbf8f6',
          100: '#f5efe9',
          200: '#eadbc9',
          300: '#dec0a3',
          400: '#d0a07a',
          500: '#c5855a',
          600: '#ba6d48',
          700: '#9a573c',
          800: '#7f4935',
          900: '#663d2d',
        },

        // NEW: Primary (Slow-Carb Green)
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },

        // NEW: Accent (Amber)
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },

        // NEW: Status colors
        status: {
          success: '#22C55E',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        },

        // NEW: Warm gray (beige tint)
        warm: {
          50: '#FAFAF9',
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
      },

      // ============================================
      // SPACING - 8pt Grid
      // ============================================
      spacing: {
        '4.5': '1.125rem', // 18px
        '5.5': '1.375rem', // 22px
        '18': '4.5rem',    // 72px
        '22': '5.5rem',    // 88px
        'safe': '6rem',    // 96px - safe bottom padding
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        'lg': '0.75rem',   // 12px - cards
        'xl': '1rem',      // 16px - large cards
        '2xl': '1.25rem',  // 20px - modals
        '3xl': '1.5rem',   // 24px - hero
      },

      // ============================================
      // SHADOWS
      // ============================================
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08)',
        'elevated': '0 10px 30px rgba(0,0,0,0.12)',
        'soft': '0 2px 8px rgba(0,0,0,0.04)',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
      },

      // ============================================
      // LINE HEIGHT
      // ============================================
      lineHeight: {
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
      },

      // ============================================
      // LETTER SPACING
      // ============================================
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'wide': '0.025em',
        'wider': '0.05em',
      },

      // ============================================
      // Z-INDEX
      // ============================================
      zIndex: {
        'dropdown': '10',
        'sticky': '20',
        'fixed': '30',
        'modal-backdrop': '40',
        'modal': '50',
        'popover': '60',
        'tooltip': '70',
      },

      // ============================================
      // TRANSITION
      // ============================================
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
    },
  },
  plugins: [],
}
