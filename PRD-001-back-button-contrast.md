# PRD-001: Back Button Contrast Fix

## Problem
Back button in recipe modal has poor visibility:
- White/translucent (`bg-white/10 text-white/70`) on green background
- Users struggle to find close/back action
- Accessibility issue (contrast ratio too low)

## Root Cause
`RecipeDetailModal.tsx` line 56-58:
```tsx
className="w-10 h-10 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-all duration-200 flex items-center justify-center flex-shrink-0"
```

## Solution

### Change Required
File: `src/components/RecipeDetailModal.tsx`

**Replace line 56-58:**
```tsx
// BEFORE:
className="w-10 h-10 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-all duration-200 flex items-center justify-center flex-shrink-0"

// AFTER:
className="w-10 h-10 rounded-xl bg-white text-sage-700 hover:bg-white/90 shadow-sm transition-all duration-200 flex items-center justify-center flex-shrink-0"
```

### Changes:
1. `bg-white/10` → `bg-white` (solid background)
2. `text-white/70` → `text-sage-700` (dark icon)
3. `hover:bg-white/20` → `hover:bg-white/90` (subtle hover)
4. Add `shadow-sm` for depth

## Expected Outcome
- High contrast back button (white bg, dark icon)
- Clearly visible against green header
- Maintains rounded design system
- Better accessibility

## Verification
1. Open recipe modal on https://slowcarb-new.vercel.app
2. Verify back button is clearly visible
3. Check hover state works
4. Test on mobile

## Constraints
- 1 file, 1 component, 1 line change
- No functional changes
- Maintain design system consistency

## Time Estimate
< 2 minutes

## Files Changed
- `src/components/RecipeDetailModal.tsx`
